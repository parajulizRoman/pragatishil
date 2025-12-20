-- 1) Extend news_items with full body + attachments + references
ALTER TABLE public.news_items 
  ADD COLUMN IF NOT EXISTS body_en TEXT,
  ADD COLUMN IF NOT EXISTS body_ne TEXT,
  ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS "references" JSONB DEFAULT '[]'::jsonb;

-- Make sure RLS is ON for news_items
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;

-- 2) Clean up existing news policies
DROP POLICY IF EXISTS "Admin write access news" ON public.news_items;
DROP POLICY IF EXISTS "Public read access" ON public.news_items;
DROP POLICY IF EXISTS "Public read published news" ON public.news_items;
DROP POLICY IF EXISTS "Privileged users manage news" ON public.news_items;

-- 3) Public can read only published news
CREATE POLICY "News: public read published" 
ON public.news_items
FOR SELECT
USING (
  is_published = true
);

-- 4) Privileged roles can read & write everything (drafts + published)
CREATE POLICY "News: privileged read/write" 
ON public.news_items
FOR ALL
TO authenticated
USING (
  public.get_user_role(auth.uid()) IN (
    'admin',
    'yantrik',
    'admin_party',
    'central_committee',
    'board'
  )
);

-- Audit logs: root-only

-- Drop any old audit log policies
DROP POLICY IF EXISTS "Admin select logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Audit logs visible to root only" ON public.audit_logs;

-- Only root admin can see raw audit logs
CREATE POLICY "Audit logs: root only"
ON public.audit_logs
FOR SELECT
USING (
  auth.role() = 'authenticated'
  AND public.get_user_role(auth.uid()) = 'admin'
);

-- Finally force schema reload
NOTIFY pgrst, 'reload schema';

/* 
   SKIPPING STORAGE POLICIES TO AVOID "must be owner of table objects" ERROR.
   Please run the storage policies separately in the Supabase Dashboard SQL Editor
   if you have owner permissions.
*/
