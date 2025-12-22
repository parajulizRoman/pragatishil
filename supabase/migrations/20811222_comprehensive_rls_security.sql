-- Comprehensive RLS Security Fix
-- This migration addresses critical security issues by ensuring RLS is enabled
-- and proper policies exist for all public tables

-- =============================================================================
-- 1. ENABLE RLS ON ALL PUBLIC TABLES
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bans ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 2. PROFILES TABLE POLICIES
-- =============================================================================

-- Drop existing if any
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;

-- Public read access
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT TO authenticated
    USING (true);

-- Users can insert their own profile (triggered by signup)
CREATE POLICY "profiles_insert_policy" ON public.profiles
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_policy" ON public.profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- =============================================================================
-- 3. MEDIA_ALBUMS TABLE POLICIES
-- =============================================================================

DROP POLICY IF EXISTS "media_albums_select_policy" ON public.media_albums;
DROP POLICY IF EXISTS "media_albums_insert_policy" ON public.media_albums;
DROP POLICY IF EXISTS "media_albums_update_policy" ON public.media_albums;
DROP POLICY IF EXISTS "media_albums_delete_policy" ON public.media_albums;

-- Public read
CREATE POLICY "media_albums_select_policy" ON public.media_albums
    FOR SELECT TO authenticated
    USING (true);

-- Central committee and above can create
CREATE POLICY "media_albums_insert_policy" ON public.media_albums
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('central_committee', 'admin_party', 'yantrik', 'board', 'admin')
        )
    );

-- Central committee and above can update
CREATE POLICY "media_albums_update_policy" ON public.media_albums
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('central_committee', 'admin_party', 'yantrik', 'board', 'admin')
        )
    );

-- Admin party and above can delete
CREATE POLICY "media_albums_delete_policy" ON public.media_albums
    FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('admin_party', 'yantrik', 'board', 'admin')
        )
    );

-- =============================================================================
-- 4. CHANNELS TABLE POLICIES
-- =============================================================================

DROP POLICY IF EXISTS "channels_select_policy" ON public.channels;
DROP POLICY IF EXISTS "channels_insert_policy" ON public.channels;
DROP POLICY IF EXISTS "channels_update_policy" ON public.channels;

-- Authenticated users can view non-archived channels
CREATE POLICY "channels_select_policy" ON public.channels
    FOR SELECT TO authenticated
    USING (archived = false OR EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid()
        AND p.role IN ('central_committee', 'admin_party', 'yantrik', 'board', 'admin')
    ));

-- Central committee and above can create
CREATE POLICY "channels_insert_policy" ON public.channels
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('central_committee', 'admin_party', 'yantrik', 'board', 'admin')
        )
    );

-- Central committee and above can update
CREATE POLICY "channels_update_policy" ON public.channels
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('central_committee', 'admin_party', 'yantrik', 'board', 'admin')
        )
    );

-- =============================================================================
-- 5. THREADS TABLE POLICIES
-- =============================================================================

DROP POLICY IF EXISTS "threads_select_policy" ON public.threads;
DROP POLICY IF EXISTS "threads_insert_policy" ON public.threads;
DROP POLICY IF EXISTS "threads_update_policy" ON public.threads;
DROP POLICY IF EXISTS "threads_delete_policy" ON public.threads;

-- Public can view non-hidden threads
CREATE POLICY "threads_select_policy" ON public.threads
    FOR SELECT TO authenticated
    USING (hidden = false OR author_id = auth.uid());

-- Verified members can create threads
CREATE POLICY "threads_insert_policy" ON public.threads
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('member', 'party_member', 'central_committee', 'admin_party', 'yantrik', 'board', 'admin')
        )
    );

-- Authors can update their own threads
CREATE POLICY "threads_update_policy" ON public.threads
    FOR UPDATE TO authenticated
    USING (author_id = auth.uid());

-- Authors can delete their own threads
CREATE POLICY "threads_delete_policy" ON public.threads
    FOR DELETE TO authenticated
    USING (author_id = auth.uid());

-- =============================================================================
-- 6. COMMENTS TABLE POLICIES
-- =============================================================================

DROP POLICY IF EXISTS "comments_select_policy" ON public.comments;
DROP POLICY IF EXISTS "comments_insert_policy" ON public.comments;
DROP POLICY IF EXISTS "comments_update_policy" ON public.comments;
DROP POLICY IF EXISTS "comments_delete_policy" ON public.comments;

-- Public can view non-hidden comments
CREATE POLICY "comments_select_policy" ON public.comments
    FOR SELECT TO authenticated
    USING (hidden = false OR author_id = auth.uid());

-- Verified members can create comments
CREATE POLICY "comments_insert_policy" ON public.comments
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('member', 'party_member', 'central_committee', 'admin_party', 'yantrik', 'board', 'admin')
        )
    );

-- Authors can update their own comments
CREATE POLICY "comments_update_policy" ON public.comments
    FOR UPDATE TO authenticated
    USING (author_id = auth.uid());

-- Authors can delete their own comments
CREATE POLICY "comments_delete_policy" ON public.comments
    FOR DELETE TO authenticated
    USING (author_id = auth.uid());

-- =============================================================================
-- 7. FLAGS TABLE POLICIES (Moderation)
-- =============================================================================

DROP POLICY IF EXISTS "flags_select_policy" ON public.flags;
DROP POLICY IF EXISTS "flags_insert_policy" ON public.flags;
DROP POLICY IF EXISTS "flags_update_policy" ON public.flags;

-- Only moderators can view flags
CREATE POLICY "flags_select_policy" ON public.flags
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('party_member', 'central_committee', 'admin_party', 'yantrik', 'board', 'admin')
        )
    );

-- Members can create flags
CREATE POLICY "flags_insert_policy" ON public.flags
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('member', 'party_member', 'central_committee', 'admin_party', 'yantrik', 'board', 'admin')
        )
    );

-- Party members and above can update flags
CREATE POLICY "flags_update_policy" ON public.flags
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('party_member', 'central_committee', 'admin_party', 'yantrik', 'board', 'admin')
        )
    );

-- =============================================================================
-- 8. AUDIT_LOGS TABLE POLICIES
-- =============================================================================

DROP POLICY IF EXISTS "audit_logs_select_policy" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_insert_policy" ON public.audit_logs;

-- Only admins can view audit logs
CREATE POLICY "audit_logs_select_policy" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('admin_party', 'yantrik', 'board', 'admin')
        )
    );

-- System can insert audit logs (from triggers)
CREATE POLICY "audit_logs_insert_policy" ON public.audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- =============================================================================
-- 9. BANS TABLE POLICIES
-- =============================================================================

DROP POLICY IF EXISTS "bans_select_policy" ON public.bans;
DROP POLICY IF EXISTS "bans_insert_policy" ON public.bans;
DROP POLICY IF EXISTS "bans_update_policy" ON public.bans;

-- Admins can view bans
CREATE POLICY "bans_select_policy" ON public.bans
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('admin_party', 'yantrik', 'board', 'admin')
        )
    );

-- Admins can create bans
CREATE POLICY "bans_insert_policy" ON public.bans
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('admin_party', 'yantrik', 'board', 'admin')
        )
    );

-- Admins can update bans
CREATE POLICY "bans_update_policy" ON public.bans
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('admin_party', 'yantrik', 'board', 'admin')
        )
    );

-- =============================================================================
-- 10. FORCE SCHEMA CACHE RELOAD
-- =============================================================================

NOTIFY pgrst, 'reload schema';
