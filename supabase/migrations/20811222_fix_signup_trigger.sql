-- ==========================================
-- FIX: handle_new_user trigger function
-- ==========================================
-- Problem: The function was using 'supporter' which is not a valid 
-- value in the user_role enum (was renamed to 'member').
-- This caused new user signups to fail.

-- 1. Recreate the function with the correct enum value
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    'member'::user_role  -- Use valid enum value
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Ensure trigger exists (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Backfill any auth.users that don't have profiles
INSERT INTO public.profiles (id, full_name, avatar_url, role)
SELECT 
    u.id,
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'avatar_url',
    'member'::user_role
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id)
ON CONFLICT (id) DO NOTHING;

-- 4. FIX RLS: Add INSERT policy for profiles
-- Problem: No INSERT policy existed, so trigger couldn't create profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow trigger insert" ON public.profiles;
DROP POLICY IF EXISTS "Profiles Insert Self" ON public.profiles;

CREATE POLICY "Profiles Insert Self"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';

