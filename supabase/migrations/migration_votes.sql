-- Create Votes Table
CREATE TABLE IF NOT EXISTS public.discussion_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.discussion_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vote_type INTEGER NOT NULL CHECK (vote_type IN (1, -1)), -- 1 = up, -1 = down
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(post_id, user_id)
);

-- Enable RLS
ALTER TABLE public.discussion_votes ENABLE ROW LEVEL SECURITY;

-- Policies

-- 1. View Votes: Visible to everyone who can see the post (simplification: public for now, or authenticated)
-- Actually, granular visibility depends on the channel, but for votes, viewing aggregated counts is usually public,
-- and viewing your own vote is private.
-- For simplicity, let's allow authenticated users to select their own votes.
CREATE POLICY "Users can view their own votes"
ON public.discussion_votes FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2. Create/Update Votes: Authenticated users can vote
CREATE POLICY "Users can insert their own votes"
ON public.discussion_votes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
ON public.discussion_votes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Delete Votes: Users can remove their vote
CREATE POLICY "Users can delete their own votes"
ON public.discussion_votes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Reload Schema Cache
NOTIFY pgrst, 'reload schema';
