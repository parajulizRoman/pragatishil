-- Fix CMS RLS Policies to allow yantrik and admin_party
-- Previous policies only allowed 'admin'.

-- 1. Drop existing restrictive policies
DROP POLICY IF EXISTS "Admin write access settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin write access news" ON public.news_items;
DROP POLICY IF EXISTS "Admin write access media" ON public.media_gallery;

-- 2. Create inclusive policies
-- Allow admin, yantrik (Technical Admin), and admin_party (Political Admin) to manage content.

CREATE POLICY "Admin write access settings" ON public.site_settings FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'yantrik', 'admin_party')
    )
);

CREATE POLICY "Admin write access news" ON public.news_items FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'yantrik', 'admin_party')
    )
);

CREATE POLICY "Admin write access media" ON public.media_gallery FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'yantrik', 'admin_party')
    )
);

-- Force schema cache reload just in case
NOTIFY pgrst, 'reload schema';
