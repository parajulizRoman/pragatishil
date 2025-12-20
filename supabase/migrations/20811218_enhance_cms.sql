-- Enhancement for CMS: News, Media and Audit Logs
-- Branch: admin-cms-panel

-- 1. Extend action_type enum (if using enum)
-- Checking if it exists first
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'action_type') THEN
        ALTER TYPE action_type ADD VALUE IF NOT EXISTS 'UPDATE_SITE_CONTENT';
        ALTER TYPE action_type ADD VALUE IF NOT EXISTS 'MANAGE_NEWS';
        ALTER TYPE action_type ADD VALUE IF NOT EXISTS 'MANAGE_MEDIA';
    END IF;
END $$;

-- 2. Enhance audit_logs with data snapshots and reason
ALTER TABLE public.audit_logs 
ADD COLUMN IF NOT EXISTS old_data JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS new_data JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS reason TEXT DEFAULT NULL;

-- 3. Update news_items for i18n and lifecycle
ALTER TABLE public.news_items 
ADD COLUMN IF NOT EXISTS title_ne TEXT,
ADD COLUMN IF NOT EXISTS summary_en TEXT,
ADD COLUMN IF NOT EXISTS summary_ne TEXT,
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS author_name TEXT;

-- Data migration for News
UPDATE public.news_items 
SET status = 'published',
    published_at = created_at
WHERE is_published = true AND (status = 'draft' OR status IS NULL);

-- 4. Update media_gallery for i18n and accessibility
ALTER TABLE public.media_gallery
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS caption_ne TEXT,
ADD COLUMN IF NOT EXISTS alt_text TEXT,
ADD COLUMN IF NOT EXISTS media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video', 'document')),
ADD COLUMN IF NOT EXISTS embed_url TEXT;

-- Data migration for Media
UPDATE public.media_gallery 
SET media_type = CASE 
    WHEN type = 'video' THEN 'video'::text 
    ELSE 'image'::text 
END
WHERE media_type = 'image'; -- Default fallback
