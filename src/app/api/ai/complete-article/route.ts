import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { completeArticle, ArticleCompletionInput } from "@/lib/ai/formCompletion";

export const dynamic = 'force-dynamic';

/**
 * POST /api/ai/complete-article
 * 
 * Complete article fields using AI.
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
        const { title, title_ne, body_en, body_ne, summary_en } = body;

        // Validate - at least one field required
        if (!title && !title_ne && !body_en && !body_ne && !summary_en) {
            return NextResponse.json({
                error: "At least one field (title, title_ne, body_en, body_ne, or summary_en) is required"
            }, { status: 400 });
        }

        const input: ArticleCompletionInput = {
            title,
            title_ne,
            body_en,
            body_ne,
            summary_en
        };

        // Call AI completion
        const result = await completeArticle(input);

        return NextResponse.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("[API] Article completion error:", error);
        return NextResponse.json({
            error: "Failed to complete article",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
