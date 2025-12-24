/* eslint-disable */
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { DiscussionChannel } from "@/types";
import { canManageChannels } from "@/lib/permissions";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";
import { ROLE_LEVELS } from "@/lib/roleHierarchy";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const slug = searchParams.get("slug");

        const supabase = await createClient();

        // Get current user and role
        const { data: { user } } = await supabase.auth.getUser();
        let userRole = 'guest';
        let userMemberships: string[] = [];

        if (user) {
            // Get user profile
            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();
            userRole = profile?.role || 'guest';

            // Get user's private channel memberships
            const { data: memberships } = await supabase
                .from("channel_members")
                .select("channel_id")
                .eq("user_id", user.id);
            userMemberships = (memberships || []).map(m => m.channel_id);
        }

        const userLevel = ROLE_LEVELS[userRole] || 0;

        // Fetch all channels first, then filter
        let query = supabase
            .from("discussion_channels")
            .select("*, resources:discussion_channel_resources(*)");

        if (id) query = query.eq("id", id);
        if (slug) query = query.eq("slug", slug);

        const { data: allChannels, error } = await query.order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching channels:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Filter channels by access
        const accessibleChannels = (allChannels || []).filter(channel => {
            // Public: everyone
            if (channel.access_type === 'public' || channel.visibility === 'public') {
                return true;
            }

            // Not logged in: only public
            if (!user) return false;

            // Members: any logged-in user
            if (channel.access_type === 'members') {
                return true;
            }

            // Role-based: check level
            if (channel.access_type === 'role_based') {
                return userLevel >= (channel.min_role_level || 0);
            }

            // Private: check membership
            if (channel.access_type === 'private') {
                return userMemberships.includes(channel.id);
            }

            // Legacy visibility fallback
            if (channel.visibility === 'logged_in' || channel.visibility === 'members') {
                return !!user;
            }
            if (['party_only', 'central_committee', 'board_only', 'leadership', 'internal'].includes(channel.visibility)) {
                return userLevel >= 2; // ward_committee+
            }

            return true;
        });

        return NextResponse.json({ channels: accessibleChannels as DiscussionChannel[] });
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
