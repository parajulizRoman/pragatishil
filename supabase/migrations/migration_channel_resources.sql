-- Add Resource Fields to Discussion Channels
ALTER TABLE discussion_channels
ADD COLUMN IF NOT EXISTS docs_url TEXT,
ADD COLUMN IF NOT EXISTS video_playlist_url TEXT,
ADD COLUMN IF NOT EXISTS impact_stats JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS readme_content TEXT;

-- Update RLS if needed (schema change usually doesn't affect row policies unless new RLS logic needed)
-- Current policies cover UPDATE for admins, so this just adds fields they can update.
