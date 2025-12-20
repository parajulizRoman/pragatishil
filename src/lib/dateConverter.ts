/**
 * Date Converter Utilities
 * Converts between AD (Gregorian) and BS (Bikram Sambat) dates
 */

import NepaliDate from 'nepali-date-converter';

/**
 * Convert AD date string (YYYY-MM-DD) to BS date string
 */
export const convertADtoBS = (adDate: string): string => {
    try {
        const [y, m, d] = adDate.split('-').map(Number);
        const bsDate = new NepaliDate(new Date(y, m - 1, d));
        const bsY = bsDate.getYear();
        const bsM = String(bsDate.getMonth() + 1).padStart(2, '0');
        const bsD = String(bsDate.getDate()).padStart(2, '0');
        return `${bsY}-${bsM}-${bsD}`;
    } catch { return ''; }
};

/**
 * Convert BS date string (YYYY-MM-DD) to AD date string
 */
export const convertBStoAD = (bsDate: string): string => {
    try {
        const [y, m, d] = bsDate.split('-').map(Number);
        const adObj = new NepaliDate(y, m - 1, d).toJsDate();
        return adObj.toISOString().split('T')[0];
    } catch { return ''; }
};
