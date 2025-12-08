"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { upsertNewsItem, deleteNewsItem } from "@/actions/cms";
import { Plus, Edit, Trash2, X } from "lucide-react";

export default function NewsManager() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [currentItem, setCurrentItem] = useState<any>(null);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        const supabase = createClient();
        const { data } = await supabase.from('news_items').select('*').order('date', { ascending: false });
        if (data) setNews(data);
        setLoading(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleEdit = (item: any) => {
        setCurrentItem(item);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setCurrentItem({ title: '', source: '', date: new Date().toISOString().split('T')[0], type: 'Article', link: '', image_url: '' });
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this news item?")) return;
        await deleteNewsItem(id);
        fetchNews();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await upsertNewsItem(currentItem);
            setIsEditing(false);
            fetchNews();
        } catch (error) {
            alert("Failed to save");
            console.error(error);
        }
    };

    if (loading) return <div className="p-8">Loading news...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">News Room</h1>
                <button
                    onClick={handleAddNew}
                    className="flex items-center space-x-2 bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>Add News Item</span>
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Date</th>
                            <th className="p-4 font-semibold text-slate-600">Type</th>
                            <th className="p-4 font-semibold text-slate-600">Title</th>
                            <th className="p-4 font-semibold text-slate-600">Source</th>
                            <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {news.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-slate-500 text-sm whitespace-nowrap">{item.date}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                        ${item.type === 'Video' ? 'bg-red-100 text-red-700' :
                                            item.type === 'Interview' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {item.type}
                                    </span>
                                </td>
                                <td className="p-4 font-medium text-slate-800 line-clamp-1 max-w-xs">{item.title}</td>
                                <td className="p-4 text-slate-500">{item.source}</td>
                                <td className="p-4 text-right flex justify-end space-x-2">
                                    <button onClick={() => handleEdit(item)} className="p-2 hover:bg-slate-200 rounded text-slate-600"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-100 rounded text-red-600"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {news.length === 0 && <div className="p-8 text-center text-slate-500">No news items found.</div>}
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">{currentItem.id ? 'Edit News' : 'Add News'}</h2>
                            <button onClick={() => setIsEditing(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select
                                        className="w-full p-2 border rounded"
                                        value={currentItem.type}
                                        onChange={e => setCurrentItem({ ...currentItem, type: e.target.value })}
                                    >
                                        <option value="Article">Article</option>
                                        <option value="Video">Video</option>
                                        <option value="Interview">Interview</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border rounded"
                                        value={currentItem.date}
                                        onChange={e => setCurrentItem({ ...currentItem, date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 border rounded"
                                    value={currentItem.title}
                                    onChange={e => setCurrentItem({ ...currentItem, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Featured Image</label>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="news-image-upload"
                                            className="hidden"
                                            onChange={async (e) => {
                                                if (!e.target.files || e.target.files.length === 0) return;
                                                const file = e.target.files[0];
                                                const supabase = createClient();
                                                try {
                                                    const fileExt = file.name.split('.').pop();
                                                    const fileName = `news-${Date.now()}.${fileExt}`;
                                                    const { error } = await supabase.storage.from('media').upload(fileName, file);
                                                    if (error) throw error;
                                                    const { data } = supabase.storage.from('media').getPublicUrl(fileName);
                                                    setCurrentItem({ ...currentItem, image_url: data.publicUrl });
                                                } catch (err) {
                                                    console.error(err);
                                                    alert("Upload failed. Check permissions.");
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor="news-image-upload"
                                            className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${currentItem.image_url ? 'border-brand-blue bg-blue-50' : 'border-slate-300 hover:border-brand-blue hover:bg-slate-50'}`}
                                        >
                                            {currentItem.image_url ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={currentItem.image_url} alt="Preview" className="h-full object-contain rounded-lg p-1" />
                                            ) : (
                                                <div className="text-center text-slate-500">
                                                    <span className="text-sm font-medium">Click to upload image</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-slate-400 text-xs">URL</span>
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full pl-10 p-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-blue outline-none transition-all"
                                            value={currentItem.image_url || ''}
                                            onChange={e => setCurrentItem({ ...currentItem, image_url: e.target.value })}
                                            placeholder="or paste image URL here..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700">Save Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
