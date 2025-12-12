import { NextRequest, NextResponse } from 'next/server';
import { summarizeThread } from '@/lib/ai/geminiServer';
import { createClient } from '@/lib/supabase/server';
import { isAtLeast } from '@/types';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { threadId, title, content } = body;

        if (!threadId) {
            return NextResponse.json({ error: 'Thread ID required' }, { status: 400 });
        }

        const supabase = await createClient();

        // 1. Check if summary already exists
        const { data: thread, error: fetchError } = await supabase
            .from('discussion_threads')
            .select('summary')
            .eq('id', threadId)
            .single();

        if (fetchError) {
            return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
        }

        if (thread?.summary) {
            return NextResponse.json({ summary: thread.summary, cached: true });
        }

        // 2. Check Permissions (Only Admin can trigger generation)
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!profile || !isAtLeast(profile.role, 'admin_party')) { // Check for admin_party or yantrik
            return NextResponse.json({ error: 'Only admins can generate summaries' }, { status: 403 });
        }

        // 3. Generate
        if (!title && !content) return NextResponse.json({ error: 'Content missing for generation' }, { status: 400 });

        const summary = await summarizeThread(title || "", content || "");

        // 4. Save to DB
        await supabase
            .from('discussion_threads')
            .update({ summary })
            .eq('id', threadId);

        return NextResponse.json({ summary });

    } catch (error) {
        console.error("API /ai/summarize error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
