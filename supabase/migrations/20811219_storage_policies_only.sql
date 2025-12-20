-- RUN THIS AS PROJECT OWNER / IN SUPABASE DASHBOARD SQL EDITOR

-- Ensure RLS is enabled on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop old media-related policies
DROP POLICY IF EXISTS "Auth Users Upload" ON storage.objects;
DROP POLICY IF EXISTS "Auth Users Delete" ON storage.objects;
DROP POLICY IF EXISTS "Privileged Users Upload Media" ON storage.objects;
DROP POLICY IF EXISTS "Privileged Users Delete Media" ON storage.objects;

-- Upload allowed only for privileged roles, only in 'media' bucket
CREATE POLICY "Media: privileged upload" 
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'media'
  AND auth.role() = 'authenticated'
  AND public.get_user_role(auth.uid()) IN (
    'admin',
    'yantrik',
    'admin_party',
    'central_committee',
    'board'
  )
);

-- Delete allowed only for privileged roles, only in 'media' bucket
CREATE POLICY "Media: privileged delete" 
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'media'
  AND auth.role() = 'authenticated'
  AND public.get_user_role(auth.uid()) IN (
    'admin',
    'yantrik',
    'admin_party',
    'central_committee',
    'board'
  )
);
