import { createClient } from "@/lib/supabase/server";
import VideosClient from "./VideosClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Videos | Pragatishil Loktantrik Party",
    description: "Watch interviews, speeches, and video content from Pragatishil Loktantrik Party.",
};

export default async function VideosPage() {
    const supabase = await createClient();

    // Fetch videos
    const { data: videos } = await supabase
        .from('media_gallery')
        .select('*')
        .eq('media_type', 'video')
        .order('created_at', { ascending: false });

    return <VideosClient videos={videos || []} />;
}
