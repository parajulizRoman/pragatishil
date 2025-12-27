-- Migration: Add Trigger for Vote Counts
-- Date: 2081-12-25

-- 1. Ensure Columns Exist
ALTER TABLE IF EXISTS public.discussion_posts 
ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS downvotes INTEGER DEFAULT 0;

-- 2. Create Trigger Function
CREATE OR REPLACE FUNCTION update_post_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle Insert
  IF (TG_OP = 'INSERT') THEN
    IF NEW.vote_type = 1 THEN
      UPDATE discussion_posts SET upvotes = upvotes + 1 WHERE id = NEW.post_id;
    ELSIF NEW.vote_type = -1 THEN
      UPDATE discussion_posts SET downvotes = downvotes + 1 WHERE id = NEW.post_id;
    END IF;
  
  -- Handle Update (Change Vote)
  ELSIF (TG_OP = 'UPDATE') THEN
    -- Reverse OLD vote
    IF OLD.vote_type = 1 THEN
      UPDATE discussion_posts SET upvotes = upvotes - 1 WHERE id = OLD.post_id;
    ELSIF OLD.vote_type = -1 THEN
      UPDATE discussion_posts SET downvotes = downvotes - 1 WHERE id = OLD.post_id;
    END IF;

    -- Apply NEW vote
    IF NEW.vote_type = 1 THEN
      UPDATE discussion_posts SET upvotes = upvotes + 1 WHERE id = NEW.post_id;
    ELSIF NEW.vote_type = -1 THEN
      UPDATE discussion_posts SET downvotes = downvotes + 1 WHERE id = NEW.post_id;
    END IF;

  -- Handle Delete (Remove Vote)
  ELSIF (TG_OP = 'DELETE') THEN
    IF OLD.vote_type = 1 THEN
      UPDATE discussion_posts SET upvotes = upvotes - 1 WHERE id = OLD.post_id;
    ELSIF OLD.vote_type = -1 THEN
      UPDATE discussion_posts SET downvotes = downvotes - 1 WHERE id = OLD.post_id;
    END IF;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 3. Create Trigger
DROP TRIGGER IF EXISTS trigger_update_post_vote_counts ON discussion_votes;

CREATE TRIGGER trigger_update_post_vote_counts
AFTER INSERT OR UPDATE OR DELETE ON discussion_votes
FOR EACH ROW EXECUTE FUNCTION update_post_vote_counts();

-- 4. Initial Recalculation (Optional but recommended to fix desync)
-- This might be heavy if many votes exist, but ensures data consistency.
-- Commented out to avoid locking, run manually if needed.
/*
UPDATE discussion_posts p
SET 
  upvotes = (SELECT COUNT(*) FROM discussion_votes v WHERE v.post_id = p.id AND v.vote_type = 1),
  downvotes = (SELECT COUNT(*) FROM discussion_votes v WHERE v.post_id = p.id AND v.vote_type = -1);
*/

-- Notify Schema Reload
NOTIFY pgrst, 'reload schema';
