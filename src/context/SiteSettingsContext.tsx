"use client";

import { createContext, useContext, ReactNode } from "react";
import { siteContent } from "@/config/siteContent";

// Types for global settings from DB
interface ContactInfo {
    address?: string;
    email?: string;
    phone?: string;
}

interface SocialLink {
    name: string;
    icon?: string;
    url: string;
}

interface FooterSettings {
    taglineEn?: string;
    taglineNe?: string;
}

interface NavBrand {
    firstEn?: string;
    secondEn?: string;
    firstNe?: string;
    secondNe?: string;
}

interface NavLabels {
    home?: { en: string; ne: string };
    news?: { en: string; ne: string };
    media?: { en: string; ne: string };
    about?: { en: string; ne: string };
    contact?: { en: string; ne: string };
    members?: { en: string; ne: string };
    join?: { en: string; ne: string };
    brand?: NavBrand;
    tools?: {
        dateConverter?: { en: string; ne: string };
    };
}

interface HeroSettings {
    subtitleEnLine1?: string;
    subtitleNe?: string;
}

export interface SiteSettings {
    contact: ContactInfo;
    social: SocialLink[];
    footer: FooterSettings;
    nav: NavLabels;
    hero?: HeroSettings;
}

// Default fallback from siteContent
const defaultSettings: SiteSettings = {
    contact: siteContent.contact,
    social: siteContent.social,
    footer: siteContent.footer,
    nav: siteContent.nav,
    hero: siteContent.hero,
};

const SiteSettingsContext = createContext<SiteSettings>(defaultSettings);

export function SiteSettingsProvider({
    children,
    settings,
}: {
    children: ReactNode;
    settings?: Partial<SiteSettings>;
}) {
    // Merge provided settings with defaults
    const mergedSettings: SiteSettings = {
        contact: settings?.contact || defaultSettings.contact,
        social: settings?.social || defaultSettings.social,
        footer: settings?.footer || defaultSettings.footer,
        nav: settings?.nav || defaultSettings.nav,
        hero: settings?.hero || defaultSettings.hero,
    };

    return (
        <SiteSettingsContext.Provider value={mergedSettings}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings() {
    return useContext(SiteSettingsContext);
}
