/* eslint-disable */
"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";
import { UserRole, Profile } from "@/types";
import { revalidatePath } from "next/cache";
import { canManageUsers } from "@/lib/permissions";

export async function getUsers(page = 1, search = "") {
    const supabase = await createClient();

    // Check permissions
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Verify admin
    const { data: currentUserProfile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!currentUserProfile || !canManageUsers(currentUserProfile.role)) {
        throw new Error("Forbidden: Insufficient permissions");
    }

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

    // STRICT: Only admin and admin_party can change roles
    const allowed = ['admin', 'admin_party'];

    if (!currentUserProfile || !allowed.includes(currentUserProfile.role)) {
        throw new Error("Forbidden: Only Political Admins and System Admins can change roles.");
    }

    // Update Profile
    const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

    if (profileError) throw new Error("Failed to update profile role");

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

export async function adminUpdateProfile(userId: string, updates: Partial<Profile>) {
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

    // Prepare update data
    const payload: any = {
        updated_at: new Date().toISOString(),
    };

    if (updates.full_name !== undefined) payload.full_name = updates.full_name;
    if (updates.bio !== undefined) payload.bio = updates.bio;
    if (updates.location !== undefined) payload.location = updates.location;
    if (updates.contact_email_public !== undefined) payload.contact_email_public = updates.contact_email_public;
    if (updates.contact_phone_public !== undefined) payload.contact_phone_public = updates.contact_phone_public;
    if (updates.is_public !== undefined) payload.is_public = updates.is_public;
    if (updates.avatar_url !== undefined) payload.avatar_url = updates.avatar_url;

    if (updates.expertise) {
        payload.expertise = updates.expertise;
    }

    const { error } = await supabaseAdmin
        .from('profiles')
        .update(payload)
        .eq('id', userId);

    if (error) {
        console.error("Admin profile update error:", error);
        throw new Error("Failed to update profile");
    }

    // Update Role if provided (special handling because it syncs with user_roles)
    if (updates.role) {
        await updateUserRole(userId, updates.role);
    }

    // Audit Log
    try {
        await supabaseAdmin.from('audit_logs').insert({
            actor_id: user.id,
            action_type: 'UPDATE_SETTINGS',
            target_type: 'user',
            target_id: userId,
            metadata: { updates: Object.keys(payload) }
        });
    } catch (e) {
        console.error("Audit log failed", e);
    }

    revalidatePath("/admin/users");
    revalidatePath(`/members/${userId}`);
    return { success: true };
}

export async function deactivateUser(userId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Verify admin
    const { data: currentUserProfile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!['yantrik', 'admin_party', 'admin'].includes(currentUserProfile?.role as string)) {
        throw new Error("Forbidden: Insufficient permissions to deactivate users");
    }

    if (user.id === userId) {
        throw new Error("Cannot deactivate your own account");
    }

    // 1. Permanently Ban in Auth (876000h = 100 years)
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { ban_duration: '876000h' }
    );

    if (authError) {
        console.error("Auth deactivation error:", authError);
        throw new Error(`Failed to block access in Auth: ${authError.message}`);
    }

    // 2. Clear Roles & Mark Deactivated in Profile
    const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({
            role: 'member', // Strip higher roles
            is_public: false, // Hide from gallery
            updated_at: new Date().toISOString(),
            // Add a flag or just rely on 'banned' status if we add a column later
            // For now, we use audit logs and the role strip.
            ban_reason: 'ACCOUNT_DEACTIVATED_BY_ADMIN'
        })
        .eq('id', userId);

    if (profileError) {
        console.error("Profile deactivation error:", profileError);
    }


    // 3. Audit Log
    try {
        await supabaseAdmin.from('audit_logs').insert({
            actor_id: user.id,
            action_type: 'BAN_USER',
            target_type: 'user',
            target_id: userId,
            metadata: { action: 'PERMANENT_DEACTIVATION', history_preserved: true }
        });
    } catch (e) {
        console.error("Audit log failed", e);
    }

    revalidatePath("/admin/users");
    revalidatePath("/members");
    revalidatePath(`/members/${userId}`);
    return { success: true };
}
