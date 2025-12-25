-- Add last_activity_at column to discussion_threads
-- Used to track when the thread was last active (new post, comment, etc.)

ALTER TABLE discussion_threads
ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW();

-- Set existing threads' last_activity_at to their created_at
UPDATE discussion_threads
SET last_activity_at = created_at
WHERE last_activity_at IS NULL;

-- Create index for sorting by activity
CREATE INDEX IF NOT EXISTS idx_threads_last_activity ON discussion_threads(channel_id, last_activity_at DESC);
