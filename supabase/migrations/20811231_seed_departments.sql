-- Department Channels Seeding
-- Run after 20811227_geographic_channels.sql

-- =============================================
-- SEED DEPARTMENT CHANNELS
-- =============================================
-- Departments are top-level under Central Committee

INSERT INTO discussion_channels (
    name, name_ne, slug, description, visibility, access_type,
    location_type, location_value, can_create_subchannels,
    min_role_to_create_threads, parent_channel_id, category
)
SELECT 
    dept.name_en,
    dept.name_ne,
    dept.slug,
    'Department discussions for ' || dept.name_en,
    'party_only', 'role_based',
    'department', dept.slug, true,
    'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'central' LIMIT 1),
    'Council'
FROM (VALUES
    ('Organization Department', 'संगठन विभाग', 'organization'),
    ('Propaganda & Media Department', 'प्रचार तथा मिडिया विभाग', 'propaganda-media'),
    ('Finance Department', 'अर्थ विभाग', 'finance'),
    ('Youth Wing', 'युवा विभाग', 'youth'),
    ('Women''s Wing', 'महिला विभाग', 'women'),
    ('Education Department', 'शिक्षा विभाग', 'education'),
    ('Legal Department', 'कानुन विभाग', 'legal'),
    ('International Relations', 'अन्तर्राष्ट्रिय सम्बन्ध विभाग', 'international'),
    ('Ethnic Affairs Department', 'जातीय मामिला विभाग', 'ethnic-affairs'),
    ('Agriculture & Farmers Wing', 'कृषि तथा किसान विभाग', 'agriculture'),
    ('Labor & Workers Wing', 'श्रम तथा मजदुर विभाग', 'labor'),
    ('Dalit Rights Department', 'दलित अधिकार विभाग', 'dalit-rights')
) AS dept(name_en, name_ne, slug)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'department' AND location_value = dept.slug
);

COMMENT ON TABLE discussion_channels IS 'Discussion channels including geographic and department channels';
