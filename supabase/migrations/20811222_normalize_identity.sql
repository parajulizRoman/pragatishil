-- ==========================================
-- Normalize Identity: members FK to profiles
-- ==========================================
-- Ensures members.auth_user_id is linked to profiles.id
-- and adds admin RLS policies for viewing all members.

BEGIN;

-- 1. Ensure auth_user_id column exists
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS auth_user_id UUID;

-- 2. Add FK constraint (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'members_auth_user_id_fkey'
  ) THEN
    ALTER TABLE public.members
    ADD CONSTRAINT members_auth_user_id_fkey
    FOREIGN KEY (auth_user_id) REFERENCES public.profiles(id)
    ON DELETE SET NULL;
  END IF;
END $$;

-- 3. Admin RLS: Admins can view all members
DROP POLICY IF EXISTS "Admins can view all members" ON public.members;
CREATE POLICY "Admins can view all members" ON public.members
    FOR SELECT TO authenticated
    USING (
        public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik', 'board', 'central_committee')
    );

-- 4. Admin RLS: Admins can update any member
DROP POLICY IF EXISTS "Admins can update all members" ON public.members;
CREATE POLICY "Admins can update all members" ON public.members
    FOR UPDATE TO authenticated
    USING (
        public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik', 'board', 'central_committee')
    );

-- 5. Index for FK performance
CREATE INDEX IF NOT EXISTS idx_members_auth_user_id ON public.members(auth_user_id);

-- 6. Ensure INSERT policy exists for authenticated users
DROP POLICY IF EXISTS "Authenticated users can insert own member" ON public.members;
CREATE POLICY "Authenticated users can insert own member" ON public.members
    FOR INSERT TO authenticated
    WITH CHECK (auth_user_id = auth.uid());

COMMIT;
