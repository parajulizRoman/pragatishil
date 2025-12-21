"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Search, X, ChevronRight, Upload, Check, PlayCircle, Image as ImageIcon } from "lucide-react";
import { MediaItem } from "@/types";

interface MediaPickerProps {
    value?: string;
    onSelect: (url: string) => void;
    mediaType?: 'image' | 'video' | 'all';
    label?: string;
}

export default function MediaPicker({ value, onSelect, mediaType = 'image', label = "Select Image" }: MediaPickerProps) {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchMedia = useCallback(async () => {
        const supabase = createClient();
        let query = supabase.from('media_gallery').select('*').order('created_at', { ascending: false });

        if (mediaType !== 'all') {
            query = query.eq('media_type', mediaType);
        }

        const { data } = await query.limit(50);
        if (data) setMedia(data as MediaItem[]);
        setLoading(false);
    }, [mediaType]);

    useEffect(() => {
        fetchMedia();
    }, [fetchMedia]);

    const filteredMedia = media.filter(item =>
    (item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.caption?.toLowerCase().includes(search.toLowerCase()) ||
        item.alt_text?.toLowerCase().includes(search.toLowerCase()))
    );

    const handleSelect = (url: string) => {
        onSelect(url);
        setIsModalOpen(false);
    };

    const previewItems = media.slice(0, 6);

    return (
        <div className="space-y-3">
            <label className="form-label">{label}</label>

            {/* Selected Preview */}
            {value && (
                <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-brand-blue bg-slate-100">
                    <Image src={value} alt="Selected" fill className="object-cover" sizes="300px" />
                    <button
                        type="button"
                        onClick={() => onSelect("")}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                        <X size={14} />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-lg flex items-center gap-1">
                        <Check size={12} /> Selected
                    </div>
                </div>
            )}

            {/* Inline Thumbnail Grid */}
            {!value && (
                <>
                    <div className="relative">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="w-20 h-20 flex-shrink-0 bg-slate-100 rounded-xl animate-pulse" />
                                ))
                            ) : previewItems.length > 0 ? (
                                previewItems.map(item => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => handleSelect(item.url)}
                                        className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 border-transparent hover:border-brand-blue transition-all group"
                                    >
                                        {item.media_type === 'image' ? (
                                            <Image src={item.url} alt={item.alt_text || ''} fill className="object-cover" sizes="80px" />
                                        ) : (
                                            <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                                <PlayCircle size={24} className="text-white/60" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                            <Check size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="text-sm text-slate-400 py-4">No {mediaType}s found in gallery</div>
                            )}
                        </div>
                    </div>

                    {/* Search & See More Row */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search media..."
                                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-1 text-sm font-bold text-brand-blue hover:text-blue-700 transition-colors whitespace-nowrap"
                        >
                            See More <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* Quick Search Results */}
                    {search && filteredMedia.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                            {filteredMedia.slice(0, 8).map(item => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleSelect(item.url)}
                                    className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-brand-blue transition-all"
                                >
                                    {item.media_type === 'image' ? (
                                        <Image src={item.url} alt={item.alt_text || ''} fill className="object-cover" sizes="100px" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                            <PlayCircle size={20} className="text-white/60" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Full Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-black text-brand-navy">Select {mediaType === 'video' ? 'Video' : 'Image'}</h2>
                                <p className="text-xs text-slate-400 mt-1">Click to select or upload a new file</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Search in Modal */}
                        <div className="px-5 py-3 border-b border-slate-100">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by title, caption..."
                                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                                />
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="flex-1 overflow-y-auto p-5">
                            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                                {/* Upload New Button */}
                                <a
                                    href="/admin/media"
                                    target="_blank"
                                    className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-brand-blue flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-brand-blue transition-colors"
                                >
                                    <Upload size={24} />
                                    <span className="text-[10px] font-bold uppercase">Upload New</span>
                                </a>

                                {/* Media Items */}
                                {filteredMedia.map(item => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => handleSelect(item.url)}
                                        className="relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-brand-blue transition-all group"
                                    >
                                        {item.media_type === 'image' ? (
                                            <Image src={item.url} alt={item.alt_text || ''} fill className="object-cover" sizes="150px" />
                                        ) : (
                                            <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                                <PlayCircle size={32} className="text-white/60" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                            <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Check size={16} className="text-brand-blue" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-[9px] font-bold truncate">{item.title || item.caption}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {filteredMedia.length === 0 && (
                                <div className="text-center py-12 text-slate-400">
                                    <ImageIcon size={48} className="mx-auto mb-3 opacity-50" />
                                    <p className="font-medium">No media found</p>
                                    <p className="text-sm mt-1">Try a different search or upload new media</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
