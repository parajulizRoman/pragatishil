"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { validateHandle } from "@/lib/handle";

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    // Basic fields
    const full_name = formData.get("full_name") as string;
    const bio = formData.get("bio") as string;
    const location = formData.get("location") as string;
    const contact_email_public = formData.get("contact_email_public") as string;
    const contact_phone_public = formData.get("contact_phone_public") as string;
    const expertiseRaw = formData.get("expertise") as string;
    const avatar_url = formData.get("avatar_url") as string;
    const is_public = formData.get("is_public") === "true";

    // New fields - Handle
    const handle = formData.get("handle") as string;

    // New fields - Privacy toggles
    const show_contact_email = formData.get("show_contact_email") === "true";
    const show_contact_phone = formData.get("show_contact_phone") === "true";

    // New fields - Profession
    const profession = formData.get("profession") as string;
    const organization = formData.get("organization") as string;
    const position_title = formData.get("position_title") as string;

    // New fields - Social links
    const linkedin_url = formData.get("linkedin_url") as string;
    const website_url = formData.get("website_url") as string;

    // Validate handle if provided
    if (handle) {
        const validation = validateHandle(handle);
        if (!validation.valid) {
            throw new Error(validation.error || "Invalid handle");
        }

        // Check if handle is taken by someone else
        const { data: existing } = await supabase
            .from("profiles")
            .select("id")
            .eq("handle_lower", handle.toLowerCase())
            .neq("id", user.id)
            .maybeSingle();

        if (existing) {
            throw new Error("This handle is already taken");
        }
    }

    const expertise = expertiseRaw ? expertiseRaw.split(",").map(s => s.trim()).filter(Boolean) : [];

    // Build updates object
    const updates: Record<string, unknown> = {
        full_name,
        bio,
        location,
        contact_email_public: contact_email_public || null,
        contact_phone_public: contact_phone_public || null,
        expertise,
        is_public,
        // New fields
        handle: handle || null,
        show_contact_email,
        show_contact_phone,
        profession: profession || null,
        organization: organization || null,
        position_title: position_title || null,
        linkedin_url: linkedin_url || null,
        website_url: website_url || null,
        updated_at: new Date().toISOString(),
    };

    // Only update avatar if provided
    if (avatar_url) {
        updates.avatar_url = avatar_url;
    }

    const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

    if (error) {
        console.error("Profile update error:", error);
        throw new Error("Failed to update profile: " + error.message);
    }

    // Revalidate all relevant paths
    revalidatePath("/members");
    revalidatePath(`/members/${user.id}`);
    if (handle) {
        revalidatePath(`/members/@${handle}`);
    }
    revalidatePath("/settings/profile");

    return { success: true };
}
