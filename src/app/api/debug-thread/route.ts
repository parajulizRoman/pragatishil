/* eslint-disable */
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "No ID provided" });

    // 1. Fetch with User Context (Normal)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 2. Fetch with Admin Context (Bypass RLS)
    const { data: adminThread, error: adminError } = await supabaseAdmin
        .from("discussion_threads")
        .select(`
            *,
            channel:discussion_channels!channel_id(*),
            author:profiles!created_by(full_name, role, avatar_url)
        `)
        .eq("id", id)
        .single();

    // 3. Admin: Check Profile directly
    let dbProfile = null;
    if (user) {
        const { data: prof } = await supabaseAdmin.from('profiles').select('*').eq('id', user.id).single();
        dbProfile = prof;
    }

    // 4. Analysis
    let rejectionReason = "Unknown";
    let channelVis = "N/A";

    if (adminThread) {
        if (!user) rejectionReason = "User not logged in";

        const ch = adminThread.channel;
        if (ch) {
            channelVis = ch.visibility;
            // Simulate logic
            const userRole = dbProfile?.role || 'guest';
            const isParty = ['party_member', 'team_member', 'central_committee', 'board', 'admin_party', 'yantrik', 'admin'].includes(userRole);
            const isLeadership = ['central_committee', 'board', 'admin_party', 'yantrik', 'admin'].includes(userRole);

            if (channelVis === 'party_only' && !isParty) rejectionReason = `Role '${userRole}' < 'party_only'`;
            if (channelVis === 'leadership' && !isLeadership) rejectionReason = `Role '${userRole}' < 'leadership'`;
            if (ch.visibility === 'public') rejectionReason = "None (Public)";
        } else {
            rejectionReason = "Orphaned Thread (No Channel)";
        }
    } else {
        rejectionReason = "Thread ID not found in DB";
    }

    return NextResponse.json({
        user: {
            id: user?.id,
            auth_role: user?.role, // supabase auth role (authenticated/anon)
            db_role: dbProfile?.role
        },
        thread: {
            id: adminThread?.id,
            channel_id: adminThread?.channel_id,
        },
        channel: adminThread?.channel,
        diagnosis: {
            verdict: adminThread && !rejectionReason.startsWith("Role") && !rejectionReason.startsWith("User") ? "Should be Visible" : "Access Denied",
            reason: rejectionReason,
            channel_visibility: channelVis
        }
    });
}
