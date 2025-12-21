"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { upsertMediaItem, deleteMediaItem } from "@/actions/cms";
import { Plus, Trash2, X, PlayCircle, Image as ImageIcon, FileText, CheckCircle2, Globe, AlertCircle, Copy, Check, Sparkles, Loader2 } from "lucide-react";
import { MediaItem, MediaType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/context/ToastContext";
import { parseVideoUrl, getPlatformName, getPlatformColor } from "@/lib/videoEmbed";

export default function MediaManager() {
    const { showError, showInfo, showSuccess } = useToast();
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<MediaType | 'all'>('all');
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState<Partial<MediaItem>>({ media_type: 'image', url: '', caption: '', caption_ne: '', alt_text: '', title: '' });
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [uploading, setUploading] = useState(false);
    const [isDeletingBulk, setIsDeletingBulk] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");
    const [userRole, setUserRole] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [analyzing, setAnalyzing] = useState(false);

    const canDelete = userRole && ['admin', 'admin_party'].includes(userRole);

    useEffect(() => {
        fetchMedia();
        fetchUserRole();
    }, []);

    const fetchUserRole = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();
            if (profile?.role) setUserRole(profile.role);
        }
    };

    const fetchMedia = async () => {
        const supabase = createClient();
        const { data } = await supabase.from('media_gallery').select('*').order('created_at', { ascending: false });
        if (data) setMedia(data as MediaItem[]);
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!canDelete) {
            showError("Access Denied", "Only admins can delete media items.");
            return;
        }
        const reason = prompt("Reason for deletion (for audit log):");
        if (!reason) return;
        try {
            await deleteMediaItem(id, reason);
            fetchMedia();
        } catch (error) {
            showError("Delete Failed", (error as Error).message);
        }
    };

    const handleBulkDelete = async () => {
        if (!canDelete) {
            showError("Access Denied", "Only admins can delete media items.");
            return;
        }
        if (!deleteReason) {
            showInfo("Reason Required", "Please provide a reason for bulk deletion.");
            return;
        }
        if (!confirm(`Are you sure you want to delete ${selectedItems.size} items?`)) return;

        setLoading(true);
        try {
            for (const id of Array.from(selectedItems)) {
                await deleteMediaItem(id, deleteReason);
            }
            setSelectedItems(new Set());
            fetchMedia();
            setIsDeletingBulk(false);
            setDeleteReason("");
        } catch (error) {
            showError("Delete Failed", (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];
        setUploading(true);
        const supabase = createClient();

        try {
            const fileName = `gallery/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const { error } = await supabase.storage.from('media').upload(fileName, file);
            if (error) throw error;
            const { data } = supabase.storage.from('media').getPublicUrl(fileName);
            setNewItem({ ...newItem, url: data.publicUrl });
        } catch (error) {
            showError("Upload failed", (error as Error).message);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await upsertMediaItem(newItem as any);
            const mediaTypeName = newItem.media_type === 'video' ? 'Video' : newItem.media_type === 'document' ? 'Document' : 'Image';
            showSuccess(`${mediaTypeName} Added Successfully`, `Your ${mediaTypeName.toLowerCase()} has been saved to the gallery.`);
            setIsAdding(false);
            setNewItem({ media_type: 'image', url: '', caption: '', caption_ne: '', alt_text: '', title: '' });
            fetchMedia();
        } catch (error) {
            showError("Save failed", (error as Error).message);
        } finally {
            setSaving(false);
        }
    };

    const handleAutoFill = async () => {
        if (!newItem.url) return;
        setAnalyzing(true);
        try {
            const res = await fetch('/api/ai/analyze-document', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: newItem.url })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Analysis failed');
            }

            const data = await res.json();
            setNewItem(prev => ({
                ...prev,
                title: data.title || prev.title,
                alt_text: data.alt_text || prev.alt_text,
                caption: data.caption_en || prev.caption,
                caption_ne: data.caption_ne || prev.caption_ne
            }));
            showSuccess('AI Auto-fill Complete!', 'Document details have been extracted.');
        } catch (error) {
            showError('AI Analysis Failed', (error as Error).message);
        } finally {
            setAnalyzing(false);
        }
    };

    const toggleSelect = (id: number) => {
        const next = new Set(selectedItems);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedItems(next);
    };

    const filteredMedia = activeTab === 'all' ? media : media.filter(m => m.media_type === activeTab);

    return (
        <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-brand-navy tracking-tight">Media Gallery</h1>
                    <p className="text-slate-500 mt-1">Manage visual assets, videos and documents for the movement.</p>
                </div>
                <div className="flex items-center space-x-3">
                    {selectedItems.size > 0 && canDelete && (
                        <button
                            onClick={() => setIsDeletingBulk(true)}
                            className="flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-100 transition-all font-bold border border-red-100"
                        >
                            <Trash2 size={18} />
                            <span>Delete Selected ({selectedItems.size})</span>
                        </button>
                    )}
                    <button
                        onClick={() => { setNewItem({ media_type: activeTab === 'all' ? 'image' : activeTab as MediaType, url: '', caption: '', caption_ne: '', alt_text: '', title: '' }); setIsAdding(true); }}
                        className="flex items-center space-x-2 bg-brand-blue text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                    >
                        <Plus size={20} />
                        <span className="font-bold">Add Media</span>
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl">
                    {(['all', 'image', 'video', 'document'] as const).map(type => (
                        <button
                            key={type}
                            onClick={() => setActiveTab(type)}
                            className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg font-bold text-xs transition-all ${activeTab === type ? "bg-white text-brand-blue shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                        >
                            {type === 'image' ? <ImageIcon size={14} /> : type === 'video' ? <PlayCircle size={14} /> : type === 'document' ? <FileText size={14} /> : null}
                            <span>{type.toUpperCase()}</span>
                        </button>
                    ))}
                </div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    {filteredMedia.length} Items found
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {loading && media.length === 0 ? (
                    Array.from({ length: 12 }).map((_, i) => (
                        <Skeleton key={i} className="aspect-square rounded-2xl" />
                    ))
                ) : filteredMedia.map((item) => (
                    <div key={item.id}
                        onClick={() => toggleSelect(item.id)}
                        className={`relative group bg-white rounded-2xl shadow-sm border-2 overflow-hidden aspect-square cursor-pointer transition-all duration-300 ${selectedItems.has(item.id) ? 'border-brand-blue ring-4 ring-blue-50' : 'border-slate-100 hover:border-slate-200 hover:shadow-md'}`}>

                        {item.media_type === 'image' ? (
                            <Image
                                src={item.url}
                                alt={item.alt_text || ''}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                            />
                        ) : item.media_type === 'video' ? (
                            <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                                {item.embed_url ? (
                                    <iframe src={item.embed_url} className="w-full h-full pointer-events-none opacity-40" />
                                ) : (
                                    <div className="text-white/20"><PlayCircle size={64} /></div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                                        <PlayCircle size={24} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
                                <FileText size={48} className="text-slate-300 mb-2" />
                                <div className="text-[10px] font-bold text-slate-500 uppercase truncate w-full">{item.title || 'Document'}</div>
                            </div>
                        )}

                        {/* Selection Checkmark */}
                        {selectedItems.has(item.id) && (
                            <div className="absolute top-3 right-3 z-10 text-brand-blue bg-white rounded-full shadow-lg">
                                <CheckCircle2 size={24} fill="currentColor" className="text-white bg-brand-blue rounded-full" />
                            </div>
                        )}

                        {/* Overlay Actions */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <p className="text-white text-[10px] font-bold truncate mb-1">{item.title || item.caption}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] text-white/60 font-medium uppercase tracking-tighter">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigator.clipboard.writeText(item.url);
                                            setCopiedId(item.id);
                                            showSuccess("URL Copied!", "Image URL copied to clipboard");
                                            setTimeout(() => setCopiedId(null), 2000);
                                        }}
                                        className={`p-1.5 rounded-lg text-white transition-all duration-300 ${copiedId === item.id ? 'bg-green-500 scale-110' : 'bg-white/20 hover:bg-white/40'}`}
                                        title="Copy URL">
                                        {copiedId === item.id ? <Check size={12} className="animate-bounce" /> : <Copy size={12} />}
                                    </button>
                                    {canDelete && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                            className="p-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors">
                                            <Trash2 size={12} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bulk Delete Modal */}
            {isDeletingBulk && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-red-100 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center space-x-3 text-red-600 mb-4">
                            <AlertCircle size={28} />
                            <h2 className="text-xl font-bold text-brand-navy">Bulk Deletion</h2>
                        </div>
                        <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                            You are about to permanently delete <strong>{selectedItems.size}</strong> items. This action will be logged in the audit trail.
                        </p>
                        <div className="space-y-2 mb-6">
                            <label className="form-label">Reason for Deletion</label>
                            <textarea
                                required
                                className="form-input !ring-red-500/20 !border-red-200"
                                rows={3}
                                placeholder="e.g. Duplicate uploads, outdated graphics..."
                                value={deleteReason}
                                onChange={e => setDeleteReason(e.target.value)}
                            />
                        </div>
                        <div className="flex space-x-3">
                            <button onClick={() => setIsDeletingBulk(false)} className="flex-1 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
                            <button onClick={handleBulkDelete} disabled={!deleteReason} className="flex-1 py-2.5 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-50">Delete Items</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-brand-navy tracking-tight">Add New Asset</h2>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Global Media Management</p>
                            </div>
                            <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Left Side: Type & Upload */}
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="form-label">Asset Type</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {(['image', 'video', 'document'] as const).map(t => (
                                                <button key={t} type="button" onClick={() => setNewItem({ ...newItem, media_type: t })}
                                                    className={`py-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${newItem.media_type === t ? 'border-brand-blue bg-blue-50/50 text-brand-blue' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}>
                                                    {t === 'image' ? <ImageIcon /> : t === 'video' ? <PlayCircle /> : <FileText />}
                                                    <span className="text-[10px] font-black uppercase mt-2">{t}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="form-label">
                                            {newItem.media_type === 'video' ? 'Video URL (YouTube, TikTok, Facebook, Instagram, Vimeo)' : 'Upload File'}
                                        </label>

                                        {newItem.media_type === 'video' ? (() => {
                                            const videoInfo = newItem.url ? parseVideoUrl(newItem.url) : null;
                                            return (
                                                <div className="space-y-4">
                                                    <input
                                                        type="text"
                                                        required
                                                        className="form-input !font-medium"
                                                        value={newItem.url}
                                                        onChange={e => setNewItem({ ...newItem, url: e.target.value })}
                                                        placeholder="Paste video URL from YouTube, TikTok, Facebook, Instagram..."
                                                    />

                                                    {/* Platform Badge */}
                                                    {videoInfo && newItem.url && (
                                                        <div className="flex items-center gap-2">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white ${getPlatformColor(videoInfo.platform)}`}>
                                                                {getPlatformName(videoInfo.platform)}
                                                            </span>
                                                            {videoInfo.canEmbed ? (
                                                                <span className="text-xs text-green-600 font-medium">✓ Embeddable</span>
                                                            ) : (
                                                                <span className="text-xs text-amber-600 font-medium">⚠ May not embed properly</span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Video Preview */}
                                                    {videoInfo?.canEmbed && videoInfo.embedUrl && (
                                                        <div className="aspect-video rounded-2xl overflow-hidden bg-slate-900 border-4 border-slate-100 shadow-inner">
                                                            <iframe
                                                                src={videoInfo.embedUrl}
                                                                className="w-full h-full"
                                                                allowFullScreen
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Non-embeddable warning */}
                                                    {videoInfo && !videoInfo.canEmbed && newItem.url && (
                                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                                                            <p className="font-semibold mb-1">Unrecognized video platform</p>
                                                            <p>The URL will be saved but may not display as an embedded video. Supported platforms: YouTube, Facebook, TikTok, Instagram, Vimeo.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })() : (
                                            <div className="relative group">
                                                <input type="file" id="media-upload" className="hidden" onChange={handleFileUpload} accept={newItem.media_type === 'image' ? "image/*" : ".pdf,.doc,.docx"} />
                                                <label htmlFor="media-upload"
                                                    className={`flex flex-col items-center justify-center w-full h-64 border-4 border-dashed rounded-3xl cursor-pointer transition-all ${newItem.url ? 'border-brand-blue bg-blue-50/30' : 'border-slate-100 hover:border-brand-blue/30 focus-within:ring-4 focus-within:ring-blue-100'}`}>
                                                    {newItem.url ? (
                                                        newItem.media_type === 'image' ? (
                                                            <div className="relative h-full w-full p-4">
                                                                <Image
                                                                    src={newItem.url}
                                                                    alt="Preview"
                                                                    fill
                                                                    className="object-contain rounded-xl"
                                                                    sizes="300px"
                                                                />
                                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 rounded-xl transition-opacity">
                                                                    <span className="bg-white px-4 py-2 rounded-full font-bold text-xs shadow-xl">Change Image</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center">
                                                                <FileText size={64} className="text-brand-blue mb-4 animate-bounce" />
                                                                <span className="text-xs font-black text-brand-blue uppercase">File Ready</span>
                                                                <span className="text-[10px] text-slate-400 mt-1 max-w-[200px] truncate">{newItem.url}</span>

                                                                {/* AI Auto-fill Button for Documents */}
                                                                {newItem.media_type === 'document' && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAutoFill(); }}
                                                                        disabled={analyzing}
                                                                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/30 disabled:opacity-50"
                                                                    >
                                                                        {analyzing ? (
                                                                            <><Loader2 size={14} className="animate-spin" /> Analyzing...</>
                                                                        ) : (
                                                                            <><Sparkles size={14} /> Auto-fill with AI</>
                                                                        )}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )
                                                    ) : (
                                                        <div className="flex flex-col items-center text-slate-300 group-hover:text-brand-blue transition-colors">
                                                            {uploading ? (
                                                                <span className="flex flex-col items-center">
                                                                    <div className="w-10 h-10 border-4 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin mb-4" />
                                                                    <span className="text-xs font-black uppercase tracking-widest">Uploading Asset...</span>
                                                                </span>
                                                            ) : (
                                                                <>
                                                                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                                        <Plus size={32} />
                                                                    </div>
                                                                    <span className="text-xs font-black uppercase tracking-widest">Click to Upload</span>
                                                                    <span className="text-[10px] mt-2 font-medium opacity-60">Max size 20MB</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Side: Localization & Metadata */}
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="form-label">Essential Info</label>
                                        <input
                                            type="text"
                                            required
                                            className="form-input !font-bold"
                                            placeholder="Asset Title (Internal use)"
                                            value={newItem.title || ''}
                                            onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Alt Text (SEO/Accessibility)"
                                            value={newItem.alt_text || ''}
                                            onChange={e => setNewItem({ ...newItem, alt_text: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-slate-100">
                                        <div className="flex items-center space-x-2">
                                            <Globe size={14} className="text-slate-400" />
                                            <label className="form-label !mb-0">Captions</label>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="relative">
                                                <span className="absolute top-3 left-3 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[8px] font-black rounded uppercase">EN</span>
                                                <textarea
                                                    className="form-input !pl-12 !font-medium"
                                                    placeholder="English caption..."
                                                    rows={3}
                                                    value={newItem.caption || ''}
                                                    onChange={e => setNewItem({ ...newItem, caption: e.target.value })}
                                                />
                                            </div>
                                            <div className="relative">
                                                <span className="absolute top-3 left-3 px-1.5 py-0.5 bg-red-100 text-red-700 text-[8px] font-black rounded uppercase">NE</span>
                                                <textarea
                                                    className="form-input !pl-12 !font-medium"
                                                    placeholder="नेपाली विवरण..."
                                                    rows={3}
                                                    value={newItem.caption_ne || ''}
                                                    onChange={e => setNewItem({ ...newItem, caption_ne: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 flex justify-end space-x-4 border-t border-slate-100">
                                <button type="button" onClick={() => setIsAdding(false)}
                                    className="px-8 py-3.5 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all uppercase text-xs tracking-widest">
                                    Discard
                                </button>
                                <button type="submit" disabled={uploading || saving || !newItem.url}
                                    className="px-12 py-3.5 bg-brand-blue text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 transition-all uppercase text-xs tracking-widest disabled:opacity-50">
                                    {uploading ? 'Uploading...' : saving ? 'Saving...' : 'Save Asset'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
