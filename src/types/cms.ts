
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
    id: number; // DB will use number or UUID
    title: string;
    source: string;
    date: string;
    type: 'Article' | 'Video' | 'Interview';
    link: string; // Internal or External
    image?: string;
}

export interface MediaVideo {
    id: string; // YouTube ID or UUID
    title: string;
    url: string;
}

export interface GalleryImage {
    id: number;
    url: string;
    caption: string;
}
