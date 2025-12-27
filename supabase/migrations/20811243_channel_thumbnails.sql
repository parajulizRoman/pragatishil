-- Add thumbnail and icon fields to discussion_channels
ALTER TABLE discussion_channels
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS icon_emoji TEXT DEFAULT '💬';

-- Add comment for documentation
COMMENT ON COLUMN discussion_channels.thumbnail_url IS 'URL for channel thumbnail/icon image';
COMMENT ON COLUMN discussion_channels.icon_emoji IS 'Emoji icon as fallback or primary icon';

-- Set default emojis for existing channels based on type
UPDATE discussion_channels
SET icon_emoji = CASE
    WHEN location_type = 'central' THEN '🏛️'
    WHEN location_type = 'state' THEN '🗺️'
    WHEN location_type = 'district' THEN '📍'
    WHEN location_type = 'municipality' THEN '🏘️'
    WHEN location_type = 'ward' THEN '🏠'
    WHEN location_type = 'department' THEN '🏢'
    WHEN category = 'Technology' THEN '💻'
    WHEN category = 'Media' THEN '📰'
    WHEN category = 'Youth' THEN '👥'
    WHEN category = 'Women' THEN '👩'
    WHEN visibility = 'public' THEN '🌐'
    ELSE '💬'
END
WHERE icon_emoji IS NULL OR icon_emoji = '💬';
