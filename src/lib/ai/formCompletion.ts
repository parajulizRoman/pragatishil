import { GoogleGenAI, Type, Schema } from "@google/genai";
import { getPromptByKey } from "@/actions/ai-prompts";
import { replacePromptVariables } from "@/lib/ai/promptUtils";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Default fallback prompt (used if database prompt not available)
const DEFAULT_ARTICLE_PROMPT = `You are an EXPERT TRANSLATOR for Pragatishil Loktantrik Party.

## YOUR ROLE
Provide EXACT, WORD-BY-WORD translations between Nepali and English. Accuracy is CRITICAL.

## CURRENT INPUT
{{context}}

## YOUR TASK
Generate ALL missing fields as JSON:
- title_en, title_ne: Accurate titles (5-15 words)
- body_en, body_ne: COMPLETE word-by-word translations with markdown formatting
- body_en_formatted, body_ne_formatted: Formatted version of provided source content
- summary_en, summary_ne: 2-3 sentence professional summaries
- suggested_tags: 3-5 topic tags (lowercase, underscores)

CRITICAL RULES:
1. Translate EVERY paragraph and sentence - never skip or summarize
2. Translation length must match original (~same word count)
3. Use markdown: ## headings, **bold**, lists, > blockquotes
4. Maintain political party tone and terminology
5. Format source content even if provided as plain text

NEVER truncate - provide COMPLETE translations.`;

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
    body_en_formatted: string | null;  // Formatted version if body_en was provided
    body_ne_formatted: string | null;  // Formatted version if body_ne was provided
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

    // Try to load prompt from database, fall back to default
    let promptTemplate = await getPromptByKey("article_completion");
    if (!promptTemplate) {
        console.log("[AI] Using fallback prompt - DB prompt not available");
        promptTemplate = DEFAULT_ARTICLE_PROMPT;
    }

    // Replace template variables
    const prompt = replacePromptVariables(promptTemplate, {
        context: context.join("\n\n")
    });




    const responseSchema: Schema = {
        type: Type.OBJECT,
        properties: {
            title_en: { type: Type.STRING, nullable: true },
            title_ne: { type: Type.STRING, nullable: true },
            body_en: { type: Type.STRING, nullable: true },
            body_ne: { type: Type.STRING, nullable: true },
            body_en_formatted: { type: Type.STRING, nullable: true },
            body_ne_formatted: { type: Type.STRING, nullable: true },
            summary_en: { type: Type.STRING, nullable: true },
            summary_ne: { type: Type.STRING, nullable: true },
            suggested_tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title_en", "title_ne", "body_en", "body_ne", "body_en_formatted", "body_ne_formatted", "summary_en", "summary_ne", "suggested_tags"]
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
