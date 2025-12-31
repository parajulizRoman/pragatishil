"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface ChannelMember {
    id: string;
    channel_id: string;
    user_id: string;
    role: 'viewer' | 'member' | 'moderator' | 'incharge';
    added_at: string;
    added_by: string | null;
    user?: {
        id: string;
        full_name: string;
        avatar_url: string | null;
        email?: string;
    };
}

/**
 * Get all members of a channel
 */
export async function getChannelMembers(channelId: string): Promise<ChannelMember[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("channel_members")
        .select(`
            id,
            channel_id,
            user_id,
            role,
            added_at,
            added_by,
            profiles:user_id (
                id,
                full_name,
                avatar_url
            )
        `)
        .eq("channel_id", channelId)
        .order("added_at", { ascending: false });

    if (error) {
        console.error("Error fetching channel members:", error);
        return [];
    }

    // Transform to expected format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data || []).map((m: any) => ({
        ...m,
        user: m.profiles || undefined
    }));
}

/**
 * Add a user to a channel
 */
export async function addChannelMember(
    channelId: string,
    userId: string,
    role: 'viewer' | 'member' | 'moderator' | 'admin' = 'member'
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    // Get current user as added_by
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
        .from("channel_members")
        .insert({
            channel_id: channelId,
            user_id: userId,
            role,
            added_by: user?.id
        });

    if (error) {
        console.error("Error adding channel member:", error);
        return { success: false, error: error.message };
    }

    revalidatePath(`/commune`);
    return { success: true };
}

/**
 * Remove a user from a channel
 */
export async function removeChannelMember(
    channelId: string,
    userId: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("channel_members")
        .delete()
        .eq("channel_id", channelId)
        .eq("user_id", userId);

    if (error) {
        console.error("Error removing channel member:", error);
        return { success: false, error: error.message };
    }

    revalidatePath(`/commune`);
    return { success: true };
}

/**
 * Update a member's role in a channel
 */
export async function updateChannelMemberRole(
    channelId: string,
    userId: string,
    newRole: 'viewer' | 'member' | 'moderator' | 'admin'
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("channel_members")
        .update({ role: newRole })
        .eq("channel_id", channelId)
        .eq("user_id", userId);

    if (error) {
        console.error("Error updating member role:", error);
        return { success: false, error: error.message };
    }

    revalidatePath(`/commune`);
    return { success: true };
}

/**
 * Bulk add members by filter (e.g., all ward_committee in Kathmandu)
 */
export async function bulkAddChannelMembers(
    channelId: string,
    filter: {
        role?: string;
        state?: string;
        district?: string;
        municipality?: string;
        ward?: string;
        department?: string;
    }
): Promise<{ success: boolean; count: number; error?: string }> {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Build query to find matching users
    let query = supabase.from("profiles").select("id");

    if (filter.role) query = query.eq("role", filter.role);
    if (filter.state) query = query.eq("state", filter.state);
    if (filter.district) query = query.eq("district", filter.district);
    if (filter.municipality) query = query.eq("municipality", filter.municipality);
    if (filter.ward) query = query.eq("ward", filter.ward);
    if (filter.department) query = query.eq("department", filter.department);

    const { data: users, error: queryError } = await query;

    if (queryError) {
        console.error("Error finding users:", queryError);
        return { success: false, count: 0, error: queryError.message };
    }

    if (!users || users.length === 0) {
        return { success: true, count: 0 };
    }

    // Insert memberships (ignore conflicts)
    const memberships = users.map(u => ({
        channel_id: channelId,
        user_id: u.id,
        role: 'member' as const,
        added_by: user?.id
    }));

    const { error } = await supabase
        .from("channel_members")
        .upsert(memberships, { onConflict: 'channel_id,user_id', ignoreDuplicates: true });

    if (error) {
        console.error("Error bulk adding members:", error);
        return { success: false, count: 0, error: error.message };
    }

    revalidatePath(`/commune`);
    return { success: true, count: users.length };
}

/**
 * Get channels the current user is a member of (for private channels)
 */
export async function getMyChannelMemberships(): Promise<string[]> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from("channel_members")
        .select("channel_id")
        .eq("user_id", user.id);

    if (error) {
        console.error("Error fetching memberships:", error);
        return [];
    }

    return (data || []).map(m => m.channel_id);
}

/**
 * Check if current user is a member of a channel
 */
export async function isChannelMember(channelId: string): Promise<{ isMember: boolean; role?: string }> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { isMember: false };

    const { data } = await supabase
        .from("channel_members")
        .select("role")
        .eq("channel_id", channelId)
        .eq("user_id", user.id)
        .single();

    if (!data) return { isMember: false };
    return { isMember: true, role: data.role };
}

export interface SearchedUser {
    id: string;
    full_name: string;
    avatar_url: string | null;
    role: string;
}

/**
 * Search users by name or email for adding to channels
 * Excludes users already in the channel
 */
export async function searchUsers(
    query: string,
    channelId: string,
    limit: number = 10
): Promise<SearchedUser[]> {
    if (!query || query.length < 2) return [];

    const supabase = await createClient();

    // Get current channel members to exclude them
    const { data: existingMembers } = await supabase
        .from("channel_members")
        .select("user_id")
        .eq("channel_id", channelId);

    const existingUserIds = (existingMembers || []).map(m => m.user_id);

    // Search users by name (case-insensitive ILIKE)
    let searchQuery = supabase
        .from("profiles")
        .select("id, full_name, avatar_url, role")
        .ilike("full_name", `%${query}%`)
        .limit(limit);

    // Exclude already-added members
    if (existingUserIds.length > 0) {
        searchQuery = searchQuery.not("id", "in", `(${existingUserIds.join(",")})`);
    }

    const { data, error } = await searchQuery;

    if (error) {
        console.error("Error searching users:", error);
        return [];
    }

    return (data || []).map(u => ({
        id: u.id,
        full_name: u.full_name || "Unknown",
        avatar_url: u.avatar_url,
        role: u.role || "member"
    }));
}
