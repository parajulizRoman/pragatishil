-- Add summary column to discussion_threads table
ALTER TABLE discussion_threads 
ADD COLUMN IF NOT EXISTS summary TEXT;

-- Comment on column
COMMENT ON COLUMN discussion_threads.summary IS 'AI-generated summary of the thread discussion';
