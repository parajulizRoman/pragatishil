"use client";

import { useState } from "react";
import Link from "next/link";
import { siteContent as fallbackContent } from "@/config/siteContent";
import { useLanguage } from "@/context/LanguageContext";
import { NewsItem, MediaItem } from "@/types";
/* eslint-disable @next/next/no-img-element */

interface MediaContentProps {
    initialNews: NewsItem[];
    initialMedia: MediaItem[];
}

export default function MediaContent({ initialNews, initialMedia }: MediaContentProps) {
    const { t } = useLanguage();
    const [newsFilter, setNewsFilter] = useState("All");

    // Fallback logic
    const news = initialNews.length > 0 ? initialNews : (fallbackContent.news as unknown as NewsItem[]);
    const media = initialMedia.length > 0 ? initialMedia : [];

    // Gallery split
    const galleryImages = media.length > 0 ? media.filter(m => m.media_type === 'image') : (fallbackContent.galleryImages as unknown as MediaItem[]);
    const videos = media.length > 0 ? media.filter(m => m.media_type === 'video') : (fallbackContent.videos as unknown as MediaItem[]);

    // News Filtering Logic
    const filteredNews = news.filter(item => {
        if (newsFilter === "All") return true;
        if (newsFilter === "Articles") return item.type === "Article" || item.type === "Interview";
        if (newsFilter === "Videos") return item.type === "Video";
        return true;
    });

    return (
        <div className="container mx-auto px-4 max-w-7xl">
            {/* Header */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Media Center</h1>
                <p className="text-slate-600 max-w-2xl mx-auto font-medium">
                    Explore our journey through press coverage, speeches, and photo galleries.
                </p>
            </div>

            <div className="space-y-24">
                {/* --- SECTION 1: NEWS & ARTICLES --- */}
                <section>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
                        <Link href="/news" className="hover:opacity-80 transition-opacity">
                            <h2 className="text-3xl font-black text-slate-800 border-l-8 border-brand-red pl-4">News & Media Coverage</h2>
                            <p className="text-slate-500 mt-2 pl-5 font-bold uppercase text-[10px] tracking-widest">Latest updates from press and digital media.</p>
                        </Link>

                        {/* News Filters */}
                        <div className="flex gap-2">
                            {["All", "Articles", "Videos"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setNewsFilter(f)}
                                    className={`px-5 py-2 rounded-xl text-xs font-black transition-all border-2 ${newsFilter === f
                                        ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200"
                                        : "bg-white text-slate-500 border-slate-100 hover:border-slate-300"
                                        }`}
                                >
                                    {f.toUpperCase()}
                                </button>
                            ))}
                            <Link
                                href="/news"
                                className="px-5 py-2 rounded-xl text-xs font-black transition-all border-2 bg-brand-blue text-white border-brand-blue hover:bg-brand-navy hover:border-brand-navy"
                            >
                                VIEW ALL NEWS →
                            </Link>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {filteredNews.map((item) => {
                            // For fallback/external news, link to external source
                            // For DB news (id > 10 typically indicates DB content), link to internal page
                            const isDbItem = typeof item.id === 'number' && item.id > 10;
                            const href = isDbItem
                                ? `/news/${item.slug || item.id}`
                                : (item.link || `/news/${item.slug || item.id}`);
                            const isExternal = !isDbItem && item.link;

                            return (
                                <Link
                                    key={item.id}
                                    href={href}
                                    target={isExternal ? "_blank" : undefined}
                                    rel={isExternal ? "noopener noreferrer" : undefined}
                                    className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col md:flex-row overflow-hidden group"
                                >
                                    {(item.image_url || item.image) && (
                                        <div className="md:w-1/3 aspect-video md:aspect-auto overflow-hidden">
                                            <img
                                                src={item.image_url || item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                    )}
                                    <div className="p-8 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className={`text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full border ${item.type === 'Video' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                                    }`}>
                                                    {item.type}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.date}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-brand-blue transition-colors leading-tight">
                                                {t(item.title, item.title_ne || item.title)}
                                            </h3>
                                            {(item.summary_en || item.summary_ne) && (
                                                <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium">
                                                    {t(item.summary_en || "", item.summary_ne || "")}
                                                </p>
                                            )}
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">Source: {item.source}</p>
                                        </div>
                                        <span className="inline-flex items-center text-xs font-black text-brand-blue group-hover:text-brand-red transition-all uppercase tracking-widest">
                                            Read Full Article
                                            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                    {filteredNews.length === 0 && (
                        <div className="text-center py-16 bg-slate-50 rounded-3xl border-4 border-dashed border-slate-100">
                            <p className="text-slate-400 font-bold uppercase tracking-widest">No news items found for this filter.</p>
                        </div>
                    )}
                </section>

                {/* --- SECTION 2: VIDEOS --- */}
                <section>
                    <div className="mb-10 pb-6 border-b border-slate-200">
                        <Link href="/videos" className="hover:opacity-80 transition-opacity block">
                            <h2 className="text-3xl font-black text-slate-800 border-l-8 border-brand-blue pl-4">Interviews & Speeches</h2>
                            <p className="text-slate-500 mt-2 pl-5 font-bold uppercase text-[10px] tracking-widest">Selected video highlights from our campaigns.</p>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {videos.map((video) => (
                            <div key={video.id} className="group">
                                <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-xl border-4 border-white mb-6 transition-all group-hover:shadow-2xl group-hover:-translate-y-2 duration-300 relative">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={video.embed_url || video.url}
                                        title={video.title || "Video"}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                </div>
                                <h3 className="font-bold text-slate-800 group-hover:text-brand-blue transition-colors px-2 text-lg leading-snug">{video.title}</h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- SECTION 3: PHOTO GALLERY --- */}
                <section>
                    <div className="mb-10 pb-6 border-b border-slate-200">
                        <Link href="/gallery" className="hover:opacity-80 transition-opacity block">
                            <h2 className="text-3xl font-black text-slate-800 border-l-8 border-brand-red pl-4">Photo Gallery</h2>
                            <p className="text-slate-500 mt-2 pl-5 font-bold uppercase text-[10px] tracking-widest">Capturing moments with the community.</p>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {galleryImages.map((img) => (
                            <div key={img.id} className="relative group aspect-square overflow-hidden rounded-3xl bg-slate-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer border-4 border-white">
                                <img
                                    src={img.url}
                                    alt={img.alt_text || img.caption || ''}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                                    <p className="text-white text-xs font-black uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        {t(img.caption || '', img.caption_ne || img.caption || '')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

