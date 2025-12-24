import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Get notifications for current user
 * GET /api/notifications?limit=20&offset=0&unread=false
 */
export async function GET(request: NextRequest) {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const offset = parseInt(searchParams.get("offset") || "0");
    const unreadOnly = searchParams.get("unread") === "true";

    let query = supabase
        .from("notifications")
        .select(`
            id,
            type,
            title,
            body,
            link,
            is_read,
            created_at,
            actor:profiles!notifications_actor_id_fkey (
                id,
                full_name,
                handle,
                avatar_url
            )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

    if (unreadOnly) {
        query = query.eq("is_read", false);
    }

    const { data: notifications, error } = await query;

    if (error) {
        console.error("Notifications fetch error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get unread count
    const { count } = await supabase
        .from("notifications")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

    return NextResponse.json({
        notifications: notifications || [],
        unreadCount: count || 0
    });
}

/**
 * Mark notifications as read
 * POST /api/notifications
 * Body: { ids: string[] } or { all: true }
 */
export async function POST(request: NextRequest) {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (body.all === true) {
        // Mark all as read
        const { error } = await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("user_id", user.id)
            .eq("is_read", false);

        if (error) {
            console.error("Mark all read error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, markedAll: true });
    }

    if (body.ids && Array.isArray(body.ids)) {
        // Mark specific notifications as read
        const { error } = await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("user_id", user.id)
            .in("id", body.ids);

        if (error) {
            console.error("Mark read error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, marked: body.ids.length });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
