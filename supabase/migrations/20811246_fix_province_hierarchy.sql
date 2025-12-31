-- Fix Pradesh 1 channel to have proper location_type
-- This ensures it appears correctly in the tree structure

-- First, let's see what we have
-- SELECT id, name, name_ne, location_type, location_value, parent_channel_id 
-- FROM discussion_channels WHERE name LIKE '%प्रदेश%' OR name LIKE '%Pradesh%' OR name LIKE '%Province%';

-- Fix Pradesh 1 (Province 1) to have correct location_type
UPDATE public.discussion_channels
SET 
    location_type = 'state',
    location_value = 'province-1'
WHERE 
    id = '9e2f59e1-d3bf-4fd6-9b97-d4219b1e1222'
    OR name_ne = 'प्रदेश १'
    OR name = 'Province 1';

-- Verify that Chitwan District's parent_channel_id points to Pradesh 1
-- If Chitwan (parent_channel_id: 3a527e07-a293-428d-a795-df4ff95ab2d0) should be under Pradesh 1,
-- we need to update its parent:
-- UPDATE public.discussion_channels
-- SET parent_channel_id = '9e2f59e1-d3bf-4fd6-9b97-d4219b1e1222'
-- WHERE id = 'f5f61ab0-b68c-4f84-96fa-fd837d254f67'; -- Chitwan District

-- Check which channels exist and their hierarchy
SELECT 
    id, 
    name, 
    name_ne, 
    location_type, 
    location_value,
    parent_channel_id
FROM public.discussion_channels 
WHERE location_type IS NOT NULL 
   OR name LIKE '%Pradesh%' 
   OR name LIKE '%Province%'
   OR name LIKE '%District%'
ORDER BY location_type, name;
