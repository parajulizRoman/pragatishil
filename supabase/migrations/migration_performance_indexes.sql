-- Add missing indexes for Foreign Keys to improve join performance
-- These keys are used heavily in RLS policies and channel page queries.

CREATE INDEX IF NOT EXISTS idx_discussion_threads_channel_id 
ON public.discussion_threads(channel_id);

CREATE INDEX IF NOT EXISTS idx_discussion_posts_thread_id 
ON public.discussion_posts(thread_id);

-- Also index the 'created_by' / 'author_id' fields as they are used in RLS checks (auth.uid() = author_id)
CREATE INDEX IF NOT EXISTS idx_discussion_threads_created_by 
ON public.discussion_threads(created_by);

CREATE INDEX IF NOT EXISTS idx_discussion_posts_author_id 
ON public.discussion_posts(author_id);

-- Discussion Channels Slug is already indexed by UNIQUE constraint, but let's ensure 'visibility' is indexed
-- as it is used in every RLS policy.
CREATE INDEX IF NOT EXISTS idx_discussion_channels_visibility 
ON public.discussion_channels(visibility);
