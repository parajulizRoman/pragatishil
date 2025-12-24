-- Add pending_reviewer_id column to news_items for review workflow
-- This column stores the user ID of the admin assigned to review a submitted article

ALTER TABLE news_items 
ADD COLUMN IF NOT EXISTS pending_reviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_news_items_pending_reviewer 
ON news_items(pending_reviewer_id) 
WHERE pending_reviewer_id IS NOT NULL;

-- Comment for documentation
COMMENT ON COLUMN news_items.pending_reviewer_id IS 'UUID of the admin/reviewer assigned to review this submitted article';
