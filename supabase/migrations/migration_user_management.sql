-- Add is_banned column to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_banned ON public.profiles(is_banned);

-- Add updated_at if not exists (it should, but just safe check)
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Ensure RLS allows admin to update profiles (specifically role and is_banned)
-- Existing policies might be "Users can update own profile". 
-- We need "Admins can update ANY profile".

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE TO authenticated
    USING (
        public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik', 'board')
    )
    WITH CHECK (
        public.get_user_role(auth.uid()) IN ('admin', 'admin_party', 'yantrik', 'board')
    );
