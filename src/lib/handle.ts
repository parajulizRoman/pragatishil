// Handle validation utility for @handle system

// Reserved handles that cannot be used
const RESERVED_HANDLES = new Set([
    'admin', 'administrator', 'support', 'help', 'pragatishil', 'party',
    'moderator', 'mod', 'system', 'bot', 'official', 'verified',
    'news', 'media', 'press', 'contact', 'info', 'about',
    'login', 'logout', 'signup', 'register', 'settings', 'profile',
    'api', 'www', 'mail', 'email', 'root', 'null', 'undefined',
    'test', 'demo', 'example', 'sample', 'guest', 'anonymous',
    'commune', 'members', 'gallery', 'videos', 'join', 'write'
]);

// Validation rules
const HANDLE_MIN_LENGTH = 3;
const HANDLE_MAX_LENGTH = 30;
const HANDLE_REGEX = /^[a-zA-Z][a-zA-Z0-9_]*$/;

export interface HandleValidationResult {
    valid: boolean;
    error?: string;
}

/**
 * Validate a handle for format, length, and reserved words
 */
export function validateHandle(handle: string): HandleValidationResult {
    // Trim and lowercase for validation
    const normalized = handle.trim();

    // Check empty
    if (!normalized) {
        return { valid: false, error: 'Handle is required' };
    }

    // Check length
    if (normalized.length < HANDLE_MIN_LENGTH) {
        return { valid: false, error: `Handle must be at least ${HANDLE_MIN_LENGTH} characters` };
    }

    if (normalized.length > HANDLE_MAX_LENGTH) {
        return { valid: false, error: `Handle must be at most ${HANDLE_MAX_LENGTH} characters` };
    }

    // Check format (starts with letter, alphanumeric + underscore)
    if (!HANDLE_REGEX.test(normalized)) {
        return {
            valid: false,
            error: 'Handle must start with a letter and contain only letters, numbers, and underscores'
        };
    }

    // Check reserved words
    if (RESERVED_HANDLES.has(normalized.toLowerCase())) {
        return { valid: false, error: 'This handle is reserved and cannot be used' };
    }

    return { valid: true };
}

/**
 * Format handle for display (with @ prefix)
 */
export function formatHandle(handle: string | null | undefined): string {
    if (!handle) return '';
    return `@${handle}`;
}

/**
 * Parse @mentions from content
 * Returns array of handles (without @ prefix)
 */
export function parseMentions(content: string): string[] {
    const mentionRegex = /@([a-zA-Z][a-zA-Z0-9_]{2,29})/g;
    const matches = content.matchAll(mentionRegex);
    const mentions = new Set<string>();

    for (const match of matches) {
        mentions.add(match[1].toLowerCase());
    }

    return Array.from(mentions);
}

/**
 * Convert mentions to linked format
 * Replaces @handle with a clickable link
 */
export function linkifyMentions(content: string): string {
    const mentionRegex = /@([a-zA-Z][a-zA-Z0-9_]{2,29})/g;
    return content.replace(mentionRegex, '[@$1](/members/@$1)');
}
