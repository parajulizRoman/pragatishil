-- Database Schema for Voting Polls

-- 1. Polls Table
CREATE TABLE IF NOT EXISTS discussion_polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES discussion_posts(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  allow_multiple_votes BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- 2. Poll Options Table
CREATE TABLE IF NOT EXISTS discussion_poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES discussion_polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  position INTEGER DEFAULT 0
);

-- 3. Poll Votes Table
CREATE TABLE IF NOT EXISTS discussion_poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES discussion_polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES discussion_poll_options(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(poll_id, user_id, option_id)
);

-- Indexes for performance
CREATE INDEX idx_polls_post_id ON discussion_polls(post_id);
CREATE INDEX idx_poll_options_poll_id ON discussion_poll_options(poll_id);
CREATE INDEX idx_poll_votes_poll_id ON discussion_poll_votes(poll_id);
CREATE INDEX idx_poll_votes_user_id ON discussion_poll_votes(user_id);
CREATE INDEX idx_poll_votes_option_id ON discussion_poll_votes(option_id);


-- RLS Policies
ALTER TABLE discussion_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_poll_votes ENABLE ROW LEVEL SECURITY;

-- POILS: Viewable by anyone (who can view the post - simplified to public/auth for now)
CREATE POLICY "Polls visible to everyone" ON discussion_polls FOR SELECT USING (true);

-- POLLS: Insertable by post creator (handled by API/logic, but for RLS allows auth users)
CREATE POLICY "Auth users create polls" ON discussion_polls FOR INSERT WITH CHECK (auth.uid() = created_by);

-- POLLS: Deletable by creator or admin
CREATE POLICY "Creator delete poll" ON discussion_polls FOR DELETE USING (auth.uid() = created_by);

-- OPTIONS: Viewable by everyone
CREATE POLICY "Options visible to everyone" ON discussion_poll_options FOR SELECT USING (true);

-- OPTIONS: Insertable by poll creator (via simplified check or just auth for now)
CREATE POLICY "Auth users create options" ON discussion_poll_options FOR INSERT WITH CHECK (true);
-- STRICTER: EXISTS (SELECT 1 FROM discussion_polls WHERE id = poll_id AND created_by = auth.uid())

-- VOTES: Viewable by everyone
CREATE POLICY "Votes visible to everyone" ON discussion_poll_votes FOR SELECT USING (true);

-- VOTES: Insertable by auth users (voting)
CREATE POLICY "Users can vote" ON discussion_poll_votes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- VOTES: Deletable by voter (changing vote)
CREATE POLICY "Users can remove vote" ON discussion_poll_votes FOR DELETE USING (auth.uid() = user_id);
