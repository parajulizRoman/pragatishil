import { NewsAttachment, NewsReference } from "@/types";

// Types for Dynamic Site Content (matching siteContent.ts structure but ready for DB)

export interface SiteSettings {
    hero: {
        pillNe: string;
        titleNe: string;
        titleEn: string;
        subtitleNe: string;
        subtitleEnLine1: string;
        subtitleEnLine2: string;
        ctaPrimary: string;
        ctaSecondary: string;
    };
    nav: {
        home: { en: string; ne: string };
        news: { en: string; ne: string };
        media: { en: string; ne: string };
        about: { en: string; ne: string };
        contact: { en: string; ne: string };
        members: { en: string; ne: string };
        join: { en: string; ne: string };
        brand: {
            firstEn: string; secondEn: string;
            firstNe: string; secondNe: string;
        };
    };
    vision: {
        titleNe: string;
        titleEn: string;
        textNe: string;
        textEn: string;
        pillars: Array<{
            titleNe: string;
            titleEn: string;
            descEn: string;
            descNe?: string; // Optional if not fully populated yet
            icon: string; // Emoji character
        }>;
    };
    about: {
        titleNe: string;
        titleEn: string;
        descriptionNe: string;
        descriptionEn: string;
    };
    contact: {
        address: string;
        email: string;
        phone: string;
    };
    social: Array<{
        name: string;
        icon: string;
        url: string;
    }>;
    footer: {
        taglineNe: string;
        taglineEn: string;
    };
}

export interface NewsItem {
    id: number;
    slug?: string;
    title: string;
    title_ne: string | null;
    summary_en: string | null;
    summary_ne: string | null;
    source: string;
    date: string;
    date_bs?: string | null;
    type: 'Article' | 'Video' | 'Interview' | 'Speech';
    link: string;
    image_url?: string;
    image?: string; // legacy fallback
    status: 'draft' | 'submitted' | 'published' | 'rejected' | 'archived';
    published_at: string | null;
    author_name: string | null;
    author_id?: string | null;
    content_type?: 'official' | 'article';
    body_en?: string | null;
    body_ne?: string | null;
    visibility?: 'public' | 'party' | 'private';
    pending_reviewer_id?: string | null;
    thread_id?: number | null;
    attachments?: NewsAttachment[];
    references?: NewsReference[];
}

export interface MediaVideo {
    id: string | number;
    title: string | null;
    url: string;
    embed_url?: string | null;
    media_type: 'video';
}

export interface GalleryImage {
    id: number;
    url: string;
    caption: string | null;
    caption_ne: string | null;
    alt_text: string | null;
    media_type: 'image';
}
