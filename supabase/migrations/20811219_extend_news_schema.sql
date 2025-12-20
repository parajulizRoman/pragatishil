-- 1) Extend news_items table (Idempotent)
ALTER TABLE public.news_items
  ADD COLUMN IF NOT EXISTS body_en text,
  ADD COLUMN IF NOT EXISTS body_ne text,
  ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS "references" jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS thread_id uuid,
  ADD COLUMN IF NOT EXISTS date_bs text;

COMMENT ON COLUMN public.news_items.date_bs IS 'Nepali Date (BS) in YYYY-MM-DD format';

-- 2) FK for thread_id (if not already there)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'news_items_thread_id_fkey'
      AND conrelid = 'public.news_items'::regclass
  ) THEN
    ALTER TABLE public.news_items
    ADD CONSTRAINT news_items_thread_id_fkey
    FOREIGN KEY (thread_id)
    REFERENCES public.discussion_threads(id)
    ON DELETE SET NULL;
  END IF;
END $$;

-- 3) Ensure news-comments channel exists
-- Visibility: public (anyone can read), Post: member+
INSERT INTO public.discussion_channels (
  slug,
  name,
  description,
  visibility,
  min_role_to_post,
  min_role_to_create_threads,
  min_role_to_comment,
  min_role_to_vote,
  allow_anonymous_posts
) VALUES (
  'news-comments',
  'News & Articles Comments',
  'Discussion area for comments on official news and media articles.',
  'public',
  'member',
  'member',
  'member',
  'party_member',
  false
)
ON CONFLICT (slug) DO NOTHING;

-- 4) Reload Schema
NOTIFY pgrst, 'reload schema';
