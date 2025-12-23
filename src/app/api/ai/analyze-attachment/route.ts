import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeDocumentFromUrl } from "@/lib/ai/geminiServer";

export const dynamic = 'force-dynamic';

/**
 * POST /api/ai/analyze-attachment
 * 
 * Analyze an attachment (image or document) and extract content.
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
        const { attachmentUrl } = body;

        if (!attachmentUrl) {
            return NextResponse.json({
                error: "attachmentUrl is required"
            }, { status: 400 });
        }

        // Analyze the document/image
        const result = await analyzeDocumentFromUrl(attachmentUrl);

        return NextResponse.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("[API] Attachment analysis error:", error);
        return NextResponse.json({
            error: "Failed to analyze attachment",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
