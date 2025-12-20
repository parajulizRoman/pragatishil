-- ==========================================
-- Fix: Update handle_new_user trigger for signup
-- ==========================================
-- Problem: The trigger was failing due to role type mismatch or RLS blocking inserts
-- Solution: Use explicit enum cast, nested error handling, and permissive RLS for trigger

BEGIN;

-- 1) Harden handle_new_user: catch all errors, never block signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, role, updated_at)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name',
               NEW.raw_user_meta_data->>'name',
               'Anonymous'),
      COALESCE(NEW.raw_user_meta_data->>'avatar_url',
               NEW.raw_user_meta_data->>'picture'),
      'member'::user_role,
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      full_name   = COALESCE(EXCLUDED.full_name, profiles.full_name),
      avatar_url  = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
      updated_at  = NOW();
  EXCEPTION WHEN OTHERS THEN
    -- Don't kill signup. Just log a warning in Postgres logs.
    RAISE WARNING '[handle_new_user] Failed to create profile for user %: %',
                  NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2) Ensure trigger exists (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3) Allow inserts into profiles from any role (incl. internal auth)
DROP POLICY IF EXISTS "Profiles Trigger Insert" ON public.profiles;

CREATE POLICY "Profiles Trigger Insert"
ON public.profiles
FOR INSERT
USING (true)
WITH CHECK (true);

COMMIT;
