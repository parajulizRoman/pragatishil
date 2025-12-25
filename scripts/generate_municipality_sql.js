#!/usr/bin/env node
/**
 * Generate SQL to seed municipalities from nepal_local_levels_master.csv
 * Run: node scripts/generate_municipality_sql.js > supabase/migrations/20811230_seed_municipalities.sql
 */

const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'data', 'nepal_local_levels_master.csv');
const data = fs.readFileSync(csvPath, 'utf-8');
const lines = data.split('\n').slice(1); // Skip header

// Group municipalities by district
const districtMunicipalities = {};

lines.forEach(line => {
    if (!line.trim()) return;
    const cols = line.split(',');
    const districtName = cols[5]; // district_name_en
    const municipalityName = cols[9]; // local_level_name_en

    if (!districtName || !municipalityName) return;

    const districtSlug = districtName.toLowerCase().replace(/ /g, '-');

    if (!districtMunicipalities[districtSlug]) {
        districtMunicipalities[districtSlug] = {
            name: districtName,
            municipalities: new Set()
        };
    }
    districtMunicipalities[districtSlug].municipalities.add(municipalityName);
});

// Generate SQL
console.log('-- Municipalities Seeding (754 municipalities)');
console.log('-- Auto-generated from nepal_local_levels_master.csv');
console.log('-- Run after 20811229_seed_districts_rls.sql');
console.log('');
console.log('-- =============================================');
console.log('-- MUNICIPALITIES');
console.log('-- =============================================');
console.log('');

Object.entries(districtMunicipalities).forEach(([districtSlug, info]) => {
    const municipalities = Array.from(info.municipalities);

    console.log(`-- ${info.name} District (${municipalities.length} municipalities)`);
    console.log(`INSERT INTO discussion_channels (name, slug, description, visibility, access_type, location_type, location_value, can_create_subchannels, min_role_to_create_threads, parent_channel_id)`);
    console.log(`SELECT`);
    console.log(`    muni_data.name_en,`);
    console.log(`    LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),`);
    console.log(`    'Local-level discussions for ' || muni_data.name_en,`);
    console.log(`    'party_only', 'role_based',`);
    console.log(`    'municipality', LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g')),`);
    console.log(`    true, 'party_member',`);
    console.log(`    (SELECT id FROM discussion_channels WHERE location_type = 'district' AND location_value = '${districtSlug}' LIMIT 1)`);
    console.log(`FROM (VALUES`);

    const values = municipalities.map((m, i) => {
        const isLast = i === municipalities.length - 1;
        return `    ('${m.replace(/'/g, "''")}')${isLast ? '' : ','}`;
    });
    console.log(values.join('\n'));

    console.log(`) AS muni_data(name_en)`);
    console.log(`WHERE NOT EXISTS (`);
    console.log(`    SELECT 1 FROM discussion_channels WHERE location_type = 'municipality' AND location_value = LOWER(REGEXP_REPLACE(muni_data.name_en, '[^a-zA-Z0-9]', '-', 'g'))`);
    console.log(`);`);
    console.log('');
});

console.log('-- End of municipalities seeding');
