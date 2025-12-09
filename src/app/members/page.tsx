import { supabaseAdmin } from "@/lib/supabase/serverAdmin";
import React from "react";
import InteractiveMemberGrid from "@/components/InteractiveMemberGrid";

export const dynamic = 'force-dynamic'; // Always fresh data

export default async function MembersGalleryPage() {
    const { data: members, error } = await supabaseAdmin
        .from("members")
        .select("id, full_name_ne, full_name_en, photo_url")
        .in("status", ["approved"])
        .eq("confidentiality", "public_ok");

    if (error) {
        console.error("Error fetching members:", error);
        return <div className="p-10 text-center text-red-500">Failed to load members gallery.</div>;
    }

    const safeMembers = members || [];

    return <InteractiveMemberGrid members={safeMembers} />;
}
