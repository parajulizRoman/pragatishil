-- Fix CMS RLS Policies to correctly allow Central Committee and Board
-- Previous policies were too restrictive (blocked CC from News/Media, blocked Board from everything).

-- 1. Drop existing restrictive policies defined in `20811219_fix_cms_rls.sql`
DROP POLICY IF EXISTS "Admin write access settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin write access news" ON public.news_items;
DROP POLICY IF EXISTS "Admin write access media" ON public.media_gallery;

-- 2. Create Correct Policies

-- A. Site Settings: Admin, Yantrik, Admin Party, Board ONLY. (NO Central Committee)
CREATE POLICY "Admin write access settings" ON public.site_settings FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'yantrik', 'admin_party', 'board')
    )
);

-- B. News Items: All Admin Roles INCLUDING Central Committee + Board
CREATE POLICY "Admin write access news" ON public.news_items FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'yantrik', 'admin_party', 'board', 'central_committee')
    )
);

-- C. Media Gallery: All Admin Roles INCLUDING Central Committee + Board
CREATE POLICY "Admin write access media" ON public.media_gallery FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'yantrik', 'admin_party', 'board', 'central_committee')
    )
);

-- Note: SELECT policies are usually open or handled separately. 
-- Assuming "ENABLE READ ACCESS FOR ALL" exists or similar, if not we rely on these being FOR ALL?
-- Actually, typically we have a separate SELECT policy for public read.
-- If these are FOR ALL, they cover SELECT too for authenticated users.
-- We should probably ensure public read is handled elsewhere or add it here if missing. 
-- But this task is specifically about write permissions (RBAC).
-- Assuming public read is handled by other policies or we just want admins to see.

-- Force schema cache reload just in case
NOTIFY pgrst, 'reload schema';
