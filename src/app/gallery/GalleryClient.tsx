"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";
import { useLanguage } from "@/context/LanguageContext";
import { MediaItem, MediaAlbum } from "@/types";
import { canManageChannels, canDeleteContent } from "@/lib/permissions";
import { Search, X, Plus, FolderPlus, ChevronLeft, ChevronRight, Download, Loader2, Sparkles, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface GalleryClientProps {
    albums: MediaAlbum[];
    images: MediaItem[];
}

export default function GalleryClient({ albums: initialAlbums, images: initialImages }: GalleryClientProps) {
    const { t } = useLanguage();
    const [albums, setAlbums] = useState(initialAlbums);
    const [images, setImages] = useState(initialImages);
    const [search, setSearch] = useState("");
    const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);
    const [lightboxImage, setLightboxImage] = useState<MediaItem | null>(null);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Auth & permissions
    const [userRole, setUserRole] = useState<string | null>(null);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [showAlbumForm, setShowAlbumForm] = useState(false);
    const [editingImage, setEditingImage] = useState<MediaItem | null>(null);

    // Delete handler
    const handleDelete = async (img: MediaItem, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm(t(`"${img.caption || 'यो फोटो'}" मेटाउने हो?`, `Delete "${img.caption || 'this photo'}"?`))) return;

        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { error } = await supabase.from('media_gallery').delete().eq('id', img.id);
        if (error) {
            alert(t("मेटाउन असफल", "Failed to delete"));
        } else {
            refreshData();
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

    // Filter images
    const filteredImages = images.filter(img => {
        const matchesSearch = !search ||
            img.caption?.toLowerCase().includes(search.toLowerCase()) ||
            img.caption_ne?.includes(search) ||
            img.alt_text?.toLowerCase().includes(search.toLowerCase());
        const matchesAlbum = selectedAlbum === null || img.album_id === selectedAlbum;
        return matchesSearch && matchesAlbum;
    });

    // Lightbox navigation
    const openLightbox = (img: MediaItem) => {
        const idx = filteredImages.findIndex(i => i.id === img.id);
        setLightboxIndex(idx);
        setLightboxImage(img);
    };

    const navigateLightbox = (direction: 1 | -1) => {
        const newIndex = (lightboxIndex + direction + filteredImages.length) % filteredImages.length;
        setLightboxIndex(newIndex);
        setLightboxImage(filteredImages[newIndex]);
    };

    // Refresh data
    const refreshData = async () => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const [albumsRes, imagesRes] = await Promise.all([
            supabase.from('media_albums').select('*').order('created_at', { ascending: false }),
            supabase.from('media_gallery').select('*').eq('media_type', 'image').order('created_at', { ascending: false })
        ]);
        if (albumsRes.data) setAlbums(albumsRes.data);
        if (imagesRes.data) setImages(imagesRes.data);
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-brand-navy to-brand-blue py-16 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
                        {t("फोटो ग्यालरी", "Photo Gallery")}
                    </h1>
                    <p className="text-white/80 max-w-2xl mx-auto mb-6">
                        {t(
                            "प्रगतिशील लोकतान्त्रिक पार्टीका कार्यक्रम, अभियान र समुदायका तस्बिरहरू",
                            "Photos from Pragatishil Loktantrik Party events, campaigns, and community activities"
                        )}
                    </p>

                    {/* Action Buttons */}
                    {canManage && (
                        <div className="flex justify-center gap-3">
                            <Button
                                onClick={() => setShowAlbumForm(true)}
                                variant="outline"
                                className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-brand-navy gap-2"
                            >
                                <FolderPlus size={18} />
                                {t("नयाँ एल्बम", "New Album")}
                            </Button>
                            <Button
                                onClick={() => setShowUploadForm(true)}
                                className="bg-brand-red hover:bg-brand-red/90 text-white font-bold gap-2 shadow-lg"
                            >
                                <Plus size={18} />
                                {t("फोटो थप्नुहोस्", "Add Photos")}
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Content */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t("खोज्नुहोस्...", "Search photos...")}
                            className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all"
                        />
                    </div>

                    {/* Album filters */}
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setSelectedAlbum(null)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedAlbum === null
                                ? 'bg-brand-navy text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {t("सबै", "All")}
                        </button>
                        {albums.map(album => (
                            <button
                                key={album.id}
                                onClick={() => setSelectedAlbum(album.id)}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedAlbum === album.id
                                    ? 'bg-brand-navy text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {t(album.name_ne || album.name, album.name)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Count */}
                <p className="text-sm text-slate-500 mb-6">
                    {filteredImages.length} {t("फोटोहरू", "photos")}
                    {selectedAlbum && albums.find(a => a.id === selectedAlbum) && (
                        <span className="ml-2 text-brand-blue">
                            • {t(albums.find(a => a.id === selectedAlbum)?.name_ne || '', albums.find(a => a.id === selectedAlbum)?.name || '')}
                        </span>
                    )}
                </p>

                {/* Photo Grid */}
                {filteredImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredImages.map((img) => (
                            <div
                                key={img.id}
                                onClick={() => openLightbox(img)}
                                className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100 cursor-pointer group border-4 border-white shadow-sm hover:shadow-xl transition-all"
                            >
                                <Image
                                    src={img.url}
                                    alt={img.alt_text || img.caption || "Photo"}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                                {/* Caption overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <p className="text-white text-sm font-medium line-clamp-2">
                                        {t(img.caption_ne || '', img.caption || '')}
                                    </p>
                                </div>

                                {/* Edit/Delete buttons for authorized users */}
                                {canManage && (
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setEditingImage(img); }}
                                            className="p-2 bg-white/90 rounded-full hover:bg-white shadow-lg transition-all"
                                            title={t("सम्पादन", "Edit")}
                                        >
                                            <Pencil size={14} className="text-brand-blue" />
                                        </button>
                                        {canDelete && (
                                            <button
                                                onClick={(e) => handleDelete(img, e)}
                                                className="p-2 bg-white/90 rounded-full hover:bg-white shadow-lg transition-all"
                                                title={t("मेटाउनुहोस्", "Delete")}
                                            >
                                                <Trash2 size={14} className="text-red-500" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-400">
                        <Search size={64} className="mx-auto mb-4 opacity-50" />
                        <p className="font-medium">{t("कुनै फोटो फेला परेन", "No photos found")}</p>
                    </div>
                )}
            </section>

            {/* Lightbox */}
            {lightboxImage && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightboxImage(null)}>
                    <button
                        onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <ChevronLeft size={32} className="text-white" />
                    </button>

                    <div className="relative max-w-5xl max-h-[85vh] w-full h-full m-4" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={lightboxImage.url}
                            alt={lightboxImage.alt_text || "Photo"}
                            fill
                            className="object-contain"
                            sizes="100vw"
                        />
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <ChevronRight size={32} className="text-white" />
                    </button>

                    <button
                        onClick={() => setLightboxImage(null)}
                        className="absolute top-4 right-4 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X size={24} className="text-white" />
                    </button>

                    {/* Caption */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white max-w-xl px-4">
                        <p className="text-lg font-medium">{t(lightboxImage.caption_ne || '', lightboxImage.caption || '')}</p>
                        <p className="text-sm text-white/60 mt-1">{lightboxIndex + 1} / {filteredImages.length}</p>
                    </div>

                    <a
                        href={lightboxImage.url}
                        download
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-4 right-4 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <Download size={20} className="text-white" />
                    </a>
                </div>
            )}

            {/* Album Creation Modal */}
            {showAlbumForm && (
                <AlbumFormModal
                    onClose={() => setShowAlbumForm(false)}
                    onSuccess={() => { refreshData(); setShowAlbumForm(false); }}
                />
            )}

            {/* Photo Upload Modal */}
            {showUploadForm && (
                <PhotoUploadModal
                    albums={albums}
                    onClose={() => setShowUploadForm(false)}
                    onSuccess={() => { refreshData(); setShowUploadForm(false); }}
                />
            )}

            {/* Photo Edit Modal */}
            {editingImage && (
                <PhotoEditModal
                    image={editingImage}
                    albums={albums}
                    onClose={() => setEditingImage(null)}
                    onSuccess={() => { refreshData(); setEditingImage(null); }}
                />
            )}
        </main>
    );
}

// Album Form Modal
function AlbumFormModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [nameNe, setNameNe] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async () => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase.from('media_albums').insert({
                name,
                name_ne: nameNe || null,
                description: description || null,
                created_by: user?.id
            });
            if (error) throw error;
            onSuccess();
        } catch {
            alert(t("एल्बम सिर्जना असफल", "Failed to create album"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-5 border-b bg-gradient-to-r from-brand-navy to-brand-blue flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">{t("नयाँ एल्बम", "New Album")}</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700">{t("नाम (अंग्रेजी)", "Name (English)")} *</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Album name" className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">{t("नाम (नेपाली)", "Name (Nepali)")}</label>
                        <Input value={nameNe} onChange={(e) => setNameNe(e.target.value)} placeholder="एल्बमको नाम" className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">{t("विवरण", "Description")}</label>
                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" className="mt-1" rows={3} />
                    </div>
                </div>
                <div className="p-5 border-t bg-slate-50 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose}>{t("रद्द", "Cancel")}</Button>
                    <Button onClick={handleSubmit} disabled={loading || !name.trim()} className="bg-brand-blue hover:bg-brand-blue/90 text-white">
                        {loading ? t("सिर्जना गर्दै...", "Creating...") : t("सिर्जना गर्नुहोस्", "Create")}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Photo Upload Modal
function PhotoUploadModal({ albums, onClose, onSuccess }: { albums: MediaAlbum[]; onClose: () => void; onSuccess: () => void }) {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [fileUrl, setFileUrl] = useState("");
    const [caption, setCaption] = useState("");
    const [captionNe, setCaptionNe] = useState("");
    const [altText, setAltText] = useState("");
    const [albumId, setAlbumId] = useState<number | "">("");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const selectedFile = e.target.files[0];
        setUploading(true);

        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const fileExt = selectedFile.name.split('.').pop();
            const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { error } = await supabase.storage.from('media').upload(fileName, selectedFile);
            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
            setFileUrl(publicUrl);
        } catch {
            alert(t("अपलोड असफल", "Upload failed"));
        } finally {
            setUploading(false);
        }
    };

    const handleAnalyze = async () => {
        if (!fileUrl) return;
        setAnalyzing(true);
        try {
            const res = await fetch("/api/ai/analyze-document", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ documentUrl: fileUrl })
            });
            if (!res.ok) throw new Error("Analysis failed");
            const data = await res.json();
            if (data.caption_en) setCaption(data.caption_en);
            if (data.caption_ne) setCaptionNe(data.caption_ne);
            if (data.alt_text) setAltText(data.alt_text);
        } catch {
            alert(t("विश्लेषण असफल", "Analysis failed"));
        } finally {
            setAnalyzing(false);
        }
    };

    const handleSubmit = async () => {
        if (!fileUrl) return;
        setLoading(true);
        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase.from('media_gallery').insert({
                url: fileUrl,
                media_type: 'image',
                caption,
                caption_ne: captionNe || null,
                alt_text: altText || null,
                album_id: albumId || null,
                uploaded_by: user?.id
            });
            if (error) throw error;
            onSuccess();
        } catch {
            alert(t("सुरक्षित गर्न असफल", "Failed to save"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-5 border-b bg-gradient-to-r from-brand-navy to-brand-blue flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">{t("फोटो थप्नुहोस्", "Add Photo")}</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                    {/* File Upload */}
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                        {fileUrl ? (
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-100">
                                <Image src={fileUrl} alt="Preview" fill className="object-cover" />
                            </div>
                        ) : (
                            <label className="cursor-pointer block">
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                {uploading ? (
                                    <Loader2 size={32} className="mx-auto text-brand-blue animate-spin" />
                                ) : (
                                    <>
                                        <Plus size={32} className="mx-auto text-slate-400 mb-2" />
                                        <p className="text-slate-600">{t("छवि चयन गर्नुहोस्", "Select image")}</p>
                                    </>
                                )}
                            </label>
                        )}
                    </div>

                    {/* AI Button */}
                    {fileUrl && (
                        <Button onClick={handleAnalyze} disabled={analyzing} variant="outline" className="w-full gap-2 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100">
                            {analyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            {analyzing ? t("विश्लेषण गर्दै...", "Analyzing...") : t("AI ले भर्नुहोस्", "Auto-fill with AI")}
                        </Button>
                    )}

                    {/* Album Selection */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">{t("एल्बम", "Album")}</label>
                        <select
                            value={albumId}
                            onChange={(e) => setAlbumId(e.target.value ? Number(e.target.value) : "")}
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue/20"
                        >
                            <option value="">{t("कुनै एल्बम छैन", "No album")}</option>
                            {albums.map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Caption EN */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">{t("क्याप्सन (अंग्रेजी)", "Caption (English)")}</label>
                        <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="mt-1" rows={2} />
                    </div>

                    {/* Caption NE */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">{t("क्याप्सन (नेपाली)", "Caption (Nepali)")}</label>
                        <Textarea value={captionNe} onChange={(e) => setCaptionNe(e.target.value)} className="mt-1" rows={2} />
                    </div>

                    {/* Alt Text */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">{t("SEO विवरण", "SEO Description")}</label>
                        <Input value={altText} onChange={(e) => setAltText(e.target.value)} className="mt-1" />
                    </div>
                </div>
                <div className="p-5 border-t bg-slate-50 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose}>{t("रद्द", "Cancel")}</Button>
                    <Button onClick={handleSubmit} disabled={loading || !fileUrl} className="bg-brand-blue hover:bg-brand-blue/90 text-white">
                        {loading ? t("सुरक्षित गर्दै...", "Saving...") : t("सुरक्षित गर्नुहोस्", "Save")}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Photo Edit Modal
function PhotoEditModal({ image, albums, onClose, onSuccess }: { image: MediaItem; albums: MediaAlbum[]; onClose: () => void; onSuccess: () => void }) {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [caption, setCaption] = useState(image.caption || "");
    const [captionNe, setCaptionNe] = useState(image.caption_ne || "");
    const [altText, setAltText] = useState(image.alt_text || "");
    const [albumId, setAlbumId] = useState<number | "">(image.album_id || "");

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase.from('media_gallery').update({
                caption,
                caption_ne: captionNe || null,
                alt_text: altText || null,
                album_id: albumId || null,
                updated_by: user?.id
            }).eq('id', image.id);

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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-5 border-b bg-gradient-to-r from-brand-navy to-brand-blue flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">{t("फोटो सम्पादन", "Edit Photo")}</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                    {/* Preview */}
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-100">
                        <Image src={image.url} alt="Preview" fill className="object-cover" />
                    </div>

                    {/* Album Selection */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">{t("एल्बम", "Album")}</label>
                        <select
                            value={albumId}
                            onChange={(e) => setAlbumId(e.target.value ? Number(e.target.value) : "")}
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue/20"
                        >
                            <option value="">{t("कुनै एल्बम छैन", "No album")}</option>
                            {albums.map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Caption EN */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">{t("क्याप्सन (अंग्रेजी)", "Caption (English)")}</label>
                        <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="mt-1" rows={2} />
                    </div>

                    {/* Caption NE */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">{t("क्याप्सन (नेपाली)", "Caption (Nepali)")}</label>
                        <Textarea value={captionNe} onChange={(e) => setCaptionNe(e.target.value)} className="mt-1" rows={2} />
                    </div>

                    {/* Alt Text */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">{t("SEO विवरण", "SEO Description")}</label>
                        <Input value={altText} onChange={(e) => setAltText(e.target.value)} className="mt-1" />
                    </div>
                </div>
                <div className="p-5 border-t bg-slate-50 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose}>{t("रद्द", "Cancel")}</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-brand-blue hover:bg-brand-blue/90 text-white">
                        {loading ? t("अद्यावधिक गर्दै...", "Updating...") : t("अद्यावधिक गर्नुहोस्", "Update")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
