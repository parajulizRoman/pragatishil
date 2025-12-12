"use client";

import React, { useState, useEffect } from "react";
import { DiscussionChannel, UserRole } from "@/types";
import { createBrowserClient } from "@supabase/ssr";

interface ChannelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editChannel?: DiscussionChannel | null; // If provided, we are in Edit mode
}

export default function ChannelModal({ isOpen, onClose, onSuccess, editChannel }: ChannelModalProps) {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [docsUrl, setDocsUrl] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [readme, setReadme] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset or Populate form
    useEffect(() => {
        if (isOpen) {
            if (editChannel) {
                setName(editChannel.name);
                setSlug(editChannel.slug);
                setDescription(editChannel.description || "");
                setDocsUrl(editChannel.docs_url || "");
                setVideoUrl(editChannel.video_playlist_url || "");
                setReadme(editChannel.readme_content || "");
            } else {
                // Reset for Create
                setName("");
                setSlug("");
                setDescription("");
                setDocsUrl("");
                setVideoUrl("");
                setReadme("");
            }
            setError(null);
        }
    }, [isOpen, editChannel]);

    // Auto-slugify name if creating
    useEffect(() => {
        if (!editChannel && name) {
            setSlug(
                name.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
            );
        }
    }, [name, editChannel]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            // Basic payload
            const payload = {
                name,
                slug,
                description,
                docs_url: docsUrl || null,
                video_playlist_url: videoUrl || null,
                readme_content: readme || null,
            };

            if (editChannel) {
                // Update
                const { error: updateError } = await supabase
                    .from("discussion_channels")
                    .update(payload)
                    .eq("id", editChannel.id);

                if (updateError) throw updateError;
            } else {
                // Create
                // Default roles for now
                const createPayload = {
                    ...payload,
                    visibility: 'public', // Default public
                    min_role_to_post: 'party_member',
                    min_role_to_create_threads: 'party_member',
                    allow_anonymous_posts: false
                };

                const { error: insertError } = await supabase
                    .from("discussion_channels")
                    .insert(createPayload);

                if (insertError) throw insertError;
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                    <h2 className="text-xl font-bold text-brand-navy">
                        {editChannel ? "Edit Channel" : "Create New Channel"}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Channel Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none"
                                placeholder="e.g. Political Strategy"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                            <input
                                type="text"
                                required
                                value={slug}
                                onChange={e => setSlug(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-600 font-mono"
                                placeholder="political-strategy"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none h-20 resize-none"
                            placeholder="Brief purpose of this channel..."
                        />
                    </div>

                    {/* Resources Section */}
                    <div className="border-t border-slate-100 pt-4 mt-2">
                        <h3 className="text-sm font-bold text-slate-800 mb-3">Resources & Links</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Docs URL</label>
                                <input
                                    type="url"
                                    value={docsUrl}
                                    onChange={e => setDocsUrl(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none"
                                    placeholder="https://"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Saved Videos URL</label>
                                <input
                                    type="url"
                                    value={videoUrl}
                                    onChange={e => setVideoUrl(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none"
                                    placeholder="https://youtube.com/playlist?list=..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Readme Content */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Read Me Content (Markdown)</label>
                        <textarea
                            value={readme}
                            onChange={e => setReadme(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none h-32 font-mono text-xs"
                            placeholder="# Channel Guidelines..."
                        />
                    </div>

                    <div className="flex justify-end pt-4 gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all font-medium text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-brand-navy text-white rounded-lg hover:bg-slate-800 transition-all font-medium text-sm shadow-sm"
                        >
                            {saving ? "Saving..." : (editChannel ? "Save Changes" : "Create Channel")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
