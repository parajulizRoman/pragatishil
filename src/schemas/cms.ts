
import { z } from "zod";

// Hero Schema
export const HeroSettingsSchema = z.object({
    pillNe: z.string(),
    titleNe: z.string(),
    titleEn: z.string(),
    subtitleNe: z.string(),
    subtitleEnLine1: z.string(),
    subtitleEnLine2: z.string(),
    ctaPrimary: z.string(),
    ctaSecondary: z.string(),
});

// Nav Schema
export const NavSettingsSchema = z.object({
    home: z.object({ en: z.string(), ne: z.string() }),
    news: z.object({ en: z.string(), ne: z.string() }),
    media: z.object({ en: z.string(), ne: z.string() }),
    about: z.object({ en: z.string(), ne: z.string() }),
    contact: z.object({ en: z.string(), ne: z.string() }),
    members: z.object({ en: z.string(), ne: z.string() }),
    join: z.object({ en: z.string(), ne: z.string() }),
    brand: z.object({
        firstEn: z.string(),
        secondEn: z.string(),
        firstNe: z.string(),
        secondNe: z.string(),
    }),
});

// Vision Schema
export const VisionSettingsSchema = z.object({
    titleNe: z.string(),
    titleEn: z.string(),
    textNe: z.string(),
    textEn: z.string(),
    pillars: z.array(z.object({
        titleNe: z.string(),
        titleEn: z.string(),
        descEn: z.string(),
        descNe: z.string().optional(),
        icon: z.string(),
    })),
});

// About Schema
export const AboutSettingsSchema = z.object({
    titleNe: z.string(),
    titleEn: z.string(),
    descriptionNe: z.string(),
    descriptionEn: z.string(),
});

// Contact Schema
export const ContactSettingsSchema = z.object({
    address: z.string(),
    email: z.string().email(),
    phone: z.string(),
});

// Social Schema
export const SocialSettingsSchema = z.array(z.object({
    name: z.string(),
    icon: z.string(),
    url: z.string().url(),
}));

// Footer Schema
export const FooterSettingsSchema = z.object({
    taglineNe: z.string(),
    taglineEn: z.string(),
});

// Global Schema (Partial/Loose for now or strict?)
// The user edits 'global' key which contains nav, footer, social, contact as sub-keys.
export const GlobalSettingsSchema = z.object({
    nav: NavSettingsSchema,
    footer: FooterSettingsSchema,
    social: SocialSettingsSchema,
    contact: ContactSettingsSchema,
});
