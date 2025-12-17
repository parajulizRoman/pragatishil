/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DiscussionThread, DiscussionChannel } from "@/types";
import { createBrowserClient } from "@supabase/ssr";
import { flagContent } from "@/app/commune/actions";
import TextareaAutosize from 'react-textarea-autosize';
import { Paperclip, X, FileText, Image as ImageIcon, Loader2 } from "lucide-react";

export default function ChannelPage() {
    const params = useParams();
    const channelId = params.channelId as string;

    const [channel, setChannel] = useState<DiscussionChannel | null>(null);
    const [threads, setThreads] = useState<DiscussionThread[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Thread Creation State
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newBody, setNewBody] = useState("");
    const [isNewThreadAnon, setIsNewThreadAnon] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Attachments State
    const [attachments, setAttachments] = useState<{ file: File, meta: any }[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // UI Tabs
    const [activeTab, setActiveTab] = useState<'discussions' | 'resources' | 'impact'>('discussions');

    // Flagging
    const [flagThreadId, setFlagThreadId] = useState<string | null>(null);
    const [flagReason, setFlagReason] = useState("other");
    const [isFlagging, setIsFlagging] = useState(false);

    // Auth check
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        supabase.auth.getUser().then(({ data }) => {
            setIsAuthenticated(!!data.user);
        });
    }, []);

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        try {
            // Determine if channelId is UUID or Slug
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(channelId);

            // Construct queries for parallel fetching
            const channelQuery = isUuid ? `id=${channelId}` : `slug=${channelId}`;
            const threadsQuery = isUuid ? `channel_id=${channelId}` : `channel_slug=${channelId}`;

            // Parallel fetch: Get Channel Info AND Threads Query
            const [cRes, tRes] = await Promise.all([
                fetch(`/api/discussions/channels?${channelQuery}`),
                fetch(`/api/discussions/threads?${threadsQuery}`)
            ]);

            if (!cRes.ok) throw new Error("Failed to load channel");
            if (!tRes.ok) throw new Error("Failed to load threads");

            const cData = await cRes.json();
            const tData = await tRes.json();

            if (cData.channels.length === 0) throw new Error("Channel not found");

            setChannel(cData.channels[0]);
            setThreads(tData.threads);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [channelId]);

    useEffect(() => {
        if (channelId) {
            fetchData();
        }
    }, [channelId, fetchData]);

    // Attachment Helpers
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);

        setIsUploading(true);
        try {
            const newAttachments = [];
            for (const file of files) {
                // 1. Get Signed URL
                const res = await fetch("/api/discussions/attachments/sign-url", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        filename: file.name,
                        fileType: file.type,
                        sizeBytes: file.size
                    })
                });

                if (!res.ok) throw new Error(await res.text());
                const { uploadUrl, storagePath } = await res.json();

                // 2. Upload to Storage
                await fetch(uploadUrl, {
                    method: "PUT",
                    body: file,
                    headers: { "Content-Type": file.type }
                });

                // 3. Add to local state
                newAttachments.push({
                    file,
                    meta: {
                        storagePath,
                        fileName: file.name,
                        mimeType: file.type,
                        sizeBytes: file.size,
                        type: file.type.startsWith("image/") ? "image" : (file.type === "application/pdf" ? "pdf" : "file")
                    }
                });
            }
            setAttachments(prev => [...prev, ...newAttachments]);
        } catch (err: any) {
            alert("Upload failed: " + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const removeAttachment = (idx: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== idx));
    };


    const handleCreateThread = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        setIsCreating(true);
        try {
            const payload = {
                channelId,
                title: newTitle,
                content: newBody,
                isAnon: isNewThreadAnon,
                attachments: attachments.map(a => a.meta)
            };

            const res = await fetch("/api/discussions/threads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to create thread");
            }

            setNewTitle("");
            setNewBody("");
            setAttachments([]);
            setShowForm(false);
            fetchData(); // Refresh list
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsCreating(false);
        }
    };

    const handleFlag = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!flagThreadId) return;
        setIsFlagging(true);
        try {
            await flagContent(flagThreadId, 'thread', flagReason);
            alert("Report submitted.");
            setFlagThreadId(null);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsFlagging(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (error || !channel) return <div className="p-10 text-center text-red-500">Error: {error || "Channel Not Found"}</div>;

    const canCreateThread = isAuthenticated || channel.min_role_to_create_threads === 'anonymous_visitor';

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* Header */}
            <div className="mb-6">
                <Link href="/commune" className="text-sm text-slate-500 hover:text-brand-blue mb-2 inline-block">
                    &larr; Back to Channels
                </Link>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-brand-navy">{channel.name}</h1>
                        {channel.name_ne && <h2 className="text-xl font-nepali text-slate-600">{channel.name_ne}</h2>}
                        <p className="text-slate-600 mt-2">{channel.description_en || channel.description}</p>
                    </div>
                    {canCreateThread && !showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-brand-red text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                        >
                            New Thread
                        </button>
                    )}
                </div>

                {/* Guidelines Box */}
                {(channel.guidelines_en || channel.guidelines_ne) && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-slate-700">
                        <strong className="block text-brand-blue mb-1">Guidelines:</strong>
                        <p>{channel.guidelines_en}</p>
                        {channel.guidelines_ne && <p className="font-nepali text-slate-600 mt-1">{channel.guidelines_ne}</p>}
                    </div>
                )}
            </div>

            {/* Create Thread Form */}
            {showForm && (
                <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm mb-8 animate-in slide-in-from-top-2">
                    <h3 className="font-bold text-lg mb-4">Create New Thread</h3>
                    {!isAuthenticated && channel.min_role_to_create_threads !== 'anonymous_visitor' && (
                        <div className="text-red-500 text-sm mb-2">You must be logged in to create a thread here.</div>
                    )}
                    <form onSubmit={handleCreateThread}>
                        {/* Title Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-slate-400 font-normal">(Max 140 chars)</span></label>
                            <input
                                type="text"
                                value={newTitle}
                                maxLength={140}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="form-input text-lg font-semibold"
                                placeholder={channel.allow_anonymous_posts ? "Topic of discussion..." : "What's on your mind?"}
                                required
                            />
                        </div>

                        {/* Body Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Content <span className="text-slate-400 font-normal">(Markdown supported)</span></label>
                            <TextareaAutosize
                                minRows={5}
                                value={newBody}
                                onChange={(e) => setNewBody(e.target.value)}
                                className="form-input resize-none"
                                placeholder="Share your detailed thoughts, arguments, or questions..."
                                required
                            />

                            {/* Attachment List */}
                            {attachments.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {attachments.map((att, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm">
                                            {att.meta.type === 'image' ? <ImageIcon size={14} className="text-blue-500" /> : <FileText size={14} className="text-orange-500" />}
                                            <span className="truncate max-w-[150px]">{att.meta.fileName}</span>
                                            <button type="button" onClick={() => removeAttachment(i)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Toolbar */}
                            <div className="mt-2 flex items-center">
                                <label className={`flex items-center gap-2 px-3 py-1.5 rounded hover:bg-slate-100 cursor-pointer text-slate-600 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <input type="file" multiple className="hidden" onChange={handleFileSelect} />
                                    {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Paperclip size={16} />}
                                    <span className="text-sm font-medium">Attach files</span>
                                </label>
                            </div>
                        </div>

                        {/* Actions Row */}
                        <div className="flex justify-between items-center pt-2">
                            {/* Anon Toggle for Allowed Channels */}
                            {channel.allow_anonymous_posts ? (
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={isNewThreadAnon}
                                        onChange={(e) => setIsNewThreadAnon(e.target.checked)}
                                        className="w-4 h-4 rounded text-brand-blue focus:ring-brand-blue"
                                    />
                                    <span className="text-sm text-slate-600">
                                        Post as <span className={`font-medium ${isNewThreadAnon ? 'text-brand-blue' : 'text-slate-900'}`}>{isNewThreadAnon ? "Anonymous" : (isAuthenticated ? "Myself" : "Guest")}</span>
                                    </span>
                                </label>
                            ) : (
                                <div></div> // Spacer
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-brand-blue text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
                                    disabled={isCreating || isUploading}
                                >
                                    {isCreating ? "Publishing..." : "Publish Thread"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-200 mb-6">
                <button
                    onClick={() => setActiveTab('discussions')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'discussions' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Discussions
                </button>
                <button
                    onClick={() => setActiveTab('resources')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'resources' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Resources & Docs
                </button>
                <button
                    onClick={() => setActiveTab('impact')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'impact' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Impact & Stats
                </button>
            </div>

            {/* TAB CONTENT */}
            {activeTab === 'discussions' && (
                <div className="space-y-4">
                    {threads.length === 0 ? (
                        <div className="text-center p-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <p className="text-slate-500">No threads yet. Be the first to start a conversation!</p>
                        </div>
                    ) : (
                        threads.map(thread => (
                            <div key={thread.id} className="group relative">
                                <Link href={`/commune/thread/${thread.id}`} className="block">
                                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow transition-all group-hover:border-brand-blue/30 relative overflow-hidden">
                                        {thread.buried_at && (
                                            <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-xs px-2 py-1">Buried</div>
                                        )}
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-brand-navy mb-1 group-hover:text-brand-blue transition-colors">
                                                    {thread.title}
                                                </h3>
                                                {thread.first_post_content && (
                                                    <p className="text-slate-600 text-sm line-clamp-2 mb-2 pr-4">{thread.first_post_content}</p>
                                                )}
                                                <div className="flex items-center text-xs text-slate-500 gap-4 mt-2">
                                                    <span>{new Date(thread.created_at!).toLocaleString()}</span>
                                                    {thread.is_anonymous && <span className="text-slate-400 italic">Anonymous Thread</span>}
                                                </div>
                                            </div>
                                            {/* Stats (Votes/Comments) */}
                                            <div className="flex items-center gap-4 text-slate-500 text-sm ml-4">
                                                <div className="flex items-center gap-1" title="Votes">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                                                    <span className="font-medium text-slate-700">{(thread.upvotes || 0) - (thread.downvotes || 0)}</span>
                                                </div>
                                                <div className="flex items-center gap-1" title="Comments">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                                    <span className="font-medium text-slate-700">{(thread.total_posts || 1) - 1}</span>
                                                </div>
                                                {/* Flag Button (Prevent Link Click) */}
                                                <button
                                                    onClick={(e) => { e.preventDefault(); setFlagThreadId(thread.id); }}
                                                    className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                                    title="Report Thread"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'resources' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                    {/* Read Me / Guidelines */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-brand-navy mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            Key Documents & ReadMe
                        </h3>
                        {channel.readme_content ? (
                            <div className="prose prose-sm text-slate-600 whitespace-pre-wrap max-w-none">
                                {channel.readme_content}
                            </div>
                        ) : (
                            <p className="text-slate-400 italic">No specific guidelines or readme content added yet.</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Documents & Links Column */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                Documents & Links
                            </h3>

                            {/* Legacy Doc Link */}
                            {channel.docs_url && (
                                <a href={channel.docs_url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-blue-50 border border-blue-100 rounded-lg hover:shadow-md transition-all group">
                                    <div className="font-semibold text-brand-blue flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                                        Main Drive Folder (Legacy)
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">External Link</div>
                                </a>
                            )}

                            {/* Dynamic Resources (docs, links) */}
                            {channel.resources?.filter(r => ['doc', 'link'].includes(r.type)).map(res => (
                                <a key={res.id} href={res.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white border border-slate-200 rounded-lg hover:border-brand-blue/50 hover:shadow-sm transition-all">
                                    <div className="font-semibold text-slate-800 flex items-center gap-2">
                                        {res.type === 'doc' ? '📄' : '🔗'} {res.title}
                                    </div>
                                    {/* @ts-ignore */}
                                    {res.description && <div className="text-xs text-slate-500 mt-1">{res.description}</div>}
                                </a>
                            ))}

                            {(!channel.docs_url && (!channel.resources || !channel.resources.some(r => ['doc', 'link'].includes(r.type)))) && (
                                <p className="text-slate-400 italic text-sm">No documents found.</p>
                            )}
                        </div>

                        {/* Videos Column */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-2">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Featured Videos
                            </h3>

                            {/* Legacy Video Link */}
                            {channel.video_playlist_url && (
                                <a href={channel.video_playlist_url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-red-50 border border-red-100 rounded-lg hover:shadow-md transition-all">
                                    <div className="font-semibold text-red-700 flex items-center gap-2">
                                        ▶ Official Playlist (Legacy)
                                    </div>
                                    <div className="text-xs text-red-500 mt-1">YouTube Playlist</div>
                                </a>
                            )}

                            {/* Dynamic Resources (video) */}
                            {channel.resources?.filter(r => r.type === 'video').map(res => (
                                <a key={res.id} href={res.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white border border-slate-200 rounded-lg hover:border-red-300 hover:shadow-sm transition-all">
                                    <div className="font-semibold text-slate-800 flex items-center gap-2">
                                        📺 {res.title}
                                    </div>
                                    {/* @ts-ignore */}
                                    {res.description && <div className="text-xs text-slate-500 mt-1">{res.description}</div>}
                                </a>
                            ))}

                            {(!channel.video_playlist_url && (!channel.resources || !channel.resources.some(r => r.type === 'video'))) && (
                                <p className="text-slate-400 italic text-sm">No videos found.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'impact' && (
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="text-2xl font-bold text-brand-navy mb-6">Channel Impact</h3>
                    {channel.impact_stats && Object.keys(channel.impact_stats).length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {Object.entries(channel.impact_stats).map(([key, value]) => (
                                <div key={key} className="p-4 bg-slate-50 rounded-lg">
                                    <div className="text-3xl font-bold text-brand-blue mb-1">{String(value)}</div>
                                    {/* @ts-ignore */}
                                    <div className="text-sm text-slate-600 uppercase tracking-wide font-medium">{key.replace(/_/g, ' ')}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-slate-500">
                            <p className="mb-4">Impact statistics track the real-world outcomes of discussions here.</p>
                            <p className="italic text-slate-400">No stats recorded yet.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Flag Modal */}
            {flagThreadId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-bold mb-4">Report Thread</h3>
                        <form onSubmit={handleFlag}>
                            <select
                                className="w-full border rounded p-2 mb-4"
                                value={flagReason}
                                onChange={e => setFlagReason(e.target.value)}
                            >
                                <option value="spam">Spam</option>
                                <option value="inappropriate">Inappropriate</option>
                                <option value="other">Other</option>
                            </select>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setFlagThreadId(null)} className="px-3 py-1.5 text-slate-600">Cancel</button>
                                <button type="submit" disabled={isFlagging} className="px-3 py-1.5 bg-red-600 text-white rounded">Report</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
