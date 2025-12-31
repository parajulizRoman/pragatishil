import NepaliDate from 'nepali-date-converter';

export interface MoonCycle {
    name_en: string;
    name_ne: string;
    emoji: string;
    type: 'new' | 'waxing' | 'full' | 'waning' | 'ekadashi';
    tithi: number;
}

export interface AstrologyData {
    tithi: string;
    nakshatra?: string;
    yoga?: string;
    karana?: string;
    sunrise?: string;
    sunset?: string;
    moonCycle: MoonCycle;
    isEkadashi: boolean;
    isPurnima: boolean;
    isAmavasya: boolean;
}

/**
 * Calculate tithi (lunar day) from BS date
 * Tithi ranges from 1-30 in a lunar month
 */
export function calculateTithi(bsDate: NepaliDate): number {
    const day = bsDate.getDate();

    // Simplified tithi calculation based on BS day
    // In reality, tithi doesn't always align with solar day
    // This is an approximation for display purposes

    // Purnima (full moon) is typically around day 15
    // Amavasya (new moon) is typically around day 30/1

    return day;
}

/**
 * Get moon cycle information from BS date
 */
export function getMoonCycle(bsDate: NepaliDate): MoonCycle {
    const tithi = calculateTithi(bsDate);

    // Purnima (Full Moon) - Day 15
    if (tithi === 15) {
        return {
            name_en: 'Purnima',
            name_ne: 'पूर्णिमा',
            emoji: '🌕',
            type: 'full',
            tithi
        };
    }

    // Amavasya (New Moon) - Day 30 or Day 1
    if (tithi === 30 || tithi === 1) {
        return {
            name_en: 'Amavasya',
            name_ne: 'औंसी',
            emoji: '🌑',
            type: 'new',
            tithi
        };
    }

    // Ekadashi - Day 11 and Day 26
    if (tithi === 11 || tithi === 26) {
        return {
            name_en: 'Ekadashi',
            name_ne: 'एकादशी',
            emoji: '🌓',
            type: 'ekadashi',
            tithi
        };
    }

    // Shukla Paksha (Waxing - Days 2-14)
    if (tithi >= 2 && tithi <= 14) {
        return {
            name_en: 'Shukla Paksha',
            name_ne: 'शुक्ल पक्ष',
            emoji: tithi <= 7 ? '🌒' : '🌔',
            type: 'waxing',
            tithi
        };
    }

    // Krishna Paksha (Waning - Days 16-29)
    if (tithi >= 16 && tithi <= 29) {
        return {
            name_en: 'Krishna Paksha',
            name_ne: 'कृष्ण पक्ष',
            emoji: tithi <= 22 ? '🌖' : '🌘',
            type: 'waning',
            tithi
        };
    }

    // Default
    return {
        name_en: 'Unknown',
        name_ne: 'अज्ञात',
        emoji: '🌙',
        type: 'waxing',
        tithi
    };
}

/**
 * Get Nepali tithi name
 */
export function getTithiName(tithi: number, language: 'en' | 'ne' = 'en'): string {
    const tithiNames = {
        en: [
            '', 'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
            'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
            'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
            'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
            'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
            'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'
        ],
        ne: [
            '', 'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी',
            'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
            'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा',
            'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी',
            'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
            'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'औंसी'
        ]
    };

    return tithiNames[language][tithi] || '';
}

/**
 * Calculate sunrise and sunset times for Kathmandu
 * This is a simplified calculation - in production, use a proper astronomical library
 */
export function getSunTimes(date: Date): { sunrise: string; sunset: string } {
    // Kathmandu coordinates: 27.7172° N, 85.3240° E
    // Simplified calculation - actual times vary by season

    const month = date.getMonth();

    // Approximate sunrise/sunset times for Kathmandu by month
    const sunTimes = [
        { sunrise: '06:45', sunset: '17:45' }, // Jan
        { sunrise: '06:40', sunset: '18:00' }, // Feb
        { sunrise: '06:20', sunset: '18:15' }, // Mar
        { sunrise: '05:55', sunset: '18:25' }, // Apr
        { sunrise: '05:35', sunset: '18:40' }, // May
        { sunrise: '05:30', sunset: '18:50' }, // Jun
        { sunrise: '05:35', sunset: '18:50' }, // Jul
        { sunrise: '05:45', sunset: '18:40' }, // Aug
        { sunrise: '05:50', sunset: '18:20' }, // Sep
        { sunrise: '06:00', sunset: '17:55' }, // Oct
        { sunrise: '06:15', sunset: '17:35' }, // Nov
        { sunrise: '06:35', sunset: '17:35' }, // Dec
    ];

    return sunTimes[month];
}

/**
 * Get complete astrology data for a date
 */
export function getAstrologyData(date: Date, language: 'en' | 'ne' = 'en'): AstrologyData {
    const bsDate = new NepaliDate(date);
    const tithi = calculateTithi(bsDate);
    const moonCycle = getMoonCycle(bsDate);
    const sunTimes = getSunTimes(date);

    return {
        tithi: getTithiName(tithi, language),
        moonCycle,
        isEkadashi: tithi === 11 || tithi === 26,
        isPurnima: tithi === 15,
        isAmavasya: tithi === 30 || tithi === 1,
        sunrise: sunTimes.sunrise,
        sunset: sunTimes.sunset,
    };
}

/**
 * Check if a date is a special lunar day
 */
export function isSpecialLunarDay(date: Date): {
    isSpecial: boolean;
    type?: 'ekadashi' | 'purnima' | 'amavasya';
    name_en?: string;
    name_ne?: string;
} {
    const bsDate = new NepaliDate(date);
    const tithi = calculateTithi(bsDate);

    if (tithi === 11 || tithi === 26) {
        return {
            isSpecial: true,
            type: 'ekadashi',
            name_en: 'Ekadashi',
            name_ne: 'एकादशी'
        };
    }

    if (tithi === 15) {
        return {
            isSpecial: true,
            type: 'purnima',
            name_en: 'Purnima',
            name_ne: 'पूर्णिमा'
        };
    }

    if (tithi === 30 || tithi === 1) {
        return {
            isSpecial: true,
            type: 'amavasya',
            name_en: 'Amavasya',
            name_ne: 'औंसी'
        };
    }

    return { isSpecial: false };
}
