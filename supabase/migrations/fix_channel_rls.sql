-- Create a comprehensive RLS for channels
BEGIN;

-- 1. Enable RLS on Channels (ensure it is on)
ALTER TABLE discussion_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_channel_resources ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts/duplicates
DROP POLICY IF EXISTS "Public channels are viewable by everyone" ON discussion_channels;
DROP POLICY IF EXISTS "Admins can insert channels" ON discussion_channels;
DROP POLICY IF EXISTS "Admins can update channels" ON discussion_channels;
DROP POLICY IF EXISTS "Authenticated users can view resources" ON discussion_channel_resources;
DROP POLICY IF EXISTS "Everyone can view public channel resources" ON discussion_channel_resources;
-- (Drop generic ones if they exist)
DROP POLICY IF EXISTS "Enable read access for all users" ON discussion_channels;
DROP POLICY IF EXISTS "Enable read access for all users" ON discussion_channel_resources;

-- 3. Channel SELECT Policy
-- Logic:
-- Public: Everyone
-- Logged In: Authenticated
-- Party Only: Role >= party_member (managed by app logic mostly, but RLS can enforce basic auth)
-- For simplicity, we allow Authenticated users to see ALL channels in the list, 
-- and let the Application Layer handle "Hidden" channels if needed. 
-- But for "Public" visibility, anon should see it.
CREATE POLICY "Channels Select Policy" ON discussion_channels
    FOR SELECT
    USING (
        visibility = 'public' 
        OR 
        (auth.role() = 'authenticated')
    );

-- 4. Channel INSERT/UPDATE/DELETE Policy (Admins Only)
-- We use a simplified check for admins. 
-- Ideally we check profiles.role, but for now we trust the Service Role (admin client) mostly.
-- However, if using Client-side checks with RLS:
CREATE POLICY "Admins can manage channels" ON discussion_channels
    FOR ALL
    USING (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role in ('admin', 'admin_party', 'yantrik', 'central_committee', 'board')
        )
    );

-- 5. Resources SELECT Policy
-- Allow view if the parent channel is viewable. 
-- Since joins in RLS are expensive, we can use a simpler heuristic or just allow all for now if not sensitive.
-- Better: Allow if channel is public OR auth.role() = authenticated.
CREATE POLICY "Resources Select Policy" ON discussion_channel_resources
    FOR SELECT
    USING (
        exists (
            select 1 from discussion_channels c
            where c.id = discussion_channel_resources.channel_id
            and (c.visibility = 'public' OR auth.role() = 'authenticated')
        )
    );

-- 6. Resources Manage Policy
CREATE POLICY "Admins can manage resources" ON discussion_channel_resources
    FOR ALL
    USING (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role in ('admin', 'admin_party', 'yantrik', 'central_committee', 'board')
        )
    );

COMMIT;
