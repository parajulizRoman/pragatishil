-- Geographic Channels Seeding: Districts and Municipalities
-- Based on nepal_local_levels_master.csv
-- Run after 20811227_geographic_channels.sql

-- =============================================
-- PART 1: Seed Districts (77 total)
-- =============================================

-- Koshi Province Districts (14 districts)
INSERT INTO discussion_channels (name, name_ne, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT 
    district_data.name_en || ' District',
    district_data.name_ne,
    LOWER(REPLACE(district_data.name_en, ' ', '-')),
    'District-level discussions for ' || district_data.name_en,
    'party_only', 'role_based',
    'district', LOWER(REPLACE(district_data.name_en, ' ', '-')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'state' AND location_value = 'koshi' LIMIT 1)
FROM (VALUES
    ('Bhojpur', 'भोजपुर'),
    ('Dhankuta', 'धनकुटा'),
    ('Ilam', 'इलाम'),
    ('Jhapa', 'झापा'),
    ('Khotang', 'खोटाङ'),
    ('Morang', 'मोरङ'),
    ('Okhaldhunga', 'ओखलढुंगा'),
    ('Panchthar', 'पाँचथर'),
    ('Sankhuwasabha', 'संखुवासभा'),
    ('Solukhumbu', 'सोलुखुम्बु'),
    ('Sunsari', 'सुनसरी'),
    ('Taplejung', 'ताप्लेजुङ'),
    ('Terhathum', 'तेह्रथुम'),
    ('Udayapur', 'उदयपुर')
) AS district_data(name_en, name_ne)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'district' AND location_value = LOWER(REPLACE(district_data.name_en, ' ', '-'))
);

-- Madhesh Province Districts (8 districts)
INSERT INTO discussion_channels (name, name_ne, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT 
    district_data.name_en || ' District',
    district_data.name_ne,
    LOWER(REPLACE(district_data.name_en, ' ', '-')),
    'District-level discussions for ' || district_data.name_en,
    'party_only', 'role_based',
    'district', LOWER(REPLACE(district_data.name_en, ' ', '-')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'state' AND location_value = 'madhesh' LIMIT 1)
FROM (VALUES
    ('Parsa', 'पर्सा'),
    ('Bara', 'बारा'),
    ('Rautahat', 'रौतहट'),
    ('Sarlahi', 'सर्लाही'),
    ('Siraha', 'सिराहा'),
    ('Dhanusha', 'धनुषा'),
    ('Saptari', 'सप्तरी'),
    ('Mahottari', 'महोत्तरी')
) AS district_data(name_en, name_ne)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'district' AND location_value = LOWER(REPLACE(district_data.name_en, ' ', '-'))
);

-- Bagmati Province Districts (13 districts)
INSERT INTO discussion_channels (name, name_ne, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT 
    district_data.name_en || ' District',
    district_data.name_ne,
    LOWER(REPLACE(district_data.name_en, ' ', '-')),
    'District-level discussions for ' || district_data.name_en,
    'party_only', 'role_based',
    'district', LOWER(REPLACE(district_data.name_en, ' ', '-')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'state' AND location_value = 'bagmati' LIMIT 1)
FROM (VALUES
    ('Bhaktapur', 'भक्तपुर'),
    ('Chitwan', 'चितवन'),
    ('Dhading', 'धादिङ'),
    ('Dolakha', 'दोलखा'),
    ('Kathmandu', 'काठमाडौं'),
    ('Kavrepalanchok', 'काभ्रेपलाञ्चोक'),
    ('Lalitpur', 'ललितपुर'),
    ('Makwanpur', 'मकवानपुर'),
    ('Nuwakot', 'नुवाकोट'),
    ('Ramechhap', 'रामेछाप'),
    ('Rasuwa', 'रसुवा'),
    ('Sindhuli', 'सिन्धुली'),
    ('Sindhupalchok', 'सिन्धुपाल्चोक')
) AS district_data(name_en, name_ne)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'district' AND location_value = LOWER(REPLACE(district_data.name_en, ' ', '-'))
);

-- Gandaki Province Districts (11 districts)
INSERT INTO discussion_channels (name, name_ne, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT 
    district_data.name_en || ' District',
    district_data.name_ne,
    LOWER(REPLACE(district_data.name_en, ' ', '-')),
    'District-level discussions for ' || district_data.name_en,
    'party_only', 'role_based',
    'district', LOWER(REPLACE(district_data.name_en, ' ', '-')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'state' AND location_value = 'gandaki' LIMIT 1)
FROM (VALUES
    ('Baglung', 'बागलुङ'),
    ('Gorkha', 'गोरखा'),
    ('Kaski', 'कास्की'),
    ('Lamjung', 'लमजुङ'),
    ('Manang', 'मनाङ'),
    ('Mustang', 'मुस्ताङ'),
    ('Myagdi', 'म्याग्दी'),
    ('Nawalpur', 'नवलपुर'),
    ('Parbat', 'पर्वत'),
    ('Syangja', 'स्याङ्जा'),
    ('Tanahun', 'तनहुँ')
) AS district_data(name_en, name_ne)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'district' AND location_value = LOWER(REPLACE(district_data.name_en, ' ', '-'))
);

-- Lumbini Province Districts (12 districts)
INSERT INTO discussion_channels (name, name_ne, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT 
    district_data.name_en || ' District',
    district_data.name_ne,
    LOWER(REPLACE(district_data.name_en, ' ', '-')),
    'District-level discussions for ' || district_data.name_en,
    'party_only', 'role_based',
    'district', LOWER(REPLACE(district_data.name_en, ' ', '-')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'state' AND location_value = 'lumbini' LIMIT 1)
FROM (VALUES
    ('Kapilvastu', 'कपिलवस्तु'),
    ('Parasi', 'परासी'),
    ('Rupandehi', 'रुपन्देही'),
    ('Arghakhanchi', 'अर्घाखाँची'),
    ('Gulmi', 'गुल्मी'),
    ('Palpa', 'पाल्पा'),
    ('Dang', 'दाङ'),
    ('Pyuthan', 'प्युठान'),
    ('Rolpa', 'रोल्पा'),
    ('Eastern Rukum', 'पूर्वी रुकुम'),
    ('Banke', 'बाँके'),
    ('Bardiya', 'बर्दिया')
) AS district_data(name_en, name_ne)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'district' AND location_value = LOWER(REPLACE(district_data.name_en, ' ', '-'))
);

-- Karnali Province Districts (10 districts)
INSERT INTO discussion_channels (name, name_ne, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT 
    district_data.name_en || ' District',
    district_data.name_ne,
    LOWER(REPLACE(district_data.name_en, ' ', '-')),
    'District-level discussions for ' || district_data.name_en,
    'party_only', 'role_based',
    'district', LOWER(REPLACE(district_data.name_en, ' ', '-')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'state' AND location_value = 'karnali' LIMIT 1)
FROM (VALUES
    ('Western Rukum', 'पश्चिमी रुकुम'),
    ('Salyan', 'सल्यान'),
    ('Dolpa', 'डोल्पा'),
    ('Humla', 'हुम्ला'),
    ('Jumla', 'जुम्ला'),
    ('Kalikot', 'कालिकोट'),
    ('Mugu', 'मुगु'),
    ('Surkhet', 'सुर्खेत'),
    ('Dailekh', 'दैलेख'),
    ('Jajarkot', 'जाजरकोट')
) AS district_data(name_en, name_ne)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'district' AND location_value = LOWER(REPLACE(district_data.name_en, ' ', '-'))
);

-- Sudurpashchim Province Districts (9 districts)
INSERT INTO discussion_channels (name, name_ne, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT 
    district_data.name_en || ' District',
    district_data.name_ne,
    LOWER(REPLACE(district_data.name_en, ' ', '-')),
    'District-level discussions for ' || district_data.name_en,
    'party_only', 'role_based',
    'district', LOWER(REPLACE(district_data.name_en, ' ', '-')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'state' AND location_value = 'sudurpashchim' LIMIT 1)
FROM (VALUES
    ('Darchula', 'दार्चुला'),
    ('Bajhang', 'बझाङ'),
    ('Bajura', 'बाजुरा'),
    ('Baitadi', 'बैतडी'),
    ('Doti', 'डोटी'),
    ('Achham', 'अछाम'),
    ('Dadeldhura', 'डडेल्धुरा'),
    ('Kanchanpur', 'कञ्चनपुर'),
    ('Kailali', 'कैलाली')
) AS district_data(name_en, name_ne)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'district' AND location_value = LOWER(REPLACE(district_data.name_en, ' ', '-'))
);

-- =============================================
-- PART 2: Read-Down RLS Policies
-- =============================================
-- Allow members of parent channels to read child channel threads

-- Helper function to check if user has access to a channel through hierarchy
CREATE OR REPLACE FUNCTION has_hierarchical_read_access(
    p_user_id UUID,
    p_channel_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_channel RECORD;
    v_parent_id UUID;
BEGIN
    -- Check direct membership first
    IF EXISTS (
        SELECT 1 FROM channel_members 
        WHERE channel_id = p_channel_id AND user_id = p_user_id
    ) THEN
        RETURN TRUE;
    END IF;
    
    -- Get channel info
    SELECT * INTO v_channel FROM discussion_channels WHERE id = p_channel_id;
    IF NOT FOUND THEN RETURN FALSE; END IF;
    
    -- Walk up the hierarchy to check parent membership
    v_parent_id := v_channel.parent_channel_id;
    
    WHILE v_parent_id IS NOT NULL LOOP
        -- If user is member of any parent, they have read access
        IF EXISTS (
            SELECT 1 FROM channel_members 
            WHERE channel_id = v_parent_id AND user_id = p_user_id
        ) THEN
            RETURN TRUE;
        END IF;
        
        -- Move to next parent
        SELECT parent_channel_id INTO v_parent_id 
        FROM discussion_channels WHERE id = v_parent_id;
    END LOOP;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policy: Allow reading threads if user has hierarchical access
DROP POLICY IF EXISTS "hierarchical_read_threads" ON discussion_threads;
CREATE POLICY "hierarchical_read_threads"
ON discussion_threads
FOR SELECT
TO authenticated
USING (
    has_hierarchical_read_access(auth.uid(), channel_id)
);

-- RLS Policy: Allow reading messages if user has hierarchical access to thread's channel
DROP POLICY IF EXISTS "hierarchical_read_messages" ON discussion_messages;
CREATE POLICY "hierarchical_read_messages"
ON discussion_messages
FOR SELECT
TO authenticated
USING (
    has_hierarchical_read_access(
        auth.uid(), 
        (SELECT channel_id FROM discussion_threads WHERE id = thread_id)
    )
);

COMMENT ON FUNCTION has_hierarchical_read_access IS 'Check if user can read a channel through direct membership or parent channel membership (read-down access)';
