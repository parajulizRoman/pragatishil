export type UserRole =
    | 'anonymous_visitor'
    | 'supporter'
    | 'party_member'
    | 'team_member'
    | 'central_committee'
    | 'admin_party'
    | 'yantrik';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
    'anonymous_visitor': 0,
    'supporter': 10,
    'party_member': 20,
    'team_member': 30,
    'central_committee': 40,
    'admin_party': 90, // Political Admin
    'yantrik': 90,     // Tech Admin (Yantrik)
};

export function hasRole(currentRole: UserRole | undefined | null, requiredRole: UserRole): boolean {
    const current = currentRole || 'anonymous_visitor';
    return ROLE_HIERARCHY[current] >= ROLE_HIERARCHY[requiredRole];
}

export function isAtLeast(currentRole: UserRole | undefined | null, requiredRole: UserRole): boolean {
    return hasRole(currentRole, requiredRole);
}

// Add Database Types Extension
export interface Profile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    role: UserRole;
    is_public: boolean;
    bio: string | null;
    location: string | null;
    expertise: string[];
    contact_email_public: string | null;
    contact_phone_public: string | null;
    created_at: string;
    updated_at: string;
}

export interface AdminCouncilMember {
    id: string;
    profile_id: string;
    profile?: Profile;
    is_active: boolean;
    is_veto_holder: boolean;
    term_start: string;
    term_end: string | null;
}

export type ActionType =
    | 'CREATE_CHANNEL' | 'UPDATE_CHANNEL' | 'DELETE_CHANNEL'
    | 'BAN_USER' | 'UNBAN_USER'
    | 'HIDE_POST' | 'RESTORE_POST'
    | 'UPDATE_ROLE'
    | 'ROTATE_VETO'
    | 'UPDATE_SETTINGS';

export interface AuditLog {
    id: string;
    actor_id: string | null;
    actor?: Profile;
    action_type: ActionType;
    target_type: string;
    target_id: string;
    metadata: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    created_at: string;
}

export type ChannelVisibility = 'public' | 'logged_in' | 'party_only' | 'leadership' | 'internal';

export interface DiscussionChannel {
    id: string;
    slug: string;
    name: string;
    name_ne?: string;
    description: string | null;
    description_en?: string;
    description_ne?: string;
    guidelines_en?: string;
    guidelines_ne?: string;
    visibility: ChannelVisibility;
    allow_anonymous_posts: boolean;
    min_role_to_post: UserRole;
    min_role_to_create_threads: UserRole;
    min_role_to_comment: UserRole;
    min_role_to_vote: UserRole;
    created_at: string;
    // Resources
    docs_url?: string | null;
    video_playlist_url?: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    impact_stats?: Record<string, any>;
    readme_content?: string | null;
}

export interface DiscussionThread {
    id: string;
    channel_id: string;
    title: string;
    created_by: string | null; // Null if Anonymous
    is_anonymous: boolean;
    buried_at: string | null;
    created_at: string;
    updated_at: string;
    meta: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    author?: Profile; // Joined
    reactions?: Reaction[];
    user_reactions?: string[]; // Emojis user has reacted with
    summary?: string | null; // AI Summary
    total_posts?: number;
    upvotes?: number;
    downvotes?: number;
    first_post_id?: string;
    channel?: DiscussionChannel;
    first_post_content?: string;
}

export interface Reaction {
    id: string;
    post_id: string;
    user_id: string;
    emoji: string;
    created_at: string;
}

export interface ThreadUserMeta {
    is_followed: boolean;
    is_saved: boolean;
    is_hidden: boolean;
}

export interface DiscussionPost {
    id: string;
    thread_id: string;
    content: string;
    author_id: string | null;
    is_anonymous: boolean;
    is_anon?: boolean; // Legacy compat
    buried_at: string | null;
    created_at: string;
    updated_at: string;
    meta: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    author?: Profile; // Joined
    upvotes: number;
    downvotes: number;
    user_vote: number; // 0, 1, or -1 (if current user voted)
}

export interface MembershipRequestPayload {
    id?: string;
    personal: {
        fullNameNe: string;
        fullNameEn?: string | null;
        dobOriginal: string;
        dobCalendar: "AD" | "BS" | "unknown";
        gender?: string | null;
        capacity?: string;
        provinceNe?: string | null;
        districtNe?: string | null;
        localLevelNe?: string | null;
        addressNe?: string | null;
        provinceEn?: string | null;
        districtEn?: string | null;
        localLevelEn?: string | null;
        addressEn?: string | null;
    };
    contact: {
        phone: string;
        email: string;
    };
    party: {
        inspiredBy?: string | null;
        confidentiality?: string;
        skillsText?: string | null;
        pastAffiliations?: string | null;
        motivationTextNe: string;
        motivationTextEn?: string | null;
        departmentIds?: string[];
    };
    documents: {
        idDocument?: {
            docType: string;
            imageUrl: string;
            extracted?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
        };
        profilePhoto?: {
            imageUrl: string;
        };
    };
    meta?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}
