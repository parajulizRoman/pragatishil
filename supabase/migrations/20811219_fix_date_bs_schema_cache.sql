-- Fix Schema Cache for date_bs
-- The column likely exists but PostgREST cache is stale.

-- 1) Idempotent valid check: ensure column exists (safe if already there)
ALTER TABLE public.news_items 
ADD COLUMN IF NOT EXISTS date_bs text;

COMMENT ON COLUMN public.news_items.date_bs IS 'Nepali Date (BS) in YYYY-MM-DD format';

-- 2) Force PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';
