"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    const full_name = formData.get("full_name") as string;
    const bio = formData.get("bio") as string;
    const location = formData.get("location") as string;
    const contact_email_public = formData.get("contact_email_public") as string;
    const contact_phone_public = formData.get("contact_phone_public") as string;
    const expertiseRaw = formData.get("expertise") as string;
    const avatar_url = formData.get("avatar_url") as string;
    // Checkbox returns "on" if checked, null otherwise. 
    // BUT we want explicit true/false.
    // If we use controlled component we can pass it as hidden input or just handle it.
    // Let's assume passed as string "true" or "false" from hidden field or just check for "on".
    const is_public = formData.get("is_public") === "true";

    const expertise = expertiseRaw ? expertiseRaw.split(",").map(s => s.trim()).filter(Boolean) : [];

    const updates = {
        full_name,
        bio,
        location,
        contact_email_public,
        contact_phone_public,
        expertise,
        is_public,
        updated_at: new Date().toISOString(),
    };

    // Only update avatar if provided
    if (avatar_url) {
        Object.assign(updates, { avatar_url });
    }

    const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

    if (error) {
        console.error("Profile update error:", error);
        throw new Error("Failed to update profile");
    }

    revalidatePath("/members");
    revalidatePath(`/members/${user.id}`);
    revalidatePath("/settings/profile");

    return { success: true };
}
