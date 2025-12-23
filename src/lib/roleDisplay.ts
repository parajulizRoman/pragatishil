/**
 * Role display utilities - handles disguising admin roles for public display
 * 
 * IMPORTANT: This file controls how roles are displayed publicly.
 * - `admin` (root admin) → displays as "यान्त्रिक" (Yantrik)
 * - `board` (board members) → displays as "केन्द्रीय सदस्य" (Central Committee)
 */

export type DisplayRole = 'admin' | 'admin_party' | 'yantrik' | 'board' | 'central_committee' | 'team_member' | 'party_member' | 'supporter' | 'member' | 'guest';

/**
 * Role labels with disguises applied
 * The actual role is mapped to its public-facing label
 */
const ROLE_LABELS: Record<string, { en: string; ne: string }> = {
    // Disguised roles (important - these hide real admin identities)
    'admin': { en: 'Yantrik', ne: 'यान्त्रिक' },           // Root admin → Yantrik
    'board': { en: 'Central Committee', ne: 'केन्द्रीय सदस्य' },  // Board → Central Committee

    // Regular roles (displayed as-is)
    'admin_party': { en: 'Party Admin', ne: 'पार्टी प्रशासक' },
    'yantrik': { en: 'Yantrik', ne: 'यान्त्रिक' },
    'central_committee': { en: 'Central Committee', ne: 'केन्द्रीय समिति' },
    'team_member': { en: 'Team Member', ne: 'टोली सदस्य' },
    'party_member': { en: 'Party Member', ne: 'पार्टी सदस्य' },
    'supporter': { en: 'Supporter', ne: 'समर्थक' },
    'member': { en: 'Member', ne: 'सदस्य' },
    'guest': { en: 'Guest', ne: 'अतिथि' },
};

/**
 * Get the display label for a role
 * This handles role disguising for admin and board members
 */
export function getRoleLabel(role: string | null | undefined, language: 'en' | 'ne' = 'ne'): string {
    if (!role) return language === 'ne' ? 'अतिथि' : 'Guest';

    const label = ROLE_LABELS[role];
    if (label) {
        return language === 'ne' ? label.ne : label.en;
    }

    // Fallback: capitalize and replace underscores
    return role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Get role badge variant for styling
 */
export function getRoleBadgeVariant(role?: string): string {
    switch (role) {
        case 'admin':        // Root admin (disguised as Yantrik)
        case 'yantrik':      // Actual Yantrik
            return 'secondary'; // Slate/Gray
        case 'admin_party':
            return 'destructive'; // Red
        case 'board':        // Board (disguised as Central Committee)
        case 'central_committee':
            return 'leadership'; // Blue
        case 'team_member':
            return 'outline';
        case 'party_member':
            return 'party'; // Custom Red/Outline
        default:
            return 'outline'; // Supporter/Guest
    }
}

/**
 * Check if role should be displayed (some roles might be hidden)
 */
export function shouldDisplayRole(role?: string): boolean {
    if (!role) return false;
    // Always display roles - the disguise handles the label
    return true;
}
