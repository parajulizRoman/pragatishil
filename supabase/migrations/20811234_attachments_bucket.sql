-- Channel Media Storage Bucket
-- Stores channel header images, maps, and related media

-- Create the channel-media bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('channel-media', 'channel-media', true, 10485760) -- 10MB limit
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for 'channel-media' bucket

-- Allow public read access (for displaying headers)
DROP POLICY IF EXISTS "Public Read Channel Media" ON storage.objects;
CREATE POLICY "Public Read Channel Media" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'channel-media');

-- Allow authenticated users to upload
DROP POLICY IF EXISTS "Authenticated Upload Channel Media" ON storage.objects;
CREATE POLICY "Authenticated Upload Channel Media" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'channel-media');

-- Allow authenticated users to update/delete
DROP POLICY IF EXISTS "Manage Channel Media" ON storage.objects;
CREATE POLICY "Manage Channel Media" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'channel-media');

DROP POLICY IF EXISTS "Delete Channel Media" ON storage.objects;
CREATE POLICY "Delete Channel Media" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'channel-media');
