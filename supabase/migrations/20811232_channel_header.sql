-- Channel Header Columns
-- Adds header image and political intro for geographic channels

-- Add header_image_url column
ALTER TABLE discussion_channels
ADD COLUMN IF NOT EXISTS header_image_url TEXT;

-- Add political_intro column (markdown content)
ALTER TABLE discussion_channels
ADD COLUMN IF NOT EXISTS political_intro TEXT;

COMMENT ON COLUMN discussion_channels.header_image_url IS 'Header banner/map image URL for channel';
COMMENT ON COLUMN discussion_channels.political_intro IS 'Political introduction in markdown format';
