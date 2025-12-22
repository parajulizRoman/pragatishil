"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { X, Upload, Loader2, Sparkles, FileText, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/typography";
import { useLanguage } from "@/context/LanguageContext";
import { MediaItem } from "@/types";

interface PressReleaseFormProps {
    onClose: () => void;
    onSuccess: () => void;
    editItem?: MediaItem | null;
}

export default function PressReleaseForm({ onClose, onSuccess, editItem }: PressReleaseFormProps) {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    // Form state
    const [file, setFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState(editItem?.url || "");
    const [title, setTitle] = useState(editItem?.title || "");
    const [titleNe, setTitleNe] = useState("");
    const [caption, setCaption] = useState(editItem?.caption || "");
    const [captionNe, setCaptionNe] = useState(editItem?.caption_ne || "");
    const [altText, setAltText] = useState(editItem?.alt_text || "");

    const isEditing = !!editItem;

    // Upload file to Supabase storage
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        // Upload immediately
        setUploading(true);
        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const fileExt = selectedFile.name.split('.').pop();
            const fileName = `press-releases/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(fileName, selectedFile, { cacheControl: '3600' });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('media')
                .getPublicUrl(fileName);

            setFileUrl(publicUrl);
        } catch (error) {
            console.error('Upload error:', error);
            alert(t("अपलोड असफल भयो", "Upload failed"));
        } finally {
            setUploading(false);
        }
    };

    // AI analyze document
    const handleAnalyze = async () => {
        if (!fileUrl) {
            alert(t("कृपया पहिले कागजात अपलोड गर्नुहोस्", "Please upload a document first"));
            return;
        }

        setAnalyzing(true);
        try {
            const response = await fetch("/api/ai/analyze-document", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ documentUrl: fileUrl })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Analysis failed");
            }

            const data = await response.json();

            // Auto-fill fields
            if (data.title) setTitle(data.title);
            if (data.title_ne) setTitleNe(data.title_ne);
            if (data.caption_en) setCaption(data.caption_en);
            if (data.caption_ne) setCaptionNe(data.caption_ne);
            if (data.alt_text) setAltText(data.alt_text);

        } catch (error) {
            console.error('Analysis error:', error);
            alert(t("विश्लेषण असफल भयो", "Analysis failed: ") + (error as Error).message);
        } finally {
            setAnalyzing(false);
        }
    };

    // Save press release
    const handleSave = async () => {
        if (!fileUrl) {
            alert(t("कृपया कागजात अपलोड गर्नुहोस्", "Please upload a document"));
            return;
        }
        if (!title.trim()) {
            alert(t("कृपया शीर्षक प्रविष्ट गर्नुहोस्", "Please enter a title"));
            return;
        }

        setLoading(true);
        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const { data: { user } } = await supabase.auth.getUser();

            const payload = {
                title,
                caption,
                caption_ne: captionNe,
                alt_text: altText,
                url: fileUrl,
                media_type: 'document',
                type: 'press-release',
                uploaded_by: user?.id,
                updated_by: user?.id,
            };

            let result;
            if (isEditing && editItem) {
                result = await supabase
                    .from('media_gallery')
                    .update(payload)
                    .eq('id', editItem.id);
            } else {
                result = await supabase
                    .from('media_gallery')
                    .insert(payload);
            }

            if (result.error) throw result.error;

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Save error:', error);
            alert(t("सुरक्षित गर्न असफल", "Failed to save: ") + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const isPdf = fileUrl.toLowerCase().endsWith('.pdf');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-brand-navy to-brand-blue">
                    <Typography variant="h3" className="text-lg font-bold text-white">
                        {isEditing ? t("प्रेस विज्ञप्ति सम्पादन", "Edit Press Release") : t("नयाँ प्रेस विज्ञप्ति", "New Press Release")}
                    </Typography>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10">
                        <X size={20} />
                    </Button>
                </div>

                {/* Form Content */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {/* File Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            {t("कागजात अपलोड", "Upload Document")} <span className="text-red-500">*</span>
                        </label>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-brand-blue/50 transition-colors">
                            {fileUrl ? (
                                <div className="flex items-center justify-center gap-3">
                                    <FileText size={32} className="text-brand-red" />
                                    <div className="text-left">
                                        <p className="font-medium text-slate-700 truncate max-w-xs">
                                            {file?.name || t("कागजात अपलोड भयो", "Document uploaded")}
                                        </p>
                                        <p className="text-xs text-slate-400">{isPdf ? "PDF" : "Image"}</p>
                                    </div>
                                    <label className="cursor-pointer text-brand-blue text-sm hover:underline">
                                        {t("परिवर्तन", "Change")}
                                        <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                                    </label>
                                </div>
                            ) : (
                                <label className="cursor-pointer block">
                                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                                    {uploading ? (
                                        <Loader2 size={32} className="mx-auto text-brand-blue animate-spin" />
                                    ) : (
                                        <>
                                            <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                                            <p className="text-slate-600">{t("PDF वा छवि अपलोड गर्नुहोस्", "Upload PDF or Image")}</p>
                                            <p className="text-xs text-slate-400 mt-1">{t("अधिकतम 20MB", "Max 20MB")}</p>
                                        </>
                                    )}
                                </label>
                            )}
                        </div>
                    </div>

                    {/* AI Analyze Button */}
                    {fileUrl && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            className="w-full h-12 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border-purple-200 text-purple-700 gap-2"
                        >
                            {analyzing ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Sparkles size={18} />
                            )}
                            {analyzing ? t("विश्लेषण गर्दै...", "Analyzing...") : t("AI ले स्वतः भर्नुहोस्", "Auto-fill with AI")}
                        </Button>
                    )}

                    {/* Title */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                {t("शीर्षक (अंग्रेजी)", "Title (English)")} <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={t("प्रेस विज्ञप्ति शीर्षक", "Press release title")}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                {t("शीर्षक (नेपाली)", "Title (Nepali)")}
                            </label>
                            <Input
                                value={titleNe}
                                onChange={(e) => setTitleNe(e.target.value)}
                                placeholder={t("नेपाली शीर्षक", "Nepali title")}
                                className="font-nepali"
                            />
                        </div>
                    </div>

                    {/* Caption */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">{t("विवरण (अंग्रेजी)", "Description (English)")}</label>
                        <Textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder={t("संक्षिप्त विवरण लेख्नुहोस्", "Write a brief description")}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">{t("विवरण (नेपाली)", "Description (Nepali)")}</label>
                        <Textarea
                            value={captionNe}
                            onChange={(e) => setCaptionNe(e.target.value)}
                            placeholder={t("नेपालीमा संक्षिप्त विवरण", "Brief description in Nepali")}
                            rows={3}
                            className="font-nepali"
                        />
                    </div>

                    {/* Alt Text / SEO */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">{t("SEO विवरण", "SEO Description")}</label>
                        <Input
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            placeholder={t("खोज इन्जिनको लागि विवरण", "Description for search engines")}
                        />
                        <p className="text-xs text-slate-400">{t("यो खोज इन्जिनहरूमा देखिनेछ", "This will appear in search engines")}</p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                    <Button variant="ghost" onClick={onClose} disabled={loading}>
                        {t("रद्द गर्नुहोस्", "Cancel")}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleSave}
                        disabled={loading || !fileUrl}
                        className="gap-2"
                    >
                        <Save size={16} />
                        {loading ? t("सुरक्षित गर्दै...", "Saving...") : t("सुरक्षित गर्नुहोस्", "Save")}
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={loading || !fileUrl || !title}
                        className="bg-brand-blue hover:bg-brand-blue/90 text-white gap-2"
                    >
                        <Send size={16} />
                        {loading ? t("प्रकाशित गर्दै...", "Publishing...") : t("प्रकाशित गर्नुहोस्", "Publish")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
