import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { DiscussionThread, DiscussionPost } from "@/types";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const channelId = searchParams.get("channel_id");
        const threadId = searchParams.get("id");

        const supabase = await createClient();

        if (threadId) {
            // Fetch Single Thread with Channel Config
            const { data: thread, error } = await supabase
                .from("discussion_threads")
                .select(`
                    *,
                    channel:discussion_channels (
                        id,
                        slug,
                        name,
                        visibility,
                        allow_anonymous_posts,
                        min_role_to_post
                    )
                `)
                .eq("id", threadId)
                .single();

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
            return NextResponse.json({ thread });
        }

        if (!channelId) {
            return NextResponse.json({ error: "Missing channel_id or id" }, { status: 400 });
        }

        // Fetch List by Channel (Existing)
        const { data: threads, error } = await supabase
            .from("thread_overviews") // Use View for Stats
            .select("*")
            .eq("channel_id", channelId)
            // .is("deleted_at", null) // View already filters
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching threads:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ threads: threads as DiscussionThread[] });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

import { supabaseAdmin } from "@/lib/supabase/serverAdmin";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // 1. Authenticate (Initial Check)
        const { data: { user } } = await supabase.auth.getUser();

        // 2. Parse Body
        const body = await request.json();
        const { channelId, title, content, isAnon, meta } = body;

        // 3. Validation
        if (!channelId || !title || !content) {
            return NextResponse.json({ error: "Missing required fields (channelId, title, content)" }, { status: 400 });
        }

        // 4. Permission & Insertion Logic
        let threadData: DiscussionThread | null = null;
        let postData: DiscussionPost | null = null;

        if (!user) {
            // --- ANONYMOUS FLOW ---

            // A. Check Channel Config (using Admin to bypass RLS)
            const { data: channel, error: channelError } = await supabaseAdmin
                .from("discussion_channels")
                .select("allow_anonymous_posts, min_role_to_create_threads, visibility")
                .eq("id", channelId)
                .single();

            if (channelError || !channel) {
                return NextResponse.json({ error: "Channel not found or access denied" }, { status: 404 });
            }

            // B. Verify Permissions
            if (channel.min_role_to_create_threads !== 'anonymous') {
                return NextResponse.json({ error: "Anonymous threads not allowed here" }, { status: 403 });
            }

            // C. Insert Thread (Admin)
            const { data: thread, error: threadError } = await supabaseAdmin
                .from("discussion_threads")
                .insert({
                    channel_id: channelId,
                    title,
                    created_by: null, // Anon
                    meta: { ...meta, is_anonymous: true }
                })
                .select()
                .single();

            if (threadError) throw threadError;
            threadData = thread as DiscussionThread;

            // D. Insert Initial Post (Admin)
            // Fingerprint
            const ua = request.headers.get("user-agent") || "unknown";
            const fingerprint = `anon-${Date.now()}-${Math.random()}`;

            const { data: post, error: postError } = await supabaseAdmin
                .from("discussion_posts")
                .insert({
                    thread_id: thread.id,
                    content,
                    is_anon: true,
                    author_id: null,
                    meta: { fingerprint, ua, ip_hash: fingerprint }
                })
                .select()
                .single();

            if (postError) {
                // Rollback thread if post fails
                await supabaseAdmin.from("discussion_threads").delete().eq("id", thread.id);
                throw postError;
            }
            postData = post as DiscussionPost;

        } else {
            // --- AUTHENTICATED FLOW ---
            // RLS handles permissions mostly, but we want to ensure atomicity manually if possible
            // We use the Standard Client.

            // A. Insert Thread
            const { data: thread, error: threadError } = await supabase
                .from("discussion_threads")
                .insert({
                    channel_id: channelId,
                    title,
                    created_by: user.id,
                    meta: meta || {}
                })
                .select()
                .single();

            if (threadError) {
                if (threadError.code === '42501') return NextResponse.json({ error: "Forbidden: You cannot post in this channel." }, { status: 403 });
                throw threadError;
            }
            threadData = thread as DiscussionThread;

            // B. Insert Initial Post
            const { data: post, error: postError } = await supabase
                .from("discussion_posts")
                .insert({
                    thread_id: thread.id,
                    content,
                    is_anon: !!isAnon, // User might choose to be anon in a non-anon-only channel? handled by RLS/Trigger usually, but here explicit
                    author_id: user.id
                })
                .select()
                .single();

            if (postError) {
                // Rollback thread (User might not have delete permission, so this is tricky without RPC)
                // If RLS allows delete own, we can try.
                // If not, we might leave an empty thread. Ideally use RPC. 
                // For now, we try to delete.
                await supabase.from("discussion_threads").delete().eq("id", thread.id);
                throw postError;
            }
            postData = post as DiscussionPost;
        }

        return NextResponse.json({ thread: threadData, post: postData });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error("Error in Thread Creation:", err);
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}
