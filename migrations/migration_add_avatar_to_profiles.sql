-- Add avatar_url column to profiles table if it doesn't exist
DO $$ 
BEGIN
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
EXCEPTION
    WHEN undefined_table THEN
        -- If profiles table doesn't exist, create it (It should exist though!)
        CREATE TABLE public.profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            full_name TEXT,
            avatar_url TEXT,
            role user_role DEFAULT 'supporter',
            updated_at TIMESTAMPTZ DEFAULT now()
        );
END $$;
