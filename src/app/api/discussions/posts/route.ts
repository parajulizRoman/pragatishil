import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";
import { NextResponse } from "next/server";
import { DiscussionPost } from "@/types";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const threadId = searchParams.get("thread_id");
        const userId = searchParams.get("user_id");

        if (!threadId && !userId) {
            return NextResponse.json({ error: "Missing thread_id or user_id" }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Fetch Posts
        let query = supabase
            .from("discussion_posts")
            .select("*, attachments:discussion_post_attachments(id, storage_path, file_name, type), author:profiles!author_id(full_name, avatar_url, role), thread:discussion_threads(title, id)")
            .is("deleted_at", null);

        if (threadId) {
            query = query.eq("thread_id", threadId).order("created_at", { ascending: true });
        } else if (userId) {
            query = query.eq("author_id", userId).order("created_at", { ascending: false });
        }

        const { data: posts, error } = await query;

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

            // 4. Fetch Polls for these posts
            const { data: polls } = await supabase
                .from('discussion_polls')
                .select('id, post_id, question, allow_multiple_votes, expires_at, created_at, options:discussion_poll_options(id, option_text, position)')
                .in('post_id', postIds);

            if (polls && polls.length > 0) {
                // Fetch votes for these polls to calculate percentages
                const pollIds = polls.map(p => p.id);
                const { data: pollVotes } = await supabase
                    .from('discussion_poll_votes')
                    .select('poll_id, option_id, user_id')
                    .in('poll_id', pollIds);

                // Map polls to posts
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const postsWithPolls = postsWithVotes.map((post: any) => {
                    const poll = polls.find(p => p.post_id === post.id);
                    if (!poll) return post;

                    // Calculate results
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const optionsWithStats = poll.options.sort((a: any, b: any) => a.position - b.position).map((opt: any) => {
                        const votesForOption = pollVotes?.filter(v => v.option_id === opt.id) || [];
                        const count = votesForOption.length;
                        // specific user vote
                        const isVoted = user ? votesForOption.some(v => v.user_id === user.id) : false;
                        return { ...opt, count, isVoted };
                    });

                    const totalVotes = pollVotes?.filter(v => v.poll_id === poll.id).length || 0;

                    return {
                        ...post,
                        poll: {
                            ...poll,
                            options: optionsWithStats,
                            total_votes: totalVotes
                        }
                    };
                });
                return NextResponse.json({ posts: postsWithPolls });
            }

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

        // 2. Parse Body
        const body = await request.json();
        const { threadId, content, isAnon, poll } = body;

        // 3. Validation
        if (!threadId || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        let createdPost: DiscussionPost | null = null;

        // 4. Permission Check & Post Creation
        if (!user) {
            // Case A: Anonymous User
            // Check if thread's channel allows anonymous posting
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
            const fingerprint = `anon-${Date.now()}-${Math.random()}`;

            // Insert using ADMIN client
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
            createdPost = data as DiscussionPost;

        } else {
            // Case B: Authenticated User
            // Use Standard Client
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
            createdPost = data as DiscussionPost;
        }

        // 5. Handle Poll Creation
        if (createdPost && poll) {
            const { question, options, allow_multiple, expires_at } = poll;

            if (question && Array.isArray(options) && options.length >= 2) {
                // Use appropriate client
                const client = user ? supabase : supabaseAdmin;
                const creatorId = user ? user.id : null;

                const { data: pollData, error: pollError } = await client
                    .from('discussion_polls')
                    .insert({
                        post_id: (createdPost as any).id,
                        question,
                        allow_multiple_votes: allow_multiple || false,
                        expires_at: expires_at || null,
                        created_by: creatorId
                    })
                    .select()
                    .single();

                if (!pollError && pollData) {
                    // Insert Options
                    const optionsData = options.map((opt: string, idx: number) => ({
                        poll_id: pollData.id,
                        option_text: opt,
                        position: idx
                    }));

                    await client.from('discussion_poll_options').insert(optionsData);

                    // Attach poll to response
                    (createdPost as any).poll = {
                        ...pollData,
                        options: optionsData.map((o: any) => ({ ...o, count: 0, isVoted: false })),
                        total_votes: 0
                    };
                } else {
                    console.error("Error creating poll:", pollError);
                }
            }
        }

        return NextResponse.json({ post: createdPost });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// PUT - Edit post (creator only)
export async function PUT(request: Request) {
    try {
        const supabase = await createClient();

        // 1. Authenticate
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Parse Body
        const body = await request.json();
        const { id, content } = body;

        if (!id || !content) {
            return NextResponse.json({ error: "Missing post id or content" }, { status: 400 });
        }

        // 3. Check ownership - only creator can edit
        const { data: post, error: fetchError } = await supabase
            .from("discussion_posts")
            .select("id, author_id")
            .eq("id", id)
            .single();

        if (fetchError || !post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        if (post.author_id !== user.id) {
            return NextResponse.json({ error: "Forbidden: You can only edit your own posts" }, { status: 403 });
        }

        // 4. Update post
        const { data: updated, error: updateError } = await supabase
            .from("discussion_posts")
            .update({
                content,
                updated_at: new Date().toISOString()
            })
            .eq("id", id)
            .select()
            .single();

        if (updateError) {
            console.error("Error updating post:", updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({ post: updated as DiscussionPost });

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
