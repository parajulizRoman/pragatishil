/* eslint-disable */
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { DiscussionChannel } from "@/types";
import { canManageChannels } from "@/lib/permissions";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";
import { ROLE_LEVELS } from "@/lib/roleHierarchy";

interface UserProfile {
    role: string;
    province_id?: number | null;
    district_id?: number | null;
    local_level_id?: number | null;
    department?: string | null;
}

// Get geo names from IDs (for matching with channel location_value)
async function getGeoNames(profile: UserProfile): Promise<{
    provinceName?: string;
    districtName?: string;
    localLevelName?: string;
}> {
    const result: { provinceName?: string; districtName?: string; localLevelName?: string } = {};

    if (profile.province_id) {
        const { data } = await supabaseAdmin
            .from('geo_provinces')
            .select('name_en')
            .eq('id', profile.province_id)
            .single();
        if (data) result.provinceName = data.name_en;
    }

    if (profile.district_id) {
        const { data } = await supabaseAdmin
            .from('geo_districts')
            .select('name_en')
            .eq('id', profile.district_id)
            .single();
        if (data) result.districtName = data.name_en;
    }

    if (profile.local_level_id) {
        const { data } = await supabaseAdmin
            .from('geo_local_levels')
            .select('name_en')
            .eq('id', profile.local_level_id)
            .single();
        if (data) result.localLevelName = data.name_en;
    }

    return result;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const slug = searchParams.get("slug");

        const supabase = await createClient();

        // Get current user and full profile including location
        const { data: { user } } = await supabase.auth.getUser();
        let userProfile: UserProfile = { role: 'guest' };
        let userMemberships: string[] = [];
        let userDepartments: string[] = [];

        if (user) {
            // Get user profile with location info
            const { data: profile } = await supabase
                .from("profiles")
                .select("role, province_id, district_id, local_level_id, department")
                .eq("id", user.id)
                .single();

            if (profile) {
                userProfile = {
                    role: profile.role || 'member',
                    province_id: profile.province_id,
                    district_id: profile.district_id,
                    local_level_id: profile.local_level_id,
                    department: profile.department
                };
            }

            // Get user's private channel memberships
            const { data: memberships } = await supabase
                .from("channel_members")
                .select("channel_id")
                .eq("user_id", user.id);
            userMemberships = (memberships || []).map(m => m.channel_id);

            // Get user's departments (from member_departments table)
            const { data: deptData } = await supabase
                .from("member_departments")
                .select("department:department_id(slug)")
                .eq("member_id", user.id);
            // Also add profile.department if exists
            if (userProfile.department) userDepartments.push(userProfile.department);
            if (deptData) {
                deptData.forEach((d: unknown) => {
                    const dept = d as { department?: { slug?: string } };
                    if (dept.department?.slug) userDepartments.push(dept.department.slug);
                });
            }
        }

        const userLevel = ROLE_LEVELS[userProfile.role] || 0;

        // Get geo names for location matching
        const geoNames = user ? await getGeoNames(userProfile) : {};

        // Fetch all channels first, then filter
        let query = supabaseAdmin
            .from("discussion_channels")
            .select("*, parent_channel_id, location_type, location_value, resources:discussion_channel_resources(*)");

        if (id) query = query.eq("id", id);
        if (slug) query = query.eq("slug", slug);

        const { data: allChannels, error } = await query.order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching channels:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Filter channels by access
        const accessibleChannels = (allChannels || []).filter(channel => {
            // 1. Public channels: everyone can see
            if (channel.access_type === 'public' || channel.visibility === 'public') {
                return true;
            }

            // 2. Not logged in: only public
            if (!user) return false;

            // 3. Admin/Yantrik: can see everything
            if (userLevel >= ROLE_LEVELS['admin_panel']) {
                return true;
            }

            // 4. Members-only (logged_in): any authenticated user
            if (channel.access_type === 'members' || channel.visibility === 'logged_in') {
                return true;
            }

            // 5. Private channels: check explicit membership
            if (channel.access_type === 'private') {
                return userMemberships.includes(channel.id);
            }

            // 6. Role-based access: check role level
            if (channel.access_type === 'role_based') {
                const requiredLevel = channel.min_role_level || 0;
                if (userLevel >= requiredLevel) return true;
            }

            // 7. Geographic & Department channels - LOCATION-BASED FILTERING
            if (channel.location_type) {
                const locationValue = (channel.location_value || '').toLowerCase();

                // Central Committee channels: require central_committee+ role
                if (channel.location_type === 'central') {
                    return userLevel >= ROLE_LEVELS['central_committee'];
                }

                // State channels: user must be from that state OR have central+ role
                if (channel.location_type === 'state') {
                    if (userLevel >= ROLE_LEVELS['central_committee']) return true;
                    const userState = (geoNames.provinceName || '').toLowerCase();
                    return userState === locationValue || locationValue.includes(userState) || userState.includes(locationValue);
                }

                // District channels: user must be from that district OR have state+ role
                if (channel.location_type === 'district') {
                    if (userLevel >= ROLE_LEVELS['state_committee']) return true;
                    const userDistrict = (geoNames.districtName || '').toLowerCase();
                    return userDistrict === locationValue || locationValue.includes(userDistrict) || userDistrict.includes(locationValue);
                }

                // Municipality/Ward channels: user must be from that location OR have district+ role
                if (channel.location_type === 'municipality' || channel.location_type === 'ward') {
                    if (userLevel >= ROLE_LEVELS['district_committee']) return true;
                    const userLocal = (geoNames.localLevelName || '').toLowerCase();
                    return userLocal === locationValue || locationValue.includes(userLocal) || userLocal.includes(locationValue);
                }

                // Department channels: user must be in that department OR have central+ role
                if (channel.location_type === 'department') {
                    if (userLevel >= ROLE_LEVELS['central_committee']) return true;
                    return userDepartments.some(dept =>
                        dept.toLowerCase() === locationValue ||
                        locationValue.includes(dept.toLowerCase())
                    );
                }
            }

            // 8. Legacy visibility fallback for party_only, etc.
            if (['party_only', 'central_committee', 'board_only', 'leadership', 'internal'].includes(channel.visibility)) {
                // Leadership can see all internal channels
                if (userLevel >= ROLE_LEVELS['central_committee']) return true;
                // Party members can see party_only (without location restriction)
                if (channel.visibility === 'party_only') return userLevel >= ROLE_LEVELS['ward_committee'];
                return false;
            }

            // Default: allow if user is at least a party member
            return userLevel >= ROLE_LEVELS['ward_committee'];
        });

        return NextResponse.json({ channels: accessibleChannels as DiscussionChannel[] });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// Helper to check admin permission
async function checkAdminPermission(userId: string) {
    if (!userId) return false;
    const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

    return canManageChannels(profile?.role);
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // 1. Authenticate (Get User ID)
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Permission Check (Manual Role verify)
        const isAdmin = await checkAdminPermission(user.id);
        if (!isAdmin) {
            console.error(`[ChannelCreate] Forbidden. User: ${user.id}`);
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        // 3. Parse Body
        const body = await request.json();
        const {
            slug, name, description,
            visibility, allow_anonymous_posts,
            min_role_to_post, min_role_to_create_threads,
            docs_url, video_playlist_url, readme_content,
            category,
            resources // Array of { title, type, url }
        } = body;

        // 4. Validation
        if (!slug || !name) {
            return NextResponse.json({ error: "Missing name or slug" }, { status: 400 });
        }

        // 5. Insert Channel via Admin Client
        const { data: channelData, error } = await supabaseAdmin
            .from("discussion_channels")
            .insert({
                slug,
                name,
                description,
                visibility: visibility || 'public',
                allow_anonymous_posts: allow_anonymous_posts ?? false,
                min_role_to_post: min_role_to_post || 'member',
                min_role_to_create_threads: min_role_to_create_threads || 'member',
                min_role_to_comment: 'member',
                min_role_to_vote: 'member',
                docs_url,
                video_playlist_url,
                readme_content,
                impact_stats: body.impact_stats || {}, // Add Impact Stats
                category: category || 'General'
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating channel:", error);
            if (error.code === '23505') return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 6. Handle Resources Insert
        if (resources && Array.isArray(resources) && resources.length > 0) {
            const resourceInserts = resources.map((r: any) => ({
                channel_id: channelData.id,
                title: r.title,
                type: r.type,
                url: r.url,
                created_by: user.id
            }));

            const { error: resError } = await supabaseAdmin
                .from('discussion_channel_resources')
                .insert(resourceInserts);

            if (resError) console.error("Error adding resources:", resError);
        }

        return NextResponse.json({ channel: channelData as DiscussionChannel });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const supabase = await createClient();

        // 1. Authenticate
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Permission Check
        const isAdmin = await checkAdminPermission(user.id);
        if (!isAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 3. Parse Body
        const body = await request.json();
        const { id, resources, ...updates } = body;

        if (!id) return NextResponse.json({ error: "Missing Channel ID" }, { status: 400 });

        // 4. Update Channel
        const { data: channelData, error } = await supabaseAdmin
            .from("discussion_channels")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        // 5. Update Resources (Full Replace Strategy)
        if (resources && Array.isArray(resources)) {
            // Delete existing
            await supabaseAdmin
                .from('discussion_channel_resources')
                .delete()
                .eq('channel_id', id);

            // Insert new
            if (resources.length > 0) {
                const resourceInserts = resources.map((r: any) => ({
                    channel_id: id,
                    title: r.title,
                    type: r.type,
                    url: r.url,
                    created_by: user.id
                }));

                await supabaseAdmin
                    .from('discussion_channel_resources')
                    .insert(resourceInserts);
            }
        }

        return NextResponse.json({ channel: channelData as DiscussionChannel });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
