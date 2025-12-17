/* eslint-disable */
import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { DiscussionChannel, UserRole } from "@/types";
import { createBrowserClient } from "@supabase/ssr";

import CategoryManagerModal from "./CategoryManagerModal";

interface ChannelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editChannel?: DiscussionChannel | null;
}

export default function ChannelModal({ isOpen, onClose, onSuccess, editChannel }: ChannelModalProps) {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [docsUrl, setDocsUrl] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [readmeContent, setReadmeContent] = useState("");
    const [category, setCategory] = useState("General");
    const [visibility, setVisibility] = useState<"public" | "logged_in" | "party_only">("public");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'details' | 'resources'>('details');

    // Resources State
    const [resources, setResources] = useState<{ title: string; type: string; url: string }[]>([]);

    // Category Manager State
    const [categoriesList, setCategoriesList] = useState<{ name: string }[]>([]);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    // Impact Stats State
    const [impactStats, setImpactStats] = useState<Record<string, string>>({});

    const handleAddStat = () => {
        setImpactStats({ ...impactStats, "": "" });
    };

    const handleRemoveStat = (keyToRemove: string) => {
        const newStats = { ...impactStats };
        delete newStats[keyToRemove];
        setImpactStats(newStats);
    };

    const handleStatChange = (oldKey: string, newKey: string, newValue: string) => {
        if (oldKey !== newKey) {
            // Key changed: create new entry, delete old
            const newStats = { ...impactStats };
            delete newStats[oldKey];
            newStats[newKey] = newValue;
            setImpactStats(newStats);
        } else {
            // Value changed
            setImpactStats({ ...impactStats, [newKey]: newValue });
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/discussions/categories");
            if (res.ok) {
                const data = await res.json();
                setCategoriesList(data.categories);
            }
        } catch (e) {
            console.error("Failed to load categories");
        }
    };

    useEffect(() => {
        if (isOpen) fetchCategories();
    }, [isOpen]);

    // Reset or Populate form
    useEffect(() => {
        if (isOpen) {
            if (editChannel) {
                setName(editChannel.name);
                setSlug(editChannel.slug);
                setDescription(editChannel.description || "");
                setDocsUrl(editChannel.docs_url || "");
                setVideoUrl(editChannel.video_playlist_url || "");
                setReadmeContent(editChannel.readme_content || "");
                setCategory(editChannel.category || "General");
                setVisibility((editChannel.visibility as "public" | "logged_in" | "party_only") || "public");
                if (editChannel.resources) {
                    setResources(editChannel.resources.map(r => ({
                        title: r.title,
                        type: r.type, // 'doc' | 'video' | 'link' | 'impact' | 'other'
                        url: r.url
                    })));
                } else {
                    setResources([]);
                }
                setImpactStats(
                    editChannel.impact_stats
                        ? Object.fromEntries(
                            Object.entries(editChannel.impact_stats).map(([k, v]) => [k, String(v)])
                        )
                        : {}
                );
            } else {
                // Reset for Create
                setName("");
                setSlug("");
                setDescription("");
                setDocsUrl("");
                setVideoUrl("");
                setReadmeContent("");
                setCategory("General");
                setVisibility("public");
                setResources([]);
                setImpactStats({});
            }
            setError(null);
            setActiveTab('details');
        }
    }, [isOpen, editChannel]);

    // Helper to auto-slugify
    const handleAutoSlug = (text: string) => {
        setName(text);
        if (!editChannel) {
            setSlug(
                text.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
            );
        }
    };

    // Auto-slugify name if creating (This useEffect is slightly redundant/conflicting with handleAutoSlug but let's keep handleAutoSlug as the driver)
    // Actually, handleAutoSlug updates both name and slug. The useEffect at line 89 was redundant or conflicting. 
    // I will remove the useEffect at lines 89-97 in favor of explicit handleAutoSlug logic.

    // Resource Handlers
    const handleAddResource = () => {
        setResources([...resources, { title: "", type: "link", url: "" }]);
    };

    const handleRemoveResource = (index: number) => {
        const newRes = [...resources];
        newRes.splice(index, 1);
        setResources(newRes);
    };

    const handleResourceChange = (index: number, field: keyof typeof resources[0], value: string) => {
        const newRes = [...resources];
        newRes[index] = { ...newRes[index], [field]: value };
        setResources(newRes);
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const method = editChannel ? "PUT" : "POST";
            const url = "/api/discussions/channels";

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const body: any = {
                name,
                slug,
                description,
                visibility,
                category,
                readme_content: readmeContent || null,
                impact_stats: impactStats, // Add Impact Stats
                resources
            };

            if (editChannel) {
                body.id = editChannel.id;
            } else {
                // Default settings for new channels if not explicitly in form
                body.allow_anonymous_posts = false;
                body.min_role_to_post = 'member';
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save channel");
            }

            onSuccess();
            onClose();
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert("Error: " + err.message);
            } else {
                alert("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-xl">
                    <h2 className="text-xl font-bold text-slate-800">
                        {editChannel ? 'Edit Channel' : 'Create New Channel'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex border-b border-slate-200 px-6">
                    <button
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setActiveTab('details')}
                    >
                        Details
                    </button>
                    <button
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'resources' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setActiveTab('resources')}
                    >
                        Resources & Content
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {activeTab === 'details' ? (
                        <form id="channel-form" onSubmit={handleSubmit} className="space-y-4">
                            {/* Existing Fields */}
                            <CategoryManagerModal
                                isOpen={isCategoryModalOpen}
                                onClose={() => setIsCategoryModalOpen(false)}
                                onUpdate={fetchCategories} // Use fetchCategories to refresh list
                                currentCategories={categoriesList.map(c => c.name)}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Channel Name</label>
                                    <input
                                        required
                                        className="form-input"
                                        value={name}
                                        onChange={e => handleAutoSlug(e.target.value)}
                                        placeholder="e.g. Health Policy"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Slug (URL)</label>
                                    <input
                                        required
                                        className="form-input bg-slate-50 font-mono text-slate-600"
                                        value={slug}
                                        onChange={e => setSlug(e.target.value)}
                                        placeholder="health-policy"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Description</label>
                                <textarea
                                    className="form-input"
                                    rows={3}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="What is this channel about?"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Visibility</label>
                                    <select
                                        className="form-input"
                                        value={visibility}
                                        onChange={e => setVisibility(e.target.value as "public" | "logged_in" | "party_only")}
                                    >
                                        <option value="public">Public (Everyone)</option>
                                        <option value="logged_in">Members Only</option>
                                        <option value="party_only">Party Only</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700 flex justify-between">
                                        Category
                                        <button
                                            type="button"
                                            onClick={() => setIsCategoryModalOpen(true)}
                                            className="text-xs text-brand-blue hover:underline"
                                        >
                                            Manage
                                        </button>
                                    </label>
                                    <select
                                        className="form-input"
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                    >
                                        <option value="">Select a Category...</option>
                                        {categoriesList.map(c => (
                                            <option key={c.name} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            {/* Readme Section */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Readme Content (Markdown)</label>
                                <p className="text-xs text-slate-500">Displayed in the "About" tab of the channel.</p>
                                <textarea
                                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none font-mono"
                                    rows={6}
                                    value={readmeContent}
                                    onChange={e => setReadmeContent(e.target.value)}
                                    placeholder="# Welcome to this channel..."
                                />
                            </div>

                            {/* Legacy URLs */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Legacy Docs URL</label>
                                    <input
                                        type="url"
                                        className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                                        value={docsUrl}
                                        onChange={e => setDocsUrl(e.target.value)}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Legacy Video URL</label>
                                    <input
                                        type="url"
                                        className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                                        value={videoUrl}
                                        onChange={e => setVideoUrl(e.target.value)}
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>
                            </div>

                            {/* New Resources List */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-slate-700">Additional Resources</label>
                                    <button
                                        type="button"
                                        onClick={handleAddResource}
                                        className="text-xs text-brand-blue hover:bg-blue-50 px-2 py-1 rounded"
                                    >
                                        + Add Resource
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {resources.map((res, idx) => (
                                        <div key={idx} className="flex gap-2 items-start border p-2 rounded-lg bg-slate-50">
                                            <div className="grid grid-cols-3 gap-2 flex-grow">
                                                <input
                                                    placeholder="Title"
                                                    value={res.title}
                                                    onChange={e => handleResourceChange(idx, 'title', e.target.value)}
                                                    className="col-span-1 text-sm border rounded px-2 py-1"
                                                />
                                                <select
                                                    value={res.type}
                                                    onChange={e => handleResourceChange(idx, 'type', e.target.value)}
                                                    className="col-span-1 text-sm border rounded px-2 py-1"
                                                >
                                                    <option value="link">Link</option>
                                                    <option value="doc">Document</option>
                                                    <option value="video">Video</option>
                                                    <option value="impact">Impact</option>
                                                </select>
                                                <input
                                                    type="url"
                                                    placeholder="URL"
                                                    value={res.url}
                                                    onChange={e => handleResourceChange(idx, 'url', e.target.value)}
                                                    className="col-span-1 text-sm border rounded px-2 py-1"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveResource(idx)}
                                                className="text-slate-400 hover:text-red-500 p-1"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {resources.length === 0 && (
                                        <p className="text-xs text-slate-400 italic text-center py-2">No additional resources added.</p>
                                    )}
                                </div>
                            </div>

                            {/* Impact Stats Editor */}
                            <div className="space-y-2 pt-4 border-t border-slate-100">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-slate-700">Impact Statistics</label>
                                    <button
                                        type="button"
                                        onClick={handleAddStat}
                                        className="text-xs text-brand-blue hover:bg-blue-50 px-2 py-1 rounded"
                                    >
                                        + Add Stat
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500">Key-Value pairs (e.g., &quot;Villages Reached&quot;: &quot;15&quot;)</p>

                                <div className="space-y-2">
                                    {Object.entries(impactStats).map(([key, value], idx) => (
                                        <div key={idx} className="flex gap-2 items-center border p-2 rounded-lg bg-emerald-50/50">
                                            <input
                                                placeholder="Label (e.g. Students)"
                                                value={key}
                                                onChange={e => handleStatChange(key, e.target.value, value)}
                                                className="flex-1 bg-white text-slate-900 text-sm border rounded px-2 py-1"
                                            />
                                            <span className="text-slate-400">:</span>
                                            <input
                                                placeholder="Value (e.g. 500)"
                                                value={value}
                                                onChange={e => handleStatChange(key, key, e.target.value)}
                                                className="w-24 bg-white text-slate-900 text-sm border rounded px-2 py-1 font-mono"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveStat(key)}
                                                className="text-slate-400 hover:text-red-500 p-1"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {Object.keys(impactStats).length === 0 && (
                                        <p className="text-xs text-slate-400 italic text-center py-2">No impact stats recorded.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-100 flex justify-end gap-3 rounded-b-xl bg-slate-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 text-sm font-bold text-white bg-brand-blue hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-70 flex items-center gap-2"
                    >
                        {loading ? 'Saving...' : (editChannel ? 'Update Channel' : 'Create Channel')}
                    </button>
                </div>
            </div>
        </div>
    );
}
