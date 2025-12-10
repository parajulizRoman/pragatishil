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
    const prompt = `You are a Nepali document reader AI. Read the attached ID Card (Citizenship or Voter ID) carefully.
     Extract the following details as valid JSON:
       - name_ne
       - name_en
       - dob_bs (e.g. 2045/10/12)
       - dob_ad (if available)
       - citizenship_number
       - voter_id_number
       - father_name
       - mother_name
       - spouse_name
       - address_full
       - province
       - district
       - municipality
       - ward
       - gender_raw (Exact text for gender e.g. 'Male', 'Female', 'Purush', 'Mahila')
       - gender_code (Normalize to: 'male', 'female', 'third_gender', 'other')
       - inclusion_clues (Array of strings: any derived ethnicity/caste context from Surname or direct text, e.g. 'Tharu', 'Yadav', 'Sherpa')

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
