-- MASTER FIX MIGRATION (V2 - COMPLETE)
-- Run this single file to fix RLS, Missing Columns, Foreign Keys, and Views.

BEGIN;

--------------------------------------------------------------------------------
-- 1. FIX RLS HELPER FUNCTION (Ensure 'logged_in' works)
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_user_role(uid uuid)
RETURNS text AS $$
  SELECT role::text
  FROM public.profiles
  WHERE id = uid;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.has_channel_access(channel_vis public.channel_visibility)
RETURNS boolean AS $$
DECLARE
  ur text;
BEGIN
  IF channel_vis = 'public' THEN
    RETURN true;
  END IF;

  IF auth.role() = 'anon' THEN
    RETURN false;
  END IF;

  -- CRITICAL: Allow any authenticated user for 'logged_in'
  IF channel_vis = 'logged_in' THEN
    RETURN true;
  END IF;

  -- Fetch Role
  SELECT public.get_user_role(auth.uid()) INTO ur;

  IF channel_vis = 'party_only' THEN
    RETURN ur IN ('party_member', 'team_member', 'central_committee', 'board', 'admin_party', 'yantrik', 'admin');
  END IF;

  IF channel_vis IN ('leadership', 'internal', 'central_committee') THEN
    RETURN ur IN ('central_committee', 'board', 'admin_party', 'yantrik', 'admin');
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

--------------------------------------------------------------------------------
-- 2. FIX PROFILES TABLE (Missing Columns)
--------------------------------------------------------------------------------
DO $$ 
BEGIN 
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT; 
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ 
BEGIN 
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT; 
EXCEPTION WHEN OTHERS THEN NULL; END $$;

--------------------------------------------------------------------------------
-- 3. FIX FOREIGN KEYS (Threads -> Profiles)
--------------------------------------------------------------------------------
ALTER TABLE public.discussion_threads DROP CONSTRAINT IF EXISTS fk_thread_author_profile;
ALTER TABLE public.discussion_posts DROP CONSTRAINT IF EXISTS fk_post_author_profile;

ALTER TABLE public.discussion_threads
ADD CONSTRAINT fk_thread_author_profile
FOREIGN KEY (created_by)
REFERENCES public.profiles (id)
ON DELETE SET NULL;

ALTER TABLE public.discussion_posts
ADD CONSTRAINT fk_post_author_profile
FOREIGN KEY (author_id)
REFERENCES public.profiles (id)
ON DELETE SET NULL;

--------------------------------------------------------------------------------
-- 4. FIX THREAD VIEW (Missing Columns)
--------------------------------------------------------------------------------
DROP VIEW IF EXISTS thread_overviews;

CREATE OR REPLACE VIEW thread_overviews AS
SELECT 
    t.id,
    t.channel_id,
    t.title,
    t.created_at,
    t.created_by,
    t.is_anonymous,
    t.buried_at,
    t.summary,
    t.meta,
    t.updated_at,
    p.full_name as author_name,
    p.avatar_url as author_avatar,
    p.role as author_role,
    (SELECT count(*) FROM discussion_posts p WHERE p.thread_id = t.id) as total_posts,
    (SELECT id FROM discussion_posts p2 WHERE p2.thread_id = t.id ORDER BY created_at ASC LIMIT 1) as first_post_id,
    (SELECT content FROM discussion_posts p2 WHERE p2.thread_id = t.id ORDER BY created_at ASC LIMIT 1) as first_post_content,
    (SELECT count(*) FROM discussion_votes v WHERE v.post_id = (SELECT id FROM discussion_posts p2 WHERE p2.thread_id = t.id ORDER BY created_at ASC LIMIT 1) AND v.vote_type = 1) as upvotes,
    (SELECT count(*) FROM discussion_votes v WHERE v.post_id = (SELECT id FROM discussion_posts p2 WHERE p2.thread_id = t.id ORDER BY created_at ASC LIMIT 1) AND v.vote_type = -1) as downvotes
FROM discussion_threads t
LEFT JOIN profiles p ON t.created_by = p.id
WHERE t.deleted_at IS NULL;

GRANT SELECT ON thread_overviews TO authenticated;
GRANT SELECT ON thread_overviews TO anon;

COMMIT;
