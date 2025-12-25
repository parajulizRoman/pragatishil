// Generate SQL for ward-level channels under each municipality
const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../data/nepal_local_levels_master.csv');
const outputPath = path.join(__dirname, '../supabase/migrations/20811236_seed_wards.sql');

const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.trim().split('\n');
const headers = lines[0].split(',');

// Find column indices
const localLevelNameIdx = headers.indexOf('local_level_name_en');
const numWardsIdx = headers.indexOf('num_wards');
const localLevelIdIdx = headers.indexOf('local_level_id');
const districtNameIdx = headers.indexOf('district_name_en');

let sql = `-- Ward-level channels under each municipality
-- Generated from nepal_local_levels_master.csv

DO $$
DECLARE
    municipality_id UUID;
    ward_num INT;
BEGIN
`;

let totalWards = 0;
const municipalities = [];

for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const localLevelName = cols[localLevelNameIdx];
    const numWards = parseInt(cols[numWardsIdx], 10);
    const districtName = cols[districtNameIdx];

    if (!localLevelName || isNaN(numWards)) continue;

    // Create slug from municipality name
    const municipalitySlug = localLevelName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');

    municipalities.push({
        name: localLevelName,
        slug: municipalitySlug,
        numWards: numWards,
        district: districtName
    });

    totalWards += numWards;
}

// Generate the ward inserts
municipalities.forEach((mun, idx) => {
    sql += `
    -- ${mun.name} (${mun.district}): ${mun.numWards} wards
    SELECT id INTO municipality_id FROM discussion_channels WHERE slug = '${mun.slug}' LIMIT 1;
    IF municipality_id IS NOT NULL THEN
        FOR ward_num IN 1..${mun.numWards} LOOP
            INSERT INTO discussion_channels (name, name_ne, slug, visibility, category, location_type, location_value, parent_channel_id, can_create_subchannels, allow_anonymous_posts, min_role_to_post, min_role_to_create_threads, min_role_to_comment, min_role_to_vote)
            VALUES (
                '${mun.name} - Ward ' || ward_num,
                '${mun.name} - वडा ' || ward_num,
                '${mun.slug}-ward-' || ward_num,
                'party_only',
                'Council',
                'ward',
                '${mun.slug}-ward-' || ward_num,
                municipality_id,
                false,
                false,
                'party_member',
                'party_member',
                'party_member',
                'party_member'
            )
            ON CONFLICT (slug) DO NOTHING;
        END LOOP;
    END IF;
`;
});

sql += `
END $$;

-- Summary: ${municipalities.length} municipalities, ~${totalWards} total ward channels
`;

fs.writeFileSync(outputPath, sql);
console.log(`Generated SQL for ${municipalities.length} municipalities with ~${totalWards} total ward channels`);
console.log(`Output: ${outputPath}`);
