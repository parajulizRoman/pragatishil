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

    const prompt = `You are an EXPERT TRANSLATOR working for **Pragatishil Loktantrik Party (प्रगतिशील लोकतान्त्रिक पार्टी)**, a political party in Nepal.

## YOUR ROLE
You provide EXACT, WORD-BY-WORD translations between Nepali and English. This is an official political party website - accuracy is CRITICAL.

## CURRENT INPUT
${context.join("\n\n")}

## YOUR TASK
Generate ALL missing fields as JSON. Follow these STRICT rules:

---

### TRANSLATION RULES (CRITICAL - READ CAREFULLY)

**For body_en and body_ne (COMPLETE WORD-BY-WORD TRANSLATION):**

1. **PARAGRAPH-BY-PARAGRAPH MATCHING**
   - Count paragraphs in the source
   - Your translation MUST have the SAME number of paragraphs
   - Each paragraph must translate the corresponding source paragraph COMPLETELY

2. **SENTENCE-BY-SENTENCE ACCURACY**
   - Translate EVERY sentence - do not skip ANY
   - Do not summarize or shorten ANYTHING
   - Do not add new content that wasn't in the original
   - Preserve the exact meaning and tone

3. **LENGTH VERIFICATION**
   - Your translation should be approximately the SAME LENGTH as the original
   - If the original has 500 words, your translation should have ~450-550 words
   - If something is missing, GO BACK and add it

4. **MARKDOWN FORMATTING**
   - Use ## for section headings
   - Use **bold** for important terms, names, organizations
   - Use numbered lists (1. 2. 3.) for sequential items
   - Use bullet lists (- item) for unordered items
   - Use > blockquotes for important declarations

5. **POLITICAL PARTY TONE**
   - Use formal, professional language appropriate for an official party website
   - Maintain the political rhetoric and messaging of the original
   - Preserve party-specific terminology

---

### TITLE RULES

**For title_en and title_ne:**
- Must accurately reflect the content of the article
- Be concise but informative (5-15 words ideal)
- Use formal political language
- If translating: word-by-word translation of the title
- If generating: create a title that captures the main message

---

### SUMMARY RULES

**For summary_en and summary_ne:**
- Generate a 2-3 sentence executive summary
- Cover: WHO, WHAT, WHY (the key message)
- Use formal political party communication style
- Must be accurate to the content - no exaggeration
- This is for a political party website - be professional

---

### FIELDS TO GENERATE

| Field | Description |
|-------|-------------|
| title_en | English title (translate or generate) |
| title_ne | Nepali title (translate or generate) |
| body_en | Complete word-by-word English translation with markdown |
| body_ne | Complete word-by-word Nepali translation with markdown |
| summary_en | 2-3 sentence professional summary in English |
| summary_ne | 2-3 sentence professional summary in Nepali |
| suggested_tags | 3-5 topic tags (lowercase, underscores) |

---

### SELF-VERIFICATION CHECKLIST (DO THIS BEFORE RESPONDING)

Before returning your response, verify:
□ Did I translate EVERY paragraph?
□ Did I translate EVERY sentence?
□ Is my translation length similar to the original?
□ Did I preserve the political messaging and tone?
□ Are titles accurate to the content?
□ Are summaries professional and factual?

If any check fails, GO BACK and fix it.

---

### RESPONSE FORMAT

Return JSON with null for fields already provided in input.
NEVER truncate or summarize body content - provide COMPLETE translations.`;




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
