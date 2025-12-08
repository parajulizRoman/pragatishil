"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// --- Site Settings ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateSiteSettings(key: string, content: any) {
    const supabase = await createClient();

    // Check auth (middleware should handle this but double check)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('site_settings')
        .upsert({
            key,
            content,
            updated_at: new Date().toISOString(),
            updated_by: user.id
        });

    if (error) throw new Error(error.message);

    revalidatePath("/", "layout"); // Revalidate everything
    return { success: true };
}

// --- News Items ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function upsertNewsItem(item: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('news_items')
        .upsert({ ...item, updated_by: user.id });

    if (error) throw new Error(error.message);
    revalidatePath("/news");
    revalidatePath("/"); // Home page news
    return { success: true };
}

export async function deleteNewsItem(id: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('news_items')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath("/news");
    revalidatePath("/");
    return { success: true };
}

// --- Media Gallery ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function upsertMediaItem(item: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('media_gallery')
        .upsert({ ...item, updated_by: user.id });

    if (error) throw new Error(error.message);
    revalidatePath("/media");
    revalidatePath("/"); // If gallery on home
    return { success: true };
}

export async function deleteMediaItem(id: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('media_gallery')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath("/media");
    return { success: true };
}
