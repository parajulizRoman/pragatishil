-- Enable Users to Update and Delete Own Posts
-- Using "Soft Delete" strategy (deleted_at IS NOT NULL) if columns exist, otherwise hard delete permissions.
-- Based on finding `deleted_at` in GET queries, we assume soft delete columns exist or we should support them.

-- 1. Discussion Posts Policies
-- Allow UPDATE (for Editing content or soft deleting)
CREATE POLICY "Posts: Authors can update own posts"
ON discussion_posts
FOR UPDATE
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Allow DELETE (if we want hard delete capability, otherwise UPDATE covers soft delete)
CREATE POLICY "Posts: Authors can delete own posts"
ON discussion_posts
FOR DELETE
TO authenticated
USING (auth.uid() = author_id);


-- 2. Discussion Threads Policies
-- Allow UPDATE (for Editing title/body)
CREATE POLICY "Threads: Creators can update own threads"
ON discussion_threads
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Allow DELETE
CREATE POLICY "Threads: Creators can delete own threads"
ON discussion_threads
FOR DELETE
TO authenticated
USING (auth.uid() = created_by);
