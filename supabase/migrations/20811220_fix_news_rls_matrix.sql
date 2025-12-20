-- 20811220_fix_news_rls_matrix.sql
-- Fix RLS for news_items without touching get_user_role

-- 1. CLEAN UP OLD POLICIES
DROP POLICY IF EXISTS "Public read access" ON public.news_items;
DROP POLICY IF EXISTS "Admin write access news" ON public.news_items;
DROP POLICY IF EXISTS "News: public read published" ON public.news_items;
DROP POLICY IF EXISTS "News: privileged manage all" ON public.news_items;

-- 2. PUBLIC READ: ONLY PUBLISHED
CREATE POLICY "News: public read published" 
ON public.news_items
FOR SELECT
USING (status = 'published');

-- 3. PRIVILEGED FULL ACCESS
-- admin, yantrik, admin_party, central_committee, board
-- Casting enum strings to user_role type implicity works in IN clause often, 
-- but explicit cast might be safer if IN expects enum. 
-- However, User's instructions say to use IN ('admin',...) which Postgres handles against enum usually.
CREATE POLICY "News: privileged manage all"
ON public.news_items
FOR ALL
USING (
  auth.role() = 'authenticated'
  AND public.get_user_role(auth.uid()) IN (
    'admin', 'yantrik', 'admin_party', 'central_committee', 'board'
  )
)
WITH CHECK (
  auth.role() = 'authenticated'
  AND public.get_user_role(auth.uid()) IN (
    'admin', 'yantrik', 'admin_party', 'central_committee', 'board'
  )
);

-- 4. RELOAD SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
