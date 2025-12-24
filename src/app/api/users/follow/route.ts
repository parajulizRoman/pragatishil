import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Follow/Unfollow a user
 * POST /api/users/follow
 * Body: { userId: string, action: 'follow' | 'unfollow' }
 */
export async function POST(request: NextRequest) {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, action } = await request.json();

    if (!userId || !action) {
        return NextResponse.json({ error: "userId and action required" }, { status: 400 });
    }

    if (userId === user.id) {
        return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    if (action === 'follow') {
        // Add follow
        const { error } = await supabase
            .from("user_follows")
            .insert({ follower_id: user.id, following_id: userId });

        if (error) {
            if (error.code === '23505') { // Unique violation - already following
                return NextResponse.json({ success: true, following: true });
            }
            console.error("Follow error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Create notification for the followed user
        const { data: followerProfile } = await supabase
            .from("profiles")
            .select("full_name, handle")
            .eq("id", user.id)
            .single();

        await supabase.from("notifications").insert({
            user_id: userId,
            type: 'follow',
            title: `${followerProfile?.full_name || 'Someone'} started following you`,
            body: followerProfile?.handle ? `@${followerProfile.handle}` : null,
            link: `/members/${user.id}`,
            actor_id: user.id
        });

        return NextResponse.json({ success: true, following: true });

    } else if (action === 'unfollow') {
        // Remove follow
        const { error } = await supabase
            .from("user_follows")
            .delete()
            .eq("follower_id", user.id)
            .eq("following_id", userId);

        if (error) {
            console.error("Unfollow error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, following: false });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

/**
 * Check if current user follows a specific user
 * GET /api/users/follow?userId=xxx
 */
export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ following: false, followerCount: 0, followingCount: 0 });
    }

    // Check if following
    const { data: followData } = await supabase
        .from("user_follows")
        .select("id")
        .eq("follower_id", user.id)
        .eq("following_id", userId)
        .maybeSingle();

    // Get follower count
    const { count: followerCount } = await supabase
        .from("user_follows")
        .select("*", { count: 'exact', head: true })
        .eq("following_id", userId);

    // Get following count
    const { count: followingCount } = await supabase
        .from("user_follows")
        .select("*", { count: 'exact', head: true })
        .eq("follower_id", userId);

    return NextResponse.json({
        following: !!followData,
        followerCount: followerCount || 0,
        followingCount: followingCount || 0
    });
}
