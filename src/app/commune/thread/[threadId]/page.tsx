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
import { X, Shield, User, Crown, Paperclip, FileText, Image as ImageIcon, Loader2, MessageSquare, Heart, Bookmark, EyeOff, Flag, ArrowLeft, ArrowUp, ArrowDown, Trash2, Edit2, ArrowRightLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PostActions from "@/components/PostActions";
import RichTextEditor from "@/components/RichTextEditor";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { RichTextWithVideos } from "@/components/ui/VideoEmbed";
import { getRoleLabel, getRoleBadgeVariant } from "@/lib/roleDisplay";
import PollDisplay from "@/components/PollDisplay";
import MoveThreadModal from "../MoveThreadModal";

// Helpers
const PLACEHOLDERS = [
    "/placeholders/eye-red.svg",
    "/placeholders/eye-blue.svg",
];

// Role badge variant is now imported from @/lib/roleDisplay

const UserAvatar = ({ url, name, size = "w-10 h-10", className = "" }: { url?: string, name?: string, size?: string, className?: string }) => {
    const idx = name ? name.charCodeAt(0) % PLACEHOLDERS.length : 0;
    const src = url || PLACEHOLDERS[idx];

    return (
        <div className={cn(`relative rounded-full overflow-hidden border border-slate-200 bg-slate-50 shrink-0`, size, className)}>
            <Image
                src={src}
                alt={name || "User"}
                fill
                className="object-cover"
                sizes="40px"
            />
        </div>
    );
};

export default function ThreadPage() {
    const params = useParams();
    const router = useRouter();
    const threadId = params.threadId as string;
    const { t, language } = useLanguage();

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

    // Title Editing
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editTitleValue, setEditTitleValue] = useState("");
    const [isSavingTitle, setIsSavingTitle] = useState(false);

    // Move Thread Modal
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    const handleSaveTitleSave = async () => {
        if (!editTitleValue.trim() || !thread) return;
        setIsSavingTitle(true);
        try {
            const res = await fetch(`/api/discussions/threads?id=${thread.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editTitleValue })
            });

            if (!res.ok) throw new Error((await res.json()).error || "Failed to update");

            setThread(prev => prev ? { ...prev, title: editTitleValue } : null);
            setIsEditingTitle(false);
        } catch (e: any) {
            alert(e.message);
        } finally {
            setIsSavingTitle(false);
        }
    };

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
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', data.user.id)
                    .single();

                if (profile) {
                    setUserRole(profile.role);
                    if (profile.role === 'admin_party' || profile.role === 'yantrik' || profile.role === 'admin') {
                        setCanGenerateSummary(true);
                    }
                }
            }
        });
        fetchData();
    }, [fetchData]);

    // Roles that can vote (party_member and above)
    const canVote = userRole && ['party_member', 'volunteer', 'team_member', 'central_committee', 'board', 'admin_party', 'yantrik', 'admin'].includes(userRole);

    const handleVote = async (postId: string, voteType: number) => {
        if (!isAuthenticated) {
            router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
            return;
        }
        if (!canVote) {
            alert(t("मतदान गर्न पार्टी सदस्य हुनुपर्छ।", "You must be a party member to vote."));
            return;
        }

        setPosts(prev => prev.map(p => {
            if (p.id !== postId) return p;
            const oldVote = p.user_vote || 0;
            let uv = p.upvotes;
            let dv = p.downvotes;

            if (oldVote === 1) uv--;
            if (oldVote === -1) dv--;

            let newVote = voteType;
            if (oldVote === voteType) newVote = 0;
            else {
                if (voteType === 1) uv++;
                if (voteType === -1) dv++;
            }
            return { ...p, upvotes: uv, downvotes: dv, user_vote: newVote };
        }));

        try { await votePost(postId, voteType); }
        catch (e) { console.error(e); fetchData(); }
    };

    const handleThreadAction = async (action: 'follow' | 'save' | 'hide') => {
        if (!isAuthenticated) {
            router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
            return;
        }
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
            setIsReplyBoxOpen(false); // Close on success
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

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="space-y-6">
                    {[1, 2].map(i => (
                        <Card key={i}><CardContent className="p-6">
                            <div className="flex gap-4">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-20 w-full" />
                                </div>
                            </div>
                        </CardContent></Card>
                    ))}
                </div>
            </div>
        );
    }
    if (error || !thread) return <div className="p-20 text-center text-destructive">Error: {error || "Thread not found"}</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[80vh]">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
                    <Link href={`/commune/${thread.channel?.slug || thread.channel?.id}`} passHref>
                        <Button variant="ghost" size="sm" className="pl-0 text-muted-foreground hover:text-brand-blue -ml-2">
                            <ArrowLeft className="mr-2 h-4 w-4" />{t("फर्कनुहोस्", "Back to")} {thread.channel?.name}
                        </Button>
                    </Link>

                    {/* Thread Actions */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleThreadAction('follow')}
                            className={cn("gap-2", isFollowed && "bg-brand-blue/10 text-brand-blue border-brand-blue")}
                        >
                            {isFollowed ? <Heart className="fill-current" size={16} /> : <Heart size={16} />}
                            {isFollowed ? t("फलो गरिएको", "Following") : t("फलो", "Follow")}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleThreadAction('save')}
                            className={cn("gap-2", isSaved && "bg-yellow-50 text-yellow-600 border-yellow-200")}
                        >
                            {isSaved ? <Bookmark className="fill-current" size={16} /> : <Bookmark size={16} />}
                            {isSaved ? t("सुरक्षित", "Saved") : t("सुरक्षित गर्नुहोस्", "Save")}
                        </Button>

                        {/* Delete Thread - Only for creator or moderators */}
                        {isAuthenticated && ((currentUserId && thread.created_by && currentUserId === thread.created_by) || (userRole && ['admin', 'yantrik', 'admin_party'].includes(userRole))) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                    if (!confirm(t("के तपाईं यो थ्रेड मेटाउन निश्चित हुनुहुन्छ? यो कार्य पूर्ववत गर्न सकिँदैन।", "Are you sure you want to delete this thread? This action cannot be undone."))) return;
                                    try {
                                        const res = await fetch(`/api/discussions/threads?id=${threadId}`, { method: 'DELETE' });
                                        if (!res.ok) throw new Error((await res.json()).error);
                                        router.push(`/commune/${thread.channel?.slug || thread.channel?.id}`);
                                    } catch (e: any) {
                                        alert(t("मेटाउन असफल:", "Delete failed:") + " " + e.message);
                                    }
                                }}
                                className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                            >
                                <Trash2 size={16} />
                                {t("मेटाउनुहोस्", "Delete")}
                            </Button>
                        )}

                        {/* Move Thread - Only for moderators */}
                        {userRole && ['admin', 'yantrik', 'admin_party', 'board', 'central_committee'].includes(userRole) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsMoveModalOpen(true)}
                                className="gap-2 text-purple-600 border-purple-200 hover:bg-purple-50"
                            >
                                <ArrowRightLeft size={16} />
                                {t("सार्नुहोस्", "Move")}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600">{thread.channel?.name}</Badge>

                        {/* Moved indicator */}
                        {(thread as any).moved_from_channel_id && (
                            <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50 text-xs">
                                <ArrowRightLeft size={10} className="mr-1" />
                                {t("अर्को च्यानलबाट सारियो", "Moved from another channel")}
                            </Badge>
                        )}
                    </div>

                    {/* Header Image from First Post */}
                    {posts.length > 0 && posts[0].attachments && posts[0].attachments.some(a => a.type === 'image') && (
                        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-6 border border-slate-200">
                            <img
                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/commune-uploads/${posts[0].attachments.find(a => a.type === 'image')?.storage_path}`}
                                alt="Thread Header"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {isEditingTitle ? (
                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                value={editTitleValue}
                                onChange={(e) => setEditTitleValue(e.target.value)}
                                className="text-3xl md:text-4xl font-bold text-brand-navy border-b-2 border-brand-blue focus:outline-none bg-transparent w-full"
                                autoFocus
                            />
                            <div className="flex gap-2 mt-1">
                                <Button size="sm" onClick={handleSaveTitleSave} disabled={isSavingTitle} className="bg-brand-blue text-white">
                                    {isSavingTitle ? <Loader2 className="w-4 h-4 animate-spin" /> : t("सेभ गर्नुहोस्", "Save")}
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => { setIsEditingTitle(false); setEditTitleValue(thread.title); }}>
                                    {t("रद्द", "Cancel")}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="group flex items-start justify-between gap-4">
                            <Typography variant="h1" className="text-3xl md:text-4xl leading-tight text-brand-navy">{thread.title}</Typography>
                            {/* Edit Title Button */}
                            {(currentUserId === thread.created_by || ['admin', 'yantrik', 'admin_party'].includes(thread.author?.role || '')) && (
                                <button
                                    onClick={() => { setIsEditingTitle(true); setEditTitleValue(thread.title); }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-brand-blue"
                                    title={t("शीर्षक सम्पादन", "Edit Title")}
                                >
                                    <Edit2 size={18} />
                                </button>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-3 py-2 border-b border-sky-100/50">
                        <span className="text-sm text-muted-foreground">{t("मूल छलफल सुरु गर्ने", "Original discussion started by")}</span>
                        {thread.is_anonymous ? (
                            <div className="flex items-center gap-2">
                                <UserAvatar size="w-6 h-6" />
                                <Typography variant="small" className="font-bold text-slate-700">{t("बेनामी", "Anonymous")}</Typography>
                            </div>
                        ) : (
                            <Link href={`/members/${thread.created_by}`} className="flex items-center gap-2 group">
                                {/* @ts-ignore */}
                                <UserAvatar url={thread.author?.avatar_url} name={thread.author?.full_name} size="w-6 h-6" />
                                <Typography variant="small" className="font-bold text-slate-700 group-hover:text-brand-blue transition-colors">
                                    {thread.author?.full_name || t("सदस्य", "Member")}
                                </Typography>
                                <Badge variant={getRoleBadgeVariant(thread.author?.role) as any} className="text-[10px] py-0 h-5 px-1.5 pointer-events-none">
                                    {getRoleLabel(thread.author?.role, language)}
                                </Badge>
                            </Link>
                        )}
                        <span className="text-sm text-muted-foreground">• {new Date(thread.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* AI Summary */}
            {(summary || canGenerateSummary) && (
                <div className="mb-10">
                    {!summary ? (
                        canGenerateSummary && (
                            <Button
                                variant="outline"
                                onClick={handleGenerateSummary}
                                disabled={loadingSummary}
                                className="w-full h-auto py-4 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border-dashed border-purple-200 text-purple-700 gap-2"
                            >
                                {loadingSummary ? <Loader2 className="animate-spin" /> : "✨"} {t("AI सारांश उत्पादन (एडमिन)", "Generate AI Summary (Admin)")}
                            </Button>
                        )
                    ) : (
                        <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-6 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                <span className="text-6xl">✨</span>
                            </div>
                            <Typography variant="h4" className="text-purple-900 mb-3 flex items-center gap-2 text-base">
                                <span>✨</span>{t("AI छलफल सारांश", "AI Discussion Summary")}
                            </Typography>
                            <Typography variant="p" className="text-slate-700 text-sm leading-relaxed">{summary}</Typography>
                        </div>
                    )}
                </div>
            )}

            {/* Posts Feed */}
            <div className="space-y-6 mb-24">
                {posts.length === 0 ? (
                    <div className="text-center p-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <Typography variant="muted">{t("अहिलेसम्म कुनै पोस्ट छैन। जवाफ दिने पहिलो हुनुहोस्!", "No posts yet. Be the first to reply!")}</Typography>
                    </div>
                ) : (
                    posts.map((post, index) => {
                        const isMe = currentUserId === post.author_id;
                        if (post.buried_at) {
                            return <div key={post.id} className="p-4 bg-slate-50 text-slate-400 italic text-center rounded border text-sm">{t("डाउनभोट्सका कारण सामग्री गाडिएको छ।", "Content buried due to downvotes.")}</div>;
                        }

                        return (
                            <React.Fragment key={post.id}>
                                <div className={cn("flex gap-3 md:gap-4", isMe && "flex-row-reverse", index > 0 && "mt-8 pl-0 md:pl-0 border-t border-slate-100/50 pt-8")}>
                                    {/* Vote Column */}
                                    <div className={cn("flex flex-col items-center pt-1 gap-0.5 min-w-[32px]", isMe && "hidden")}>
                                        <Button variant="ghost" size="icon" className={cn("h-8 w-8 hover:bg-orange-50 hover:text-orange-600 rounded-full", post.user_vote === 1 && "text-orange-600 bg-orange-50")} onClick={() => handleVote(post.id, 1)}>
                                            <ArrowUp size={18} />
                                        </Button>
                                        <span className={cn("text-xs font-bold", (post.upvotes - post.downvotes) > 0 ? "text-orange-600" : (post.upvotes - post.downvotes) < 0 ? "text-brand-blue" : "text-slate-500")}>
                                            {post.upvotes - post.downvotes}
                                        </span>
                                        <Button variant="ghost" size="icon" className={cn("h-8 w-8 hover:bg-blue-50 hover:text-brand-blue rounded-full", post.user_vote === -1 && "text-brand-blue bg-blue-50")} onClick={() => handleVote(post.id, -1)}>
                                            <ArrowDown size={18} />
                                        </Button>
                                    </div>

                                    <Card className={cn(
                                        "flex-1 transition-shadow hover:shadow-md border-transparent shadow-sm",
                                        isMe ? "bg-blue-50/50 border-blue-100" : "bg-white border-slate-200"
                                    )}>
                                        <CardContent className="p-4 md:p-5">
                                            {/* Post Header */}
                                            <div className="flex items-center gap-3 mb-3">
                                                {post.is_anon ? (
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <UserAvatar size="w-8 h-8" />
                                                        <div className="text-sm font-bold">{t("बेनामी", "Anonymous")}</div>
                                                    </div>
                                                ) : (
                                                    <Link href={`/members/${post.author_id}`} className="flex items-center gap-2 group">
                                                        {/* @ts-ignore */}
                                                        <UserAvatar url={post.author?.avatar_url} name={post.author?.full_name} size="w-8 h-8" />
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="text-sm font-bold text-slate-800 group-hover:text-brand-blue transition-colors">
                                                                    {post.author?.full_name || t("सदस्य", "Member")}
                                                                </div>
                                                                {post.author?.role && (
                                                                    <Badge variant={getRoleBadgeVariant(post.author?.role) as any} className="text-[10px] px-1.5 py-0 h-4 md:h-5">
                                                                        {getRoleLabel(post.author?.role, language)}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="text-[10px] text-slate-400 font-medium">
                                                                {/* @ts-ignore - district exists in DB but not in Profile type */}
                                                                {post.author?.district ? `${post.author.district}, Nepal` : t('सदस्य', 'Member')}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                )}
                                                <div className="ml-auto text-xs text-slate-400">{new Date(post.created_at).toLocaleDateString()}</div>
                                            </div>

                                            {/* Content - with video embeds */}
                                            <div className="text-slate-800 leading-relaxed whitespace-pre-wrap text-[15px] mb-4">
                                                <RichTextWithVideos content={post.content} />
                                            </div>

                                            {/* Poll Display */}
                                            {post.poll && (
                                                <PollDisplay poll={post.poll} onVote={() => fetchData()} />
                                            )}

                                            {/* Attachments */}
                                            {post.attachments && post.attachments.length > 0 && (
                                                <div className="mt-4 grid gap-2 grid-cols-2 sm:grid-cols-3 max-w-xl">
                                                    {post.attachments.map((att: any) => (
                                                        att.type === 'image' ? (
                                                            <div key={att.id} className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200 cursor-zoom-in hover:opacity-90 transition-opacity" onClick={() => window.open(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/commune-uploads/${att.storage_path}`, '_blank')}>
                                                                <img
                                                                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/commune-uploads/${att.storage_path}`}
                                                                    alt={att.file_name}
                                                                    className="object-cover w-full h-full"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <a
                                                                key={att.id}
                                                                href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/commune-uploads/${att.storage_path}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg hover:border-brand-blue/50 group transition-all"
                                                            >
                                                                <div className="p-1.5 bg-blue-50 text-brand-blue rounded">
                                                                    <FileText size={16} />
                                                                </div>
                                                                <div className="overflow-hidden">
                                                                    <div className="truncate text-xs font-semibold text-slate-700 group-hover:text-brand-blue">{att.file_name}</div>
                                                                    <div className="text-[10px] text-slate-400 uppercase">{att.type}</div>
                                                                </div>
                                                            </a>
                                                        )
                                                    ))}
                                                </div>
                                            )}

                                            {/* Footer Actions */}
                                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100/50">
                                                {isMe ? (
                                                    <PostActions
                                                        postId={post.id}
                                                        postContent={post.content}
                                                        isAuthor={isMe}
                                                        onDelete={() => setPosts(prev => prev.filter(p => p.id !== post.id))}
                                                        onUpdate={(c) => setPosts(prev => prev.map(p => p.id === post.id ? { ...p, content: c } : p))}
                                                    />
                                                ) : (
                                                    <div /> // Spacer
                                                )}

                                                <Button variant="ghost" size="sm" className="h-6 w-6 text-slate-300 hover:text-destructive p-0" onClick={() => setFlagPostId(post.id)}>
                                                    <Flag size={14} />
                                                </Button>
                                            </div>

                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Reply Section - Embedded after first post */}
                                {index === 0 && (
                                    <div className="my-10 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl p-6 md:p-8 border border-slate-200/60 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                                        <h3 className="text-xl font-bold text-brand-navy mb-6 flex items-center gap-2">
                                            <MessageSquare className="text-brand-blue" />
                                            {t("छलफलमा भाग लिनुहोस्", "Join the discussion")}
                                        </h3>

                                        {!isAuthenticated && !channelConfig?.allow_anonymous_posts ? (
                                            <div className="text-center py-8 bg-white/50 rounded-xl border border-dashed border-slate-200">
                                                <Typography variant="p" className="mb-6 text-lg text-slate-600">{t("कृपया सहभागी हुन लग इन गर्नुहोस्।", "Please log in to participate.")}</Typography>
                                                <Button onClick={async () => {
                                                    const supabase = createBrowserClient(
                                                        process.env.NEXT_PUBLIC_SUPABASE_URL!,
                                                        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                                                    );
                                                    await supabase.auth.signInWithOAuth({
                                                        provider: 'google',
                                                        options: { redirectTo: `${window.location.origin}/auth/callback` },
                                                    });
                                                }} size="lg" className="bg-brand-blue text-white h-12 px-8 text-lg hover:bg-brand-navy shadow-lg shadow-blue-200">{t("Google मार्फत साइन इन", "Sign In with Google")}</Button>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleReply} className="relative z-10">
                                                <div className="mb-4 bg-white rounded-xl border border-slate-200 overflow-hidden focus-within:ring-4 focus-within:ring-brand-blue/10 focus-within:border-brand-blue/30 transition-all shadow-sm">
                                                    <RichTextEditor
                                                        onChange={setReplyContent}
                                                        placeholder={!isAuthenticated ? t("आफ्नो बेनामी विचारहरू साझा गर्नुहोस्...", "Share your anonymous thoughts...") : t("यहाँ आफ्नो विचार लेख्नुहोस्... (@ ले सदस्य उल्लेख गर्न)", "Write your thoughts here...")}
                                                        minHeight="200px"
                                                    />
                                                </div>

                                                {replyAttachments.length > 0 && (
                                                    <div className="flex gap-2 mb-4 flex-wrap">
                                                        {replyAttachments.map((att, i) => (
                                                            <div key={i} className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm shadow-sm">
                                                                <Paperclip size={14} className="text-slate-400" />
                                                                <span className="truncate max-w-[150px] font-medium text-slate-700">{att.meta.fileName}</span>
                                                                <button type="button" onClick={() => removeAttachment(i)} className="text-slate-400 hover:text-red-500 ml-1"><X size={14} /></button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center pt-2">
                                                    <div className="flex gap-2">
                                                        <label className={cn("cursor-pointer p-3 hover:bg-white rounded-xl text-slate-500 hover:text-brand-blue transition-all border border-transparent hover:border-slate-200 hover:shadow-sm", isUploading && "opacity-50 pointer-events-none")}>
                                                            <input type="file" multiple className="hidden" onChange={handleFileSelect} />
                                                            {isUploading ? <Loader2 size={24} className="animate-spin" /> : <div className="flex items-center gap-2"><Paperclip size={24} /><span className="text-sm font-medium hidden sm:inline">{t("फाइल थप्नुहोस्", "Add File")}</span></div>}
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        {isAnon && <Badge variant="outline" className="text-slate-500 border-slate-300 h-8 px-3">{t("बेनामी", "Anonymous Mode")}</Badge>}
                                                        <Button type="submit" disabled={isSubmitting || !replyContent.trim()} size="lg" className="bg-brand-blue hover:bg-blue-600 text-white h-12 px-8 text-lg shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all rounded-xl">
                                                            {isSubmitting ? <><Loader2 className="mr-2 animate-spin" /> {t("पठाउँदैछ...", "Sending...")}</> : <>{t("प्रतिक्रिया दिनुहोस्", "Post Comment")}</>}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })
                )}
                <div ref={bottomRef} className="h-4" />
            </div>

            {/* Flag Modal */}
            {
                flagPostId && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <Card className="w-full max-w-sm">
                            <CardHeader>
                                <CardTitle>{t("पोस्ट रिपोर्ट", "Report Post")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleFlag} className="space-y-4">
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={flagReason}
                                        onChange={e => setFlagReason(e.target.value)}
                                    >
                                        <option value="spam">{t("स्प्याम", "Spam")}</option>
                                        <option value="inappropriate">{t("अनुचित", "Inappropriate")}</option>
                                        <option value="other">{t("अन्य", "Other")}</option>
                                    </select>
                                    <div className="flex justify-end gap-2">
                                        <Button type="button" variant="ghost" onClick={() => setFlagPostId(null)}>{t("रद्द गर्नुहोस्", "Cancel")}</Button>
                                        <Button type="submit" variant="destructive">{t("रिपोर्ट", "Report")}</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )
            }

            {/* Move Thread Modal */}
            {thread && thread.channel && (
                <MoveThreadModal
                    isOpen={isMoveModalOpen}
                    onClose={() => setIsMoveModalOpen(false)}
                    onSuccess={(newChannelId, newChannelName) => {
                        // Navigate to the thread in the new channel
                        router.push(`/commune/${newChannelId}`);
                    }}
                    threadId={threadId}
                    threadTitle={thread.title}
                    currentChannelId={thread.channel.id}
                    currentChannelName={thread.channel.name}
                />
            )}
        </div>
    );
}
