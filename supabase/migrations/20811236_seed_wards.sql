-- Ward-level channels under each municipality
-- Generated from nepal_local_levels_master.csv

DO $$
DECLARE
    municipality_id UUID;
    ward_num INT;
BEGIN

    -- Bhojpur Municipality (Bhojpur): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bhojpur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bhojpur Municipality - Ward ' || ward_num,
                'Bhojpur Municipality - वडा ' || ward_num,
                'bhojpur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bhojpur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Shadanand Municipality (Bhojpur): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'shadanand-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Shadanand Municipality - Ward ' || ward_num,
                'Shadanand Municipality - वडा ' || ward_num,
                'shadanand-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'shadanand-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Aamchok Rural Municipality (Bhojpur): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'aamchok-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Aamchok Rural Municipality - Ward ' || ward_num,
                'Aamchok Rural Municipality - वडा ' || ward_num,
                'aamchok-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'aamchok-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Arun Rural Municipality (Bhojpur): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'arun-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Arun Rural Municipality - Ward ' || ward_num,
                'Arun Rural Municipality - वडा ' || ward_num,
                'arun-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'arun-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Hatuwagadhi Rural Municipality (Bhojpur): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'hatuwagadhi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Hatuwagadhi Rural Municipality - Ward ' || ward_num,
                'Hatuwagadhi Rural Municipality - वडा ' || ward_num,
                'hatuwagadhi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'hatuwagadhi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Pauwadungma Rural Municipality (Bhojpur): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'pauwadungma-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Pauwadungma Rural Municipality - Ward ' || ward_num,
                'Pauwadungma Rural Municipality - वडा ' || ward_num,
                'pauwadungma-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'pauwadungma-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ramprasad Rai Rural Municipality (Bhojpur): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ramprasad-rai-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ramprasad Rai Rural Municipality - Ward ' || ward_num,
                'Ramprasad Rai Rural Municipality - वडा ' || ward_num,
                'ramprasad-rai-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ramprasad-rai-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Salpasilichho Rural Municipality (Bhojpur): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'salpasilichho-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Salpasilichho Rural Municipality - Ward ' || ward_num,
                'Salpasilichho Rural Municipality - वडा ' || ward_num,
                'salpasilichho-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'salpasilichho-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tyamke Maiyum Rural Municipality (Bhojpur): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tyamke-maiyum-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tyamke Maiyum Rural Municipality - Ward ' || ward_num,
                'Tyamke Maiyum Rural Municipality - वडा ' || ward_num,
                'tyamke-maiyum-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tyamke-maiyum-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dhankuta Municipality (Dhankuta): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dhankuta-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dhankuta Municipality - Ward ' || ward_num,
                'Dhankuta Municipality - वडा ' || ward_num,
                'dhankuta-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dhankuta-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mahalaxmi Municipality (Dhankuta): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mahalaxmi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mahalaxmi Municipality - Ward ' || ward_num,
                'Mahalaxmi Municipality - वडा ' || ward_num,
                'mahalaxmi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mahalaxmi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Pakhribas Municipality (Dhankuta): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'pakhribas-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Pakhribas Municipality - Ward ' || ward_num,
                'Pakhribas Municipality - वडा ' || ward_num,
                'pakhribas-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'pakhribas-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chaubise Rural Municipality (Dhankuta): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chaubise-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chaubise Rural Municipality - Ward ' || ward_num,
                'Chaubise Rural Municipality - वडा ' || ward_num,
                'chaubise-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chaubise-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chhathar Jorpati Rural Municipality (Dhankuta): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chhathar-jorpati-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chhathar Jorpati Rural Municipality - Ward ' || ward_num,
                'Chhathar Jorpati Rural Municipality - वडा ' || ward_num,
                'chhathar-jorpati-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chhathar-jorpati-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sahidbhumi Rural Municipality (Dhankuta): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sahidbhumi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sahidbhumi Rural Municipality - Ward ' || ward_num,
                'Sahidbhumi Rural Municipality - वडा ' || ward_num,
                'sahidbhumi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sahidbhumi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sangurigadhi Rural Municipality (Dhankuta): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sangurigadhi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sangurigadhi Rural Municipality - Ward ' || ward_num,
                'Sangurigadhi Rural Municipality - वडा ' || ward_num,
                'sangurigadhi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sangurigadhi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Deumai Municipality (Ilam): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'deumai-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Deumai Municipality - Ward ' || ward_num,
                'Deumai Municipality - वडा ' || ward_num,
                'deumai-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'deumai-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ilam Municipality (Ilam): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ilam-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ilam Municipality - Ward ' || ward_num,
                'Ilam Municipality - वडा ' || ward_num,
                'ilam-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ilam-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mai Municipality (Ilam): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mai-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mai Municipality - Ward ' || ward_num,
                'Mai Municipality - वडा ' || ward_num,
                'mai-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mai-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Suryodaya Municipality (Ilam): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'suryodaya-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Suryodaya Municipality - Ward ' || ward_num,
                'Suryodaya Municipality - वडा ' || ward_num,
                'suryodaya-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'suryodaya-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chulachuli Rural Municipality (Ilam): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chulachuli-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chulachuli Rural Municipality - Ward ' || ward_num,
                'Chulachuli Rural Municipality - वडा ' || ward_num,
                'chulachuli-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chulachuli-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Maijogmai Rural Municipality (Ilam): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'maijogmai-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Maijogmai Rural Municipality - Ward ' || ward_num,
                'Maijogmai Rural Municipality - वडा ' || ward_num,
                'maijogmai-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'maijogmai-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mangsebung Rural Municipality (Ilam): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mangsebung-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mangsebung Rural Municipality - Ward ' || ward_num,
                'Mangsebung Rural Municipality - वडा ' || ward_num,
                'mangsebung-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mangsebung-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Phakphokthum Rural Municipality (Ilam): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'phakphokthum-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Phakphokthum Rural Municipality - Ward ' || ward_num,
                'Phakphokthum Rural Municipality - वडा ' || ward_num,
                'phakphokthum-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'phakphokthum-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rong Rural Municipality (Ilam): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rong-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rong Rural Municipality - Ward ' || ward_num,
                'Rong Rural Municipality - वडा ' || ward_num,
                'rong-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rong-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sandakpur Rural Municipality (Ilam): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sandakpur-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sandakpur Rural Municipality - Ward ' || ward_num,
                'Sandakpur Rural Municipality - वडा ' || ward_num,
                'sandakpur-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sandakpur-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Arjundhara Municipality (Jhapa): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'arjundhara-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Arjundhara Municipality - Ward ' || ward_num,
                'Arjundhara Municipality - वडा ' || ward_num,
                'arjundhara-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'arjundhara-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bhadrapur Municipality (Jhapa): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bhadrapur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bhadrapur Municipality - Ward ' || ward_num,
                'Bhadrapur Municipality - वडा ' || ward_num,
                'bhadrapur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bhadrapur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Birtamod Municipality (Jhapa): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'birtamod-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Birtamod Municipality - Ward ' || ward_num,
                'Birtamod Municipality - वडा ' || ward_num,
                'birtamod-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'birtamod-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Damak Municipality (Jhapa): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'damak-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Damak Municipality - Ward ' || ward_num,
                'Damak Municipality - वडा ' || ward_num,
                'damak-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'damak-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gauradaha Municipality (Jhapa): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gauradaha-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gauradaha Municipality - Ward ' || ward_num,
                'Gauradaha Municipality - वडा ' || ward_num,
                'gauradaha-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gauradaha-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kankai Municipality (Jhapa): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kankai-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kankai Municipality - Ward ' || ward_num,
                'Kankai Municipality - वडा ' || ward_num,
                'kankai-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kankai-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mechinagar Municipality (Jhapa): 15 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mechinagar-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..15 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mechinagar Municipality - Ward ' || ward_num,
                'Mechinagar Municipality - वडा ' || ward_num,
                'mechinagar-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mechinagar-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Shivasatakshi Municipality (Jhapa): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'shivasatakshi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Shivasatakshi Municipality - Ward ' || ward_num,
                'Shivasatakshi Municipality - वडा ' || ward_num,
                'shivasatakshi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'shivasatakshi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Barhadashi Rural Municipality (Jhapa): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'barhadashi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Barhadashi Rural Municipality - Ward ' || ward_num,
                'Barhadashi Rural Municipality - वडा ' || ward_num,
                'barhadashi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'barhadashi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Buddha Shanti Rural Municipality (Jhapa): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'buddha-shanti-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Buddha Shanti Rural Municipality - Ward ' || ward_num,
                'Buddha Shanti Rural Municipality - वडा ' || ward_num,
                'buddha-shanti-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'buddha-shanti-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gaurigunj Rural Municipality (Jhapa): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gaurigunj-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gaurigunj Rural Municipality - Ward ' || ward_num,
                'Gaurigunj Rural Municipality - वडा ' || ward_num,
                'gaurigunj-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gaurigunj-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Haldibari Rural Municipality (Jhapa): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'haldibari-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Haldibari Rural Municipality - Ward ' || ward_num,
                'Haldibari Rural Municipality - वडा ' || ward_num,
                'haldibari-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'haldibari-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Jhapa Rural Municipality (Jhapa): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'jhapa-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Jhapa Rural Municipality - Ward ' || ward_num,
                'Jhapa Rural Municipality - वडा ' || ward_num,
                'jhapa-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'jhapa-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kachankawal Rural Municipality (Jhapa): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kachankawal-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kachankawal Rural Municipality - Ward ' || ward_num,
                'Kachankawal Rural Municipality - वडा ' || ward_num,
                'kachankawal-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kachankawal-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kamal Rural Municipality (Jhapa): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kamal-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kamal Rural Municipality - Ward ' || ward_num,
                'Kamal Rural Municipality - वडा ' || ward_num,
                'kamal-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kamal-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Diktel Rupakot Majhuwagadhi Municipality (Khotang): 15 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'diktel-rupakot-majhuwagadhi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..15 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Diktel Rupakot Majhuwagadhi Municipality - Ward ' || ward_num,
                'Diktel Rupakot Majhuwagadhi Municipality - वडा ' || ward_num,
                'diktel-rupakot-majhuwagadhi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'diktel-rupakot-majhuwagadhi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Halesi Tuwachung Municipality (Khotang): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'halesi-tuwachung-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Halesi Tuwachung Municipality - Ward ' || ward_num,
                'Halesi Tuwachung Municipality - वडा ' || ward_num,
                'halesi-tuwachung-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'halesi-tuwachung-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Aiselukharka Rural Municipality (Khotang): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'aiselukharka-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Aiselukharka Rural Municipality - Ward ' || ward_num,
                'Aiselukharka Rural Municipality - वडा ' || ward_num,
                'aiselukharka-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'aiselukharka-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Barahpokhari Rural Municipality (Khotang): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'barahpokhari-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Barahpokhari Rural Municipality - Ward ' || ward_num,
                'Barahpokhari Rural Municipality - वडा ' || ward_num,
                'barahpokhari-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'barahpokhari-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Diprung Chuichumma Rural Municipality (Khotang): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'diprung-chuichumma-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Diprung Chuichumma Rural Municipality - Ward ' || ward_num,
                'Diprung Chuichumma Rural Municipality - वडा ' || ward_num,
                'diprung-chuichumma-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'diprung-chuichumma-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Jantedhunga Rural Municipality (Khotang): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'jantedhunga-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Jantedhunga Rural Municipality - Ward ' || ward_num,
                'Jantedhunga Rural Municipality - वडा ' || ward_num,
                'jantedhunga-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'jantedhunga-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kepilasgadhi Rural Municipality (Khotang): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kepilasgadhi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kepilasgadhi Rural Municipality - Ward ' || ward_num,
                'Kepilasgadhi Rural Municipality - वडा ' || ward_num,
                'kepilasgadhi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kepilasgadhi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Khotehang Rural Municipality (Khotang): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'khotehang-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Khotehang Rural Municipality - Ward ' || ward_num,
                'Khotehang Rural Municipality - वडा ' || ward_num,
                'khotehang-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'khotehang-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rawa Besi Rural Municipality (Khotang): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rawa-besi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rawa Besi Rural Municipality - Ward ' || ward_num,
                'Rawa Besi Rural Municipality - वडा ' || ward_num,
                'rawa-besi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rawa-besi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sakela Rural Municipality (Khotang): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sakela-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sakela Rural Municipality - Ward ' || ward_num,
                'Sakela Rural Municipality - वडा ' || ward_num,
                'sakela-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sakela-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Biratnagar Metropolitan City (Morang): 19 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'biratnagar-metropolitan-city' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..19 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Biratnagar Metropolitan City - Ward ' || ward_num,
                'Biratnagar Metropolitan City - वडा ' || ward_num,
                'biratnagar-metropolitan-city-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'biratnagar-metropolitan-city-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Belbari Municipality (Morang): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'belbari-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Belbari Municipality - Ward ' || ward_num,
                'Belbari Municipality - वडा ' || ward_num,
                'belbari-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'belbari-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Letang Municipality (Morang): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'letang-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Letang Municipality - Ward ' || ward_num,
                'Letang Municipality - वडा ' || ward_num,
                'letang-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'letang-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Pathari Shanischare Municipality (Morang): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'pathari-shanischare-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Pathari Shanischare Municipality - Ward ' || ward_num,
                'Pathari Shanischare Municipality - वडा ' || ward_num,
                'pathari-shanischare-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'pathari-shanischare-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rangeli Municipality (Morang): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rangeli-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rangeli Municipality - Ward ' || ward_num,
                'Rangeli Municipality - वडा ' || ward_num,
                'rangeli-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rangeli-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ratuwamai Municipality (Morang): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ratuwamai-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ratuwamai Municipality - Ward ' || ward_num,
                'Ratuwamai Municipality - वडा ' || ward_num,
                'ratuwamai-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ratuwamai-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sunawarshi Municipality (Morang): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sunawarshi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sunawarshi Municipality - Ward ' || ward_num,
                'Sunawarshi Municipality - वडा ' || ward_num,
                'sunawarshi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sunawarshi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sundar Haraicha Municipality (Morang): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sundar-haraicha-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sundar Haraicha Municipality - Ward ' || ward_num,
                'Sundar Haraicha Municipality - वडा ' || ward_num,
                'sundar-haraicha-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sundar-haraicha-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Urlabari Municipality (Morang): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'urlabari-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Urlabari Municipality - Ward ' || ward_num,
                'Urlabari Municipality - वडा ' || ward_num,
                'urlabari-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'urlabari-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Budi Ganga Rural Municipality (Morang): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'budi-ganga-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Budi Ganga Rural Municipality - Ward ' || ward_num,
                'Budi Ganga Rural Municipality - वडा ' || ward_num,
                'budi-ganga-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'budi-ganga-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dhanpalthan Rural Municipality (Morang): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dhanpalthan-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dhanpalthan Rural Municipality - Ward ' || ward_num,
                'Dhanpalthan Rural Municipality - वडा ' || ward_num,
                'dhanpalthan-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dhanpalthan-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gramthan Rural Municipality (Morang): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gramthan-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gramthan Rural Municipality - Ward ' || ward_num,
                'Gramthan Rural Municipality - वडा ' || ward_num,
                'gramthan-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gramthan-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Jahada Rural Municipality (Morang): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'jahada-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Jahada Rural Municipality - Ward ' || ward_num,
                'Jahada Rural Municipality - वडा ' || ward_num,
                'jahada-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'jahada-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kanepokhari Rural Municipality (Morang): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kanepokhari-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kanepokhari Rural Municipality - Ward ' || ward_num,
                'Kanepokhari Rural Municipality - वडा ' || ward_num,
                'kanepokhari-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kanepokhari-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Katahari Rural Municipality (Morang): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'katahari-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Katahari Rural Municipality - Ward ' || ward_num,
                'Katahari Rural Municipality - वडा ' || ward_num,
                'katahari-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'katahari-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kerabari Rural Municipality (Morang): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kerabari-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kerabari Rural Municipality - Ward ' || ward_num,
                'Kerabari Rural Municipality - वडा ' || ward_num,
                'kerabari-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kerabari-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Miklajung Rural Municipality (Morang): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'miklajung-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Miklajung Rural Municipality - Ward ' || ward_num,
                'Miklajung Rural Municipality - वडा ' || ward_num,
                'miklajung-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'miklajung-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Siddhicharan Municipality (Okhaldhunga): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'siddhicharan-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Siddhicharan Municipality - Ward ' || ward_num,
                'Siddhicharan Municipality - वडा ' || ward_num,
                'siddhicharan-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'siddhicharan-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Champadevi Rural Municipality (Okhaldhunga): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'champadevi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Champadevi Rural Municipality - Ward ' || ward_num,
                'Champadevi Rural Municipality - वडा ' || ward_num,
                'champadevi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'champadevi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chisankhugadhi Rural Municipality (Okhaldhunga): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chisankhugadhi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chisankhugadhi Rural Municipality - Ward ' || ward_num,
                'Chisankhugadhi Rural Municipality - वडा ' || ward_num,
                'chisankhugadhi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chisankhugadhi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Khiji Demba Rural Municipality (Okhaldhunga): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'khiji-demba-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Khiji Demba Rural Municipality - Ward ' || ward_num,
                'Khiji Demba Rural Municipality - वडा ' || ward_num,
                'khiji-demba-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'khiji-demba-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Likhu Rural Municipality (Okhaldhunga): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'likhu-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Likhu Rural Municipality - Ward ' || ward_num,
                'Likhu Rural Municipality - वडा ' || ward_num,
                'likhu-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'likhu-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Manebhanjyang Rural Municipality (Okhaldhunga): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'manebhanjyang-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Manebhanjyang Rural Municipality - Ward ' || ward_num,
                'Manebhanjyang Rural Municipality - वडा ' || ward_num,
                'manebhanjyang-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'manebhanjyang-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Molung Rural Municipality (Okhaldhunga): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'molung-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Molung Rural Municipality - Ward ' || ward_num,
                'Molung Rural Municipality - वडा ' || ward_num,
                'molung-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'molung-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sunkoshi Rural Municipality (Okhaldhunga): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sunkoshi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sunkoshi Rural Municipality - Ward ' || ward_num,
                'Sunkoshi Rural Municipality - वडा ' || ward_num,
                'sunkoshi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sunkoshi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Phidim Municipality (Pachthar): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'phidim-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Phidim Municipality - Ward ' || ward_num,
                'Phidim Municipality - वडा ' || ward_num,
                'phidim-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'phidim-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Hilihang Rural Municipality (Pachthar): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'hilihang-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Hilihang Rural Municipality - Ward ' || ward_num,
                'Hilihang Rural Municipality - वडा ' || ward_num,
                'hilihang-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'hilihang-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kummayak Rural Municipality (Pachthar): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kummayak-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kummayak Rural Municipality - Ward ' || ward_num,
                'Kummayak Rural Municipality - वडा ' || ward_num,
                'kummayak-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kummayak-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Miklajung Rural Municipality (Pachthar): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'miklajung-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Miklajung Rural Municipality - Ward ' || ward_num,
                'Miklajung Rural Municipality - वडा ' || ward_num,
                'miklajung-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'miklajung-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Phalelung Rural Municipality (Pachthar): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'phalelung-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Phalelung Rural Municipality - Ward ' || ward_num,
                'Phalelung Rural Municipality - वडा ' || ward_num,
                'phalelung-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'phalelung-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Phalgunanda Rural Municipality (Pachthar): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'phalgunanda-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Phalgunanda Rural Municipality - Ward ' || ward_num,
                'Phalgunanda Rural Municipality - वडा ' || ward_num,
                'phalgunanda-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'phalgunanda-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tumbewa Rural Municipality (Pachthar): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tumbewa-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tumbewa Rural Municipality - Ward ' || ward_num,
                'Tumbewa Rural Municipality - वडा ' || ward_num,
                'tumbewa-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tumbewa-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Yangwarak Rural Municipality (Pachthar): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'yangwarak-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Yangwarak Rural Municipality - Ward ' || ward_num,
                'Yangwarak Rural Municipality - वडा ' || ward_num,
                'yangwarak-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'yangwarak-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chainpur Municipality (Sankhuwasabha): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chainpur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chainpur Municipality - Ward ' || ward_num,
                'Chainpur Municipality - वडा ' || ward_num,
                'chainpur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chainpur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dharmadevi Municipality (Sankhuwasabha): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dharmadevi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dharmadevi Municipality - Ward ' || ward_num,
                'Dharmadevi Municipality - वडा ' || ward_num,
                'dharmadevi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dharmadevi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Khandbari Municipality (Sankhuwasabha): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'khandbari-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Khandbari Municipality - Ward ' || ward_num,
                'Khandbari Municipality - वडा ' || ward_num,
                'khandbari-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'khandbari-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Madi Municipality (Sankhuwasabha): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'madi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Madi Municipality - Ward ' || ward_num,
                'Madi Municipality - वडा ' || ward_num,
                'madi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'madi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Panchkhapan Municipality (Sankhuwasabha): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'panchkhapan-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Panchkhapan Municipality - Ward ' || ward_num,
                'Panchkhapan Municipality - वडा ' || ward_num,
                'panchkhapan-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'panchkhapan-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- BhotKhola Rural Municipality (Sankhuwasabha): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bhotkhola-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'BhotKhola Rural Municipality - Ward ' || ward_num,
                'BhotKhola Rural Municipality - वडा ' || ward_num,
                'bhotkhola-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bhotkhola-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chichila Rural Municipality (Sankhuwasabha): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chichila-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chichila Rural Municipality - Ward ' || ward_num,
                'Chichila Rural Municipality - वडा ' || ward_num,
                'chichila-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chichila-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Makalu Rural Municipality (Sankhuwasabha): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'makalu-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Makalu Rural Municipality - Ward ' || ward_num,
                'Makalu Rural Municipality - वडा ' || ward_num,
                'makalu-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'makalu-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sabhapokhari Rural Municipality (Sankhuwasabha): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sabhapokhari-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sabhapokhari Rural Municipality - Ward ' || ward_num,
                'Sabhapokhari Rural Municipality - वडा ' || ward_num,
                'sabhapokhari-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sabhapokhari-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Silichong Rural Municipality (Sankhuwasabha): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'silichong-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Silichong Rural Municipality - Ward ' || ward_num,
                'Silichong Rural Municipality - वडा ' || ward_num,
                'silichong-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'silichong-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Solu Dudhkunda Municipality (Solukhumbu): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'solu-dudhkunda-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Solu Dudhkunda Municipality - Ward ' || ward_num,
                'Solu Dudhkunda Municipality - वडा ' || ward_num,
                'solu-dudhkunda-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'solu-dudhkunda-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Khumbu PasangLhamu Rural Municipality (Solukhumbu): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'khumbu-pasanglhamu-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Khumbu PasangLhamu Rural Municipality - Ward ' || ward_num,
                'Khumbu PasangLhamu Rural Municipality - वडा ' || ward_num,
                'khumbu-pasanglhamu-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'khumbu-pasanglhamu-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Likhu Pike Rural Municipality (Solukhumbu): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'likhu-pike-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Likhu Pike Rural Municipality - Ward ' || ward_num,
                'Likhu Pike Rural Municipality - वडा ' || ward_num,
                'likhu-pike-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'likhu-pike-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Maha Kulung Rural Municipality (Solukhumbu): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'maha-kulung-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Maha Kulung Rural Municipality - Ward ' || ward_num,
                'Maha Kulung Rural Municipality - वडा ' || ward_num,
                'maha-kulung-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'maha-kulung-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mapya Dudhkoshi Rural Municipality (Solukhumbu): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mapya-dudhkoshi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mapya Dudhkoshi Rural Municipality - Ward ' || ward_num,
                'Mapya Dudhkoshi Rural Municipality - वडा ' || ward_num,
                'mapya-dudhkoshi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mapya-dudhkoshi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Necha Salyan Rural Municipality (Solukhumbu): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'necha-salyan-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Necha Salyan Rural Municipality - Ward ' || ward_num,
                'Necha Salyan Rural Municipality - वडा ' || ward_num,
                'necha-salyan-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'necha-salyan-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sotang Rural Municipality (Solukhumbu): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sotang-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sotang Rural Municipality - Ward ' || ward_num,
                'Sotang Rural Municipality - वडा ' || ward_num,
                'sotang-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sotang-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Thulung Dudhkoshi Rural Municipality (Solukhumbu): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'thulung-dudhkoshi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Thulung Dudhkoshi Rural Municipality - Ward ' || ward_num,
                'Thulung Dudhkoshi Rural Municipality - वडा ' || ward_num,
                'thulung-dudhkoshi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'thulung-dudhkoshi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dharan Sub-Metropolitan City (Sunsari): 20 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dharan-sub-metropolitan-city' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..20 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dharan Sub-Metropolitan City - Ward ' || ward_num,
                'Dharan Sub-Metropolitan City - वडा ' || ward_num,
                'dharan-sub-metropolitan-city-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dharan-sub-metropolitan-city-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Itahari Sub-Metropolitan City (Sunsari): 20 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'itahari-sub-metropolitan-city' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..20 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Itahari Sub-Metropolitan City - Ward ' || ward_num,
                'Itahari Sub-Metropolitan City - वडा ' || ward_num,
                'itahari-sub-metropolitan-city-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'itahari-sub-metropolitan-city-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- BarahaKshetra Municipality (Sunsari): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'barahakshetra-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'BarahaKshetra Municipality - Ward ' || ward_num,
                'BarahaKshetra Municipality - वडा ' || ward_num,
                'barahakshetra-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'barahakshetra-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Duhabi Municipality (Sunsari): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'duhabi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Duhabi Municipality - Ward ' || ward_num,
                'Duhabi Municipality - वडा ' || ward_num,
                'duhabi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'duhabi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Inaruwa Municipality (Sunsari): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'inaruwa-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Inaruwa Municipality - Ward ' || ward_num,
                'Inaruwa Municipality - वडा ' || ward_num,
                'inaruwa-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'inaruwa-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ramdhuni Municipality (Sunsari): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ramdhuni-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ramdhuni Municipality - Ward ' || ward_num,
                'Ramdhuni Municipality - वडा ' || ward_num,
                'ramdhuni-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ramdhuni-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Barju Rural Municipality (Sunsari): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'barju-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Barju Rural Municipality - Ward ' || ward_num,
                'Barju Rural Municipality - वडा ' || ward_num,
                'barju-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'barju-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bhokraha Narsingh Rural Municipality (Sunsari): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bhokraha-narsingh-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bhokraha Narsingh Rural Municipality - Ward ' || ward_num,
                'Bhokraha Narsingh Rural Municipality - वडा ' || ward_num,
                'bhokraha-narsingh-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bhokraha-narsingh-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dewangunj Rural Municipality (Sunsari): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dewangunj-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dewangunj Rural Municipality - Ward ' || ward_num,
                'Dewangunj Rural Municipality - वडा ' || ward_num,
                'dewangunj-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dewangunj-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gadhi Rural Municipality (Sunsari): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gadhi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gadhi Rural Municipality - Ward ' || ward_num,
                'Gadhi Rural Municipality - वडा ' || ward_num,
                'gadhi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gadhi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Harinagar Rural Municipality (Sunsari): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'harinagar-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Harinagar Rural Municipality - Ward ' || ward_num,
                'Harinagar Rural Municipality - वडा ' || ward_num,
                'harinagar-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'harinagar-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Koshi Rural Municipality (Sunsari): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'koshi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Koshi Rural Municipality - Ward ' || ward_num,
                'Koshi Rural Municipality - वडा ' || ward_num,
                'koshi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'koshi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Phungling Municipality (Taplejung): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'phungling-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Phungling Municipality - Ward ' || ward_num,
                'Phungling Municipality - वडा ' || ward_num,
                'phungling-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'phungling-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Aathrai Triveni Rural Municipality (Taplejung): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'aathrai-triveni-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Aathrai Triveni Rural Municipality - Ward ' || ward_num,
                'Aathrai Triveni Rural Municipality - वडा ' || ward_num,
                'aathrai-triveni-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'aathrai-triveni-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Maiwa Khola Rural Municipality (Taplejung): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'maiwa-khola-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Maiwa Khola Rural Municipality - Ward ' || ward_num,
                'Maiwa Khola Rural Municipality - वडा ' || ward_num,
                'maiwa-khola-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'maiwa-khola-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Meringden Rural Municipality (Taplejung): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'meringden-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Meringden Rural Municipality - Ward ' || ward_num,
                'Meringden Rural Municipality - वडा ' || ward_num,
                'meringden-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'meringden-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mikwa Khola Rural Municipality (Taplejung): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mikwa-khola-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mikwa Khola Rural Municipality - Ward ' || ward_num,
                'Mikwa Khola Rural Municipality - वडा ' || ward_num,
                'mikwa-khola-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mikwa-khola-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Pathibhara Yangwarak Rural Municipality (Taplejung): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'pathibhara-yangwarak-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Pathibhara Yangwarak Rural Municipality - Ward ' || ward_num,
                'Pathibhara Yangwarak Rural Municipality - वडा ' || ward_num,
                'pathibhara-yangwarak-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'pathibhara-yangwarak-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Phaktanglung Rural Municipality (Taplejung): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'phaktanglung-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Phaktanglung Rural Municipality - Ward ' || ward_num,
                'Phaktanglung Rural Municipality - वडा ' || ward_num,
                'phaktanglung-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'phaktanglung-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sidingwa Rural Municipality (Taplejung): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sidingwa-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sidingwa Rural Municipality - Ward ' || ward_num,
                'Sidingwa Rural Municipality - वडा ' || ward_num,
                'sidingwa-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sidingwa-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sirijangha Rural Municipality (Taplejung): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sirijangha-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sirijangha Rural Municipality - Ward ' || ward_num,
                'Sirijangha Rural Municipality - वडा ' || ward_num,
                'sirijangha-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sirijangha-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Laligurans Municipality (Terhathum): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'laligurans-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Laligurans Municipality - Ward ' || ward_num,
                'Laligurans Municipality - वडा ' || ward_num,
                'laligurans-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'laligurans-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Myanglung Municipality (Terhathum): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'myanglung-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Myanglung Municipality - Ward ' || ward_num,
                'Myanglung Municipality - वडा ' || ward_num,
                'myanglung-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'myanglung-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Aathrai Rural Municipality (Terhathum): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'aathrai-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Aathrai Rural Municipality - Ward ' || ward_num,
                'Aathrai Rural Municipality - वडा ' || ward_num,
                'aathrai-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'aathrai-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chhathar Rural Municipality (Terhathum): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chhathar-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chhathar Rural Municipality - Ward ' || ward_num,
                'Chhathar Rural Municipality - वडा ' || ward_num,
                'chhathar-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chhathar-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Menchayayem Rural Municipality (Terhathum): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'menchayayem-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Menchayayem Rural Municipality - Ward ' || ward_num,
                'Menchayayem Rural Municipality - वडा ' || ward_num,
                'menchayayem-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'menchayayem-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Phedap Rural Municipality (Terhathum): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'phedap-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Phedap Rural Municipality - Ward ' || ward_num,
                'Phedap Rural Municipality - वडा ' || ward_num,
                'phedap-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'phedap-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Belaka Municipality (Udayapur): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'belaka-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Belaka Municipality - Ward ' || ward_num,
                'Belaka Municipality - वडा ' || ward_num,
                'belaka-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'belaka-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chaudandigadhi Municipality (Udayapur): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chaudandigadhi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chaudandigadhi Municipality - Ward ' || ward_num,
                'Chaudandigadhi Municipality - वडा ' || ward_num,
                'chaudandigadhi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chaudandigadhi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Katari Municipality (Udayapur): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'katari-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Katari Municipality - Ward ' || ward_num,
                'Katari Municipality - वडा ' || ward_num,
                'katari-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'katari-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Triyuga Municipality (Udayapur): 16 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'triyuga-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..16 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Triyuga Municipality - Ward ' || ward_num,
                'Triyuga Municipality - वडा ' || ward_num,
                'triyuga-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'triyuga-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Limchungbung Rural Municipality (Udayapur): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'limchungbung-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Limchungbung Rural Municipality - Ward ' || ward_num,
                'Limchungbung Rural Municipality - वडा ' || ward_num,
                'limchungbung-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'limchungbung-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rautamai Rural Municipality (Udayapur): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rautamai-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rautamai Rural Municipality - Ward ' || ward_num,
                'Rautamai Rural Municipality - वडा ' || ward_num,
                'rautamai-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rautamai-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tapli Rural Municipality (Udayapur): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tapli-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tapli Rural Municipality - Ward ' || ward_num,
                'Tapli Rural Municipality - वडा ' || ward_num,
                'tapli-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tapli-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Udayapurgadhi Rural Municipality (Udayapur): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'udayapurgadhi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Udayapurgadhi Rural Municipality - Ward ' || ward_num,
                'Udayapurgadhi Rural Municipality - वडा ' || ward_num,
                'udayapurgadhi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'udayapurgadhi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Birgunj Metropolitan City (Parsa): 32 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'birgunj-metropolitan-city' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..32 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Birgunj Metropolitan City - Ward ' || ward_num,
                'Birgunj Metropolitan City - वडा ' || ward_num,
                'birgunj-metropolitan-city-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'birgunj-metropolitan-city-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bahudarmai Municipality (Parsa): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bahudarmai-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bahudarmai Municipality - Ward ' || ward_num,
                'Bahudarmai Municipality - वडा ' || ward_num,
                'bahudarmai-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bahudarmai-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Parsagadhi Municipality (Parsa): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'parsagadhi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Parsagadhi Municipality - Ward ' || ward_num,
                'Parsagadhi Municipality - वडा ' || ward_num,
                'parsagadhi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'parsagadhi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Pokhariya Municipality (Parsa): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'pokhariya-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Pokhariya Municipality - Ward ' || ward_num,
                'Pokhariya Municipality - वडा ' || ward_num,
                'pokhariya-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'pokhariya-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bindabasini Rural Municipality (Parsa): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bindabasini-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bindabasini Rural Municipality - Ward ' || ward_num,
                'Bindabasini Rural Municipality - वडा ' || ward_num,
                'bindabasini-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bindabasini-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chhipaharmai Rural Municipality (Parsa): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chhipaharmai-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chhipaharmai Rural Municipality - Ward ' || ward_num,
                'Chhipaharmai Rural Municipality - वडा ' || ward_num,
                'chhipaharmai-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chhipaharmai-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dhobini Rural Municipality (Parsa): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dhobini-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dhobini Rural Municipality - Ward ' || ward_num,
                'Dhobini Rural Municipality - वडा ' || ward_num,
                'dhobini-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dhobini-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Jagarnathpur Rural Municipality (Parsa): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'jagarnathpur-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Jagarnathpur Rural Municipality - Ward ' || ward_num,
                'Jagarnathpur Rural Municipality - वडा ' || ward_num,
                'jagarnathpur-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'jagarnathpur-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Jirabhawani Rural Municipality (Parsa): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'jirabhawani-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Jirabhawani Rural Municipality - Ward ' || ward_num,
                'Jirabhawani Rural Municipality - वडा ' || ward_num,
                'jirabhawani-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'jirabhawani-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kalikamai Rural Municipality (Parsa): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kalikamai-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kalikamai Rural Municipality - Ward ' || ward_num,
                'Kalikamai Rural Municipality - वडा ' || ward_num,
                'kalikamai-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kalikamai-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Pakaha Mainpur Rural Municipality (Parsa): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'pakaha-mainpur-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Pakaha Mainpur Rural Municipality - Ward ' || ward_num,
                'Pakaha Mainpur Rural Municipality - वडा ' || ward_num,
                'pakaha-mainpur-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'pakaha-mainpur-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Paterwa Sugauli Rural Municipality (Parsa): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'paterwa-sugauli-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Paterwa Sugauli Rural Municipality - Ward ' || ward_num,
                'Paterwa Sugauli Rural Municipality - वडा ' || ward_num,
                'paterwa-sugauli-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'paterwa-sugauli-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sakhuwa Prasauni Rural Municipality (Parsa): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sakhuwa-prasauni-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sakhuwa Prasauni Rural Municipality - Ward ' || ward_num,
                'Sakhuwa Prasauni Rural Municipality - वडा ' || ward_num,
                'sakhuwa-prasauni-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sakhuwa-prasauni-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Thori Rural Municipality (Parsa): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'thori-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Thori Rural Municipality - Ward ' || ward_num,
                'Thori Rural Municipality - वडा ' || ward_num,
                'thori-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'thori-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Jitpur Simara Sub-Metropolitan City (Bara): 24 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'jitpur-simara-sub-metropolitan-city' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..24 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Jitpur Simara Sub-Metropolitan City - Ward ' || ward_num,
                'Jitpur Simara Sub-Metropolitan City - वडा ' || ward_num,
                'jitpur-simara-sub-metropolitan-city-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'jitpur-simara-sub-metropolitan-city-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kalaiya Sub-Metropolitan City (Bara): 27 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kalaiya-sub-metropolitan-city' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..27 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kalaiya Sub-Metropolitan City - Ward ' || ward_num,
                'Kalaiya Sub-Metropolitan City - वडा ' || ward_num,
                'kalaiya-sub-metropolitan-city-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kalaiya-sub-metropolitan-city-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kolhabi Municipality (Bara): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kolhabi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kolhabi Municipality - Ward ' || ward_num,
                'Kolhabi Municipality - वडा ' || ward_num,
                'kolhabi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kolhabi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mahagadhimai Municipality (Bara): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mahagadhimai-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mahagadhimai Municipality - Ward ' || ward_num,
                'Mahagadhimai Municipality - वडा ' || ward_num,
                'mahagadhimai-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mahagadhimai-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Nijgadh Municipality (Bara): 13 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'nijgadh-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..13 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Nijgadh Municipality - Ward ' || ward_num,
                'Nijgadh Municipality - वडा ' || ward_num,
                'nijgadh-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'nijgadh-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Pacharauta Municipality (Bara): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'pacharauta-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Pacharauta Municipality - Ward ' || ward_num,
                'Pacharauta Municipality - वडा ' || ward_num,
                'pacharauta-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'pacharauta-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Simaraungadh Municipality (Bara): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'simaraungadh-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Simaraungadh Municipality - Ward ' || ward_num,
                'Simaraungadh Municipality - वडा ' || ward_num,
                'simaraungadh-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'simaraungadh-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Adarsh Kotwal Rural Municipality (Bara): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'adarsh-kotwal-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Adarsh Kotwal Rural Municipality - Ward ' || ward_num,
                'Adarsh Kotwal Rural Municipality - वडा ' || ward_num,
                'adarsh-kotwal-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'adarsh-kotwal-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Baragadhi Rural Municipality (Bara): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'baragadhi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Baragadhi Rural Municipality - Ward ' || ward_num,
                'Baragadhi Rural Municipality - वडा ' || ward_num,
                'baragadhi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'baragadhi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bishrampur Rural Municipality (Bara): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bishrampur-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bishrampur Rural Municipality - Ward ' || ward_num,
                'Bishrampur Rural Municipality - वडा ' || ward_num,
                'bishrampur-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bishrampur-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Devtal Rural Municipality (Bara): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'devtal-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Devtal Rural Municipality - Ward ' || ward_num,
                'Devtal Rural Municipality - वडा ' || ward_num,
                'devtal-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'devtal-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Karaiyamai Rural Municipality (Bara): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'karaiyamai-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Karaiyamai Rural Municipality - Ward ' || ward_num,
                'Karaiyamai Rural Municipality - वडा ' || ward_num,
                'karaiyamai-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'karaiyamai-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Parwanipur Rural Municipality (Bara): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'parwanipur-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Parwanipur Rural Municipality - Ward ' || ward_num,
                'Parwanipur Rural Municipality - वडा ' || ward_num,
                'parwanipur-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'parwanipur-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Pheta Rural Municipality (Bara): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'pheta-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Pheta Rural Municipality - Ward ' || ward_num,
                'Pheta Rural Municipality - वडा ' || ward_num,
                'pheta-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'pheta-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Prasauni Rural Municipality (Bara): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'prasauni-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Prasauni Rural Municipality - Ward ' || ward_num,
                'Prasauni Rural Municipality - वडा ' || ward_num,
                'prasauni-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'prasauni-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Suwarna Rural Municipality (Bara): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'suwarna-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Suwarna Rural Municipality - Ward ' || ward_num,
                'Suwarna Rural Municipality - वडा ' || ward_num,
                'suwarna-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'suwarna-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Baudhimai Municipality (Rautahat): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'baudhimai-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Baudhimai Municipality - Ward ' || ward_num,
                'Baudhimai Municipality - वडा ' || ward_num,
                'baudhimai-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'baudhimai-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Brindaban Municipality (Rautahat): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'brindaban-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Brindaban Municipality - Ward ' || ward_num,
                'Brindaban Municipality - वडा ' || ward_num,
                'brindaban-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'brindaban-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chandrapur Municipality (Rautahat): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chandrapur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chandrapur Municipality - Ward ' || ward_num,
                'Chandrapur Municipality - वडा ' || ward_num,
                'chandrapur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chandrapur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dewahi Gonahi Municipality (Rautahat): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dewahi-gonahi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dewahi Gonahi Municipality - Ward ' || ward_num,
                'Dewahi Gonahi Municipality - वडा ' || ward_num,
                'dewahi-gonahi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dewahi-gonahi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gadhimai Municipality (Rautahat): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gadhimai-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gadhimai Municipality - Ward ' || ward_num,
                'Gadhimai Municipality - वडा ' || ward_num,
                'gadhimai-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gadhimai-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gaur Municipality (Rautahat): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gaur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gaur Municipality - Ward ' || ward_num,
                'Gaur Municipality - वडा ' || ward_num,
                'gaur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gaur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gujara Municipality (Rautahat): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gujara-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gujara Municipality - Ward ' || ward_num,
                'Gujara Municipality - वडा ' || ward_num,
                'gujara-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gujara-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Guruda Municipality (Rautahat): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'guruda-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Guruda Municipality - Ward ' || ward_num,
                'Guruda Municipality - वडा ' || ward_num,
                'guruda-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'guruda-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ishanath Municipality (Rautahat): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ishanath-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ishanath Municipality - Ward ' || ward_num,
                'Ishanath Municipality - वडा ' || ward_num,
                'ishanath-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ishanath-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Katahariya Municipality (Rautahat): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'katahariya-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Katahariya Municipality - Ward ' || ward_num,
                'Katahariya Municipality - वडा ' || ward_num,
                'katahariya-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'katahariya-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Madhav Narayan Municipality (Rautahat): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'madhav-narayan-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Madhav Narayan Municipality - Ward ' || ward_num,
                'Madhav Narayan Municipality - वडा ' || ward_num,
                'madhav-narayan-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'madhav-narayan-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Maulapur Municipality (Rautahat): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'maulapur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Maulapur Municipality - Ward ' || ward_num,
                'Maulapur Municipality - वडा ' || ward_num,
                'maulapur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'maulapur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Paroha Municipality (Rautahat): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'paroha-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Paroha Municipality - Ward ' || ward_num,
                'Paroha Municipality - वडा ' || ward_num,
                'paroha-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'paroha-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Phatuwa Bijayapur Municipality (Rautahat): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'phatuwa-bijayapur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Phatuwa Bijayapur Municipality - Ward ' || ward_num,
                'Phatuwa Bijayapur Municipality - वडा ' || ward_num,
                'phatuwa-bijayapur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'phatuwa-bijayapur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rajdevi Municipality (Rautahat): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rajdevi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rajdevi Municipality - Ward ' || ward_num,
                'Rajdevi Municipality - वडा ' || ward_num,
                'rajdevi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rajdevi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rajpur Municipality (Rautahat): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rajpur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rajpur Municipality - Ward ' || ward_num,
                'Rajpur Municipality - वडा ' || ward_num,
                'rajpur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rajpur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Durga Bhagwati Rural Municipality (Rautahat): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'durga-bhagwati-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Durga Bhagwati Rural Municipality - Ward ' || ward_num,
                'Durga Bhagwati Rural Municipality - वडा ' || ward_num,
                'durga-bhagwati-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'durga-bhagwati-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Yamunamai Rural Municipality (Rautahat): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'yamunamai-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Yamunamai Rural Municipality - Ward ' || ward_num,
                'Yamunamai Rural Municipality - वडा ' || ward_num,
                'yamunamai-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'yamunamai-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bagmati Municipality (Sarlahi): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bagmati-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bagmati Municipality - Ward ' || ward_num,
                'Bagmati Municipality - वडा ' || ward_num,
                'bagmati-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bagmati-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Balara Municipality (Sarlahi): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'balara-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Balara Municipality - Ward ' || ward_num,
                'Balara Municipality - वडा ' || ward_num,
                'balara-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'balara-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Barahathwa Municipality (Sarlahi): 18 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'barahathwa-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..18 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Barahathwa Municipality - Ward ' || ward_num,
                'Barahathwa Municipality - वडा ' || ward_num,
                'barahathwa-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'barahathwa-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Godaita Municipality (Sarlahi): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'godaita-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Godaita Municipality - Ward ' || ward_num,
                'Godaita Municipality - वडा ' || ward_num,
                'godaita-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'godaita-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Haripur Municipality (Sarlahi): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'haripur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Haripur Municipality - Ward ' || ward_num,
                'Haripur Municipality - वडा ' || ward_num,
                'haripur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'haripur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Haripurwa Municipality (Sarlahi): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'haripurwa-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Haripurwa Municipality - Ward ' || ward_num,
                'Haripurwa Municipality - वडा ' || ward_num,
                'haripurwa-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'haripurwa-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Hariwan Municipality (Sarlahi): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'hariwan-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Hariwan Municipality - Ward ' || ward_num,
                'Hariwan Municipality - वडा ' || ward_num,
                'hariwan-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'hariwan-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ishowrpur Municipality (Sarlahi): 15 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ishowrpur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..15 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ishowrpur Municipality - Ward ' || ward_num,
                'Ishowrpur Municipality - वडा ' || ward_num,
                'ishowrpur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ishowrpur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kabilasi Municipality (Sarlahi): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kabilasi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kabilasi Municipality - Ward ' || ward_num,
                'Kabilasi Municipality - वडा ' || ward_num,
                'kabilasi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kabilasi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Lalbandi Municipality (Sarlahi): 17 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'lalbandi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..17 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Lalbandi Municipality - Ward ' || ward_num,
                'Lalbandi Municipality - वडा ' || ward_num,
                'lalbandi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'lalbandi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Malangawa Municipality (Sarlahi): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'malangawa-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Malangawa Municipality - Ward ' || ward_num,
                'Malangawa Municipality - वडा ' || ward_num,
                'malangawa-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'malangawa-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Basbariya Rural Municipality (Sarlahi): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'basbariya-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Basbariya Rural Municipality - Ward ' || ward_num,
                'Basbariya Rural Municipality - वडा ' || ward_num,
                'basbariya-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'basbariya-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bisnu Rural Municipality (Sarlahi): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bisnu-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bisnu Rural Municipality - Ward ' || ward_num,
                'Bisnu Rural Municipality - वडा ' || ward_num,
                'bisnu-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bisnu-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Brahampuri Rural Municipality (Sarlahi): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'brahampuri-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Brahampuri Rural Municipality - Ward ' || ward_num,
                'Brahampuri Rural Municipality - वडा ' || ward_num,
                'brahampuri-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'brahampuri-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chakraghatta Rural Municipality (Sarlahi): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chakraghatta-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chakraghatta Rural Municipality - Ward ' || ward_num,
                'Chakraghatta Rural Municipality - वडा ' || ward_num,
                'chakraghatta-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chakraghatta-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chandranagar Rural Municipality (Sarlahi): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chandranagar-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chandranagar Rural Municipality - Ward ' || ward_num,
                'Chandranagar Rural Municipality - वडा ' || ward_num,
                'chandranagar-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chandranagar-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dhankaul Rural Municipality (Sarlahi): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dhankaul-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dhankaul Rural Municipality - Ward ' || ward_num,
                'Dhankaul Rural Municipality - वडा ' || ward_num,
                'dhankaul-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dhankaul-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kaudena Rural Municipality (Sarlahi): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kaudena-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kaudena Rural Municipality - Ward ' || ward_num,
                'Kaudena Rural Municipality - वडा ' || ward_num,
                'kaudena-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kaudena-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Parsa Rural Municipality (Sarlahi): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'parsa-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Parsa Rural Municipality - Ward ' || ward_num,
                'Parsa Rural Municipality - वडा ' || ward_num,
                'parsa-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'parsa-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ramnagar Rural Municipality (Sarlahi): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ramnagar-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ramnagar Rural Municipality - Ward ' || ward_num,
                'Ramnagar Rural Municipality - वडा ' || ward_num,
                'ramnagar-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ramnagar-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dhangadhimai Municipality (Siraha): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dhangadhimai-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dhangadhimai Municipality - Ward ' || ward_num,
                'Dhangadhimai Municipality - वडा ' || ward_num,
                'dhangadhimai-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dhangadhimai-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Golbazar Municipality (Siraha): 13 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'golbazar-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..13 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Golbazar Municipality - Ward ' || ward_num,
                'Golbazar Municipality - वडा ' || ward_num,
                'golbazar-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'golbazar-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kalyanpur Municipality (Siraha): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kalyanpur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kalyanpur Municipality - Ward ' || ward_num,
                'Kalyanpur Municipality - वडा ' || ward_num,
                'kalyanpur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kalyanpur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Karjanha Municipality (Siraha): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'karjanha-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Karjanha Municipality - Ward ' || ward_num,
                'Karjanha Municipality - वडा ' || ward_num,
                'karjanha-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'karjanha-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Lahan Municipality (Siraha): 24 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'lahan-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..24 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Lahan Municipality - Ward ' || ward_num,
                'Lahan Municipality - वडा ' || ward_num,
                'lahan-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'lahan-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mirchaiya Municipality (Siraha): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mirchaiya-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mirchaiya Municipality - Ward ' || ward_num,
                'Mirchaiya Municipality - वडा ' || ward_num,
                'mirchaiya-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mirchaiya-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Siraha Municipality (Siraha): 22 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'siraha-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..22 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Siraha Municipality - Ward ' || ward_num,
                'Siraha Municipality - वडा ' || ward_num,
                'siraha-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'siraha-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sukhipur Municipality (Siraha): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sukhipur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sukhipur Municipality - Ward ' || ward_num,
                'Sukhipur Municipality - वडा ' || ward_num,
                'sukhipur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sukhipur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Arnama Rural Municipality (Siraha): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'arnama-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Arnama Rural Municipality - Ward ' || ward_num,
                'Arnama Rural Municipality - वडा ' || ward_num,
                'arnama-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'arnama-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Aurahi Rural Municipality (Siraha): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'aurahi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Aurahi Rural Municipality - Ward ' || ward_num,
                'Aurahi Rural Municipality - वडा ' || ward_num,
                'aurahi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'aurahi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bariyarpatti Rural Municipality (Siraha): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bariyarpatti-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bariyarpatti Rural Municipality - Ward ' || ward_num,
                'Bariyarpatti Rural Municipality - वडा ' || ward_num,
                'bariyarpatti-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bariyarpatti-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bhagwanpur Rural Municipality (Siraha): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bhagwanpur-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bhagwanpur Rural Municipality - Ward ' || ward_num,
                'Bhagwanpur Rural Municipality - वडा ' || ward_num,
                'bhagwanpur-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bhagwanpur-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bishnupur Rural Municipality (Siraha): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bishnupur-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bishnupur Rural Municipality - Ward ' || ward_num,
                'Bishnupur Rural Municipality - वडा ' || ward_num,
                'bishnupur-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bishnupur-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Lakshmipur Patari Rural Municipality (Siraha): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'lakshmipur-patari-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Lakshmipur Patari Rural Municipality - Ward ' || ward_num,
                'Lakshmipur Patari Rural Municipality - वडा ' || ward_num,
                'lakshmipur-patari-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'lakshmipur-patari-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Naraha Rural Municipality (Siraha): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'naraha-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Naraha Rural Municipality - Ward ' || ward_num,
                'Naraha Rural Municipality - वडा ' || ward_num,
                'naraha-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'naraha-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Navarajpur Rural Municipality (Siraha): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'navarajpur-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Navarajpur Rural Municipality - Ward ' || ward_num,
                'Navarajpur Rural Municipality - वडा ' || ward_num,
                'navarajpur-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'navarajpur-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- SakhuwanankarKatti Rural Municipality (Siraha): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sakhuwanankarkatti-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'SakhuwanankarKatti Rural Municipality - Ward ' || ward_num,
                'SakhuwanankarKatti Rural Municipality - वडा ' || ward_num,
                'sakhuwanankarkatti-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sakhuwanankarkatti-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Janakpurdham Sub-Metropolitan City (Dhanusha): 25 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'janakpurdham-sub-metropolitan-city' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..25 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Janakpurdham Sub-Metropolitan City - Ward ' || ward_num,
                'Janakpurdham Sub-Metropolitan City - वडा ' || ward_num,
                'janakpurdham-sub-metropolitan-city-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'janakpurdham-sub-metropolitan-city-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bideha Municipality (Dhanusha): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bideha-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bideha Municipality - Ward ' || ward_num,
                'Bideha Municipality - वडा ' || ward_num,
                'bideha-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bideha-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chhireshwarnath Municipality (Dhanusha): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chhireshwarnath-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chhireshwarnath Municipality - Ward ' || ward_num,
                'Chhireshwarnath Municipality - वडा ' || ward_num,
                'chhireshwarnath-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chhireshwarnath-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dhanushadham Municipality (Dhanusha): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dhanushadham-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dhanushadham Municipality - Ward ' || ward_num,
                'Dhanushadham Municipality - वडा ' || ward_num,
                'dhanushadham-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dhanushadham-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ganeshman Charnath Municipality (Dhanusha): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ganeshman-charnath-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ganeshman Charnath Municipality - Ward ' || ward_num,
                'Ganeshman Charnath Municipality - वडा ' || ward_num,
                'ganeshman-charnath-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ganeshman-charnath-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Hansapur Municipality (Dhanusha): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'hansapur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Hansapur Municipality - Ward ' || ward_num,
                'Hansapur Municipality - वडा ' || ward_num,
                'hansapur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'hansapur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kamala Municipality (Dhanusha): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kamala-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kamala Municipality - Ward ' || ward_num,
                'Kamala Municipality - वडा ' || ward_num,
                'kamala-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kamala-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mithila Municipality (Dhanusha): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mithila-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mithila Municipality - Ward ' || ward_num,
                'Mithila Municipality - वडा ' || ward_num,
                'mithila-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mithila-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- MithilaBihari Municipality (Dhanusha): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mithilabihari-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'MithilaBihari Municipality - Ward ' || ward_num,
                'MithilaBihari Municipality - वडा ' || ward_num,
                'mithilabihari-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mithilabihari-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Nagarain Municipality (Dhanusha): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'nagarain-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Nagarain Municipality - Ward ' || ward_num,
                'Nagarain Municipality - वडा ' || ward_num,
                'nagarain-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'nagarain-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sabaila Municipality (Dhanusha): 13 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sabaila-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..13 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sabaila Municipality - Ward ' || ward_num,
                'Sabaila Municipality - वडा ' || ward_num,
                'sabaila-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sabaila-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sahidnagar Municipality (Dhanusha): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sahidnagar-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sahidnagar Municipality - Ward ' || ward_num,
                'Sahidnagar Municipality - वडा ' || ward_num,
                'sahidnagar-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sahidnagar-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Aaurahi Rural Municipality (Dhanusha): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'aaurahi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Aaurahi Rural Municipality - Ward ' || ward_num,
                'Aaurahi Rural Municipality - वडा ' || ward_num,
                'aaurahi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'aaurahi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bateshwar Rural Municipality (Dhanusha): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bateshwar-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bateshwar Rural Municipality - Ward ' || ward_num,
                'Bateshwar Rural Municipality - वडा ' || ward_num,
                'bateshwar-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bateshwar-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dhanauji Rural Municipality (Dhanusha): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dhanauji-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dhanauji Rural Municipality - Ward ' || ward_num,
                'Dhanauji Rural Municipality - वडा ' || ward_num,
                'dhanauji-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dhanauji-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Janaknandani Rural Municipality (Dhanusha): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'janaknandani-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Janaknandani Rural Municipality - Ward ' || ward_num,
                'Janaknandani Rural Municipality - वडा ' || ward_num,
                'janaknandani-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'janaknandani-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Lakshminya Rural Municipality (Dhanusha): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'lakshminya-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Lakshminya Rural Municipality - Ward ' || ward_num,
                'Lakshminya Rural Municipality - वडा ' || ward_num,
                'lakshminya-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'lakshminya-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mukhiyapatti Musharniya Rural Municipality (Dhanusha): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mukhiyapatti-musharniya-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mukhiyapatti Musharniya Rural Municipality - Ward ' || ward_num,
                'Mukhiyapatti Musharniya Rural Municipality - वडा ' || ward_num,
                'mukhiyapatti-musharniya-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mukhiyapatti-musharniya-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bodebarsain Municipality (Saptari): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bodebarsain-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bodebarsain Municipality - Ward ' || ward_num,
                'Bodebarsain Municipality - वडा ' || ward_num,
                'bodebarsain-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bodebarsain-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dakneshwori Municipality (Saptari): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dakneshwori-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dakneshwori Municipality - Ward ' || ward_num,
                'Dakneshwori Municipality - वडा ' || ward_num,
                'dakneshwori-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dakneshwori-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Hanumannagar Kankalini Municipality (Saptari): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'hanumannagar-kankalini-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Hanumannagar Kankalini Municipality - Ward ' || ward_num,
                'Hanumannagar Kankalini Municipality - वडा ' || ward_num,
                'hanumannagar-kankalini-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'hanumannagar-kankalini-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kanchanrup Municipality (Saptari): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kanchanrup-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kanchanrup Municipality - Ward ' || ward_num,
                'Kanchanrup Municipality - वडा ' || ward_num,
                'kanchanrup-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kanchanrup-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Khadak Municipality (Saptari): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'khadak-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Khadak Municipality - Ward ' || ward_num,
                'Khadak Municipality - वडा ' || ward_num,
                'khadak-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'khadak-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rajbiraj Municipality (Saptari): 16 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rajbiraj-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..16 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rajbiraj Municipality - Ward ' || ward_num,
                'Rajbiraj Municipality - वडा ' || ward_num,
                'rajbiraj-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rajbiraj-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Saptakoshi Municipality (Saptari): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'saptakoshi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Saptakoshi Municipality - Ward ' || ward_num,
                'Saptakoshi Municipality - वडा ' || ward_num,
                'saptakoshi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'saptakoshi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Shambhunath Municipality (Saptari): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'shambhunath-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Shambhunath Municipality - Ward ' || ward_num,
                'Shambhunath Municipality - वडा ' || ward_num,
                'shambhunath-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'shambhunath-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Surunga Municipality (Saptari): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'surunga-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Surunga Municipality - Ward ' || ward_num,
                'Surunga Municipality - वडा ' || ward_num,
                'surunga-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'surunga-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Agnisaira Krishnasavaran Rural Municipality (Saptari): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'agnisaira-krishnasavaran-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Agnisaira Krishnasavaran Rural Municipality - Ward ' || ward_num,
                'Agnisaira Krishnasavaran Rural Municipality - वडा ' || ward_num,
                'agnisaira-krishnasavaran-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'agnisaira-krishnasavaran-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Balan-Bihul Rural Municipality (Saptari): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'balan-bihul-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Balan-Bihul Rural Municipality - Ward ' || ward_num,
                'Balan-Bihul Rural Municipality - वडा ' || ward_num,
                'balan-bihul-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'balan-bihul-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bishnupur Rural Municipality (Saptari): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bishnupur-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bishnupur Rural Municipality - Ward ' || ward_num,
                'Bishnupur Rural Municipality - वडा ' || ward_num,
                'bishnupur-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bishnupur-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chhinnamasta Rural Municipality (Saptari): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chhinnamasta-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chhinnamasta Rural Municipality - Ward ' || ward_num,
                'Chhinnamasta Rural Municipality - वडा ' || ward_num,
                'chhinnamasta-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chhinnamasta-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mahadeva Rural Municipality (Saptari): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mahadeva-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mahadeva Rural Municipality - Ward ' || ward_num,
                'Mahadeva Rural Municipality - वडा ' || ward_num,
                'mahadeva-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mahadeva-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rajgadh Rural Municipality (Saptari): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rajgadh-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rajgadh Rural Municipality - Ward ' || ward_num,
                'Rajgadh Rural Municipality - वडा ' || ward_num,
                'rajgadh-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rajgadh-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rupani Rural Municipality (Saptari): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rupani-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rupani Rural Municipality - Ward ' || ward_num,
                'Rupani Rural Municipality - वडा ' || ward_num,
                'rupani-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rupani-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tilathi Koiladi Rural Municipality (Saptari): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tilathi-koiladi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tilathi Koiladi Rural Municipality - Ward ' || ward_num,
                'Tilathi Koiladi Rural Municipality - वडा ' || ward_num,
                'tilathi-koiladi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tilathi-koiladi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tirhut Rural Municipality (Saptari): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tirhut-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tirhut Rural Municipality - Ward ' || ward_num,
                'Tirhut Rural Municipality - वडा ' || ward_num,
                'tirhut-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tirhut-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Aaurahi Municipality (Mahottari): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'aaurahi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Aaurahi Municipality - Ward ' || ward_num,
                'Aaurahi Municipality - वडा ' || ward_num,
                'aaurahi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'aaurahi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Balawa Municipality (Mahottari): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'balawa-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Balawa Municipality - Ward ' || ward_num,
                'Balawa Municipality - वडा ' || ward_num,
                'balawa-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'balawa-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bardibas Municipality (Mahottari): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bardibas-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bardibas Municipality - Ward ' || ward_num,
                'Bardibas Municipality - वडा ' || ward_num,
                'bardibas-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bardibas-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bhangaha Municipality (Mahottari): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bhangaha-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bhangaha Municipality - Ward ' || ward_num,
                'Bhangaha Municipality - वडा ' || ward_num,
                'bhangaha-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bhangaha-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gaushala Municipality (Mahottari): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gaushala-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gaushala Municipality - Ward ' || ward_num,
                'Gaushala Municipality - वडा ' || ward_num,
                'gaushala-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gaushala-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Jaleshor Municipality (Mahottari): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'jaleshor-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Jaleshor Municipality - Ward ' || ward_num,
                'Jaleshor Municipality - वडा ' || ward_num,
                'jaleshor-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'jaleshor-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Loharpatti Municipality (Mahottari): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'loharpatti-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Loharpatti Municipality - Ward ' || ward_num,
                'Loharpatti Municipality - वडा ' || ward_num,
                'loharpatti-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'loharpatti-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Manara Shiswa Municipality (Mahottari): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'manara-shiswa-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Manara Shiswa Municipality - Ward ' || ward_num,
                'Manara Shiswa Municipality - वडा ' || ward_num,
                'manara-shiswa-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'manara-shiswa-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Matihani Municipality (Mahottari): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'matihani-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Matihani Municipality - Ward ' || ward_num,
                'Matihani Municipality - वडा ' || ward_num,
                'matihani-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'matihani-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ramgopalpur Municipality (Mahottari): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ramgopalpur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ramgopalpur Municipality - Ward ' || ward_num,
                'Ramgopalpur Municipality - वडा ' || ward_num,
                'ramgopalpur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ramgopalpur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ekdara Rural Municipality (Mahottari): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ekdara-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ekdara Rural Municipality - Ward ' || ward_num,
                'Ekdara Rural Municipality - वडा ' || ward_num,
                'ekdara-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ekdara-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mahottari Rural Municipality (Mahottari): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mahottari-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mahottari Rural Municipality - Ward ' || ward_num,
                'Mahottari Rural Municipality - वडा ' || ward_num,
                'mahottari-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mahottari-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Pipara Rural Municipality (Mahottari): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'pipara-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Pipara Rural Municipality - Ward ' || ward_num,
                'Pipara Rural Municipality - वडा ' || ward_num,
                'pipara-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'pipara-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Samsi Rural Municipality (Mahottari): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'samsi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Samsi Rural Municipality - Ward ' || ward_num,
                'Samsi Rural Municipality - वडा ' || ward_num,
                'samsi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'samsi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sonama Rural Municipality (Mahottari): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sonama-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sonama Rural Municipality - Ward ' || ward_num,
                'Sonama Rural Municipality - वडा ' || ward_num,
                'sonama-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sonama-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bhaktapur Municipality (Bhaktapur): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bhaktapur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bhaktapur Municipality - Ward ' || ward_num,
                'Bhaktapur Municipality - वडा ' || ward_num,
                'bhaktapur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bhaktapur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Changunarayan Municipality (Bhaktapur): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'changunarayan-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Changunarayan Municipality - Ward ' || ward_num,
                'Changunarayan Municipality - वडा ' || ward_num,
                'changunarayan-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'changunarayan-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Madhyapur Thimi Municipality (Bhaktapur): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'madhyapur-thimi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Madhyapur Thimi Municipality - Ward ' || ward_num,
                'Madhyapur Thimi Municipality - वडा ' || ward_num,
                'madhyapur-thimi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'madhyapur-thimi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Suryabinayak Municipality (Bhaktapur): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'suryabinayak-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Suryabinayak Municipality - Ward ' || ward_num,
                'Suryabinayak Municipality - वडा ' || ward_num,
                'suryabinayak-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'suryabinayak-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bharatpur Metropolitan City (Chitwan): 29 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bharatpur-metropolitan-city' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..29 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bharatpur Metropolitan City - Ward ' || ward_num,
                'Bharatpur Metropolitan City - वडा ' || ward_num,
                'bharatpur-metropolitan-city-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bharatpur-metropolitan-city-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kalika Municipality (Chitwan): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kalika-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kalika Municipality - Ward ' || ward_num,
                'Kalika Municipality - वडा ' || ward_num,
                'kalika-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kalika-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Khairhani Municipality (Chitwan): 13 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'khairhani-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..13 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Khairhani Municipality - Ward ' || ward_num,
                'Khairhani Municipality - वडा ' || ward_num,
                'khairhani-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'khairhani-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Madi Municipality (Chitwan): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'madi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Madi Municipality - Ward ' || ward_num,
                'Madi Municipality - वडा ' || ward_num,
                'madi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'madi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rapti Municipality (Chitwan): 13 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rapti-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..13 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rapti Municipality - Ward ' || ward_num,
                'Rapti Municipality - वडा ' || ward_num,
                'rapti-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rapti-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ratnagar Municipality (Chitwan): 16 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ratnagar-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..16 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ratnagar Municipality - Ward ' || ward_num,
                'Ratnagar Municipality - वडा ' || ward_num,
                'ratnagar-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ratnagar-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ichchhakamana Rural Municipality (Chitwan): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ichchhakamana-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ichchhakamana Rural Municipality - Ward ' || ward_num,
                'Ichchhakamana Rural Municipality - वडा ' || ward_num,
                'ichchhakamana-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ichchhakamana-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dhunibeshi Municipality (Dhading): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dhunibeshi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dhunibeshi Municipality - Ward ' || ward_num,
                'Dhunibeshi Municipality - वडा ' || ward_num,
                'dhunibeshi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dhunibeshi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Nilkantha Municipality (Dhading): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'nilkantha-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Nilkantha Municipality - Ward ' || ward_num,
                'Nilkantha Municipality - वडा ' || ward_num,
                'nilkantha-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'nilkantha-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Benighat Rorang Rural Municipality (Dhading): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'benighat-rorang-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Benighat Rorang Rural Municipality - Ward ' || ward_num,
                'Benighat Rorang Rural Municipality - वडा ' || ward_num,
                'benighat-rorang-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'benighat-rorang-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gajuri Rural Municipality (Dhading): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gajuri-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gajuri Rural Municipality - Ward ' || ward_num,
                'Gajuri Rural Municipality - वडा ' || ward_num,
                'gajuri-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gajuri-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Galchhi Rural Municipality (Dhading): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'galchhi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Galchhi Rural Municipality - Ward ' || ward_num,
                'Galchhi Rural Municipality - वडा ' || ward_num,
                'galchhi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'galchhi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gangajamuna Rural Municipality (Dhading): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gangajamuna-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gangajamuna Rural Municipality - Ward ' || ward_num,
                'Gangajamuna Rural Municipality - वडा ' || ward_num,
                'gangajamuna-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gangajamuna-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Jwalamukhi Rural Municipality (Dhading): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'jwalamukhi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Jwalamukhi Rural Municipality - Ward ' || ward_num,
                'Jwalamukhi Rural Municipality - वडा ' || ward_num,
                'jwalamukhi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'jwalamukhi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Khaniyabas Rural Municipality (Dhading): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'khaniyabas-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Khaniyabas Rural Municipality - Ward ' || ward_num,
                'Khaniyabas Rural Municipality - वडा ' || ward_num,
                'khaniyabas-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'khaniyabas-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Netrawati Dabjong Rural Municipality (Dhading): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'netrawati-dabjong-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Netrawati Dabjong Rural Municipality - Ward ' || ward_num,
                'Netrawati Dabjong Rural Municipality - वडा ' || ward_num,
                'netrawati-dabjong-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'netrawati-dabjong-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rubi Valley Rural Municipality (Dhading): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rubi-valley-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rubi Valley Rural Municipality - Ward ' || ward_num,
                'Rubi Valley Rural Municipality - वडा ' || ward_num,
                'rubi-valley-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rubi-valley-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Siddhalek Rural Municipality (Dhading): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'siddhalek-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Siddhalek Rural Municipality - Ward ' || ward_num,
                'Siddhalek Rural Municipality - वडा ' || ward_num,
                'siddhalek-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'siddhalek-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Thakre Rural Municipality (Dhading): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'thakre-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Thakre Rural Municipality - Ward ' || ward_num,
                'Thakre Rural Municipality - वडा ' || ward_num,
                'thakre-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'thakre-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tripurasundari Rural Municipality (Dhading): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tripurasundari-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tripurasundari Rural Municipality - Ward ' || ward_num,
                'Tripurasundari Rural Municipality - वडा ' || ward_num,
                'tripurasundari-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tripurasundari-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bhimeswor Municipality (Dolakha): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bhimeswor-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bhimeswor Municipality - Ward ' || ward_num,
                'Bhimeswor Municipality - वडा ' || ward_num,
                'bhimeswor-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bhimeswor-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Jiri Municipality (Dolakha): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'jiri-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Jiri Municipality - Ward ' || ward_num,
                'Jiri Municipality - वडा ' || ward_num,
                'jiri-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'jiri-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Baiteshowr Rural Municipality (Dolakha): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'baiteshowr-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Baiteshowr Rural Municipality - Ward ' || ward_num,
                'Baiteshowr Rural Municipality - वडा ' || ward_num,
                'baiteshowr-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'baiteshowr-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bigu Rural Municipality (Dolakha): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bigu-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bigu Rural Municipality - Ward ' || ward_num,
                'Bigu Rural Municipality - वडा ' || ward_num,
                'bigu-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bigu-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gaurishankar Rural Municipality (Dolakha): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gaurishankar-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gaurishankar Rural Municipality - Ward ' || ward_num,
                'Gaurishankar Rural Municipality - वडा ' || ward_num,
                'gaurishankar-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gaurishankar-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kalinchok Rural Municipality (Dolakha): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kalinchok-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kalinchok Rural Municipality - Ward ' || ward_num,
                'Kalinchok Rural Municipality - वडा ' || ward_num,
                'kalinchok-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kalinchok-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Melung Rural Municipality (Dolakha): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'melung-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Melung Rural Municipality - Ward ' || ward_num,
                'Melung Rural Municipality - वडा ' || ward_num,
                'melung-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'melung-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sailung Rural Municipality (Dolakha): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sailung-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sailung Rural Municipality - Ward ' || ward_num,
                'Sailung Rural Municipality - वडा ' || ward_num,
                'sailung-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sailung-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tamakoshi Rural Municipality (Dolakha): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tamakoshi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tamakoshi Rural Municipality - Ward ' || ward_num,
                'Tamakoshi Rural Municipality - वडा ' || ward_num,
                'tamakoshi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tamakoshi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kathmandu Metropolitan City (Kathmandu): 32 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kathmandu-metropolitan-city' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..32 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kathmandu Metropolitan City - Ward ' || ward_num,
                'Kathmandu Metropolitan City - वडा ' || ward_num,
                'kathmandu-metropolitan-city-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kathmandu-metropolitan-city-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Budhalikantha Municipality (Kathmandu): 13 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'budhalikantha-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..13 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Budhalikantha Municipality - Ward ' || ward_num,
                'Budhalikantha Municipality - वडा ' || ward_num,
                'budhalikantha-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'budhalikantha-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chandragiri Municipality (Kathmandu): 15 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chandragiri-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..15 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chandragiri Municipality - Ward ' || ward_num,
                'Chandragiri Municipality - वडा ' || ward_num,
                'chandragiri-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chandragiri-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dakshinkali Municipality (Kathmandu): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dakshinkali-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dakshinkali Municipality - Ward ' || ward_num,
                'Dakshinkali Municipality - वडा ' || ward_num,
                'dakshinkali-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dakshinkali-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gokarneshwar Municipality (Kathmandu): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gokarneshwar-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gokarneshwar Municipality - Ward ' || ward_num,
                'Gokarneshwar Municipality - वडा ' || ward_num,
                'gokarneshwar-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gokarneshwar-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kageshwari-Manohara Municipality (Kathmandu): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kageshwari-manohara-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kageshwari-Manohara Municipality - Ward ' || ward_num,
                'Kageshwari-Manohara Municipality - वडा ' || ward_num,
                'kageshwari-manohara-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kageshwari-manohara-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kirtipur Municipality (Kathmandu): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kirtipur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kirtipur Municipality - Ward ' || ward_num,
                'Kirtipur Municipality - वडा ' || ward_num,
                'kirtipur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kirtipur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Nagarjun Municipality (Kathmandu): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'nagarjun-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Nagarjun Municipality - Ward ' || ward_num,
                'Nagarjun Municipality - वडा ' || ward_num,
                'nagarjun-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'nagarjun-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Shankharapur Municipality (Kathmandu): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'shankharapur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Shankharapur Municipality - Ward ' || ward_num,
                'Shankharapur Municipality - वडा ' || ward_num,
                'shankharapur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'shankharapur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tarakeshwar Municipality (Kathmandu): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tarakeshwar-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tarakeshwar Municipality - Ward ' || ward_num,
                'Tarakeshwar Municipality - वडा ' || ward_num,
                'tarakeshwar-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tarakeshwar-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tokha Municipality (Kathmandu): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tokha-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tokha Municipality - Ward ' || ward_num,
                'Tokha Municipality - वडा ' || ward_num,
                'tokha-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tokha-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Banepa Municipality (Kavrepalanchok): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'banepa-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Banepa Municipality - Ward ' || ward_num,
                'Banepa Municipality - वडा ' || ward_num,
                'banepa-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'banepa-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dhulikhel Municipality (Kavrepalanchok): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dhulikhel-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dhulikhel Municipality - Ward ' || ward_num,
                'Dhulikhel Municipality - वडा ' || ward_num,
                'dhulikhel-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dhulikhel-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mandandeupur Municipality (Kavrepalanchok): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mandandeupur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mandandeupur Municipality - Ward ' || ward_num,
                'Mandandeupur Municipality - वडा ' || ward_num,
                'mandandeupur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mandandeupur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Namobuddha Municipality (Kavrepalanchok): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'namobuddha-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Namobuddha Municipality - Ward ' || ward_num,
                'Namobuddha Municipality - वडा ' || ward_num,
                'namobuddha-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'namobuddha-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Panauti Municipality (Kavrepalanchok): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'panauti-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Panauti Municipality - Ward ' || ward_num,
                'Panauti Municipality - वडा ' || ward_num,
                'panauti-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'panauti-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Panchkhal Municipality (Kavrepalanchok): 13 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'panchkhal-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..13 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Panchkhal Municipality - Ward ' || ward_num,
                'Panchkhal Municipality - वडा ' || ward_num,
                'panchkhal-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'panchkhal-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bethanchok Rural Municipality (Kavrepalanchok): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bethanchok-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bethanchok Rural Municipality - Ward ' || ward_num,
                'Bethanchok Rural Municipality - वडा ' || ward_num,
                'bethanchok-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bethanchok-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bhumlu Rural Municipality (Kavrepalanchok): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bhumlu-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bhumlu Rural Municipality - Ward ' || ward_num,
                'Bhumlu Rural Municipality - वडा ' || ward_num,
                'bhumlu-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bhumlu-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chauri Deurali Rural Municipality (Kavrepalanchok): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chauri-deurali-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chauri Deurali Rural Municipality - Ward ' || ward_num,
                'Chauri Deurali Rural Municipality - वडा ' || ward_num,
                'chauri-deurali-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chauri-deurali-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Khani Khola Rural Municipality (Kavrepalanchok): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'khani-khola-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Khani Khola Rural Municipality - Ward ' || ward_num,
                'Khani Khola Rural Municipality - वडा ' || ward_num,
                'khani-khola-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'khani-khola-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mahabharat Rural Municipality (Kavrepalanchok): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mahabharat-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mahabharat Rural Municipality - Ward ' || ward_num,
                'Mahabharat Rural Municipality - वडा ' || ward_num,
                'mahabharat-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mahabharat-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Roshi Rural Municipality (Kavrepalanchok): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'roshi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Roshi Rural Municipality - Ward ' || ward_num,
                'Roshi Rural Municipality - वडा ' || ward_num,
                'roshi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'roshi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Temal Rural Municipality (Kavrepalanchok): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'temal-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Temal Rural Municipality - Ward ' || ward_num,
                'Temal Rural Municipality - वडा ' || ward_num,
                'temal-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'temal-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Lalitpur Metropolitan City (Lalitpur): 29 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'lalitpur-metropolitan-city' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..29 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Lalitpur Metropolitan City - Ward ' || ward_num,
                'Lalitpur Metropolitan City - वडा ' || ward_num,
                'lalitpur-metropolitan-city-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'lalitpur-metropolitan-city-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Godawari Municipality (Lalitpur): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'godawari-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Godawari Municipality - Ward ' || ward_num,
                'Godawari Municipality - वडा ' || ward_num,
                'godawari-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'godawari-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mahalaxmi Municipality (Lalitpur): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mahalaxmi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mahalaxmi Municipality - Ward ' || ward_num,
                'Mahalaxmi Municipality - वडा ' || ward_num,
                'mahalaxmi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mahalaxmi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bagmati Rural Municipality (Lalitpur): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bagmati-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bagmati Rural Municipality - Ward ' || ward_num,
                'Bagmati Rural Municipality - वडा ' || ward_num,
                'bagmati-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bagmati-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Konjyosom Rural Municipality (Lalitpur): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'konjyosom-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Konjyosom Rural Municipality - Ward ' || ward_num,
                'Konjyosom Rural Municipality - वडा ' || ward_num,
                'konjyosom-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'konjyosom-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mahankal Rural Municipality (Lalitpur): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mahankal-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mahankal Rural Municipality - Ward ' || ward_num,
                'Mahankal Rural Municipality - वडा ' || ward_num,
                'mahankal-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mahankal-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Hetauda Sub-Metropolitan City (Makwanpur): 19 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'hetauda-sub-metropolitan-city' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..19 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Hetauda Sub-Metropolitan City - Ward ' || ward_num,
                'Hetauda Sub-Metropolitan City - वडा ' || ward_num,
                'hetauda-sub-metropolitan-city-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'hetauda-sub-metropolitan-city-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Thaha Municipality (Makwanpur): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'thaha-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Thaha Municipality - Ward ' || ward_num,
                'Thaha Municipality - वडा ' || ward_num,
                'thaha-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'thaha-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bagmati Rural Municipality (Makwanpur): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bagmati-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bagmati Rural Municipality - Ward ' || ward_num,
                'Bagmati Rural Municipality - वडा ' || ward_num,
                'bagmati-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bagmati-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bakaiya Rural Municipality (Makwanpur): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bakaiya-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bakaiya Rural Municipality - Ward ' || ward_num,
                'Bakaiya Rural Municipality - वडा ' || ward_num,
                'bakaiya-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bakaiya-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bhimphedi Rural Municipality (Makwanpur): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bhimphedi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bhimphedi Rural Municipality - Ward ' || ward_num,
                'Bhimphedi Rural Municipality - वडा ' || ward_num,
                'bhimphedi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bhimphedi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Indrasarowar Rural Municipality (Makwanpur): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'indrasarowar-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Indrasarowar Rural Municipality - Ward ' || ward_num,
                'Indrasarowar Rural Municipality - वडा ' || ward_num,
                'indrasarowar-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'indrasarowar-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kailash Rural Municipality (Makwanpur): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kailash-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kailash Rural Municipality - Ward ' || ward_num,
                'Kailash Rural Municipality - वडा ' || ward_num,
                'kailash-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kailash-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Makawanpurgadhi Rural Municipality (Makwanpur): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'makawanpurgadhi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Makawanpurgadhi Rural Municipality - Ward ' || ward_num,
                'Makawanpurgadhi Rural Municipality - वडा ' || ward_num,
                'makawanpurgadhi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'makawanpurgadhi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Manahari Rural Municipality (Makwanpur): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'manahari-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Manahari Rural Municipality - Ward ' || ward_num,
                'Manahari Rural Municipality - वडा ' || ward_num,
                'manahari-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'manahari-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Raksirang Rural Municipality (Makwanpur): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'raksirang-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Raksirang Rural Municipality - Ward ' || ward_num,
                'Raksirang Rural Municipality - वडा ' || ward_num,
                'raksirang-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'raksirang-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Belkotgadhi Municipality (Nuwakot): 13 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'belkotgadhi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..13 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Belkotgadhi Municipality - Ward ' || ward_num,
                'Belkotgadhi Municipality - वडा ' || ward_num,
                'belkotgadhi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'belkotgadhi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bidur Municipality (Nuwakot): 13 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bidur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..13 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bidur Municipality - Ward ' || ward_num,
                'Bidur Municipality - वडा ' || ward_num,
                'bidur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bidur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dupcheshwar Rural Municipality (Nuwakot): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dupcheshwar-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dupcheshwar Rural Municipality - Ward ' || ward_num,
                'Dupcheshwar Rural Municipality - वडा ' || ward_num,
                'dupcheshwar-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dupcheshwar-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kakani Rural Municipality (Nuwakot): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kakani-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kakani Rural Municipality - Ward ' || ward_num,
                'Kakani Rural Municipality - वडा ' || ward_num,
                'kakani-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kakani-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kispang Rural Municipality (Nuwakot): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kispang-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kispang Rural Municipality - Ward ' || ward_num,
                'Kispang Rural Municipality - वडा ' || ward_num,
                'kispang-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kispang-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Likhu Rural Municipality (Nuwakot): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'likhu-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Likhu Rural Municipality - Ward ' || ward_num,
                'Likhu Rural Municipality - वडा ' || ward_num,
                'likhu-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'likhu-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Myagang Rural Municipality (Nuwakot): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'myagang-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Myagang Rural Municipality - Ward ' || ward_num,
                'Myagang Rural Municipality - वडा ' || ward_num,
                'myagang-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'myagang-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Panchakanya Rural Municipality (Nuwakot): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'panchakanya-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Panchakanya Rural Municipality - Ward ' || ward_num,
                'Panchakanya Rural Municipality - वडा ' || ward_num,
                'panchakanya-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'panchakanya-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Shivapuri Rural Municipality (Nuwakot): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'shivapuri-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Shivapuri Rural Municipality - Ward ' || ward_num,
                'Shivapuri Rural Municipality - वडा ' || ward_num,
                'shivapuri-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'shivapuri-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Suryagadhi Rural Municipality (Nuwakot): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'suryagadhi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Suryagadhi Rural Municipality - Ward ' || ward_num,
                'Suryagadhi Rural Municipality - वडा ' || ward_num,
                'suryagadhi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'suryagadhi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tadi Rural Municipality (Nuwakot): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tadi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tadi Rural Municipality - Ward ' || ward_num,
                'Tadi Rural Municipality - वडा ' || ward_num,
                'tadi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tadi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tarkeshwar Rural Municipality (Nuwakot): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tarkeshwar-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tarkeshwar Rural Municipality - Ward ' || ward_num,
                'Tarkeshwar Rural Municipality - वडा ' || ward_num,
                'tarkeshwar-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tarkeshwar-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Manthali Municipality (Ramechap): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'manthali-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Manthali Municipality - Ward ' || ward_num,
                'Manthali Municipality - वडा ' || ward_num,
                'manthali-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'manthali-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ramechhap Municipality (Ramechap): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ramechhap-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ramechhap Municipality - Ward ' || ward_num,
                'Ramechhap Municipality - वडा ' || ward_num,
                'ramechhap-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ramechhap-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Doramba Rural Municipality (Ramechap): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'doramba-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Doramba Rural Municipality - Ward ' || ward_num,
                'Doramba Rural Municipality - वडा ' || ward_num,
                'doramba-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'doramba-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gokulganga Rural Municipality (Ramechap): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gokulganga-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gokulganga Rural Municipality - Ward ' || ward_num,
                'Gokulganga Rural Municipality - वडा ' || ward_num,
                'gokulganga-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gokulganga-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Khandadevi Rural Municipality (Ramechap): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'khandadevi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Khandadevi Rural Municipality - Ward ' || ward_num,
                'Khandadevi Rural Municipality - वडा ' || ward_num,
                'khandadevi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'khandadevi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- LikhuTamakoshi Rural Municipality (Ramechap): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'likhutamakoshi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'LikhuTamakoshi Rural Municipality - Ward ' || ward_num,
                'LikhuTamakoshi Rural Municipality - वडा ' || ward_num,
                'likhutamakoshi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'likhutamakoshi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sunapati Rural Municipality (Ramechap): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sunapati-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sunapati Rural Municipality - Ward ' || ward_num,
                'Sunapati Rural Municipality - वडा ' || ward_num,
                'sunapati-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sunapati-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Umakunda Rural Municipality (Ramechap): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'umakunda-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Umakunda Rural Municipality - Ward ' || ward_num,
                'Umakunda Rural Municipality - वडा ' || ward_num,
                'umakunda-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'umakunda-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gosaikunda Rural Municipality (Rasuwa): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gosaikunda-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gosaikunda Rural Municipality - Ward ' || ward_num,
                'Gosaikunda Rural Municipality - वडा ' || ward_num,
                'gosaikunda-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gosaikunda-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kalika Rural Municipality (Rasuwa): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kalika-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kalika Rural Municipality - Ward ' || ward_num,
                'Kalika Rural Municipality - वडा ' || ward_num,
                'kalika-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kalika-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Naukunda Rural Municipality (Rasuwa): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'naukunda-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Naukunda Rural Municipality - Ward ' || ward_num,
                'Naukunda Rural Municipality - वडा ' || ward_num,
                'naukunda-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'naukunda-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Parbatikunda Rural Municipality (Rasuwa): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'parbatikunda-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Parbatikunda Rural Municipality - Ward ' || ward_num,
                'Parbatikunda Rural Municipality - वडा ' || ward_num,
                'parbatikunda-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'parbatikunda-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Uttargaya Rural Municipality (Rasuwa): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'uttargaya-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Uttargaya Rural Municipality - Ward ' || ward_num,
                'Uttargaya Rural Municipality - वडा ' || ward_num,
                'uttargaya-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'uttargaya-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dudhauli Municipality (Sindhuli): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dudhauli-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dudhauli Municipality - Ward ' || ward_num,
                'Dudhauli Municipality - वडा ' || ward_num,
                'dudhauli-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dudhauli-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kamalamai Municipality (Sindhuli): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kamalamai-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kamalamai Municipality - Ward ' || ward_num,
                'Kamalamai Municipality - वडा ' || ward_num,
                'kamalamai-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kamalamai-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ghyanglekh Rural Municipality (Sindhuli): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ghyanglekh-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ghyanglekh Rural Municipality - Ward ' || ward_num,
                'Ghyanglekh Rural Municipality - वडा ' || ward_num,
                'ghyanglekh-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ghyanglekh-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Golanjor Rural Municipality (Sindhuli): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'golanjor-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Golanjor Rural Municipality - Ward ' || ward_num,
                'Golanjor Rural Municipality - वडा ' || ward_num,
                'golanjor-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'golanjor-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Hariharpurgadhi Rural Municipality (Sindhuli): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'hariharpurgadhi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Hariharpurgadhi Rural Municipality - Ward ' || ward_num,
                'Hariharpurgadhi Rural Municipality - वडा ' || ward_num,
                'hariharpurgadhi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'hariharpurgadhi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Marin Rural Municipality (Sindhuli): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'marin-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Marin Rural Municipality - Ward ' || ward_num,
                'Marin Rural Municipality - वडा ' || ward_num,
                'marin-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'marin-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Phikkal Rural Municipality (Sindhuli): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'phikkal-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Phikkal Rural Municipality - Ward ' || ward_num,
                'Phikkal Rural Municipality - वडा ' || ward_num,
                'phikkal-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'phikkal-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sunkoshi Rural Municipality (Sindhuli): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sunkoshi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sunkoshi Rural Municipality - Ward ' || ward_num,
                'Sunkoshi Rural Municipality - वडा ' || ward_num,
                'sunkoshi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sunkoshi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tinpatan Rural Municipality (Sindhuli): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tinpatan-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tinpatan Rural Municipality - Ward ' || ward_num,
                'Tinpatan Rural Municipality - वडा ' || ward_num,
                'tinpatan-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tinpatan-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bahrabise Municipality (Sindhupalchok): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bahrabise-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bahrabise Municipality - Ward ' || ward_num,
                'Bahrabise Municipality - वडा ' || ward_num,
                'bahrabise-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bahrabise-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chautara Sangachowkgadi Municipality (Sindhupalchok): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chautara-sangachowkgadi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chautara Sangachowkgadi Municipality - Ward ' || ward_num,
                'Chautara Sangachowkgadi Municipality - वडा ' || ward_num,
                'chautara-sangachowkgadi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chautara-sangachowkgadi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Melamchi Municipality (Sindhupalchok): 13 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'melamchi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..13 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Melamchi Municipality - Ward ' || ward_num,
                'Melamchi Municipality - वडा ' || ward_num,
                'melamchi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'melamchi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Balephi Rural Municipality (Sindhupalchok): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'balephi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Balephi Rural Municipality - Ward ' || ward_num,
                'Balephi Rural Municipality - वडा ' || ward_num,
                'balephi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'balephi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bhotekoshi Rural Municipality (Sindhupalchok): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bhotekoshi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bhotekoshi Rural Municipality - Ward ' || ward_num,
                'Bhotekoshi Rural Municipality - वडा ' || ward_num,
                'bhotekoshi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bhotekoshi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Helambu Rural Municipality (Sindhupalchok): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'helambu-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Helambu Rural Municipality - Ward ' || ward_num,
                'Helambu Rural Municipality - वडा ' || ward_num,
                'helambu-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'helambu-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Indrawati Rural Municipality (Sindhupalchok): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'indrawati-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Indrawati Rural Municipality - Ward ' || ward_num,
                'Indrawati Rural Municipality - वडा ' || ward_num,
                'indrawati-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'indrawati-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Jugal Rural Municipality (Sindhupalchok): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'jugal-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Jugal Rural Municipality - Ward ' || ward_num,
                'Jugal Rural Municipality - वडा ' || ward_num,
                'jugal-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'jugal-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Lisankhu Rural Municipality (Sindhupalchok): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'lisankhu-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Lisankhu Rural Municipality - Ward ' || ward_num,
                'Lisankhu Rural Municipality - वडा ' || ward_num,
                'lisankhu-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'lisankhu-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Panchpokhari Rural Municipality (Sindhupalchok): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'panchpokhari-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Panchpokhari Rural Municipality - Ward ' || ward_num,
                'Panchpokhari Rural Municipality - वडा ' || ward_num,
                'panchpokhari-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'panchpokhari-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sunkoshi Rural Municipality (Sindhupalchok): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sunkoshi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sunkoshi Rural Municipality - Ward ' || ward_num,
                'Sunkoshi Rural Municipality - वडा ' || ward_num,
                'sunkoshi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sunkoshi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tripurasundari Rural Municipality (Sindhupalchok): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tripurasundari-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tripurasundari Rural Municipality - Ward ' || ward_num,
                'Tripurasundari Rural Municipality - वडा ' || ward_num,
                'tripurasundari-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tripurasundari-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Baglung Municipality (Baglung): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'baglung-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Baglung Municipality - Ward ' || ward_num,
                'Baglung Municipality - वडा ' || ward_num,
                'baglung-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'baglung-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dhorpatan Municipality (Baglung): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dhorpatan-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dhorpatan Municipality - Ward ' || ward_num,
                'Dhorpatan Municipality - वडा ' || ward_num,
                'dhorpatan-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dhorpatan-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Galkot Municipality (Baglung): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'galkot-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Galkot Municipality - Ward ' || ward_num,
                'Galkot Municipality - वडा ' || ward_num,
                'galkot-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'galkot-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Jaimuni Municipality (Baglung): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'jaimuni-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Jaimuni Municipality - Ward ' || ward_num,
                'Jaimuni Municipality - वडा ' || ward_num,
                'jaimuni-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'jaimuni-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Badigad Rural Municipality (Baglung): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'badigad-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Badigad Rural Municipality - Ward ' || ward_num,
                'Badigad Rural Municipality - वडा ' || ward_num,
                'badigad-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'badigad-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bareng Rural Municipality (Baglung): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bareng-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bareng Rural Municipality - Ward ' || ward_num,
                'Bareng Rural Municipality - वडा ' || ward_num,
                'bareng-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bareng-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Khathekhola Rural Municipality (Baglung): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'khathekhola-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Khathekhola Rural Municipality - Ward ' || ward_num,
                'Khathekhola Rural Municipality - वडा ' || ward_num,
                'khathekhola-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'khathekhola-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Nishi Khola Rural Municipality (Baglung): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'nishi-khola-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Nishi Khola Rural Municipality - Ward ' || ward_num,
                'Nishi Khola Rural Municipality - वडा ' || ward_num,
                'nishi-khola-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'nishi-khola-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Taman Khola Rural Municipality (Baglung): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'taman-khola-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Taman Khola Rural Municipality - Ward ' || ward_num,
                'Taman Khola Rural Municipality - वडा ' || ward_num,
                'taman-khola-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'taman-khola-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tara Khola Rural Municipality (Baglung): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tara-khola-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tara Khola Rural Municipality - Ward ' || ward_num,
                'Tara Khola Rural Municipality - वडा ' || ward_num,
                'tara-khola-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tara-khola-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gorkha Municipality (Gorkha): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gorkha-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gorkha Municipality - Ward ' || ward_num,
                'Gorkha Municipality - वडा ' || ward_num,
                'gorkha-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gorkha-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Palungtar Municipality (Gorkha): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'palungtar-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Palungtar Municipality - Ward ' || ward_num,
                'Palungtar Municipality - वडा ' || ward_num,
                'palungtar-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'palungtar-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Aarughat Rural Municipality (Gorkha): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'aarughat-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Aarughat Rural Municipality - Ward ' || ward_num,
                'Aarughat Rural Municipality - वडा ' || ward_num,
                'aarughat-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'aarughat-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ajirkot Rural Municipality (Gorkha): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ajirkot-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ajirkot Rural Municipality - Ward ' || ward_num,
                'Ajirkot Rural Municipality - वडा ' || ward_num,
                'ajirkot-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ajirkot-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bhimsen Thapa Rural Municipality (Gorkha): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bhimsen-thapa-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bhimsen Thapa Rural Municipality - Ward ' || ward_num,
                'Bhimsen Thapa Rural Municipality - वडा ' || ward_num,
                'bhimsen-thapa-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bhimsen-thapa-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chumnubri Rural Municipality (Gorkha): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chumnubri-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chumnubri Rural Municipality - Ward ' || ward_num,
                'Chumnubri Rural Municipality - वडा ' || ward_num,
                'chumnubri-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chumnubri-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dharche Rural Municipality (Gorkha): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dharche-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dharche Rural Municipality - Ward ' || ward_num,
                'Dharche Rural Municipality - वडा ' || ward_num,
                'dharche-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dharche-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gandaki Rural Municipality (Gorkha): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gandaki-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gandaki Rural Municipality - Ward ' || ward_num,
                'Gandaki Rural Municipality - वडा ' || ward_num,
                'gandaki-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gandaki-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sahid Lakhan Rural Municipality (Gorkha): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sahid-lakhan-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sahid Lakhan Rural Municipality - Ward ' || ward_num,
                'Sahid Lakhan Rural Municipality - वडा ' || ward_num,
                'sahid-lakhan-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sahid-lakhan-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Siranchowk Rural Municipality (Gorkha): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'siranchowk-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Siranchowk Rural Municipality - Ward ' || ward_num,
                'Siranchowk Rural Municipality - वडा ' || ward_num,
                'siranchowk-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'siranchowk-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sulikot Rural Municipality (Gorkha): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sulikot-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sulikot Rural Municipality - Ward ' || ward_num,
                'Sulikot Rural Municipality - वडा ' || ward_num,
                'sulikot-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sulikot-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Pokhara Metropolitan City (Kaski): 33 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'pokhara-metropolitan-city' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..33 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Pokhara Metropolitan City - Ward ' || ward_num,
                'Pokhara Metropolitan City - वडा ' || ward_num,
                'pokhara-metropolitan-city-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'pokhara-metropolitan-city-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Annapurna Rural Municipality (Kaski): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'annapurna-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Annapurna Rural Municipality - Ward ' || ward_num,
                'Annapurna Rural Municipality - वडा ' || ward_num,
                'annapurna-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'annapurna-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Machhapuchchhre Rural Municipality (Kaski): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'machhapuchchhre-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Machhapuchchhre Rural Municipality - Ward ' || ward_num,
                'Machhapuchchhre Rural Municipality - वडा ' || ward_num,
                'machhapuchchhre-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'machhapuchchhre-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Madi Rural Municipality (Kaski): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'madi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Madi Rural Municipality - Ward ' || ward_num,
                'Madi Rural Municipality - वडा ' || ward_num,
                'madi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'madi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rupa Rural Municipality (Kaski): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rupa-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rupa Rural Municipality - Ward ' || ward_num,
                'Rupa Rural Municipality - वडा ' || ward_num,
                'rupa-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rupa-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Besisahar Municipality (Lamjung): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'besisahar-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Besisahar Municipality - Ward ' || ward_num,
                'Besisahar Municipality - वडा ' || ward_num,
                'besisahar-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'besisahar-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Madhya Nepal Municipality (Lamjung): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'madhya-nepal-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Madhya Nepal Municipality - Ward ' || ward_num,
                'Madhya Nepal Municipality - वडा ' || ward_num,
                'madhya-nepal-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'madhya-nepal-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rainas Municipality (Lamjung): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rainas-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rainas Municipality - Ward ' || ward_num,
                'Rainas Municipality - वडा ' || ward_num,
                'rainas-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rainas-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sundarbazar Municipality (Lamjung): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sundarbazar-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sundarbazar Municipality - Ward ' || ward_num,
                'Sundarbazar Municipality - वडा ' || ward_num,
                'sundarbazar-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sundarbazar-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dordi Rural Municipality (Lamjung): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dordi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dordi Rural Municipality - Ward ' || ward_num,
                'Dordi Rural Municipality - वडा ' || ward_num,
                'dordi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dordi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dudhpokhari Rural Municipality (Lamjung): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dudhpokhari-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dudhpokhari Rural Municipality - Ward ' || ward_num,
                'Dudhpokhari Rural Municipality - वडा ' || ward_num,
                'dudhpokhari-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dudhpokhari-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kwhlosothar Rural Municipality (Lamjung): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kwhlosothar-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kwhlosothar Rural Municipality - Ward ' || ward_num,
                'Kwhlosothar Rural Municipality - वडा ' || ward_num,
                'kwhlosothar-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kwhlosothar-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Marsyangdi Rural Municipality (Lamjung): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'marsyangdi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Marsyangdi Rural Municipality - Ward ' || ward_num,
                'Marsyangdi Rural Municipality - वडा ' || ward_num,
                'marsyangdi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'marsyangdi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chame Rural Municipality (Manang): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chame-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chame Rural Municipality - Ward ' || ward_num,
                'Chame Rural Municipality - वडा ' || ward_num,
                'chame-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chame-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Manang Ngisyang Rural Municipality (Manang): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'manang-ngisyang-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Manang Ngisyang Rural Municipality - Ward ' || ward_num,
                'Manang Ngisyang Rural Municipality - वडा ' || ward_num,
                'manang-ngisyang-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'manang-ngisyang-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- NarpaBhumi Rural Municipality (Manang): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'narpabhumi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'NarpaBhumi Rural Municipality - Ward ' || ward_num,
                'NarpaBhumi Rural Municipality - वडा ' || ward_num,
                'narpabhumi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'narpabhumi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Nason Rural Municipality (Manang): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'nason-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Nason Rural Municipality - Ward ' || ward_num,
                'Nason Rural Municipality - वडा ' || ward_num,
                'nason-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'nason-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Barhagaun Muktichhetra Rural Municipality (Mustang): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'barhagaun-muktichhetra-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Barhagaun Muktichhetra Rural Municipality - Ward ' || ward_num,
                'Barhagaun Muktichhetra Rural Municipality - वडा ' || ward_num,
                'barhagaun-muktichhetra-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'barhagaun-muktichhetra-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gharpajhong Rural Municipality (Mustang): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gharpajhong-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gharpajhong Rural Municipality - Ward ' || ward_num,
                'Gharpajhong Rural Municipality - वडा ' || ward_num,
                'gharpajhong-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gharpajhong-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Lo-Ghekar Damodarkunda Rural Municipality (Mustang): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'lo-ghekar-damodarkunda-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Lo-Ghekar Damodarkunda Rural Municipality - Ward ' || ward_num,
                'Lo-Ghekar Damodarkunda Rural Municipality - वडा ' || ward_num,
                'lo-ghekar-damodarkunda-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'lo-ghekar-damodarkunda-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Lomanthang Rural Municipality (Mustang): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'lomanthang-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Lomanthang Rural Municipality - Ward ' || ward_num,
                'Lomanthang Rural Municipality - वडा ' || ward_num,
                'lomanthang-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'lomanthang-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Thasang Rural Municipality (Mustang): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'thasang-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Thasang Rural Municipality - Ward ' || ward_num,
                'Thasang Rural Municipality - वडा ' || ward_num,
                'thasang-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'thasang-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Beni Municipality (Myagdi): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'beni-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Beni Municipality - Ward ' || ward_num,
                'Beni Municipality - वडा ' || ward_num,
                'beni-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'beni-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Annapurna Rural Municipality (Myagdi): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'annapurna-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Annapurna Rural Municipality - Ward ' || ward_num,
                'Annapurna Rural Municipality - वडा ' || ward_num,
                'annapurna-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'annapurna-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dhaulagiri Rural Municipality (Myagdi): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dhaulagiri-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dhaulagiri Rural Municipality - Ward ' || ward_num,
                'Dhaulagiri Rural Municipality - वडा ' || ward_num,
                'dhaulagiri-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dhaulagiri-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Malika Rural Municipality (Myagdi): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'malika-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Malika Rural Municipality - Ward ' || ward_num,
                'Malika Rural Municipality - वडा ' || ward_num,
                'malika-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'malika-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mangala Rural Municipality (Myagdi): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mangala-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mangala Rural Municipality - Ward ' || ward_num,
                'Mangala Rural Municipality - वडा ' || ward_num,
                'mangala-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mangala-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Raghuganga Rural Municipality (Myagdi): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'raghuganga-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Raghuganga Rural Municipality - Ward ' || ward_num,
                'Raghuganga Rural Municipality - वडा ' || ward_num,
                'raghuganga-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'raghuganga-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Devachuli Municipality (Nawalpur): 17 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'devachuli-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..17 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Devachuli Municipality - Ward ' || ward_num,
                'Devachuli Municipality - वडा ' || ward_num,
                'devachuli-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'devachuli-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gaindakot Municipality (Nawalpur): 18 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gaindakot-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..18 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gaindakot Municipality - Ward ' || ward_num,
                'Gaindakot Municipality - वडा ' || ward_num,
                'gaindakot-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gaindakot-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kawasoti Municipality (Nawalpur): 17 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kawasoti-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..17 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kawasoti Municipality - Ward ' || ward_num,
                'Kawasoti Municipality - वडा ' || ward_num,
                'kawasoti-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kawasoti-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Madhya Bindu Municipality (Nawalpur): 15 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'madhya-bindu-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..15 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Madhya Bindu Municipality - Ward ' || ward_num,
                'Madhya Bindu Municipality - वडा ' || ward_num,
                'madhya-bindu-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'madhya-bindu-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Baudikali Rural Municipality (Nawalpur): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'baudikali-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Baudikali Rural Municipality - Ward ' || ward_num,
                'Baudikali Rural Municipality - वडा ' || ward_num,
                'baudikali-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'baudikali-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Binayi Tribeni Rural Municipality (Nawalpur): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'binayi-tribeni-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Binayi Tribeni Rural Municipality - Ward ' || ward_num,
                'Binayi Tribeni Rural Municipality - वडा ' || ward_num,
                'binayi-tribeni-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'binayi-tribeni-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bulingtar Rural Municipality (Nawalpur): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bulingtar-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bulingtar Rural Municipality - Ward ' || ward_num,
                'Bulingtar Rural Municipality - वडा ' || ward_num,
                'bulingtar-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bulingtar-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Hupsekot Rural Municipality (Nawalpur): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'hupsekot-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Hupsekot Rural Municipality - Ward ' || ward_num,
                'Hupsekot Rural Municipality - वडा ' || ward_num,
                'hupsekot-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'hupsekot-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kushma Municipality (Parwat): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kushma-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kushma Municipality - Ward ' || ward_num,
                'Kushma Municipality - वडा ' || ward_num,
                'kushma-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kushma-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Phalewas Municipality (Parwat): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'phalewas-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Phalewas Municipality - Ward ' || ward_num,
                'Phalewas Municipality - वडा ' || ward_num,
                'phalewas-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'phalewas-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bihadi Rural Municipality (Parwat): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bihadi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bihadi Rural Municipality - Ward ' || ward_num,
                'Bihadi Rural Municipality - वडा ' || ward_num,
                'bihadi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bihadi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Jaljala Rural Municipality (Parwat): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'jaljala-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Jaljala Rural Municipality - Ward ' || ward_num,
                'Jaljala Rural Municipality - वडा ' || ward_num,
                'jaljala-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'jaljala-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mahashila Rural Municipality (Parwat): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mahashila-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mahashila Rural Municipality - Ward ' || ward_num,
                'Mahashila Rural Municipality - वडा ' || ward_num,
                'mahashila-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mahashila-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Modi Rural Municipality (Parwat): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'modi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Modi Rural Municipality - Ward ' || ward_num,
                'Modi Rural Municipality - वडा ' || ward_num,
                'modi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'modi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Paiyun Rural Municipality (Parwat): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'paiyun-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Paiyun Rural Municipality - Ward ' || ward_num,
                'Paiyun Rural Municipality - वडा ' || ward_num,
                'paiyun-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'paiyun-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bheerkot Municipality (Syangja): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bheerkot-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bheerkot Municipality - Ward ' || ward_num,
                'Bheerkot Municipality - वडा ' || ward_num,
                'bheerkot-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bheerkot-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chapakot Municipality (Syangja): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chapakot-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chapakot Municipality - Ward ' || ward_num,
                'Chapakot Municipality - वडा ' || ward_num,
                'chapakot-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chapakot-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Galyang Municipality (Syangja): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'galyang-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Galyang Municipality - Ward ' || ward_num,
                'Galyang Municipality - वडा ' || ward_num,
                'galyang-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'galyang-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Putalibazar Municipality (Syangja): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'putalibazar-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Putalibazar Municipality - Ward ' || ward_num,
                'Putalibazar Municipality - वडा ' || ward_num,
                'putalibazar-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'putalibazar-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Waling Municipality (Syangja): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'waling-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Waling Municipality - Ward ' || ward_num,
                'Waling Municipality - वडा ' || ward_num,
                'waling-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'waling-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Aandhikhola Rural Municipality (Syangja): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'aandhikhola-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Aandhikhola Rural Municipality - Ward ' || ward_num,
                'Aandhikhola Rural Municipality - वडा ' || ward_num,
                'aandhikhola-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'aandhikhola-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Arjun Chaupari Rural Municipality (Syangja): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'arjun-chaupari-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Arjun Chaupari Rural Municipality - Ward ' || ward_num,
                'Arjun Chaupari Rural Municipality - वडा ' || ward_num,
                'arjun-chaupari-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'arjun-chaupari-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Biruwa Rural Municipality (Syangja): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'biruwa-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Biruwa Rural Municipality - Ward ' || ward_num,
                'Biruwa Rural Municipality - वडा ' || ward_num,
                'biruwa-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'biruwa-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Harinas Rural Municipality (Syangja): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'harinas-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Harinas Rural Municipality - Ward ' || ward_num,
                'Harinas Rural Municipality - वडा ' || ward_num,
                'harinas-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'harinas-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kaligandaki Rural Municipality (Syangja): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kaligandaki-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kaligandaki Rural Municipality - Ward ' || ward_num,
                'Kaligandaki Rural Municipality - वडा ' || ward_num,
                'kaligandaki-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kaligandaki-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Phedikhola Rural Municipality (Syangja): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'phedikhola-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Phedikhola Rural Municipality - Ward ' || ward_num,
                'Phedikhola Rural Municipality - वडा ' || ward_num,
                'phedikhola-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'phedikhola-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bhanu Municipality (Tanahun): 13 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bhanu-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..13 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bhanu Municipality - Ward ' || ward_num,
                'Bhanu Municipality - वडा ' || ward_num,
                'bhanu-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bhanu-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bhimad Municipality (Tanahun): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bhimad-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bhimad Municipality - Ward ' || ward_num,
                'Bhimad Municipality - वडा ' || ward_num,
                'bhimad-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bhimad-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Byas Municipality (Tanahun): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'byas-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Byas Municipality - Ward ' || ward_num,
                'Byas Municipality - वडा ' || ward_num,
                'byas-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'byas-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Suklagandaki Municipality (Tanahun): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'suklagandaki-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Suklagandaki Municipality - Ward ' || ward_num,
                'Suklagandaki Municipality - वडा ' || ward_num,
                'suklagandaki-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'suklagandaki-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- AnbuKhaireni Rural Municipality (Tanahun): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'anbukhaireni-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'AnbuKhaireni Rural Municipality - Ward ' || ward_num,
                'AnbuKhaireni Rural Municipality - वडा ' || ward_num,
                'anbukhaireni-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'anbukhaireni-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bandipur Rural Municipality (Tanahun): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bandipur-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bandipur Rural Municipality - Ward ' || ward_num,
                'Bandipur Rural Municipality - वडा ' || ward_num,
                'bandipur-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bandipur-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Devghat Rural Municipality (Tanahun): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'devghat-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Devghat Rural Municipality - Ward ' || ward_num,
                'Devghat Rural Municipality - वडा ' || ward_num,
                'devghat-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'devghat-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ghiring Rural Municipality (Tanahun): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ghiring-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ghiring Rural Municipality - Ward ' || ward_num,
                'Ghiring Rural Municipality - वडा ' || ward_num,
                'ghiring-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ghiring-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Myagde Rural Municipality (Tanahun): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'myagde-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Myagde Rural Municipality - Ward ' || ward_num,
                'Myagde Rural Municipality - वडा ' || ward_num,
                'myagde-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'myagde-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rishing Rural Municipality (Tanahun): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rishing-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rishing Rural Municipality - Ward ' || ward_num,
                'Rishing Rural Municipality - वडा ' || ward_num,
                'rishing-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rishing-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Banganga Municipality (Kapilvastu): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'banganga-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Banganga Municipality - Ward ' || ward_num,
                'Banganga Municipality - वडा ' || ward_num,
                'banganga-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'banganga-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Buddhabhumi Municipality (Kapilvastu): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'buddhabhumi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Buddhabhumi Municipality - Ward ' || ward_num,
                'Buddhabhumi Municipality - वडा ' || ward_num,
                'buddhabhumi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'buddhabhumi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kapilvastu Municipality (Kapilvastu): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kapilvastu-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kapilvastu Municipality - Ward ' || ward_num,
                'Kapilvastu Municipality - वडा ' || ward_num,
                'kapilvastu-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kapilvastu-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Krishnanagar Municipality (Kapilvastu): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'krishnanagar-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Krishnanagar Municipality - Ward ' || ward_num,
                'Krishnanagar Municipality - वडा ' || ward_num,
                'krishnanagar-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'krishnanagar-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Maharajgunj Municipality (Kapilvastu): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'maharajgunj-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Maharajgunj Municipality - Ward ' || ward_num,
                'Maharajgunj Municipality - वडा ' || ward_num,
                'maharajgunj-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'maharajgunj-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Shivaraj Municipality (Kapilvastu): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'shivaraj-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Shivaraj Municipality - Ward ' || ward_num,
                'Shivaraj Municipality - वडा ' || ward_num,
                'shivaraj-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'shivaraj-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bijaynagar Rural Municipality (Kapilvastu): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bijaynagar-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bijaynagar Rural Municipality - Ward ' || ward_num,
                'Bijaynagar Rural Municipality - वडा ' || ward_num,
                'bijaynagar-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bijaynagar-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mayadevi Rural Municipality (Kapilvastu): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mayadevi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mayadevi Rural Municipality - Ward ' || ward_num,
                'Mayadevi Rural Municipality - वडा ' || ward_num,
                'mayadevi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mayadevi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Suddhodan Rural Municipality (Kapilvastu): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'suddhodan-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Suddhodan Rural Municipality - Ward ' || ward_num,
                'Suddhodan Rural Municipality - वडा ' || ward_num,
                'suddhodan-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'suddhodan-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Yashodhara Rural Municipality (Kapilvastu): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'yashodhara-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Yashodhara Rural Municipality - Ward ' || ward_num,
                'Yashodhara Rural Municipality - वडा ' || ward_num,
                'yashodhara-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'yashodhara-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bardaghat Municipality (Parasi): 16 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bardaghat-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..16 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bardaghat Municipality - Ward ' || ward_num,
                'Bardaghat Municipality - वडा ' || ward_num,
                'bardaghat-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bardaghat-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ramgram Municipality (Parasi): 18 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ramgram-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..18 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ramgram Municipality - Ward ' || ward_num,
                'Ramgram Municipality - वडा ' || ward_num,
                'ramgram-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ramgram-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sunwal Municipality (Parasi): 13 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sunwal-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..13 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sunwal Municipality - Ward ' || ward_num,
                'Sunwal Municipality - वडा ' || ward_num,
                'sunwal-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sunwal-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Palhi Nandan Rural Municipality (Parasi): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'palhi-nandan-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Palhi Nandan Rural Municipality - Ward ' || ward_num,
                'Palhi Nandan Rural Municipality - वडा ' || ward_num,
                'palhi-nandan-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'palhi-nandan-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Pratappur Rural Municipality (Parasi): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'pratappur-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Pratappur Rural Municipality - Ward ' || ward_num,
                'Pratappur Rural Municipality - वडा ' || ward_num,
                'pratappur-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'pratappur-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sarawal Rural Municipality (Parasi): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sarawal-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sarawal Rural Municipality - Ward ' || ward_num,
                'Sarawal Rural Municipality - वडा ' || ward_num,
                'sarawal-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sarawal-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Susta Rural Municipality (Parasi): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'susta-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Susta Rural Municipality - Ward ' || ward_num,
                'Susta Rural Municipality - वडा ' || ward_num,
                'susta-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'susta-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Butwal Sub-Metropolitan City (Rupandehi): 19 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'butwal-sub-metropolitan-city' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..19 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Butwal Sub-Metropolitan City - Ward ' || ward_num,
                'Butwal Sub-Metropolitan City - वडा ' || ward_num,
                'butwal-sub-metropolitan-city-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'butwal-sub-metropolitan-city-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Devdaha Municipality (Rupandehi): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'devdaha-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Devdaha Municipality - Ward ' || ward_num,
                'Devdaha Municipality - वडा ' || ward_num,
                'devdaha-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'devdaha-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Lumbini Sanskritik Municipality (Rupandehi): 13 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'lumbini-sanskritik-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..13 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Lumbini Sanskritik Municipality - Ward ' || ward_num,
                'Lumbini Sanskritik Municipality - वडा ' || ward_num,
                'lumbini-sanskritik-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'lumbini-sanskritik-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sainamaina Municipality (Rupandehi): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sainamaina-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sainamaina Municipality - Ward ' || ward_num,
                'Sainamaina Municipality - वडा ' || ward_num,
                'sainamaina-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sainamaina-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Siddharthanagar Municipality (Rupandehi): 13 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'siddharthanagar-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..13 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Siddharthanagar Municipality - Ward ' || ward_num,
                'Siddharthanagar Municipality - वडा ' || ward_num,
                'siddharthanagar-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'siddharthanagar-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tilottama Municipality (Rupandehi): 17 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tilottama-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..17 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tilottama Municipality - Ward ' || ward_num,
                'Tilottama Municipality - वडा ' || ward_num,
                'tilottama-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tilottama-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gaidahawa Rural Municipality (Rupandehi): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gaidahawa-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gaidahawa Rural Municipality - Ward ' || ward_num,
                'Gaidahawa Rural Municipality - वडा ' || ward_num,
                'gaidahawa-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gaidahawa-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kanchan Rural Municipality (Rupandehi): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kanchan-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kanchan Rural Municipality - Ward ' || ward_num,
                'Kanchan Rural Municipality - वडा ' || ward_num,
                'kanchan-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kanchan-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kotahimai Rural Municipality (Rupandehi): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kotahimai-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kotahimai Rural Municipality - Ward ' || ward_num,
                'Kotahimai Rural Municipality - वडा ' || ward_num,
                'kotahimai-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kotahimai-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Marchawari Rural Municipality (Rupandehi): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'marchawari-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Marchawari Rural Municipality - Ward ' || ward_num,
                'Marchawari Rural Municipality - वडा ' || ward_num,
                'marchawari-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'marchawari-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mayadevi Rural Municipality (Rupandehi): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mayadevi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mayadevi Rural Municipality - Ward ' || ward_num,
                'Mayadevi Rural Municipality - वडा ' || ward_num,
                'mayadevi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mayadevi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Omsatiya Rural Municipality (Rupandehi): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'omsatiya-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Omsatiya Rural Municipality - Ward ' || ward_num,
                'Omsatiya Rural Municipality - वडा ' || ward_num,
                'omsatiya-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'omsatiya-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rohini Rural Municipality (Rupandehi): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rohini-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rohini Rural Municipality - Ward ' || ward_num,
                'Rohini Rural Municipality - वडा ' || ward_num,
                'rohini-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rohini-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sammarimai Rural Municipality (Rupandehi): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sammarimai-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sammarimai Rural Municipality - Ward ' || ward_num,
                'Sammarimai Rural Municipality - वडा ' || ward_num,
                'sammarimai-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sammarimai-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Siyari Rural Municipality (Rupandehi): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'siyari-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Siyari Rural Municipality - Ward ' || ward_num,
                'Siyari Rural Municipality - वडा ' || ward_num,
                'siyari-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'siyari-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Suddodhan Rural Municipality (Rupandehi): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'suddodhan-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Suddodhan Rural Municipality - Ward ' || ward_num,
                'Suddodhan Rural Municipality - वडा ' || ward_num,
                'suddodhan-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'suddodhan-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bhumikasthan Municipality (Arghakhanchi): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bhumikasthan-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bhumikasthan Municipality - Ward ' || ward_num,
                'Bhumikasthan Municipality - वडा ' || ward_num,
                'bhumikasthan-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bhumikasthan-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sandhikharka Municipality (Arghakhanchi): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sandhikharka-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sandhikharka Municipality - Ward ' || ward_num,
                'Sandhikharka Municipality - वडा ' || ward_num,
                'sandhikharka-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sandhikharka-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sitganga Municipality (Arghakhanchi): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sitganga-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sitganga Municipality - Ward ' || ward_num,
                'Sitganga Municipality - वडा ' || ward_num,
                'sitganga-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sitganga-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chhatradev Rural Municipality (Arghakhanchi): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chhatradev-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chhatradev Rural Municipality - Ward ' || ward_num,
                'Chhatradev Rural Municipality - वडा ' || ward_num,
                'chhatradev-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chhatradev-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Malarani Rural Municipality (Arghakhanchi): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'malarani-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Malarani Rural Municipality - Ward ' || ward_num,
                'Malarani Rural Municipality - वडा ' || ward_num,
                'malarani-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'malarani-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Panini Rural Municipality (Arghakhanchi): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'panini-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Panini Rural Municipality - Ward ' || ward_num,
                'Panini Rural Municipality - वडा ' || ward_num,
                'panini-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'panini-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Musikot Municipality (Gulmi): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'musikot-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Musikot Municipality - Ward ' || ward_num,
                'Musikot Municipality - वडा ' || ward_num,
                'musikot-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'musikot-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Resunga Municipality (Gulmi): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'resunga-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Resunga Municipality - Ward ' || ward_num,
                'Resunga Municipality - वडा ' || ward_num,
                'resunga-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'resunga-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chandrakot Rural Municipality (Gulmi): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chandrakot-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chandrakot Rural Municipality - Ward ' || ward_num,
                'Chandrakot Rural Municipality - वडा ' || ward_num,
                'chandrakot-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chandrakot-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chhatrakot Rural Municipality (Gulmi): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chhatrakot-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chhatrakot Rural Municipality - Ward ' || ward_num,
                'Chhatrakot Rural Municipality - वडा ' || ward_num,
                'chhatrakot-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chhatrakot-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dhurkot Rural Municipality (Gulmi): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dhurkot-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dhurkot Rural Municipality - Ward ' || ward_num,
                'Dhurkot Rural Municipality - वडा ' || ward_num,
                'dhurkot-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dhurkot-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gulmidarbar Rural Municipality (Gulmi): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gulmidarbar-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gulmidarbar Rural Municipality - Ward ' || ward_num,
                'Gulmidarbar Rural Municipality - वडा ' || ward_num,
                'gulmidarbar-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gulmidarbar-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Isma Rural Municipality (Gulmi): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'isma-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Isma Rural Municipality - Ward ' || ward_num,
                'Isma Rural Municipality - वडा ' || ward_num,
                'isma-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'isma-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kaligandaki Rural Municipality (Gulmi): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kaligandaki-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kaligandaki Rural Municipality - Ward ' || ward_num,
                'Kaligandaki Rural Municipality - वडा ' || ward_num,
                'kaligandaki-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kaligandaki-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Madane Rural Municipality (Gulmi): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'madane-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Madane Rural Municipality - Ward ' || ward_num,
                'Madane Rural Municipality - वडा ' || ward_num,
                'madane-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'madane-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Malika Rural Municipality (Gulmi): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'malika-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Malika Rural Municipality - Ward ' || ward_num,
                'Malika Rural Municipality - वडा ' || ward_num,
                'malika-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'malika-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rurukshetra Rural Municipality (Gulmi): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rurukshetra-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rurukshetra Rural Municipality - Ward ' || ward_num,
                'Rurukshetra Rural Municipality - वडा ' || ward_num,
                'rurukshetra-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rurukshetra-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Satyawati Rural Municipality (Gulmi): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'satyawati-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Satyawati Rural Municipality - Ward ' || ward_num,
                'Satyawati Rural Municipality - वडा ' || ward_num,
                'satyawati-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'satyawati-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rampur Municipality (Palpa): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rampur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rampur Municipality - Ward ' || ward_num,
                'Rampur Municipality - वडा ' || ward_num,
                'rampur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rampur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tansen Municipality (Palpa): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tansen-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tansen Municipality - Ward ' || ward_num,
                'Tansen Municipality - वडा ' || ward_num,
                'tansen-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tansen-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bagnaskali Rural Municipality (Palpa): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bagnaskali-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bagnaskali Rural Municipality - Ward ' || ward_num,
                'Bagnaskali Rural Municipality - वडा ' || ward_num,
                'bagnaskali-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bagnaskali-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mathagadhi Rural Municipality (Palpa): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mathagadhi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mathagadhi Rural Municipality - Ward ' || ward_num,
                'Mathagadhi Rural Municipality - वडा ' || ward_num,
                'mathagadhi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mathagadhi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Nisdi Rural Municipality (Palpa): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'nisdi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Nisdi Rural Municipality - Ward ' || ward_num,
                'Nisdi Rural Municipality - वडा ' || ward_num,
                'nisdi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'nisdi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Purbakhola Rural Municipality (Palpa): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'purbakhola-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Purbakhola Rural Municipality - Ward ' || ward_num,
                'Purbakhola Rural Municipality - वडा ' || ward_num,
                'purbakhola-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'purbakhola-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rainadevi Chhahara Rural Municipality (Palpa): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rainadevi-chhahara-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rainadevi Chhahara Rural Municipality - Ward ' || ward_num,
                'Rainadevi Chhahara Rural Municipality - वडा ' || ward_num,
                'rainadevi-chhahara-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rainadevi-chhahara-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rambha Rural Municipality (Palpa): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rambha-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rambha Rural Municipality - Ward ' || ward_num,
                'Rambha Rural Municipality - वडा ' || ward_num,
                'rambha-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rambha-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ripdikot Rural Municipality (Palpa): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ripdikot-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ripdikot Rural Municipality - Ward ' || ward_num,
                'Ripdikot Rural Municipality - वडा ' || ward_num,
                'ripdikot-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ripdikot-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tinahu Rural Municipality (Palpa): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tinahu-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tinahu Rural Municipality - Ward ' || ward_num,
                'Tinahu Rural Municipality - वडा ' || ward_num,
                'tinahu-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tinahu-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ghorahi Sub-Metropolitan City (Dang): 19 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ghorahi-sub-metropolitan-city' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..19 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ghorahi Sub-Metropolitan City - Ward ' || ward_num,
                'Ghorahi Sub-Metropolitan City - वडा ' || ward_num,
                'ghorahi-sub-metropolitan-city-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ghorahi-sub-metropolitan-city-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tulsipur Sub-Metropolitan City (Dang): 19 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tulsipur-sub-metropolitan-city' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..19 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tulsipur Sub-Metropolitan City - Ward ' || ward_num,
                'Tulsipur Sub-Metropolitan City - वडा ' || ward_num,
                'tulsipur-sub-metropolitan-city-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tulsipur-sub-metropolitan-city-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Lamahi Municipality (Dang): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'lamahi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Lamahi Municipality - Ward ' || ward_num,
                'Lamahi Municipality - वडा ' || ward_num,
                'lamahi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'lamahi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Babai Rural Municipality (Dang): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'babai-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Babai Rural Municipality - Ward ' || ward_num,
                'Babai Rural Municipality - वडा ' || ward_num,
                'babai-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'babai-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Banglachuli Rural Municipality (Dang): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'banglachuli-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Banglachuli Rural Municipality - Ward ' || ward_num,
                'Banglachuli Rural Municipality - वडा ' || ward_num,
                'banglachuli-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'banglachuli-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dangisharan Rural Municipality (Dang): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dangisharan-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dangisharan Rural Municipality - Ward ' || ward_num,
                'Dangisharan Rural Municipality - वडा ' || ward_num,
                'dangisharan-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dangisharan-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gadhawa Rural Municipality (Dang): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gadhawa-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gadhawa Rural Municipality - Ward ' || ward_num,
                'Gadhawa Rural Municipality - वडा ' || ward_num,
                'gadhawa-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gadhawa-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rajpur Rural Municipality (Dang): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rajpur-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rajpur Rural Municipality - Ward ' || ward_num,
                'Rajpur Rural Municipality - वडा ' || ward_num,
                'rajpur-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rajpur-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rapti Rural Municipality (Dang): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rapti-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rapti Rural Municipality - Ward ' || ward_num,
                'Rapti Rural Municipality - वडा ' || ward_num,
                'rapti-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rapti-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Shantinagar Rural Municipality (Dang): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'shantinagar-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Shantinagar Rural Municipality - Ward ' || ward_num,
                'Shantinagar Rural Municipality - वडा ' || ward_num,
                'shantinagar-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'shantinagar-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Pyuthan Municipality (Pyuthan): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'pyuthan-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Pyuthan Municipality - Ward ' || ward_num,
                'Pyuthan Municipality - वडा ' || ward_num,
                'pyuthan-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'pyuthan-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sworgadwari Municipality (Pyuthan): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sworgadwari-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sworgadwari Municipality - Ward ' || ward_num,
                'Sworgadwari Municipality - वडा ' || ward_num,
                'sworgadwari-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sworgadwari-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ayirawati Rural Municipality (Pyuthan): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ayirawati-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ayirawati Rural Municipality - Ward ' || ward_num,
                'Ayirawati Rural Municipality - वडा ' || ward_num,
                'ayirawati-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ayirawati-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gaumukhi Rural Municipality (Pyuthan): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gaumukhi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gaumukhi Rural Municipality - Ward ' || ward_num,
                'Gaumukhi Rural Municipality - वडा ' || ward_num,
                'gaumukhi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gaumukhi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Jhimruk Rural Municipality (Pyuthan): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'jhimruk-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Jhimruk Rural Municipality - Ward ' || ward_num,
                'Jhimruk Rural Municipality - वडा ' || ward_num,
                'jhimruk-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'jhimruk-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mallarani Rural Municipality (Pyuthan): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mallarani-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mallarani Rural Municipality - Ward ' || ward_num,
                'Mallarani Rural Municipality - वडा ' || ward_num,
                'mallarani-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mallarani-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mandavi Rural Municipality (Pyuthan): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mandavi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mandavi Rural Municipality - Ward ' || ward_num,
                'Mandavi Rural Municipality - वडा ' || ward_num,
                'mandavi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mandavi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Naubahini Rural Municipality (Pyuthan): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'naubahini-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Naubahini Rural Municipality - Ward ' || ward_num,
                'Naubahini Rural Municipality - वडा ' || ward_num,
                'naubahini-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'naubahini-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sarumarani Rural Municipality (Pyuthan): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sarumarani-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sarumarani Rural Municipality - Ward ' || ward_num,
                'Sarumarani Rural Municipality - वडा ' || ward_num,
                'sarumarani-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sarumarani-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rolpa Municipality (Rolpa): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rolpa-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rolpa Municipality - Ward ' || ward_num,
                'Rolpa Municipality - वडा ' || ward_num,
                'rolpa-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rolpa-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- GangaDev Rural Municipality (Rolpa): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gangadev-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'GangaDev Rural Municipality - Ward ' || ward_num,
                'GangaDev Rural Municipality - वडा ' || ward_num,
                'gangadev-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gangadev-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Lungri Rural Municipality (Rolpa): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'lungri-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Lungri Rural Municipality - Ward ' || ward_num,
                'Lungri Rural Municipality - वडा ' || ward_num,
                'lungri-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'lungri-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Madi Rural Municipality (Rolpa): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'madi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Madi Rural Municipality - Ward ' || ward_num,
                'Madi Rural Municipality - वडा ' || ward_num,
                'madi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'madi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Pariwartan Rural Municipality (Rolpa): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'pariwartan-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Pariwartan Rural Municipality - Ward ' || ward_num,
                'Pariwartan Rural Municipality - वडा ' || ward_num,
                'pariwartan-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'pariwartan-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Runtigadi Rural Municipality (Rolpa): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'runtigadi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Runtigadi Rural Municipality - Ward ' || ward_num,
                'Runtigadi Rural Municipality - वडा ' || ward_num,
                'runtigadi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'runtigadi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sunchhahari Rural Municipality (Rolpa): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sunchhahari-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sunchhahari Rural Municipality - Ward ' || ward_num,
                'Sunchhahari Rural Municipality - वडा ' || ward_num,
                'sunchhahari-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sunchhahari-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sunil Smiriti Rural Municipality (Rolpa): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sunil-smiriti-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sunil Smiriti Rural Municipality - Ward ' || ward_num,
                'Sunil Smiriti Rural Municipality - वडा ' || ward_num,
                'sunil-smiriti-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sunil-smiriti-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Thawang Rural Municipality (Rolpa): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'thawang-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Thawang Rural Municipality - Ward ' || ward_num,
                'Thawang Rural Municipality - वडा ' || ward_num,
                'thawang-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'thawang-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Triveni Rural Municipality (Rolpa): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'triveni-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Triveni Rural Municipality - Ward ' || ward_num,
                'Triveni Rural Municipality - वडा ' || ward_num,
                'triveni-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'triveni-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bhume Rural Municipality (Eastern Rukum): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bhume-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bhume Rural Municipality - Ward ' || ward_num,
                'Bhume Rural Municipality - वडा ' || ward_num,
                'bhume-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bhume-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Putha Uttarganga Rural Municipality (Eastern Rukum): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'putha-uttarganga-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Putha Uttarganga Rural Municipality - Ward ' || ward_num,
                'Putha Uttarganga Rural Municipality - वडा ' || ward_num,
                'putha-uttarganga-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'putha-uttarganga-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sisne Rural Municipality (Eastern Rukum): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sisne-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sisne Rural Municipality - Ward ' || ward_num,
                'Sisne Rural Municipality - वडा ' || ward_num,
                'sisne-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sisne-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Nepalgunj Sub-Metropolitan City (Banke): 23 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'nepalgunj-sub-metropolitan-city' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..23 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Nepalgunj Sub-Metropolitan City - Ward ' || ward_num,
                'Nepalgunj Sub-Metropolitan City - वडा ' || ward_num,
                'nepalgunj-sub-metropolitan-city-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'nepalgunj-sub-metropolitan-city-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kohalpur Municipality (Banke): 15 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kohalpur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..15 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kohalpur Municipality - Ward ' || ward_num,
                'Kohalpur Municipality - वडा ' || ward_num,
                'kohalpur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kohalpur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Baijanath Rural Municipality (Banke): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'baijanath-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Baijanath Rural Municipality - Ward ' || ward_num,
                'Baijanath Rural Municipality - वडा ' || ward_num,
                'baijanath-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'baijanath-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Duduwa Rural Municipality (Banke): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'duduwa-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Duduwa Rural Municipality - Ward ' || ward_num,
                'Duduwa Rural Municipality - वडा ' || ward_num,
                'duduwa-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'duduwa-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Janaki Rural Municipality (Banke): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'janaki-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Janaki Rural Municipality - Ward ' || ward_num,
                'Janaki Rural Municipality - वडा ' || ward_num,
                'janaki-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'janaki-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Khajura Rural Municipality (Banke): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'khajura-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Khajura Rural Municipality - Ward ' || ward_num,
                'Khajura Rural Municipality - वडा ' || ward_num,
                'khajura-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'khajura-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Narainapur Rural Municipality (Banke): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'narainapur-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Narainapur Rural Municipality - Ward ' || ward_num,
                'Narainapur Rural Municipality - वडा ' || ward_num,
                'narainapur-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'narainapur-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rapti-Sonari Rural Municipality (Banke): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rapti-sonari-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rapti-Sonari Rural Municipality - Ward ' || ward_num,
                'Rapti-Sonari Rural Municipality - वडा ' || ward_num,
                'rapti-sonari-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rapti-sonari-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Barbardiya Municipality (Bardiya): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'barbardiya-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Barbardiya Municipality - Ward ' || ward_num,
                'Barbardiya Municipality - वडा ' || ward_num,
                'barbardiya-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'barbardiya-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Basgadhi Municipality (Bardiya): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'basgadhi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Basgadhi Municipality - Ward ' || ward_num,
                'Basgadhi Municipality - वडा ' || ward_num,
                'basgadhi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'basgadhi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gulariya Municipality (Bardiya): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gulariya-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gulariya Municipality - Ward ' || ward_num,
                'Gulariya Municipality - वडा ' || ward_num,
                'gulariya-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gulariya-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Madhuwan Municipality (Bardiya): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'madhuwan-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Madhuwan Municipality - Ward ' || ward_num,
                'Madhuwan Municipality - वडा ' || ward_num,
                'madhuwan-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'madhuwan-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Rajapur Municipality (Bardiya): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'rajapur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Rajapur Municipality - Ward ' || ward_num,
                'Rajapur Municipality - वडा ' || ward_num,
                'rajapur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'rajapur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Thakurbaba Municipality (Bardiya): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'thakurbaba-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Thakurbaba Municipality - Ward ' || ward_num,
                'Thakurbaba Municipality - वडा ' || ward_num,
                'thakurbaba-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'thakurbaba-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Badhaiyatal Rural Municipality (Bardiya): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'badhaiyatal-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Badhaiyatal Rural Municipality - Ward ' || ward_num,
                'Badhaiyatal Rural Municipality - वडा ' || ward_num,
                'badhaiyatal-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'badhaiyatal-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Geruwa Rural Municipality (Bardiya): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'geruwa-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Geruwa Rural Municipality - Ward ' || ward_num,
                'Geruwa Rural Municipality - वडा ' || ward_num,
                'geruwa-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'geruwa-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Aathabiskot Municipality (Western Rukum): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'aathabiskot-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Aathabiskot Municipality - Ward ' || ward_num,
                'Aathabiskot Municipality - वडा ' || ward_num,
                'aathabiskot-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'aathabiskot-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chaurjahari Municipality (Western Rukum): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chaurjahari-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chaurjahari Municipality - Ward ' || ward_num,
                'Chaurjahari Municipality - वडा ' || ward_num,
                'chaurjahari-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chaurjahari-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Musikot Municipality (Western Rukum): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'musikot-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Musikot Municipality - Ward ' || ward_num,
                'Musikot Municipality - वडा ' || ward_num,
                'musikot-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'musikot-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Banphikot Rural Municipality (Western Rukum): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'banphikot-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Banphikot Rural Municipality - Ward ' || ward_num,
                'Banphikot Rural Municipality - वडा ' || ward_num,
                'banphikot-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'banphikot-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- SaniBheri Rural Municipality (Western Rukum): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sanibheri-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'SaniBheri Rural Municipality - Ward ' || ward_num,
                'SaniBheri Rural Municipality - वडा ' || ward_num,
                'sanibheri-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sanibheri-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Triveni Rural Municipality (Western Rukum): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'triveni-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Triveni Rural Municipality - Ward ' || ward_num,
                'Triveni Rural Municipality - वडा ' || ward_num,
                'triveni-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'triveni-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bagchaur Municipality (Salyan): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bagchaur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bagchaur Municipality - Ward ' || ward_num,
                'Bagchaur Municipality - वडा ' || ward_num,
                'bagchaur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bagchaur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bangad Kupinde Municipality (Salyan): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bangad-kupinde-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bangad Kupinde Municipality - Ward ' || ward_num,
                'Bangad Kupinde Municipality - वडा ' || ward_num,
                'bangad-kupinde-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bangad-kupinde-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Shaarda Municipality (Salyan): 15 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'shaarda-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..15 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Shaarda Municipality - Ward ' || ward_num,
                'Shaarda Municipality - वडा ' || ward_num,
                'shaarda-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'shaarda-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chhatreshwari Rural Municipality (Salyan): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chhatreshwari-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chhatreshwari Rural Municipality - Ward ' || ward_num,
                'Chhatreshwari Rural Municipality - वडा ' || ward_num,
                'chhatreshwari-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chhatreshwari-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Darma Rural Municipality (Salyan): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'darma-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Darma Rural Municipality - Ward ' || ward_num,
                'Darma Rural Municipality - वडा ' || ward_num,
                'darma-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'darma-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kalimati Rural Municipality (Salyan): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kalimati-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kalimati Rural Municipality - Ward ' || ward_num,
                'Kalimati Rural Municipality - वडा ' || ward_num,
                'kalimati-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kalimati-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kapurkot Rural Municipality (Salyan): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kapurkot-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kapurkot Rural Municipality - Ward ' || ward_num,
                'Kapurkot Rural Municipality - वडा ' || ward_num,
                'kapurkot-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kapurkot-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kumakh Rural Municipality (Salyan): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kumakh-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kumakh Rural Municipality - Ward ' || ward_num,
                'Kumakh Rural Municipality - वडा ' || ward_num,
                'kumakh-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kumakh-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Siddha Kumakh Rural Municipality (Salyan): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'siddha-kumakh-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Siddha Kumakh Rural Municipality - Ward ' || ward_num,
                'Siddha Kumakh Rural Municipality - वडा ' || ward_num,
                'siddha-kumakh-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'siddha-kumakh-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Triveni Rural Municipality (Salyan): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'triveni-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Triveni Rural Municipality - Ward ' || ward_num,
                'Triveni Rural Municipality - वडा ' || ward_num,
                'triveni-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'triveni-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Thuli Bheri Municipality (Dolpa): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'thuli-bheri-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Thuli Bheri Municipality - Ward ' || ward_num,
                'Thuli Bheri Municipality - वडा ' || ward_num,
                'thuli-bheri-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'thuli-bheri-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tripurasundari Municipality (Dolpa): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tripurasundari-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tripurasundari Municipality - Ward ' || ward_num,
                'Tripurasundari Municipality - वडा ' || ward_num,
                'tripurasundari-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tripurasundari-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chharka Tongsong Rural Municipality (Dolpa): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chharka-tongsong-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chharka Tongsong Rural Municipality - Ward ' || ward_num,
                'Chharka Tongsong Rural Municipality - वडा ' || ward_num,
                'chharka-tongsong-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chharka-tongsong-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dolpo Buddha Rural Municipality (Dolpa): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dolpo-buddha-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dolpo Buddha Rural Municipality - Ward ' || ward_num,
                'Dolpo Buddha Rural Municipality - वडा ' || ward_num,
                'dolpo-buddha-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dolpo-buddha-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Jagadulla Rural Municipality (Dolpa): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'jagadulla-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Jagadulla Rural Municipality - Ward ' || ward_num,
                'Jagadulla Rural Municipality - वडा ' || ward_num,
                'jagadulla-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'jagadulla-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kaike Rural Municipality (Dolpa): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kaike-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kaike Rural Municipality - Ward ' || ward_num,
                'Kaike Rural Municipality - वडा ' || ward_num,
                'kaike-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kaike-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mudkechula Rural Municipality (Dolpa): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mudkechula-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mudkechula Rural Municipality - Ward ' || ward_num,
                'Mudkechula Rural Municipality - वडा ' || ward_num,
                'mudkechula-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mudkechula-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- She Phoksundo Rural Municipality (Dolpa): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'she-phoksundo-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'She Phoksundo Rural Municipality - Ward ' || ward_num,
                'She Phoksundo Rural Municipality - वडा ' || ward_num,
                'she-phoksundo-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'she-phoksundo-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Adanchuli Rural Municipality (Humla): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'adanchuli-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Adanchuli Rural Municipality - Ward ' || ward_num,
                'Adanchuli Rural Municipality - वडा ' || ward_num,
                'adanchuli-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'adanchuli-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chankheli Rural Municipality (Humla): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chankheli-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chankheli Rural Municipality - Ward ' || ward_num,
                'Chankheli Rural Municipality - वडा ' || ward_num,
                'chankheli-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chankheli-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kharpunath Rural Municipality (Humla): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kharpunath-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kharpunath Rural Municipality - Ward ' || ward_num,
                'Kharpunath Rural Municipality - वडा ' || ward_num,
                'kharpunath-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kharpunath-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Namkha Rural Municipality (Humla): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'namkha-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Namkha Rural Municipality - Ward ' || ward_num,
                'Namkha Rural Municipality - वडा ' || ward_num,
                'namkha-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'namkha-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sarkegad Rural Municipality (Humla): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sarkegad-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sarkegad Rural Municipality - Ward ' || ward_num,
                'Sarkegad Rural Municipality - वडा ' || ward_num,
                'sarkegad-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sarkegad-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Simkot Rural Municipality (Humla): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'simkot-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Simkot Rural Municipality - Ward ' || ward_num,
                'Simkot Rural Municipality - वडा ' || ward_num,
                'simkot-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'simkot-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tanjakot Rural Municipality (Humla): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tanjakot-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tanjakot Rural Municipality - Ward ' || ward_num,
                'Tanjakot Rural Municipality - वडा ' || ward_num,
                'tanjakot-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tanjakot-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chandannath Municipality (Jumla): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chandannath-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chandannath Municipality - Ward ' || ward_num,
                'Chandannath Municipality - वडा ' || ward_num,
                'chandannath-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chandannath-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Guthichaur Rural Municipality (Jumla): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'guthichaur-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Guthichaur Rural Municipality - Ward ' || ward_num,
                'Guthichaur Rural Municipality - वडा ' || ward_num,
                'guthichaur-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'guthichaur-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Hima Rural Municipality (Jumla): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'hima-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Hima Rural Municipality - Ward ' || ward_num,
                'Hima Rural Municipality - वडा ' || ward_num,
                'hima-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'hima-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kanaka Sundari Rural Municipality (Jumla): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kanaka-sundari-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kanaka Sundari Rural Municipality - Ward ' || ward_num,
                'Kanaka Sundari Rural Municipality - वडा ' || ward_num,
                'kanaka-sundari-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kanaka-sundari-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Patarasi Rural Municipality (Jumla): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'patarasi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Patarasi Rural Municipality - Ward ' || ward_num,
                'Patarasi Rural Municipality - वडा ' || ward_num,
                'patarasi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'patarasi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sinja Rural Municipality (Jumla): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sinja-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sinja Rural Municipality - Ward ' || ward_num,
                'Sinja Rural Municipality - वडा ' || ward_num,
                'sinja-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sinja-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tatopani Rural Municipality (Jumla): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tatopani-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tatopani Rural Municipality - Ward ' || ward_num,
                'Tatopani Rural Municipality - वडा ' || ward_num,
                'tatopani-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tatopani-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tila Rural Municipality (Jumla): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tila-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tila Rural Municipality - Ward ' || ward_num,
                'Tila Rural Municipality - वडा ' || ward_num,
                'tila-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tila-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Khandachakra Municipality (Kalikot): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'khandachakra-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Khandachakra Municipality - Ward ' || ward_num,
                'Khandachakra Municipality - वडा ' || ward_num,
                'khandachakra-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'khandachakra-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Raskot Municipality (Kalikot): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'raskot-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Raskot Municipality - Ward ' || ward_num,
                'Raskot Municipality - वडा ' || ward_num,
                'raskot-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'raskot-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tilagufa Municipality (Kalikot): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tilagufa-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tilagufa Municipality - Ward ' || ward_num,
                'Tilagufa Municipality - वडा ' || ward_num,
                'tilagufa-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tilagufa-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mahawai Rural Municipality (Kalikot): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mahawai-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mahawai Rural Municipality - Ward ' || ward_num,
                'Mahawai Rural Municipality - वडा ' || ward_num,
                'mahawai-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mahawai-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Narharinath Rural Municipality (Kalikot): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'narharinath-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Narharinath Rural Municipality - Ward ' || ward_num,
                'Narharinath Rural Municipality - वडा ' || ward_num,
                'narharinath-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'narharinath-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Pachaljharana Rural Municipality (Kalikot): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'pachaljharana-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Pachaljharana Rural Municipality - Ward ' || ward_num,
                'Pachaljharana Rural Municipality - वडा ' || ward_num,
                'pachaljharana-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'pachaljharana-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Palata Rural Municipality (Kalikot): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'palata-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Palata Rural Municipality - Ward ' || ward_num,
                'Palata Rural Municipality - वडा ' || ward_num,
                'palata-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'palata-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sanni Triveni Rural Municipality (Kalikot): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sanni-triveni-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sanni Triveni Rural Municipality - Ward ' || ward_num,
                'Sanni Triveni Rural Municipality - वडा ' || ward_num,
                'sanni-triveni-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sanni-triveni-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Shubha Kalika Rural Municipality (Kalikot): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'shubha-kalika-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Shubha Kalika Rural Municipality - Ward ' || ward_num,
                'Shubha Kalika Rural Municipality - वडा ' || ward_num,
                'shubha-kalika-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'shubha-kalika-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chhayanath Rara Municipality (Mugu): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chhayanath-rara-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chhayanath Rara Municipality - Ward ' || ward_num,
                'Chhayanath Rara Municipality - वडा ' || ward_num,
                'chhayanath-rara-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chhayanath-rara-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Khatyad Rural Municipality (Mugu): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'khatyad-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Khatyad Rural Municipality - Ward ' || ward_num,
                'Khatyad Rural Municipality - वडा ' || ward_num,
                'khatyad-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'khatyad-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mugum Karmarong Rural Municipality (Mugu): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mugum-karmarong-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mugum Karmarong Rural Municipality - Ward ' || ward_num,
                'Mugum Karmarong Rural Municipality - वडा ' || ward_num,
                'mugum-karmarong-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mugum-karmarong-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Soru Rural Municipality (Mugu): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'soru-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Soru Rural Municipality - Ward ' || ward_num,
                'Soru Rural Municipality - वडा ' || ward_num,
                'soru-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'soru-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bheriganga Municipality (Surkhet): 13 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bheriganga-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..13 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bheriganga Municipality - Ward ' || ward_num,
                'Bheriganga Municipality - वडा ' || ward_num,
                'bheriganga-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bheriganga-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Birendranagar Municipality (Surkhet): 16 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'birendranagar-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..16 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Birendranagar Municipality - Ward ' || ward_num,
                'Birendranagar Municipality - वडा ' || ward_num,
                'birendranagar-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'birendranagar-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gurbhakot Municipality (Surkhet): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gurbhakot-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gurbhakot Municipality - Ward ' || ward_num,
                'Gurbhakot Municipality - वडा ' || ward_num,
                'gurbhakot-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gurbhakot-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Lekbeshi Municipality (Surkhet): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'lekbeshi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Lekbeshi Municipality - Ward ' || ward_num,
                'Lekbeshi Municipality - वडा ' || ward_num,
                'lekbeshi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'lekbeshi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Panchapuri Municipality (Surkhet): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'panchapuri-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Panchapuri Municipality - Ward ' || ward_num,
                'Panchapuri Municipality - वडा ' || ward_num,
                'panchapuri-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'panchapuri-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Barahatal Rural Municipality (Surkhet): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'barahatal-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Barahatal Rural Municipality - Ward ' || ward_num,
                'Barahatal Rural Municipality - वडा ' || ward_num,
                'barahatal-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'barahatal-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chaukune Rural Municipality (Surkhet): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chaukune-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chaukune Rural Municipality - Ward ' || ward_num,
                'Chaukune Rural Municipality - वडा ' || ward_num,
                'chaukune-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chaukune-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chingad Rural Municipality (Surkhet): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chingad-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chingad Rural Municipality - Ward ' || ward_num,
                'Chingad Rural Municipality - वडा ' || ward_num,
                'chingad-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chingad-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Simta Rural Municipality (Surkhet): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'simta-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Simta Rural Municipality - Ward ' || ward_num,
                'Simta Rural Municipality - वडा ' || ward_num,
                'simta-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'simta-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Aathabis Municipality (Dailekh): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'aathabis-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Aathabis Municipality - Ward ' || ward_num,
                'Aathabis Municipality - वडा ' || ward_num,
                'aathabis-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'aathabis-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chamunda Bindrasaini Municipality (Dailekh): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chamunda-bindrasaini-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chamunda Bindrasaini Municipality - Ward ' || ward_num,
                'Chamunda Bindrasaini Municipality - वडा ' || ward_num,
                'chamunda-bindrasaini-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chamunda-bindrasaini-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dullu Municipality (Dailekh): 13 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dullu-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..13 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dullu Municipality - Ward ' || ward_num,
                'Dullu Municipality - वडा ' || ward_num,
                'dullu-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dullu-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Narayan Municipality (Dailekh): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'narayan-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Narayan Municipality - Ward ' || ward_num,
                'Narayan Municipality - वडा ' || ward_num,
                'narayan-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'narayan-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bhagawatimai Rural Municipality (Dailekh): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bhagawatimai-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bhagawatimai Rural Municipality - Ward ' || ward_num,
                'Bhagawatimai Rural Municipality - वडा ' || ward_num,
                'bhagawatimai-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bhagawatimai-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bhairabi Rural Municipality (Dailekh): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bhairabi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bhairabi Rural Municipality - Ward ' || ward_num,
                'Bhairabi Rural Municipality - वडा ' || ward_num,
                'bhairabi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bhairabi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dungeshwar Rural Municipality (Dailekh): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dungeshwar-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dungeshwar Rural Municipality - Ward ' || ward_num,
                'Dungeshwar Rural Municipality - वडा ' || ward_num,
                'dungeshwar-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dungeshwar-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gurans Rural Municipality (Dailekh): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gurans-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gurans Rural Municipality - Ward ' || ward_num,
                'Gurans Rural Municipality - वडा ' || ward_num,
                'gurans-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gurans-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mahabu Rural Municipality (Dailekh): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mahabu-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mahabu Rural Municipality - Ward ' || ward_num,
                'Mahabu Rural Municipality - वडा ' || ward_num,
                'mahabu-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mahabu-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Naumule Rural Municipality (Dailekh): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'naumule-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Naumule Rural Municipality - Ward ' || ward_num,
                'Naumule Rural Municipality - वडा ' || ward_num,
                'naumule-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'naumule-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Thantikandh Rural Municipality (Dailekh): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'thantikandh-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Thantikandh Rural Municipality - Ward ' || ward_num,
                'Thantikandh Rural Municipality - वडा ' || ward_num,
                'thantikandh-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'thantikandh-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bheri Municipality (Jajarkot): 13 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bheri-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..13 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bheri Municipality - Ward ' || ward_num,
                'Bheri Municipality - वडा ' || ward_num,
                'bheri-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bheri-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chhedagad Municipality (Jajarkot): 13 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chhedagad-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..13 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chhedagad Municipality - Ward ' || ward_num,
                'Chhedagad Municipality - वडा ' || ward_num,
                'chhedagad-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chhedagad-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Nalgad Municipality (Jajarkot): 13 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'nalgad-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..13 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Nalgad Municipality - Ward ' || ward_num,
                'Nalgad Municipality - वडा ' || ward_num,
                'nalgad-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'nalgad-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Barekot Rural Municipality (Jajarkot): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'barekot-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Barekot Rural Municipality - Ward ' || ward_num,
                'Barekot Rural Municipality - वडा ' || ward_num,
                'barekot-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'barekot-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Junichande Rural Municipality (Jajarkot): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'junichande-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Junichande Rural Municipality - Ward ' || ward_num,
                'Junichande Rural Municipality - वडा ' || ward_num,
                'junichande-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'junichande-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kuse Rural Municipality (Jajarkot): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kuse-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kuse Rural Municipality - Ward ' || ward_num,
                'Kuse Rural Municipality - वडा ' || ward_num,
                'kuse-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kuse-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Shivalaya Rural Municipality (Jajarkot): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'shivalaya-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Shivalaya Rural Municipality - Ward ' || ward_num,
                'Shivalaya Rural Municipality - वडा ' || ward_num,
                'shivalaya-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'shivalaya-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mahakali Municipality (Darchula): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mahakali-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mahakali Municipality - Ward ' || ward_num,
                'Mahakali Municipality - वडा ' || ward_num,
                'mahakali-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mahakali-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Shailyashikhar Municipality (Darchula): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'shailyashikhar-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Shailyashikhar Municipality - Ward ' || ward_num,
                'Shailyashikhar Municipality - वडा ' || ward_num,
                'shailyashikhar-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'shailyashikhar-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Apihimal Rural Municipality (Darchula): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'apihimal-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Apihimal Rural Municipality - Ward ' || ward_num,
                'Apihimal Rural Municipality - वडा ' || ward_num,
                'apihimal-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'apihimal-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Duhun Rural Municipality (Darchula): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'duhun-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Duhun Rural Municipality - Ward ' || ward_num,
                'Duhun Rural Municipality - वडा ' || ward_num,
                'duhun-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'duhun-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Lekam Rural Municipality (Darchula): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'lekam-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Lekam Rural Municipality - Ward ' || ward_num,
                'Lekam Rural Municipality - वडा ' || ward_num,
                'lekam-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'lekam-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Malikarjun Rural Municipality (Darchula): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'malikarjun-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Malikarjun Rural Municipality - Ward ' || ward_num,
                'Malikarjun Rural Municipality - वडा ' || ward_num,
                'malikarjun-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'malikarjun-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Marma Rural Municipality (Darchula): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'marma-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Marma Rural Municipality - Ward ' || ward_num,
                'Marma Rural Municipality - वडा ' || ward_num,
                'marma-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'marma-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Naugad Rural Municipality (Darchula): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'naugad-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Naugad Rural Municipality - Ward ' || ward_num,
                'Naugad Rural Municipality - वडा ' || ward_num,
                'naugad-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'naugad-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Vyans Rural Municipality (Darchula): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'vyans-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Vyans Rural Municipality - Ward ' || ward_num,
                'Vyans Rural Municipality - वडा ' || ward_num,
                'vyans-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'vyans-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bungal Municipality (Bajhang): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bungal-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bungal Municipality - Ward ' || ward_num,
                'Bungal Municipality - वडा ' || ward_num,
                'bungal-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bungal-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Jayaprithvi Municipality (Bajhang): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'jayaprithvi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Jayaprithvi Municipality - Ward ' || ward_num,
                'Jayaprithvi Municipality - वडा ' || ward_num,
                'jayaprithvi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'jayaprithvi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bitthadchir Rural Municipality (Bajhang): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bitthadchir-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bitthadchir Rural Municipality - Ward ' || ward_num,
                'Bitthadchir Rural Municipality - वडा ' || ward_num,
                'bitthadchir-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bitthadchir-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chhabis Pathibhera Rural Municipality (Bajhang): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chhabis-pathibhera-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chhabis Pathibhera Rural Municipality - Ward ' || ward_num,
                'Chhabis Pathibhera Rural Municipality - वडा ' || ward_num,
                'chhabis-pathibhera-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chhabis-pathibhera-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Durgathali Rural Municipality (Bajhang): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'durgathali-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Durgathali Rural Municipality - Ward ' || ward_num,
                'Durgathali Rural Municipality - वडा ' || ward_num,
                'durgathali-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'durgathali-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kedarsyu Rural Municipality (Bajhang): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kedarsyu-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kedarsyu Rural Municipality - Ward ' || ward_num,
                'Kedarsyu Rural Municipality - वडा ' || ward_num,
                'kedarsyu-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kedarsyu-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Khaptadchhanna Rural Municipality (Bajhang): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'khaptadchhanna-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Khaptadchhanna Rural Municipality - Ward ' || ward_num,
                'Khaptadchhanna Rural Municipality - वडा ' || ward_num,
                'khaptadchhanna-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'khaptadchhanna-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Masta Rural Municipality (Bajhang): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'masta-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Masta Rural Municipality - Ward ' || ward_num,
                'Masta Rural Municipality - वडा ' || ward_num,
                'masta-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'masta-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Saipal Rural Municipality (Bajhang): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'saipal-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Saipal Rural Municipality - Ward ' || ward_num,
                'Saipal Rural Municipality - वडा ' || ward_num,
                'saipal-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'saipal-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Surma Rural Municipality (Bajhang): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'surma-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Surma Rural Municipality - Ward ' || ward_num,
                'Surma Rural Municipality - वडा ' || ward_num,
                'surma-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'surma-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Talkot Rural Municipality (Bajhang): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'talkot-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Talkot Rural Municipality - Ward ' || ward_num,
                'Talkot Rural Municipality - वडा ' || ward_num,
                'talkot-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'talkot-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Thalara Rural Municipality (Bajhang): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'thalara-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Thalara Rural Municipality - Ward ' || ward_num,
                'Thalara Rural Municipality - वडा ' || ward_num,
                'thalara-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'thalara-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Badimalika Municipality (Bajura): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'badimalika-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Badimalika Municipality - Ward ' || ward_num,
                'Badimalika Municipality - वडा ' || ward_num,
                'badimalika-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'badimalika-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Budhiganga Municipality (Bajura): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'budhiganga-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Budhiganga Municipality - Ward ' || ward_num,
                'Budhiganga Municipality - वडा ' || ward_num,
                'budhiganga-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'budhiganga-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Budhinanda Municipality (Bajura): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'budhinanda-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Budhinanda Municipality - Ward ' || ward_num,
                'Budhinanda Municipality - वडा ' || ward_num,
                'budhinanda-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'budhinanda-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Triveni Municipality (Bajura): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'triveni-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Triveni Municipality - Ward ' || ward_num,
                'Triveni Municipality - वडा ' || ward_num,
                'triveni-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'triveni-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gaumul Rural Municipality (Bajura): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gaumul-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gaumul Rural Municipality - Ward ' || ward_num,
                'Gaumul Rural Municipality - वडा ' || ward_num,
                'gaumul-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gaumul-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Himali Rural Municipality (Bajura): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'himali-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Himali Rural Municipality - Ward ' || ward_num,
                'Himali Rural Municipality - वडा ' || ward_num,
                'himali-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'himali-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Jagannath Rural Municipality (Bajura): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'jagannath-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Jagannath Rural Municipality - Ward ' || ward_num,
                'Jagannath Rural Municipality - वडा ' || ward_num,
                'jagannath-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'jagannath-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Khaptad Chhededaha Rural Municipality (Bajura): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'khaptad-chhededaha-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Khaptad Chhededaha Rural Municipality - Ward ' || ward_num,
                'Khaptad Chhededaha Rural Municipality - वडा ' || ward_num,
                'khaptad-chhededaha-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'khaptad-chhededaha-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Swami Kartik Khapar Rural Municipality (Bajura): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'swami-kartik-khapar-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Swami Kartik Khapar Rural Municipality - Ward ' || ward_num,
                'Swami Kartik Khapar Rural Municipality - वडा ' || ward_num,
                'swami-kartik-khapar-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'swami-kartik-khapar-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dashrathchanda Municipality (Baitadi): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dashrathchanda-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dashrathchanda Municipality - Ward ' || ward_num,
                'Dashrathchanda Municipality - वडा ' || ward_num,
                'dashrathchanda-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dashrathchanda-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Melauli Municipality (Baitadi): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'melauli-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Melauli Municipality - Ward ' || ward_num,
                'Melauli Municipality - वडा ' || ward_num,
                'melauli-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'melauli-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Patan Municipality (Baitadi): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'patan-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Patan Municipality - Ward ' || ward_num,
                'Patan Municipality - वडा ' || ward_num,
                'patan-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'patan-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Purchaudi Municipality (Baitadi): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'purchaudi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Purchaudi Municipality - Ward ' || ward_num,
                'Purchaudi Municipality - वडा ' || ward_num,
                'purchaudi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'purchaudi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dilashaini Rural Municipality (Baitadi): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dilashaini-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dilashaini Rural Municipality - Ward ' || ward_num,
                'Dilashaini Rural Municipality - वडा ' || ward_num,
                'dilashaini-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dilashaini-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dogdakedar Rural Municipality (Baitadi): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dogdakedar-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dogdakedar Rural Municipality - Ward ' || ward_num,
                'Dogdakedar Rural Municipality - वडा ' || ward_num,
                'dogdakedar-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dogdakedar-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Pancheshwar Rural Municipality (Baitadi): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'pancheshwar-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Pancheshwar Rural Municipality - Ward ' || ward_num,
                'Pancheshwar Rural Municipality - वडा ' || ward_num,
                'pancheshwar-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'pancheshwar-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Shivanath Rural Municipality (Baitadi): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'shivanath-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Shivanath Rural Municipality - Ward ' || ward_num,
                'Shivanath Rural Municipality - वडा ' || ward_num,
                'shivanath-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'shivanath-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sigas Rural Municipality (Baitadi): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sigas-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sigas Rural Municipality - Ward ' || ward_num,
                'Sigas Rural Municipality - वडा ' || ward_num,
                'sigas-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sigas-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Surnaya Rural Municipality (Baitadi): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'surnaya-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Surnaya Rural Municipality - Ward ' || ward_num,
                'Surnaya Rural Municipality - वडा ' || ward_num,
                'surnaya-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'surnaya-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dipayal Silgadhi Municipality (Doti): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dipayal-silgadhi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dipayal Silgadhi Municipality - Ward ' || ward_num,
                'Dipayal Silgadhi Municipality - वडा ' || ward_num,
                'dipayal-silgadhi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dipayal-silgadhi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Shikhar Municipality (Doti): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'shikhar-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Shikhar Municipality - Ward ' || ward_num,
                'Shikhar Municipality - वडा ' || ward_num,
                'shikhar-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'shikhar-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Aadarsha Rural Municipality (Doti): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'aadarsha-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Aadarsha Rural Municipality - Ward ' || ward_num,
                'Aadarsha Rural Municipality - वडा ' || ward_num,
                'aadarsha-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'aadarsha-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Badikedar Rural Municipality (Doti): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'badikedar-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Badikedar Rural Municipality - Ward ' || ward_num,
                'Badikedar Rural Municipality - वडा ' || ward_num,
                'badikedar-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'badikedar-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bogatan-Phudsil Rural Municipality (Doti): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bogatan-phudsil-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bogatan-Phudsil Rural Municipality - Ward ' || ward_num,
                'Bogatan-Phudsil Rural Municipality - वडा ' || ward_num,
                'bogatan-phudsil-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bogatan-phudsil-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Jorayal Rural Municipality (Doti): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'jorayal-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Jorayal Rural Municipality - Ward ' || ward_num,
                'Jorayal Rural Municipality - वडा ' || ward_num,
                'jorayal-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'jorayal-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- K.I.Singh Rural Municipality (Doti): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'k-i-singh-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'K.I.Singh Rural Municipality - Ward ' || ward_num,
                'K.I.Singh Rural Municipality - वडा ' || ward_num,
                'k-i-singh-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'k-i-singh-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Purbichauki Rural Municipality (Doti): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'purbichauki-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Purbichauki Rural Municipality - Ward ' || ward_num,
                'Purbichauki Rural Municipality - वडा ' || ward_num,
                'purbichauki-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'purbichauki-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sayal Rural Municipality (Doti): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sayal-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sayal Rural Municipality - Ward ' || ward_num,
                'Sayal Rural Municipality - वडा ' || ward_num,
                'sayal-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sayal-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kamalbazar Municipality (Acham): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kamalbazar-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kamalbazar Municipality - Ward ' || ward_num,
                'Kamalbazar Municipality - वडा ' || ward_num,
                'kamalbazar-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kamalbazar-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mangalsen Municipality (Acham): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mangalsen-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mangalsen Municipality - Ward ' || ward_num,
                'Mangalsen Municipality - वडा ' || ward_num,
                'mangalsen-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mangalsen-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Panchadewal Binayak Municipality (Acham): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'panchadewal-binayak-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Panchadewal Binayak Municipality - Ward ' || ward_num,
                'Panchadewal Binayak Municipality - वडा ' || ward_num,
                'panchadewal-binayak-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'panchadewal-binayak-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Sanfebagar Municipality (Acham): 14 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'sanfebagar-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..14 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Sanfebagar Municipality - Ward ' || ward_num,
                'Sanfebagar Municipality - वडा ' || ward_num,
                'sanfebagar-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'sanfebagar-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bannigadi Jayagad Rural Municipality (Acham): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bannigadi-jayagad-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bannigadi Jayagad Rural Municipality - Ward ' || ward_num,
                'Bannigadi Jayagad Rural Municipality - वडा ' || ward_num,
                'bannigadi-jayagad-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bannigadi-jayagad-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chaurpati Rural Municipality (Acham): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chaurpati-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chaurpati Rural Municipality - Ward ' || ward_num,
                'Chaurpati Rural Municipality - वडा ' || ward_num,
                'chaurpati-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chaurpati-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dhakari Rural Municipality (Acham): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dhakari-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dhakari Rural Municipality - Ward ' || ward_num,
                'Dhakari Rural Municipality - वडा ' || ward_num,
                'dhakari-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dhakari-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mellekh Rural Municipality (Acham): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mellekh-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mellekh Rural Municipality - Ward ' || ward_num,
                'Mellekh Rural Municipality - वडा ' || ward_num,
                'mellekh-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mellekh-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ramaroshan Rural Municipality (Acham): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ramaroshan-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ramaroshan Rural Municipality - Ward ' || ward_num,
                'Ramaroshan Rural Municipality - वडा ' || ward_num,
                'ramaroshan-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ramaroshan-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Turmakhand Rural Municipality (Acham): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'turmakhand-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Turmakhand Rural Municipality - Ward ' || ward_num,
                'Turmakhand Rural Municipality - वडा ' || ward_num,
                'turmakhand-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'turmakhand-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Amargadhi Municipality (Dadeldhura): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'amargadhi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Amargadhi Municipality - Ward ' || ward_num,
                'Amargadhi Municipality - वडा ' || ward_num,
                'amargadhi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'amargadhi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Parshuram Municipality (Dadeldhura): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'parshuram-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Parshuram Municipality - Ward ' || ward_num,
                'Parshuram Municipality - वडा ' || ward_num,
                'parshuram-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'parshuram-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Aalitaal Rural Municipality (Dadeldhura): 8 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'aalitaal-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..8 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Aalitaal Rural Municipality - Ward ' || ward_num,
                'Aalitaal Rural Municipality - वडा ' || ward_num,
                'aalitaal-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'aalitaal-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ajaymeru Rural Municipality (Dadeldhura): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ajaymeru-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ajaymeru Rural Municipality - Ward ' || ward_num,
                'Ajaymeru Rural Municipality - वडा ' || ward_num,
                'ajaymeru-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ajaymeru-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bhageshwar Rural Municipality (Dadeldhura): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bhageshwar-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bhageshwar Rural Municipality - Ward ' || ward_num,
                'Bhageshwar Rural Municipality - वडा ' || ward_num,
                'bhageshwar-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bhageshwar-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ganyapadhura Rural Municipality (Dadeldhura): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ganyapadhura-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ganyapadhura Rural Municipality - Ward ' || ward_num,
                'Ganyapadhura Rural Municipality - वडा ' || ward_num,
                'ganyapadhura-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ganyapadhura-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Navadurga Rural Municipality (Dadeldhura): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'navadurga-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Navadurga Rural Municipality - Ward ' || ward_num,
                'Navadurga Rural Municipality - वडा ' || ward_num,
                'navadurga-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'navadurga-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bedkot Municipality (Kanchanpur): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bedkot-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bedkot Municipality - Ward ' || ward_num,
                'Bedkot Municipality - वडा ' || ward_num,
                'bedkot-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bedkot-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Belauri Municipality (Kanchanpur): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'belauri-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Belauri Municipality - Ward ' || ward_num,
                'Belauri Municipality - वडा ' || ward_num,
                'belauri-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'belauri-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bhimdatta Municipality (Kanchanpur): 19 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bhimdatta-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..19 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bhimdatta Municipality - Ward ' || ward_num,
                'Bhimdatta Municipality - वडा ' || ward_num,
                'bhimdatta-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bhimdatta-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Krishnapur Municipality (Kanchanpur): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'krishnapur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Krishnapur Municipality - Ward ' || ward_num,
                'Krishnapur Municipality - वडा ' || ward_num,
                'krishnapur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'krishnapur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mahakali Municipality (Kanchanpur): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mahakali-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mahakali Municipality - Ward ' || ward_num,
                'Mahakali Municipality - वडा ' || ward_num,
                'mahakali-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mahakali-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Punarbas Municipality (Kanchanpur): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'punarbas-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Punarbas Municipality - Ward ' || ward_num,
                'Punarbas Municipality - वडा ' || ward_num,
                'punarbas-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'punarbas-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Shuklaphanta Municipality (Kanchanpur): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'shuklaphanta-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Shuklaphanta Municipality - Ward ' || ward_num,
                'Shuklaphanta Municipality - वडा ' || ward_num,
                'shuklaphanta-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'shuklaphanta-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Beldandi Rural Municipality (Kanchanpur): 5 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'beldandi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..5 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Beldandi Rural Municipality - Ward ' || ward_num,
                'Beldandi Rural Municipality - वडा ' || ward_num,
                'beldandi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'beldandi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Laljhadi Rural Municipality (Kanchanpur): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'laljhadi-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Laljhadi Rural Municipality - Ward ' || ward_num,
                'Laljhadi Rural Municipality - वडा ' || ward_num,
                'laljhadi-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'laljhadi-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Dhangadhi Sub-Metropolitan City (Kailali): 19 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'dhangadhi-sub-metropolitan-city' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..19 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Dhangadhi Sub-Metropolitan City - Ward ' || ward_num,
                'Dhangadhi Sub-Metropolitan City - वडा ' || ward_num,
                'dhangadhi-sub-metropolitan-city-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'dhangadhi-sub-metropolitan-city-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bhajni Municipality (Kailali): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bhajni-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bhajni Municipality - Ward ' || ward_num,
                'Bhajni Municipality - वडा ' || ward_num,
                'bhajni-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bhajni-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Gauriganga Municipality (Kailali): 11 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'gauriganga-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..11 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Gauriganga Municipality - Ward ' || ward_num,
                'Gauriganga Municipality - वडा ' || ward_num,
                'gauriganga-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'gauriganga-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Ghodaghodi Municipality (Kailali): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'ghodaghodi-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Ghodaghodi Municipality - Ward ' || ward_num,
                'Ghodaghodi Municipality - वडा ' || ward_num,
                'ghodaghodi-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'ghodaghodi-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Godawari Municipality (Kailali): 12 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'godawari-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..12 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Godawari Municipality - Ward ' || ward_num,
                'Godawari Municipality - वडा ' || ward_num,
                'godawari-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'godawari-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Lamkichuha Municipality (Kailali): 10 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'lamkichuha-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..10 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Lamkichuha Municipality - Ward ' || ward_num,
                'Lamkichuha Municipality - वडा ' || ward_num,
                'lamkichuha-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'lamkichuha-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Tikapur Municipality (Kailali): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'tikapur-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Tikapur Municipality - Ward ' || ward_num,
                'Tikapur Municipality - वडा ' || ward_num,
                'tikapur-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'tikapur-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Bardagoriya Rural Municipality (Kailali): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'bardagoriya-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Bardagoriya Rural Municipality - Ward ' || ward_num,
                'Bardagoriya Rural Municipality - वडा ' || ward_num,
                'bardagoriya-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'bardagoriya-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Chure Rural Municipality (Kailali): 6 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'chure-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..6 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Chure Rural Municipality - Ward ' || ward_num,
                'Chure Rural Municipality - वडा ' || ward_num,
                'chure-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'chure-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Janaki Rural Municipality (Kailali): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'janaki-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Janaki Rural Municipality - Ward ' || ward_num,
                'Janaki Rural Municipality - वडा ' || ward_num,
                'janaki-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'janaki-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Joshipur Rural Municipality (Kailali): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'joshipur-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Joshipur Rural Municipality - Ward ' || ward_num,
                'Joshipur Rural Municipality - वडा ' || ward_num,
                'joshipur-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'joshipur-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Kailari Rural Municipality (Kailali): 9 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'kailari-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..9 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Kailari Rural Municipality - Ward ' || ward_num,
                'Kailari Rural Municipality - वडा ' || ward_num,
                'kailari-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'kailari-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

    -- Mohanyal Rural Municipality (Kailali): 7 wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = 'mohanyal-rural-municipality' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..7 LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                'Mohanyal Rural Municipality - Ward ' || ward_num,
                'Mohanyal Rural Municipality - वडा ' || ward_num,
                'mohanyal-rural-municipality-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                'mohanyal-rural-municipality-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;

END $$;

-- Summary: 753 municipalities, ~6743 total ward channels
