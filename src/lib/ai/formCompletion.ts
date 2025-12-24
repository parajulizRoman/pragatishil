import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// ===== Types =====

export interface ArticleCompletionInput {
    title?: string;
    title_ne?: string;
    body_en?: string;
    body_ne?: string;
    summary_en?: string;
}

export interface ArticleCompletionResult {
    title_en: string | null;
    title_ne: string | null;
    body_en: string | null;
    body_ne: string | null;
    summary_en: string | null;
    summary_ne: string | null;
    suggested_tags: string[];
}

export interface VideoMetadataResult {
    title: string | null;
    title_ne: string | null;
    description: string | null;
    description_ne: string | null;
    thumbnail_url: string | null;
    duration: string | null;
}

export interface TranslationResult {
    translated_text: string;
}

// ===== Article Completion =====

/**
 * Complete article fields using AI
 * Bidirectional: English → Nepali OR Nepali → English
 */
export async function completeArticle(input: ArticleCompletionInput): Promise<ArticleCompletionResult> {
    const { title, title_ne, body_en, body_ne, summary_en } = input;

    // Build context from available data
    const context = [];
    if (title) context.push(`English Title: ${title}`);
    if (title_ne) context.push(`Nepali Title: ${title_ne}`);
    if (body_en) context.push(`English Body (first 2000 chars):\n${body_en.substring(0, 2000)}`);
    if (body_ne) context.push(`Nepali Body (first 2000 chars):\n${body_ne.substring(0, 2000)}`);
    if (summary_en) context.push(`English Summary: ${summary_en}`);

    if (context.length === 0) {
        throw new Error("At least one field must be provided for AI completion");
    }

    const prompt = `You are a translator and content writer for a Nepali political party website.

CURRENT INPUT:
${context.join("\n\n")}

YOUR TASK: Generate ALL missing fields as JSON. For each field:
- If the field is MISSING from input → Generate it
- If the field is ALREADY in input → Return null

FIELDS TO GENERATE:

1. title_en: English title
   - If Nepali title exists, TRANSLATE it to English
   - If only body content exists, create an appropriate title

2. title_ne: Nepali title  
   - If English title exists, TRANSLATE it to Nepali
   - If only body content exists, create an appropriate title in Nepali

3. body_en: English body content (MARKDOWN FORMATTED)
   - If Nepali body exists, provide a COMPLETE FULL TRANSLATION
   - FORMAT THE CONTENT WITH MARKDOWN:
     * Use ## for section headings
     * Use **bold** for emphasis on key terms
     * Use *italic* for quotes or foreign words
     * Use numbered lists (1. 2. 3.) for sequential points
     * Use bullet lists (- item) for non-sequential points
     * Use proper paragraph breaks between sections
     * Add > blockquotes for important statements
   - Preserve all content and meaning from the original

4. body_ne: Nepali body content (MARKDOWN FORMATTED)
   - If English body exists, provide a COMPLETE FULL TRANSLATION
   - FORMAT THE CONTENT WITH MARKDOWN:
     * Use ## for section headings (in Nepali)
     * Use **bold** for emphasis
     * Use proper paragraph breaks
     * Use numbered and bullet lists where appropriate
   - Preserve all content and meaning from the original

5. summary_en: English summary
   - Generate a SHORT 2-3 sentence summary
   - ALWAYS generate this (never return null)

6. summary_ne: Nepali summary
   - Generate a SHORT 2-3 sentence summary in Nepali
   - ALWAYS generate this (never return null)

7. suggested_tags: Array of 3-5 topic tags in English (lowercase, use underscores)

CRITICAL RULES:
- body_en and body_ne should be WELL-FORMATTED MARKDOWN with headings, lists, emphasis
- Analyze the content structure and apply appropriate formatting
- Break long paragraphs into logical sections with headings
- Use bold for names, organizations, key concepts
- summary_en and summary_ne are plain text (no markdown needed)
- Translations should be natural and fluent`;



    const responseSchema: Schema = {
        type: Type.OBJECT,
        properties: {
            title_en: { type: Type.STRING, nullable: true },
            title_ne: { type: Type.STRING, nullable: true },
            body_en: { type: Type.STRING, nullable: true },
            body_ne: { type: Type.STRING, nullable: true },
            summary_en: { type: Type.STRING, nullable: true },
            summary_ne: { type: Type.STRING, nullable: true },
            suggested_tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title_en", "title_ne", "body_en", "body_ne", "summary_en", "summary_ne", "suggested_tags"]
    };

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema
            }
        });

        if (result.text) {
            return JSON.parse(result.text) as ArticleCompletionResult;
        }
        throw new Error("No response from AI");
    } catch (error) {
        console.error("[AI] Article completion error:", error);
        throw error;
    }
}

// ===== Translation =====

/**
 * Translate text to Nepali
 */
export async function translateToNepali(text: string): Promise<string> {
    if (!text?.trim()) return "";

    const prompt = `Translate the following English text to natural, fluent Nepali. 
Return only the translation, no explanation.

Text: ${text}`;

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: { parts: [{ text: prompt }] }
        });

        return result.text?.trim() || "";
    } catch (error) {
        console.error("[AI] Translation error:", error);
        throw error;
    }
}

/**
 * Translate text to English
 */
export async function translateToEnglish(text: string): Promise<string> {
    if (!text?.trim()) return "";

    const prompt = `Translate the following Nepali text to natural, fluent English. 
Return only the translation, no explanation.

Text: ${text}`;

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: { parts: [{ text: prompt }] }
        });

        return result.text?.trim() || "";
    } catch (error) {
        console.error("[AI] Translation error:", error);
        throw error;
    }
}

// ===== Video Metadata Extraction =====

/**
 * Extract metadata from a video URL (YouTube, Facebook, etc.)
 */
export async function extractVideoMetadata(videoUrl: string): Promise<VideoMetadataResult> {
    // For YouTube, we can use the oEmbed API first
    const youtubeMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);

    if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        try {
            // Try YouTube oEmbed for basic info
            const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
            const response = await fetch(oembedUrl);

            if (response.ok) {
                const data = await response.json();
                const title = data.title || null;

                // Get Nepali translation of title
                let title_ne = null;
                if (title) {
                    title_ne = await translateToNepali(title);
                }

                return {
                    title,
                    title_ne,
                    description: null, // oEmbed doesn't provide description
                    description_ne: null,
                    thumbnail_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                    duration: null
                };
            }
        } catch (e) {
            console.error("[Video] oEmbed fetch failed:", e);
        }
    }

    // Fallback: ask AI to generate title from URL pattern
    const prompt = `Given this video URL: ${videoUrl}
    
Try to extract or suggest:
1. A likely title for the video (based on URL patterns or common naming)
2. A Nepali translation of that title

Return as JSON with fields: title, title_ne, description, description_ne, thumbnail_url, duration (all nullable strings)`;

    const responseSchema: Schema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, nullable: true },
            title_ne: { type: Type.STRING, nullable: true },
            description: { type: Type.STRING, nullable: true },
            description_ne: { type: Type.STRING, nullable: true },
            thumbnail_url: { type: Type.STRING, nullable: true },
            duration: { type: Type.STRING, nullable: true }
        },
        required: ["title", "title_ne"]
    };

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema
            }
        });

        if (result.text) {
            return JSON.parse(result.text) as VideoMetadataResult;
        }
    } catch (error) {
        console.error("[AI] Video metadata error:", error);
    }

    return {
        title: null,
        title_ne: null,
        description: null,
        description_ne: null,
        thumbnail_url: null,
        duration: null
    };
}

// ===== Generate Summary =====

/**
 * Generate a summary from long text
 */
export async function generateSummary(text: string, language: 'en' | 'ne' = 'en'): Promise<string> {
    if (!text?.trim()) return "";

    const langInstruction = language === 'ne'
        ? "Generate a concise 2-3 sentence summary in Nepali."
        : "Generate a concise 2-3 sentence summary in English.";

    const prompt = `${langInstruction}

Text:
${text.substring(0, 4000)}`;

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: { parts: [{ text: prompt }] }
        });

        return result.text?.trim() || "";
    } catch (error) {
        console.error("[AI] Summary generation error:", error);
        throw error;
    }
}
