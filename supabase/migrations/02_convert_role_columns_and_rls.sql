-- 02_convert_role_columns_and_rls.sql
-- Phase 2: Column Normalization, Helper Functions, and RLS Restoration
-- PREREQUISITE: Phase 1 (Enum Maintenance) must be COMMITTED first.

--------------------------------------------------------------------------------
-- 0. PREPARATION: DROP DEPENDENT VIEWS & FUNCTIONS
--------------------------------------------------------------------------------
DROP VIEW IF EXISTS public.thread_overviews;
DROP FUNCTION IF EXISTS public.has_channel_access(channel_visibility) CASCADE;
DROP FUNCTION IF EXISTS public.has_channel_access(public.channel_visibility) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_role(uuid) CASCADE;

--------------------------------------------------------------------------------
-- 1. DROP ALL DEPENDENT POLICIES
--------------------------------------------------------------------------------

-- Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Site Settings
DROP POLICY IF EXISTS "Admin write access settings" ON site_settings;

-- News Items
DROP POLICY IF EXISTS "Admin write access news" ON news_items;

-- Media Gallery
DROP POLICY IF EXISTS "Admin write access media" ON media_gallery;

-- Discussion Channels
DROP POLICY IF EXISTS "Channels Select Policy" ON discussion_channels;
DROP POLICY IF EXISTS "Channels Manage Policy" ON discussion_channels;

-- Discussion Channel Resources
DROP POLICY IF EXISTS "Resources: View" ON discussion_channel_resources;
DROP POLICY IF EXISTS "Resources: Manage" ON discussion_channel_resources;
DROP POLICY IF EXISTS "Resources Select Policy" ON discussion_channel_resources;
DROP POLICY IF EXISTS "Resources Manage Policy" ON discussion_channel_resources;

-- Threads
DROP POLICY IF EXISTS "Threads Select Policy" ON discussion_threads;
DROP POLICY IF EXISTS "Threads Insert Policy" ON discussion_threads;
DROP POLICY IF EXISTS "Threads Update Policy" ON discussion_threads;
DROP POLICY IF EXISTS "Threads: Visible (Phase 2)" ON discussion_threads;
DROP POLICY IF EXISTS "Threads: Soft delete own or mod" ON discussion_threads;
DROP POLICY IF EXISTS "Threads: Create (Phase 3 - Ban Aware)" ON discussion_threads;

-- Posts
DROP POLICY IF EXISTS "Posts Select Policy" ON discussion_posts;
DROP POLICY IF EXISTS "Posts Insert Policy" ON discussion_posts;
DROP POLICY IF EXISTS "Posts Update Policy" ON discussion_posts;
DROP POLICY IF EXISTS "Posts: Visible (Phase 2)" ON discussion_posts;
DROP POLICY IF EXISTS "Posts: Update/Delete own or mod" ON discussion_posts;
DROP POLICY IF EXISTS "Posts: Create (Phase 3 - Ban Aware)" ON discussion_posts;

-- Attachments
DROP POLICY IF EXISTS "View Attachments" ON discussion_post_attachments;
DROP POLICY IF EXISTS "Manage Attachments" ON discussion_post_attachments;
DROP POLICY IF EXISTS "Upload Attachments" ON discussion_post_attachments;

-- Flags
DROP POLICY IF EXISTS "Admins can view flags" ON discussion_flags;
DROP POLICY IF EXISTS "Admins can resolve flags" ON discussion_flags;
DROP POLICY IF EXISTS "Flags: Create own" ON discussion_message_flags;
DROP POLICY IF EXISTS "Flags: Mods view" ON discussion_message_flags;

-- Audit Logs
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;

-- Storage
DROP POLICY IF EXISTS "Auth Users Upload" ON storage.objects;
DROP POLICY IF EXISTS "Auth Users Delete" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

--------------------------------------------------------------------------------
-- 2. DROP OBSOLETE CONSTRAINTS
--------------------------------------------------------------------------------
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;
ALTER TABLE public.discussion_channels DROP CONSTRAINT IF EXISTS discussion_channels_min_role_to_post_check;
ALTER TABLE public.discussion_channels DROP CONSTRAINT IF EXISTS discussion_channels_min_role_to_create_threads_check;

--------------------------------------------------------------------------------
-- 3. NORMALIZE & CONVERT COLUMNS TO ENUM
--------------------------------------------------------------------------------

-- Helper for mapping data normalization
CREATE OR REPLACE FUNCTION public.map_role_canonical(t TEXT)
RETURNS user_role AS $$
BEGIN
    RETURN CASE 
        WHEN t IN ('supporter', 'user', 'member') THEN 'member'::user_role
        WHEN t IN ('anonymous_visitor', 'guest', 'anonymous') THEN 'guest'::user_role
        WHEN t IN ('admin_tech', 'yantrik') THEN 'yantrik'::user_role
        WHEN t IN ('chief_board', 'board') THEN 'board'::user_role
        WHEN t = 'admin' THEN 'admin'::user_role
        WHEN t = 'party_member' THEN 'party_member'::user_role
        WHEN t = 'volunteer' THEN 'volunteer'::user_role
        WHEN t = 'team_member' THEN 'team_member'::user_role
        WHEN t = 'central_committee' THEN 'central_committee'::user_role
        WHEN t = 'admin_party' THEN 'admin_party'::user_role
        ELSE 'member'::user_role
    END;
END;
$$ LANGUAGE plpgsql;

-- 3A. profiles.role (TEXT -> user_role)
ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;
UPDATE public.profiles SET role = 'member' WHERE role = 'user'; -- Specific mapping
UPDATE public.profiles SET role = map_role_canonical(role);
ALTER TABLE public.profiles ALTER COLUMN role TYPE user_role USING role::user_role;
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'member'::user_role;

-- 3B. user_roles.role (TEXT -> user_role)
ALTER TABLE public.user_roles ALTER COLUMN role DROP DEFAULT;
UPDATE public.user_roles SET role = map_role_canonical(role);
ALTER TABLE public.user_roles ALTER COLUMN role TYPE user_role USING role::user_role;
ALTER TABLE public.user_roles ALTER COLUMN role SET DEFAULT 'member'::user_role;

-- 3C. discussion_channels (Mixed -> user_role)
-- min_role_to_post
ALTER TABLE public.discussion_channels ALTER COLUMN min_role_to_post DROP DEFAULT;
UPDATE public.discussion_channels SET min_role_to_post = map_role_canonical(min_role_to_post);
ALTER TABLE public.discussion_channels ALTER COLUMN min_role_to_post TYPE user_role USING min_role_to_post::user_role;
ALTER TABLE public.discussion_channels ALTER COLUMN min_role_to_post SET DEFAULT 'member'::user_role;

-- min_role_to_create_threads
ALTER TABLE public.discussion_channels ALTER COLUMN min_role_to_create_threads DROP DEFAULT;
UPDATE public.discussion_channels SET min_role_to_create_threads = map_role_canonical(min_role_to_create_threads);
ALTER TABLE public.discussion_channels ALTER COLUMN min_role_to_create_threads TYPE user_role USING min_role_to_create_threads::user_role;
ALTER TABLE public.discussion_channels ALTER COLUMN min_role_to_create_threads SET DEFAULT 'member'::user_role;

-- min_role_to_comment (already enum, but force mapping if needed and update default)
UPDATE public.discussion_channels SET min_role_to_comment = map_role_canonical(min_role_to_comment::text);
ALTER TABLE public.discussion_channels ALTER COLUMN min_role_to_comment SET DEFAULT 'member'::user_role;

-- min_role_to_vote (already enum, update default)
UPDATE public.discussion_channels SET min_role_to_vote = map_role_canonical(min_role_to_vote::text);
ALTER TABLE public.discussion_channels ALTER COLUMN min_role_to_vote SET DEFAULT 'party_member'::user_role;

DROP FUNCTION public.map_role_canonical(TEXT);

--------------------------------------------------------------------------------
-- 4. RECREATE HELPER FUNCTIONS (OPTIMIZED)
--------------------------------------------------------------------------------

-- get_user_role: Returns the canonical user_role enum with correct fallback logic
CREATE OR REPLACE FUNCTION public.get_user_role(uid uuid)
RETURNS user_role AS $$
  SELECT COALESCE(
    (SELECT role FROM public.user_roles WHERE user_id = uid),
    (SELECT role FROM public.profiles WHERE id = uid),
    'guest'::user_role
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- has_channel_access: Encapsulates the visibility logic
CREATE OR REPLACE FUNCTION public.has_channel_access(channel_vis channel_visibility)
RETURNS boolean AS $$
DECLARE
  ur user_role;
BEGIN
  -- 1. Public is always true
  IF channel_vis = 'public' THEN RETURN true; END IF;
  
  -- 2. Non-public requires authentication
  IF auth.role() = 'anon' THEN RETURN false; END IF;
  
  -- 3. Logged-in is true if authenticated
  IF channel_vis = 'logged_in' THEN RETURN true; END IF;
  
  -- 4. Fetch the user's role
  SELECT public.get_user_role(auth.uid()) INTO ur;
  
  -- 5. Party Only visibility
  IF channel_vis = 'party_only' THEN
    RETURN ur IN ('party_member', 'team_member', 'central_committee', 'board', 'admin_party', 'yantrik', 'admin');
  END IF;
  
  -- 6. Leadership/Internal/Central Committee/Board Only visibility
  IF channel_vis IN ('leadership', 'internal', 'central_committee', 'board_only') THEN
    RETURN ur IN ('central_committee', 'board', 'admin_party', 'yantrik', 'admin');
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

--------------------------------------------------------------------------------
-- 5. RECREATE RLS POLICIES (MERGED & ROBUST)
--------------------------------------------------------------------------------

-- PROFILES
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE TO authenticated
    USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik', 'board'))
    WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik', 'board'));

-- SITE SETTINGS
CREATE POLICY "Admin write access settings" ON public.site_settings FOR ALL USING (
    auth.role() = 'authenticated' AND 
    public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik')
);

-- NEWS ITEMS
CREATE POLICY "Admin write access news" ON public.news_items FOR ALL USING (
    auth.role() = 'authenticated' AND 
    public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik')
);

-- MEDIA GALLERY
CREATE POLICY "Admin write access media" ON public.media_gallery FOR ALL USING (
    auth.role() = 'authenticated' AND 
    public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik')
);

-- DISCUSSION CHANNELS
CREATE POLICY "Channels Select Policy" ON public.discussion_channels FOR SELECT USING (public.has_channel_access(visibility));
CREATE POLICY "Channels Manage Policy" ON public.discussion_channels FOR ALL USING (
    auth.role() = 'authenticated' AND 
    public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik', 'central_committee', 'board')
);

-- DISCUSSION CHANNEL RESOURCES
CREATE POLICY "Resources: View" ON public.discussion_channel_resources FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.discussion_channels c WHERE c.id = channel_id AND public.has_channel_access(c.visibility))
);
CREATE POLICY "Resources: Manage" ON public.discussion_channel_resources FOR ALL USING (
    auth.role() = 'authenticated' AND 
    public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik', 'central_committee', 'board')
);

-- THREADS (Merged SELECT policy for visibility and bury logic)
CREATE POLICY "Threads Select Policy" ON public.discussion_threads
    FOR SELECT
    USING (
      EXISTS (SELECT 1 FROM public.discussion_channels c WHERE c.id = channel_id AND public.has_channel_access(c.visibility))
      AND (buried_at IS NULL OR public.get_user_role(auth.uid()) IN ('central_committee', 'admin_party', 'yantrik', 'admin', 'board'))
    );

CREATE POLICY "Threads Insert Policy" ON public.discussion_threads
    FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated' AND 
        (SELECT is_banned FROM public.profiles WHERE id = auth.uid()) = false AND
        EXISTS (SELECT 1 FROM public.discussion_channels c WHERE c.id = channel_id AND public.has_channel_access(c.visibility))
    );

CREATE POLICY "Threads Update Policy" ON public.discussion_threads
    FOR UPDATE
    USING (
        auth.role() = 'authenticated' AND (
            created_by = auth.uid() OR 
            public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik', 'central_committee', 'board')
        )
    );

-- POSTS (Merged SELECT policy for visibility and bury logic)
CREATE POLICY "Posts Select Policy" ON public.discussion_posts
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.discussion_threads t 
        JOIN public.discussion_channels c ON c.id = t.channel_id 
        WHERE t.id = thread_id AND public.has_channel_access(c.visibility)
      )
      AND (buried_at IS NULL OR public.get_user_role(auth.uid()) IN ('central_committee', 'admin_party', 'yantrik', 'admin', 'board'))
    );

CREATE POLICY "Posts Insert Policy" ON public.discussion_posts
    FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated' AND 
        (SELECT is_banned FROM public.profiles WHERE id = auth.uid()) = false AND
        EXISTS (SELECT 1 FROM public.discussion_threads t JOIN public.discussion_channels c ON c.id = t.channel_id WHERE t.id = thread_id AND public.has_channel_access(c.visibility))
    );

CREATE POLICY "Posts Update Policy" ON public.discussion_posts
    FOR UPDATE
    USING (
        auth.role() = 'authenticated' AND (
            author_id = auth.uid() OR 
            public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik', 'central_committee', 'board')
        )
    );

-- ATTACHMENTS
CREATE POLICY "View Attachments" ON public.discussion_post_attachments
    FOR SELECT
    USING (
        (post_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.discussion_posts p
            JOIN public.discussion_threads t ON t.id = p.thread_id
            JOIN public.discussion_channels c ON c.id = t.channel_id
            WHERE p.id = discussion_post_attachments.post_id AND public.has_channel_access(c.visibility)
        ))
        OR (post_id IS NULL AND auth.uid() = created_by)
    );

CREATE POLICY "Manage Attachments" ON public.discussion_post_attachments
    FOR ALL
    USING (
        auth.role() = 'authenticated' AND (
            created_by = auth.uid() OR
            public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik', 'central_committee', 'board')
        )
    );

CREATE POLICY "Upload Attachments" ON public.discussion_post_attachments
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = created_by);

-- FLAGS
CREATE POLICY "Admins can view flags" ON discussion_flags FOR SELECT USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik', 'central_committee', 'board'));
CREATE POLICY "Admins can resolve flags" ON discussion_flags FOR UPDATE USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik', 'central_committee', 'board'));

CREATE POLICY "Flags: Create own" ON discussion_message_flags FOR INSERT WITH CHECK (
    ((auth.role() = 'authenticated') AND (created_by = auth.uid())) OR ((auth.role() = 'anon') AND (created_by IS NULL))
);
CREATE POLICY "Flags: Mods view" ON discussion_message_flags FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('central_committee', 'board', 'admin', 'admin_party', 'yantrik')
);

-- AUDIT LOGS
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik')
);

-- STORAGE (media bucket)
CREATE POLICY "Auth Users Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Users Delete" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id = 'media');

--------------------------------------------------------------------------------
-- 6. RECREATE VIEWS
--------------------------------------------------------------------------------
CREATE OR REPLACE VIEW thread_overviews AS
SELECT 
    t.id, t.channel_id, t.title, t.created_at, t.created_by, t.is_anonymous, t.buried_at, t.summary, t.meta, t.updated_at,
    p.full_name as author_name, p.avatar_url as author_avatar, COALESCE(ur.role, p.role) as author_role,
    (SELECT count(*) FROM discussion_posts p WHERE p.thread_id = t.id) as total_posts
FROM discussion_threads t
LEFT JOIN profiles p ON t.created_by = p.id
LEFT JOIN user_roles ur ON t.created_by = ur.user_id
WHERE t.deleted_at IS NULL;

GRANT SELECT ON thread_overviews TO authenticated;
GRANT SELECT ON thread_overviews TO anon;

--------------------------------------------------------------------------------
-- 7. FINALIZE
--------------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';
