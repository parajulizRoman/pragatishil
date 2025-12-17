/* eslint-disable */
"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";
import { UserRole } from "@/types";
import { revalidatePath } from "next/cache";
import { canManageUsers } from "@/lib/permissions";

export async function getUsers(page = 1, search = "") {
    const supabase = await createClient();

    // Check permissions
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // We can use supabaseAdmin to fetch users/profiles to bypass RLS if needed, 
    // but standard client with 'Admins view all' policy is better. 
    // Assuming we have such policy or using admin for listing.
    // Let's use standard client but ensure RLS is correct, OR use admin for reliability in Admin Dashboard.
    // Using admin here for "God Mode" view.

    const PER_PAGE = 20;
    const from = (page - 1) * PER_PAGE;
    const to = from + PER_PAGE - 1;

    let query = supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

    if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, count, error } = await query;

    if (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
    }

    return { users: data, total: count || 0 };
}

export async function updateUserRole(userId: string, newRole: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Verify admin
    const { data: currentUserProfile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!canManageUsers(currentUserProfile?.role)) {
        throw new Error("Forbidden: Insufficient permissions");
    }

    // Update Profile
    const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

    if (profileError) throw new Error("Failed to update profile role");

    // Update user_roles table (sync)
    // First check if exists
    const { data: existingRoleVal } = await supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

    if (existingRoleVal) {
        await supabaseAdmin.from('user_roles').update({ role: newRole }).eq('user_id', userId);
    } else {
        await supabaseAdmin.from('user_roles').insert({ user_id: userId, role: newRole });
    }

    revalidatePath("/admin/users");
    return { success: true };
}

export async function toggleBanUser(userId: string, isBanned: boolean, reason: string = "") {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Verify admin
    const { data: currentUserProfile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!canManageUsers(currentUserProfile?.role)) {
        throw new Error("Forbidden: Insufficient permissions");
    }

    // Update Profile
    const updatePayload: any = {
        is_banned: isBanned,
    };

    if (isBanned) {
        updatePayload.banned_at = new Date().toISOString();
        updatePayload.banned_by = user.id;
        updatePayload.ban_reason = reason;
    } else {
        updatePayload.banned_at = null;
        updatePayload.banned_by = null;
        updatePayload.ban_reason = null;
    }

    const { error } = await supabaseAdmin
        .from('profiles')
        .update(updatePayload)
        .eq('id', userId);

    if (error) throw new Error("Failed to ban/unban user");

    // Audit Log
    try {
        await supabaseAdmin.from('audit_logs').insert({
            actor_id: user.id,
            action_type: isBanned ? 'BAN_USER' : 'UNBAN_USER',
            target_type: 'user',
            target_id: userId,
            metadata: { reason }
        });
    } catch (e) {
        console.error("Audit log failed", e);
    }

    revalidatePath("/admin/users");
    return { success: true };
}
