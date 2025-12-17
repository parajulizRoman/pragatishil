-- Add Ban System columns to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_banned boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS banned_at timestamptz,
  ADD COLUMN IF NOT EXISTS banned_by uuid REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS ban_reason text,
  ADD COLUMN IF NOT EXISTS ban_expires_at timestamptz;

-- Index for faster lookups on banned status
CREATE INDEX IF NOT EXISTS idx_profiles_is_banned ON public.profiles(is_banned);

-- Update RLS for Discussion Posts (Cannot post if banned)
-- Note: We are policy replacement strategy (Drop & Recreate)
DROP POLICY IF EXISTS "Posts: Create (Phase 2)" ON public.discussion_posts;

CREATE POLICY "Posts: Create (Phase 3 - Ban Aware)" ON public.discussion_posts
    FOR INSERT TO public WITH CHECK (
        (
            -- Case 1: Authenticated & Not Banned
            auth.role() = 'authenticated' AND 
            auth.uid() = author_id AND
            (SELECT is_banned FROM public.profiles WHERE id = auth.uid()) = false AND
            EXISTS (
                SELECT 1 FROM public.discussion_threads t
                JOIN public.discussion_channels c ON c.id = t.channel_id
                WHERE t.id = thread_id
                AND c.min_role_to_post IN ('member', 'anonymous')
            )
        ) OR (
            -- Case 2: Anonymous (Logic remains same, anon cannot be 'banned' via profile, technically)
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

-- Similar for Comments? (Assumed discussion_posts covers it, or if separate table exists)
-- Assuming discussion_posts is the main one.

-- RLS Update for Discussion Threads (Cannot create threads if banned)
DROP POLICY IF EXISTS "Threads: Create (Phase 2)" ON public.discussion_threads;
CREATE POLICY "Threads: Create (Phase 3 - Ban Aware)" ON public.discussion_threads
    FOR INSERT TO authenticated WITH CHECK (
         (SELECT is_banned FROM public.profiles WHERE id = auth.uid()) = false AND
         EXISTS (
             SELECT 1 FROM public.discussion_channels c
             WHERE c.id = channel_id
             AND (
                (c.min_role_to_create_threads = 'member') OR 
                (c.min_role_to_create_threads = 'party_member' AND (public.get_user_role(auth.uid()) IN ('party_member', 'central_committee', 'chief_board', 'admin', 'yantrik'))) OR
                (c.min_role_to_create_threads IN ('central_committee', 'leadership') AND (public.get_user_role(auth.uid()) IN ('central_committee', 'chief_board', 'admin', 'yantrik')))
             )
        )
    );
