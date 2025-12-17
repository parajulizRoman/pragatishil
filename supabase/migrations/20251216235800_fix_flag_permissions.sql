-- Enable RLS (Should already be enabled, but safe to repeat)
ALTER TABLE public.discussion_flags ENABLE ROW LEVEL SECURITY;

-- 1. INSERT: Allow any authenticated user to flag content
CREATE POLICY "Users can flag content" ON public.discussion_flags
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = flagged_by);

-- 2. SELECT: Allow Admins and Moderators to view flags
CREATE POLICY "Admins can view flags" ON public.discussion_flags
    FOR SELECT
    USING (
        public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik')
    );

-- 3. UPDATE: Allow Admins and Moderators to resolve flags
CREATE POLICY "Admins can resolve flags" ON public.discussion_flags
    FOR UPDATE
    USING (
        public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik')
    );
