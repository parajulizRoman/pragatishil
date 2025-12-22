-- Comprehensive RLS Security Fix (Safe Version)
-- Only applies policies to tables that actually exist

-- =============================================================================
-- 1. ENABLE RLS ON EXISTING PUBLIC TABLES
-- =============================================================================

DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'news_items') THEN
        ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'media_gallery') THEN
        ALTER TABLE public.media_gallery ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'media_albums') THEN
        ALTER TABLE public.media_albums ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- =============================================================================
-- 2. PROFILES TABLE POLICIES
-- =============================================================================

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
        DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
        DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;

        CREATE POLICY "profiles_select_policy" ON public.profiles
            FOR SELECT TO authenticated
            USING (true);

        CREATE POLICY "profiles_insert_policy" ON public.profiles
            FOR INSERT TO authenticated
            WITH CHECK (auth.uid() = id);

        CREATE POLICY "profiles_update_policy" ON public.profiles
            FOR UPDATE TO authenticated
            USING (auth.uid() = id)
            WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- =============================================================================
-- 3. MEDIA_ALBUMS TABLE POLICIES
-- =============================================================================

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'media_albums') THEN
        DROP POLICY IF EXISTS "media_albums_select_policy" ON public.media_albums;
        DROP POLICY IF EXISTS "media_albums_insert_policy" ON public.media_albums;
        DROP POLICY IF EXISTS "media_albums_update_policy" ON public.media_albums;
        DROP POLICY IF EXISTS "media_albums_delete_policy" ON public.media_albums;

        CREATE POLICY "media_albums_select_policy" ON public.media_albums
            FOR SELECT TO authenticated
            USING (true);

        CREATE POLICY "media_albums_insert_policy" ON public.media_albums
            FOR INSERT TO authenticated
            WITH CHECK (
                EXISTS (
                    SELECT 1 FROM public.profiles p
                    WHERE p.id = auth.uid()
                    AND p.role IN ('central_committee', 'admin_party', 'yantrik', 'board', 'admin')
                )
            );

        CREATE POLICY "media_albums_update_policy" ON public.media_albums
            FOR UPDATE TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public.profiles p
                    WHERE p.id = auth.uid()
                    AND p.role IN ('central_committee', 'admin_party', 'yantrik', 'board', 'admin')
                )
            );

        CREATE POLICY "media_albums_delete_policy" ON public.media_albums
            FOR DELETE TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public.profiles p
                    WHERE p.id = auth.uid()
                    AND p.role IN ('admin_party', 'yantrik', 'board', 'admin')
                )
            );
    END IF;
END $$;

-- Force schema cache reload
NOTIFY pgrst, 'reload schema';
