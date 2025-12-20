-- Add date_bs column to news_items table
ALTER TABLE news_items 
ADD COLUMN IF NOT EXISTS date_bs text;

-- Optional: Add comment
COMMENT ON COLUMN news_items.date_bs IS 'Nepali Date (BS) in YYYY-MM-DD format';
