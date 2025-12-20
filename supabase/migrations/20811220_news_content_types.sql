-- Content Types & Author System for news_items
-- Adds content_type, author_id, and visibility columns
-- Updates RLS to enforce visibility and permission matrix

-- 1. ADD NEW COLUMNS
ALTER TABLE public.news_items
ADD COLUMN IF NOT EXISTS content_type text NOT NULL DEFAULT 'official'
  CHECK (content_type IN ('official', 'article'));

ALTER TABLE public.news_items
ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES public.profiles(id);

ALTER TABLE public.news_items
ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'party'
  CHECK (visibility IN ('public', 'party', 'team'));

-- 2. DROP OLD POLICIES
DROP POLICY IF EXISTS "News: public read" ON public.news_items;
DROP POLICY IF EXISTS "News: public read published" ON public.news_items;
DROP POLICY IF EXISTS "News: privileged manage all" ON public.news_items;
DROP POLICY IF EXISTS "Admin write access news" ON public.news_items;
DROP POLICY IF EXISTS "News: authenticated read" ON public.news_items;
DROP POLICY IF EXISTS "News: manage official" ON public.news_items;
DROP POLICY IF EXISTS "News: manage own articles" ON public.news_items;
DROP POLICY IF EXISTS "News: manage any article (admin/yantrik)" ON public.news_items;

-- 3. PUBLIC READ POLICY (anon + auth)
-- Only see published items that are either official OR public articles
CREATE POLICY "News: public read"
ON public.news_items
FOR SELECT
USING (
  status = 'published'
  AND (
    content_type = 'official'
    OR (content_type = 'article' AND visibility = 'public')
  )
);

-- 4. AUTHENTICATED READ POLICY (party/team visibility)
CREATE POLICY "News: authenticated read"
ON public.news_items
FOR SELECT
TO authenticated
USING (
  status = 'published'
  AND (
    visibility = 'public'
    OR (
      visibility = 'party'
      AND public.get_user_role(auth.uid()) IN (
        'party_member','team_member','central_committee',
        'board','admin_party','yantrik','admin'
      )
    )
    OR (
      visibility = 'team'
      AND public.get_user_role(auth.uid()) IN (
        'team_member','central_committee','board',
        'admin_party','yantrik','admin'
      )
    )
  )
);

-- 5. WRITE POLICY: OFFICIAL NEWS (admin/yantrik/admin_party only)
CREATE POLICY "News: manage official"
ON public.news_items
FOR ALL
TO authenticated
USING (
  content_type = 'official'
  AND public.get_user_role(auth.uid()) IN ('admin','yantrik','admin_party')
)
WITH CHECK (
  content_type = 'official'
  AND public.get_user_role(auth.uid()) IN ('admin','yantrik','admin_party')
);

-- 6. WRITE POLICY: OWN ARTICLES (party_member and above)
CREATE POLICY "News: manage own articles"
ON public.news_items
FOR ALL
TO authenticated
USING (
  content_type = 'article'
  AND author_id = auth.uid()
  AND public.get_user_role(auth.uid()) IN (
    'party_member','team_member','central_committee',
    'board','admin_party','yantrik','admin'
  )
)
WITH CHECK (
  content_type = 'article'
  AND author_id = auth.uid()
  AND public.get_user_role(auth.uid()) IN (
    'party_member','team_member','central_committee',
    'board','admin_party','yantrik','admin'
  )
);

-- 7. WRITE POLICY: ADMIN/YANTRIK CAN MANAGE ANY ARTICLE
CREATE POLICY "News: manage any article (admin/yantrik)"
ON public.news_items
FOR ALL
TO authenticated
USING (
  content_type = 'article'
  AND public.get_user_role(auth.uid()) IN ('admin','yantrik')
)
WITH CHECK (
  content_type = 'article'
  AND public.get_user_role(auth.uid()) IN ('admin','yantrik')
);

-- 8. RELOAD SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
