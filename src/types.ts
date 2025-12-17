export type UserRole =
    | 'guest'               // not logged in
    | 'member'              // basic member who signed up
    | 'party_member'        // verified party member
    | 'volunteer'
    | 'team_member'
    | 'central_committee'   // central committee member
    | 'board'               // board / chief board member
    | 'admin_party'         // political admin
    | 'yantrik'             // technical admin (renamed from admin_tech)
    | 'admin';              // System Admin (Top)

// Role Hierarchy
export const ROLE_HIERARCHY: Record<UserRole, number> = {
    'guest': 0,
    'member': 1,
    'volunteer': 2,
    'party_member': 2,
    'team_member': 3,
    'central_committee': 4,
    'admin_party': 5,
    'yantrik': 6,
    'board': 7,
    'admin': 8
};

export function getRoleLevel(role: UserRole | string | null | undefined): number {
    if (!role) return ROLE_HIERARCHY.guest;
    // Normalize string to UserRole if possible, else guest
    return ROLE_HIERARCHY[role as UserRole] ?? ROLE_HIERARCHY.guest;
}

export function hasRole(userRole: UserRole | string | undefined | null, requiredRole: UserRole | string): boolean {
    const userLevel = getRoleLevel(userRole);
    const reqLevel = getRoleLevel(requiredRole);
    return userLevel >= reqLevel;
}

export function isAtLeast(currentRole: UserRole | string | undefined | null, requiredRole: UserRole | string): boolean {
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
    // Ban System
    is_banned?: boolean;
    banned_at?: string | null;
    banned_by?: string | null;
    ban_reason?: string | null;
    ban_expires_at?: string | null;
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

export interface ChannelResource {
    id: string;
    channel_id: string;
    title: string;
    type: 'doc' | 'video' | 'link' | 'impact' | 'other';
    url: string;
    description?: string;
    created_at: string;
}

export interface DiscussionChannel {
    id: string;
    slug: string;
    name: string;
    name_ne?: string;
    description?: string;
    description_en?: string;
    description_ne?: string;
    icon?: string;
    category?: string; // e.g. "Public Space", "Organizational"
    visibility: ChannelVisibility;
    allow_anonymous_posts: boolean;

    // Role Requirements (using UserRole enum)
    min_role_to_post: UserRole | string;
    min_role_to_create_threads: UserRole | string;
    min_role_to_comment: UserRole | string;
    min_role_to_vote: UserRole | string;

    // Advanced Content
    docs_url?: string; // Legacy simple link
    video_playlist_url?: string; // Legacy simple link
    impact_stats?: Record<string, string | number>;
    readme_content?: string; // New: Markdown
    is_archived?: boolean; // New: Archive status
    resources?: ChannelResource[]; // New: Rich resources
    // Guidelines (Optional)
    guidelines_en?: string;
    guidelines_ne?: string;

    created_at: string;
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
    user_vote?: number; // 0, 1, -1 for current user on first post
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
    attachments?: DiscussionAttachment[];
}

export interface DiscussionAttachment {
    id: string;
    post_id: string;
    storage_path: string;
    file_name: string;
    mime_type: string;
    size_bytes: number;
    type: 'image' | 'pdf' | 'file';
    created_at: string;
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
