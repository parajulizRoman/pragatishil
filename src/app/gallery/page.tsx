import { createClient } from "@/lib/supabase/server";
import GalleryClient from "./GalleryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Photo Gallery | Pragatishil Loktantrik Party",
    description: "Browse photos and albums from Pragatishil Loktantrik Party events, campaigns, and community activities.",
};

export default async function GalleryPage() {
    const supabase = await createClient();

    // Fetch albums
    const { data: albums } = await supabase
        .from('media_albums')
        .select('*')
        .order('created_at', { ascending: false });

    // Fetch images
    const { data: images } = await supabase
        .from('media_gallery')
        .select('*')
        .eq('media_type', 'image')
        .order('created_at', { ascending: false });

    return (
        <GalleryClient
            albums={albums || []}
            images={images || []}
        />
    );
}
