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
 * Allowed Roles: Admin Party, Yantrik, Admin, Board
 */
export function canManageUsers(role: UserRole | string | null | undefined): boolean {
    const r = role as UserRole;
    return ['admin_party', 'yantrik', 'admin', 'board'].includes(r);
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
