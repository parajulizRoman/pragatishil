import { UserRole, ROLE_HIERARCHY, getRoleLevel } from '@/types';

/**
 * Checks if a user has permission to manage channels (Create, Edit, Archive).
 * Minimum Role: Central Committee
 */
export function canManageChannels(role: UserRole | string | null | undefined): boolean {
    return getRoleLevel(role) >= ROLE_HIERARCHY.central_committee;
}

/**
 * Checks if a user has permission to manage users (Ban, Change Role).
 * Allowed Roles: Admin Party, Yantrik, Admin only
 */
export function canManageUsers(role: UserRole | string | null | undefined): boolean {
    const r = role as UserRole;
    return ['admin_party', 'yantrik', 'admin'].includes(r);
}

/**
 * Checks if a user has permission to Moderate posts (Hide, Flag actions).
 * Minimum Role: Party Member
 */
export function canModeratePosts(role: UserRole | string | null | undefined): boolean {
    return getRoleLevel(role) >= ROLE_HIERARCHY.party_member;
}

/**
 * Checks if a user is considered "Leadership" (High Command).
 * Minimum Role: Central Committee
 */
export function isLeadership(role: UserRole | string | null | undefined): boolean {
    return getRoleLevel(role) >= ROLE_HIERARCHY.central_committee;
}

/**
 * Checks if a user is a generic verified member.
 * Minimum Role: Member
 */
export function isVerifiedMember(role: UserRole | string | null | undefined): boolean {
    return getRoleLevel(role) >= ROLE_HIERARCHY.member;
}

/**
 * Checks if a user can create/manage press releases.
 * Allowed Roles: admin, yantrik, admin_party ONLY
 */
export function canManagePressReleases(role: UserRole | string | null | undefined): boolean {
    const r = role as UserRole;
    return ['admin_party', 'yantrik', 'admin'].includes(r);
}

/**
 * Checks if a user can create/manage news items.
 * Allowed Roles: admin, yantrik, admin_party ONLY
 */
export function canManageNews(role: UserRole | string | null | undefined): boolean {
    const r = role as UserRole;
    return ['admin_party', 'yantrik', 'admin'].includes(r);
}

/**
 * Checks if a user can delete content (photos, videos, press releases).
 * Allowed Roles: admin, yantrik, admin_party, board only
 */
export function canDeleteContent(role: UserRole | string | null | undefined): boolean {
    const r = role as UserRole;
    return ['admin_party', 'yantrik', 'admin', 'board'].includes(r);
}

/**
 * Checks if a user can add photos/videos to gallery/video pages.
 * Minimum Role: Central Committee
 */
export function canManageMedia(role: UserRole | string | null | undefined): boolean {
    return getRoleLevel(role) >= ROLE_HIERARCHY.central_committee;
}

/**
 * Checks if a user can create new albums.
 * Minimum Role: Central Committee
 */
export function canCreateAlbum(role: UserRole | string | null | undefined): boolean {
    return getRoleLevel(role) >= ROLE_HIERARCHY.central_committee;
}

/**
 * Checks if a user can upload photos to existing albums.
 * Minimum Role: Party Member
 */
export function canUploadToAlbum(role: UserRole | string | null | undefined): boolean {
    return getRoleLevel(role) >= ROLE_HIERARCHY.party_member;
}

/**
 * Checks if a user can merge duplicate albums.
 * Allowed Roles: admin, yantrik, admin_party ONLY
 */
export function canMergeAlbums(role: UserRole | string | null | undefined): boolean {
    const r = role as UserRole;
    return ['admin_party', 'yantrik', 'admin'].includes(r);
}

