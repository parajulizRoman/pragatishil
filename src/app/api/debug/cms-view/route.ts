import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();

    // 1. Check Auth User
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({
            status: "Error",
            message: "Not authenticated",
            authError
        }, { status: 401 });
    }

    // 2. Check Profile Role
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // 3. Test News Visibility
    const { data: newsItems, error: newsError } = await supabase
        .from('news_items')
        .select('id, title, status, created_at')
        .limit(10);

    // 4. Test RLS Policy Check (Simulated)
    // We check if we can see a known item? No, just count is enough.

    return NextResponse.json({
        currentUser: {
            id: user.id,
            email: user.email,
        },
        profile: profile || "Profile Not Found",
        profileError: profileError ? profileError.message : null,

        permissionsCheck: {
            role: profile?.role,
            canSeeNews: newsItems ? newsItems.length > 0 : false,
            newsCountVisible: newsItems?.length || 0,
            newsError: newsError ? newsError.message : null,
            firstItem: newsItems?.[0] || null
        },

        instructions: "If 'newsCountVisible' is 0 but you know data exists, RLS is blocking you. If 'role' is not 'admin'/'yantrik'/'admin_party', that is why."
    });
}
