import { NextRequest, NextResponse } from 'next/server';
import { analyzeDocumentFromUrl } from '@/lib/ai/geminiServer';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const url = body.url || body.documentUrl;

        if (!url) {
            return NextResponse.json({ error: 'Document URL is required' }, { status: 400 });
        }

        console.log("[AI:analyze-document] Starting analysis for:", url);

        const result = await analyzeDocumentFromUrl(url);

        console.log("[AI:analyze-document] Analysis complete:", result);

        return NextResponse.json(result);

    } catch (error) {
        console.error("[AI:analyze-document] Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
