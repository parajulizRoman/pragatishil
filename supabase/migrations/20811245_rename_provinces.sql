-- Rename Koshi Pradesh to Pradesh 1
-- This updates the channel name to use the official numbering system

UPDATE public.discussion_channels
SET 
    name = 'Province 1',
    name_ne = 'प्रदेश १'
WHERE 
    name = 'Koshi Pradesh' 
    OR name_ne = 'कोशी प्रदेश'
    OR location_value = 'koshi';

-- Also update any other provinces that might use old names
UPDATE public.discussion_channels
SET 
    name = 'Province 2',
    name_ne = 'प्रदेश २'
WHERE 
    name = 'Madhesh Pradesh' 
    OR name_ne = 'मधेश प्रदेश';

UPDATE public.discussion_channels
SET 
    name = 'Bagmati Province',
    name_ne = 'बागमती प्रदेश'
WHERE 
    location_value = 'bagmati';

UPDATE public.discussion_channels
SET 
    name = 'Gandaki Province',
    name_ne = 'गण्डकी प्रदेश'
WHERE 
    location_value = 'gandaki';

UPDATE public.discussion_channels
SET 
    name = 'Lumbini Province',
    name_ne = 'लुम्बिनी प्रदेश'
WHERE 
    location_value = 'lumbini';

UPDATE public.discussion_channels
SET 
    name = 'Karnali Province',
    name_ne = 'कर्णाली प्रदेश'
WHERE 
    location_value = 'karnali';

UPDATE public.discussion_channels
SET 
    name = 'Sudurpashchim Province',
    name_ne = 'सुदूरपश्चिम प्रदेश'
WHERE 
    location_value = 'sudurpashchim';

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';
