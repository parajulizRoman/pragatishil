-- Make the bucket public to allow direct URL access (Subject to RLS if we added it, but Public usually bypasses RLS for SELECT)
UPDATE storage.buckets
SET "public" = true
WHERE id = 'commune-uploads';

-- Ensure we have a policy that allows Public Read (if public=false, we'd need this. If public=true, it's open)
-- But for safety, let's explicit allow SELECT for everyone on this bucket if it respects RLS.
-- (When public=true, RLS for Select is skipped).

-- Just in case we revert to private later, here is a loose policy:
DROP POLICY IF EXISTS "Public View" ON storage.objects;
CREATE POLICY "Public View" ON storage.objects
    FOR SELECT
    USING ( bucket_id = 'commune-uploads' );
