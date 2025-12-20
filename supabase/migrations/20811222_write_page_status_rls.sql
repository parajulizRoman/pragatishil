-- Unified /write page - Status and RLS updates
-- Adds 'submitted' status and author management policies

-- 1. DROP OLD STATUS CONSTRAINT AND ADD NEW ONE
ALTER TABLE public.news_items 
DROP CONSTRAINT IF EXISTS news_items_status_check;

-- Add submitted to status options
ALTER TABLE public.news_items 
ADD CONSTRAINT news_items_status_check 
CHECK (status IN ('draft', 'submitted', 'published', 'archived'));

-- 2. ENSURE author_id EXISTS (may already exist from content_types migration)
ALTER TABLE public.news_items 
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.profiles(id);

-- 3. DROP OLD POLICIES ON news_items
DROP POLICY IF EXISTS "Public read access" ON public.news_items;
DROP POLICY IF EXISTS "News: public read" ON public.news_items;
DROP POLICY IF EXISTS "News: privileged manage all" ON public.news_items;
DROP POLICY IF EXISTS "News: author manage own drafts" ON public.news_items;
DROP POLICY IF EXISTS "News: block low roles insert" ON public.news_items;
DROP POLICY IF EXISTS "Admin write access news" ON public.news_items;

-- 4. RLS POLICIES FOR news_items

-- 4a. Public can only read published items
CREATE POLICY "News: public read"
ON public.news_items
FOR SELECT
USING (status = 'published');

-- 4b. Privileged roles can manage ALL items
CREATE POLICY "News: privileged manage all"
ON public.news_items
FOR ALL
TO authenticated
USING (
    public.get_user_role(auth.uid()) IN (
        'admin', 'yantrik', 'admin_party', 'central_committee', 'board'
    )
)
WITH CHECK (
    public.get_user_role(auth.uid()) IN (
        'admin', 'yantrik', 'admin_party', 'central_committee', 'board'
    )
);

-- 4c. Authors from contributor roles can manage their own draft/submitted items
-- NOTE: This includes role check to prevent plain members from creating content
CREATE POLICY "News: author manage own drafts"
ON public.news_items
FOR ALL
TO authenticated
USING (
    author_id = auth.uid()
    AND status IN ('draft', 'submitted')
    AND public.get_user_role(auth.uid()) IN (
        'party_member', 'team_member',
        'central_committee', 'board',
        'admin_party', 'yantrik', 'admin'
    )
)
WITH CHECK (
    author_id = auth.uid()
    AND status IN ('draft', 'submitted')
    AND public.get_user_role(auth.uid()) IN (
        'party_member', 'team_member',
        'central_committee', 'board',
        'admin_party', 'yantrik', 'admin'
    )
);

-- 5. NOTIFY SCHEMA RELOAD
NOTIFY pgrst, 'reload schema';

