export const dynamic = 'force-dynamic'; // Always fresh data

import { supabaseAdmin } from "@/lib/supabase/serverAdmin";
import React from "react";
import InteractiveMemberGrid from "@/components/InteractiveMemberGrid";
import { Profile } from "@/types";

export default async function MembersGalleryPage() {
    // Fetch public profiles with new RBAC fields
    const { data: members, error } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("is_public", true);

    if (error) {
        console.error("Error fetching members:", error);
        return <div className="p-10 text-center text-red-500">Failed to load members gallery. (Error: {error.message})</div>;
    }

    // Cast or map if needed, but select * should match Profile interface if DB is synced
    // We might need to ensure `expertise` is array in DB, or handle it
    const safeMembers = (members || []).map(m => ({
        ...m,
        // Ensure defaults if missing and cast to Profile
        role: m.role || 'supporter',
    })) as Profile[];

    return <InteractiveMemberGrid members={safeMembers} />;
}
