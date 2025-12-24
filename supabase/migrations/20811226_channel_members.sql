-- ================================================
-- Channel Membership System
-- Private channels, role-based broadcasts, auto-assignment
-- ================================================

-- 1. Add access_type and related columns to discussion_channels
ALTER TABLE discussion_channels
ADD COLUMN IF NOT EXISTS access_type TEXT DEFAULT 'public',
ADD COLUMN IF NOT EXISTS min_role_level INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS location_scope TEXT; -- 'state', 'district', 'municipality', 'ward', 'department', NULL

-- Index for efficient filtering
CREATE INDEX IF NOT EXISTS idx_channels_access_type ON discussion_channels(access_type);

-- 2. Create channel_members table
CREATE TABLE IF NOT EXISTS public.channel_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    channel_id UUID NOT NULL REFERENCES discussion_channels(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('viewer', 'member', 'moderator', 'admin')),
    added_by UUID REFERENCES auth.users(id),
    added_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure unique membership
    UNIQUE(channel_id, user_id)
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_channel_members_channel ON channel_members(channel_id);
CREATE INDEX IF NOT EXISTS idx_channel_members_user ON channel_members(user_id);

-- 3. Add department field to profiles if not exists
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS department TEXT;

-- 4. Enable RLS
ALTER TABLE channel_members ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for channel_members

-- Users can see their own memberships
DROP POLICY IF EXISTS "Users can view own memberships" ON channel_members;
CREATE POLICY "Users can view own memberships" ON channel_members
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

-- Channel admins can view all members of their channels
DROP POLICY IF EXISTS "Channel admins can view channel members" ON channel_members;
CREATE POLICY "Channel admins can view channel members" ON channel_members
    FOR SELECT TO authenticated
    USING (
        channel_id IN (
            SELECT channel_id FROM channel_members 
            WHERE user_id = auth.uid() AND role IN ('moderator', 'admin')
        )
    );

-- Global admins can view all
DROP POLICY IF EXISTS "Admins can view all memberships" ON channel_members;
CREATE POLICY "Admins can view all memberships" ON channel_members
    FOR SELECT TO authenticated
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'yantrik', 'admin_party'))
    );

-- Admins can manage memberships
DROP POLICY IF EXISTS "Admins can manage memberships" ON channel_members;
CREATE POLICY "Admins can manage memberships" ON channel_members
    FOR ALL TO authenticated
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'yantrik', 'admin_party'))
    );

-- Channel moderators can add/remove members
DROP POLICY IF EXISTS "Channel moderators can manage members" ON channel_members;
CREATE POLICY "Channel moderators can manage members" ON channel_members
    FOR ALL TO authenticated
    USING (
        channel_id IN (
            SELECT channel_id FROM channel_members 
            WHERE user_id = auth.uid() AND role IN ('moderator', 'admin')
        )
    );

-- 6. Function to check if user can access a channel
CREATE OR REPLACE FUNCTION can_access_channel(p_channel_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_channel RECORD;
    v_user RECORD;
BEGIN
    -- Get channel info
    SELECT access_type, min_role_level, location_scope, visibility 
    INTO v_channel
    FROM discussion_channels 
    WHERE id = p_channel_id;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    -- Public channels: everyone can access
    IF v_channel.access_type = 'public' OR v_channel.visibility::TEXT = 'public' THEN
        RETURN TRUE;
    END IF;

    -- Check if user is logged in
    IF p_user_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Get user info
    SELECT role, state, district, municipality, ward, department 
    INTO v_user
    FROM profiles 
    WHERE id = p_user_id;

    -- Members-only: any logged in user
    IF v_channel.access_type = 'members' THEN
        RETURN TRUE;
    END IF;

    -- Role-based: check role level
    IF v_channel.access_type = 'role_based' THEN
        -- Get user's role level from role_levels table
        DECLARE
            v_user_level INT;
        BEGIN
            SELECT level INTO v_user_level 
            FROM role_levels 
            WHERE key = v_user.role;
            
            RETURN COALESCE(v_user_level, 0) >= COALESCE(v_channel.min_role_level, 0);
        END;
    END IF;

    -- Private: check explicit membership
    IF v_channel.access_type = 'private' THEN
        RETURN EXISTS (
            SELECT 1 FROM channel_members 
            WHERE channel_id = p_channel_id AND user_id = p_user_id
        );
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Update existing channels to maintain backward compatibility
-- Cast visibility to TEXT to handle enum type
UPDATE discussion_channels
SET access_type = CASE
    WHEN visibility::TEXT = 'public' THEN 'public'
    WHEN visibility::TEXT = 'logged_in' THEN 'members'
    WHEN visibility::TEXT IN ('party_only', 'central_committee', 'board_only', 'leadership', 'internal') THEN 'role_based'
    ELSE 'public'
END
WHERE access_type IS NULL OR access_type = 'public';

-- Set min_role_level for role_based channels
UPDATE discussion_channels
SET min_role_level = CASE
    WHEN visibility::TEXT = 'party_only' THEN 2  -- ward_committee+
    WHEN visibility::TEXT = 'central_committee' THEN 6
    WHEN visibility::TEXT = 'board_only' THEN 9  -- advisor_board
    WHEN visibility::TEXT = 'leadership' THEN 6  -- central_committee+
    WHEN visibility::TEXT = 'internal' THEN 8    -- admin_panel+
    ELSE 0
END
WHERE access_type = 'role_based';

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
