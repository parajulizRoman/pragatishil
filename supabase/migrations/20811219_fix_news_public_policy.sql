-- Align Public Read Access Policy with 'status' column
-- Previously it relied on 'is_published' which is no longer updated by the CMS.

-- Drop the old policy
DROP POLICY IF EXISTS "Public read access" ON public.news_items;

-- Create new policy based on status enum
CREATE POLICY "Public read access" ON public.news_items FOR SELECT USING (status = 'published');

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
