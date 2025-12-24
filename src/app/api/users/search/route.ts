import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Search users by handle or name for @mention autocomplete
 * GET /api/users/search?q=rom&limit=8
 */
export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q")?.toLowerCase() || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "8"), 20);

    if (query.length < 1) {
        return NextResponse.json({ users: [] });
    }

    // Search by handle or full_name
    // Handle takes priority, then name
    const { data: users, error } = await supabase
        .from("profiles")
        .select("id, handle, full_name, avatar_url, role")
        .or(`handle.ilike.%${query}%,full_name.ilike.%${query}%`)
        .not("handle", "is", null) // Only users with handles can be mentioned
        .order("handle", { ascending: true })
        .limit(limit);

    if (error) {
        console.error("User search error:", error);
        return NextResponse.json({ users: [], error: error.message }, { status: 500 });
    }

    // Sort results: exact handle match first, then handle starts with, then name matches
    const sorted = (users || []).sort((a, b) => {
        const aHandle = a.handle?.toLowerCase() || "";
        const bHandle = b.handle?.toLowerCase() || "";
        const aName = a.full_name?.toLowerCase() || "";
        const bName = b.full_name?.toLowerCase() || "";

        // Exact handle match first
        if (aHandle === query) return -1;
        if (bHandle === query) return 1;

        // Handle starts with query
        if (aHandle.startsWith(query) && !bHandle.startsWith(query)) return -1;
        if (bHandle.startsWith(query) && !aHandle.startsWith(query)) return 1;

        // Name starts with query
        if (aName.startsWith(query) && !bName.startsWith(query)) return -1;
        if (bName.startsWith(query) && !aName.startsWith(query)) return 1;

        return 0;
    });

    return NextResponse.json({
        users: sorted.map(u => ({
            id: u.id,
            handle: u.handle,
            name: u.full_name,
            avatar: u.avatar_url,
            role: u.role
        }))
    });
}
