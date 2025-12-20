-- Add slug column to news_items for SEO-friendly URLs
-- Backfill existing rows with slugified titles

-- 1. Add slug column
ALTER TABLE public.news_items ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. Create unique index (allows NULL but enforces uniqueness for non-NULL)
CREATE UNIQUE INDEX IF NOT EXISTS news_items_slug_unique ON public.news_items (slug) WHERE slug IS NOT NULL;

-- 3. Backfill existing rows with slugified titles
-- This creates a basic slug by:
-- - Converting to lowercase
-- - Replacing spaces with hyphens
-- - Removing special characters
-- - Appending ID to ensure uniqueness
UPDATE public.news_items 
SET slug = CONCAT(
    lower(
        regexp_replace(
            regexp_replace(
                regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'),  -- Remove special chars
                '\s+', '-', 'g'                                      -- Replace spaces with hyphens
            ),
            '-+', '-', 'g'                                           -- Collapse multiple hyphens
        )
    ),
    '-', id::text                                                    -- Append ID for uniqueness
)
WHERE slug IS NULL;

-- 4. Reload schema
NOTIFY pgrst, 'reload schema';
