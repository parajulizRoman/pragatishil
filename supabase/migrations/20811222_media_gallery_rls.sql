-- Fix RLS policies for media_gallery UPDATE/DELETE operations
-- Allow authenticated users with sufficient roles to update/delete

-- Drop existing update/delete policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to update media" ON public.media_gallery;
DROP POLICY IF EXISTS "Allow authenticated users to delete media" ON public.media_gallery;
DROP POLICY IF EXISTS "media_gallery_update_policy" ON public.media_gallery;
DROP POLICY IF EXISTS "media_gallery_delete_policy" ON public.media_gallery;

-- Create update policy for central_committee and above
CREATE POLICY "media_gallery_update_policy" ON public.media_gallery
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
CREATE POLICY "media_gallery_delete_policy" ON public.media_gallery
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
