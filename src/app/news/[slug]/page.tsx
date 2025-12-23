import { notFound } from "next/navigation";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NewsItem } from "@/types";
import { Metadata } from "next";
import NewsArticleClient from "./NewsArticleClient";

// Init generic client for server-side read
const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    // Try slug first, fallback to ID for legacy URLs
    let news = null;
    const { data: bySlug } = await supabase
        .from('news_items')
        .select('*')
        .eq('slug', params.slug)
        .single();

    if (bySlug) {
        news = bySlug;
    } else {
        // Fallback: try as numeric ID (for backwards compatibility)
        const numId = parseInt(params.slug, 10);
        if (!isNaN(numId)) {
            const { data: byId } = await supabase
                .from('news_items')
                .select('*')
                .eq('id', numId)
                .single();
            news = byId;
        }
    }

    if (!news) return { title: 'News Not Found' };

    return {
        title: `${news.title} | Pragatishil News`,
        description: news.summary_en || news.summary_ne,
        openGraph: {
            images: news.image_url ? [news.image_url] : [],
        },
    };
}

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
    const { slug } = params;

    // Try slug first, fallback to ID for legacy URLs
    let news = null;
    let error = null;

    const { data: bySlug, error: slugError } = await supabase
        .from('news_items')
        .select('*')
        .eq('slug', slug)
        .single();

    if (bySlug) {
        news = bySlug;
    } else {
        // Fallback: try as numeric ID (for backwards compatibility)
        const numId = parseInt(slug, 10);
        if (!isNaN(numId)) {
            const { data: byId, error: idError } = await supabase
                .from('news_items')
                .select('*')
                .eq('id', numId)
                .single();
            news = byId;
            error = idError;
        } else {
            error = slugError;
        }
    }

    // Check if not found or if draft/archived
    // Support both new 'status' field and legacy 'is_published' field
    const isPublished = news?.status === 'published' || news?.is_published === true;
    if (error || !news || !isPublished) {
        notFound();
    }

    const item = news as NewsItem;

    // Delegate all rendering to client component for language toggle
    return <NewsArticleClient item={item} />;
}
