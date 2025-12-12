
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import { Profile } from "@/types";

export const dynamic = "force-dynamic";

export default async function SettingsProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login?next=/settings/profile");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile) {
        // Attempt Self-Repair
        const { supabaseAdmin } = await import("@/lib/supabase/serverAdmin");
        const meta = user.user_metadata;
        const fullName = meta.full_name || meta.name || 'Anonymous';
        const avatarUrl = meta.avatar_url || meta.picture;

        console.log(`[Profile Settings] Repairing profile for ${user.id}`);

        const { data: newProfile, error } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: user.id,
                full_name: fullName,
                avatar_url: avatarUrl,
                role: 'supporter',
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error || !newProfile) {
            return <div>Error loading profile: {error?.message || 'Unknown error'}. Please contact support.</div>;
        }

        return (
            <ProfileForm profile={newProfile as Profile} />
        );
    }

    // Also check if existing profile has "Anonymous" but Auth has real name (Mismatch repair)
    if ((profile.full_name === 'Anonymous' || !profile.full_name) && (user.user_metadata.full_name || user.user_metadata.name)) {
        const { supabaseAdmin } = await import("@/lib/supabase/serverAdmin");
        const meta = user.user_metadata;
        const realName = meta.full_name || meta.name;

        await supabaseAdmin
            .from('profiles')
            .update({ full_name: realName, avatar_url: meta.avatar_url || meta.picture || profile.avatar_url })
            .eq('id', user.id);

        // Update local var for rendering
        profile.full_name = realName;
        if (!profile.avatar_url) profile.avatar_url = meta.avatar_url || meta.picture;
    }

    return (
        <ProfileForm profile={profile as Profile} />
    );
}
