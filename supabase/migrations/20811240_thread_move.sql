-- Thread Move Feature
-- Allows moderators to move threads to different channels (like Stack Overflow migration)

-- =============================================================================
-- 1. ADD MOVE TRACKING COLUMNS TO THREADS
-- =============================================================================

-- Add columns to track moved threads
ALTER TABLE public.discussion_threads
ADD COLUMN IF NOT EXISTS moved_from_channel_id UUID REFERENCES discussion_channels(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS moved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS moved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS move_reason TEXT;

-- Index for finding moved threads
CREATE INDEX IF NOT EXISTS idx_threads_moved_from ON public.discussion_threads(moved_from_channel_id) WHERE moved_from_channel_id IS NOT NULL;

-- =============================================================================
-- 2. CREATE THREAD MOVE HISTORY TABLE (for multiple moves)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.thread_move_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES discussion_threads(id) ON DELETE CASCADE,
    from_channel_id UUID NOT NULL REFERENCES discussion_channels(id) ON DELETE CASCADE,
    to_channel_id UUID NOT NULL REFERENCES discussion_channels(id) ON DELETE CASCADE,
    moved_by UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
    move_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.thread_move_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for thread_move_history
DROP POLICY IF EXISTS "thread_move_history_select" ON public.thread_move_history;
CREATE POLICY "thread_move_history_select" ON public.thread_move_history
    FOR SELECT TO authenticated
    USING (true);  -- Anyone can see move history

DROP POLICY IF EXISTS "thread_move_history_insert" ON public.thread_move_history;
CREATE POLICY "thread_move_history_insert" ON public.thread_move_history
    FOR INSERT TO authenticated
    WITH CHECK (
        public.get_user_role(auth.uid()) IN (
            'admin', 'yantrik', 'admin_party', 'board', 'central_committee'
        )
    );

-- Index for looking up history by thread
CREATE INDEX IF NOT EXISTS idx_thread_move_history_thread ON public.thread_move_history(thread_id);

-- =============================================================================
-- 3. REFRESH SCHEMA CACHE
-- =============================================================================
NOTIFY pgrst, 'reload schema';
