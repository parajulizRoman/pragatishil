-- RLS policies for news_items UPDATE/DELETE operations

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "news_items_update_policy" ON public.news_items;
DROP POLICY IF EXISTS "news_items_delete_policy" ON public.news_items;

-- Create update policy for central_committee and above
CREATE POLICY "news_items_update_policy" ON public.news_items
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('central_committee', 'admin_party', 'yantrik', 'board', 'admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('central_committee', 'admin_party', 'yantrik', 'board', 'admin')
        )
    );

-- Create delete policy for admin_party and above (higher than central_committee)
CREATE POLICY "news_items_delete_policy" ON public.news_items
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('admin_party', 'yantrik', 'board', 'admin')
        )
    );

-- Force schema cache reload
NOTIFY pgrst, 'reload schema';
