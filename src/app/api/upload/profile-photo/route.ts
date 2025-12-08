import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("image") as File;

        if (!file) {
            return NextResponse.json({ error: "No image file provided" }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "File must be an image" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const timestamp = Date.now();
        // Clean filename: remove special chars, spaces, etc.
        const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
        const filePath = `${timestamp}-${cleanName}`;
        const BUCKET_NAME = "member-photos";

        const { error } = await supabaseAdmin.storage
            .from(BUCKET_NAME)
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (error) {
            console.error("Supabase Storage Upload Error:", error);
            throw new Error("Failed to upload image to storage");
        }

        // Generate Public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        return NextResponse.json({ imageUrl: publicUrl }, { status: 200 });

    } catch (error) {
        console.error("API /upload/profile-photo error:", error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : "Internal Server Error"
        }, { status: 500 });
    }
}
