-- Add missing full_name column to profiles
-- Fixes error 42703: column profiles_1.full_name does not exist

BEGIN;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Optional: Populate it with something if empty, e.g. from email (requires complex logic, maybe skip for now)
-- UPDATE public.profiles SET full_name = 'User ' || substr(id::text, 1, 4) WHERE full_name IS NULL;

COMMIT;
