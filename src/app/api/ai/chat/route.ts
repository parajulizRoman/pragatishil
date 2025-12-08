import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/lib/ai/geminiServer';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages, locale } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
        }

        const response = await chat(messages, locale);

        return NextResponse.json(response);
    } catch (error) {
        console.error("API /chat error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
