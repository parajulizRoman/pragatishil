-- Attachments Storage Bucket for Channel Headers
-- Creates public bucket for channel header images and other attachments

-- Create the attachments bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('attachments', 'attachments', true, 10485760) -- 10MB limit
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for 'attachments' bucket

-- Allow public read access (for displaying headers)
DROP POLICY IF EXISTS "Public Read Attachments" ON storage.objects;
CREATE POLICY "Public Read Attachments" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'attachments');

-- Allow authenticated users to upload
DROP POLICY IF EXISTS "Authenticated Upload Attachments" ON storage.objects;
CREATE POLICY "Authenticated Upload Attachments" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'attachments');

-- Allow authenticated users to update/delete their own files
DROP POLICY IF EXISTS "Owner Manage Attachments" ON storage.objects;
CREATE POLICY "Owner Manage Attachments" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'attachments');

DROP POLICY IF EXISTS "Owner Delete Attachments" ON storage.objects;
CREATE POLICY "Owner Delete Attachments" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'attachments');
