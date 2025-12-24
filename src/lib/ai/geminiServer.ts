import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Basic chat message type
export interface ChatMessage {
    role: "user" | "model";
    parts: { text: string }[];
}

// -- Types --
export interface VoterIdResult {
    full_name: string | null;
    date_of_birth: string | null;
    citizenship_number: string | null;
    voter_id_number: string | null;
    address_full: string | null;
    province: string | null;
    district: string | null;
    municipality: string | null;
    ward: string | null;

    // New Fields
    gender_raw: string | null;
    gender_code: 'male' | 'female' | 'third_gender' | 'other' | null;
    inclusion_clues: string[] | null; // Inferred from surname or context

    raw_text: string | null;
}

// ... existing code ...

export async function parseVoterId(base64Image: string, imgMimeType: string): Promise<VoterIdResult> {
    const prompt = `You are an expert Nepali document reader AI. Analyze this ID document (Citizenship card, Voter ID, or National ID) carefully.

IMPORTANT: Extract ALL fields even if they appear in Nepali (Devanagari) script. Convert Nepali numbers to Arabic numerals.

Required fields to extract:
1. full_name / name_en - Full name in English (transliterate if in Nepali)
2. name_ne - Name in Nepali (if visible)
3. date_of_birth / dob_bs - Date of birth in BS (Bikram Sambat), format: YYYY/MM/DD or YYYY-MM-DD
4. dob_ad - Date in AD if available
5. citizenship_number - The citizenship number (नागरिकता नं., often like "123-456-78901" or similar)  
6. voter_id_number - Voter ID number if on the document

ADDRESS - Extract carefully:
7. address_full - Complete address as written
8. province - Province/प्रदेश (1-7 or name like "Bagmati", "Koshi", etc.)
   - If document is old format without province, INFER from old district list:
     * Province 1 (Koshi): Bhojpur, Dhankuta, Ilam, Jhapa, Khotang, Morang, Okhaldhunga, Panchthar, Sankhuwasabha, Solukhumbu, Sunsari, Taplejung, Terhathum, Udayapur
     * Province 2 (Madhesh): Bara, Dhanusha, Mahottari, Parsa, Rautahat, Saptari, Sarlahi, Siraha
     * Bagmati: Bhaktapur, Chitwan, Dhading, Dolakha, Kathmandu, Kavrepalanchok, Lalitpur, Makwanpur, Nuwakot, Ramechhap, Rasuwa, Sindhuli, Sindhupalchok
     * Gandaki: Baglung, Gorkha, Kaski, Lamjung, Manang, Mustang, Myagdi, Nawalpur, Parbat, Syangja, Tanahun
     * Lumbini: Arghakhanchi, Banke, Bardiya, Dang, Eastern Rukum, Gulmi, Kapilvastu, Nawalparasi West, Palpa, Pyuthan, Rolpa, Rupandehi
     * Karnali: Dailekh, Dolpa, Humla, Jajarkot, Jumla, Kalikot, Mugu, Salyan, Surkhet, Western Rukum
     * Sudurpashchim: Achham, Baitadi, Bajhang, Bajura, Dadeldhura, Darchula, Doti, Kailali, Kanchanpur
9. district - District/जिल्ला name
10. municipality - Municipality (नगरपालिका/गाउँपालिका) name - Look for words ending in "नगरपालिका", "गाँउपालिका", "Municipality", "Rural Municipality" 
11. ward - Ward number (वडा नं.) - Usually a number like ५ or 5

DEMOGRAPHICS:
12. gender_raw - Exact text for gender (e.g., "Male", "Female", "Purush", "Mahila", "पुरुष", "महिला")
13. gender_code - Normalize to: 'male', 'female', 'third_gender', 'other'
14. inclusion_clues - Array of ethnicity/caste hints from surname (e.g., ['Tamang'], ['Rai'], ['Yadav'])

15. raw_text - All readable text on the document

Return ONLY valid JSON with snake_case keys. If a field is not visible or cannot be extracted, set it to null.
Do NOT leave citizenship_number as null if you can see any ID number - old cards show it differently.`;

    const responseSchema: Schema = {
        type: Type.OBJECT,
        properties: {
            full_name: { type: Type.STRING, nullable: true },
            date_of_birth: { type: Type.STRING, nullable: true },
            citizenship_number: { type: Type.STRING, nullable: true },
            voter_id_number: { type: Type.STRING, nullable: true },
            address_full: { type: Type.STRING, nullable: true },
            province: { type: Type.STRING, nullable: true },
            district: { type: Type.STRING, nullable: true },
            municipality: { type: Type.STRING, nullable: true },
            ward: { type: Type.STRING, nullable: true },

            gender_raw: { type: Type.STRING, nullable: true },
            gender_code: { type: Type.STRING, enum: ['male', 'female', 'third_gender', 'other'], nullable: true },
            inclusion_clues: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },

            raw_text: { type: Type.STRING, nullable: true, description: "All text found on the card" },
        },
        required: ["full_name"], // Soft requirement
    };

    try {
        // Clean base64 if it comes with data URI prefix
        const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: {
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType: imgMimeType, data: cleanBase64 } }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        if (result.text) {
            return JSON.parse(result.text) as VoterIdResult;
        }
        throw new Error("No structured text returned from Gemini");
    } catch (error) {
        console.error("Voter ID Parsing Error:", error);
        throw error;
    }
}

/**
 * Single turn or multi-turn chat.
 * @param messages List of history { role, text }
// Basic chat message type
export interface ChatMessage {
    role: "user" | "model";
    parts: { text: string }[];
}

/**
 * Chat with Gemini
 */
export async function chat(messages: ChatMessage[], locale: string = 'en'): Promise<{ reply: string }> {
    if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set");

    const model = 'gemini-2.0-flash';

    // Convert history to SDK format
    const history = messages.slice(0, -1).map(m => ({
        role: m.role,
        parts: m.parts
    }));

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || !lastMessage.parts[0]?.text) {
        throw new Error("No valid message provided");
    }

    const systemInstruction = locale === 'ne'
        ? "You are a helpful assistant for Pragatisheel. Answer in Nepali."
        : "You are a helpful assistant for Pragatisheel. Answer in English.";

    const chatSession = ai.chats.create({
        model,
        history,
        config: { systemInstruction }
    });


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await chatSession.sendMessage(lastMessage.parts[0].text as any);

    return {
        reply: result.text || ""
    };
}

export async function summarizeThread(title: string, content: string): Promise<string> {
    const prompt = `You are a helpful community moderator. Summarize the following discussion thread into a concise, neutral paragraph (max 3-4 sentences). 
    Focus on the main arguments and consensus if any.
    
    Thread Title: ${title}
    
    Discussion Content:
    ${content}
    
    Summary:`;

    const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: {
            parts: [{ text: prompt }]
        }
    });

    return result.text || "Could not generate summary.";
}

// -- Document Analysis for Media Gallery --
export interface DocumentAnalysisResult {
    title: string;
    title_ne: string;
    alt_text: string;
    caption_en: string;
    caption_ne: string;
    document_type: string;
    key_topics: string[];
}

/**
 * Analyze a document (PDF or image) and extract metadata for media gallery
 */
export async function analyzeDocument(base64Data: string, mimeType: string): Promise<DocumentAnalysisResult> {
    const prompt = `You are analyzing a document (could be a PDF, scanned image, or photo of a document) for a Nepali political party's media gallery.

Extract the following information:
1. title: A concise title for this document (max 100 chars, in English)
2. title_ne: Nepali title for this document (नेपालीमा शीर्षक)
3. alt_text: SEO-friendly description for accessibility (max 150 chars, in English)
4. caption_en: Brief English caption describing the document (2-3 sentences)
5. caption_ne: Nepali translation of the caption (नेपाली विवरण)
6. document_type: What type of document is this? (e.g., "letter", "report", "certificate", "notice", "press_release", "pamphlet", "other")
7. key_topics: Array of 3-5 key topics/keywords found in the document

If the document is in Nepali, extract the original Nepali title for title_ne, and translate to English for title.
If the document is in English, provide title in English and translate to Nepali for title_ne.
If you cannot read the document clearly, provide your best guess based on visible elements.

Return valid JSON only.`;

    const responseSchema: Schema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            title_ne: { type: Type.STRING },
            alt_text: { type: Type.STRING },
            caption_en: { type: Type.STRING },
            caption_ne: { type: Type.STRING },
            document_type: { type: Type.STRING },
            key_topics: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["title", "title_ne", "alt_text", "caption_en", "caption_ne"],
    };

    try {
        const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, "");

        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: {
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType, data: cleanBase64 } }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        if (result.text) {
            return JSON.parse(result.text) as DocumentAnalysisResult;
        }
        throw new Error("No structured response from Gemini");
    } catch (error) {
        console.error("[AI] Document Analysis Error:", error);
        throw error;
    }
}

/**
 * Analyze document from URL (downloads and processes)
 */
export async function analyzeDocumentFromUrl(url: string): Promise<DocumentAnalysisResult> {
    // Fetch the file
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    // Determine mime type
    let mimeType = contentType;
    if (url.endsWith('.pdf')) mimeType = 'application/pdf';
    else if (url.endsWith('.jpg') || url.endsWith('.jpeg')) mimeType = 'image/jpeg';
    else if (url.endsWith('.png')) mimeType = 'image/png';
    else if (url.endsWith('.heic')) mimeType = 'image/heic';

    return analyzeDocument(base64, mimeType);
}
