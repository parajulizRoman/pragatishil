-- Add category column to discussion_channels
ALTER TABLE discussion_channels
ADD COLUMN category text DEFAULT 'General';

-- Update existing channels with some sensible defaults if possible, or just default to General
UPDATE discussion_channels SET category = 'General' WHERE category IS NULL;
