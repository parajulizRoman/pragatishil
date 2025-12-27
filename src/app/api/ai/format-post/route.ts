import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// POST /api/ai/format-post
export async function POST(request: NextRequest) {
    try {

        const body = await request.json();
        const { content } = body;

        if (!content || typeof content !== "string") {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        if (content.length > 5000) {
            return NextResponse.json({ error: "Content too long (max 5000 chars)" }, { status: 400 });
        }

        // Initialize Gemini
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "AI not configured" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Use gemini-1.5-flash for speed and cost effectiveness
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are a professional content formatter. Take the following raw text and format it beautifully:

1. Fix any grammar and spelling mistakes
2. Add proper paragraphs and structure
3. Use bullet points where appropriate
4. Keep the same meaning and information
5. Make it more readable and professional
6. If in Nepali, keep it in Nepali
7. If in English, keep it in English
8. Do NOT add any new information - only format what's given
9. Return ONLY the formatted content, no explanations

Raw content:
${content}

Formatted content:`;

        const result = await model.generateContent(prompt);
        const formatted = result.response.text();

        return NextResponse.json({ formatted });
    } catch (error) {
        console.error("AI format error:", error);
        return NextResponse.json(
            { error: "Failed to format content" },
            { status: 500 }
        );
    }
}
