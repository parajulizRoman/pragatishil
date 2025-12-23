-- Profession Category Management - Additional RLS Policies
-- Allows central_committee and above to manage profession categories

-- Update policy for profession_categories
CREATE POLICY IF NOT EXISTS "profession_categories_update" ON public.profession_categories
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = (SELECT auth.uid())
            AND p.role IN ('admin', 'admin_party', 'yantrik', 'board', 'central_committee')
        )
    );

-- Delete policy for profession_categories  
CREATE POLICY IF NOT EXISTS "profession_categories_delete" ON public.profession_categories
    FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = (SELECT auth.uid())
            AND p.role IN ('admin', 'admin_party', 'yantrik', 'board', 'central_committee')
        )
    );

-- Update insert policy to include central_committee
DROP POLICY IF EXISTS "profession_categories_insert" ON public.profession_categories;
CREATE POLICY "profession_categories_insert" ON public.profession_categories
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = (SELECT auth.uid())
            AND p.role IN ('admin', 'admin_party', 'yantrik', 'board', 'central_committee')
        )
    );

-- Force schema reload
NOTIFY pgrst, 'reload schema';
