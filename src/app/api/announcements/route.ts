import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Roles that can send announcements
const ANNOUNCEMENT_ROLES = ['admin', 'yantrik', 'admin_party', 'board', 'central_committee'];

// All possible target roles for broadcasting
const ALL_ROLES = ['member', 'party_member', 'team_member', 'central_committee', 'board', 'admin_party', 'admin', 'yantrik'];

/**
 * Get announcements
 * GET /api/announcements
 * Query params: limit, offset
 */
export async function GET(request: NextRequest) {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    const userRole = profile?.role || 'member';

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const offset = parseInt(searchParams.get("offset") || "0");

    // Fetch announcements
    const { data: announcements, error, count } = await supabase
        .from("announcements")
        .select(`
            id,
            title,
            body,
            link,
            priority,
            target_roles,
            created_at,
            sender:profiles!announcements_sender_id_fkey (
                id,
                full_name,
                handle,
                avatar_url
            )
        `, { count: 'exact' })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error("Announcements fetch error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter by target_roles (null means all, or check if user's role is in target)
    const visibleAnnouncements = (announcements || []).filter(ann => {
        if (!ann.target_roles || ann.target_roles.length === 0) {
            return true; // Visible to all
        }
        return ann.target_roles.includes(userRole);
    });

    return NextResponse.json({
        announcements: visibleAnnouncements,
        total: count || 0
    });
}

/**
 * Create and broadcast announcement
 * POST /api/announcements
 * Body: { title, body, link?, priority?, target_roles? }
 */
export async function POST(request: NextRequest) {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check role permission
    const { data: senderProfile } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single();

    if (!senderProfile?.role || !ANNOUNCEMENT_ROLES.includes(senderProfile.role)) {
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const { title, body, link, priority = 'normal', target_roles } = await request.json();

    if (!title?.trim() || !body?.trim()) {
        return NextResponse.json({ error: "Title and body required" }, { status: 400 });
    }

    // Create announcement
    const { data: announcement, error: annError } = await supabase
        .from("announcements")
        .insert({
            title: title.trim(),
            body: body.trim(),
            link: link?.trim() || null,
            priority,
            target_roles: target_roles?.length > 0 ? target_roles : null,
            sender_id: user.id
        })
        .select()
        .single();

    if (annError) {
        console.error("Create announcement error:", annError);
        return NextResponse.json({ error: annError.message }, { status: 500 });
    }

    // Get target users
    let targetQuery = supabase
        .from("profiles")
        .select("id")
        .neq("id", user.id); // Exclude sender

    if (target_roles && target_roles.length > 0) {
        targetQuery = targetQuery.in("role", target_roles);
    } else {
        // All members
        targetQuery = targetQuery.in("role", ALL_ROLES);
    }

    const { data: targetUsers } = await targetQuery;

    // Create notifications for all targets
    if (targetUsers && targetUsers.length > 0) {
        const notifications = targetUsers.map(u => ({
            user_id: u.id,
            type: 'announcement',
            title: `📢 ${title}`,
            body: body.length > 100 ? body.slice(0, 100) + '...' : body,
            link: link || '/announcements',
            is_read: false,
            actor_id: user.id
        }));

        // Insert in batches of 500
        for (let i = 0; i < notifications.length; i += 500) {
            const batch = notifications.slice(i, i + 500);
            await supabase.from("notifications").insert(batch);
        }
    }

    return NextResponse.json({
        announcement,
        notified: targetUsers?.length || 0
    });
}
