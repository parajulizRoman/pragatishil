"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";

export interface AIPrompt {
    id: string;
    key: string;
    name: string;
    description: string | null;
    prompt: string;
    variables: string[];
    is_active: boolean;
    updated_at: string;
    updated_by: string | null;
}

/**
 * Get all AI prompts (only for admin/yantrik)
 */
export async function getAIPrompts(): Promise<{ prompts: AIPrompt[] | null; error: string | null }> {
    const supabase = await createClient();

    // Verify user is admin or yantrik
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { prompts: null, error: "Unauthorized" };
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!["admin", "yantrik"].includes(profile?.role || "")) {
        return { prompts: null, error: "Access denied - admin/yantrik only" };
    }

    const { data, error } = await supabase
        .from("ai_prompts")
        .select("*")
        .order("name");

    if (error) {
        return { prompts: null, error: error.message };
    }

    return { prompts: data as AIPrompt[], error: null };
}

/**
 * Get a single prompt by key (for internal use by AI functions)
 * Uses admin client to bypass RLS
 */
export async function getPromptByKey(key: string): Promise<string | null> {
    if (!supabaseAdmin) return null;

    const { data } = await supabaseAdmin
        .from("ai_prompts")
        .select("prompt")
        .eq("key", key)
        .eq("is_active", true)
        .single();

    return data?.prompt || null;
}

/**
 * Update an AI prompt (only for admin/yantrik)
 */
export async function updateAIPrompt(
    id: string,
    updates: { prompt?: string; name?: string; description?: string; is_active?: boolean }
): Promise<{ success: boolean; error: string | null }> {
    const supabase = await createClient();

    // Verify user is admin or yantrik
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!["admin", "yantrik"].includes(profile?.role || "")) {
        return { success: false, error: "Access denied - admin/yantrik only" };
    }

    const { error } = await supabase
        .from("ai_prompts")
        .update({
            ...updates,
            updated_by: user.id,
            updated_at: new Date().toISOString()
        })
        .eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, error: null };
}

