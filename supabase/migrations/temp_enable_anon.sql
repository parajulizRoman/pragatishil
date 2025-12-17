-- Allow anonymous visitors to create threads in Khulla Manch for testing
UPDATE public.discussion_channels
SET min_role_to_create_threads = 'anonymous_visitor'
WHERE slug = 'khulla-manch';
