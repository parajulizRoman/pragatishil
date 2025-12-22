"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useLanguage } from "@/context/LanguageContext";
import { MediaItem } from "@/types";
import { canManageChannels, canDeleteContent } from "@/lib/permissions";
import { Search, Plus, X, Video, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { parseVideoUrl } from "@/lib/videoEmbed";

interface VideosClientProps {
    videos: MediaItem[];
}

export default function VideosClient({ videos: initialVideos }: VideosClientProps) {
    const { t } = useLanguage();
    const [videos, setVideos] = useState(initialVideos);
    const [search, setSearch] = useState("");
    const [userRole, setUserRole] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingVideo, setEditingVideo] = useState<MediaItem | null>(null);

    // Delete handler
    const handleDelete = async (video: MediaItem) => {
        if (!confirm(t(`"${video.title || 'यो भिडियो'}" मेटाउने हो?`, `Delete "${video.title || 'this video'}"?`))) return;

        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { error } = await supabase.from('media_gallery').delete().eq('id', video.id);
        if (error) {
            alert(t("मेटाउन असफल", "Failed to delete"));
        } else {
            refreshVideos();
        }
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

    const filteredVideos = videos.filter(v =>
        !search || v.title?.toLowerCase().includes(search.toLowerCase())
    );

    const refreshVideos = async () => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data } = await supabase
            .from('media_gallery')
            .select('*')
            .eq('media_type', 'video')
            .order('created_at', { ascending: false });
        if (data) setVideos(data);
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-brand-navy to-brand-blue py-16 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
                        {t("अन्तर्वार्ता र भाषणहरू", "Interviews & Speeches")}
                    </h1>
                    <p className="text-white/80 max-w-2xl mx-auto mb-6">
                        {t(
                            "प्रगतिशील लोकतान्त्रिक पार्टीका भिडियो सामग्रीहरू",
                            "Video content from Pragatishil Loktantrik Party"
                        )}
                    </p>

                    {canManage && (
                        <Button
                            onClick={() => setShowAddForm(true)}
                            className="bg-brand-red hover:bg-brand-red/90 text-white font-bold gap-2 shadow-lg"
                        >
                            <Plus size={18} />
                            {t("भिडियो थप्नुहोस्", "Add Video")}
                        </Button>
                    )}
                </div>
            </section>

            {/* Content */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                {/* Search */}
                <div className="relative max-w-md mx-auto mb-8">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("भिडियो खोज्नुहोस्...", "Search videos...")}
                        className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all"
                    />
                </div>

                {/* Count */}
                <p className="text-sm text-slate-500 mb-6 text-center">
                    {filteredVideos.length} {t("भिडियोहरू", "videos")}
                </p>

                {/* Video Grid */}
                {filteredVideos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredVideos.map((video) => (
                            <div key={video.id} className="group relative">
                                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-xl border-4 border-white mb-4 relative">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={video.embed_url || video.url}
                                        title={video.title || "Video"}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    />

                                    {/* Edit/Delete buttons */}
                                    {canManage && (
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <button
                                                onClick={() => setEditingVideo(video)}
                                                className="p-2 bg-white/90 rounded-full hover:bg-white shadow-lg transition-all"
                                                title={t("सम्पादन", "Edit")}
                                            >
                                                <Pencil size={14} className="text-brand-blue" />
                                            </button>
                                            {canDelete && (
                                                <button
                                                    onClick={() => handleDelete(video)}
                                                    className="p-2 bg-white/90 rounded-full hover:bg-white shadow-lg transition-all"
                                                    title={t("मेटाउनुहोस्", "Delete")}
                                                >
                                                    <Trash2 size={14} className="text-red-500" />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-bold text-slate-800 group-hover:text-brand-blue transition-colors px-2 text-lg leading-snug">
                                    {video.title || t("शीर्षकविहीन", "Untitled")}
                                </h3>
                                {video.caption && (
                                    <p className="text-sm text-slate-500 mt-1 px-2 line-clamp-2">{video.caption}</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-400">
                        <Video size={64} className="mx-auto mb-4 opacity-50" />
                        <p className="font-medium">{t("कुनै भिडियो फेला परेन", "No videos found")}</p>
                    </div>
                )}
            </section>

            {/* Add Video Modal */}
            {showAddForm && (
                <VideoAddModal
                    onClose={() => setShowAddForm(false)}
                    onSuccess={() => { refreshVideos(); setShowAddForm(false); }}
                />
            )}

            {/* Edit Video Modal */}
            {editingVideo && (
                <VideoEditModal
                    video={editingVideo}
                    onClose={() => setEditingVideo(null)}
                    onSuccess={() => { refreshVideos(); setEditingVideo(null); }}
                />
            )}
        </main>
    );
}

// Video Add Modal
function VideoAddModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [caption, setCaption] = useState("");
    const [embedUrl, setEmbedUrl] = useState("");
    const [error, setError] = useState("");

    // Parse URL and generate embed
    const handleUrlChange = (value: string) => {
        setUrl(value);
        setError("");
        if (value.trim()) {
            const parsed = parseVideoUrl(value);
            if (parsed.canEmbed && parsed.embedUrl) {
                setEmbedUrl(parsed.embedUrl);
            } else {
                setEmbedUrl("");
                setError(t("मान्य YouTube वा Facebook URL प्रविष्ट गर्नुहोस्", "Enter a valid YouTube or Facebook URL"));
            }
        }
    };

    const handleSubmit = async () => {
        if (!embedUrl || !title.trim()) return;
        setLoading(true);
        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data: { user } } = await supabase.auth.getUser();

            const { error: insertError } = await supabase.from('media_gallery').insert({
                url,
                embed_url: embedUrl,
                title,
                caption: caption || null,
                media_type: 'video',
                uploaded_by: user?.id
            });
            if (insertError) throw insertError;
            onSuccess();
        } catch {
            alert(t("भिडियो थप्न असफल", "Failed to add video"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="p-5 border-b bg-gradient-to-r from-brand-navy to-brand-blue flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">{t("भिडियो थप्नुहोस्", "Add Video")}</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                    {/* Video URL */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">{t("भिडियो URL", "Video URL")} *</label>
                        <Input
                            value={url}
                            onChange={(e) => handleUrlChange(e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                            className="mt-1"
                        />
                        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                    </div>

                    {/* Preview */}
                    {embedUrl && (
                        <div className="aspect-video bg-black rounded-xl overflow-hidden">
                            <iframe
                                width="100%"
                                height="100%"
                                src={embedUrl}
                                title="Preview"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">{t("शीर्षक", "Title")} *</label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Video title" className="mt-1" />
                    </div>

                    {/* Caption */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">{t("विवरण", "Description")}</label>
                        <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="mt-1" rows={3} />
                    </div>
                </div>
                <div className="p-5 border-t bg-slate-50 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose}>{t("रद्द", "Cancel")}</Button>
                    <Button onClick={handleSubmit} disabled={loading || !embedUrl || !title.trim()} className="bg-brand-blue hover:bg-brand-blue/90 text-white">
                        {loading ? t("थप्दै...", "Adding...") : t("थप्नुहोस्", "Add")}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Video Edit Modal
function VideoEditModal({ video, onClose, onSuccess }: { video: MediaItem; onClose: () => void; onSuccess: () => void }) {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState(video.title || "");
    const [caption, setCaption] = useState(video.caption || "");

    const handleSubmit = async () => {
        if (!title.trim()) return;
        setLoading(true);
        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase.from('media_gallery').update({
                title,
                caption: caption || null,
                updated_by: user?.id
            }).eq('id', video.id);

            if (error) throw error;
            onSuccess();
        } catch {
            alert(t("अद्यावधिक गर्न असफल", "Failed to update"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="p-5 border-b bg-gradient-to-r from-brand-navy to-brand-blue flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">{t("भिडियो सम्पादन", "Edit Video")}</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                    {/* Preview */}
                    <div className="aspect-video bg-black rounded-xl overflow-hidden">
                        <iframe
                            width="100%"
                            height="100%"
                            src={video.embed_url || video.url}
                            title="Preview"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">{t("शीर्षक", "Title")} *</label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Video title" className="mt-1" />
                    </div>

                    {/* Caption */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">{t("विवरण", "Description")}</label>
                        <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="mt-1" rows={3} />
                    </div>
                </div>
                <div className="p-5 border-t bg-slate-50 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose}>{t("रद्द", "Cancel")}</Button>
                    <Button onClick={handleSubmit} disabled={loading || !title.trim()} className="bg-brand-blue hover:bg-brand-blue/90 text-white">
                        {loading ? t("अद्यावधिक गर्दै...", "Updating...") : t("अद्यावधिक गर्नुहोस्", "Update")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
