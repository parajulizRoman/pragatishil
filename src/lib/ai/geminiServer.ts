import { GoogleGenAI, Type, Schema } from "@google/genai";

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
    raw_text: string | null;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

// -- Configuration --
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// -- Functions --

/**
 * Parses a Nepali Voter ID or Citizenship card image.
 * @param base64Image Base64 encoded image string (without data prefix if possible, or handle it)
 * @param mimeType Mime type of the image (e.g. image/jpeg)
 */
export async function parseVoterId(base64Image: string, mimeType: string): Promise<VoterIdResult> {
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

    const model = "gemini-2.5-flash";

    const prompt = `You are reading a Nepali national identity document (citizenship card or voter ID).
     Extract the following fields if present:
       - full_name
       - date_of_birth
       - citizenship_number or voter_id_number
       - address_full
       - province
       - district
       - municipality
       - ward
     Return only strict JSON with snake_case keys, no extra text.
     If a field is missing, set it to null.`;

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
            raw_text: { type: Type.STRING, nullable: true, description: "All text found on the card" },
        },
        required: ["full_name"], // Soft requirement
    };

    try {
        // Clean base64 if it comes with data URI prefix
        const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

        const result = await ai.models.generateContent({
            model,
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
 * @param locale Optional locale like 'ne' or 'en'
 */
export async function chat(messages: ChatMessage[], locale: string = 'en'): Promise<{ reply: string }> {
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

    const model = 'gemini-2.5-flash';

    // Transform messages to SDK format
    const history = messages.slice(0, -1).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) throw new Error("No messages provided");

    const systemInstruction = locale === 'ne'
        ? "You are a helpful assistant for Pragatisheel. Answer in Nepali."
        : "You are a helpful assistant for Pragatisheel. Answer in English.";

    const chatSession = ai.chats.create({
        model,
        history,
        config: {
            systemInstruction
        }
    });

    const result = await chatSession.sendMessage({ message: lastMessage.text });

    return {
        reply: result.text || ""
    };
}
