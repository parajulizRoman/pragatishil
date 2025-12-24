/**
 * Organization Hierarchy Types
 * For Committee Inbox & Issue Escalation System
 */

// Org Level Keys (Nepal Political Hierarchy)
export type OrgLevelKey =
    | 'ward_committee'
    | 'palika_committee'
    | 'district_committee'
    | 'state_committee'
    | 'central_committee'
    | 'department'
    | 'admin_panel';

// Escalation path - which committee level handles issues after current level
export const ESCALATION_PATH: Record<OrgLevelKey, OrgLevelKey | null> = {
    'ward_committee': 'palika_committee',
    'palika_committee': 'district_committee',
    'district_committee': 'state_committee',
    'state_committee': 'central_committee',
    'central_committee': 'department',
    'department': 'admin_panel',
    'admin_panel': null // End of escalation chain
};

// Level display names
export const ORG_LEVEL_NAMES: Record<OrgLevelKey, { en: string; ne: string }> = {
    'ward_committee': { en: 'Ward Committee', ne: 'वडा समिति' },
    'palika_committee': { en: 'Palika Committee', ne: 'पालिका समिति' },
    'district_committee': { en: 'District Committee', ne: 'जिल्ला समिति' },
    'state_committee': { en: 'State Committee', ne: 'प्रदेश समिति' },
    'central_committee': { en: 'Central Committee', ne: 'केन्द्रीय समिति' },
    'department': { en: 'Department', ne: 'विभाग' },
    'admin_panel': { en: 'Administration', ne: 'प्रशासन' }
};

// Level hierarchy (higher = more authority)
export const ORG_LEVEL_HIERARCHY: Record<OrgLevelKey, number> = {
    'ward_committee': 1,
    'palika_committee': 2,
    'district_committee': 3,
    'state_committee': 4,
    'central_committee': 5,
    'department': 6,
    'admin_panel': 7
};

// === Database Types ===

export interface OrgCommittee {
    id: string;
    level_key: OrgLevelKey;
    name: string;
    name_ne?: string;
    area_code?: string;
    parent_committee_id?: string;
    created_at: string;
}

export interface OrgCommitteeMember {
    id: string;
    committee_id: string;
    profile_id: string;
    is_information_officer: boolean;
    position_title_en?: string;
    position_title_ne?: string;
    created_at: string;
    // Joined data
    profile?: {
        id: string;
        full_name: string;
        avatar_url?: string;
        handle?: string;
    };
    committee?: OrgCommittee;
}

export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'escalated' | 'closed';
export type IssuePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface OrgIssue {
    id: string;
    created_by: string;
    origin_committee_id?: string;
    current_committee_id: string;
    subject: string;
    body?: string;
    status: IssueStatus;
    priority: IssuePriority;
    parent_issue_id?: string;
    resolved_by?: string;
    resolved_at?: string;
    escalated_at?: string;
    created_at: string;
    updated_at: string;
    // Joined data
    creator?: {
        id: string;
        full_name: string;
        avatar_url?: string;
    };
    current_committee?: OrgCommittee;
    origin_committee?: OrgCommittee;
}

export interface OrgIssueComment {
    id: string;
    issue_id: string;
    author_id: string;
    content: string;
    is_internal: boolean;
    created_at: string;
    // Joined data
    author?: {
        id: string;
        full_name: string;
        avatar_url?: string;
    };
}

// === Utility Functions ===

export function getNextEscalationLevel(currentLevel: OrgLevelKey): OrgLevelKey | null {
    return ESCALATION_PATH[currentLevel];
}

export function canEscalate(currentLevel: OrgLevelKey): boolean {
    return ESCALATION_PATH[currentLevel] !== null;
}

export function getOrgLevelName(level: OrgLevelKey, language: 'en' | 'ne' = 'en'): string {
    return ORG_LEVEL_NAMES[level]?.[language] || level;
}
