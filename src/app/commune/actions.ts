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

export async function deleteContent(targetId: string, targetType: 'post' | 'thread') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Must be logged in to delete");

    const table = targetType === 'post' ? 'discussion_posts' : 'discussion_threads';
    const ownerCol = targetType === 'post' ? 'author_id' : 'created_by';

    const { data: item, error: fetchError } = await supabase
        .from(table)
        .select(`id, ${ownerCol}`)
        .eq('id', targetId)
        .single();

    if (fetchError || !item) throw new Error("Content not found");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((item as any)[ownerCol] !== user.id) {
        throw new Error("You do not have permission to delete this.");
    }

    const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', targetId);

    if (error) throw new Error(error.message);

    revalidatePath("/commune");
    return { success: true };
}

export async function updateContent(targetId: string, targetType: 'post' | 'thread', newContent: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Must be logged in to edit");

    const table = targetType === 'post' ? 'discussion_posts' : 'discussion_threads';
    const ownerCol = targetType === 'post' ? 'author_id' : 'created_by';

    const updateData: Record<string, string> = {};
    if (targetType === 'post') updateData.content = newContent;
    else updateData.title = newContent;

    const { error } = await supabase
        .from(table)
        .update(updateData)
        .eq('id', targetId)
        .eq(ownerCol, user.id);

    if (error) throw new Error(error.message);

    revalidatePath("/commune");
    return { success: true };
}

// Create a sub-channel under a parent (geographic hierarchy)
export async function createSubChannel(
    parentChannelId: string,
    name: string,
    description?: string
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Must be logged in to create channels");

    // Verify user can create sub-channel (check via DB function)
    const { data: canCreate, error: checkError } = await supabase
        .rpc('can_create_subchannel', {
            p_user_id: user.id,
            p_parent_channel_id: parentChannelId
        });

    if (checkError || !canCreate) {
        throw new Error("You don't have permission to create channels here");
    }

    // Get parent channel info
    const { data: parent } = await supabase
        .from('discussion_channels')
        .select('location_type, location_value')
        .eq('id', parentChannelId)
        .single();

    if (!parent) throw new Error("Parent channel not found");

    // Create slug from name
    const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);

    // Insert sub-channel
    const { data: newChannel, error: insertError } = await supabase
        .from('discussion_channels')
        .insert({
            name,
            slug: `${parent.location_value}-${slug}-${Date.now().toString(36)}`,
            description,
            parent_channel_id: parentChannelId,
            location_type: parent.location_type, // Inherit location type
            location_value: parent.location_value, // Inherit location value
            visibility: 'party_only',
            access_type: 'members',
            can_create_subchannels: false, // Sub-sub-channels not allowed by default
            min_role_to_create_threads: 'party_member'
        })
        .select()
        .single();

    if (insertError) throw new Error(insertError.message);

    // Auto-add creator as incharge of the new channel
    await supabase.from('channel_members').insert({
        channel_id: newChannel.id,
        user_id: user.id,
        role: 'incharge'
    });

    revalidatePath("/commune");
    return { success: true, channelId: newChannel.id };
}

// Get channels with hierarchy (for nested display)
export async function getChannelHierarchy() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // Get user's profile for location filtering
    const { data: profile } = await supabase
        .from('profiles')
        .select('state, district, municipality, ward, role')
        .eq('id', user.id)
        .single();

    // Get all channels user has access to
    const { data: channels } = await supabase
        .from('discussion_channels')
        .select(`
            id, name, slug, description, 
            parent_channel_id, location_type, location_value,
            can_create_subchannels
        `)
        .order('location_type')
        .order('name');

    if (!channels) return [];

    // Build hierarchy tree
    const channelMap = new Map();
    const rootChannels: typeof channels = [];

    channels.forEach(ch => {
        channelMap.set(ch.id, { ...ch, children: [] });
    });

    channels.forEach(ch => {
        const channel = channelMap.get(ch.id);
        if (ch.parent_channel_id && channelMap.has(ch.parent_channel_id)) {
            channelMap.get(ch.parent_channel_id).children.push(channel);
        } else if (!ch.parent_channel_id || ch.location_type === 'central') {
            rootChannels.push(channel);
        }
    });

    return rootChannels;
}

