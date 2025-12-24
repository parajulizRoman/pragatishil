import { createClient } from "@/lib/supabase/server";
import { NewsItem } from "@/types";
import { Metadata } from "next";
import BlogsHeaderClient from "./NewsHeaderClient";
import NewsClient from "./NewsClient";

export const metadata: Metadata = {
    title: "Progressive Blogs | प्रगतिशील विचार | Pragatishil",
    description: "Progressive ideas, thought leadership articles, and insights from Pragatishil Loktantrik Party members.",
};

export const revalidate = 60; // Revalidate every minute

export default async function NewsListPage() {
    const supabase = await createClient();
    const { data: newsItems } = await supabase
        .from("news_items")
        .select("id, slug, title, title_ne, summary_en, summary_ne, date, image_url, source, status, type, link")
        .eq("status", "published")
        .order("date", { ascending: false });

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            {/* Header - Client component for language support */}
            <BlogsHeaderClient />

            {/* News Grid - Client component for edit/delete */}
            <NewsClient initialNews={(newsItems as NewsItem[]) || []} />
        </main>
    );
}
