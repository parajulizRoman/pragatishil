import MediaContent from "./MediaContent";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
    title: "Pragatishil Bichar | Progressive Blogs | प्रगतिशील विचार",
    description: "Progressive ideas, thought leadership articles, and insights from Pragatishil Loktantrik Party members.",
};

export const dynamic = 'force-dynamic';

export default async function MediaPage() {
    const supabase = await createClient();

    // Fetch Published News
    const { data: news } = await supabase
        .from('news_items')
        .select('*')
        .eq('status', 'published')
        .order('date', { ascending: false });

    // Fetch Gallery Items
    const { data: media } = await supabase
        .from('media_gallery')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <main className="min-h-screen bg-slate-50/50 py-12 md:py-20">
            <MediaContent
                initialNews={news || []}
                initialMedia={media || []}
            />
        </main>
    );
}
