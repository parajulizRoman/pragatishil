-- Fix Channel Hierarchy: Remove duplicate Pradesh 1 and move Chitwan under Bagmati
-- Run this in Supabase SQL Editor

-- =============================================================================
-- STEP 1: View all geographic channels
-- =============================================================================
SELECT 
    id, 
    name, 
    name_ne, 
    slug, 
    location_type, 
    location_value,
    parent_channel_id
FROM public.discussion_channels 
WHERE location_type IS NOT NULL 
   OR name LIKE '%Pradesh%' 
   OR name LIKE '%Province%'
   OR name LIKE '%प्रदेश%'
   OR name LIKE '%Chitwan%'
   OR name LIKE '%Bagmati%'
   OR name LIKE '%District%'
ORDER BY location_type, name;

-- =============================================================================
-- STEP 2: Find the Bagmati Pradesh channel ID
-- (Run this first to get the correct ID)
-- =============================================================================
-- SELECT id, name FROM discussion_channels WHERE name LIKE '%Bagmati%' OR location_value = 'bagmati';

-- =============================================================================
-- STEP 3: Delete duplicate Pradesh 1 (keep only one)
-- Replace 'duplicate-pradesh-1-id' with the actual ID of the duplicate
-- =============================================================================
-- First, move any threads from duplicate to the real Pradesh 1
-- UPDATE discussion_threads 
-- SET channel_id = '9e2f59e1-d3bf-4fd6-9b97-d4219b1e1222'  -- Real Pradesh 1
-- WHERE channel_id = 'duplicate-pradesh-1-id';             -- Duplicate Pradesh 1

-- Then delete the duplicate channel
-- DELETE FROM discussion_channels WHERE id = 'duplicate-pradesh-1-id';

-- =============================================================================
-- STEP 4: Create Bagmati Pradesh if it doesn't exist
-- =============================================================================
INSERT INTO public.discussion_channels (
    name, name_ne, slug, description,
    visibility, category, location_type, location_value,
    allow_anonymous_posts, min_role_to_post, min_role_to_create_threads,
    min_role_to_comment, min_role_to_vote
)
SELECT 
    'Bagmati Province', 'बागमती प्रदेश', 'bagmati-province', 'Bagmati Province discussions',
    'party_only', 'Council', 'state', 'bagmati',
    false, 'party_member', 'party_member',
    'party_member', 'party_member'
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_value = 'bagmati' OR slug = 'bagmati-province'
);

-- =============================================================================
-- STEP 5: Move Chitwan District under Bagmati Pradesh
-- =============================================================================
-- First, get Bagmati Pradesh ID
WITH bagmati AS (
    SELECT id FROM discussion_channels 
    WHERE location_value = 'bagmati' OR slug = 'bagmati-province'
    LIMIT 1
)
UPDATE discussion_channels
SET parent_channel_id = (SELECT id FROM bagmati)
WHERE name LIKE '%Chitwan%' OR slug LIKE '%chitwan%';

-- =============================================================================
-- STEP 6: Verify the result
-- =============================================================================
SELECT 
    c.id, 
    c.name, 
    c.slug, 
    c.location_type,
    c.parent_channel_id,
    p.name as parent_name
FROM discussion_channels c
LEFT JOIN discussion_channels p ON p.id = c.parent_channel_id
WHERE c.location_type IS NOT NULL
ORDER BY c.location_type, c.name;
