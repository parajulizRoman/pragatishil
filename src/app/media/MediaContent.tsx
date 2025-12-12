"use client";

import { useState } from "react";
import { siteContent } from "@/config/siteContent";
/* eslint-disable @next/next/no-img-element */

export default function MediaContent() {
    const [newsFilter, setNewsFilter] = useState("All");

    // News Filtering Logic
    const filteredNews = siteContent.news.filter(item => {
        if (newsFilter === "All") return true;
        if (newsFilter === "Articles") return item.type === "Article" || item.type === "Interview";
        if (newsFilter === "Videos") return item.type === "Video";
        return true;
    });

    return (
        <div className="container mx-auto px-4 max-w-7xl">
            {/* Header */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Media Center</h1>
                <p className="text-slate-600 max-w-2xl mx-auto">
                    Explore our journey through press coverage, speeches, and photo galleries.
                </p>
            </div>

            <div className="space-y-24">
                {/* --- SECTION 1: NEWS & ARTICLES --- */}
                <section>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 border-l-4 border-brand-red pl-4">News & Media Coverage</h2>
                            <p className="text-slate-500 mt-2 pl-5">Latest updates from press and digital media.</p>
                        </div>

                        {/* News Filters */}
                        <div className="flex gap-2">
                            {["All", "Articles", "Videos"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setNewsFilter(f)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${newsFilter === f
                                        ? "bg-slate-900 text-white border-slate-900"
                                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {filteredNews.map((item) => (
                            <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col justify-between group">
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${item.type === 'Video' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                            }`}>
                                            {item.type}
                                        </span>
                                        <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-brand-blue transition-colors leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium mb-4">Source: {item.source}</p>
                                </div>
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-sm font-bold text-brand-blue hover:text-brand-red transition-colors"
                                >
                                    Read or Watch
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </a>
                            </div>
                        ))}
                    </div>
                    {filteredNews.length === 0 && (
                        <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                            <p className="text-slate-500">No news items found for this filter.</p>
                        </div>
                    )}
                </section>

                {/* --- SECTION 2: VIDEOS --- */}
                <section>
                    <div className="mb-10 pb-6 border-b border-slate-200">
                        <h2 className="text-3xl font-bold text-slate-800 border-l-4 border-brand-blue pl-4">Interviews & Speeches</h2>
                        <p className="text-slate-500 mt-2 pl-5">Selected video highlights from our campaigns.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {siteContent.videos.map((video) => (
                            <div key={video.id} className="group">
                                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-slate-200 mb-4 transition-transform group-hover:-translate-y-1 duration-300 relative">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={video.url}
                                        title={video.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                </div>
                                <h3 className="font-bold text-slate-800 group-hover:text-brand-blue transition-colors px-1 text-lg leading-snug">{video.title}</h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- SECTION 3: PHOTO GALLERY --- */}
                <section>
                    <div className="mb-10 pb-6 border-b border-slate-200">
                        <h2 className="text-3xl font-bold text-slate-800 border-l-4 border-brand-red pl-4">Photo Gallery</h2>
                        <p className="text-slate-500 mt-2 pl-5">Capturing moments with the community.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {siteContent.galleryImages.map((img) => (
                            <div key={img.id} className="relative group aspect-square overflow-hidden rounded-xl bg-slate-100 shadow-sm hover:shadow-lg transition-all cursor-pointer">
                                <img
                                    src={img.url}
                                    alt={img.caption}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <p className="text-white text-sm font-medium translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{img.caption}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

