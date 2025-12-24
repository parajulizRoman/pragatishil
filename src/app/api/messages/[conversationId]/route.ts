import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Roles that can initiate AND reply to messages
const MESSAGING_ROLES = ['party_member', 'team_member', 'central_committee', 'board', 'admin_party', 'admin', 'yantrik'];

// Roles that can ONLY reply (not initiate)
const REPLY_ONLY_ROLES = ['member'];

// Roles with full history access (no inactivity timeout)
const LEADERSHIP_ROLES = ['central_committee', 'board', 'admin_party', 'admin', 'yantrik'];

// Inactivity timeout in minutes for lower-rank members
const INACTIVITY_MINUTES = 5;

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

    // Get user role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    const userRole = profile?.role || 'guest';
    const hasFullAccess = LEADERSHIP_ROLES.includes(userRole);

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

    // Get conversation details including last_message_at
    const { data: conversation } = await supabase
        .from("conversations")
        .select("last_message_at, status")
        .eq("id", conversationId)
        .single();

    // Check inactivity for non-leadership roles
    let isExpired = false;
    let timeRemainingMs = 0;

    if (!hasFullAccess && conversation?.last_message_at) {
        const lastMessageTime = new Date(conversation.last_message_at).getTime();
        const now = Date.now();
        const expiresAt = lastMessageTime + (INACTIVITY_MINUTES * 60 * 1000);
        timeRemainingMs = expiresAt - now;
        isExpired = timeRemainingMs <= 0;
    }

    // If expired for this user, return empty with status
    if (isExpired) {
        return NextResponse.json({
            messages: [],
            conversationStatus: 'closed',
            reason: 'Conversation inactive for more than 5 minutes'
        });
    }

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
        conversationStatus: 'open',
        timeRemainingMs: hasFullAccess ? null : timeRemainingMs
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

    // Allow messaging roles AND reply-only roles (member can reply but not initiate)
    const canMessage = MESSAGING_ROLES.includes(profile?.role) || REPLY_ONLY_ROLES.includes(profile?.role);
    if (!profile?.role || !canMessage) {
        return NextResponse.json({ error: "Messaging requires member role or higher" }, { status: 403 });
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
