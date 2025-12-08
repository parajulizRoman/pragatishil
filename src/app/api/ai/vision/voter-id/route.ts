import { NextRequest, NextResponse } from 'next/server';
import { parseVoterId } from '@/lib/ai/geminiServer';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('image');

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const mimeType = file.type || 'image/jpeg';

        const result = await parseVoterId(base64, mimeType);

        return NextResponse.json(result);
    } catch (error) {
        console.error("API /vision/voter-id error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
