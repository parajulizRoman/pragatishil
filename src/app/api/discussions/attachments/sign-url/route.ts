
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { filename, fileType, sizeBytes } = await request.json();

        // 1. Basic Validation
        if (!filename || !fileType) {
            return NextResponse.json({ error: "Missing file metadata" }, { status: 400 });
        }

        // Limit size (100MB for videos, smaller for other content)
        const MAX_SIZE = 100 * 1024 * 1024;
        if (sizeBytes > MAX_SIZE) {
            return NextResponse.json({ error: "File too large (Max 100MB)" }, { status: 400 });
        }

        // Allowed types (images, documents, videos, audio for Khulla Manch)
        const ALLOWED_TYPES = [
            // Images
            'image/jpeg', 'image/png', 'image/webp', 'image/gif',
            // Documents
            'application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
            'text/plain',
            // Video (for Khulla Manch)
            'video/mp4', 'video/webm', 'video/quicktime',
            // Audio (for Khulla Manch)
            'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/x-m4a', 'audio/aac'
        ];

        // Looping check for wildcard safety or exact match
        if (!ALLOWED_TYPES.includes(fileType)) {
            return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
        }

        // 2. Generate Path
        // path: users/{userId}/{timestamp}-{random}-{clean_filename}
        const cleanName = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const path = `users/${session.user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}-${cleanName}`;

        // 3. Generate Signed Upload URL
        // Used to PUT the file directly to Storage
        const verify = await supabase.storage.from('commune-uploads').createSignedUploadUrl(path);

        if (verify.error) {
            throw verify.error;
        }

        return NextResponse.json({
            uploadUrl: verify.data.signedUrl,
            storagePath: verify.data.path,
            token: verify.data.token
        });

    } catch (error: unknown) {
        console.error("Sign URL Error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
