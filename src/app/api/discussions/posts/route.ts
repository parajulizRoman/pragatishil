import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";
import { NextResponse } from "next/server";
import { DiscussionPost } from "@/types";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const threadId = searchParams.get("thread_id");

        if (!threadId) {
            return NextResponse.json({ error: "Missing thread_id" }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Fetch Posts
        const { data: posts, error } = await supabase
            .from("discussion_posts")
            .select("*")
            .eq("thread_id", threadId)
            .is("deleted_at", null) // Exclude soft-deleted
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching posts:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 2. Fetch Votes for these posts
        if (posts.length > 0) {
            const postIds = posts.map(p => p.id);
            const { data: votes, error: voteError } = await supabase
                .from("discussion_votes")
                .select("post_id, vote_type, user_id")
                .in("post_id", postIds);

            if (voteError) {
                console.error("Error fetching votes:", voteError);
                // Graceful degradation: return posts without vote info
                return NextResponse.json({ posts: posts as DiscussionPost[] });
            }

            // 3. Aggregate Votes
            const postsWithVotes = posts.map(post => {
                const postVotes = votes?.filter(v => v.post_id === post.id) || [];
                const upvotes = postVotes.filter(v => v.vote_type === 1).length;
                const downvotes = postVotes.filter(v => v.vote_type === -1).length;

                let user_vote = 0;
                if (user) {
                    const myVote = postVotes.find(v => v.user_id === user.id);
                    if (myVote) user_vote = myVote.vote_type;
                }

                return {
                    ...post,
                    upvotes,
                    downvotes,
                    user_vote
                };
            });

            return NextResponse.json({ posts: postsWithVotes as DiscussionPost[] });
        }

        return NextResponse.json({ posts: posts as DiscussionPost[] });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // 1. Authenticate
        const { data: { user } } = await supabase.auth.getUser();
        // Note: We do NOT strictly block if !user anymore, because of General Chautari.
        // But we need strict checks if !user.

        // 2. Parse Body
        const body = await request.json();
        const { threadId, content, isAnon } = body;

        // 3. Validation
        if (!threadId || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 4. Permission Check (Crucial for Anon)
        if (!user) {
            // Check if thread's channel allows anonymous posting
            // Use ADMIN client to fetch config because RLS might block 'anon' from reading channels details safely
            const { data: thread } = await supabaseAdmin
                .from("discussion_threads")
                .select(`
                    id,
                    channel_id,
                    channel:discussion_channels (
                        id,
                        visibility,
                        allow_anonymous_posts,
                        min_role_to_post
                    )
                `)
                .eq("id", threadId)
                .single();

            if (!thread || !thread.channel) {
                return NextResponse.json({ error: "Thread not found or access denied" }, { status: 404 });
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const channel = thread.channel as any;

            if (!channel.allow_anonymous_posts) {
                return NextResponse.json({ error: "Anonymous posting not allowed here" }, { status: 403 });
            }

            // Fingerprinting
            const ua = request.headers.get("user-agent") || "unknown";
            // IP extraction typically requires x-forwarded-for or similar in Next.js
            // const ip = request.headers.get("x-forwarded-for") || "unknown_ip"; 
            // Simple mock hash for demo (in production use crypto)
            const fingerprint = `anon-${Date.now()}-${Math.random()}`;

            // Insert using ADMIN client (bypass RLS insert policy for 'anon' which might be restrictive)
            const { data, error } = await supabaseAdmin
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

            if (error) {
                console.error("Error creating anon post:", error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
            return NextResponse.json({ post: data as DiscussionPost });

        } else {
            // User is logged in
            // Use Standard Client (RLS enforced)
            const { data, error } = await supabase
                .from("discussion_posts")
                .insert({
                    thread_id: threadId,
                    content,
                    is_anon: !!isAnon,
                    author_id: user.id
                })
                .select()
                .single();

            if (error) {
                console.error("Error creating post:", error);
                if (error.code === '42501') return NextResponse.json({ error: "Forbidden: You cannot post here." }, { status: 403 });
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
            return NextResponse.json({ post: data as DiscussionPost });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const supabase = await createClient();

        // 1. Authenticate
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const postId = searchParams.get("id");

        if (!postId) {
            return NextResponse.json({ error: "Missing post id" }, { status: 400 });
        }

        // 4. Soft Delete
        // RLS "Posts: Update/Delete own or mod" will enforce permissions
        const { error } = await supabase
            .from("discussion_posts")
            .update({
                deleted_at: new Date().toISOString(),
                deleted_by: user.id
            })
            .eq("id", postId);

        if (error) {
            console.error("Error deleting post:", error);
            if (error.code === '42501') {
                return NextResponse.json({ error: "Forbidden: You cannot delete this post." }, { status: 403 });
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
