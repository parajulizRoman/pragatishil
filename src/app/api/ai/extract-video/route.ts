import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractVideoMetadata } from "@/lib/ai/formCompletion";

export const dynamic = 'force-dynamic';

/**
 * POST /api/ai/extract-video
 * 
 * Extract metadata from a video URL.
 * Requires authentication.
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Check authentication
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse request body
        const body = await request.json();
        const { videoUrl } = body;

        if (!videoUrl) {
            return NextResponse.json({
                error: "videoUrl is required"
            }, { status: 400 });
        }

        // Extract video metadata
        const result = await extractVideoMetadata(videoUrl);

        return NextResponse.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("[API] Video extraction error:", error);
        return NextResponse.json({
            error: "Failed to extract video metadata",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
