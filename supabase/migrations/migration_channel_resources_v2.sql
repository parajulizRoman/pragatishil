-- 1) Extend channels
ALTER TABLE public.discussion_channels
    ADD COLUMN IF NOT EXISTS readme_content text,
    ADD COLUMN IF NOT EXISTS is_archived boolean DEFAULT false;

-- 2) Create resources table
CREATE TABLE IF NOT EXISTS public.discussion_channel_resources (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    channel_id uuid REFERENCES public.discussion_channels(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    type text NOT NULL CHECK (type IN ('doc', 'video', 'link', 'impact', 'other')),
    url text NOT NULL,
    description text,
    created_at timestamptz DEFAULT now() NOT NULL,
    created_by uuid REFERENCES public.profiles(id)
);

-- 3) Indexes
CREATE INDEX IF NOT EXISTS idx_channel_resources_channel_id
  ON public.discussion_channel_resources(channel_id);

CREATE INDEX IF NOT EXISTS idx_channel_resources_channel_id_type
  ON public.discussion_channel_resources(channel_id, type);

-- 4) RLS
ALTER TABLE public.discussion_channel_resources ENABLE ROW LEVEL SECURITY;

-- View policy
DROP POLICY IF EXISTS "Resources: View" ON public.discussion_channel_resources;

CREATE POLICY "Resources: View" ON public.discussion_channel_resources
    FOR SELECT TO public
    USING (
        EXISTS (
            SELECT 1 FROM public.discussion_channels c
            WHERE c.id = channel_id
            AND (
                c.visibility = 'public' OR
                (auth.role() = 'authenticated' AND (
                    c.visibility = 'logged_in' OR 
                    (
                        c.visibility = 'party_only'
                        AND public.get_user_role(auth.uid()) IN (
                            'party_member',
                            'admin_party',
                            'yantrik',
                            'admin',
                            'board',
                            'central_committee',
                            'team_member',
                            'volunteer'
                        )
                    )
                ))
            )
        )
    );

-- Manage policy
DROP POLICY IF EXISTS "Resources: Manage" ON public.discussion_channel_resources;

CREATE POLICY "Resources: Manage" ON public.discussion_channel_resources
    FOR ALL TO authenticated
    USING (
        public.get_user_role(auth.uid()) IN ('admin_party', 'yantrik', 'admin', 'board')
    )
    WITH CHECK (
        public.get_user_role(auth.uid()) IN ('admin_party', 'yantrik', 'admin', 'board')
    );
