/**
 * BS Date Formatting Utilities
 * Formats Bikram Sambat dates with Nepali numerals and month names
 */

import NepaliDate from 'nepali-date-converter';

// Nepali numerals mapping
const nepaliNumerals: { [key: string]: string } = {
    '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
    '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
};

// Nepali month names
const nepaliMonths = [
    'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज',
    'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फागुन', 'चैत'
];

// English month names for BS
const englishMonths = [
    'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
    'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

/**
 * Convert English numerals to Nepali numerals
 */
export const toNepaliNumerals = (num: number | string): string => {
    return String(num).split('').map(digit => nepaliNumerals[digit] || digit).join('');
};

/**
 * Convert Nepali numerals to English numerals
 */
export const toEnglishNumerals = (nepNum: string): string => {
    const reverseMap: { [key: string]: string } = {};
    Object.entries(nepaliNumerals).forEach(([eng, nep]) => {
        reverseMap[nep] = eng;
    });
    return nepNum.split('').map(digit => reverseMap[digit] || digit).join('');
};

/**
 * Format a Date object or ISO string to BS date string
 * @param date - Date object or ISO string
 * @param format - 'full' | 'short' | 'numeric'
 * @param language - 'ne' | 'en'
 * @returns Formatted BS date string
 */
export const formatBSDate = (
    date: Date | string,
    format: 'full' | 'short' | 'numeric' = 'full',
    language: 'ne' | 'en' = 'ne'
): string => {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const bsDate = new NepaliDate(dateObj);

        const year = bsDate.getYear();
        const month = bsDate.getMonth(); // 0-indexed
        const day = bsDate.getDate();

        if (format === 'numeric') {
            // Format: 2081-09-12 or २०८१-०९-१२
            const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            return language === 'ne' ? toNepaliNumerals(formatted) : formatted;
        }

        if (format === 'short') {
            // Format: 12 Poush 2081 or १२ पौष २०८१
            const monthName = language === 'ne' ? nepaliMonths[month] : englishMonths[month];
            const dayStr = language === 'ne' ? toNepaliNumerals(day) : String(day);
            const yearStr = language === 'ne' ? toNepaliNumerals(year) : String(year);
            return `${dayStr} ${monthName} ${yearStr}`;
        }

        // Full format: 12 Poush 2081, Monday or १२ पौष २०८१, सोमबार
        const monthName = language === 'ne' ? nepaliMonths[month] : englishMonths[month];
        const dayStr = language === 'ne' ? toNepaliNumerals(day) : String(day);
        const yearStr = language === 'ne' ? toNepaliNumerals(year) : String(year);

        // Get day of week
        const weekDays = language === 'ne'
            ? ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहिबार', 'शुक्रबार', 'शनिबार']
            : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = weekDays[dateObj.getDay()];

        return `${dayStr} ${monthName} ${yearStr}, ${dayOfWeek}`;
    } catch (error) {
        console.error('Error formatting BS date:', error);
        return '';
    }
};

/**
 * Get relative date string (Today, Tomorrow, Yesterday, etc.)
 */
export const getRelativeBSDate = (
    date: Date | string,
    language: 'ne' | 'en' = 'ne'
): string => {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const compareDate = new Date(dateObj);
        compareDate.setHours(0, 0, 0, 0);

        const diffTime = compareDate.getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return language === 'ne' ? 'आज' : 'Today';
        if (diffDays === 1) return language === 'ne' ? 'भोलि' : 'Tomorrow';
        if (diffDays === -1) return language === 'ne' ? 'हिजो' : 'Yesterday';
        if (diffDays === 2) return language === 'ne' ? 'पर्सि' : 'Day after tomorrow';

        // For other dates, return formatted BS date
        return formatBSDate(dateObj, 'short', language);
    } catch (error) {
        console.error('Error getting relative BS date:', error);
        return '';
    }
};

/**
 * Format BS date range
 */
export const formatBSDateRange = (
    startDate: Date | string,
    endDate: Date | string,
    language: 'ne' | 'en' = 'ne'
): string => {
    try {
        const start = formatBSDate(startDate, 'short', language);
        const end = formatBSDate(endDate, 'short', language);
        const separator = language === 'ne' ? ' देखि ' : ' to ';
        return `${start}${separator}${end}`;
    } catch (error) {
        console.error('Error formatting BS date range:', error);
        return '';
    }
};

/**
 * Get current BS date
 */
export const getCurrentBSDate = (): { year: number; month: number; day: number } => {
    const bsDate = new NepaliDate(new Date());
    return {
        year: bsDate.getYear(),
        month: bsDate.getMonth() + 1, // 1-indexed
        day: bsDate.getDate()
    };
};

/**
 * Parse BS date string (YYYY-MM-DD) to Date object
 */
export const parseBSDate = (bsDateString: string): Date | null => {
    try {
        const [year, month, day] = bsDateString.split('-').map(Number);
        return new NepaliDate(year, month - 1, day).toJsDate();
    } catch (error) {
        console.error('Error parsing BS date:', error);
        return null;
    }
};
