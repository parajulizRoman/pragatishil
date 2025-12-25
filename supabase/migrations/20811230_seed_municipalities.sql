-- Municipalities Seeding (754 municipalities)
-- Auto-generated from nepal_local_levels_master.csv
-- Run after 20811229_seed_districts_rls.sql

-- =============================================
-- MUNICIPALITIES
-- =============================================

-- Bhojpur District (9 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'bhojpur' LIMIT 1)
FROM (VALUES
    ('Bhojpur Municipality'),
    ('Shadanand Municipality'),
    ('Aamchok Rural Municipality'),
    ('Arun Rural Municipality'),
    ('Hatuwagadhi Rural Municipality'),
    ('Pauwadungma Rural Municipality'),
    ('Ramprasad Rai Rural Municipality'),
    ('Salpasilichho Rural Municipality'),
    ('Tyamke Maiyum Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Dhankuta District (7 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'dhankuta' LIMIT 1)
FROM (VALUES
    ('Dhankuta Municipality'),
    ('Mahalaxmi Municipality'),
    ('Pakhribas Municipality'),
    ('Chaubise Rural Municipality'),
    ('Chhathar Jorpati Rural Municipality'),
    ('Sahidbhumi Rural Municipality'),
    ('Sangurigadhi Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Ilam District (10 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'ilam' LIMIT 1)
FROM (VALUES
    ('Deumai Municipality'),
    ('Ilam Municipality'),
    ('Mai Municipality'),
    ('Suryodaya Municipality'),
    ('Chulachuli Rural Municipality'),
    ('Maijogmai Rural Municipality'),
    ('Mangsebung Rural Municipality'),
    ('Phakphokthum Rural Municipality'),
    ('Rong Rural Municipality'),
    ('Sandakpur Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Jhapa District (15 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'jhapa' LIMIT 1)
FROM (VALUES
    ('Arjundhara Municipality'),
    ('Bhadrapur Municipality'),
    ('Birtamod Municipality'),
    ('Damak Municipality'),
    ('Gauradaha Municipality'),
    ('Kankai Municipality'),
    ('Mechinagar Municipality'),
    ('Shivasatakshi Municipality'),
    ('Barhadashi Rural Municipality'),
    ('Buddha Shanti Rural Municipality'),
    ('Gaurigunj Rural Municipality'),
    ('Haldibari Rural Municipality'),
    ('Jhapa Rural Municipality'),
    ('Kachankawal Rural Municipality'),
    ('Kamal Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Khotang District (10 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'khotang' LIMIT 1)
FROM (VALUES
    ('Diktel Rupakot Majhuwagadhi Municipality'),
    ('Halesi Tuwachung Municipality'),
    ('Aiselukharka Rural Municipality'),
    ('Barahpokhari Rural Municipality'),
    ('Diprung Chuichumma Rural Municipality'),
    ('Jantedhunga Rural Municipality'),
    ('Kepilasgadhi Rural Municipality'),
    ('Khotehang Rural Municipality'),
    ('Rawa Besi Rural Municipality'),
    ('Sakela Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Morang District (17 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'morang' LIMIT 1)
FROM (VALUES
    ('Biratnagar Metropolitan City'),
    ('Belbari Municipality'),
    ('Letang Municipality'),
    ('Pathari Shanischare Municipality'),
    ('Rangeli Municipality'),
    ('Ratuwamai Municipality'),
    ('Sunawarshi Municipality'),
    ('Sundar Haraicha Municipality'),
    ('Urlabari Municipality'),
    ('Budi Ganga Rural Municipality'),
    ('Dhanpalthan Rural Municipality'),
    ('Gramthan Rural Municipality'),
    ('Jahada Rural Municipality'),
    ('Kanepokhari Rural Municipality'),
    ('Katahari Rural Municipality'),
    ('Kerabari Rural Municipality'),
    ('Miklajung Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Okhaldhunga District (8 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'okhaldhunga' LIMIT 1)
FROM (VALUES
    ('Siddhicharan Municipality'),
    ('Champadevi Rural Municipality'),
    ('Chisankhugadhi Rural Municipality'),
    ('Khiji Demba Rural Municipality'),
    ('Likhu Rural Municipality'),
    ('Manebhanjyang Rural Municipality'),
    ('Molung Rural Municipality'),
    ('Sunkoshi Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Pachthar District (8 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'pachthar' LIMIT 1)
FROM (VALUES
    ('Phidim Municipality'),
    ('Hilihang Rural Municipality'),
    ('Kummayak Rural Municipality'),
    ('Miklajung Rural Municipality'),
    ('Phalelung Rural Municipality'),
    ('Phalgunanda Rural Municipality'),
    ('Tumbewa Rural Municipality'),
    ('Yangwarak Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Sankhuwasabha District (10 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'sankhuwasabha' LIMIT 1)
FROM (VALUES
    ('Chainpur Municipality'),
    ('Dharmadevi Municipality'),
    ('Khandbari Municipality'),
    ('Madi Municipality'),
    ('Panchkhapan Municipality'),
    ('BhotKhola Rural Municipality'),
    ('Chichila Rural Municipality'),
    ('Makalu Rural Municipality'),
    ('Sabhapokhari Rural Municipality'),
    ('Silichong Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Solukhumbu District (8 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'solukhumbu' LIMIT 1)
FROM (VALUES
    ('Solu Dudhkunda Municipality'),
    ('Khumbu PasangLhamu Rural Municipality'),
    ('Likhu Pike Rural Municipality'),
    ('Maha Kulung Rural Municipality'),
    ('Mapya Dudhkoshi Rural Municipality'),
    ('Necha Salyan Rural Municipality'),
    ('Sotang Rural Municipality'),
    ('Thulung Dudhkoshi Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Sunsari District (12 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'sunsari' LIMIT 1)
FROM (VALUES
    ('Dharan Sub-Metropolitan City'),
    ('Itahari Sub-Metropolitan City'),
    ('BarahaKshetra Municipality'),
    ('Duhabi Municipality'),
    ('Inaruwa Municipality'),
    ('Ramdhuni Municipality'),
    ('Barju Rural Municipality'),
    ('Bhokraha Narsingh Rural Municipality'),
    ('Dewangunj Rural Municipality'),
    ('Gadhi Rural Municipality'),
    ('Harinagar Rural Municipality'),
    ('Koshi Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Taplejung District (9 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'taplejung' LIMIT 1)
FROM (VALUES
    ('Phungling Municipality'),
    ('Aathrai Triveni Rural Municipality'),
    ('Maiwa Khola Rural Municipality'),
    ('Meringden Rural Municipality'),
    ('Mikwa Khola Rural Municipality'),
    ('Pathibhara Yangwarak Rural Municipality'),
    ('Phaktanglung Rural Municipality'),
    ('Sidingwa Rural Municipality'),
    ('Sirijangha Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Terhathum District (6 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'terhathum' LIMIT 1)
FROM (VALUES
    ('Laligurans Municipality'),
    ('Myanglung Municipality'),
    ('Aathrai Rural Municipality'),
    ('Chhathar Rural Municipality'),
    ('Menchayayem Rural Municipality'),
    ('Phedap Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Udayapur District (8 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'udayapur' LIMIT 1)
FROM (VALUES
    ('Belaka Municipality'),
    ('Chaudandigadhi Municipality'),
    ('Katari Municipality'),
    ('Triyuga Municipality'),
    ('Limchungbung Rural Municipality'),
    ('Rautamai Rural Municipality'),
    ('Tapli Rural Municipality'),
    ('Udayapurgadhi Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Parsa District (14 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'parsa' LIMIT 1)
FROM (VALUES
    ('Birgunj Metropolitan City'),
    ('Bahudarmai Municipality'),
    ('Parsagadhi Municipality'),
    ('Pokhariya Municipality'),
    ('Bindabasini Rural Municipality'),
    ('Chhipaharmai Rural Municipality'),
    ('Dhobini Rural Municipality'),
    ('Jagarnathpur Rural Municipality'),
    ('Jirabhawani Rural Municipality'),
    ('Kalikamai Rural Municipality'),
    ('Pakaha Mainpur Rural Municipality'),
    ('Paterwa Sugauli Rural Municipality'),
    ('Sakhuwa Prasauni Rural Municipality'),
    ('Thori Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Bara District (16 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'bara' LIMIT 1)
FROM (VALUES
    ('Jitpur Simara Sub-Metropolitan City'),
    ('Kalaiya Sub-Metropolitan City'),
    ('Kolhabi Municipality'),
    ('Mahagadhimai Municipality'),
    ('Nijgadh Municipality'),
    ('Pacharauta Municipality'),
    ('Simaraungadh Municipality'),
    ('Adarsh Kotwal Rural Municipality'),
    ('Baragadhi Rural Municipality'),
    ('Bishrampur Rural Municipality'),
    ('Devtal Rural Municipality'),
    ('Karaiyamai Rural Municipality'),
    ('Parwanipur Rural Municipality'),
    ('Pheta Rural Municipality'),
    ('Prasauni Rural Municipality'),
    ('Suwarna Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Rautahat District (18 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'rautahat' LIMIT 1)
FROM (VALUES
    ('Baudhimai Municipality'),
    ('Brindaban Municipality'),
    ('Chandrapur Municipality'),
    ('Dewahi Gonahi Municipality'),
    ('Gadhimai Municipality'),
    ('Gaur Municipality'),
    ('Gujara Municipality'),
    ('Guruda Municipality'),
    ('Ishanath Municipality'),
    ('Katahariya Municipality'),
    ('Madhav Narayan Municipality'),
    ('Maulapur Municipality'),
    ('Paroha Municipality'),
    ('Phatuwa Bijayapur Municipality'),
    ('Rajdevi Municipality'),
    ('Rajpur Municipality'),
    ('Durga Bhagwati Rural Municipality'),
    ('Yamunamai Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Sarlahi District (20 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'sarlahi' LIMIT 1)
FROM (VALUES
    ('Bagmati Municipality'),
    ('Balara Municipality'),
    ('Barahathwa Municipality'),
    ('Godaita Municipality'),
    ('Haripur Municipality'),
    ('Haripurwa Municipality'),
    ('Hariwan Municipality'),
    ('Ishowrpur Municipality'),
    ('Kabilasi Municipality'),
    ('Lalbandi Municipality'),
    ('Malangawa Municipality'),
    ('Basbariya Rural Municipality'),
    ('Bisnu Rural Municipality'),
    ('Brahampuri Rural Municipality'),
    ('Chakraghatta Rural Municipality'),
    ('Chandranagar Rural Municipality'),
    ('Dhankaul Rural Municipality'),
    ('Kaudena Rural Municipality'),
    ('Parsa Rural Municipality'),
    ('Ramnagar Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Siraha District (17 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'siraha' LIMIT 1)
FROM (VALUES
    ('Dhangadhimai Municipality'),
    ('Golbazar Municipality'),
    ('Kalyanpur Municipality'),
    ('Karjanha Municipality'),
    ('Lahan Municipality'),
    ('Mirchaiya Municipality'),
    ('Siraha Municipality'),
    ('Sukhipur Municipality'),
    ('Arnama Rural Municipality'),
    ('Aurahi Rural Municipality'),
    ('Bariyarpatti Rural Municipality'),
    ('Bhagwanpur Rural Municipality'),
    ('Bishnupur Rural Municipality'),
    ('Lakshmipur Patari Rural Municipality'),
    ('Naraha Rural Municipality'),
    ('Navarajpur Rural Municipality'),
    ('SakhuwanankarKatti Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Dhanusha District (18 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'dhanusha' LIMIT 1)
FROM (VALUES
    ('Janakpurdham Sub-Metropolitan City'),
    ('Bideha Municipality'),
    ('Chhireshwarnath Municipality'),
    ('Dhanushadham Municipality'),
    ('Ganeshman Charnath Municipality'),
    ('Hansapur Municipality'),
    ('Kamala Municipality'),
    ('Mithila Municipality'),
    ('MithilaBihari Municipality'),
    ('Nagarain Municipality'),
    ('Sabaila Municipality'),
    ('Sahidnagar Municipality'),
    ('Aaurahi Rural Municipality'),
    ('Bateshwar Rural Municipality'),
    ('Dhanauji Rural Municipality'),
    ('Janaknandani Rural Municipality'),
    ('Lakshminya Rural Municipality'),
    ('Mukhiyapatti Musharniya Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Saptari District (18 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'saptari' LIMIT 1)
FROM (VALUES
    ('Bodebarsain Municipality'),
    ('Dakneshwori Municipality'),
    ('Hanumannagar Kankalini Municipality'),
    ('Kanchanrup Municipality'),
    ('Khadak Municipality'),
    ('Rajbiraj Municipality'),
    ('Saptakoshi Municipality'),
    ('Shambhunath Municipality'),
    ('Surunga Municipality'),
    ('Agnisaira Krishnasavaran Rural Municipality'),
    ('Balan-Bihul Rural Municipality'),
    ('Bishnupur Rural Municipality'),
    ('Chhinnamasta Rural Municipality'),
    ('Mahadeva Rural Municipality'),
    ('Rajgadh Rural Municipality'),
    ('Rupani Rural Municipality'),
    ('Tilathi Koiladi Rural Municipality'),
    ('Tirhut Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Mahottari District (15 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'mahottari' LIMIT 1)
FROM (VALUES
    ('Aaurahi Municipality'),
    ('Balawa Municipality'),
    ('Bardibas Municipality'),
    ('Bhangaha Municipality'),
    ('Gaushala Municipality'),
    ('Jaleshor Municipality'),
    ('Loharpatti Municipality'),
    ('Manara Shiswa Municipality'),
    ('Matihani Municipality'),
    ('Ramgopalpur Municipality'),
    ('Ekdara Rural Municipality'),
    ('Mahottari Rural Municipality'),
    ('Pipara Rural Municipality'),
    ('Samsi Rural Municipality'),
    ('Sonama Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Bhaktapur District (4 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'bhaktapur' LIMIT 1)
FROM (VALUES
    ('Bhaktapur Municipality'),
    ('Changunarayan Municipality'),
    ('Madhyapur Thimi Municipality'),
    ('Suryabinayak Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Chitwan District (7 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'chitwan' LIMIT 1)
FROM (VALUES
    ('Bharatpur Metropolitan City'),
    ('Kalika Municipality'),
    ('Khairhani Municipality'),
    ('Madi Municipality'),
    ('Rapti Municipality'),
    ('Ratnagar Municipality'),
    ('Ichchhakamana Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Dhading District (13 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'dhading' LIMIT 1)
FROM (VALUES
    ('Dhunibeshi Municipality'),
    ('Nilkantha Municipality'),
    ('Benighat Rorang Rural Municipality'),
    ('Gajuri Rural Municipality'),
    ('Galchhi Rural Municipality'),
    ('Gangajamuna Rural Municipality'),
    ('Jwalamukhi Rural Municipality'),
    ('Khaniyabas Rural Municipality'),
    ('Netrawati Dabjong Rural Municipality'),
    ('Rubi Valley Rural Municipality'),
    ('Siddhalek Rural Municipality'),
    ('Thakre Rural Municipality'),
    ('Tripurasundari Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Dolakha District (9 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'dolakha' LIMIT 1)
FROM (VALUES
    ('Bhimeswor Municipality'),
    ('Jiri Municipality'),
    ('Baiteshowr Rural Municipality'),
    ('Bigu Rural Municipality'),
    ('Gaurishankar Rural Municipality'),
    ('Kalinchok Rural Municipality'),
    ('Melung Rural Municipality'),
    ('Sailung Rural Municipality'),
    ('Tamakoshi Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Kathmandu District (11 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'kathmandu' LIMIT 1)
FROM (VALUES
    ('Kathmandu Metropolitan City'),
    ('Budhalikantha Municipality'),
    ('Chandragiri Municipality'),
    ('Dakshinkali Municipality'),
    ('Gokarneshwar Municipality'),
    ('Kageshwari-Manohara Municipality'),
    ('Kirtipur Municipality'),
    ('Nagarjun Municipality'),
    ('Shankharapur Municipality'),
    ('Tarakeshwar Municipality'),
    ('Tokha Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Kavrepalanchok District (13 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'kavrepalanchok' LIMIT 1)
FROM (VALUES
    ('Banepa Municipality'),
    ('Dhulikhel Municipality'),
    ('Mandandeupur Municipality'),
    ('Namobuddha Municipality'),
    ('Panauti Municipality'),
    ('Panchkhal Municipality'),
    ('Bethanchok Rural Municipality'),
    ('Bhumlu Rural Municipality'),
    ('Chauri Deurali Rural Municipality'),
    ('Khani Khola Rural Municipality'),
    ('Mahabharat Rural Municipality'),
    ('Roshi Rural Municipality'),
    ('Temal Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Lalitpur District (6 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'lalitpur' LIMIT 1)
FROM (VALUES
    ('Lalitpur Metropolitan City'),
    ('Godawari Municipality'),
    ('Mahalaxmi Municipality'),
    ('Bagmati Rural Municipality'),
    ('Konjyosom Rural Municipality'),
    ('Mahankal Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Makwanpur District (10 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'makwanpur' LIMIT 1)
FROM (VALUES
    ('Hetauda Sub-Metropolitan City'),
    ('Thaha Municipality'),
    ('Bagmati Rural Municipality'),
    ('Bakaiya Rural Municipality'),
    ('Bhimphedi Rural Municipality'),
    ('Indrasarowar Rural Municipality'),
    ('Kailash Rural Municipality'),
    ('Makawanpurgadhi Rural Municipality'),
    ('Manahari Rural Municipality'),
    ('Raksirang Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Nuwakot District (12 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'nuwakot' LIMIT 1)
FROM (VALUES
    ('Belkotgadhi Municipality'),
    ('Bidur Municipality'),
    ('Dupcheshwar Rural Municipality'),
    ('Kakani Rural Municipality'),
    ('Kispang Rural Municipality'),
    ('Likhu Rural Municipality'),
    ('Myagang Rural Municipality'),
    ('Panchakanya Rural Municipality'),
    ('Shivapuri Rural Municipality'),
    ('Suryagadhi Rural Municipality'),
    ('Tadi Rural Municipality'),
    ('Tarkeshwar Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Ramechap District (8 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'ramechap' LIMIT 1)
FROM (VALUES
    ('Manthali Municipality'),
    ('Ramechhap Municipality'),
    ('Doramba Rural Municipality'),
    ('Gokulganga Rural Municipality'),
    ('Khandadevi Rural Municipality'),
    ('LikhuTamakoshi Rural Municipality'),
    ('Sunapati Rural Municipality'),
    ('Umakunda Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Rasuwa District (5 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'rasuwa' LIMIT 1)
FROM (VALUES
    ('Gosaikunda Rural Municipality'),
    ('Kalika Rural Municipality'),
    ('Naukunda Rural Municipality'),
    ('Parbatikunda Rural Municipality'),
    ('Uttargaya Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Sindhuli District (9 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'sindhuli' LIMIT 1)
FROM (VALUES
    ('Dudhauli Municipality'),
    ('Kamalamai Municipality'),
    ('Ghyanglekh Rural Municipality'),
    ('Golanjor Rural Municipality'),
    ('Hariharpurgadhi Rural Municipality'),
    ('Marin Rural Municipality'),
    ('Phikkal Rural Municipality'),
    ('Sunkoshi Rural Municipality'),
    ('Tinpatan Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Sindhupalchok District (12 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'sindhupalchok' LIMIT 1)
FROM (VALUES
    ('Bahrabise Municipality'),
    ('Chautara Sangachowkgadi Municipality'),
    ('Melamchi Municipality'),
    ('Balephi Rural Municipality'),
    ('Bhotekoshi Rural Municipality'),
    ('Helambu Rural Municipality'),
    ('Indrawati Rural Municipality'),
    ('Jugal Rural Municipality'),
    ('Lisankhu Rural Municipality'),
    ('Panchpokhari Rural Municipality'),
    ('Sunkoshi Rural Municipality'),
    ('Tripurasundari Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Baglung District (10 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'baglung' LIMIT 1)
FROM (VALUES
    ('Baglung Municipality'),
    ('Dhorpatan Municipality'),
    ('Galkot Municipality'),
    ('Jaimuni Municipality'),
    ('Badigad Rural Municipality'),
    ('Bareng Rural Municipality'),
    ('Khathekhola Rural Municipality'),
    ('Nishi Khola Rural Municipality'),
    ('Taman Khola Rural Municipality'),
    ('Tara Khola Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Gorkha District (11 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'gorkha' LIMIT 1)
FROM (VALUES
    ('Gorkha Municipality'),
    ('Palungtar Municipality'),
    ('Aarughat Rural Municipality'),
    ('Ajirkot Rural Municipality'),
    ('Bhimsen Thapa Rural Municipality'),
    ('Chumnubri Rural Municipality'),
    ('Dharche Rural Municipality'),
    ('Gandaki Rural Municipality'),
    ('Sahid Lakhan Rural Municipality'),
    ('Siranchowk Rural Municipality'),
    ('Sulikot Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Kaski District (5 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'kaski' LIMIT 1)
FROM (VALUES
    ('Pokhara Metropolitan City'),
    ('Annapurna Rural Municipality'),
    ('Machhapuchchhre Rural Municipality'),
    ('Madi Rural Municipality'),
    ('Rupa Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Lamjung District (8 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'lamjung' LIMIT 1)
FROM (VALUES
    ('Besisahar Municipality'),
    ('Madhya Nepal Municipality'),
    ('Rainas Municipality'),
    ('Sundarbazar Municipality'),
    ('Dordi Rural Municipality'),
    ('Dudhpokhari Rural Municipality'),
    ('Kwhlosothar Rural Municipality'),
    ('Marsyangdi Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Manang District (4 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'manang' LIMIT 1)
FROM (VALUES
    ('Chame Rural Municipality'),
    ('Manang Ngisyang Rural Municipality'),
    ('NarpaBhumi Rural Municipality'),
    ('Nason Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Mustang District (5 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'mustang' LIMIT 1)
FROM (VALUES
    ('Barhagaun Muktichhetra Rural Municipality'),
    ('Gharpajhong Rural Municipality'),
    ('Lo-Ghekar Damodarkunda Rural Municipality'),
    ('Lomanthang Rural Municipality'),
    ('Thasang Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Myagdi District (6 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'myagdi' LIMIT 1)
FROM (VALUES
    ('Beni Municipality'),
    ('Annapurna Rural Municipality'),
    ('Dhaulagiri Rural Municipality'),
    ('Malika Rural Municipality'),
    ('Mangala Rural Municipality'),
    ('Raghuganga Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Nawalpur District (8 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'nawalpur' LIMIT 1)
FROM (VALUES
    ('Devachuli Municipality'),
    ('Gaindakot Municipality'),
    ('Kawasoti Municipality'),
    ('Madhya Bindu Municipality'),
    ('Baudikali Rural Municipality'),
    ('Binayi Tribeni Rural Municipality'),
    ('Bulingtar Rural Municipality'),
    ('Hupsekot Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Parwat District (7 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'parwat' LIMIT 1)
FROM (VALUES
    ('Kushma Municipality'),
    ('Phalewas Municipality'),
    ('Bihadi Rural Municipality'),
    ('Jaljala Rural Municipality'),
    ('Mahashila Rural Municipality'),
    ('Modi Rural Municipality'),
    ('Paiyun Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Syangja District (11 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'syangja' LIMIT 1)
FROM (VALUES
    ('Bheerkot Municipality'),
    ('Chapakot Municipality'),
    ('Galyang Municipality'),
    ('Putalibazar Municipality'),
    ('Waling Municipality'),
    ('Aandhikhola Rural Municipality'),
    ('Arjun Chaupari Rural Municipality'),
    ('Biruwa Rural Municipality'),
    ('Harinas Rural Municipality'),
    ('Kaligandaki Rural Municipality'),
    ('Phedikhola Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Tanahun District (10 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'tanahun' LIMIT 1)
FROM (VALUES
    ('Bhanu Municipality'),
    ('Bhimad Municipality'),
    ('Byas Municipality'),
    ('Suklagandaki Municipality'),
    ('AnbuKhaireni Rural Municipality'),
    ('Bandipur Rural Municipality'),
    ('Devghat Rural Municipality'),
    ('Ghiring Rural Municipality'),
    ('Myagde Rural Municipality'),
    ('Rishing Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Kapilvastu District (10 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'kapilvastu' LIMIT 1)
FROM (VALUES
    ('Banganga Municipality'),
    ('Buddhabhumi Municipality'),
    ('Kapilvastu Municipality'),
    ('Krishnanagar Municipality'),
    ('Maharajgunj Municipality'),
    ('Shivaraj Municipality'),
    ('Bijaynagar Rural Municipality'),
    ('Mayadevi Rural Municipality'),
    ('Suddhodan Rural Municipality'),
    ('Yashodhara Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Parasi District (7 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'parasi' LIMIT 1)
FROM (VALUES
    ('Bardaghat Municipality'),
    ('Ramgram Municipality'),
    ('Sunwal Municipality'),
    ('Palhi Nandan Rural Municipality'),
    ('Pratappur Rural Municipality'),
    ('Sarawal Rural Municipality'),
    ('Susta Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Rupandehi District (16 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'rupandehi' LIMIT 1)
FROM (VALUES
    ('Butwal Sub-Metropolitan City'),
    ('Devdaha Municipality'),
    ('Lumbini Sanskritik Municipality'),
    ('Sainamaina Municipality'),
    ('Siddharthanagar Municipality'),
    ('Tilottama Municipality'),
    ('Gaidahawa Rural Municipality'),
    ('Kanchan Rural Municipality'),
    ('Kotahimai Rural Municipality'),
    ('Marchawari Rural Municipality'),
    ('Mayadevi Rural Municipality'),
    ('Omsatiya Rural Municipality'),
    ('Rohini Rural Municipality'),
    ('Sammarimai Rural Municipality'),
    ('Siyari Rural Municipality'),
    ('Suddodhan Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Arghakhanchi District (6 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'arghakhanchi' LIMIT 1)
FROM (VALUES
    ('Bhumikasthan Municipality'),
    ('Sandhikharka Municipality'),
    ('Sitganga Municipality'),
    ('Chhatradev Rural Municipality'),
    ('Malarani Rural Municipality'),
    ('Panini Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Gulmi District (12 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'gulmi' LIMIT 1)
FROM (VALUES
    ('Musikot Municipality'),
    ('Resunga Municipality'),
    ('Chandrakot Rural Municipality'),
    ('Chhatrakot Rural Municipality'),
    ('Dhurkot Rural Municipality'),
    ('Gulmidarbar Rural Municipality'),
    ('Isma Rural Municipality'),
    ('Kaligandaki Rural Municipality'),
    ('Madane Rural Municipality'),
    ('Malika Rural Municipality'),
    ('Rurukshetra Rural Municipality'),
    ('Satyawati Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Palpa District (10 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'palpa' LIMIT 1)
FROM (VALUES
    ('Rampur Municipality'),
    ('Tansen Municipality'),
    ('Bagnaskali Rural Municipality'),
    ('Mathagadhi Rural Municipality'),
    ('Nisdi Rural Municipality'),
    ('Purbakhola Rural Municipality'),
    ('Rainadevi Chhahara Rural Municipality'),
    ('Rambha Rural Municipality'),
    ('Ripdikot Rural Municipality'),
    ('Tinahu Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Dang District (10 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'dang' LIMIT 1)
FROM (VALUES
    ('Ghorahi Sub-Metropolitan City'),
    ('Tulsipur Sub-Metropolitan City'),
    ('Lamahi Municipality'),
    ('Babai Rural Municipality'),
    ('Banglachuli Rural Municipality'),
    ('Dangisharan Rural Municipality'),
    ('Gadhawa Rural Municipality'),
    ('Rajpur Rural Municipality'),
    ('Rapti Rural Municipality'),
    ('Shantinagar Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Pyuthan District (9 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'pyuthan' LIMIT 1)
FROM (VALUES
    ('Pyuthan Municipality'),
    ('Sworgadwari Municipality'),
    ('Ayirawati Rural Municipality'),
    ('Gaumukhi Rural Municipality'),
    ('Jhimruk Rural Municipality'),
    ('Mallarani Rural Municipality'),
    ('Mandavi Rural Municipality'),
    ('Naubahini Rural Municipality'),
    ('Sarumarani Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Rolpa District (10 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'rolpa' LIMIT 1)
FROM (VALUES
    ('Rolpa Municipality'),
    ('GangaDev Rural Municipality'),
    ('Lungri Rural Municipality'),
    ('Madi Rural Municipality'),
    ('Pariwartan Rural Municipality'),
    ('Runtigadi Rural Municipality'),
    ('Sunchhahari Rural Municipality'),
    ('Sunil Smiriti Rural Municipality'),
    ('Thawang Rural Municipality'),
    ('Triveni Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Eastern Rukum District (3 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'eastern-rukum' LIMIT 1)
FROM (VALUES
    ('Bhume Rural Municipality'),
    ('Putha Uttarganga Rural Municipality'),
    ('Sisne Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Banke District (8 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'banke' LIMIT 1)
FROM (VALUES
    ('Nepalgunj Sub-Metropolitan City'),
    ('Kohalpur Municipality'),
    ('Baijanath Rural Municipality'),
    ('Duduwa Rural Municipality'),
    ('Janaki Rural Municipality'),
    ('Khajura Rural Municipality'),
    ('Narainapur Rural Municipality'),
    ('Rapti-Sonari Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Bardiya District (8 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'bardiya' LIMIT 1)
FROM (VALUES
    ('Barbardiya Municipality'),
    ('Basgadhi Municipality'),
    ('Gulariya Municipality'),
    ('Madhuwan Municipality'),
    ('Rajapur Municipality'),
    ('Thakurbaba Municipality'),
    ('Badhaiyatal Rural Municipality'),
    ('Geruwa Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Western Rukum District (6 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'western-rukum' LIMIT 1)
FROM (VALUES
    ('Aathabiskot Municipality'),
    ('Chaurjahari Municipality'),
    ('Musikot Municipality'),
    ('Banphikot Rural Municipality'),
    ('SaniBheri Rural Municipality'),
    ('Triveni Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Salyan District (10 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'salyan' LIMIT 1)
FROM (VALUES
    ('Bagchaur Municipality'),
    ('Bangad Kupinde Municipality'),
    ('Shaarda Municipality'),
    ('Chhatreshwari Rural Municipality'),
    ('Darma Rural Municipality'),
    ('Kalimati Rural Municipality'),
    ('Kapurkot Rural Municipality'),
    ('Kumakh Rural Municipality'),
    ('Siddha Kumakh Rural Municipality'),
    ('Triveni Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Dolpa District (8 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'dolpa' LIMIT 1)
FROM (VALUES
    ('Thuli Bheri Municipality'),
    ('Tripurasundari Municipality'),
    ('Chharka Tongsong Rural Municipality'),
    ('Dolpo Buddha Rural Municipality'),
    ('Jagadulla Rural Municipality'),
    ('Kaike Rural Municipality'),
    ('Mudkechula Rural Municipality'),
    ('She Phoksundo Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Humla District (7 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'humla' LIMIT 1)
FROM (VALUES
    ('Adanchuli Rural Municipality'),
    ('Chankheli Rural Municipality'),
    ('Kharpunath Rural Municipality'),
    ('Namkha Rural Municipality'),
    ('Sarkegad Rural Municipality'),
    ('Simkot Rural Municipality'),
    ('Tanjakot Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Jumla District (8 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'jumla' LIMIT 1)
FROM (VALUES
    ('Chandannath Municipality'),
    ('Guthichaur Rural Municipality'),
    ('Hima Rural Municipality'),
    ('Kanaka Sundari Rural Municipality'),
    ('Patarasi Rural Municipality'),
    ('Sinja Rural Municipality'),
    ('Tatopani Rural Municipality'),
    ('Tila Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Kalikot District (9 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'kalikot' LIMIT 1)
FROM (VALUES
    ('Khandachakra Municipality'),
    ('Raskot Municipality'),
    ('Tilagufa Municipality'),
    ('Mahawai Rural Municipality'),
    ('Narharinath Rural Municipality'),
    ('Pachaljharana Rural Municipality'),
    ('Palata Rural Municipality'),
    ('Sanni Triveni Rural Municipality'),
    ('Shubha Kalika Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Mugu District (4 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'mugu' LIMIT 1)
FROM (VALUES
    ('Chhayanath Rara Municipality'),
    ('Khatyad Rural Municipality'),
    ('Mugum Karmarong Rural Municipality'),
    ('Soru Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Surkhet District (9 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'surkhet' LIMIT 1)
FROM (VALUES
    ('Bheriganga Municipality'),
    ('Birendranagar Municipality'),
    ('Gurbhakot Municipality'),
    ('Lekbeshi Municipality'),
    ('Panchapuri Municipality'),
    ('Barahatal Rural Municipality'),
    ('Chaukune Rural Municipality'),
    ('Chingad Rural Municipality'),
    ('Simta Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Dailekh District (11 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'dailekh' LIMIT 1)
FROM (VALUES
    ('Aathabis Municipality'),
    ('Chamunda Bindrasaini Municipality'),
    ('Dullu Municipality'),
    ('Narayan Municipality'),
    ('Bhagawatimai Rural Municipality'),
    ('Bhairabi Rural Municipality'),
    ('Dungeshwar Rural Municipality'),
    ('Gurans Rural Municipality'),
    ('Mahabu Rural Municipality'),
    ('Naumule Rural Municipality'),
    ('Thantikandh Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Jajarkot District (7 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'jajarkot' LIMIT 1)
FROM (VALUES
    ('Bheri Municipality'),
    ('Chhedagad Municipality'),
    ('Nalgad Municipality'),
    ('Barekot Rural Municipality'),
    ('Junichande Rural Municipality'),
    ('Kuse Rural Municipality'),
    ('Shivalaya Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Darchula District (9 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'darchula' LIMIT 1)
FROM (VALUES
    ('Mahakali Municipality'),
    ('Shailyashikhar Municipality'),
    ('Apihimal Rural Municipality'),
    ('Duhun Rural Municipality'),
    ('Lekam Rural Municipality'),
    ('Malikarjun Rural Municipality'),
    ('Marma Rural Municipality'),
    ('Naugad Rural Municipality'),
    ('Vyans Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Bajhang District (12 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'bajhang' LIMIT 1)
FROM (VALUES
    ('Bungal Municipality'),
    ('Jayaprithvi Municipality'),
    ('Bitthadchir Rural Municipality'),
    ('Chhabis Pathibhera Rural Municipality'),
    ('Durgathali Rural Municipality'),
    ('Kedarsyu Rural Municipality'),
    ('Khaptadchhanna Rural Municipality'),
    ('Masta Rural Municipality'),
    ('Saipal Rural Municipality'),
    ('Surma Rural Municipality'),
    ('Talkot Rural Municipality'),
    ('Thalara Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Bajura District (9 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'bajura' LIMIT 1)
FROM (VALUES
    ('Badimalika Municipality'),
    ('Budhiganga Municipality'),
    ('Budhinanda Municipality'),
    ('Triveni Municipality'),
    ('Gaumul Rural Municipality'),
    ('Himali Rural Municipality'),
    ('Jagannath Rural Municipality'),
    ('Khaptad Chhededaha Rural Municipality'),
    ('Swami Kartik Khapar Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Baitadi District (10 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'baitadi' LIMIT 1)
FROM (VALUES
    ('Dashrathchanda Municipality'),
    ('Melauli Municipality'),
    ('Patan Municipality'),
    ('Purchaudi Municipality'),
    ('Dilashaini Rural Municipality'),
    ('Dogdakedar Rural Municipality'),
    ('Pancheshwar Rural Municipality'),
    ('Shivanath Rural Municipality'),
    ('Sigas Rural Municipality'),
    ('Surnaya Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Doti District (9 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'doti' LIMIT 1)
FROM (VALUES
    ('Dipayal Silgadhi Municipality'),
    ('Shikhar Municipality'),
    ('Aadarsha Rural Municipality'),
    ('Badikedar Rural Municipality'),
    ('Bogatan-Phudsil Rural Municipality'),
    ('Jorayal Rural Municipality'),
    ('K.I.Singh Rural Municipality'),
    ('Purbichauki Rural Municipality'),
    ('Sayal Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Acham District (10 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'acham' LIMIT 1)
FROM (VALUES
    ('Kamalbazar Municipality'),
    ('Mangalsen Municipality'),
    ('Panchadewal Binayak Municipality'),
    ('Sanfebagar Municipality'),
    ('Bannigadi Jayagad Rural Municipality'),
    ('Chaurpati Rural Municipality'),
    ('Dhakari Rural Municipality'),
    ('Mellekh Rural Municipality'),
    ('Ramaroshan Rural Municipality'),
    ('Turmakhand Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Dadeldhura District (7 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'dadeldhura' LIMIT 1)
FROM (VALUES
    ('Amargadhi Municipality'),
    ('Parshuram Municipality'),
    ('Aalitaal Rural Municipality'),
    ('Ajaymeru Rural Municipality'),
    ('Bhageshwar Rural Municipality'),
    ('Ganyapadhura Rural Municipality'),
    ('Navadurga Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Kanchanpur District (9 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'kanchanpur' LIMIT 1)
FROM (VALUES
    ('Bedkot Municipality'),
    ('Belauri Municipality'),
    ('Bhimdatta Municipality'),
    ('Krishnapur Municipality'),
    ('Mahakali Municipality'),
    ('Punarbas Municipality'),
    ('Shuklaphanta Municipality'),
    ('Beldandi Rural Municipality'),
    ('Laljhadi Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- Kailali District (13 municipalities)
INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)
SELECT
    muni_data.name_en,
    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    'Local-level discussions for ' || muni_data.name_en,
    'party_only', 'role_based',
    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),
    true, 'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = 'kailali' LIMIT 1)
FROM (VALUES
    ('Dhangadhi Sub-Metropolitan City'),
    ('Bhajni Municipality'),
    ('Gauriganga Municipality'),
    ('Ghodaghodi Municipality'),
    ('Godawari Municipality'),
    ('Lamkichuha Municipality'),
    ('Tikapur Municipality'),
    ('Bardagoriya Rural Municipality'),
    ('Chure Rural Municipality'),
    ('Janaki Rural Municipality'),
    ('Joshipur Rural Municipality'),
    ('Kailari Rural Municipality'),
    ('Mohanyal Rural Municipality')
) AS muni_data(name_en)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))
);

-- End of municipalities seeding
