/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DiscussionThread, DiscussionChannel } from "@/types";
import { createBrowserClient } from "@supabase/ssr";
import { flagContent, votePost } from "@/app/commune/actions";
import TextareaAutosize from 'react-textarea-autosize';
import { Paperclip, X, FileText, Image as ImageIcon, Loader2, ArrowLeft, MessageSquare, ThumbsUp, ThumbsDown, Flag, Users, Edit2, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import ChannelMembersModal from "../ChannelMembersModal";
import ChannelHeaderEditModal from "../ChannelHeaderEditModal";
import { canManageChannels } from "@/lib/permissions";

export default function ChannelPage() {
    const params = useParams();
    const channelId = params.channelId as string;
    const { t, language } = useLanguage();

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
    const [userRole, setUserRole] = useState<string>('guest');

    // Members modal
    const [showMembersModal, setShowMembersModal] = useState(false);

    // Header edit modal
    const [showHeaderEditModal, setShowHeaderEditModal] = useState(false);

    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        supabase.auth.getUser().then(async ({ data }) => {
            setIsAuthenticated(!!data.user);
            if (data.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', data.user.id)
                    .single();
                setUserRole(profile?.role || 'guest');
            }
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
            const newAttachments: { file: File, meta: any }[] = [];
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

    // -- Voting Logic --
    const handleVote = async (threadId: string, postId: string, voteType: number) => {
        if (!isAuthenticated) return alert("Please sign in to vote!");

        // Optimistic Update
        setThreads(prev => prev.map(t => {
            if (t.id !== threadId) return t;

            // Logic similar to ThreadPage but operating on Thread object stats
            const oldVote = t.user_vote || 0;
            let uv = t.upvotes || 0;
            let dv = t.downvotes || 0;

            if (oldVote === 1) uv--;
            if (oldVote === -1) dv--;

            let newVote = voteType;
            if (oldVote === voteType) newVote = 0; // Toggle off
            else {
                if (voteType === 1) uv++;
                if (voteType === -1) dv++;
            }
            return { ...t, upvotes: uv, downvotes: dv, user_vote: newVote };
        }));

        try {
            await votePost(postId, voteType);
        } catch (e) {
            console.error(e);
            alert("Failed to vote. Please try again.");
            fetchData(); // Rollback/Refresh
        }
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
        // Use isFlagging here to suppress unused var warning or just let it exist.
        // Or better, wrap the alert in isFlagging check if needed, but simple use is fine.
        if (!flagThreadId || isFlagging) return;

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

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="mb-6 space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <ThreadCardSkeleton key={i} />)}
                </div>
            </div>
        );
    }
    if (error || !channel) return <div className="p-10 text-center text-destructive font-medium">Error: {error || "Channel Not Found"}</div>;

    const canCreateThread = isAuthenticated || channel.min_role_to_create_threads === 'anonymous_visitor';
    const canManageMembers = canManageChannels(userRole);

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl min-h-[80vh]">
            {/* Header */}
            <div className="mb-8">
                <Link href="/commune" passHref>
                    <Button variant="link" className="pl-0 mb-2 text-muted-foreground hover:text-brand-blue">
                        <ArrowLeft className="mr-2 h-4 w-4" />{t("च्यानलहरूमा फर्कनुहोस्", "Back to Channels")}
                    </Button>
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <Typography variant="h1" className="text-3xl text-brand-navy mb-1">{language === 'ne' && channel.name_ne ? channel.name_ne : channel.name}</Typography>
                        {channel.name_ne && <Typography variant="h3" className="text-xl font-nepali text-muted-foreground">{channel.name_ne}</Typography>}
                        <Typography variant="p" className="text-slate-600 mt-2 max-w-3xl">{language === 'ne' && channel.description_ne ? channel.description_ne : (channel.description_en || channel.description)}</Typography>
                    </div>
                    {canCreateThread && !showForm && (
                        <Button
                            onClick={() => setShowForm(true)}
                            className="bg-brand-red hover:bg-brand-red/90 text-white"
                        >
                            {t("नयाँ थ्रेड", "New Thread")}
                        </Button>
                    )}
                    {canManageMembers && (channel as any).access_type === 'private' && (
                        <Button
                            variant="outline"
                            onClick={() => setShowMembersModal(true)}
                            className="border-brand-blue text-brand-blue hover:bg-brand-blue/5"
                        >
                            <Users className="mr-2 h-4 w-4" />
                            {t("सदस्यहरू व्यवस्थापन", "Manage Members")}
                        </Button>
                    )}
                </div>

                {/* Guidelines Box */}
                {(channel.guidelines_en || channel.guidelines_ne) && (
                    <div className="mt-6 p-4 bg-brand-blue/5 border border-brand-blue/10 rounded-lg text-sm text-slate-700">
                        <strong className="block text-brand-blue mb-1">{t("दिशानिर्देश", "Guidelines")}:</strong>
                        <p>{language === 'ne' && channel.guidelines_ne ? channel.guidelines_ne : channel.guidelines_en}</p>
                        {language === 'en' && channel.guidelines_ne && <p className="font-nepali text-slate-600 mt-1">{channel.guidelines_ne}</p>}
                    </div>
                )}

                {/* Channel Header Section (for geographic/department channels) */}
                {(channel.header_image_url || channel.political_intro || (channel.impact_stats && Object.keys(channel.impact_stats).length > 0)) && (
                    <div className="mt-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                        {/* Banner Image */}
                        {channel.header_image_url && (
                            <div className="relative h-48 md:h-64">
                                <img
                                    src={channel.header_image_url}
                                    alt={channel.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            </div>
                        )}

                        <div className="p-5">
                            {/* Political Intro */}
                            {channel.political_intro && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-brand-navy mb-2">
                                        {t("राजनीतिक परिचय", "Political Introduction")}
                                    </h3>
                                    <div className="prose prose-sm max-w-none text-slate-600">
                                        {channel.political_intro.split('\n').map((line, i) => (
                                            <p key={i} className="mb-2">{line}</p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Impact Stats Cards */}
                            {channel.impact_stats && Object.keys(channel.impact_stats).length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {Object.entries(channel.impact_stats).map(([key, value]) => (
                                        <div key={key} className="bg-slate-50 rounded-lg p-3 text-center">
                                            <div className="text-xs text-slate-500 uppercase tracking-wide">{key}</div>
                                            <div className="text-lg font-bold text-brand-navy">{String(value)}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Edit/Delete Buttons for channel header */}
                {channel.location_type && (
                    <div className="mt-4 flex gap-2">
                        {/* Edit: admin, incharge, or moderator */}
                        {(canManageChannels(userRole)) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowHeaderEditModal(true)}
                                className="text-slate-600 border-slate-300 hover:bg-slate-50"
                            >
                                <Edit2 className="w-4 h-4 mr-1" />
                                {t("हेडर सम्पादन", "Edit Header")}
                            </Button>
                        )}
                        {/* Delete: party_admin only */}
                        {['admin', 'yantrik'].includes(userRole) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                    if (!confirm(t("के तपाईं यो च्यानल मेटाउन चाहनुहुन्छ?", "Are you sure you want to delete this channel?"))) return;
                                    try {
                                        const res = await fetch(`/api/discussions/channels?id=${channel.id}`, { method: 'DELETE' });
                                        if (!res.ok) throw new Error('Failed to delete');
                                        window.location.href = '/commune';
                                    } catch {
                                        alert('Failed to delete channel');
                                    }
                                }}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4 mr-1" />
                                {t("च्यानल मेटाउनुहोस्", "Delete Channel")}
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Create Thread Form */}
            {showForm && (
                <Card className="mb-8 animate-in slide-in-from-top-2 border-brand-blue/20 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg text-brand-navy">{t("नयाँ थ्रेड सिर्जना", "Create New Thread")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!isAuthenticated && channel.min_role_to_create_threads !== 'anonymous_visitor' && (
                            <div className="text-destructive text-sm mb-4">{t("यहाँ थ्रेड सिर्जना गर्न तपाईंले लग इन हुनुपर्छ।", "You must be logged in to create a thread here.")}</div>
                        )}
                        <form onSubmit={handleCreateThread} className="space-y-4">
                            {/* Title Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t("शीर्षक", "Title")} <span className="text-muted-foreground font-normal">({t("अधिकतम १४० अक्षर", "Max 140 chars")})</span></label>
                                <input
                                    type="text"
                                    value={newTitle}
                                    maxLength={140}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-lg font-semibold"
                                    placeholder={channel.allow_anonymous_posts ? t("छलफलको विषय...", "Topic of discussion...") : t("तपाईंको मनमा के छ?", "What's on your mind?")}
                                    required
                                />
                            </div>

                            {/* Body Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t("सामग्री", "Content")} <span className="text-muted-foreground font-normal">({t("मार्कडाउन समर्थित", "Markdown supported")})</span></label>
                                <TextareaAutosize
                                    minRows={5}
                                    value={newBody}
                                    onChange={(e) => setNewBody(e.target.value)}
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                    placeholder={t("आफ्ना विस्तृत विचार, तर्क वा प्रश्नहरू साझा गर्नुहोस्...", "Share your detailed thoughts, arguments, or questions...")}
                                    required
                                />

                                {/* Attachment List */}
                                {attachments.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {attachments.map((att, i) => (
                                            <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm">
                                                {att.meta.type === 'image' ? <ImageIcon size={14} className="text-brand-blue" /> : <FileText size={14} className="text-orange-500" />}
                                                <span className="truncate max-w-[150px]">{att.meta.fileName}</span>
                                                <button type="button" onClick={() => removeAttachment(i)} className="text-slate-400 hover:text-destructive"><X size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Toolbar */}
                                <div className="mt-2 flex items-center">
                                    <label className={`flex items-center gap-2 px-3 py-1.5 rounded hover:bg-slate-100 cursor-pointer text-slate-600 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <input type="file" multiple className="hidden" onChange={handleFileSelect} />
                                        {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Paperclip size={16} />}
                                        <span className="text-sm font-medium">{t("फाइलहरू संलग्न", "Attach files")}</span>
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
                                            {t("पोस्ट गर्नुहोस्", "Post as")} <span className={`font-medium ${isNewThreadAnon ? 'text-brand-blue' : 'text-slate-900'}`}>{isNewThreadAnon ? t("बेनामी", "Anonymous") : (isAuthenticated ? t("म आफैं", "Myself") : t("अतिथि", "Guest"))}</span>
                                        </span>
                                    </label>
                                ) : (
                                    <div></div> // Spacer
                                )}

                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setShowForm(false)}
                                    >
                                        {t("रद्द गर्नुहोस्", "Cancel")}
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-brand-blue hover:bg-brand-blue/90 text-white"
                                        disabled={isCreating || isUploading}
                                    >
                                        {isCreating ? t("प्रकाशित गर्दै...", "Publishing...") : t("थ्रेड प्रकाशित", "Publish Thread")}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-200 mb-8">
                <button
                    onClick={() => setActiveTab('discussions')}
                    className={cn(
                        "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'discussions' ? "border-brand-blue text-brand-blue" : "border-transparent text-muted-foreground hover:text-slate-800"
                    )}
                >
                    {t("छलफलहरू", "Discussions")}
                </button>
                <button
                    onClick={() => setActiveTab('resources')}
                    className={cn(
                        "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'resources' ? "border-brand-blue text-brand-blue" : "border-transparent text-muted-foreground hover:text-slate-800"
                    )}
                >
                    {t("स्रोत र कागजातहरू", "Resources & Docs")}
                </button>
                <button
                    onClick={() => setActiveTab('impact')}
                    className={cn(
                        "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'impact' ? "border-brand-blue text-brand-blue" : "border-transparent text-muted-foreground hover:text-slate-800"
                    )}
                >
                    {t("प्रभाव र तथ्याङ्क", "Impact & Stats")}
                </button>
            </div>

            {/* TAB CONTENT */}
            {activeTab === 'discussions' && (
                <div className="space-y-4">
                    {threads.length === 0 ? (
                        <Card className="text-center p-12 bg-slate-50/50 border-dashed">
                            <CardContent>
                                <Typography variant="muted">{t("अहिलेसम्म कुनै थ्रेड छैन। कुराकानी सुरु गर्ने पहिलो हुनुहोस्!", "No threads yet. Be the first to start a conversation!")}</Typography>
                            </CardContent>
                        </Card>
                    ) : (
                        threads.map(thread => (
                            <Link key={thread.id} href={`/commune/thread/${thread.id}`} className="block group">
                                <Card className="hover:shadow-md transition-all hover:border-brand-blue/30 relative overflow-hidden group-hover:-translate-y-0.5 duration-200">
                                    <CardContent className="p-5">
                                        {thread.buried_at && (
                                            <Badge variant="destructive" className="absolute top-0 right-0 rounded-none rounded-bl-md px-2 py-0.5 text-[10px]">Buried</Badge>
                                        )}
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <Typography variant="h4" className="text-lg font-bold text-brand-navy mb-1 group-hover:text-brand-blue transition-colors">
                                                    {thread.title}
                                                </Typography>
                                                {thread.first_post_content && (
                                                    <Typography variant="p" className="text-slate-600 text-sm line-clamp-2 mb-2 leading-relaxed">
                                                        {thread.first_post_content}
                                                    </Typography>
                                                )}
                                                <div className="flex items-center text-xs text-muted-foreground gap-3 mt-3">
                                                    <span>{new Date(thread.created_at!).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    {thread.is_anonymous ? <span className="italic">{t("बेनामी", "Anonymous")}</span> : <span className="font-medium text-slate-700">{t("सदस्य", "Member")}</span>}
                                                </div>
                                            </div>

                                            {/* Stats (Votes/Comments) */}
                                            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 text-slate-500 text-sm ml-2">
                                                <div className="flex items-center gap-1 bg-slate-50 rounded-lg border border-slate-200 p-0.5" onClick={(e) => e.preventDefault()}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(e) => { e.preventDefault(); handleVote(thread.id, thread.first_post_id!, 1); }}
                                                        className={cn("h-7 w-7 rounded", thread.user_vote === 1 ? 'text-orange-600 bg-orange-50' : 'text-slate-400')}
                                                        title="Upvote"
                                                    >
                                                        <ThumbsUp size={14} className={thread.user_vote === 1 ? "fill-current" : ""} />
                                                    </Button>
                                                    <span className={cn(
                                                        "text-xs font-bold min-w-[1.5em] text-center",
                                                        (thread.upvotes || 0) - (thread.downvotes || 0) > 0 ? "text-orange-600" :
                                                            (thread.upvotes || 0) - (thread.downvotes || 0) < 0 ? "text-brand-blue" : "text-slate-600"
                                                    )}>
                                                        {(thread.upvotes || 0) - (thread.downvotes || 0)}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(e) => { e.preventDefault(); handleVote(thread.id, thread.first_post_id!, -1); }}
                                                        className={cn("h-7 w-7 rounded", thread.user_vote === -1 ? 'text-brand-blue bg-blue-50' : 'text-slate-400')}
                                                        title="Downvote"
                                                    >
                                                        <ThumbsDown size={14} className={thread.user_vote === -1 ? "fill-current" : ""} />
                                                    </Button>
                                                </div>
                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-md border border-slate-100" title="Comments">
                                                    <MessageSquare size={14} className="text-slate-400" />
                                                    <span className="font-medium text-slate-700">{(thread.total_posts || 1) - 1}</span>
                                                </div>
                                                {/* Flag Button (Prevent Link Click) */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => { e.preventDefault(); setFlagThreadId(thread.id); }}
                                                    className="h-8 w-8 text-slate-300 hover:text-destructive transition-colors hidden group-hover:flex"
                                                    title="Report Thread"
                                                >
                                                    <Flag size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'resources' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                    {/* Read Me / Guidelines */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="w-5 h-5 text-brand-blue" />
                                {t("मुख्य कागजातहरू र ReadMe", "Key Documents & ReadMe")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {channel.readme_content ? (
                                <div className="prose prose-sm text-slate-600 whitespace-pre-wrap max-w-none">
                                    {channel.readme_content}
                                </div>
                            ) : (
                                <Typography variant="muted" className="italic">{t("अहिलेसम्म कुनै दिशानिर्देश वा readme सामग्री थपिएको छैन।", "No specific guidelines or readme content added yet.")}</Typography>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Documents & Links Column */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-2">
                                <WrapperLinkIcon />
                                {t("कागजातहरू र लिङ्कहरू", "Documents & Links")}
                            </h3>

                            {/* Legacy Doc Link */}
                            {channel.docs_url && (
                                <a href={channel.docs_url} target="_blank" rel="noopener noreferrer" className="block">
                                    <Card className="hover:shadow-md transition-all group border-blue-100 bg-blue-50/50">
                                        <CardContent className="p-4 flex items-center gap-3">
                                            <div className="bg-blue-100 p-2 rounded-full text-brand-blue">
                                                <FileText size={18} />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-brand-blue">{t("मुख्य ड्राइभ फोल्डर (Legacy)", "Main Drive Folder (Legacy)")}</div>
                                                <div className="text-xs text-slate-500">{t("बाह्य लिङ्क", "External Link")}</div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </a>
                            )}

                            {/* Dynamic Resources (docs, links) */}
                            {channel.resources?.filter(r => ['doc', 'link'].includes(r.type)).map(res => (
                                <a key={res.id} href={res.url} target="_blank" rel="noopener noreferrer" className="block">
                                    <Card className="hover:shadow-sm hover:border-brand-blue/50 transition-all">
                                        <CardContent className="p-4">
                                            <div className="font-semibold text-slate-800 flex items-center gap-2">
                                                {res.type === 'doc' ? '📄' : '🔗'} {res.title}
                                            </div>
                                            {res.description && <div className="text-xs text-muted-foreground mt-1">{res.description}</div>}
                                        </CardContent>
                                    </Card>
                                </a>
                            ))}

                            {(!channel.docs_url && (!channel.resources || !channel.resources.some(r => ['doc', 'link'].includes(r.type)))) && (
                                <Typography variant="muted" className="italic text-sm">{t("कुनै कागजातहरू फेला परेनन्।", "No documents found.")}</Typography>
                            )}
                        </div>

                        {/* Videos Column */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-2">
                                <WrapperVideoIcon />
                                {t("विशेष भिडियोहरू", "Featured Videos")}
                            </h3>

                            {/* Legacy Video Link */}
                            {channel.video_playlist_url && (
                                <a href={channel.video_playlist_url} target="_blank" rel="noopener noreferrer" className="block">
                                    <Card className="hover:shadow-md transition-all group border-red-100 bg-red-50/50">
                                        <CardContent className="p-4 flex items-center gap-3">
                                            <div className="bg-red-100 p-2 rounded-full text-red-600">
                                                <WrapperVideoIcon size={18} />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-red-700">{t("आधिकारिक प्लेलिस्ट (Legacy)", "Official Playlist (Legacy)")}</div>
                                                <div className="text-xs text-red-500">{t("YouTube प्लेलिस्ट", "YouTube Playlist")}</div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </a>
                            )}

                            {/* Dynamic Resources (video) */}
                            {channel.resources?.filter(r => r.type === 'video').map(res => (
                                <a key={res.id} href={res.url} target="_blank" rel="noopener noreferrer" className="block">
                                    <Card className="hover:shadow-sm hover:border-red-300 transition-all">
                                        <CardContent className="p-4">
                                            <div className="font-semibold text-slate-800 flex items-center gap-2">
                                                📺 {res.title}
                                            </div>
                                            {res.description && <div className="text-xs text-muted-foreground mt-1">{res.description}</div>}
                                        </CardContent>
                                    </Card>
                                </a>
                            ))}

                            {(!channel.video_playlist_url && (!channel.resources || !channel.resources.some(r => r.type === 'video'))) && (
                                <Typography variant="muted" className="italic text-sm">{t("कुनै भिडियोहरू फेला परेनन्।", "No videos found.")}</Typography>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Flag Modal */}
            {flagThreadId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle>{t("थ्रेड रिपोर्ट", "Report Thread")}</CardTitle>
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
                                    <Button type="button" variant="ghost" onClick={() => setFlagThreadId(null)}>{t("रद्द गर्नुहोस्", "Cancel")}</Button>
                                    <Button type="submit" variant="destructive">{t("रिपोर्ट", "Report")}</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Channel Members Modal */}
            <ChannelMembersModal
                isOpen={showMembersModal}
                onClose={() => setShowMembersModal(false)}
                channelId={channelId}
                channelName={channel?.name || ''}
            />

            {/* Channel Header Edit Modal */}
            {channel && (
                <ChannelHeaderEditModal
                    isOpen={showHeaderEditModal}
                    onClose={() => setShowHeaderEditModal(false)}
                    onSuccess={fetchData}
                    channel={channel}
                />
            )}
        </div>
    );
}

function ThreadCardSkeleton() {
    return (
        <Card className="mb-4">
            <CardContent className="p-5">
                <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex gap-4 mt-2">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                        <Skeleton className="h-8 w-16 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Icons wrappers
const WrapperLinkIcon = ({ size = 20 }: { size?: number }) => (
    <svg className={`w-[${size}px] h-[${size}px text-blue-500`} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);
const WrapperVideoIcon = ({ size = 20 }: { size?: number }) => (
    <svg className={`w-[${size}px] h-[${size}px text-red-600`} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
