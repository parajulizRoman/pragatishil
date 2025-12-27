import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { pollId, optionId } = body;

        if (!pollId || !optionId) {
            return NextResponse.json({ error: "Missing pollId or optionId" }, { status: 400 });
        }

        // 1. Fetch Poll details to check settings (allow_multiple, expires)
        const { data: poll, error: pollError } = await supabase
            .from('discussion_polls')
            .select('id, allow_multiple_votes, expires_at')
            .eq('id', pollId)
            .single();

        if (pollError || !poll) {
            return NextResponse.json({ error: "Poll not found" }, { status: 404 });
        }

        // Check expiry
        if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
            return NextResponse.json({ error: "Poll has ended" }, { status: 400 });
        }

        // 2. Handle Voting
        if (!poll.allow_multiple_votes) {
            // Single Vote: Delete any existing vote by this user for this poll
            // Ideally we do this in a transaction or use "upsert" logic if schema supported unique on (poll_id, user_id)
            // But our schema is unique on (poll_id, user_id, option_id). 
            // So we must manually delete other votes if switching.

            // Check existing votes
            const { data: existingVotes } = await supabase
                .from('discussion_poll_votes')
                .select('id, option_id')
                .eq('poll_id', pollId)
                .eq('user_id', user.id);

            if (existingVotes && existingVotes.length > 0) {
                const existingVote = existingVotes[0];
                if (existingVote.option_id === optionId) {
                    // Toggling off / Unvoting if clicking same option
                    await supabase.from('discussion_poll_votes').delete().eq('id', existingVote.id);
                    return NextResponse.json({ success: true, action: 'unvote' });
                } else {
                    // Changing vote
                    await supabase.from('discussion_poll_votes').delete().eq('poll_id', pollId).eq('user_id', user.id);
                }
            }
        } else {
            // Multiple Votes allowed
            // Toggle logic: if voted, unvote. if not, vote.
            const { data: existingVote } = await supabase
                .from('discussion_poll_votes')
                .select('id')
                .eq('poll_id', pollId)
                .eq('user_id', user.id)
                .eq('option_id', optionId)
                .single();

            if (existingVote) {
                await supabase.from('discussion_poll_votes').delete().eq('id', existingVote.id);
                return NextResponse.json({ success: true, action: 'unvote' });
            }
        }

        // Cast Vote
        const { error: insertError } = await supabase
            .from('discussion_poll_votes')
            .insert({
                poll_id: pollId,
                option_id: optionId,
                user_id: user.id
            });

        if (insertError) {
            // Handle unique constraint violation gracefully if race condition
            console.error("Vote Error:", insertError);
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, action: 'vote' });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
