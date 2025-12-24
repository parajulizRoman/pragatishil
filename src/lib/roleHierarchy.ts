/**
 * Role Hierarchy & Messaging Permissions
 * Based on Nepal political structure
 */

// Role levels (0 = lowest, 11 = highest)
// Includes both new names and legacy names for backward compatibility
export const ROLE_LEVELS: Record<string, number> = {
    // New role names
    'guest': 0,
    'supporter': 1,
    'ward_committee': 2,
    'palika_committee': 3,
    'district_committee': 4,
    'state_committee': 5,
    'central_committee': 6,
    'department': 7,
    'admin_panel': 8,
    'advisor_board': 9,
    'yantrik': 10,
    'admin': 11,

    // Legacy role names (backward compatibility)
    'member': 2,           // maps to ward_committee level
    'party_member': 2,     // maps to ward_committee level
    'team_member': 3,      // maps to palika_committee level
    'board': 9,            // maps to advisor_board level
    'admin_party': 8       // maps to admin_panel level
};

// Who can each role initiate conversations with?
// Key = sender role, Value = array of roles they can message
export const MESSAGING_PERMISSIONS: Record<string, string[]> = {
    'guest': [],
    'supporter': [],
    'ward_committee': ['palika_committee'],
    'palika_committee': ['district_committee'],
    'district_committee': ['state_committee'],
    'state_committee': ['central_committee'],
    'central_committee': ['department', 'admin_panel'],
    'department': ['central_committee', 'admin_panel'],
    'admin_panel': ['central_committee', 'advisor_board', 'admin'],
    'advisor_board': ['admin_panel', 'central_committee'],
    'yantrik': ['admin'],  // tech escalations only
    'admin': [] // admin can message anyone (handled separately)
};

// Roles with full messaging access (can message anyone)
export const FULL_ACCESS_ROLES = ['admin'];

// Roles that can see full message history (no inactivity timeout)
// Includes legacy role names for backward compatibility
export const LEADERSHIP_ROLES = [
    'central_committee', 'department', 'admin_panel', 'advisor_board', 'yantrik', 'admin',
    'board', 'admin_party' // Legacy names
];

// Inactivity timeout in minutes for non-leadership
export const INACTIVITY_MINUTES = 5;

/**
 * Check if sender can initiate a conversation with recipient
 */
export function canInitiateConversation(senderRole: string, recipientRole: string): boolean {
    // Admin can message anyone
    if (FULL_ACCESS_ROLES.includes(senderRole)) {
        return true;
    }

    // Check if recipient is in sender's allowed list
    const allowedRecipients = MESSAGING_PERMISSIONS[senderRole] || [];
    return allowedRecipients.includes(recipientRole);
}

/**
 * Check if user can reply to a conversation
 * Anyone in an existing conversation can reply (but not initiate new ones)
 */
export function canReplyToConversation(userRole: string): boolean {
    // Only guest and supporter cannot reply at all
    const level = ROLE_LEVELS[userRole] || 0;
    return level >= 2; // ward_committee and above can reply
}

/**
 * Check if user has full message history access
 */
export function hasFullHistoryAccess(role: string): boolean {
    return LEADERSHIP_ROLES.includes(role);
}

/**
 * Get role level number
 */
export function getRoleLevel(role: string): number {
    return ROLE_LEVELS[role] || 0;
}

/**
 * Check if role A is higher than role B
 */
export function isHigherRole(roleA: string, roleB: string): boolean {
    return getRoleLevel(roleA) > getRoleLevel(roleB);
}
