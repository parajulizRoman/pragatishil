"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";
import { useLanguage } from "@/context/LanguageContext";
import { NewsItem } from "@/types";
import { canManageChannels, canDeleteContent } from "@/lib/permissions";
import { Calendar, ExternalLink, Pencil, Trash2, Search, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsClientProps {
    initialNews: NewsItem[];
}

export default function NewsClient({ initialNews }: NewsClientProps) {
    const { t } = useLanguage();
    const [newsItems, setNewsItems] = useState(initialNews);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

    // Search & Filter state
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("");
    const [sourceFilter, setSourceFilter] = useState<string>("");

    // Get unique types and sources for filter dropdowns
    const uniqueTypes = useMemo(() => {
        const types = new Set(newsItems.map(item => item.type).filter(Boolean));
        return Array.from(types).sort();
    }, [newsItems]);

    const uniqueSources = useMemo(() => {
        const sources = new Set(newsItems.map(item => item.source).filter(Boolean));
        return Array.from(sources).sort();
    }, [newsItems]);

    // Filter items based on search and filters
    const filteredItems = useMemo(() => {
        return newsItems.filter(item => {
            const query = searchQuery.toLowerCase().trim();
            const matchesSearch = !query ||
                item.title?.toLowerCase().includes(query) ||
                item.title_ne?.includes(searchQuery) ||
                item.summary_en?.toLowerCase().includes(query) ||
                item.summary_ne?.includes(searchQuery);
            const matchesType = !typeFilter || item.type === typeFilter;
            const matchesSource = !sourceFilter || item.source === sourceFilter;
            return matchesSearch && matchesType && matchesSource;
        });
    }, [newsItems, searchQuery, typeFilter, sourceFilter]);

    const hasActiveFilters = searchQuery || typeFilter || sourceFilter;

    const clearFilters = () => {
        setSearchQuery("");
        setTypeFilter("");
        setSourceFilter("");
    };

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                if (profile) setUserRole(profile.role);
            }
        };
        fetchUser();
    }, []);

    const canManage = canManageChannels(userRole);
    const canDelete = canDeleteContent(userRole);

    const handleDelete = async (item: NewsItem, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm(t(`"${item.title}" मेटाउने हो?`, `Delete "${item.title}"?`))) return;

        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { error } = await supabase.from('news_items').delete().eq('id', item.id);
        if (error) {
            alert(t("मेटाउन असफल", "Failed to delete"));
        } else {
            setNewsItems(newsItems.filter(n => n.id !== item.id));
        }
    };

    const handleEdit = (item: NewsItem, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingItem(item);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 -mt-10">
            {/* Search & Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder={t("ब्लग खोज्नुहोस्...", "Search blogs...")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Type Filter */}
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue bg-white text-slate-700"
                    >
                        <option value="">{t("सबै प्रकार", "All Types")}</option>
                        {uniqueTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    {/* Source Filter */}
                    <select
                        value={sourceFilter}
                        onChange={(e) => setSourceFilter(e.target.value)}
                        className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue bg-white text-slate-700 max-w-[200px] truncate"
                    >
                        <option value="">{t("सबै स्रोत", "All Sources")}</option>
                        {uniqueSources.map(source => (
                            <option key={source} value={source}>{source}</option>
                        ))}
                    </select>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            onClick={clearFilters}
                            className="gap-2 text-slate-600 shrink-0"
                        >
                            <X className="w-4 h-4" />
                            {t("हटाउनुहोस्", "Clear")}
                        </Button>
                    )}
                </div>

                {/* Results Count */}
                <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                    <span className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        {t(
                            `${filteredItems.length} ब्लग भेटियो`,
                            `${filteredItems.length} blog${filteredItems.length !== 1 ? 's' : ''} found`
                        )}
                        {hasActiveFilters && (
                            <span className="text-brand-blue">
                                ({t("फिल्टर सक्रिय", "filters active")})
                            </span>
                        )}
                    </span>
                </div>
            </div>

            {/* Blog Grid */}
            {filteredItems.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
                    <p className="text-slate-500 text-lg">
                        {hasActiveFilters
                            ? t("कुनै नतिजा भेटिएन। फिल्टर हटाउनुहोस्।", "No results found. Try clearing filters.")
                            : t("अहिलेसम्म कुनै ब्लग प्रकाशित भएको छैन।", "No blog posts published yet.")}
                    </p>
                    {hasActiveFilters && (
                        <Button onClick={clearFilters} className="mt-4">
                            {t("फिल्टर हटाउनुहोस्", "Clear Filters")}
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems.map((item) => (
                        <Link
                            href={`/blogs/${item.slug || item.id}`}
                            key={item.id}
                            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 flex flex-col h-full relative"
                        >
                            {/* Image or Video Element */}
                            <div className="relative h-56 w-full bg-slate-200 overflow-hidden">
                                {item.type === 'Video' && item.link && (item.link.includes('youtube') || item.link.includes('youtu.be')) ? (
                                    <div className="w-full h-full bg-black">
                                        <iframe
                                            src={item.link.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                            title={item.title}
                                            className="w-full h-full pointer-events-none"
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

                                {/* Edit/Delete buttons */}
                                {canManage && (
                                    <div className="absolute top-4 left-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <button
                                            onClick={(e) => handleEdit(item, e)}
                                            className="p-2 bg-white/90 rounded-full hover:bg-white shadow-lg transition-all"
                                            title={t("सम्पादन", "Edit")}
                                        >
                                            <Pencil size={14} className="text-brand-blue" />
                                        </button>
                                        {canDelete && (
                                            <button
                                                onClick={(e) => handleDelete(item, e)}
                                                className="p-2 bg-white/90 rounded-full hover:bg-white shadow-lg transition-all"
                                                title={t("मेटाउनुहोस्", "Delete")}
                                            >
                                                <Trash2 size={14} className="text-red-500" />
                                            </button>
                                        )}
                                    </div>
                                )}
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

                                <div className="flex-grow" />

                                <div className="pt-4 border-t border-slate-50 flex items-center text-brand-blue font-semibold text-sm group-hover:underline decoration-2 underline-offset-2">
                                    Read Full Article
                                    <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Edit Modal - TODO: Implement */}
            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6">
                        <h2 className="text-xl font-bold mb-4">{t("लेख सम्पादन", "Edit Article")}</h2>
                        <p className="text-slate-600 mb-4">
                            {t("लेख सम्पादनको लागि ", "To edit articles, please use the ")}
                            <Link href={`/admin/news?edit=${editingItem.id}`} className="text-brand-blue underline">
                                {t("प्रशासन पृष्ठ", "Admin Page")}
                            </Link>
                        </p>
                        <Button onClick={() => setEditingItem(null)}>{t("बन्द गर्नुहोस्", "Close")}</Button>
                    </div>
                </div>
            )}
        </div>
    );
}
