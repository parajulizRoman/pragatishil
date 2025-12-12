import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MembershipForm from "./MembershipForm";

export default async function SettingsMembershipPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login?next=/settings/membership");
    }

    // Fetch Official Member Record directly linked
    const { data: directMember } = await supabase
        .from("members")
        .select("*")
        .eq("auth_user_id", user.id)
        .single();

    let member = directMember;

    // If not found by ID, try finding by EMAIL (orphaned record case)
    if (!member && user.email) {
        console.log(`[Membership Settings] No direct link found. Searching for orphan record by email: ${user.email}`);

        // Use Admin client to bypass RLS (orphan records might not be visible to user yet)
        const { supabaseAdmin } = await import("@/lib/supabase/serverAdmin");

        const { data: orphanMember } = await supabaseAdmin
            .from("members")
            .select("*")
            .eq("email", user.email)
            .is("auth_user_id", null) // Only claim if currently unlinked
            .single();

        if (orphanMember) {
            console.log(`[Membership Settings] Found orphan member ${orphanMember.id}. Linking to user ${user.id}...`);

            // Link it!
            const { error: linkError } = await supabaseAdmin
                .from("members")
                .update({ auth_user_id: user.id })
                .eq("id", orphanMember.id);

            if (!linkError) {
                member = { ...orphanMember, auth_user_id: user.id };
            } else {
                console.error("Failed to link orphan member:", linkError);
            }
        }
    }

    if (!member) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
                <h2 className="text-xl font-bold text-slate-800 mb-2">No Membership Record Found</h2>
                <div className="max-w-md mx-auto text-slate-500 mb-6 space-y-2">
                    <p>We couldn&apos;t find an official membership application linked to <strong>{user.email}</strong>.</p>
                    <p className="text-sm bg-blue-50 p-3 rounded text-blue-800">
                        If you submitted the form with a <strong>different email</strong>, you may need to contact support to merge your accounts.
                    </p>
                </div>
                <a
                    href="/join"
                    className="inline-block bg-brand-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                    Submit New Application
                </a>
            </div>
        );
    }

    return (
        <MembershipForm member={member} />
    );
}
