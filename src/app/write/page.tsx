"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import { upsertNewsItem } from "@/actions/cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, Send, Clock, Upload, X, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { convertADtoBS } from "@/lib/dateConverter";
import Image from "next/image";
import { NewsAttachment } from "@/types";

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
    const [imageUrl, setImageUrl] = useState("");
    const [visibility, setVisibility] = useState("party");
    const [attachments, setAttachments] = useState<NewsAttachment[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingDoc, setUploadingDoc] = useState(false);

    // Video/Interview specific fields
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [speakerName, setSpeakerName] = useState("");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [admins, setAdmins] = useState<any[]>([]);
    const [selectedAdmin, setSelectedAdmin] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [myDrafts, setMyDrafts] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Check auth and load draft
    useEffect(() => {
        const init = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login?redirect=/write");
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
                    router.push("/news");
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

            // Load user's drafts from database
            // Try status first (new schema), fallback to is_published (old schema)
            let drafts = null;
            let draftsError = null;

            // Try with status column first
            const result1 = await supabase
                .from("news_items")
                .select("id, title, title_ne, summary_en, date")
                .eq("status", "draft")
                .order("date", { ascending: false })
                .limit(10);

            if (result1.error) {
                // Fallback to is_published for old schema
                const result2 = await supabase
                    .from("news_items")
                    .select("id, title, title_ne, summary_en, date")
                    .eq("is_published", false)
                    .order("date", { ascending: false })
                    .limit(10);
                drafts = result2.data;
                draftsError = result2.error;
            } else {
                drafts = result1.data;
                draftsError = result1.error;
            }

            console.log("Drafts query:", { drafts, draftsError, userId: user.id });
            if (drafts) setMyDrafts(drafts);

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

            setLoading(false);
        };

        init();
    }, [router]);

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
                status: "submitted",
                source: "Member Contribution",
                date: today,
                date_bs: convertADtoBS(today),
                type: newsType,
                link: link,
                pending_reviewer_id: selectedAdmin,
                attachments: attachments
            });

            localStorage.removeItem(DRAFT_KEY);
            alert("Submitted for review! An admin will review it soon.");
            router.push("/news");
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
                        <Link href="/news" className="inline-flex items-center text-slate-500 hover:text-brand-blue mb-2">
                            <ArrowLeft className="w-4 h-4 mr-2" />{t("समाचारमा फर्कनुहोस्", "Back to News")}
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

                {/* My Drafts Section */}
                {myDrafts.length > 0 && !editingId && (
                    <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 mb-6">
                        <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                            📝 {t(`तपाईंका सुरक्षित ड्राफ्टहरू (${myDrafts.length})`, `Your Saved Drafts (${myDrafts.length})`)}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {myDrafts.map((draft) => (
                                <button
                                    key={draft.id}
                                    onClick={() => loadDraft(draft.id)}
                                    className="text-left p-3 bg-white rounded-lg border border-amber-100 hover:border-amber-300 hover:shadow-sm transition-all"
                                >
                                    <div className="font-medium text-slate-800 truncate">
                                        {draft.title || "Untitled"}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">
                                        {draft.updated_at ? new Date(draft.updated_at).toLocaleDateString() : draft.date}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Editing Indicator */}
                {editingId && (
                    <div className="bg-blue-50 rounded-xl border border-blue-200 p-3 mb-6 flex items-center justify-between">
                        <span className="text-blue-800 font-medium">✏️ Editing draft</span>
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
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                            Start fresh instead
                        </button>
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
                                    ? 'bg-white shadow-sm text-brand-blue'
                                    : 'text-slate-600 hover:text-slate-800'
                                    }`}
                            >
                                📝 {t("लेख", "Article")}
                            </button>
                            <button
                                type="button"
                                onClick={() => setContentType('interview')}
                                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${contentType === 'interview'
                                    ? 'bg-white shadow-sm text-brand-blue'
                                    : 'text-slate-600 hover:text-slate-800'
                                    }`}
                            >
                                🎤 {t("अन्तर्वार्ता", "Interview")}
                            </button>
                            <button
                                type="button"
                                onClick={() => setContentType('speech')}
                                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${contentType === 'speech'
                                    ? 'bg-white shadow-sm text-brand-blue'
                                    : 'text-slate-600 hover:text-slate-800'
                                    }`}
                            >
                                🎙️ {t("भाषण", "Speech")}
                            </button>
                        </div>
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
