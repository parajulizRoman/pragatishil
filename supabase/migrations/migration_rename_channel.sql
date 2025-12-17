-- Rename General Chautari to Khulla Manch
UPDATE public.discussion_channels
SET 
    slug = 'khulla-manch',
    name = 'Khulla Manch',
    name_ne = 'खुल्ला मञ्च'
WHERE slug = 'general-chautari';
