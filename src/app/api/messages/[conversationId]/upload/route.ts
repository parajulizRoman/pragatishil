import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { canReplyToConversation } from "@/lib/roleHierarchy";

// Allowed file types
const ALLOWED_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
];

// Max file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Upload attachment for a message
 * POST /api/messages/[conversationId]/upload
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

    // Check role using role hierarchy
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    const userRole = profile?.role || 'guest';
    if (!canReplyToConversation(userRole)) {
        return NextResponse.json({ error: "Messaging requires ward_committee level or higher" }, { status: 403 });
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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({
            error: "File too large",
            suggestion: "Upload the file to Google Drive and share the link to save space.",
            maxSize: "10MB"
        }, { status: 413 });
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({
            error: "File type not allowed",
            allowedTypes: "Images, PDFs, Word documents"
        }, { status: 400 });
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'bin';
    const fileName = `${conversationId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from("dm-attachments")
        .upload(fileName, file, {
            contentType: file.type,
            upsert: false
        });

    if (uploadError) {
        console.error("Upload error:", uploadError);
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from("dm-attachments")
        .getPublicUrl(uploadData.path);

    return NextResponse.json({
        url: publicUrl,
        name: file.name,
        type: file.type,
        size: file.size
    });
}
