"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { createT, Lang } from "@/lib/translations";
import { NewsItem, NewsAttachment, NewsReference } from "@/types";
import { canManageNews } from "@/lib/permissions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, ExternalLink, FileText, Download, Languages, Share2, Facebook, Twitter, Linkedin, Copy, Check, ImageIcon, MessageCircle, Pencil, X, Loader2, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import ThreadEmbed from "@/components/discussion/ThreadEmbed";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

interface NewsArticleClientProps {
    item: NewsItem;
    userRole?: string | null;
    userId?: string | null;
}

export default function NewsArticleClient({ item, userRole, userId }: NewsArticleClientProps) {
    const { language, toggleLanguage } = useLanguage();
    const lang = language as Lang;
    const T = createT(lang);
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [blogStatus, setBlogStatus] = useState(item.status);

    // Check if user can review this blog
    const canReview = ["admin", "yantrik", "admin_party", "board"].includes(userRole || "") &&
        (blogStatus === "submitted" || blogStatus === "draft");
    const isAssignedReviewer = item.pending_reviewer_id === userId;

    // Compute language-aware content with fallbacks
    const title = (lang === "ne" && item.title_ne?.trim()) ? item.title_ne : item.title;
    const body = (lang === "ne" && item.body_ne?.trim()) ? item.body_ne : (item.body_en ?? "");

    // Parse attachments and references
    const attachments = (Array.isArray(item.attachments) ? item.attachments : []) as NewsAttachment[];
    const references = (Array.isArray(item.references) ? item.references : []) as NewsReference[];

    // Separate images and documents
    const imageAttachments = attachments.filter(att => {
        const url = typeof att === 'string' ? att : att.url;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    });
    const documentAttachments = attachments.filter(att => {
        const url = typeof att === 'string' ? att : att.url;
        return !/\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    });

    // Generate share URL
    const shareUrl = typeof window !== 'undefined'
        ? window.location.href
        : `https://pragatishil.org.np/blogs/${item.slug || item.id}`;
    const shareTitle = encodeURIComponent(title);

    const handleCopyLink = async () => {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleApprove = async () => {
        if (!confirm(lang === "ne" ? "यो ब्लग प्रकाशित गर्ने हो?" : `Publish "${item.title}"?`)) return;

        setActionLoading("approve");
        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const { error } = await supabase
                .from("news_items")
                .update({
                    status: "published",
                    published_at: new Date().toISOString(),
                    pending_reviewer_id: null
                })
                .eq("id", item.id);

            if (error) throw error;

            // Notify author
            if (item.author_id) {
                await supabase.from("notifications").insert({
                    user_id: item.author_id,
                    type: "blog_approved",
                    title: lang === "ne" ? "ब्लग प्रकाशित भयो!" : "Blog Published!",
                    body: lang === "ne"
                        ? `तपाईंको ब्लग "${item.title.slice(0, 30)}..." प्रकाशित भएको छ।`
                        : `Your blog "${item.title.slice(0, 30)}..." has been published.`,
                    link: `/blogs/${item.slug}`,
                    actor_id: userId
                });
            }

            setBlogStatus("published");
            alert(lang === "ne" ? "ब्लग प्रकाशित भयो!" : "Blog published!");
            router.refresh();
        } catch (error) {
            alert("Failed to approve: " + (error as Error).message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async () => {
        const reason = prompt(lang === "ne" ? "अस्वीकार गर्ने कारण:" : "Reason for rejection:");
        if (!reason) return;

        setActionLoading("reject");
        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const { error } = await supabase
                .from("news_items")
                .update({
                    status: "rejected",
                    pending_reviewer_id: null
                })
                .eq("id", item.id);

            if (error) throw error;

            // Notify author
            if (item.author_id) {
                await supabase.from("notifications").insert({
                    user_id: item.author_id,
                    type: "blog_rejected",
                    title: lang === "ne" ? "ब्लग अस्वीकृत" : "Blog Rejected",
                    body: `${lang === "ne" ? "कारण:" : "Reason:"} ${reason}`,
                    link: `/blogs/write?edit=${item.id}`,
                    actor_id: userId
                });
            }

            setBlogStatus("rejected");
            alert(lang === "ne" ? "ब्लग अस्वीकृत गरियो" : "Blog rejected");
            router.push("/admin/reviews");
        } catch (error) {
            alert("Failed to reject: " + (error as Error).message);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Review Action Bar for Admins */}
            {canReview && blogStatus === "submitted" && (
                <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 sticky top-0 z-50">
                    <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-amber-600" />
                            <span className="font-medium text-amber-800">
                                {lang === "ne" ? "समीक्षा पर्खिरहेको छ" : "Pending Review"}
                            </span>
                            {isAssignedReviewer && (
                                <Badge className="bg-amber-200 text-amber-800 border-amber-300">
                                    {lang === "ne" ? "तपाईंलाई तोकिएको" : "Assigned to you"}
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleApprove}
                                disabled={actionLoading !== null}
                                className="gap-1 bg-green-600 hover:bg-green-700"
                                size="sm"
                            >
                                {actionLoading === "approve" ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Check className="w-4 h-4" />
                                )}
                                {lang === "ne" ? "प्रकाशित गर्नुहोस्" : "Publish"}
                            </Button>
                            <Button
                                onClick={handleReject}
                                disabled={actionLoading !== null}
                                variant="destructive"
                                size="sm"
                                className="gap-1"
                            >
                                {actionLoading === "reject" ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <X className="w-4 h-4" />
                                )}
                                {lang === "ne" ? "अस्वीकार" : "Reject"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejected Status Bar */}
            {blogStatus === "rejected" && (
                <div className="bg-red-50 border-b border-red-200 px-4 py-3">
                    <div className="max-w-4xl mx-auto flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span className="font-medium text-red-800">
                            {lang === "ne" ? "यो ब्लग अस्वीकृत गरिएको छ" : "This blog has been rejected"}
                        </span>
                    </div>
                </div>
            )}

            {/* Draft Status Bar */}
            {blogStatus === "draft" && (
                <div className="bg-slate-100 border-b border-slate-200 px-4 py-3">
                    <div className="max-w-4xl mx-auto flex items-center gap-3">
                        <Clock className="w-5 h-5 text-slate-500" />
                        <span className="font-medium text-slate-700">
                            {lang === "ne" ? "ड्राफ्ट - अप्रकाशित" : "Draft - Not Published"}
                        </span>
                    </div>
                </div>
            )}

            {/* Header / Hero */}
            {/* Header / Hero */}
            <div className="bg-white border-b border-slate-100 pb-8 pt-24 md:pt-32 px-4 shadow-sm">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="flex justify-between items-center">
                        <Link href="/news" className="inline-flex items-center text-slate-500 hover:text-brand-blue transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" /> {T("news.backToNews")}
                        </Link>

                        {/* Language Toggle Button */}
                        <div className="flex gap-2">
                            {canManageNews(userRole) && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="gap-2 text-sm border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                                >
                                    <Link href={`/write?edit=${item.id}`}>
                                        <Pencil className="w-4 h-4" />
                                        {lang === "ne" ? "सम्पादन" : "Edit"}
                                    </Link>
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleLanguage}
                                className="gap-2 text-sm"
                            >
                                <Languages className="w-4 h-4" />
                                {lang === "en" ? "नेपालीमा हेर्नुहोस्" : "View in English"}
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                        {/* Content Type Badge */}
                        {item.content_type === 'official' ? (
                            <Badge className="bg-brand-red text-white border-transparent font-bold">
                                Official Statement
                            </Badge>
                        ) : (
                            <Badge className="bg-green-100 text-green-900 border-transparent font-semibold">
                                Personal Article
                            </Badge>
                        )}

                        <Badge variant="secondary" className="bg-blue-50 text-brand-blue hover:bg-blue-100">
                            {item.type}
                        </Badge>
                        <span className="text-slate-400 text-sm flex items-center gap-1">
                            <Calendar className="w-4 h-4" /> {item.date}
                            {item.date_bs && <span className="text-slate-500 ml-1">({item.date_bs})</span>}
                        </span>
                        {item.source && (
                            <span className="text-slate-500 text-sm border-l border-slate-200 pl-3 ml-1">
                                {T("news.source")}: <span className="font-semibold text-slate-700">{item.source}</span>
                            </span>
                        )}

                        {/* Author Link (for articles) */}
                        {item.content_type === 'article' && item.author_id && (
                            <Link
                                href={`/members/${item.author_id}`}
                                className="text-slate-500 text-sm border-l border-slate-200 pl-3 ml-1 hover:text-brand-blue transition-colors"
                            >
                                By: <span className="font-semibold text-slate-700 hover:text-brand-blue underline decoration-dotted underline-offset-2">
                                    {item.author_name || 'Member'}
                                </span>
                            </Link>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                        {title}
                    </h1>

                    {/* Featured Image - Adaptive to image proportions */}
                    {item.image_url && (
                        <div className="mt-8">
                            <div className="relative w-full bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl overflow-hidden shadow-xl border border-slate-200/50">
                                {/* Image container with max-height constraint */}
                                <div className="relative w-full max-h-[70vh] flex items-center justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={item.image_url}
                                        alt={title}
                                        className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
                                        style={{ display: 'block' }}
                                    />
                                </div>
                                {/* Image caption overlay */}
                                {item.summary_ne && (
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-4">
                                        <p className="text-white/90 text-sm font-medium text-center drop-shadow-lg line-clamp-2">
                                            {lang === "ne" ? item.summary_ne : item.summary_en}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-[1fr_300px] gap-12">
                <div className="space-y-12">
                    {/* Article Body - Only showing selected language */}
                    {body ? (
                        <article className={`prose prose-slate lg:prose-lg max-w-none ${lang === "ne" ? "font-nepali leading-loose" : ""}`}>
                            <div className="whitespace-pre-wrap">{body}</div>
                        </article>
                    ) : (
                        <p className="text-slate-500 italic">
                            {lang === "ne"
                                ? "यस लेखको नेपाली संस्करण उपलब्ध छैन।"
                                : "No content available for this article."}
                        </p>
                    )}

                    {/* Original Source Button */}
                    {item.link && (
                        <div className="flex justify-center py-6">
                            <Button variant="outline" size="lg" asChild className="gap-2 rounded-full h-12 px-8">
                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                    {T("news.readOriginal")} {item.source && `(${item.source})`} <ExternalLink className="w-4 h-4" />
                                </a>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Share Widget */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm sticky top-24">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Share2 className="w-5 h-5 text-brand-blue" />
                            {lang === "ne" ? "साझा गर्नुहोस्" : "Share Article"}
                        </h3>
                        <div className="grid grid-cols-5 gap-2">
                            {/* Facebook */}
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center p-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all hover:scale-105"
                                title="Share on Facebook"
                            >
                                <Facebook size={20} />
                            </a>
                            {/* Twitter/X */}
                            <a
                                href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center p-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all hover:scale-105"
                                title="Share on X/Twitter"
                            >
                                <Twitter size={20} />
                            </a>
                            {/* LinkedIn */}
                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center p-3 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-600 transition-all hover:scale-105"
                                title="Share on LinkedIn"
                            >
                                <Linkedin size={20} />
                            </a>
                            {/* WhatsApp */}
                            <a
                                href={`https://wa.me/?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center p-3 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-all hover:scale-105"
                                title="Share on WhatsApp"
                            >
                                <MessageCircle size={20} />
                            </a>
                            {/* Copy Link */}
                            <button
                                onClick={handleCopyLink}
                                className={`flex items-center justify-center p-3 rounded-lg transition-all hover:scale-105 ${copied
                                    ? "bg-green-100 text-green-600"
                                    : "bg-slate-50 hover:bg-slate-100 text-slate-500"
                                    }`}
                                title={copied ? "Copied!" : "Copy Link"}
                            >
                                {copied ? <Check size={20} /> : <Copy size={20} />}
                            </button>
                        </div>
                    </div>

                    {imageAttachments.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-brand-red" />
                                {lang === "ne" ? "तस्बिरहरू" : "Photos"} ({imageAttachments.length})
                            </h3>
                            <div className="space-y-3">
                                {imageAttachments.map((att, idx) => {
                                    const url = typeof att === 'string' ? att : att.url;
                                    const name = typeof att === 'string' ? `Photo ${idx + 1}` : (att.name || `Photo ${idx + 1}`);
                                    return (
                                        <a
                                            key={idx}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block group"
                                        >
                                            <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/50 shadow-sm hover:shadow-md transition-all">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={url}
                                                    alt={name}
                                                    className="w-full h-auto max-h-48 object-contain"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                    <ExternalLink className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 drop-shadow-lg transition-opacity" />
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1.5 text-center truncate">{name}</p>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Documents Widget */}
                    {documentAttachments.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-brand-blue" />
                                {lang === "ne" ? "कागजातहरू" : "Documents"} ({documentAttachments.length})
                            </h3>
                            <div className="space-y-2">
                                {documentAttachments.map((att, idx) => {
                                    const url = typeof att === 'string' ? att : att.url;
                                    const name = typeof att === 'string' ? `Document ${idx + 1}` : (att.name || 'Document');
                                    return (
                                        <a
                                            key={idx}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-brand-blue transition-colors group"
                                        >
                                            <div className="bg-white p-2 rounded shadow-sm group-hover:shadow text-brand-red shrink-0">
                                                <Download size={16} />
                                            </div>
                                            <div className="text-sm font-medium truncate flex-1">{name}</div>
                                            <ExternalLink size={14} className="text-slate-400 group-hover:text-brand-blue shrink-0" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* References Widget */}
                    {references.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <ExternalLink className="w-5 h-5 text-slate-400" />
                                {lang === "ne" ? "सन्दर्भहरू" : "References"}
                            </h3>
                            <ul className="space-y-2">
                                {references.map((ref: NewsReference, idx: number) => {
                                    const url = typeof ref === 'string' ? ref : ref.url;
                                    let label = url;
                                    try {
                                        label = (typeof ref !== 'string' && ref.label) ? ref.label : new URL(url).hostname;
                                    } catch {
                                        // Invalid URL, use as-is
                                    }
                                    return (
                                        <li key={idx}>
                                            <a
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-slate-500 hover:text-brand-blue hover:underline break-all"
                                            >
                                                {label}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </main>

            {/* Discussion Section */}
            {item.thread_id && (
                <div className="bg-white border-t border-slate-200 py-16">
                    <div className="max-w-4xl mx-auto px-4">
                        <ThreadEmbed threadId={item.thread_id} />
                    </div>
                </div>
            )}
        </div>
    );
}
