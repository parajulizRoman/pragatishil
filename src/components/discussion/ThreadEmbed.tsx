/* eslint-disable */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { DiscussionPost, DiscussionThread } from "@/types";
import { createBrowserClient } from "@supabase/ssr";
import { flagContent, votePost, toggleThreadInteraction } from "@/app/commune/actions";
import Link from "next/link";
import { X, User, Paperclip, FileText, Loader2, MessageSquare, ArrowUp, ArrowDown, Flag } from "lucide-react";
import MentionAutocomplete from "@/components/ui/MentionAutocomplete";
import { Skeleton } from "@/components/ui/skeleton";
import PostActions from "@/components/PostActions";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { getRoleLabel, getRoleBadgeVariant } from "@/lib/roleDisplay";

// Reuse helpers
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

export default function ThreadEmbed({ threadId }: { threadId: string }) {
    const router = useRouter();

    const [posts, setPosts] = useState<DiscussionPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
    const [isFlagging, setIsFlagging] = useState(false);

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        try {
            // 1. Fetch Thread to get Channel Config (reuse existing API for simplicity)
            const threadRes = await fetch(`/api/discussions/threads?id=${threadId}`);
            if (threadRes.ok) {
                const threadData = await threadRes.json();
                if (threadData.thread?.channel) {
                    setChannelConfig({ allow_anonymous_posts: threadData.thread.channel.allow_anonymous_posts });
                }
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
            setIsReplyBoxOpen(false);
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
            fetchData();
        } catch (e: any) { alert(e.message); }
        finally { setIsFlagging(false); }
    };

    if (loading) {
        return (
            <div className="space-y-4 py-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-64" />
                <div className="space-y-4 pt-4">
                    {[1, 2].map(i => <Skeleton key={i} className="h-32 w-full rounded-lg" />)}
                </div>
            </div>
        );
    }

    if (error) return <div className="p-8 text-center text-destructive bg-red-50 rounded-lg">Unable to load comments: {error}</div>;

    return (
        <div className="py-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-blue" />
                Comments ({posts.length})
            </h3>

            {/* Posts Feed */}
            <div className="space-y-6 mb-12">
                {posts.length === 0 ? (
                    <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <Typography variant="muted">No comments yet. Be the first to share your thoughts!</Typography>
                    </div>
                ) : (
                    posts.map((post) => {
                        const isMe = currentUserId === post.author_id;
                        if (post.buried_at) {
                            return <div key={post.id} className="p-4 bg-slate-50 text-slate-400 italic text-center rounded border text-sm">Content hidden (low quality).</div>;
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
                                                    <div className="text-sm font-bold">Anonymous</div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push(`/members/${post.author_id}`)}>
                                                    {/* @ts-ignore */}
                                                    <UserAvatar url={post.author?.avatar_url} name={post.author?.full_name} size="w-8 h-8" />
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="text-sm font-bold text-slate-800 group-hover:text-brand-blue transition-colors">
                                                                {post.author?.full_name || "Member"}
                                                            </div>
                                                            {post.author?.role && (
                                                                <Badge variant={getRoleBadgeVariant(post.author?.role) as any} className="text-[10px] px-1.5 py-0 h-4 md:h-5">
                                                                    {getRoleLabel(post.author?.role, 'ne')}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="text-[10px] text-slate-400 font-medium">
                                                            {/* @ts-ignore */}
                                                            {post.author?.district ? `${post.author.district}, Nepal` : 'Member'}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="ml-auto text-xs text-slate-400">{new Date(post.created_at).toLocaleDateString()}</div>
                                        </div>

                                        {/* Content */}
                                        <div className="text-slate-800 leading-relaxed whitespace-pre-wrap text-[15px] mb-4">
                                            {post.content}
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
            </div>

            {/* Reply Bar - Simplified for Embed */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                {!isAuthenticated && !channelConfig?.allow_anonymous_posts ? (
                    <div className="text-center py-4">
                        <Typography variant="p" className="mb-3 text-sm">Please log in to join the discussion.</Typography>
                        <Link href="/login">
                            <Button className="bg-brand-blue text-white">Sign In</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex gap-4 items-start">
                        <div className="mt-1 hidden md:block">
                            <UserAvatar size="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                            <form onSubmit={handleReply}>
                                <MentionAutocomplete
                                    minRows={2}
                                    maxRows={6}
                                    placeholder={!isAuthenticated ? "Share your anonymous thoughts..." : "Join the discussion... (@ to mention)"}
                                    className="w-full text-base p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all resize-none mb-2 bg-white"
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
                                            <div key={i} className="flex items-center gap-2 bg-white rounded px-2 py-1 text-xs border border-slate-200">
                                                <span className="truncate max-w-[100px]">{att.meta.fileName}</span>
                                                <button type="button" onClick={() => removeAttachment(i)}><X size={12} /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <label className={cn("cursor-pointer p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-brand-blue transition-colors", isUploading && "opacity-50 pointer-events-none")}>
                                            <input type="file" multiple className="hidden" onChange={handleFileSelect} />
                                            {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Paperclip size={18} />}
                                        </label>
                                    </div>
                                    <Button type="submit" disabled={isSubmitting || !replyContent.trim()} className="bg-brand-blue hover:bg-blue-600 text-white">
                                        {isSubmitting ? "Posting..." : "Comment"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* Flag Modal */}
            {flagPostId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle>Report Comment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleFlag} className="space-y-4">
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={flagReason}
                                    onChange={e => setFlagReason(e.target.value)}
                                >
                                    <option value="spam">Spam</option>
                                    <option value="inappropriate">Inappropriate</option>
                                    <option value="other">Other</option>
                                </select>
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="ghost" onClick={() => setFlagPostId(null)}>Cancel</Button>
                                    <Button type="submit" variant="destructive">Report</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
