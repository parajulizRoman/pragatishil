-- Advanced Social Features

-- 1. Thread Follows (Notifications)
CREATE TABLE IF NOT EXISTS public.discussion_follows (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    thread_id UUID NOT NULL REFERENCES public.discussion_threads(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY (user_id, thread_id)
);

-- 2. Saved Threads (Bookmarks)
CREATE TABLE IF NOT EXISTS public.discussion_saves (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    thread_id UUID NOT NULL REFERENCES public.discussion_threads(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY (user_id, thread_id)
);

-- 3. Hidden Threads (Ignore)
CREATE TABLE IF NOT EXISTS public.discussion_hides (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    thread_id UUID NOT NULL REFERENCES public.discussion_threads(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY (user_id, thread_id)
);

-- 4. Post Reactions (Emoji Awards)
CREATE TABLE IF NOT EXISTS public.discussion_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES public.discussion_posts(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, post_id, emoji) -- User can react with specific emoji once per post
);

-- Enable RLS
ALTER TABLE public.discussion_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_hides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_reactions ENABLE ROW LEVEL SECURITY;

-- Policies

-- Follows
CREATE POLICY "Users can manage their own follows"
ON public.discussion_follows FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Saves
CREATE POLICY "Users can manage their own saves"
ON public.discussion_saves FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Hides
CREATE POLICY "Users can manage their own hides"
ON public.discussion_hides FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Reactions
CREATE POLICY "Users can view all reactions"
ON public.discussion_reactions FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Users can insert their own reactions"
ON public.discussion_reactions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions"
ON public.discussion_reactions FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Notify Schema Reload
NOTIFY pgrst, 'reload schema';
