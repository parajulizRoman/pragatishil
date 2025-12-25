-- Migration: Add hierarchical geographic channel structure
-- Enables: Ward → Municipality → District → State → Central nesting
-- Auto-assigns users to their geographic channel hierarchy

-- 1. Add hierarchy columns to discussion_channels
ALTER TABLE discussion_channels
ADD COLUMN IF NOT EXISTS parent_channel_id UUID REFERENCES discussion_channels(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS location_type TEXT CHECK (location_type IN ('central', 'state', 'district', 'municipality', 'ward', 'department', NULL)),
ADD COLUMN IF NOT EXISTS location_value TEXT,
ADD COLUMN IF NOT EXISTS can_create_subchannels BOOLEAN DEFAULT false;

-- 2. Add location text columns to profiles (for channel assignment)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS geo_state TEXT,
ADD COLUMN IF NOT EXISTS geo_district TEXT,
ADD COLUMN IF NOT EXISTS geo_municipality TEXT,
ADD COLUMN IF NOT EXISTS geo_ward TEXT;

-- 3. Create indexes for hierarchy queries
CREATE INDEX IF NOT EXISTS idx_channels_parent ON discussion_channels(parent_channel_id);
CREATE INDEX IF NOT EXISTS idx_channels_location ON discussion_channels(location_type, location_value);
CREATE INDEX IF NOT EXISTS idx_profiles_geo ON profiles(geo_state, geo_district, geo_municipality);

-- 4. Function to auto-assign user to geographic channels based on their profile location
CREATE OR REPLACE FUNCTION assign_user_to_geographic_channels()
RETURNS TRIGGER AS $$
DECLARE
    v_channel RECORD;
BEGIN
    -- Only proceed if location fields are set
    IF NEW.geo_state IS NULL AND NEW.geo_district IS NULL AND NEW.geo_municipality IS NULL AND NEW.geo_ward IS NULL THEN
        RETURN NEW;
    END IF;

    -- Find and assign to all matching geographic channels
    FOR v_channel IN 
        SELECT id FROM discussion_channels
        WHERE 
            -- Central committee (all members with any location)
            (location_type = 'central')
            -- State channels
            OR (location_type = 'state' AND NEW.geo_state IS NOT NULL AND location_value = NEW.geo_state)
            -- District channels  
            OR (location_type = 'district' AND NEW.geo_district IS NOT NULL AND location_value = NEW.geo_district)
            -- Municipality channels
            OR (location_type = 'municipality' AND NEW.geo_municipality IS NOT NULL AND location_value = NEW.geo_municipality)
            -- Ward channels (match ward + parent municipality)
            OR (location_type = 'ward' AND NEW.geo_ward IS NOT NULL AND location_value = NEW.geo_ward
                AND parent_channel_id IN (
                    SELECT id FROM discussion_channels 
                    WHERE location_type = 'municipality' AND location_value = NEW.geo_municipality
                ))
    LOOP
        INSERT INTO channel_members (channel_id, user_id, role, joined_at)
        VALUES (v_channel.id, NEW.id, 'member', NOW())
        ON CONFLICT (channel_id, user_id) DO NOTHING;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create trigger on profiles for location changes
DROP TRIGGER IF EXISTS trg_assign_geographic_channels ON profiles;
CREATE TRIGGER trg_assign_geographic_channels
AFTER INSERT OR UPDATE OF geo_state, geo_district, geo_municipality, geo_ward ON profiles
FOR EACH ROW 
EXECUTE FUNCTION assign_user_to_geographic_channels();

-- 6. Function to check if user can create sub-channels
CREATE OR REPLACE FUNCTION can_create_subchannel(
    p_user_id UUID,
    p_parent_channel_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_parent RECORD;
    v_user RECORD;
BEGIN
    -- Get parent channel info
    SELECT * INTO v_parent FROM discussion_channels WHERE id = p_parent_channel_id;
    IF NOT FOUND THEN RETURN FALSE; END IF;
    
    -- Check if parent allows sub-channel creation
    IF NOT v_parent.can_create_subchannels THEN RETURN FALSE; END IF;
    
    -- Get user's profile
    SELECT * INTO v_user FROM profiles WHERE id = p_user_id;
    IF NOT FOUND THEN RETURN FALSE; END IF;
    
    -- Check user's location matches the channel's location
    CASE v_parent.location_type
        WHEN 'central' THEN
            -- Only admin can create under central
            RETURN v_user.role IN ('admin', 'yantrik');
        WHEN 'state' THEN
            -- State members can create
            RETURN v_user.state = v_parent.location_value;
        WHEN 'district' THEN
            -- District members can create
            RETURN v_user.district = v_parent.location_value;
        WHEN 'municipality' THEN
            -- Municipality members can create
            RETURN v_user.municipality = v_parent.location_value;
        WHEN 'ward' THEN
            -- Ward members can create (if the ward's municipality matches)
            RETURN v_user.ward = v_parent.location_value 
                AND v_user.municipality = (
                    SELECT location_value FROM discussion_channels 
                    WHERE id = v_parent.parent_channel_id
                );
        ELSE
            RETURN FALSE;
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Seed Central Committee channel (if not exists)
INSERT INTO discussion_channels (
    name, slug, description, visibility, access_type, 
    location_type, location_value, can_create_subchannels,
    min_role_to_create_threads
)
SELECT 
    'केन्द्रीय समिति', 'central-committee', 
    'Central Committee discussions - all party members', 
    'party_only', 'members',
    'central', 'central', true,
    'party_member'
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'central'
);

-- 8. Seed State channels (7 provinces)
INSERT INTO discussion_channels (
    name, slug, description, visibility, access_type,
    location_type, location_value, can_create_subchannels,
    min_role_to_create_threads, parent_channel_id
)
SELECT 
    state_data.name_ne, 
    state_data.slug,
    'State-level discussions for ' || state_data.name_en,
    'party_only', 'role_based',
    'state', state_data.slug, true,
    'party_member',
    (SELECT id FROM discussion_channels WHERE location_type = 'central' LIMIT 1)
FROM (VALUES
    ('Koshi', 'कोशी प्रदेश', 'koshi'),
    ('Madhesh', 'मधेश प्रदेश', 'madhesh'),
    ('Bagmati', 'बागमती प्रदेश', 'bagmati'),
    ('Gandaki', 'गण्डकी प्रदेश', 'gandaki'),
    ('Lumbini', 'लुम्बिनी प्रदेश', 'lumbini'),
    ('Karnali', 'कर्णाली प्रदेश', 'karnali'),
    ('Sudurpashchim', 'सुदूरपश्चिम प्रदेश', 'sudurpashchim')
) AS state_data(name_en, name_ne, slug)
WHERE NOT EXISTS (
    SELECT 1 FROM discussion_channels WHERE location_type = 'state' AND location_value = state_data.slug
);

-- 9. RLS policy for channel creation
DROP POLICY IF EXISTS "Users can create subchannels where allowed" ON discussion_channels;
CREATE POLICY "Users can create subchannels where allowed"
ON discussion_channels
FOR INSERT
TO authenticated
WITH CHECK (
    parent_channel_id IS NULL -- Admin-created root channels
    OR can_create_subchannel(auth.uid(), parent_channel_id)
);

COMMENT ON COLUMN discussion_channels.parent_channel_id IS 'Parent channel for hierarchical nesting (ward->municipality->district->state->central)';
COMMENT ON COLUMN discussion_channels.location_type IS 'Geographic level: central, state, district, municipality, ward, department';
COMMENT ON COLUMN discussion_channels.location_value IS 'Specific location identifier (e.g., state slug, district name)';
COMMENT ON COLUMN discussion_channels.can_create_subchannels IS 'Whether members can create sub-channels under this channel';
