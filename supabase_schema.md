-- ==========================================
-- PRAGATISHIL DATABASE SCHEMA
-- ==========================================
-- Note: This script is designed to be safe to run multiple times. 
-- It skips creating tables if they exist, and safely adds columns/policies.

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name_ne TEXT NOT NULL,
    name_en TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert defaults (Safe to run)
INSERT INTO public.departments (slug, name_ne, name_en, sort_order) VALUES
('organization', 'संगठन विभाग', 'Organization Department', 10),
('finance', 'आर्थिक विभाग', 'Finance Department', 20),
('it', 'सूचना तथा प्रविधि', 'IT Department', 30)
ON CONFLICT (slug) DO NOTHING;


-- 3. Create Members Table
CREATE TABLE IF NOT EXISTS public.members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Capacity/Role
    capacity TEXT NOT NULL CHECK (capacity IN ('party_member', 'volunteer', 'other')),
    
    -- Personal Details
    full_name_ne TEXT NOT NULL,
    full_name_en TEXT,
    gender TEXT CHECK (gender IN ('male', 'female', 'diverse', 'prefer_not_to_say', 'other')),
    
    -- Date of Birth info
    date_of_birth DATE, 
    dob_original TEXT NOT NULL, 
    dob_calendar TEXT NOT NULL CHECK (dob_calendar IN ('AD', 'BS', 'unknown')),
    
    -- Address (Nepali)
    province_ne TEXT,
    district_ne TEXT,
    local_level_ne TEXT,
    address_ne TEXT,
    
    -- Address (English)
    province_en TEXT,
    district_en TEXT,
    local_level_en TEXT,
    address_en TEXT,
    
    -- Contact
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    
    -- Auth
    auth_user_id UUID DEFAULT NULL, 
    
    -- Identity & Profile
    photo_url TEXT,
    citizenship_number TEXT NOT NULL,
    
    -- Party Details
    inspired_by TEXT,
    confidentiality TEXT DEFAULT 'public_ok',
    skills_text TEXT,
    past_affiliations TEXT,
    motivation_text_ne TEXT,
    motivation_text_en TEXT,
    
    -- System Fields
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    meta JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Member Departments (Join Table)
CREATE TABLE IF NOT EXISTS public.member_departments (
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (member_id, department_id)
);

-- 5. Create Member Documents Table
CREATE TABLE IF NOT EXISTS public.member_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    
    doc_type TEXT NOT NULL CHECK (doc_type IN ('citizenship', 'voter_id', 'other')),
    image_url TEXT NOT NULL,
    
    -- AI Extracted Data
    extracted_json JSONB,
    extracted_name_raw TEXT,
    extracted_address_raw TEXT,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_documents ENABLE ROW LEVEL SECURITY;

-- 7. Create Policies (Basic)
-- Drop before creating to avoid "policy already exists" errors
DROP POLICY IF EXISTS "Public departments are viewable" ON public.departments;
CREATE POLICY "Public departments are viewable" ON public.departments
  FOR SELECT USING (is_active = true);


-- ==========================================
-- GENDER & IDENTITY UPDATES
-- ==========================================
-- Safe column additions
ALTER TABLE members ADD COLUMN IF NOT EXISTS gender_code text; 
ALTER TABLE members ADD COLUMN IF NOT EXISTS gender_label_ne text;
ALTER TABLE members ADD COLUMN IF NOT EXISTS gender_label_en text;
ALTER TABLE members ADD COLUMN IF NOT EXISTS gender_raw text; 

ALTER TABLE members ADD COLUMN IF NOT EXISTS inclusion_groups text[]; 
ALTER TABLE members ADD COLUMN IF NOT EXISTS inclusion_groups_ne jsonb; 
ALTER TABLE members ADD COLUMN IF NOT EXISTS inclusion_groups_en jsonb; 
ALTER TABLE members ADD COLUMN IF NOT EXISTS inclusion_raw text; 


-- ==========================================
-- COMMUNITY DISCUSSIONS (PHASE 1)
-- ==========================================

-- 1. Create User Roles Table
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('member', 'party_member', 'central_committee', 'chief_board', 'admin')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Discussion Channels
CREATE TABLE IF NOT EXISTS public.discussion_channels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    visibility TEXT NOT NULL CHECK (visibility IN ('public', 'members', 'party_only', 'central_committee', 'board_only')),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Discussion Threads
CREATE TABLE IF NOT EXISTS public.discussion_threads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    channel_id UUID NOT NULL REFERENCES public.discussion_channels(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    meta JSONB DEFAULT '{}'::jsonb, -- Tags, polls
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES auth.users(id)
);

-- 4. Create Discussion Posts
CREATE TABLE IF NOT EXISTS public.discussion_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    thread_id UUID NOT NULL REFERENCES public.discussion_threads(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id), 
    content TEXT NOT NULL,
    is_anon BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES auth.users(id)
);

-- 5. Moderation Logs
CREATE TABLE IF NOT EXISTS public.moderation_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action TEXT NOT NULL, 
    performed_by UUID NOT NULL REFERENCES auth.users(id),
    target_type TEXT NOT NULL CHECK (target_type IN ('post', 'thread', 'user')),
    target_id UUID NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(uid UUID)
RETURNS TEXT AS $$
DECLARE
  retrieved_role TEXT;
BEGIN
  SELECT role INTO retrieved_role FROM public.user_roles WHERE user_id = uid;
  RETURN retrieved_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==========================================
-- COMMUNITY DISCUSSIONS RLS (PHASE 1 - Legacy)
-- ==========================================

-- Channels Read
DROP POLICY IF EXISTS "Channels: Public read" ON public.discussion_channels;
CREATE POLICY "Channels: Public read" ON public.discussion_channels
    FOR SELECT USING (visibility = 'public');

DROP POLICY IF EXISTS "Channels: Members read" ON public.discussion_channels;
CREATE POLICY "Channels: Members read" ON public.discussion_channels
    FOR SELECT TO authenticated USING (
        visibility = 'members' OR
        visibility = 'public' OR 
        (visibility = 'party_only' AND (SELECT role FROM public.user_roles WHERE user_id = auth.uid()) IN ('party_member', 'central_committee', 'chief_board', 'admin')) OR
        (visibility = 'central_committee' AND (SELECT role FROM public.user_roles WHERE user_id = auth.uid()) IN ('central_committee', 'chief_board', 'admin')) OR
        (visibility = 'board_only' AND (SELECT role FROM public.user_roles WHERE user_id = auth.uid()) IN ('chief_board', 'admin'))
    );

-- Channels Write
DROP POLICY IF EXISTS "Channels: High command create" ON public.discussion_channels;
CREATE POLICY "Channels: High command create" ON public.discussion_channels
    FOR INSERT TO authenticated WITH CHECK (
        (SELECT role FROM public.user_roles WHERE user_id = auth.uid()) IN ('central_committee', 'chief_board', 'admin')
    );


-- ==========================================
-- COMMUNITY DISCUSSIONS (PHASE 2 - ADVANCED)
-- ==========================================

-- 1. Upgrade discussion_channels
ALTER TABLE public.discussion_channels
    ADD COLUMN IF NOT EXISTS name_ne TEXT,
    ADD COLUMN IF NOT EXISTS description_en TEXT,
    ADD COLUMN IF NOT EXISTS description_ne TEXT,
    ADD COLUMN IF NOT EXISTS guidelines_en TEXT,
    ADD COLUMN IF NOT EXISTS guidelines_ne TEXT,
    ADD COLUMN IF NOT EXISTS allow_anonymous_posts BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS min_role_to_post TEXT DEFAULT 'member', -- Note: Check constraint added below
    ADD COLUMN IF NOT EXISTS min_role_to_create_threads TEXT DEFAULT 'member';

-- Safely add/update check constraints
DO $$ BEGIN
    ALTER TABLE public.discussion_channels DROP CONSTRAINT IF EXISTS discussion_channels_min_role_to_post_check;
    ALTER TABLE public.discussion_channels ADD CONSTRAINT discussion_channels_min_role_to_post_check CHECK (min_role_to_post IN ('anonymous', 'member', 'party_member', 'central_committee', 'board', 'admin'));
    
    ALTER TABLE public.discussion_channels DROP CONSTRAINT IF EXISTS discussion_channels_min_role_to_create_threads_check;
    ALTER TABLE public.discussion_channels ADD CONSTRAINT discussion_channels_min_role_to_create_threads_check CHECK (min_role_to_create_threads IN ('anonymous', 'member', 'party_member', 'central_committee', 'board', 'admin'));
    
    ALTER TABLE public.discussion_channels DROP CONSTRAINT IF EXISTS discussion_channels_visibility_check;
    ALTER TABLE public.discussion_channels ADD CONSTRAINT discussion_channels_visibility_check CHECK (visibility IN ('public', 'members', 'logged_in', 'party_only', 'central_committee', 'board_only', 'leadership', 'internal'));
EXCEPTION
    WHEN others THEN NULL; -- Ignore if constraint issues verify manually
END $$;


-- 2. Upgrade discussion_threads
ALTER TABLE public.discussion_threads
    ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS buried_at TIMESTAMPTZ DEFAULT NULL;


-- 3. Upgrade discussion_posts
ALTER TABLE public.discussion_posts
    ADD COLUMN IF NOT EXISTS buried_at TIMESTAMPTZ DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT '{}'::jsonb;


-- 4. Create Flagging System
CREATE TABLE IF NOT EXISTS public.discussion_message_flags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES public.discussion_posts(id) ON DELETE CASCADE,
    flag_type TEXT NOT NULL CHECK (flag_type IN ('vulgar', 'hate', 'spam', 'no_logic', 'off_topic', 'other')),
    flag_reason TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_flags_message_id ON public.discussion_message_flags(message_id);
CREATE INDEX IF NOT EXISTS idx_flags_flag_type ON public.discussion_message_flags(flag_type);

ALTER TABLE public.discussion_message_flags ENABLE ROW LEVEL SECURITY;


-- 5. Updated RLS Policies (Phase 2)

-- FLAGGING RLS
DROP POLICY IF EXISTS "Flags: Create own" ON public.discussion_message_flags;
CREATE POLICY "Flags: Create own" ON public.discussion_message_flags
    FOR INSERT TO public WITH CHECK (
        (auth.role() = 'authenticated' AND created_by = auth.uid()) OR
        (auth.role() = 'anon' AND created_by IS NULL)
    );

DROP POLICY IF EXISTS "Flags: Mods view" ON public.discussion_message_flags;
CREATE POLICY "Flags: Mods view" ON public.discussion_message_flags
    FOR SELECT TO authenticated USING (
        public.get_user_role(auth.uid()) IN ('central_committee', 'chief_board', 'admin')
    );


-- BURYING LOGIC (Update Threads/Posts Access)
-- Remove old policies before recreating
DROP POLICY IF EXISTS "Threads: Visible if channel visible" ON public.discussion_threads;
DROP POLICY IF EXISTS "Posts: Visible if thread visible" ON public.discussion_posts;

-- Re-create Threads Read (Exclude buried)
DROP POLICY IF EXISTS "Threads: Visible (Phase 2)" ON public.discussion_threads;
CREATE POLICY "Threads: Visible (Phase 2)" ON public.discussion_threads
    FOR SELECT USING (
        (buried_at IS NULL OR public.get_user_role(auth.uid()) IN ('central_committee', 'chief_board', 'admin'))
        AND
        EXISTS (
            SELECT 1 FROM public.discussion_channels c
            WHERE c.id = discussion_threads.channel_id
            AND (
                c.visibility = 'public' OR
                (auth.role() = 'authenticated' AND (
                    c.visibility IN ('members', 'logged_in') OR
                    (c.visibility = 'party_only' AND (public.get_user_role(auth.uid()) IN ('party_member', 'central_committee', 'chief_board', 'admin'))) OR
                    (c.visibility IN ('central_committee', 'leadership') AND (public.get_user_role(auth.uid()) IN ('central_committee', 'chief_board', 'admin'))) OR
                    (c.visibility = 'board_only' AND (public.get_user_role(auth.uid()) IN ('chief_board', 'admin')))
                ))
            )
        )
    );

-- Re-create Posts Read (Exclude buried)
DROP POLICY IF EXISTS "Posts: Visible (Phase 2)" ON public.discussion_posts;
CREATE POLICY "Posts: Visible (Phase 2)" ON public.discussion_posts
    FOR SELECT USING (
        (buried_at IS NULL OR public.get_user_role(auth.uid()) IN ('central_committee', 'chief_board', 'admin'))
        AND
        EXISTS (
            SELECT 1 FROM public.discussion_threads t
            JOIN public.discussion_channels c ON c.id = t.channel_id
            WHERE t.id = discussion_posts.thread_id
            AND (
                c.visibility = 'public' OR
                (auth.role() = 'authenticated' AND (
                    c.visibility IN ('members', 'logged_in') OR
                    (c.visibility = 'party_only' AND (public.get_user_role(auth.uid()) IN ('party_member', 'central_committee', 'chief_board', 'admin'))) OR
                    (c.visibility IN ('central_committee', 'leadership') AND (public.get_user_role(auth.uid()) IN ('central_committee', 'chief_board', 'admin'))) OR
                    (c.visibility = 'board_only' AND (public.get_user_role(auth.uid()) IN ('chief_board', 'admin')))
                ))
            )
        )
    );

-- Threads/Posts Write Policies
DROP POLICY IF EXISTS "Threads: Create if channel visible" ON public.discussion_threads;
DROP POLICY IF EXISTS "Threads: Create (Phase 2)" ON public.discussion_threads;
CREATE POLICY "Threads: Create (Phase 2)" ON public.discussion_threads
    FOR INSERT TO authenticated WITH CHECK (
         EXISTS (
             SELECT 1 FROM public.discussion_channels c
             WHERE c.id = channel_id
             AND (
                -- Check Min Role from config
                (c.min_role_to_create_threads = 'member' AND auth.role() = 'authenticated') OR 
                (c.min_role_to_create_threads = 'party_member' AND (public.get_user_role(auth.uid()) IN ('party_member', 'central_committee', 'chief_board', 'admin'))) OR
                (c.min_role_to_create_threads IN ('central_committee', 'leadership') AND (public.get_user_role(auth.uid()) IN ('central_committee', 'chief_board', 'admin')))
             )
        )
    );

DROP POLICY IF EXISTS "Posts: Create if visible" ON public.discussion_posts;
DROP POLICY IF EXISTS "Posts: Create (Phase 2)" ON public.discussion_posts;
CREATE POLICY "Posts: Create (Phase 2)" ON public.discussion_posts
    FOR INSERT TO public WITH CHECK ( -- To allow ANON posts, must be TO PUBLIC
        (
            -- Case 1: Authenticated
            auth.role() = 'authenticated' AND 
            auth.uid() = author_id AND
            EXISTS (
                SELECT 1 FROM public.discussion_threads t
                JOIN public.discussion_channels c ON c.id = t.channel_id
                WHERE t.id = thread_id
                AND c.min_role_to_post IN ('member', 'anonymous') -- Simplified check
            )
        ) OR (
            -- Case 2: Anonymous
            auth.role() = 'anon' AND 
            author_id IS NULL AND
            EXISTS (
                SELECT 1 FROM public.discussion_threads t
                JOIN public.discussion_channels c ON c.id = t.channel_id
                WHERE t.id = thread_id
                AND c.allow_anonymous_posts = true
            )
        )
    );
