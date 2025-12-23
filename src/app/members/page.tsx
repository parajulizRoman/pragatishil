export const dynamic = 'force-dynamic'; // Always fresh data

import { supabaseAdmin } from "@/lib/supabase/serverAdmin";
import MembersClient from "./MembersClient";
import { Profile } from "@/types";
import { Suspense } from "react";
import { MembersLoading } from "./MembersClient";

export default async function MembersGalleryPage() {
    // Fetch all relevant members with new fields
    // Include leadership (for leadership tab) + public profiles (for community tab)
    // Note: admin and yantrik are invisible (technical staff) - not included
    const { data: members, error } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .or("is_public.eq.true,role.in.(admin_party,board,central_committee)");

    if (error) {
        console.error("Error fetching members:", error);
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-10">
                    <h1 className="text-2xl font-bold text-red-500 mb-2">Failed to load members</h1>
                    <p className="text-slate-500">{error.message}</p>
                </div>
            </div>
        );
    }

    // Ensure defaults for any missing fields
    const safeMembers = (members || []).map(m => ({
        ...m,
        role: m.role || 'supporter',
        is_public: m.is_public ?? false,
        expertise: m.expertise || [],
        skills: m.skills || [],
    })) as Profile[];

    return (
        <Suspense fallback={<MembersLoading />}>
            <MembersClient members={safeMembers} />
        </Suspense>
    );
}
