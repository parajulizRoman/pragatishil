import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";
/* eslint-disable */
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Get User Details
        let userRole = "anon";
        let userProfile = null;
        if (user) {
            const { data: profile } = await supabaseAdmin.from("profiles").select("*").eq("id", user.id).single();
            userProfile = profile;
            userRole = profile?.role || "no_role";
        }

        // 2. Fetch ALL Channels (Bypass RLS)
        const { data: allChannels, error: adminError } = await supabaseAdmin
            .from("discussion_channels")
            .select("*");

        // 3. Fetch Visible Channels (With RLS)
        const { data: visibleChannels, error: userError } = await supabase
            .from("discussion_channels")
            .select("*");

        // 4. Diagnose
        const diagnosis = allChannels?.map(ch => {
            const isVisible = visibleChannels?.some(v => v.id === ch.id);
            return {
                name: ch.name,
                slug: ch.slug,
                visibility: ch.visibility,
                isVisible: !!isVisible,
                reason: isVisible ? "OK" : `Hidden by RLS. User Role: ${userRole}, Channel Vis: ${ch.visibility}`
            };
        });

        return NextResponse.json({
            user: {
                id: user?.id,
                role: userRole,
                full_profile: userProfile
            },
            summary: {
                total_channels: allChannels?.length,
                visible_channels: visibleChannels?.length
            },
            diagnosis,
            errors: {
                admin: adminError,
                user: userError
            }
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
