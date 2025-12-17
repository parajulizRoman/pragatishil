-- Fix missing foreign key relationship between discussion_threads and profiles
-- This resolves the PGRST200 error when fetching thread authors.

BEGIN;

-- 1. Ensure the constraint doesn't already exist (or drop it to be safe/clean)
ALTER TABLE public.discussion_threads 
DROP CONSTRAINT IF EXISTS fk_thread_author_profile;

-- 2. Add the Foreign Key linking 'created_by' to 'profiles.id'
-- This explicitly tells PostgREST: "created_by points to a profile"
ALTER TABLE public.discussion_threads
ADD CONSTRAINT fk_thread_author_profile
FOREIGN KEY (created_by)
REFERENCES public.profiles (id)
ON DELETE SET NULL;

-- 3. Also fix discussion_posts just in case
ALTER TABLE public.discussion_posts
DROP CONSTRAINT IF EXISTS fk_post_author_profile;

ALTER TABLE public.discussion_posts
ADD CONSTRAINT fk_post_author_profile
FOREIGN KEY (author_id)
REFERENCES public.profiles (id)
ON DELETE SET NULL;

COMMIT;

-- Note: After running this, the API path "author:profiles!fk_thread_author_profile" 
-- or simply "author:profiles" should work.
