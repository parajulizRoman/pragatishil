"use client";

import { useState } from "react";
import { siteContent } from "@/config/siteContent";

export default function NewsPage() {
    const [filter, setFilter] = useState("All");

    const filteredNews = siteContent.news.filter(item => {
        if (filter === "All") return true;
        // Simple mapping: "Articles" maps to Article/Interview, "Videos" maps to Video
        if (filter === "Articles") return item.type === "Article" || item.type === "Interview";
        if (filter === "Videos") return item.type === "Video";
        return true; // fallback
    });

    return (
        <main className="min-h-screen bg-slate-50 py-12 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">News & Media Coverage</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Stay informed with the latest updates, press releases, and media coverage of our party activities.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex justify-center gap-4 mb-10">
                    {["All", "Articles", "Videos"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${filter === f
                                    ? "bg-brand-blue text-white shadow-md"
                                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* News List */}
                <div className="space-y-6">
                    {filteredNews.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.type === 'Video' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {item.type}
                                    </span>
                                    <span className="text-xs text-slate-400">{item.date}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-1">{item.title}</h3>
                                <p className="text-sm text-slate-500 font-medium">Source: {item.source}</p>
                            </div>
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-brand-blue text-sm font-medium rounded-lg border border-slate-200 transition-colors"
                            >
                                Read / Watch
                            </a>
                        </div>
                    ))}

                    {filteredNews.length === 0 && (
                        <div className="text-center py-20 text-slate-500">
                            No items found for this filter.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
