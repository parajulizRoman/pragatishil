/**
 * Nepali (Devanagari) ↔ English (Roman) Transliteration
 * 
 * This is a basic transliteration system for names.
 * It converts between Devanagari script and romanized text.
 */

// Devanagari to Roman mapping
const devanagariToRoman: Record<string, string> = {
    // Vowels
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo',
    'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'ऋ': 'ri',

    // Vowel matras (diacritics)
    'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ृ': 'ri',

    // Consonants
    'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga',
    'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nya',
    'ट': 'ta', 'ठ': 'tha', 'ड': 'da', 'ढ': 'dha', 'ण': 'na',
    'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
    'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
    'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'wa', 'श': 'sha',
    'ष': 'sha', 'स': 'sa', 'ह': 'ha',

    // Special characters
    'ं': 'n', // Anusvara
    'ँ': 'n', // Chandrabindu
    '्': '',  // Halant (virama) - removes inherent 'a'
    'ः': 'h', // Visarga

    // Numbers
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',

    // Common conjuncts
    'क्ष': 'ksha', 'त्र': 'tra', 'ज्ञ': 'gya', 'श्र': 'shra',
};

// Roman to Devanagari mapping (reverse + common patterns)
const romanToDevanagari: Record<string, string> = {
    // Multi-char patterns first (order matters)
    'ksha': 'क्ष', 'tra': 'त्र', 'gya': 'ज्ञ', 'shra': 'श्र',
    'kha': 'ख', 'gha': 'घ', 'nga': 'ङ',
    'cha': 'च', 'chha': 'छ', 'jha': 'झ', 'nya': 'ञ',
    'tha': 'ठ', 'dha': 'ध',
    'pha': 'फ', 'bha': 'भ',
    'sha': 'श',

    // Two-char patterns
    'aa': 'ा', 'ee': 'ी', 'oo': 'ू', 'ai': 'ै', 'au': 'ौ',
    'ka': 'क', 'ga': 'ग', 'ja': 'ज', 'ta': 'त', 'da': 'द',
    'na': 'न', 'pa': 'प', 'ba': 'ब', 'ma': 'म', 'ya': 'य',
    'ra': 'र', 'la': 'ल', 'wa': 'व', 'va': 'व', 'sa': 'स', 'ha': 'ह',
    'ri': 'ृ',

    // Single chars
    'a': 'अ', 'i': 'इ', 'u': 'उ', 'e': 'े', 'o': 'ो',
    'k': 'क्', 'g': 'ग्', 'j': 'ज्', 't': 'त्', 'd': 'द्',
    'n': 'न्', 'p': 'प्', 'b': 'ब्', 'm': 'म्', 'y': 'य्',
    'r': 'र्', 'l': 'ल्', 'w': 'व्', 'v': 'व्', 's': 'स्', 'h': 'ह्',
};

/**
 * Converts Devanagari text to Roman/English
 */
export function devanagariToEnglish(text: string): string {
    if (!text) return '';

    let result = '';
    let i = 0;

    while (i < text.length) {
        // Check for conjuncts (2-3 chars)
        const threeChar = text.substring(i, i + 3);
        const twoChar = text.substring(i, i + 2);
        const oneChar = text[i];

        if (devanagariToRoman[threeChar]) {
            result += devanagariToRoman[threeChar];
            i += 3;
        } else if (devanagariToRoman[twoChar]) {
            result += devanagariToRoman[twoChar];
            i += 2;
        } else if (devanagariToRoman[oneChar]) {
            result += devanagariToRoman[oneChar];
            i += 1;
        } else if (oneChar === ' ') {
            result += ' ';
            i += 1;
        } else {
            // Keep unknown characters as-is
            result += oneChar;
            i += 1;
        }
    }

    // Clean up: remove double 'a' from consonant+matra combinations
    result = result.replace(/aa+/g, 'aa');

    // Capitalize first letter of each word for names
    result = result.replace(/\b\w/g, c => c.toUpperCase());

    return result;
}

/**
 * Converts Roman/English text to Devanagari
 */
export function englishToDevanagari(text: string): string {
    if (!text) return '';

    const lowerText = text.toLowerCase();
    let result = '';
    let i = 0;

    // Sort patterns by length (longest first)
    const patterns = Object.keys(romanToDevanagari).sort((a, b) => b.length - a.length);

    while (i < lowerText.length) {
        let matched = false;

        for (const pattern of patterns) {
            if (lowerText.substring(i, i + pattern.length) === pattern) {
                result += romanToDevanagari[pattern];
                i += pattern.length;
                matched = true;
                break;
            }
        }

        if (!matched) {
            // Keep unknown characters as-is (spaces, punctuation)
            result += lowerText[i];
            i += 1;
        }
    }

    return result;
}

/**
 * Detects if text is primarily Devanagari
 */
export function isDevanagari(text: string): boolean {
    if (!text) return false;
    const devanagariRegex = /[\u0900-\u097F]/;
    return devanagariRegex.test(text);
}

/**
 * Auto-transliterates based on detected script
 */
export function transliterate(text: string, targetScript: 'roman' | 'devanagari'): string {
    if (targetScript === 'roman') {
        return devanagariToEnglish(text);
    } else {
        return englishToDevanagari(text);
    }
}
