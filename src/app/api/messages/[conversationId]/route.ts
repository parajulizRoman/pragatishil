import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { canReplyToConversation } from "@/lib/roleHierarchy";

/**
 * Get messages for a specific conversation
 * GET /api/messages/[conversationId]
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { conversationId: string } }
) {
    const supabase = await createClient();
    const { conversationId } = params;

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is participant
    const { data: participation } = await supabase
        .from("conversation_participants")
        .select("joined_at")
        .eq("conversation_id", conversationId)
        .eq("user_id", user.id)
        .single();

    if (!participation) {
        return NextResponse.json({ error: "Not a participant" }, { status: 403 });
    }

    // NOTE: Inactivity timeout disabled - all participants can see all messages

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const before = searchParams.get("before"); // cursor for pagination

    // Fetch messages
    let query = supabase
        .from("direct_messages")
        .select(`
            id,
            content,
            created_at,
            is_deleted,
            attachment_url,
            attachment_type,
            attachment_name,
            attachment_size,
            sender:profiles!direct_messages_sender_id_fkey (
                id,
                full_name,
                handle,
                avatar_url
            )
        `)
        .eq("conversation_id", conversationId)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (before) {
        query = query.lt("created_at", before);
    }

    const { data: messages, error } = await query;

    if (error) {
        console.error("Messages fetch error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update last_read_at
    await supabase
        .from("conversation_participants")
        .update({ last_read_at: new Date().toISOString() })
        .eq("conversation_id", conversationId)
        .eq("user_id", user.id);

    // Reverse to show oldest first in UI
    return NextResponse.json({
        messages: (messages || []).reverse(),
        conversationStatus: 'open'
    });
}

/**
 * Send a message to a conversation
 * POST /api/messages/[conversationId]
 * Body: { content: string }
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { conversationId: string } }
) {
    const supabase = await createClient();
    const { conversationId } = params;

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name, handle")
        .eq("id", user.id)
        .single();

    // Check if user can reply to conversations using role hierarchy
    const canMessage = canReplyToConversation(profile?.role || 'guest');
    if (!profile?.role || !canMessage) {
        return NextResponse.json({ error: "Messaging requires ward_committee role or higher" }, { status: 403 });
    }

    // Check if user is participant
    const { data: participation } = await supabase
        .from("conversation_participants")
        .select("joined_at")
        .eq("conversation_id", conversationId)
        .eq("user_id", user.id)
        .single();

    if (!participation) {
        return NextResponse.json({ error: "Not a participant" }, { status: 403 });
    }

    const { content, attachment_url, attachment_type, attachment_name, attachment_size } = await request.json();

    // Either content or attachment is required
    if (!content?.trim() && !attachment_url) {
        return NextResponse.json({ error: "Message content or attachment required" }, { status: 400 });
    }

    // Insert message
    const { data: message, error } = await supabase
        .from("direct_messages")
        .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content: content?.trim() || '',
            attachment_url: attachment_url || null,
            attachment_type: attachment_type || null,
            attachment_name: attachment_name || null,
            attachment_size: attachment_size || null
        })
        .select(`
            id,
            content,
            created_at,
            attachment_url,
            attachment_type,
            attachment_name,
            attachment_size,
            sender:profiles!direct_messages_sender_id_fkey (
                id,
                full_name,
                handle,
                avatar_url
            )
        `)
        .single();

    if (error) {
        console.error("Send message error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update conversation's last_message_at to reset inactivity timer
    await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);

    // Create notification for other participants
    const { data: otherParticipants } = await supabase
        .from("conversation_participants")
        .select("user_id")
        .eq("conversation_id", conversationId)
        .neq("user_id", user.id);

    if (otherParticipants && otherParticipants.length > 0) {
        const notificationBody = attachment_url
            ? `Sent an attachment${content ? `: ${content.slice(0, 30)}...` : ''}`
            : content.length > 50 ? content.slice(0, 50) + '...' : content;

        const notifications = otherParticipants.map(p => ({
            user_id: p.user_id,
            type: 'dm',
            title: `New message from ${profile.full_name || 'Someone'}`,
            body: notificationBody,
            link: `/messages?id=${conversationId}`,
            actor_id: user.id
        }));

        await supabase.from("notifications").insert(notifications);
    }

    return NextResponse.json({ message });
}
