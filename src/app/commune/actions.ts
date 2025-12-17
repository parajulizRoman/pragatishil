/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function flagContent(targetId: string, targetType: 'post' | 'thread', reason: string) {
    console.log(`[flagContent] START: targetId=${targetId}, type=${targetType}, reason=${reason}`);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.error("[flagContent] ERROR: User not logged in");
        throw new Error("You must be logged in to report content.");
    }
    console.log(`[flagContent] User: ${user.id}`);

    // 1. Insert Flag
    const { error } = await supabase.from("discussion_flags").insert({
        target_id: targetId,
        target_type: targetType,
        flagged_by: user.id,
        reason: reason,
        resolved: false
    });

    if (error) {
        // Detailed error logging
        console.error("[flagContent] SUPABASE INSERT ERROR:", JSON.stringify(error, null, 2));
        throw new Error(error.message || "Failed to report content.");
    }
    console.log("[flagContent] SUCCESS: Flag inserted");

    // 2. Automod Logic: Count flags
    // If > threshold, hide content (bury it)
    const THRESHOLD = 3;

    const { count, error: countError } = await supabase
        .from("discussion_flags")
        .select("*", { count: 'exact', head: true })
        .eq("target_id", targetId)
        .eq("target_type", targetType);

    if (!countError && count && count >= THRESHOLD) {
        // Bury it
        const table = targetType === 'post' ? 'discussion_posts' : 'discussion_threads';
        await supabase
            .from(table)
            .update({ buried_at: new Date().toISOString() })
            .eq("id", targetId);
    }

    revalidatePath("/commune");
    return { success: true };
}

export async function votePost(postId: string, voteType: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("You must be logged in to vote.");
    }

    if (![1, -1].includes(voteType)) {
        throw new Error("Invalid vote type.");
    }

    // Check if vote exists
    const { data: existingVote, error: fetchError } = await supabase
        .from("discussion_votes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is 'not found'
        console.error("Fetch vote error", fetchError);
    }

    if (existingVote) {
        if (existingVote.vote_type === voteType) {
            // Toggle off (remove vote)
            const { error } = await supabase
                .from("discussion_votes")
                .delete()
                .eq("id", existingVote.id);
            if (error) throw new Error("Failed to remove vote");
            return { success: true, action: 'removed' };
        } else {
            // Change vote (update)
            const { error } = await supabase
                .from("discussion_votes")
                .update({ vote_type: voteType })
                .eq("id", existingVote.id);
            if (error) throw new Error("Failed to update vote");
            return { success: true, action: 'updated' };
        }
    } else {
        // Insert new vote
        const { error } = await supabase
            .from("discussion_votes")
            .insert({
                post_id: postId,
                user_id: user.id,
                vote_type: voteType
            });
        if (error) throw new Error("Failed to cast vote");
        return { success: true, action: 'inserted' };
    }
}

export async function toggleThreadInteraction(threadId: string, action: 'follow' | 'save' | 'hide') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Must be logged in");

    const tableMap = {
        'follow': 'discussion_follows',
        'save': 'discussion_saves',
        'hide': 'discussion_hides'
    };
    const table = tableMap[action];

    // Check if exists
    const { data: existing, error: fetchError } = await supabase
        .from(table)
        .select("*")
        .eq("thread_id", threadId)
        .eq("user_id", user.id)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
        console.error(`Error fetching ${action}`, fetchError);
        throw new Error(`Failed to check ${action} status`);
    }

    if (existing) {
        // Remove
        await supabase.from(table).delete().eq("user_id", user.id).eq("thread_id", threadId);
        return { success: true, status: false };
    } else {
        // Add
        await supabase.from(table).insert({ user_id: user.id, thread_id: threadId });
        return { success: true, status: true };
    }
}

export async function toggleReaction(postId: string, emoji: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Must be logged in to react");

    // Check if exists
    const { data: existing, error: fetchError } = await supabase
        .from("discussion_reactions")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .eq("emoji", emoji)
        .single();

    if (existing) {
        // Remove
        await supabase.from("discussion_reactions").delete().eq("id", existing.id);
        return { success: true, status: 'removed' };
    } else {
        // Add
        await supabase.from("discussion_reactions").insert({
            post_id: postId,
            user_id: user.id,
            emoji
        });
        return { success: true, status: 'added' };
    }
}
