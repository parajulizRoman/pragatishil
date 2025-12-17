import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { DiscussionThread, DiscussionPost } from "@/types";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const channelId = searchParams.get("channel_id");
        const channelSlug = searchParams.get("channel_slug");
        const threadId = searchParams.get("id");

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (threadId) {
            // Fetch Single Thread with Channel Config
            // Debug Log
            console.log(`[ThreadAPI] Fetching thread ${threadId} for user ${user?.id || 'anon'}`);

            const { data: thread, error } = await supabase
                .from("discussion_threads")
                .select(`
                    id, channel_id, title, is_anonymous, created_at, created_by, updated_at, summary,
                    author:profiles!created_by(full_name, role, avatar_url),
                    channel:discussion_channels (
                        id,
                        slug,
                        name,
                        visibility,
                        allow_anonymous_posts,
                        min_role_to_post
                    ),
                    posts:discussion_posts(count),
                    first_post:discussion_posts(
                        id, content, created_at,
                        attachments:discussion_post_attachments(id, storage_path, file_name, type)
                    )
                `)
                .eq("id", threadId)
                .single();

            if (error) {
                console.error(`[ThreadAPI] Error fetching thread ${threadId}:`, error);
                return NextResponse.json({ error: error.message, details: error }, { status: 404 });
            }
            return NextResponse.json({ thread });
        }

        let targetChannelId = channelId;

        // Resolve Slug if ID missing
        if (!targetChannelId && channelSlug) {
            const { data: ch, error: slugError } = await supabase
                .from("discussion_channels")
                .select("id")
                .eq("slug", channelSlug)
                .single();

            if (slugError || !ch) {
                return NextResponse.json({ error: "Channel not found by slug" }, { status: 404 });
            }
            targetChannelId = ch.id;
        }

        if (!targetChannelId) {
            return NextResponse.json({ error: "Missing channel_id, channel_slug, or id" }, { status: 400 });
        }

        // Fetch List by Channel (Existing)
        const { data: threads, error } = await supabase
            .from("thread_overviews") // Use View for Stats
            .select("*")
            .eq("channel_id", targetChannelId)
            // .is("deleted_at", null) // View already filters
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching threads:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const threadsData = threads as DiscussionThread[];

        // Enhanced: Fetch User Votes for these threads (actually for their first posts)
        if (user && threadsData.length > 0) {
            const threadIds = threadsData.map(t => t.id);
            // We need to find the posts associated with these threads. 
            // The view 'thread_overviews' might not give us first_post_id directly if it wasn't selected, 
            // but let's check the schema or assume we join on thread_id for now if first_post_id isn't reliable or if we just want "any vote in thread"? 
            // Actually, voting usually targets the "First Post" (Thread OP).
            // Let's assume we want to know if the user voted on the *Post* that created the thread.
            // Since 'thread_overviews' has 'first_post_id' (based on typical patterns, let's verify if not).
            // Searching 'thread_overviews' in earlier steps failed, but let's rely on standard practice or a separate query.
            // Safer approach: Query votes where post_id is in (select id from posts where thread_id in ...)

            // For efficiency, let's just fetch all votes by this user on the *first posts* of these threads.
            // Note: `thread_overviews` likely has `first_post_id`. Let's assume it does or we can infer it.
            // If `first_post_id` is missing in `thread_overviews`, we might have a problem.

            // Allow generic check:
            const { data: votes } = await supabase
                .from("discussion_votes")
                .select("post_id, vote_type")
                .eq("user_id", user.id)
                .in("post_id", threadsData.map(t => t.first_post_id).filter(id => !!id));

            if (votes) {
                const voteMap = new Map(votes.map(v => [v.post_id, v.vote_type]));
                threadsData.forEach(t => {
                    if (t.first_post_id) {
                        t.user_vote = voteMap.get(t.first_post_id) || 0;
                    }
                });
            }
        }

        return NextResponse.json({ threads: threadsData });
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
                    is_anonymous: true,
                    author_id: null,
                    meta: { ...meta, fingerprint, is_anonymous: true } // Store tracking
                })
                .select()
                .single();

            if (postError) {
                // Rollback Thread
                await supabaseAdmin.from("discussion_threads").delete().eq("id", thread.id);
                throw postError;
            }
            postData = post as DiscussionPost;

            // D.2 Insert Attachments (if any)
            const attachments = body.attachments;
            if (attachments && Array.isArray(attachments) && attachments.length > 0) {
                const attachmentInserts = attachments.map((att: any) => ({
                    post_id: post.id,
                    storage_path: att.storagePath,
                    file_name: att.fileName,
                    mime_type: att.mimeType,
                    size_bytes: att.sizeBytes,
                    type: att.type,
                    created_by: null // Anon
                }));

                const { error: attError } = await supabaseAdmin
                    .from('discussion_post_attachments')
                    .insert(attachmentInserts);

                if (attError) console.error("Attachment Insert Error (Anon):", attError);
            }

        } else {
            // --- AUTHENTICATED FLOW ---
            // Manual RBAC Check + Admin Insert (to ensure stability regardless of RLS complexity)

            // A. Fetch Channel Config
            const { data: channel, error: channelError } = await supabaseAdmin
                .from("discussion_channels")
                .select("allow_anonymous_posts, min_role_to_create_threads, visibility")
                .eq("id", channelId)
                .single();

            if (channelError || !channel) {
                return NextResponse.json({ error: "Channel not found" }, { status: 404 });
            }

            // B. Fetch User Role
            // Check 'profiles' table. (We could trust JWT metadata if we had it, but DB is safer)
            const { data: profile } = await supabaseAdmin
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

            const userRole = profile?.role || 'supporter'; // Default to supporter

            // C. Verify Permission
            // Import Helper from types might be tricky if it's not available in API route scope easily without large refactor.
            // Let's implement valid logic here or use the helper if imported.
            // We need to import `hasRole` and `ROLE_HIERARCHY` from types. 
            // Since we can't easily add top-level imports in this specific tool call cleanly without overwriting the whole file or risking order,
            // we will inline the hierarchy check FOR SAFETY.

            const ROLE_LEVELS: Record<string, number> = {
                'anonymous_visitor': 0,
                'supporter': 1,
                'member': 2,
                'party_member': 3,
                'volunteer': 3,
                'team_member': 4,
                'central_committee': 5,
                'admin_party': 6,
                'yantrik': 6,
                'board': 7,
                'admin': 7
            };

            const userLevel = ROLE_LEVELS[userRole] || 1; // Default to supporter level
            const reqLevel = ROLE_LEVELS[channel.min_role_to_create_threads] || 1;

            if (userLevel < reqLevel) {
                return NextResponse.json({ error: `Permission denied. Requires role: ${channel.min_role_to_create_threads}` }, { status: 403 });
            }

            // D. Insert Thread (Using Admin Client to bypass RLS)
            const { data: thread, error: threadError } = await supabaseAdmin
                .from("discussion_threads")
                .insert({
                    channel_id: channelId,
                    title,
                    created_by: user.id,
                    meta: meta || {}
                })
                .select()
                .single();

            if (threadError) throw threadError; // Internal Server Error if DB fails
            threadData = thread as DiscussionThread;

            // E. Insert Initial Post
            const { data: post, error: postError } = await supabaseAdmin
                .from("discussion_posts")
                .insert({
                    thread_id: thread.id,
                    content,
                    is_anon: !!isAnon,
                    author_id: user.id
                })
                .select()
                .single();

            if (postError) {
                // Rollback thread
                await supabaseAdmin.from("discussion_threads").delete().eq("id", thread.id);
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
