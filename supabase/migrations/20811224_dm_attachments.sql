-- Message Attachments Migration
-- Adds attachment support to direct_messages table
-- File types: images, PDFs, documents
-- Max size: 10MB

-- Add attachment columns to direct_messages
ALTER TABLE direct_messages
ADD COLUMN IF NOT EXISTS attachment_url TEXT,
ADD COLUMN IF NOT EXISTS attachment_type TEXT,
ADD COLUMN IF NOT EXISTS attachment_name TEXT,
ADD COLUMN IF NOT EXISTS attachment_size INTEGER;

-- Create storage bucket for DM attachments
-- Note: Run this in Supabase Dashboard > Storage > Create Bucket
-- Bucket name: dm-attachments
-- Public: No (private)
-- File size limit: 10485760 (10MB)

-- RLS policy for storage bucket (run after creating bucket)
-- This allows authenticated users to upload to their own folder

-- Insert bucket if using SQL (may not work in free tier, use Dashboard instead)
-- INSERT INTO storage.buckets (id, name, public, file_size_limit)
-- VALUES ('dm-attachments', 'dm-attachments', false, 10485760)
-- ON CONFLICT (id) DO NOTHING;
