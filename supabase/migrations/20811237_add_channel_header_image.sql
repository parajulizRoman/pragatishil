-- Add header_image_url column to discussion_channels table
ALTER TABLE discussion_channels 
ADD COLUMN IF NOT EXISTS header_image_url TEXT;

COMMENT ON COLUMN discussion_channels.header_image_url IS 'URL for the channel header/banner image';
