import type { UserRole } from "@/types";

export function canManageCms(role: UserRole | string | null | undefined): boolean {
    return ['admin', 'admin_party', 'yantrik', 'board', 'central_committee'].includes(role as string);
}

export function normalizeYoutubeUrl(url: string): string | null {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
}
