-- Migration: Harden RLS & Roles for Commune
-- Description: Robust RLS policies for channels and resources based on strict role hierarchy.

BEGIN;

--------------------------------------------------------------------------------
-- 1. Helper Functions
--------------------------------------------------------------------------------

-- Helper: Get user role from profiles (Safe, falls back to 'guest' concept if needed, though strictly we return text)
-- Note: We match the parameter name 'uid' to existing schema to avoid conflict without dropping dependencies.
CREATE OR REPLACE FUNCTION public.get_user_role(uid uuid)
RETURNS text AS $$
  SELECT role::text
  FROM public.profiles
  WHERE id = uid;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: Check if user has access to a specific channel visibility
-- Concepts:
-- 'public' -> All (Anon + Auth)
-- 'logged_in' -> Auth only (any role)
-- 'party_only' -> party_member, team_member, central_committee, board, admin_party, yantrik, admin
-- 'leadership' -> central_committee, board, admin_party, yantrik, admin
-- 'internal' -> Same as leadership for now (or strictly internal team, but mapping to leadership for safety)

CREATE OR REPLACE FUNCTION public.has_channel_access(channel_vis channel_visibility)
RETURNS boolean AS $$
DECLARE
  ur text;
BEGIN
  -- 1. Public is always true
  IF channel_vis = 'public' THEN
    RETURN true;
  END IF;

  -- 2. Check Authentication
  IF auth.role() = 'anon' THEN
    RETURN false;
  END IF;

  -- 3. Logged In -> True if Auth (Google Member / Supporter)
  IF channel_vis = 'logged_in' THEN
    RETURN true;
  END IF;

  -- 4. Fetch Role
  SELECT public.get_user_role(auth.uid()) INTO ur;

  -- 5. Party Only
  IF channel_vis = 'party_only' THEN
    RETURN ur IN ('party_member', 'team_member', 'central_committee', 'board', 'admin_party', 'yantrik', 'admin');
  END IF;

  -- 6. Leadership / Internal
  IF channel_vis IN ('leadership', 'internal') THEN
    RETURN ur IN ('central_committee', 'board', 'admin_party', 'yantrik', 'admin');
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;


--------------------------------------------------------------------------------
-- 2. Discussion Channels RLS
--------------------------------------------------------------------------------

ALTER TABLE public.discussion_channels ENABLE ROW LEVEL SECURITY;

-- Drop Old Policies (Aggressive cleanup)
DROP POLICY IF EXISTS "Channels Select Policy" ON public.discussion_channels;
DROP POLICY IF EXISTS "Admins can manage channels" ON public.discussion_channels;
DROP POLICY IF EXISTS "Channels: Public read" ON public.discussion_channels;
DROP POLICY IF EXISTS "Channels: Members read" ON public.discussion_channels;
DROP POLICY IF EXISTS "Public channels are viewable by everyone" ON public.discussion_channels;
DROP POLICY IF EXISTS "Admins can insert channels" ON public.discussion_channels;
DROP POLICY IF EXISTS "Admins can update channels" ON public.discussion_channels;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.discussion_channels;

-- Policy: SELECT
CREATE POLICY "Channels Select Policy" ON public.discussion_channels
    FOR SELECT
    USING (public.has_channel_access(visibility));

-- Policy: INSERT / UPDATE / DELETE (Admins Only)
-- Defined as: admin, admin_party, yantrik, central_committee, board
CREATE POLICY "Channels Manage Policy" ON public.discussion_channels
    FOR ALL
    USING (
        auth.role() = 'authenticated' AND 
        public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik', 'central_committee', 'board')
    );


--------------------------------------------------------------------------------
-- 3. Discussion Channel Resources RLS
--------------------------------------------------------------------------------

ALTER TABLE public.discussion_channel_resources ENABLE ROW LEVEL SECURITY;

-- Drop Old Policies
DROP POLICY IF EXISTS "Resources Select Policy" ON public.discussion_channel_resources;
DROP POLICY IF EXISTS "Admins can manage resources" ON public.discussion_channel_resources;
DROP POLICY IF EXISTS "Authenticated users can view resources" ON public.discussion_channel_resources;
DROP POLICY IF EXISTS "Everyone can view public channel resources" ON public.discussion_channel_resources;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.discussion_channel_resources;

-- Policy: SELECT (Inherit from Channel)
CREATE POLICY "Resources Select Policy" ON public.discussion_channel_resources
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.discussion_channels c
            WHERE c.id = channel_id
            AND public.has_channel_access(c.visibility)
        )
    );

-- Policy: INSERT / UPDATE / DELETE (Admins Only)
CREATE POLICY "Resources Manage Policy" ON public.discussion_channel_resources
    FOR ALL
    USING (
        auth.role() = 'authenticated' AND 
        public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik', 'central_committee', 'board')
    );

COMMIT;
