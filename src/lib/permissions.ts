import { createClient } from "@supabase/supabase-js";
import { UserRole, hasRole, DiscussionChannel } from "@/types";

export type PermissionCheckResult = {
    allowed: boolean;
    reason?: string;
};

export async function getUserRole(userId: string | undefined): Promise<UserRole> {
    if (!userId) return 'anonymous_visitor';

    // In a real server component, we might already have the user object with metadata?
    // But usually we need to fetch from profiles if role is not in JWT metadata.
    // For now, let's assume we fetch profile. 
    // Optimization: Add role to JWT via custom claims later.
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

    return (profile?.role as UserRole) || 'supporter';
}

export function canPost(userRole: UserRole, channel: DiscussionChannel): PermissionCheckResult {
    if (channel.min_role_to_post && !hasRole(userRole, channel.min_role_to_post)) {
        return { allowed: false, reason: `Requires role: ${channel.min_role_to_post}` };
    }
    return { allowed: true };
}

export function canCreateThread(userRole: UserRole, channel: DiscussionChannel): PermissionCheckResult {
    if (channel.min_role_to_create_threads && !hasRole(userRole, channel.min_role_to_create_threads)) {
        return { allowed: false, reason: `Requires role: ${channel.min_role_to_create_threads}` };
    }
    return { allowed: true };
}

export function canComment(userRole: UserRole, channel: DiscussionChannel): PermissionCheckResult {
    if (channel.min_role_to_comment && !hasRole(userRole, channel.min_role_to_comment)) {
        return { allowed: false, reason: `Requires role: ${channel.min_role_to_comment}` };
    }
    return { allowed: true };
}

export function canVote(userRole: UserRole, channel: DiscussionChannel): PermissionCheckResult {
    if (channel.min_role_to_vote && !hasRole(userRole, channel.min_role_to_vote)) {
        return { allowed: false, reason: `Requires role: ${channel.min_role_to_vote}` };
    }
    return { allowed: true };
}
