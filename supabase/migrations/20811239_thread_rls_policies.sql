-- Allow thread creator to delete their own thread
CREATE POLICY "Enable delete for users based on user_id" ON "discussion_threads"
FOR DELETE USING (auth.uid() = created_by);

-- Allow admins to delete any thread
-- Assuming admins are checked via role or direct policy. 
-- For simplicity, let's allow 'yantrik', 'admin', 'admin_party', 'moderator' to delete.
-- But standard policies might be cleaner.
-- Actually, let's keep it simple: creator can delete. ADMINS usually bypass RLS if they have service_role,
-- BUT if they are logged in as users, they need a policy.

CREATE POLICY "Enable delete for admins" ON "discussion_threads"
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'yantrik', 'admin_party')
  )
);

-- Allow thread creator to UPDATE their own thread (e.g. title)
CREATE POLICY "Enable update for users based on user_id" ON "discussion_threads"
FOR UPDATE USING (auth.uid() = created_by);

-- Allow admins to UPDATE any thread
CREATE POLICY "Enable update for admins" ON "discussion_threads"
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'yantrik', 'admin_party')
  )
);
