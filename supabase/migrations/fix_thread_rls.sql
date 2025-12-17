-- Fix Thread and Post RLS to use new hardened channel logic
-- Solves "Thread not found" error by ensuring threads are visible if the channel is visible.

BEGIN;

--------------------------------------------------------------------------------
-- 1. Discussion Threads RLS
--------------------------------------------------------------------------------

ALTER TABLE public.discussion_threads ENABLE ROW LEVEL SECURITY;

-- Drop old policies to avoid conflicts
DROP POLICY IF EXISTS "Threads: Visible (Phase 2)" ON public.discussion_threads;
DROP POLICY IF EXISTS "Threads Select Policy" ON public.discussion_threads;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.discussion_threads;
DROP POLICY IF EXISTS "Public threads are viewable by everyone" ON public.discussion_threads;
DROP POLICY IF EXISTS "Threads Insert Policy" ON public.discussion_threads;
DROP POLICY IF EXISTS "Threads Update Policy" ON public.discussion_threads;

-- New Robust Select Policy
CREATE POLICY "Threads Select Policy" ON public.discussion_threads
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.discussion_channels c
            WHERE c.id = channel_id
            -- NOTE: We rely on discussion_channels RLS to filter visible channels.
            -- If the user cannot see the channel, this subquery returns empty, 
            -- so they cannot see the thread. Inheritance!
        )
    );

-- Manage Policy (Create/Edit) - Simplified for now to unblock
-- Ideally should check min_role_to_post etc, but for now allow Authenticated User to Create if they have Channel Access
-- Real enforcement happens via API logic usually, but strict RLS is good.
-- We'll allow INSERT if Channel is Accessible.
CREATE POLICY "Threads Insert Policy" ON public.discussion_threads
    FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.discussion_channels c
            WHERE c.id = channel_id
            AND public.has_channel_access(c.visibility)
        )
    );

-- Update Policy (Own threads or Admin)
CREATE POLICY "Threads Update Policy" ON public.discussion_threads
    FOR UPDATE
    USING (
        auth.role() = 'authenticated' AND (
            created_by = auth.uid() OR 
            public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik', 'central_committee', 'board') -- Mods
        )
    );

--------------------------------------------------------------------------------
-- 2. Discussion Posts RLS
--------------------------------------------------------------------------------

ALTER TABLE public.discussion_posts ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Posts: Visible (Phase 2)" ON public.discussion_posts;
DROP POLICY IF EXISTS "Posts Select Policy" ON public.discussion_posts;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.discussion_posts;
DROP POLICY IF EXISTS "Posts Insert Policy" ON public.discussion_posts;
DROP POLICY IF EXISTS "Posts Update Policy" ON public.discussion_posts;

-- Select Policy (Inherit from Thread -> Channel)
CREATE POLICY "Posts Select Policy" ON public.discussion_posts
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.discussion_threads t
            JOIN public.discussion_channels c ON c.id = t.channel_id
            WHERE t.id = thread_id
            -- Inherits Channel RLS visibility
        )
    );

-- Insert Policy (Authenticated + Access)
CREATE POLICY "Posts Insert Policy" ON public.discussion_posts
    FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.discussion_threads t
            JOIN public.discussion_channels c ON c.id = t.channel_id
            WHERE t.id = thread_id
            AND public.has_channel_access(c.visibility)
        )
    );

-- Update Policy (Own posts or Admin)
CREATE POLICY "Posts Update Policy" ON public.discussion_posts
    FOR UPDATE
    USING (
        auth.role() = 'authenticated' AND (
            author_id = auth.uid() OR 
            public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik', 'central_committee', 'board')
        )
    );

COMMIT;
