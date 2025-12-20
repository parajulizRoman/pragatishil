-- Safely add all potentially missing columns for News Items
ALTER TABLE public.news_items 
  ADD COLUMN IF NOT EXISTS author_name text,
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS title_ne text,
  ADD COLUMN IF NOT EXISTS summary_en text,
  ADD COLUMN IF NOT EXISTS summary_ne text,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'));

COMMENT ON COLUMN public.news_items.author_name IS 'Name of the reporter or author';

-- Force schema cache reload
NOTIFY pgrst, 'reload schema';
