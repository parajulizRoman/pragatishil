import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/types";
import { Calendar, ExternalLink } from "lucide-react";
import { Metadata } from "next";
import NewsHeaderClient from "./NewsHeaderClient";

export const metadata: Metadata = {
    title: "News Room | Pragatishil",
    description: "Latest updates, articles, and press releases from the Pragatishil party.",
};

export const revalidate = 60; // Revalidate every minute

export default async function NewsListPage() {
    const supabase = await createClient();
    const { data: newsItems } = await supabase
        .from("news_items")
        .select("id, slug, title, title_ne, summary_en, summary_ne, date, image_url, source, status, type")
        .eq("status", "published")
        .order("date", { ascending: false });

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            {/* Header - Client component for language support */}
            <NewsHeaderClient />

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 -mt-10">
                {!newsItems || newsItems.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
                        <p className="text-slate-500 text-lg">No news articles published yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(newsItems as NewsItem[]).map((item) => (
                            <Link
                                href={`/news/${item.slug || item.id}`}
                                key={item.id}
                                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 flex flex-col h-full"
                            >
                                {/* Image or Video Element */}
                                <div className="relative h-56 w-full bg-slate-200 overflow-hidden">
                                    {item.type === 'Video' && item.link && (item.link.includes('youtube') || item.link.includes('youtu.be')) ? (
                                        <div className="w-full h-full bg-black">
                                            <iframe
                                                src={item.link.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                                title={item.title}
                                                className="w-full h-full pointer-events-none" // pointer-events-none to let the card click work? No, iframe captures clicks. Better to have thumbnail. But user asked for iframe.
                                                // Actually for list view, iframe is heavy. Let's try thumbnail first if possible, or iframe with pointer events?
                                                // Let's stick to the Admin UI logic for consistency: iframe
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    ) : item.image_url ? (
                                        <Image
                                            src={item.image_url}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-400 bg-slate-100">
                                            <span className="text-sm">No Image</span>
                                        </div>
                                    )}
                                    {/* Type Pill */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-brand-blue text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
                                        {item.type}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-grow space-y-4">

                                    {/* Meta */}
                                    <div className="flex items-center text-xs text-slate-500 font-medium space-x-2">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{item.date}</span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-brand-blue uppercase tracking-wide">{item.source}</span>
                                    </div>

                                    {/* Titles */}
                                    <div className="space-y-1">
                                        <h2 className="text-xl font-bold text-brand-navy line-clamp-2 leading-tight group-hover:text-brand-blue transition-colors">
                                            {item.title}
                                        </h2>
                                        {item.title_ne && (
                                            <h3 className="text-lg font-nepali text-slate-600 line-clamp-1">
                                                {item.title_ne}
                                            </h3>
                                        )}
                                    </div>

                                    {/* Summary */}
                                    <div className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                                        {item.summary_en || item.summary_ne || "Read the full article for more details."}
                                    </div>

                                    <div className="flex-grow" /> {/* Spacer */}

                                    <div className="pt-4 border-t border-slate-50 flex items-center text-brand-blue font-semibold text-sm group-hover:underline decoration-2 underline-offset-2">
                                        Read Full Article
                                        <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
