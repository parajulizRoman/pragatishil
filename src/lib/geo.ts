import { supabaseAdmin } from "@/lib/supabase/serverAdmin";

// Database Types (matching the provided schema)
export interface GeoProvince {
    id: number;
    name_en: string;
    headquarter?: string;
    website?: string;
}

export interface GeoDistrict {
    id: number;
    province_id: number;
    name_en: string;
    headquarter?: string;
    website?: string;
}

export interface GeoLocalLevel {
    id: number;
    district_id: number;
    name_en: string;
    category_id?: number;
    category_label?: string;
    area_sq_km?: number;
    website?: string;
    num_wards?: number;
}

// Nested Types for API Response
export type NestedLocalLevel = GeoLocalLevel;

export interface NestedDistrict extends GeoDistrict {
    localLevels: NestedLocalLevel[];
}

export interface NestedProvince extends GeoProvince {
    districts: NestedDistrict[];
}

export interface GeoStructure {
    provinces: NestedProvince[];
}

/**
 * Fetches all provinces, districts, and local levels and nests them.
 * Uses supabaseAdmin to bypass RLS (if needed) and ensure server-side access.
 * Returns a tree structure suitable for cascading dropdowns.
 */
export async function getGeoStructure(): Promise<GeoStructure> {
    // 1. Fetch all data in parallel
    const [provincesRes, districtsRes, localLevelsRes] = await Promise.all([
        supabaseAdmin.from('geo_provinces').select('*').order('id'),
        supabaseAdmin.from('geo_districts').select('*').order('name_en'),
        supabaseAdmin.from('geo_local_levels').select('*').order('name_en')
    ]);

    if (provincesRes.error) throw new Error(`Error fetching provinces: ${provincesRes.error.message}`);
    if (districtsRes.error) throw new Error(`Error fetching districts: ${districtsRes.error.message}`);
    if (localLevelsRes.error) throw new Error(`Error fetching local levels: ${localLevelsRes.error.message}`);

    const provinces = provincesRes.data as GeoProvince[];
    const districts = districtsRes.data as GeoDistrict[];
    const localLevels = localLevelsRes.data as GeoLocalLevel[];

    // 2. Nest data
    // Create a map of districts for easier lookup or just filter (filter is fine for small datasets like ~77 districts)
    // Actually, mapping is faster.

    // Map district_id -> LocalLevels[]
    const localLevelsByDistrict = new Map<number, NestedLocalLevel[]>();
    for (const ll of localLevels) {
        if (!localLevelsByDistrict.has(ll.district_id)) {
            localLevelsByDistrict.set(ll.district_id, []);
        }
        localLevelsByDistrict.get(ll.district_id)?.push(ll);
    }

    // Map province_id -> NestedDistrict[]
    const districtsByProvince = new Map<number, NestedDistrict[]>();
    for (const dist of districts) {
        if (!districtsByProvince.has(dist.province_id)) {
            districtsByProvince.set(dist.province_id, []);
        }

        const nestedDist: NestedDistrict = {
            ...dist,
            localLevels: localLevelsByDistrict.get(dist.id) || []
        };
        districtsByProvince.get(dist.province_id)?.push(nestedDist);
    }

    // Build final structure
    const nestedProvinces: NestedProvince[] = provinces.map(p => ({
        ...p,
        districts: districtsByProvince.get(p.id) || []
    }));

    return {
        provinces: nestedProvinces
    };
}
