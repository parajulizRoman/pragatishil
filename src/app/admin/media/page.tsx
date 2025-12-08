"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { upsertMediaItem, deleteMediaItem } from "@/actions/cms";
import { Plus, Trash2, X, PlayCircle, Image as ImageIcon } from "lucide-react";

export default function MediaManager() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [media, setMedia] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({ type: 'image', url: '', caption: '' });

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        const supabase = createClient();
        const { data } = await supabase.from('media_gallery').select('*').order('created_at', { ascending: false });
        if (data) setMedia(data);
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this media item?")) return;
        await deleteMediaItem(id);
        fetchMedia();
    };

    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);
        const supabase = createClient();

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data } = supabase.storage.from('media').getPublicUrl(filePath);

            setNewItem({ ...newItem, url: data.publicUrl });
        } catch (error) {
            console.error(error);
            alert("Error uploading image");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await upsertMediaItem({ ...newItem, type: activeTab }); // Ensure type matches tab
            setIsAdding(false);
            setNewItem({ type: activeTab, url: '', caption: '' });
            fetchMedia();
        } catch (error) {
            alert("Failed to save");
            console.error(error);
        }
    };

    const filteredMedia = media.filter(m => m.type === activeTab);

    if (loading) return <div className="p-8">Loading media...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Media Gallery</h1>
                <button
                    onClick={() => { setNewItem({ type: activeTab, url: '', caption: '' }); setIsAdding(true); }}
                    className="flex items-center space-x-2 bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>Add {activeTab === 'image' ? 'Image' : 'Video'}</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-200 p-1 rounded-lg inline-block">
                <button
                    onClick={() => setActiveTab('image')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${activeTab === 'image' ? "bg-white text-brand-blue shadow-sm" : "text-slate-600"}`}
                >
                    <ImageIcon size={18} />
                    <span>Images</span>
                </button>
                <button
                    onClick={() => setActiveTab('video')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${activeTab === 'video' ? "bg-white text-brand-blue shadow-sm" : "text-slate-600"}`}
                >
                    <PlayCircle size={18} />
                    <span>Videos</span>
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {filteredMedia.map((item) => (
                    <div key={item.id} className="relative group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden aspect-square">
                        {item.type === 'image' ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                                {/* Simple Youtube Preview if possible, or icon */}
                                <iframe src={item.url} className="w-full h-full pointer-events-none opacity-50" />
                                <PlayCircle className="text-white absolute z-10" size={48} />
                            </div>
                        )}

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center">
                            <p className="text-sm font-medium line-clamp-2 mb-2">{item.caption}</p>
                            <button onClick={() => handleDelete(item.id)} className="bg-red-500/80 hover:bg-red-600 p-2 rounded-full text-white">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-800">{activeTab === 'image' ? 'Upload Image' : 'Add Video Link'}</h2>
                            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {activeTab === 'video' ? 'Video Embed URL' : 'Image File'}
                                </label>

                                {activeTab === 'image' ? (
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="file-upload"
                                                className="hidden"
                                                onChange={handleFileUpload}
                                            />
                                            <label
                                                htmlFor="file-upload"
                                                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all ${newItem.url ? 'border-brand-blue bg-blue-50' : 'border-slate-300 hover:border-brand-blue hover:bg-slate-50'}`}
                                            >
                                                {newItem.url ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={newItem.url} alt="Preview" className="h-full w-full object-contain rounded-lg p-2" />
                                                ) : (
                                                    <div className="flex flex-col items-center text-slate-500">
                                                        {uploading ? (
                                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mb-2"></div>
                                                        ) : (
                                                            <ImageIcon size={48} className="mb-2 opacity-50" />
                                                        )}
                                                        <span className="text-sm font-medium">{uploading ? 'Uploading...' : 'Click to select an image'}</span>
                                                        <span className="text-xs mt-1 text-slate-400">JPG, PNG, WebP up to 5MB</span>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all"
                                        value={newItem.url}
                                        onChange={e => setNewItem({ ...newItem, url: e.target.value })}
                                        placeholder="https://youtube.com/embed/..."
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Caption</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all text-slate-800 bg-white"
                                    value={newItem.caption}
                                    onChange={e => setNewItem({ ...newItem, caption: e.target.value })}
                                    placeholder="Enter a descriptive caption..."
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={uploading || (activeTab === 'image' && !newItem.url)}
                                    className="w-full py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
                                >
                                    {uploading ? 'Uploading...' : 'Save Media'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
