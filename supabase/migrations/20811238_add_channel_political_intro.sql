-- Add political_intro column to discussion_channels table
ALTER TABLE discussion_channels 
ADD COLUMN IF NOT EXISTS political_intro TEXT;

COMMENT ON COLUMN discussion_channels.political_intro IS 'Political introduction or context for the channel/area';
