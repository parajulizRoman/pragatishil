/* eslint-disable */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { DiscussionPost, DiscussionThread } from "@/types";
import { createBrowserClient } from "@supabase/ssr";
import { flagContent, votePost, toggleThreadInteraction, toggleReaction } from "@/app/commune/actions";
import Link from "next/link";
import Image from "next/image";
import { X, Shield, User, Crown, Paperclip, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import TextareaAutosize from 'react-textarea-autosize';

// Helpers
const PLACEHOLDERS = [
    "/placeholders/eye-red.svg",
    "/placeholders/eye-blue.svg",
];

const getRoleBadge = (role?: string) => {
    if (!role) return null;
    switch (role) {
        case 'admin_party': return { color: "bg-red-100 text-red-700 border-red-200", icon: <Crown size={12} fill="currentColor" /> };
        case 'yantrik': return { color: "bg-slate-100 text-slate-700 border-slate-200", icon: <Shield size={12} /> };
        case 'central_committee': return { color: "bg-blue-100 text-blue-700 border-blue-200", icon: <Shield size={12} fill="currentColor" /> };
        case 'team_member': return { color: "bg-green-100 text-green-700 border-green-200", icon: <User size={12} /> };
        case 'party_member': return { color: "bg-brand-red/10 text-brand-red border-brand-red/20", icon: <User size={12} /> };
        default: return null; // Supporter/Guest
    }
};

const UserAvatar = ({ url, name, size = "w-8 h-8", className = "" }: { url?: string, name?: string, size?: string, className?: string }) => {
    // Deterministic placeholder based on name char code
    const idx = name ? name.charCodeAt(0) % PLACEHOLDERS.length : 0;
    const src = url || PLACEHOLDERS[idx];

    return (
        <div className={`relative ${size} rounded-full overflow-hidden border border-slate-200 bg-slate-50 ${className}`}>
            <Image
                src={src}
                alt={name || "User"}
                fill
                className="object-cover"
                sizes="32px"
            />
        </div>
    );
};

export default function ThreadPage() {
    const params = useParams();
    const router = useRouter();
    const threadId = params.threadId as string;

    const [thread, setThread] = useState<DiscussionThread | null>(null);
    const [posts, setPosts] = useState<DiscussionPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Interactions State
    const [isFollowed, setIsFollowed] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    // AI Summary
    const [summary, setSummary] = useState<string | null>(null);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [canGenerateSummary, setCanGenerateSummary] = useState(false);

    // Reply Form
    const [replyContent, setReplyContent] = useState("");
    const [isAnon] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isReplyBoxOpen, setIsReplyBoxOpen] = useState(false);

    // Channel Config
    const [channelConfig, setChannelConfig] = useState<{ allow_anonymous_posts: boolean } | null>(null);

    // Flagging
    const [flagPostId, setFlagPostId] = useState<string | null>(null);
    const [flagReason, setFlagReason] = useState<string>("other");
    const [flagDescription, setFlagDescription] = useState("");
    const [isFlagging, setIsFlagging] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        try {
            // 1. Fetch Thread & Channel
            const threadRes = await fetch(`/api/discussions/threads?id=${threadId}`);
            if (!threadRes.ok) throw new Error("Thread not found");
            const threadData = await threadRes.json();
            setThread(threadData.thread);
            if (threadData.thread?.summary) {
                setSummary(threadData.thread.summary);
            }
            if (threadData.thread?.channel) {
                setChannelConfig({ allow_anonymous_posts: threadData.thread.channel.allow_anonymous_posts });
            }

            // 2. Fetch Posts
            const postsRes = await fetch(`/api/discussions/posts?thread_id=${threadId}`);
            const postsData = await postsRes.json();
            setPosts(postsData.posts || []);

            // 3. Check Interactions (Follow/Save/Hide) - client side check for current user (Skipped for MVP/Perf)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [threadId]);

    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        supabase.auth.getUser().then(async ({ data }) => {
            if (data.user) {
                setIsAuthenticated(true);
                setCurrentUserId(data.user.id);

                // Check Role for Admin privileges
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', data.user.id)
                    .single();

                // Simple role check based on manual hierarchy since importing types functions might be tricky if not pure
                // 'admin_party' or 'yantrik'
                if (profile && (profile.role === 'admin_party' || profile.role === 'yantrik')) {
                    setCanGenerateSummary(true);
                }
            }
        });
        fetchData();
    }, [fetchData]);

    // -- Actions --

    const handleVote = async (postId: string, voteType: number) => {
        if (!isAuthenticated) return alert("Please sign in to vote!");

        // Optimistic
        setPosts(prev => prev.map(p => {
            if (p.id !== postId) return p;
            const oldVote = p.user_vote || 0;
            let uv = p.upvotes;
            let dv = p.downvotes;

            if (oldVote === 1) uv--;
            if (oldVote === -1) dv--;

            let newVote = voteType;
            if (oldVote === voteType) newVote = 0; // Toggle off
            else {
                if (voteType === 1) uv++;
                if (voteType === -1) dv++;
            }
            return { ...p, upvotes: uv, downvotes: dv, user_vote: newVote };
        }));

        try { await votePost(postId, voteType); }
        catch (e) { console.error(e); fetchData(); }
    };

    const handleReaction = async (postId: string, emoji: string) => {
        if (!isAuthenticated) return alert("Please sign in to react!");

        // Optimistic (simple toggle visual feedback would require complex state, for now we rely on alert/refetch or just accept it)
        try {
            const res = await toggleReaction(postId, emoji);
            if (res.success) {
                // alert(`Reaction ${res.status}`); // Too noisy
                // Refetch or update local state if we had reaction counts
            }
        } catch (e) { console.error(e); }
    };

    const handleThreadAction = async (action: 'follow' | 'save' | 'hide') => {
        if (!isAuthenticated) return alert("Sign in required");
        try {
            const res = await toggleThreadInteraction(threadId, action);
            if (res.success) {
                if (action === 'follow') setIsFollowed(res.status);
                if (action === 'save') setIsSaved(res.status);
                if (action === 'hide') {
                    setIsHidden(res.status);
                    if (res.status) router.push('/commune');
                }
            }
        } catch (e) { console.error(e); alert("Action failed"); }
    };

    const handleGenerateSummary = async () => {
        if (!thread || posts.length === 0) return;
        setLoadingSummary(true);
        try {
            const content = posts.slice(0, 5).map(p => p.content).join("\n\n");
            const res = await fetch("/api/ai/summarize", {
                method: "POST",
                body: JSON.stringify({ title: thread.title, content })
            });
            const data = await res.json();
            if (data.summary) setSummary(data.summary);
        } catch (e) { console.error(e); }
        finally { setLoadingSummary(false); }
    };

    // Attachment State (Reply)
    const [replyAttachments, setReplyAttachments] = useState<{ file: File, meta: any }[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        setIsUploading(true);
        try {
            const newAttachments: { file: File, meta: any }[] = [];
            for (const file of files) {
                const res = await fetch("/api/discussions/attachments/sign-url", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ filename: file.name, fileType: file.type, sizeBytes: file.size })
                });
                if (!res.ok) throw new Error(await res.text());
                const { uploadUrl, storagePath } = await res.json();
                await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
                newAttachments.push({
                    file,
                    meta: { storagePath, fileName: file.name, mimeType: file.type, sizeBytes: file.size, type: file.type.startsWith("image/") ? "image" : (file.type === "application/pdf" ? "pdf" : "file") }
                });
            }
            setReplyAttachments(prev => [...prev, ...newAttachments]);
        } catch (err: any) { alert("Upload failed: " + err.message); }
        finally { setIsUploading(false); }
    };

    const removeAttachment = (idx: number) => {
        setReplyAttachments(prev => prev.filter((_, i) => i !== idx));
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/discussions/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    threadId,
                    content: replyContent,
                    isAnon,
                    attachments: replyAttachments.map(a => a.meta)
                })
            });
            if (!res.ok) throw new Error("Failed to post");
            setReplyContent("");
            setReplyAttachments([]);
            fetchData();
        } catch (e: any) { alert(e.message); }
        finally { setIsSubmitting(false); }
    };

    const handleFlag = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!flagPostId) return;
        setIsFlagging(true);
        try {
            await flagContent(flagPostId, 'post', flagReason);
            alert("Report submitted.");
            setFlagPostId(null);
            setFlagDescription("");
            fetchData();
        } catch (e: any) { alert(e.message); }
        finally { setIsFlagging(false); }
    };

    if (loading) return <div className="p-20 text-center">Loading discussion...</div>;
    if (error || !thread) return <div className="p-20 text-center text-red-500">Error: {error || "Thread not found"}</div>;

    const canReply = isAuthenticated || channelConfig?.allow_anonymous_posts;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                    <Link href="/commune" className="text-sm text-slate-500 hover:text-brand-blue flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back
                    </Link>

                    {/* Top Actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleThreadAction('follow')}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors flex items-center gap-2 ${isFollowed ? "bg-brand-blue text-white border-brand-blue" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            {isFollowed ? "Following" : "Follow"}
                        </button>
                        <button
                            onClick={() => handleThreadAction('save')}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors flex items-center gap-2 ${isSaved ? "bg-yellow-50 text-yellow-600 border-yellow-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            <svg className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                            {isSaved ? "Saved" : "Save"}
                        </button>

                    </div>
                </div>

                <h1 className="text-3xl font-bold text-slate-800 mb-2">{thread.title}</h1>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-semibold uppercase">{thread.channel?.name}</span>
                    <span>• Posted by {thread.is_anonymous ? "Anonymous" : (
                        <Link href={`/members/${thread.is_anonymous ? "" : (thread.created_by || "")}`} className="hover:text-brand-blue hover:underline inline-flex items-center gap-1.5 align-middle group">
                            {/* @ts-ignore */}
                            <UserAvatar url={thread.author?.avatar_url || undefined} name={thread.author?.full_name} size="w-5 h-5" />
                            <span className="font-bold">{thread.author?.full_name || "Member"}</span>
                            {(() => {
                                const badge = getRoleBadge(thread.author?.role);
                                return badge && (
                                    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badge.color}`}>
                                        {badge.icon}
                                        {thread.author?.role?.replace('_', ' ')}
                                    </span>
                                );
                            })()}
                        </Link>
                    )}</span>
                    <span>• {new Date(thread.created_at).toLocaleString()}</span>
                </div>
            </div>

            {/* AI Summary */}
            {(summary || canGenerateSummary) && (
                <div className="mb-8">
                    {!summary ? (
                        <button
                            onClick={handleGenerateSummary}
                            disabled={loadingSummary}
                            className="w-full bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border border-purple-100 text-purple-700 px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                        >
                            {loadingSummary ? (
                                <span className="animate-pulse">✨ Generating Summary...</span>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    ✨ Generate AI Summary (Admin Only)
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl p-5 relative">
                            <h3 className="text-purple-800 font-bold mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                AI Summary
                            </h3>
                            <p className="text-slate-700 text-sm leading-relaxed">{summary}</p>
                            {/* Allow clearing locally only if admin? Nah, keep it simple for now, maybe hide 'clear' button or make it just local close */}
                            {/* <button onClick={() => setSummary(null)} className="absolute top-2 right-2 text-slate-400 hover:text-purple-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button> */}
                        </div>
                    )}
                </div>
            )}

            {/* Posts List */}
            <div className="space-y-6 mb-12">
                {posts.length === 0 ? (
                    <div className="text-center p-12 bg-slate-50 rounded-xl">No posts yet.</div>
                ) : (
                    posts.map((post) => {
                        const isMe = currentUserId === post.author_id;
                        if (post.buried_at) { // Buried
                            return <div key={post.id} className="p-4 bg-slate-50 text-slate-400 italic text-center rounded border">Buried Content</div>;
                        }

                        return (
                            <div key={post.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                <div className={`flex flex-col items-center pt-2 gap-1 ${isMe ? 'hidden' : ''}`}>
                                    {/* Vote Side (Reddit style) */}
                                    <button onClick={() => handleVote(post.id, 1)} className={`p-1 rounded hover:bg-slate-100 ${post.user_vote === 1 ? 'text-orange-600' : 'text-slate-400'}`}>
                                        <svg className="w-6 h-6" fill={post.user_vote === 1 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                                    </button>
                                    <span className={`text-sm font-bold ${(post.upvotes - post.downvotes) > 0 ? "text-orange-600" :
                                        (post.upvotes - post.downvotes) < 0 ? "text-blue-600" : "text-slate-600"
                                        }`}>
                                        {post.upvotes - post.downvotes}
                                    </span>
                                    <button onClick={() => handleVote(post.id, -1)} className={`p-1 rounded hover:bg-slate-100 ${post.user_vote === -1 ? 'text-blue-600' : 'text-slate-400'}`}>
                                        <svg className="w-6 h-6" fill={post.user_vote === -1 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                </div>

                                <div className={`flex-1 rounded-xl border p-4 shadow-sm relative group ${isMe ? 'bg-blue-50 border-blue-100' : 'bg-white border-slate-200'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center gap-2">
                                            {post.is_anon ? (
                                                <div className="flex items-center gap-2">
                                                    <UserAvatar size="w-6 h-6" />
                                                    <span className="font-bold text-sm text-slate-700">Anonymous</span>
                                                </div>
                                            ) : (
                                                <Link href={`/members/${post.author_id}`} className="flex items-center gap-2 hover:bg-slate-50 p-1 -ml-1 rounded transition-colors group">
                                                    {/* @ts-ignore */}
                                                    <UserAvatar url={post.author?.avatar_url || undefined} name={post.author?.full_name} size="w-8 h-8" />
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-sm text-slate-800 group-hover:text-brand-blue transition-colors">
                                                                {post.author?.full_name || "Member"}
                                                            </span>
                                                            {(() => {
                                                                const badge = getRoleBadge(post.author?.role);
                                                                return badge && (
                                                                    <span title={post.author?.role} className={`inline-flex items-center justify-center p-0.5 rounded-full border ${badge.color.split(' ')[0]} ${badge.color.split(' ')[2]}`}>
                                                                        {badge.icon}
                                                                    </span>
                                                                );
                                                            })()}
                                                        </div>
                                                        {(() => {
                                                            const badge = getRoleBadge(post.author?.role);
                                                            return badge ? <span className="text-[10px] text-slate-500 uppercase font-medium leading-none">{post.author?.role?.replace('_', ' ')}</span> : null;
                                                        })()}
                                                    </div>
                                                </Link>
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-400 ml-auto">• {new Date(post.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-slate-800 whitespace-pre-wrap">{post.content}</p>

                                    {/* Attachments */}
                                    {post.attachments && post.attachments.length > 0 && (
                                        <div className="mt-4 grid gap-2 grid-cols-2 sm:grid-cols-3 max-w-2xl">
                                            {post.attachments.map((att: any) => (
                                                att.type === 'image' ? (
                                                    <div key={att.id} className="relative group">
                                                        <img
                                                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/commune-uploads/${att.storage_path}`}
                                                            alt={att.file_name}
                                                            className="rounded-lg border border-slate-200 object-cover w-full h-48 cursor-pointer hover:opacity-95 transition-opacity bg-slate-100"
                                                            onClick={() => window.open(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/commune-uploads/${att.storage_path}`, '_blank')}
                                                        />
                                                    </div>
                                                ) : (
                                                    <a
                                                        key={att.id}
                                                        href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/commune-uploads/${att.storage_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3 hover:bg-slate-100 transition-colors col-span-2 sm:col-span-1"
                                                    >
                                                        <div className="p-2 bg-white rounded border border-slate-100">
                                                            <FileText size={20} className="text-blue-500" />
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <div className="truncate text-sm font-medium text-slate-700">{att.file_name}</div>
                                                            <div className="text-xs text-slate-400 uppercase">{att.type}</div>
                                                        </div>
                                                    </a>
                                                )
                                            ))}
                                        </div>
                                    )}

                                    {/* Footer Actions */}
                                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100">
                                        <div className="flex-grow"></div>
                                        {/* Flag/Options */}
                                        <button onClick={() => setFlagPostId(post.id)} className="text-slate-400 hover:text-red-500 transition-colors" title="Report">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-8a2 2 0 01-2-2V5a2 2 0 012-2h6.24c.48 0 .93.2 1.25.56l.82 1.1h5.69c1.1 0 2 .9 2 2v9c0 1.1-.9 2-2 2h-7.76l-.82-1.1A2.02 2.02 0 008 16H3zM3 21h1" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {/* Reply Area (Collapsible) */}
            <div className="sticky bottom-6 z-10 w-full max-w-4xl mx-auto px-4">
                <AnimatePresence mode="wait">
                    {!isReplyBoxOpen ? (
                        <motion.button
                            key="open-btn"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            onClick={() => setIsReplyBoxOpen(true)}
                            className="w-full bg-white shadow-lg border border-slate-200 rounded-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                        >
                            <span className="text-slate-500 font-medium group-hover:text-brand-blue flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                {isAuthenticated ? "Write a reply..." : "Join the discussion..."}
                            </span>
                            <span className="bg-brand-blue/10 text-brand-blue p-2 rounded-full">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            </span>
                        </motion.button>
                    ) : (
                        <motion.div
                            key="reply-form"
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.95 }}
                            className="bg-white p-4 rounded-xl shadow-2xl border border-slate-200"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-slate-700">Reply to thread</h3>
                                <button onClick={() => setIsReplyBoxOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            {!isAuthenticated && !channelConfig?.allow_anonymous_posts ? (
                                <div className="text-center p-6 space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-lg font-medium text-brand-navy">चर्चामा सहभागी हुन पहिले लगइन गर्नुहोस्।</p>
                                        <p className="text-sm text-slate-500">Please sign in to join the discussion.</p>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            const supabase = createBrowserClient(
                                                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                                                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                                            );
                                            await supabase.auth.signInWithOAuth({
                                                provider: 'google',
                                                options: {
                                                    redirectTo: `${window.location.origin}/auth/callback`,
                                                },
                                            });
                                        }}
                                        className="bg-brand-red text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-shadow shadow-md flex items-center justify-center gap-2 mx-auto w-full max-w-xs"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Sign in with Google
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={(e) => { handleReply(e); setIsReplyBoxOpen(false); /* Close on submit? Maybe keep open? User said vice versa. Let's keep open if failed, close if success. Actually handleReply resets content. let's auto close on success inside handleReply or here. */ }}>
                                    {!isAuthenticated && (
                                        <div className="mb-2 flex items-center gap-2 text-xs text-brand-blue bg-blue-50 p-2 rounded w-fit">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                            Posting as Guest (Anonymous)
                                        </div>
                                    )}
                                    <textarea
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        onKeyDown={(e) => {
                                            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                                                e.preventDefault();
                                                handleReply(e);
                                                setIsReplyBoxOpen(false);
                                            }
                                        }}
                                        autoFocus
                                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-blue/20 focus:outline-none resize-none h-32 mb-3 text-slate-800 text-base"
                                        placeholder={!isAuthenticated ? "Share your anonymous thoughts..." : "Write your thoughts..."}
                                        required
                                    />
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-400">
                                            {replyContent.length} chars
                                            <span className="hidden sm:inline"> • Ctrl+Enter to post</span>
                                        </span>

                                        <button
                                            type="submit"
                                            className="bg-brand-blue text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isSubmitting || !replyContent.trim()}
                                        >
                                            {isSubmitting ? "Posting..." : "Post Reply"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modal Logic for Flag */}
            {flagPostId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95">
                        <h3 className="text-xl font-bold mb-4 text-brand-red">Report Post</h3>
                        <form onSubmit={handleFlag}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Reason</label>
                                <select
                                    className="w-full border rounded-lg p-2 text-slate-900 bg-white"
                                    value={flagReason}
                                    onChange={(e) => setFlagReason(e.target.value)}
                                >
                                    <option value="vulgar">Vulgar / Offensive Language</option>
                                    <option value="hate">Hate Speech</option>
                                    <option value="spam">Spam / Promotion</option>
                                    <option value="no_logic">No Logic / Trolling</option>
                                    <option value="off_topic">Off Topic</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            {flagReason === 'other' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Details (Optional)</label>
                                    <textarea
                                        className="w-full border rounded-lg p-2 resize-none h-20 text-slate-900 bg-white"
                                        value={flagDescription}
                                        onChange={(e) => setFlagDescription(e.target.value)}
                                        placeholder="Please explain why..."
                                    />
                                </div>
                            )}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFlagPostId(null)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                    disabled={isFlagging}
                                >
                                    {isFlagging ? "Reporting..." : "Submit Report"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
