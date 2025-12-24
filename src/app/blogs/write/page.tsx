"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import { upsertNewsItem } from "@/actions/cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, Send, Clock, Upload, X, FileText, Image as ImageIcon, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { convertADtoBS } from "@/lib/dateConverter";
import Image from "next/image";
import { NewsAttachment } from "@/types";
import { cn } from "@/lib/utils";

const DRAFT_KEY = "pragatishil_article_draft";

type ContentType = 'article' | 'interview' | 'speech';

interface Draft {
    title: string;
    title_ne: string;
    body_en: string;
    body_ne: string;
    summary_en: string;
    image_url: string;
    visibility: string;
    savedAt: string;
}

export default function WritePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [userRole, setUserRole] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [contentType, setContentType] = useState<ContentType>('article');
    const [title, setTitle] = useState("");
    const [titleNe, setTitleNe] = useState("");
    const [bodyEn, setBodyEn] = useState("");
    const [bodyNe, setBodyNe] = useState("");
    const [summaryEn, setSummaryEn] = useState("");
    const [summaryNe, setSummaryNe] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [visibility, setVisibility] = useState("party");
    const [attachments, setAttachments] = useState<NewsAttachment[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingDoc, setUploadingDoc] = useState(false);
    const [aiCompleting, setAiCompleting] = useState(false);

    // Video/Interview specific fields
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [speakerName, setSpeakerName] = useState("");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [admins, setAdmins] = useState<any[]>([]);
    const [selectedAdmin, setSelectedAdmin] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [myArticles, setMyArticles] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Check auth and load draft
    useEffect(() => {
        const init = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login?redirect=/blogs/write");
                return;
            }

            setUser(user);

            // Get user's role
            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

            if (profile) {
                setUserRole(profile.role);

                // Check if user can write
                const canWrite = ["central_committee", "board", "admin_party", "yantrik", "admin", "party_member"].includes(profile.role);
                if (!canWrite) {
                    router.push("/blogs");
                    return;
                }
            }

            // Load admins for approval dropdown
            const { data: adminList } = await supabase
                .from("profiles")
                .select("id, full_name, role")
                .in("role", ["admin", "yantrik", "admin_party", "board"])
                .order("full_name");

            if (adminList) setAdmins(adminList);

            // Load ALL user's articles from database (draft, submitted, published)
            const { data: articles, error: articlesError } = await supabase
                .from("news_items")
                .select("id, title, title_ne, status, date, updated_at, pending_reviewer_id, content_type")
                .eq("author_id", user.id)
                .in("content_type", ["article"])  // Only articles, not official news
                .order("updated_at", { ascending: false })
                .limit(20);

            console.log("Articles query:", { articles, articlesError, userId: user.id });
            if (articles) setMyArticles(articles);

            // Load draft from localStorage
            const savedDraft = localStorage.getItem(DRAFT_KEY);
            if (savedDraft) {
                try {
                    const draft: Draft = JSON.parse(savedDraft);
                    setTitle(draft.title || "");
                    setTitleNe(draft.title_ne || "");
                    setBodyEn(draft.body_en || "");
                    setBodyNe(draft.body_ne || "");
                    setSummaryEn(draft.summary_en || "");
                    setImageUrl(draft.image_url || "");
                    setVisibility(draft.visibility || "party");
                    if (draft.savedAt) setLastSaved(new Date(draft.savedAt));
                } catch (e) {
                    console.error("Failed to load draft", e);
                }
            }

            // Check for ?edit=N URL param and load article for editing
            const editId = searchParams.get("edit");
            if (editId && !isNaN(Number(editId))) {
                const articleId = Number(editId);
                const { data: article } = await supabase
                    .from("news_items")
                    .select("*")
                    .eq("id", articleId)
                    .single();

                if (article) {
                    setEditingId(article.id);
                    setTitle(article.title || "");
                    setTitleNe(article.title_ne || "");
                    setBodyEn(article.body_en || "");
                    setBodyNe(article.body_ne || "");
                    setSummaryEn(article.summary_en || "");
                    setImageUrl(article.image_url || "");
                    setVisibility(article.visibility || "party");
                    setAttachments(article.attachments || []);
                    setContentType(article.type === 'Interview' ? 'interview' : article.type === 'Speech' ? 'speech' : 'article');
                    localStorage.removeItem(DRAFT_KEY); // Clear local draft when editing
                }
            }

            setLoading(false);
        };

        init();
    }, [router, searchParams]);

    // Load a draft for editing
    const loadDraft = async (draftId: number) => {
        const supabase = createClient();
        const { data } = await supabase
            .from("news_items")
            .select("*")
            .eq("id", draftId)
            .single();

        if (data) {
            setEditingId(data.id);
            setTitle(data.title || "");
            setTitleNe(data.title_ne || "");
            setBodyEn(data.body_en || "");
            setBodyNe(data.body_ne || "");
            setSummaryEn(data.summary_en || "");
            setImageUrl(data.image_url || "");
            setVisibility(data.visibility || "party");
            setAttachments(data.attachments || []);
            localStorage.removeItem(DRAFT_KEY); // Clear local draft when loading from DB
        }
    };

    // Auto-save to localStorage every 30 seconds
    const saveDraft = useCallback(() => {
        const draft: Draft = {
            title, title_ne: titleNe, body_en: bodyEn, body_ne: bodyNe,
            summary_en: summaryEn, image_url: imageUrl, visibility,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        setLastSaved(new Date());
    }, [title, titleNe, bodyEn, bodyNe, summaryEn, imageUrl, visibility]);

    useEffect(() => {
        const interval = setInterval(saveDraft, 30000);
        return () => clearInterval(interval);
    }, [saveDraft]);

    // Image upload handler
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert("Please select an image file");
            return;
        }

        setUploadingImage(true);
        const supabase = createClient();

        try {
            const fileName = `articles/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const { error } = await supabase.storage.from('media').upload(fileName, file);
            if (error) throw error;
            const { data } = supabase.storage.from('media').getPublicUrl(fileName);
            setImageUrl(data.publicUrl);
        } catch (error) {
            alert("Image upload failed: " + (error as Error).message);
        } finally {
            setUploadingImage(false);
        }
    };

    // Document upload handler
    const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];

        setUploadingDoc(true);
        const supabase = createClient();

        try {
            const fileName = `documents/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const { error } = await supabase.storage.from('media').upload(fileName, file);
            if (error) throw error;
            const { data } = supabase.storage.from('media').getPublicUrl(fileName);
            setAttachments(prev => [...prev, { name: file.name, url: data.publicUrl }]);
        } catch (error) {
            alert("Document upload failed: " + (error as Error).message);
        } finally {
            setUploadingDoc(false);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    // AI-powered form completion with silent retry
    const handleAIComplete = async (retryCount: number = 0) => {
        // Allow completion if we have title, body, OR attachments
        if (!title.trim() && !titleNe.trim() && !bodyEn.trim() && !bodyNe.trim() && attachments.length === 0) {
            alert(t("कृपया पहिले शीर्षक, मुख्य भाग, वा कागजात थप्नुहोस्", "Please enter a title, body content, or add attachments first"));
            return;
        }

        setAiCompleting(true);
        try {
            // Step 1: If attachments exist, analyze them first to extract context
            let attachmentContext = "";
            if (attachments.length > 0) {
                // Analyze first attachment (image or document)
                const firstAttachment = attachments[0];
                const attachmentUrl = typeof firstAttachment === 'string' ? firstAttachment : firstAttachment.url;

                try {
                    const analysisResponse = await fetch('/api/ai/analyze-attachment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ attachmentUrl })
                    });

                    if (analysisResponse.ok) {
                        const analysisResult = await analysisResponse.json();
                        if (analysisResult.data) {
                            const analysis = analysisResult.data;
                            attachmentContext = `
Document Analysis:
- Title: ${analysis.title || 'Unknown'}
- Title (Nepali): ${analysis.title_ne || 'Unknown'}
- Type: ${analysis.document_type || 'Unknown'}
- Description: ${analysis.caption_en || 'Unknown'}
- Key Topics: ${analysis.key_topics?.join(', ') || 'Unknown'}`;

                            // If no text fields are filled, use document analysis directly
                            if (!title.trim() && !titleNe.trim() && !bodyEn.trim() && !bodyNe.trim()) {
                                // Directly fill from document analysis
                                if (analysis.title) setTitle(analysis.title);
                                if (analysis.title_ne) setTitleNe(analysis.title_ne);
                                if (analysis.caption_en) setSummaryEn(analysis.caption_en);

                                // Generate body content from document analysis
                                const generatedBodyEn = `${analysis.caption_en || ''}\n\n${analysis.key_topics?.length ? `Key topics covered: ${analysis.key_topics.join(', ')}` : ''}`;
                                const generatedBodyNe = `${analysis.caption_ne || ''}`;

                                if (generatedBodyEn.trim()) setBodyEn(generatedBodyEn);
                                if (generatedBodyNe.trim()) setBodyNe(generatedBodyNe);
                            }
                        }
                    }
                } catch (analysisError) {
                    console.log("Attachment analysis skipped:", analysisError);
                    // Continue without attachment context
                }
            }

            // Step 2: Call article completion with all context including attachment analysis
            // Only call if we still have something to complete (e.g., generate Nepali from English or vice versa)
            const hasContent = title.trim() || titleNe.trim() || bodyEn.trim() || bodyNe.trim() || attachmentContext;

            if (hasContent) {
                const response = await fetch('/api/ai/complete-article', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: title.trim() || undefined,
                        title_ne: titleNe.trim() || undefined,
                        body_en: (bodyEn.trim() ? bodyEn.trim() + "\n\n" + attachmentContext : attachmentContext) || undefined,
                        body_ne: bodyNe.trim() || undefined,
                        summary_en: summaryEn.trim() || undefined
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'AI completion failed');
                }

                const { data } = result;

                // Fill missing fields with AI-generated content (translations)
                if (data.title_ne && !titleNe.trim()) setTitleNe(data.title_ne);
                if (data.title_en && !title.trim()) setTitle(data.title_en);
                if (data.body_ne && !bodyNe.trim()) setBodyNe(data.body_ne);
                if (data.body_en && !bodyEn.trim()) setBodyEn(data.body_en);
                if (data.summary_en && !summaryEn.trim()) setSummaryEn(data.summary_en);
                if (data.summary_ne && !summaryNe.trim()) setSummaryNe(data.summary_ne);

                // IMPORTANT: Apply formatted versions of source content
                // This replaces plain text with nicely formatted markdown
                if (data.body_ne_formatted && bodyNe.trim()) {
                    setBodyNe(data.body_ne_formatted);
                    console.log("[AI] Applied formatted version of Nepali content");
                }
                if (data.body_en_formatted && bodyEn.trim()) {
                    setBodyEn(data.body_en_formatted);
                    console.log("[AI] Applied formatted version of English content");
                }

                // Check what's still missing for potential retry
                const checkMissing = () => {
                    const missing = [];
                    if (!title.trim() && !data.title_en) missing.push("title_en");
                    if (!titleNe.trim() && !data.title_ne) missing.push("title_ne");
                    if (!bodyEn.trim() && !data.body_en) missing.push("body_en");
                    if (!bodyNe.trim() && !data.body_ne) missing.push("body_ne");
                    return missing;
                };

                const stillMissing = checkMissing();
                if (stillMissing.length > 0 && retryCount < 2) {
                    console.log(`[AI] Silent retry ${retryCount + 1}/2 for missing fields:`, stillMissing);
                    // Retry with updated context (use setTimeout to allow state updates)
                    setTimeout(() => {
                        handleAICompleteWithRetry(retryCount + 1);
                    }, 500);
                    return;
                }

                if (stillMissing.length > 0) {
                    console.log("[AI] Fields still missing after retries:", stillMissing);
                } else {
                    console.log("[AI] All fields completed successfully!");
                }
            }

        } catch (error) {
            console.error("AI completion error:", error);
            alert(t("AI पूरा गर्न असफल भयो", "AI completion failed: ") + (error as Error).message);
        } finally {
            setAiCompleting(false);
        }
    };

    // Wrapper for retry logic
    const handleAICompleteWithRetry = async (retryCount: number = 0) => {
        await handleAIComplete(retryCount);
    };

    // Public-facing AI complete function
    const handleAICompletePublic = () => {
        handleAIComplete(0);
    };

    // Save as draft to database
    const handleSaveDraft = async () => {
        if (!title.trim()) {
            alert("Please enter a title");
            return;
        }

        // Validate video content
        if ((contentType === 'interview' || contentType === 'speech') && !youtubeUrl.trim()) {
            alert("Please enter a YouTube URL");
            return;
        }

        setSaving(true);
        try {
            const today = new Date().toISOString().split("T")[0];
            const newsType = contentType === 'article' ? 'Article' : contentType === 'interview' ? 'Interview' : 'Video';
            const link = contentType === 'article' ? '' : youtubeUrl;

            await upsertNewsItem({
                id: editingId || undefined,
                title,
                title_ne: titleNe,
                body_en: contentType === 'article' ? bodyEn : (speakerName ? `Speaker: ${speakerName}\n\n${bodyEn}` : bodyEn),
                body_ne: bodyNe,
                summary_en: summaryEn || (contentType !== 'article' ? speakerName : ''),
                image_url: imageUrl,
                visibility,
                content_type: "article",
                status: "draft",
                source: "Member Contribution",
                date: today,
                date_bs: convertADtoBS(today),
                type: newsType,
                link: link,
                attachments: attachments
            });

            // Clear localStorage draft
            localStorage.removeItem(DRAFT_KEY);
            setLastSaved(new Date());
            alert("Draft saved successfully!");
        } catch (error) {
            alert("Failed to save: " + (error as Error).message);
        } finally {
            setSaving(false);
        }
    };

    // Submit for approval
    const handleSubmitForApproval = async () => {
        if (!title.trim()) {
            alert("Please enter a title");
            return;
        }

        if (contentType === 'article' && !bodyEn.trim()) {
            alert("Please enter content for your article");
            return;
        }

        if ((contentType === 'interview' || contentType === 'speech') && !youtubeUrl.trim()) {
            alert("Please enter a YouTube URL");
            return;
        }

        if (!selectedAdmin) {
            alert("Please select an admin to review your submission");
            return;
        }

        setSubmitting(true);
        try {
            const supabase = createClient();
            const today = new Date().toISOString().split("T")[0];
            const newsType = contentType === 'article' ? 'Article' : contentType === 'interview' ? 'Interview' : 'Video';
            const link = contentType === 'article' ? '' : youtubeUrl;

            const result = await upsertNewsItem({
                id: editingId || undefined,
                title,
                title_ne: titleNe,
                body_en: contentType === 'article' ? bodyEn : (speakerName ? `Speaker: ${speakerName}\n\n${bodyEn}` : bodyEn),
                body_ne: bodyNe,
                summary_en: summaryEn || (contentType !== 'article' ? speakerName : ''),
                image_url: imageUrl,
                visibility,
                content_type: "article",
                status: "submitted",
                source: "Member Contribution",
                date: today,
                date_bs: convertADtoBS(today),
                type: newsType,
                link: link,
                pending_reviewer_id: selectedAdmin,
                attachments: attachments
            });

            // Notification is now created server-side in cms.ts

            if (result?.success) {
                localStorage.removeItem(DRAFT_KEY);
                alert("Submitted for review! The reviewer has been notified.");
                router.push("/blogs");
            } else {
                throw new Error("Failed to submit article");
            }
        } catch (error) {
            alert("Failed to submit: " + (error as Error).message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-16 px-4 bg-slate-50">
                <div className="max-w-4xl mx-auto space-y-6">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 bg-slate-50">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/blogs" className="inline-flex items-center text-slate-500 hover:text-brand-blue mb-2">
                            <ArrowLeft className="w-4 h-4 mr-2" />{t("ब्लगमा फर्कनुहोस्", "Back to Blogs")}
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900">{t("तपाईंको विचार साझा गर्नुहोस्", "Share Your Thoughts")}</h1>
                        <p className="text-slate-500 mt-1">{t("हामीलाई तपाईंको विचार र कथाहरू सुन्न मन लाग्छ", "We'd love to hear your ideas and stories")}</p>
                    </div>

                    {lastSaved && (
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Clock className="w-4 h-4" />
                            Saved {lastSaved.toLocaleTimeString()}
                        </div>
                    )}
                </div>

                {/* My Articles Section */}
                {(myArticles.length > 0 || editingId) && (
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                📝 {t("तपाईंका लेखहरू", "Your Articles")} ({myArticles.length})
                            </h3>
                            {editingId && (
                                <button
                                    onClick={() => {
                                        setEditingId(null);
                                        setTitle("");
                                        setTitleNe("");
                                        setBodyEn("");
                                        setBodyNe("");
                                        setSummaryEn("");
                                        setImageUrl("");
                                        setAttachments([]);
                                        setYoutubeUrl("");
                                        setSpeakerName("");
                                        localStorage.removeItem(DRAFT_KEY);
                                    }}
                                    className="px-3 py-1.5 bg-brand-blue text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                                >
                                    + {t("नयाँ लेख", "New Article")}
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {myArticles.map((article) => {
                                const statusColors: Record<string, string> = {
                                    draft: "bg-amber-100 text-amber-700 border-amber-200",
                                    submitted: "bg-blue-100 text-blue-700 border-blue-200",
                                    published: "bg-green-100 text-green-700 border-green-200",
                                    rejected: "bg-red-100 text-red-700 border-red-200"
                                };
                                const statusLabels: Record<string, string> = {
                                    draft: t("ड्राफ्ट", "Draft"),
                                    submitted: t("समीक्षामा", "Under Review"),
                                    published: t("प्रकाशित", "Published"),
                                    rejected: t("अस्वीकृत", "Rejected")
                                };
                                const isActive = editingId === article.id;

                                return (
                                    <button
                                        key={article.id}
                                        onClick={() => loadDraft(article.id)}
                                        className={cn(
                                            "text-left p-3 bg-white rounded-lg border transition-all",
                                            isActive
                                                ? "border-brand-blue ring-2 ring-brand-blue/20"
                                                : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                                        )}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="font-medium text-slate-800 truncate flex-1">
                                                {article.title || "Untitled"}
                                            </div>
                                            <span className={cn(
                                                "text-[10px] px-1.5 py-0.5 rounded border shrink-0",
                                                statusColors[article.status || 'draft'] || statusColors.draft
                                            )}>
                                                {statusLabels[article.status || 'draft'] || statusLabels.draft}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            {article.updated_at ? new Date(article.updated_at).toLocaleDateString() : article.date}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
                    {/* Content Type Selector */}
                    <div className="space-y-2">
                        <Label>{t("के साझा गर्न चाहनुहुन्छ?", "What would you like to share?")}</Label>
                        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setContentType('article')}
                                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${contentType === 'article'
                                    ? 'bg-brand-red text-white shadow-sm'
                                    : 'text-slate-600 hover:text-brand-red hover:bg-red-50'
                                    }`}
                            >
                                📝 {t("ब्लग पोस्ट", "Blog Post")}
                            </button>
                            <button
                                type="button"
                                onClick={() => setContentType('interview')}
                                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${contentType === 'interview'
                                    ? 'bg-brand-blue text-white shadow-sm'
                                    : 'text-slate-600 hover:text-brand-blue hover:bg-blue-50'
                                    }`}
                            >
                                🎤 {t("अन्तर्वार्ता", "Interview")}
                            </button>
                            <button
                                type="button"
                                onClick={() => setContentType('speech')}
                                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${contentType === 'speech'
                                    ? 'bg-brand-red text-white shadow-sm'
                                    : 'text-slate-600 hover:text-brand-red hover:bg-red-50'
                                    }`}
                            >
                                🎙️ {t("भाषण", "Speech")}
                            </button>
                        </div>
                    </div>

                    {/* AI Complete Button */}
                    <div className="flex items-center justify-end gap-2">
                        {attachments.length > 0 && (
                            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                                📎 {attachments.length} {t("कागजात", "attachment")}{attachments.length > 1 ? "s" : ""}
                            </span>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleAICompletePublic}
                            disabled={aiCompleting || (!title.trim() && !titleNe.trim() && !bodyEn.trim() && !bodyNe.trim() && attachments.length === 0)}
                            className="gap-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-300"
                        >
                            {aiCompleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {attachments.length > 0
                                        ? t("कागजात पढ्दै...", "Reading documents...")
                                        : t("AI पूरा गर्दै...", "Completing...")}
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    {attachments.length > 0 && !title.trim() && !bodyEn.trim()
                                        ? t("📄 कागजातबाट लेख्नुहोस्", "📄 Write from documents")
                                        : t("✨ AI ले पूरा गर्नुहोस्", "✨ Complete with AI")}
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Title */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Title (English) *</Label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Your article title..."
                                className="text-lg"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Title (Nepali)</Label>
                            <Input
                                value={titleNe}
                                onChange={(e) => setTitleNe(e.target.value)}
                                placeholder="शीर्षक..."
                                className="font-nepali"
                            />
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="space-y-2">
                        <Label>Summary (shown in previews)</Label>
                        <Input
                            value={summaryEn}
                            onChange={(e) => setSummaryEn(e.target.value)}
                            placeholder={contentType === 'article' ? "Brief summary of your article..." : "Brief description..."}
                        />
                    </div>

                    {/* VIDEO SPECIFIC: YouTube URL and Speaker Name */}
                    {(contentType === 'interview' || contentType === 'speech') && (
                        <>
                            <div className="space-y-2">
                                <Label>YouTube URL *</Label>
                                <Input
                                    value={youtubeUrl}
                                    onChange={(e) => setYoutubeUrl(e.target.value)}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                                {/* Preview */}
                                {youtubeUrl && youtubeUrl.includes('youtube') && (
                                    <div className="mt-2 rounded-xl overflow-hidden aspect-video">
                                        <iframe
                                            src={youtubeUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                            className="w-full h-full"
                                            allowFullScreen
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>{contentType === 'interview' ? 'Interviewee Name' : 'Speaker Name'}</Label>
                                <Input
                                    value={speakerName}
                                    onChange={(e) => setSpeakerName(e.target.value)}
                                    placeholder={contentType === 'interview' ? "Who is being interviewed?" : "Who is speaking?"}
                                />
                            </div>
                        </>
                    )}

                    {/* ARTICLE SPECIFIC: Body content */}
                    {contentType === 'article' && (
                        <>
                            {/* Body English */}
                            <div className="space-y-2">
                                <Label>Content (English) *</Label>
                                <textarea
                                    value={bodyEn}
                                    onChange={(e) => setBodyEn(e.target.value)}
                                    placeholder="Write your article here..."
                                    className="w-full min-h-[200px] p-4 border rounded-xl resize-y focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                                />
                            </div>

                            {/* Body Nepali */}
                            <div className="space-y-2">
                                <Label>Content (Nepali)</Label>
                                <textarea
                                    value={bodyNe}
                                    onChange={(e) => setBodyNe(e.target.value)}
                                    placeholder="यहाँ नेपालीमा लेख्नुहोस्..."
                                    className="w-full min-h-[200px] p-4 border rounded-xl resize-y focus:ring-2 focus:ring-brand-blue focus:border-transparent font-nepali"
                                />
                            </div>
                        </>
                    )}

                    {/* INTERVIEW/SPEECH: Optional transcript */}
                    {(contentType === 'interview' || contentType === 'speech') && (
                        <div className="space-y-2">
                            <Label>Transcript / Notes (Optional)</Label>
                            <textarea
                                value={bodyEn}
                                onChange={(e) => setBodyEn(e.target.value)}
                                placeholder="Add transcript or notes..."
                                className="w-full min-h-[120px] p-4 border rounded-xl resize-y focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                            />
                        </div>
                    )}

                    {/* Featured Image */}
                    <div className="space-y-3">
                        <Label>Featured Image</Label>
                        <div className="flex flex-col gap-3">
                            {/* Image Preview */}
                            {imageUrl && (
                                <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-100 border">
                                    <Image
                                        src={imageUrl}
                                        alt="Featured"
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        onClick={() => setImageUrl("")}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* Upload Button */}
                            <div className="flex gap-3">
                                <label className="flex-1 cursor-pointer">
                                    <div className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl transition-colors ${uploadingImage ? 'bg-slate-50 border-slate-300' : 'hover:bg-blue-50 hover:border-brand-blue border-slate-200'
                                        }`}>
                                        {uploadingImage ? (
                                            <><Loader2 className="w-5 h-5 animate-spin text-slate-400" /> Uploading...</>
                                        ) : (
                                            <><ImageIcon className="w-5 h-5 text-slate-400" /> Upload Image</>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploadingImage}
                                        className="hidden"
                                    />
                                </label>

                                {/* Or paste URL */}
                                <Input
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="Or paste URL..."
                                    className="flex-1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Document Attachments */}
                    <div className="space-y-3">
                        <Label>Attachments (PDFs, Documents)</Label>

                        {/* Attachment List */}
                        {attachments.length > 0 && (
                            <div className="space-y-2">
                                {attachments.map((att, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border">
                                        <FileText className="w-5 h-5 text-brand-blue" />
                                        <span className="flex-1 text-sm font-medium truncate">{att.name || 'Document'}</span>
                                        <button
                                            onClick={() => removeAttachment(idx)}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload Button */}
                        <label className="cursor-pointer">
                            <div className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl transition-colors ${uploadingDoc ? 'bg-slate-50 border-slate-300' : 'hover:bg-green-50 hover:border-green-500 border-slate-200'
                                }`}>
                                {uploadingDoc ? (
                                    <><Loader2 className="w-5 h-5 animate-spin text-slate-400" /> Uploading...</>
                                ) : (
                                    <><Upload className="w-5 h-5 text-slate-400" /> Add Document (PDF, Word, etc.)</>
                                )}
                            </div>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                                onChange={handleDocUpload}
                                disabled={uploadingDoc}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Visibility */}
                    <div className="space-y-2">
                        <Label>Who can see this?</Label>
                        <select
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                            className="w-full h-10 px-3 border rounded-lg"
                        >
                            <option value="public">🌍 Everyone (Public)</option>
                            <option value="party">🏛️ Party Members Only</option>
                            <option value="team">👥 Team Only</option>
                        </select>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Submit for Approval */}
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <h3 className="font-semibold text-blue-800 mb-2">Submit for Review</h3>
                        <p className="text-sm text-blue-600 mb-4">
                            Once submitted, an admin will review and publish your article.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <select
                                value={selectedAdmin}
                                onChange={(e) => setSelectedAdmin(e.target.value)}
                                className="flex-1 h-10 px-3 border rounded-lg bg-white"
                            >
                                <option value="">Select reviewer...</option>
                                {admins.map((admin) => (
                                    <option key={admin.id} value={admin.id}>
                                        {admin.full_name || "Unknown"} ({admin.role})
                                    </option>
                                ))}
                            </select>
                            <Button
                                onClick={handleSubmitForApproval}
                                disabled={submitting || !selectedAdmin}
                                className="bg-brand-blue hover:bg-blue-700"
                            >
                                {submitting ? "Submitting..." : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Submit for Review
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between pt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                saveDraft();
                                alert("Draft saved to browser!");
                            }}
                        >
                            <Clock className="w-4 h-4 mr-2" />
                            Save Locally
                        </Button>
                        <Button
                            onClick={handleSaveDraft}
                            disabled={saving}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {saving ? t("सुरक्षित गर्दै...", "Saving...") : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    {t("ड्राफ्टमा सुरक्षित", "Save as Draft")}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
