-- Profession Category Management - Additional RLS Policies
-- Allows central_committee and above to manage profession categories

-- Drop existing policies if they exist (safe to run multiple times)
DROP POLICY IF EXISTS "profession_categories_update" ON public.profession_categories;
DROP POLICY IF EXISTS "profession_categories_delete" ON public.profession_categories;
DROP POLICY IF EXISTS "profession_categories_insert" ON public.profession_categories;

-- Update policy for profession_categories
CREATE POLICY "profession_categories_update" ON public.profession_categories
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = (SELECT auth.uid())
            AND p.role IN ('admin', 'admin_party', 'yantrik', 'board', 'central_committee')
        )
    );

-- Delete policy for profession_categories  
CREATE POLICY "profession_categories_delete" ON public.profession_categories
    FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = (SELECT auth.uid())
            AND p.role IN ('admin', 'admin_party', 'yantrik', 'board', 'central_committee')
        )
    );

-- Insert policy for profession_categories (central committee+)
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
