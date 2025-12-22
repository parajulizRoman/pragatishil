-- Fix the type column constraint in media_gallery
-- The 'type' column has a check constraint that's too restrictive

-- First, drop the existing type check constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_gallery_type_check') THEN
        ALTER TABLE public.media_gallery DROP CONSTRAINT media_gallery_type_check;
    END IF;
END $$;

-- Add a more permissive constraint or make type nullable
-- Option 1: Allow more type values
ALTER TABLE public.media_gallery 
    ALTER COLUMN type DROP NOT NULL;

-- Option 2: Or add a broader check constraint
-- ALTER TABLE public.media_gallery 
--     ADD CONSTRAINT media_gallery_type_check 
--     CHECK (type IN ('image', 'video', 'document', 'audio', 'Article', 'Interview', 'Video', 'Press Release'));

-- Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
