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
import { X, Shield, User, Crown, Paperclip, FileText, Image as ImageIcon, Loader2, MessageSquare, Heart, Bookmark, EyeOff, Flag, ArrowLeft, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import MentionAutocomplete from "@/components/ui/MentionAutocomplete";
import { Skeleton } from "@/components/ui/skeleton";
import PostActions from "@/components/PostActions";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { RichTextWithVideos } from "@/components/ui/VideoEmbed";
import { getRoleLabel, getRoleBadgeVariant } from "@/lib/roleDisplay";

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

                if (profile && (profile.role === 'admin_party' || profile.role === 'yantrik')) {
                    setCanGenerateSummary(true);
                }
            }
        });
        fetchData();
    }, [fetchData]);

    const handleVote = async (postId: string, voteType: number) => {
        if (!isAuthenticated) return alert("Please sign in to vote!");

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

                        {/* Delete Thread - Only for creator or admin */}
                        {(currentUserId === thread.created_by || ['admin', 'yantrik', 'admin_party'].includes(thread.author?.role || '')) && (
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
                    </div>
                </div>

                <div className="space-y-4">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600">{thread.channel?.name}</Badge>
                    <Typography variant="h1" className="text-3xl md:text-4xl leading-tight text-brand-navy">{thread.title}</Typography>

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
                    posts.map((post) => {
                        const isMe = currentUserId === post.author_id;
                        if (post.buried_at) {
                            return <div key={post.id} className="p-4 bg-slate-50 text-slate-400 italic text-center rounded border text-sm">{t("डाउनभोट्सका कारण सामग्री गाडिएको छ।", "Content buried due to downvotes.")}</div>;
                        }

                        return (
                            <div key={post.id} className={cn("flex gap-3 md:gap-4", isMe && "flex-row-reverse")}>
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
                        );
                    })
                )}
                <div ref={bottomRef} className="h-4" />
            </div>

            {/* Reply Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pointer-events-none z-20">
                <div className="container max-w-4xl mx-auto pointer-events-auto">
                    <AnimatePresence mode="wait">
                        {!isReplyBoxOpen ? (
                            <motion.div
                                initial={{ y: 100 }}
                                animate={{ y: 0 }}
                                exit={{ y: 100 }}
                            >
                                <Button
                                    size="lg"
                                    className="w-full shadow-xl rounded-full h-14 bg-white hover:bg-slate-50 text-slate-500 justify-between border border-slate-200 px-6 group"
                                    onClick={() => setIsReplyBoxOpen(true)}
                                >
                                    <span className="flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-slate-400 group-hover:text-brand-blue" />
                                        {isAuthenticated ? t("जवाफ लेख्नुहोस्...", "Write a reply...") : t("छलफलमा सामेल हुनुहोस्...", "Join the discussion...")}
                                    </span>
                                    <span className="bg-brand-blue text-white rounded-full p-1"><ArrowUp size={16} /></span>
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                                className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden mb-4"
                            >
                                <div className="flex justify-between items-center px-4 py-3 bg-slate-50 border-b border-slate-100">
                                    <Typography variant="h4" className="text-sm font-bold text-slate-700">{t("थ्रेडमा जवाफ दिनुहोस्", "Reply to Thread")}</Typography>
                                    <Button variant="ghost" size="sm" onClick={() => setIsReplyBoxOpen(false)} className="h-8 w-8 p-0"><X size={16} /></Button>
                                </div>

                                <div className="p-4">
                                    {!isAuthenticated && !channelConfig?.allow_anonymous_posts ? (
                                        <div className="text-center py-6">
                                            <Typography variant="p" className="mb-4">{t("कृपया सहभागी हुन लग इन गर्नुहोस्।", "Please log in to participate.")}</Typography>
                                            <Button onClick={async () => {
                                                const supabase = createBrowserClient(
                                                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                                                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                                                );
                                                await supabase.auth.signInWithOAuth({
                                                    provider: 'google',
                                                    options: { redirectTo: `${window.location.origin}/auth/callback` },
                                                });
                                            }} className="bg-brand-blue text-white">{t("Google मार्फत साइन इन", "Sign In with Google")}</Button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleReply}>
                                            <MentionAutocomplete
                                                minRows={3}
                                                maxRows={10}
                                                placeholder={!isAuthenticated ? t("आफ्नो बेनामी विचारहरू साझा गर्नुहोस्...", "Share your anonymous thoughts...") : t("यहाँ आफ्नो जवाफ टाइप गर्नुहोस्... (@ ले सदस्य उल्लेख गर्न)", "Type your reply here... (@ to mention members)")}
                                                className="w-full text-base bg-transparent focus:outline-none resize-none mb-2 border-0 focus:ring-0"
                                                value={replyContent}
                                                onChange={setReplyContent}
                                                onKeyDown={(e) => {
                                                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                                                        e.preventDefault();
                                                        // @ts-ignore
                                                        handleReply(e);
                                                    }
                                                }}
                                            />

                                            {replyAttachments.length > 0 && (
                                                <div className="flex gap-2 mb-3 flex-wrap">
                                                    {replyAttachments.map((att, i) => (
                                                        <div key={i} className="flex items-center gap-2 bg-slate-100 rounded px-2 py-1 text-xs">
                                                            <span className="truncate max-w-[100px]">{att.meta.fileName}</span>
                                                            <button type="button" onClick={() => removeAttachment(i)}><X size={12} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                                <div className="flex gap-2">
                                                    <label className={cn("cursor-pointer p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-brand-blue transition-colors", isUploading && "opacity-50 pointer-events-none")}>
                                                        <input type="file" multiple className="hidden" onChange={handleFileSelect} />
                                                        {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Paperclip size={20} />}
                                                    </label>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs text-muted-foreground hidden sm:inline">{t("Ctrl + Enter पठाउन", "Ctrl + Enter to send")}</span>
                                                    <Button type="submit" disabled={isSubmitting || !replyContent.trim()} className="bg-brand-blue hover:bg-blue-600 text-white">
                                                        {isSubmitting ? t("पठाउँदैछ...", "Sending...") : t("जवाफ पोस्ट", "Post Reply")}
                                                    </Button>
                                                </div>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Flag Modal */}
            {flagPostId && (
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
            )}
        </div>
    );
}
