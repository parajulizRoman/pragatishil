-- Ensure media_gallery columns exist and reload schema cache
-- Fixes "Could not find the 'alt_text' column of 'media_gallery' in the schema cache"

ALTER TABLE public.media_gallery
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS caption_ne TEXT,
ADD COLUMN IF NOT EXISTS alt_text TEXT,
ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image',
ADD COLUMN IF NOT EXISTS embed_url TEXT;

-- Verify/Update the constraint
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_gallery_media_type_check') THEN
        ALTER TABLE public.media_gallery 
        ADD CONSTRAINT media_gallery_media_type_check 
        CHECK (media_type IN ('image', 'video', 'document'));
    END IF;
END $$;

-- Correction: Use strictly NULL-safe checks for backfill
-- We only want to fill media_type where it is currently NULL and we have a legacy value
UPDATE public.media_gallery
SET media_type = type
WHERE type IS NOT NULL 
  AND media_type IS NULL;

-- Force PostgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';
