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
        const validExtensions = ["image/jpeg", "image/png", "image/webp"];
        if (!validExtensions.includes(file.type)) {
            return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, WEBP allowed." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Check for memberId in formData
        const memberId = formData.get("memberId") as string;

        let filePath = "";

        if (memberId) {
            // Deterministic path: members/<id>/profile.jpg
            // We can infer extension from mime type or just use standard .jpg or keep original extension
            const ext = file.type.split("/")[1] || "jpg";
            filePath = `members/${memberId}/profile.${ext}`;
        } else {
            // Fallback to old timestamp method if no memberId (backward compatibility)
            const timestamp = Date.now();
            const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
            filePath = `${timestamp}-${cleanName}`;
        }
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
