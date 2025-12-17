-- 1. ENUMS & TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'anonymous_visitor', 'supporter', 'party_member', 'team_member', 'central_committee', 'admin_party', 'admin_tech'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE action_type AS ENUM (
        'CREATE_CHANNEL', 'UPDATE_CHANNEL', 'DELETE_CHANNEL',
        'BAN_USER', 'UNBAN_USER',
        'HIDE_POST', 'RESTORE_POST',
        'UPDATE_ROLE',
        'ROTATE_VETO',
        'UPDATE_SETTINGS'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE flag_reason AS ENUM (
        'vulgar', 'hate_speech', 'spam', 'off_topic', 'misinformation', 'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE channel_visibility AS ENUM (
        'public', 'logged_in', 'party_only', 'leadership', 'internal'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. UPDATE PROFILES
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'supporter',
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS expertise TEXT[],
ADD COLUMN IF NOT EXISTS contact_email_public TEXT,
ADD COLUMN IF NOT EXISTS contact_phone_public TEXT,
ADD COLUMN IF NOT EXISTS banned_until TIMESTAMPTZ;

-- 3. ADMIN COUNCIL & VETO
CREATE TABLE IF NOT EXISTS admin_council_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_veto_holder BOOLEAN DEFAULT false,
    term_start TIMESTAMPTZ DEFAULT now(),
    term_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure only one veto holder at a time among active members
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_veto_holder 
ON admin_council_members (is_veto_holder) 
WHERE is_veto_holder = true AND is_active = true;

-- 4. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action_type action_type NOT NULL,
    target_type TEXT NOT NULL, -- 'profile', 'channel', 'post', etc.
    target_id TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. DISCUSSION FLAGS
CREATE TABLE IF NOT EXISTS discussion_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_type TEXT NOT NULL DEFAULT 'post', -- 'post' or 'comment'
    target_id UUID NOT NULL, -- Can refer to post or comment ID (application logic handles FK mostly, or we can make separate tables)
    flagged_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reason flag_reason NOT NULL,
    resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. UPDATE DISCUSSION CHANNELS
-- Drop policies that depend on the column to be altered
DROP POLICY IF EXISTS "Channels: Public read" ON discussion_channels;
DROP POLICY IF EXISTS "Channels: Members read" ON discussion_channels;
DROP POLICY IF EXISTS "Channels: High command create" ON discussion_channels;
-- Also drop dependent policies on other tables that reference channel visibility
-- Also drop dependent policies on other tables that reference channel visibility
DROP POLICY IF EXISTS "Threads: Visible (Phase 2)" ON discussion_threads;
DROP POLICY IF EXISTS "Posts: Visible (Phase 2)" ON discussion_posts;
-- Drop LEGACY policies that might exist and cause type errors
DROP POLICY IF EXISTS "Threads: Visible if channel visible" ON discussion_threads;
DROP POLICY IF EXISTS "Posts: Visible if thread visible" ON discussion_posts;

-- CRITICAL: Drop CHECK constraint on visibility if it exists (schema.md suggests it does)
ALTER TABLE discussion_channels DROP CONSTRAINT IF EXISTS discussion_channels_visibility_check;

ALTER TABLE discussion_channels
-- Add bilingual fields
ADD COLUMN IF NOT EXISTS name_ne TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_ne TEXT,
ADD COLUMN IF NOT EXISTS guidelines_en TEXT,
ADD COLUMN IF NOT EXISTS guidelines_ne TEXT,
-- Update visibility to use enum
-- Update visibility to use enum:
ALTER COLUMN visibility TYPE channel_visibility USING (
    CASE visibility::text
        WHEN 'members' THEN 'logged_in'::channel_visibility
        WHEN 'central_committee' THEN 'leadership'::channel_visibility
        WHEN 'board_only' THEN 'leadership'::channel_visibility
        -- If it's already a valid enum value string, cast it
        ELSE visibility::channel_visibility
    END
),
-- Add controls
ADD COLUMN IF NOT EXISTS allow_anonymous_posts BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS min_role_to_post user_role DEFAULT 'supporter',
ADD COLUMN IF NOT EXISTS min_role_to_create_threads user_role DEFAULT 'supporter',
ADD COLUMN IF NOT EXISTS min_role_to_comment user_role DEFAULT 'supporter',
ADD COLUMN IF NOT EXISTS min_role_to_vote user_role DEFAULT 'party_member';

-- Re-create Channel Policies (Updated for Enum)
CREATE POLICY "Channels: Public read" ON discussion_channels
    FOR SELECT USING (visibility = 'public'::channel_visibility);

CREATE POLICY "Channels: Members read" ON discussion_channels
    FOR SELECT TO authenticated USING (
        visibility = 'public'::channel_visibility OR 
        visibility = 'logged_in'::channel_visibility OR
        (visibility = 'party_only'::channel_visibility AND (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('party_member', 'central_committee', 'admin_party', 'admin_tech')))) OR
        (visibility = 'leadership'::channel_visibility AND (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('central_committee', 'admin_party', 'admin_tech')))) OR
        (visibility = 'internal'::channel_visibility AND (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin_party', 'admin_tech'))))
    );

-- 7. UPDATE THREADS & POSTS
ALTER TABLE discussion_threads
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS buried_at TIMESTAMPTZ;

ALTER TABLE discussion_posts
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS buried_at TIMESTAMPTZ;

-- 8. ENABLE RLS
ALTER TABLE admin_council_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_flags ENABLE ROW LEVEL SECURITY;


-- Re-create Thread/Post Policies (Updated for Enums)
DROP POLICY IF EXISTS "Threads: Visible (Phase 2)" ON discussion_threads;
CREATE POLICY "Threads: Visible (Phase 2)" ON discussion_threads
    FOR SELECT USING (
        (buried_at IS NULL OR (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('central_committee', 'admin_party', 'admin_tech'))))
        AND
        EXISTS (
            SELECT 1 FROM discussion_channels c
            WHERE c.id = discussion_threads.channel_id
            AND (
                c.visibility = 'public'::channel_visibility OR
                (auth.role() = 'authenticated' AND (
                    c.visibility = 'logged_in'::channel_visibility OR
                    (c.visibility = 'party_only'::channel_visibility AND (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('party_member', 'central_committee', 'admin_party', 'admin_tech')))) OR
                    (c.visibility = 'leadership'::channel_visibility AND (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('central_committee', 'admin_party', 'admin_tech')))) OR
                    (c.visibility = 'internal'::channel_visibility AND (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin_party', 'admin_tech'))))
                ))
            )
        )
    );

DROP POLICY IF EXISTS "Posts: Visible (Phase 2)" ON discussion_posts;
CREATE POLICY "Posts: Visible (Phase 2)" ON discussion_posts
    FOR SELECT USING (
        (buried_at IS NULL OR (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('central_committee', 'admin_party', 'admin_tech'))))
        AND
        EXISTS (
            SELECT 1 FROM discussion_threads t
            JOIN discussion_channels c ON c.id = t.channel_id
            WHERE t.id = discussion_posts.thread_id
            AND (
                c.visibility = 'public'::channel_visibility OR
                (auth.role() = 'authenticated' AND (
                    c.visibility = 'logged_in'::channel_visibility OR
                    (c.visibility = 'party_only'::channel_visibility AND (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('party_member', 'central_committee', 'admin_party', 'admin_tech')))) OR
                    (c.visibility = 'leadership'::channel_visibility AND (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('central_committee', 'admin_party', 'admin_tech')))) OR
                    (c.visibility = 'internal'::channel_visibility AND (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin_party', 'admin_tech'))))
                ))
            )
        )
    );

-- 9. RLS POLICIES (Basic Draft - Refine in permissions.ts enforcement mostly, but DB is backup)

-- PROFILES:
-- Public can read public profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (is_public = true);

-- Users can update own profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- ADMIN COUNCIL:
-- Visible to authenticated users (transparency)
CREATE POLICY "Council visible to members" 
ON admin_council_members FOR SELECT TO authenticated USING (true);

-- Only Admins can insert/update (This requires a recursive check or trusted service role in practice. 
-- For simplicity here, we assume service role usage for admin actions OR we implement a secure function.
-- Let's leave Admin WRITE policies for now as strictly Service Role or restricted by function.)

-- AUDIT LOGS:
-- Only Admins can select (Strict)
-- We need a way to check if user is admin in SQL.
-- CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING ( ... ); 
-- Complex without helper function. For now: Service Role or specific logic.

