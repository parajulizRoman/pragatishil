/**
 * Central translations file for multilingual support.
 * All UI strings should be defined here for consistency.
 */

export type Lang = "en" | "ne";

// Define all translation keys as a union type for type safety
export type TransKey =
    // Navigation
    | "nav.home"
    | "nav.news"
    | "nav.media"
    | "nav.about"
    | "nav.contact"
    | "nav.members"
    | "nav.join"
    | "nav.commune"
    // Buttons
    | "buttons.readMore"
    | "buttons.viewAllNews"
    | "buttons.submit"
    | "buttons.cancel"
    | "buttons.save"
    | "buttons.toggleNepali"
    | "buttons.toggleEnglish"
    // News Page
    | "news.headerTitle"
    | "news.headerSubtitle"
    | "news.backToNews"
    | "news.readOriginal"
    | "news.attachments"
    | "news.references"
    | "news.noArticles"
    | "news.readFullArticle"
    | "news.source"
    | "news.nepaliTranslation"
    // Media Page
    | "media.headerTitle"
    | "media.headerSubtitle"
    | "media.newsSection"
    | "media.videosSection"
    | "media.gallerySection"
    // Common
    | "common.loading"
    | "common.error"
    | "common.noResults";

const translations: Record<TransKey, { en: string; ne: string }> = {
    // Navigation
    "nav.home": { en: "Home", ne: "गृहपृष्ठ" },
    "nav.news": { en: "News", ne: "समाचार" },
    "nav.media": { en: "Media", ne: "मिडिया" },
    "nav.about": { en: "About", ne: "हाम्रो बारेमा" },
    "nav.contact": { en: "Contact", ne: "सम्पर्क" },
    "nav.members": { en: "Members", ne: "सदस्यहरू" },
    "nav.join": { en: "Join Us", ne: "सदस्य बन्नुहोस्" },
    "nav.commune": { en: "Commune", ne: "समुदाय" },

    // Buttons
    "buttons.readMore": { en: "Read More", ne: "थप पढ्नुहोस्" },
    "buttons.viewAllNews": { en: "View All News", ne: "सबै समाचार हेर्नुहोस्" },
    "buttons.submit": { en: "Submit", ne: "पेश गर्नुहोस्" },
    "buttons.cancel": { en: "Cancel", ne: "रद्द गर्नुहोस्" },
    "buttons.save": { en: "Save", ne: "सुरक्षित गर्नुहोस्" },
    "buttons.toggleNepali": { en: "नेपालीमा हेर्नुहोस्", ne: "नेपालीमा हेर्नुहोस्" },
    "buttons.toggleEnglish": { en: "View in English", ne: "View in English" },

    // News Page
    "news.headerTitle": { en: "News Room", ne: "समाचार कक्ष" },
    "news.headerSubtitle": {
        en: "Stay informed with the latest updates, official statements, and activities from Pragatishil Loktantrik Party.",
        ne: "प्रगतिशील लोकतान्त्रिक पार्टीका ताजा जानकारी, आधिकारिक वक्तव्य र गतिविधिहरू यहाँ हेर्नुहोस्।"
    },
    "news.backToNews": { en: "Back to News Room", ne: "समाचार कक्षमा फर्कनुहोस्" },
    "news.readOriginal": { en: "Read Original", ne: "मूल स्रोत हेर्नुहोस्" },
    "news.attachments": { en: "Attachments", ne: "संलग्न फाइलहरू" },
    "news.references": { en: "References", ne: "सन्दर्भहरू" },
    "news.noArticles": { en: "No news articles published yet.", ne: "अहिलेसम्म कुनै समाचार प्रकाशित भएको छैन।" },
    "news.readFullArticle": { en: "Read Full Article", ne: "पूरा लेख पढ्नुहोस्" },
    "news.source": { en: "Source", ne: "स्रोत" },
    "news.nepaliTranslation": { en: "Nepali Translation", ne: "नेपाली अनुवाद" },

    // Media Page
    "media.headerTitle": { en: "Media Center", ne: "मिडिया केन्द्र" },
    "media.headerSubtitle": { en: "Explore our journey through press coverage, speeches, and photo galleries.", ne: "प्रेस कभरेज, भाषण र फोटो ग्यालरीहरू मार्फत हाम्रो यात्रा अन्वेषण गर्नुहोस्।" },
    "media.newsSection": { en: "News & Media Coverage", ne: "समाचार र मिडिया कभरेज" },
    "media.videosSection": { en: "Interviews & Speeches", ne: "अन्तर्वार्ता र भाषणहरू" },
    "media.gallerySection": { en: "Photo Gallery", ne: "फोटो ग्यालरी" },

    // Common
    "common.loading": { en: "Loading...", ne: "लोड हुँदैछ..." },
    "common.error": { en: "Something went wrong", ne: "केही गलत भयो" },
    "common.noResults": { en: "No results found", ne: "कुनै परिणाम फेला परेन" },
};

/**
 * Get translation for a key in the specified language.
 * Falls back to English if the key or language is not found.
 */
export function translate(key: TransKey, lang: Lang): string {
    const entry = translations[key];
    if (!entry) {
        console.warn(`Translation key not found: ${key}`);
        return key;
    }
    return entry[lang] ?? entry.en;
}

/**
 * Shorthand helper - can be used with useLanguage hook
 * Example: const T = createT(lang); T("nav.home")
 */
export function createT(lang: Lang) {
    return (key: TransKey) => translate(key, lang);
}
