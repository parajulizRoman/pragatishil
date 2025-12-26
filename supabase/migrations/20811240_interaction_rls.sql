-- RLS Policies for Interactions

-- 1. Votes (discussion_votes)
ALTER TABLE discussion_votes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view votes (public)
CREATE POLICY "Public view votes" ON discussion_votes FOR SELECT USING (true);

-- Allow authenticated users to cast vote
CREATE POLICY "Authenticated insert vote" ON discussion_votes
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own vote
CREATE POLICY "User update own vote" ON discussion_votes
FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to remove their own vote
CREATE POLICY "User delete own vote" ON discussion_votes
FOR DELETE USING (auth.uid() = user_id);


-- 2. Flags (discussion_flags)
ALTER TABLE discussion_flags ENABLE ROW LEVEL SECURITY;

-- Allow admins to view flags
CREATE POLICY "Admins view flags" ON discussion_flags
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'yantrik', 'admin_party')
  )
);

-- Allow authenticated users to flag content
CREATE POLICY "Authenticated insert flag" ON discussion_flags
FOR INSERT WITH CHECK (auth.uid() = flagged_by);

-- 3. Reactions (discussion_reactions)
ALTER TABLE discussion_reactions ENABLE ROW LEVEL SECURITY;

-- Public view reactions
CREATE POLICY "Public view reactions" ON discussion_reactions FOR SELECT USING (true);

-- Users manage their own reactions
CREATE POLICY "User manage reactions" ON discussion_reactions
FOR ALL USING (auth.uid() = user_id);


-- 4. Saves / Follows / Hides
ALTER TABLE discussion_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User manage saves" ON discussion_saves FOR ALL USING (auth.uid() = user_id);

ALTER TABLE discussion_follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User manage follows" ON discussion_follows FOR ALL USING (auth.uid() = user_id);

ALTER TABLE discussion_hides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User manage hides" ON discussion_hides FOR ALL USING (auth.uid() = user_id);
