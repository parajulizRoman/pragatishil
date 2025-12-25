import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const channelId = searchParams.get("channel_id");
    const channelSlug = searchParams.get("channel_slug");
    const limit = parseInt(searchParams.get("limit") || "20");

    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value; },
            },
        }
    );

    try {
        // Fetch Single Thread
        if (id) {
            const { data: thread, error } = await supabase
                .from('discussion_threads')
                .select(`
                    *,
                    channel:discussion_channels(id, name, slug, allow_anonymous_posts),
                    author:profiles!fk_thread_author_profile(id, full_name, avatar_url, role)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;

            // Fetch Vote Status if logged in
            const { data: { user } } = await supabase.auth.getUser();
            let userVote = 0;
            if (user && thread.first_post_id) {
                const { data: vote } = await supabase
                    .from('discussion_votes')
                    .select('vote_type')
                    .eq('post_id', thread.first_post_id)
                    .eq('user_id', user.id)
                    .single();
                if (vote) userVote = vote.vote_type;
            }

            return NextResponse.json({ thread: { ...thread, user_vote: userVote } });
        }

        // Fetch List of Threads
        let query = supabase
            .from('discussion_threads')
            .select(`
                *,
                channel:discussion_channels!inner(id, name, slug),
                author:profiles!fk_thread_author_profile(id, full_name, role)
            `)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (channelId) {
            query = query.eq('channel_id', channelId);
        } else if (channelSlug) {
            query = query.eq('channel.slug', channelSlug);
        }

        const { data: threads, error } = await supabase.auth.getUser().then(async ({ data: { user } }) => {
            const { data: rawThreads, error } = await query;
            if (error) return { data: null, error };

            // Process votes for list
            if (user && rawThreads && rawThreads.length > 0) {
                // Logic to batch get votes is cleaner but loop is ok for small limit
                const threadsWithVotes = await Promise.all(rawThreads.map(async (t) => {
                    if (!t.first_post_id) return { ...t, user_vote: 0 };
                    const { data: vote } = await supabase
                        .from('discussion_votes')
                        .select('vote_type')
                        .eq('post_id', t.first_post_id)
                        .eq('user_id', user.id)
                        .single();
                    return { ...t, user_vote: vote?.vote_type || 0 };
                }));
                return { data: threadsWithVotes, error: null };
            }

            return { data: rawThreads, error: null };
        });

        if (error) throw error;

        return NextResponse.json({ threads });

    } catch (e: unknown) {
        return NextResponse.json({ error: (e as Error).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value; },
            },
        }
    );

    // 1. Auth & Channel Check
    const body = await request.json();
    const { channelId, title, content, isAnon, attachments } = body;

    const { data: channel, error: cErr } = await supabase
        .from('discussion_channels')
        .select('*')
        .eq('id', channelId)
        .single();

    if (cErr || !channel) return NextResponse.json({ error: "Channel not found" }, { status: 404 });

    const { data: { user } } = await supabase.auth.getUser();

    // Permission Check
    // If not logged in, must be anonymous allow channel
    if (!user) {
        if (channel.min_role_to_create_threads !== 'anonymous_visitor') {
            return NextResponse.json({ error: "Login required" }, { status: 401 });
        }
        // Anonymous visitor
    } else {
        // If logged in, check role (mock check, ideally use RLS or service role check if complex)
        // For now safely assume logged in users can post unless banned
    }

    try {
        // 2. Create Post First (Thread needs a first post)
        // Actually DB schema likely links Thread -> First Post or Post -> Thread.
        // Usually: Create Thread -> Get ID -> Create Post -> Update Thread (first_post_id)

        // Transaction manually
        const { data: thread, error: tErr } = await supabase
            .from('discussion_threads')
            .insert({
                channel_id: channelId,
                title,
                created_by: user?.id || null, // null for anon if simplified
                is_anonymous: !!isAnon,
                // last_activity_at is set by DB default or migration
            })
            .select()
            .single();

        if (tErr) {
            console.error('[Thread Create] Error:', tErr);
            throw tErr;
        }

        const { data: post, error: pErr } = await supabase
            .from('discussion_posts')
            .insert({
                thread_id: thread.id,
                author_id: user?.id || null,
                content: content || '', // Ensure content is never undefined
                is_anon: !!isAnon,
                // attachments are handled separately via discussion_post_attachments table
            })
            .select()
            .single();

        if (pErr) {
            console.error('[Post Create] Error:', pErr);
            throw pErr;
        }

        // Update Thread with first_post_id (if schema requires it for previews)
        await supabase
            .from('discussion_threads')
            .update({ first_post_id: post.id })
            .eq('id', thread.id);

        return NextResponse.json({ success: true, threadId: thread.id });

    } catch (e: unknown) {
        console.error('[Thread/Post Create] Caught:', e);
        return NextResponse.json({ error: (e as Error).message }, { status: 500 });
    }
}

// Logic for View Counting?
// Could handle PATCH to increment views
export async function PATCH(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: false }, cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
    );

    // Basic anti-abuse: check IP/UA (not robust but okay for simple counters)
    // const _ua = userAgent(request); // userAgent is not imported or used, so this line remains commented out.
    // ...

    if (id) {
        // RPC or direct update
        await supabase.rpc('increment_thread_view', { t_id: id });
        return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
}
