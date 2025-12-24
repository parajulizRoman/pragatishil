"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface RoleLevel {
    id: string;
    key: string;
    level: number;
    name_en: string;
    name_ne?: string;
    can_reply: boolean;
    has_full_history: boolean;
    is_system: boolean;
}

export interface MessagingPermission {
    id: string;
    sender_role: string;
    recipient_role: string;
}

/**
 * Get all role levels sorted by level
 */
export async function getRoleLevels(): Promise<RoleLevel[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("role_levels")
        .select("*")
        .order("level", { ascending: true });

    if (error) {
        console.error("Error fetching role levels:", error);
        return [];
    }

    return data || [];
}

/**
 * Get a single role level by key
 */
export async function getRoleByKey(key: string): Promise<RoleLevel | null> {
    const supabase = await createClient();

    const { data } = await supabase
        .from("role_levels")
        .select("*")
        .eq("key", key)
        .single();

    return data;
}

/**
 * Update a role level
 */
export async function updateRoleLevel(
    id: string,
    updates: Partial<Pick<RoleLevel, 'level' | 'name_en' | 'name_ne' | 'can_reply' | 'has_full_history'>>
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("role_levels")
        .update(updates)
        .eq("id", id);

    if (error) {
        console.error("Error updating role level:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/roles");
    return { success: true };
}

/**
 * Reorder roles (update levels for multiple roles)
 */
export async function reorderRoles(
    orderedKeys: string[]
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    // Update each role's level based on its position in the array
    for (let i = 0; i < orderedKeys.length; i++) {
        const { error } = await supabase
            .from("role_levels")
            .update({ level: i })
            .eq("key", orderedKeys[i]);

        if (error) {
            console.error(`Error updating role ${orderedKeys[i]}:`, error);
            return { success: false, error: error.message };
        }
    }

    revalidatePath("/admin/roles");
    return { success: true };
}

/**
 * Get all messaging permissions
 */
export async function getMessagingPermissions(): Promise<MessagingPermission[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("messaging_permissions")
        .select("*");

    if (error) {
        console.error("Error fetching messaging permissions:", error);
        return [];
    }

    return data || [];
}

/**
 * Add a messaging permission
 */
export async function addMessagingPermission(
    senderRole: string,
    recipientRole: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("messaging_permissions")
        .insert({ sender_role: senderRole, recipient_role: recipientRole });

    if (error) {
        console.error("Error adding messaging permission:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/roles");
    return { success: true };
}

/**
 * Remove a messaging permission
 */
export async function removeMessagingPermission(
    senderRole: string,
    recipientRole: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("messaging_permissions")
        .delete()
        .eq("sender_role", senderRole)
        .eq("recipient_role", recipientRole);

    if (error) {
        console.error("Error removing messaging permission:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/roles");
    return { success: true };
}

/**
 * Create a new custom role (non-system)
 */
export async function createRole(
    key: string,
    nameEn: string,
    nameNe: string,
    level: number
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("role_levels")
        .insert({
            key,
            name_en: nameEn,
            name_ne: nameNe,
            level,
            can_reply: true,
            has_full_history: false,
            is_system: false
        });

    if (error) {
        console.error("Error creating role:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/roles");
    return { success: true };
}

/**
 * Delete a non-system role
 */
export async function deleteRole(key: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    // First check if it's a system role
    const { data: role } = await supabase
        .from("role_levels")
        .select("is_system")
        .eq("key", key)
        .single();

    if (role?.is_system) {
        return { success: false, error: "Cannot delete system role" };
    }

    const { error } = await supabase
        .from("role_levels")
        .delete()
        .eq("key", key);

    if (error) {
        console.error("Error deleting role:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/roles");
    return { success: true };
}
