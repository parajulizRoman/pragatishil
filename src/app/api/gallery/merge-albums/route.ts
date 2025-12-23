import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { canMergeAlbums } from "@/lib/permissions";

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user role
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (!profile || !canMergeAlbums(profile.role)) {
            return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
        }

        // Parse request body
        const { sourceAlbumId, targetAlbumId } = await request.json();

        if (!sourceAlbumId || !targetAlbumId) {
            return NextResponse.json({ error: "Source and target album IDs are required" }, { status: 400 });
        }

        if (sourceAlbumId === targetAlbumId) {
            return NextResponse.json({ error: "Source and target albums must be different" }, { status: 400 });
        }

        // Verify both albums exist
        const { data: albums } = await supabase
            .from("media_albums")
            .select("id, name")
            .in("id", [sourceAlbumId, targetAlbumId]);

        if (!albums || albums.length !== 2) {
            return NextResponse.json({ error: "One or both albums not found" }, { status: 404 });
        }

        // Count photos in source album
        const { count: photoCount } = await supabase
            .from("media_gallery")
            .select("id", { count: 'exact', head: true })
            .eq("album_id", sourceAlbumId);

        // Move all photos from source to target album
        const { error: updateError } = await supabase
            .from("media_gallery")
            .update({ album_id: targetAlbumId, updated_by: user.id })
            .eq("album_id", sourceAlbumId);

        if (updateError) {
            console.error("Error moving photos:", updateError);
            return NextResponse.json({ error: "Failed to move photos" }, { status: 500 });
        }

        // Delete the source album
        const { error: deleteError } = await supabase
            .from("media_albums")
            .delete()
            .eq("id", sourceAlbumId);

        if (deleteError) {
            console.error("Error deleting source album:", deleteError);
            return NextResponse.json({ error: "Photos moved but failed to delete source album" }, { status: 500 });
        }

        const sourceAlbum = albums.find(a => a.id === sourceAlbumId);
        const targetAlbum = albums.find(a => a.id === targetAlbumId);

        return NextResponse.json({
            success: true,
            message: `Merged ${photoCount || 0} photos from "${sourceAlbum?.name}" into "${targetAlbum?.name}"`,
            photosMoved: photoCount || 0
        });

    } catch (error) {
        console.error("Album merge error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
