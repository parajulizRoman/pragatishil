"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Loader2, Trash2 } from "lucide-react";
import { DiscussionChannel } from "@/types";
import { createBrowserClient } from "@supabase/ssr";
import { useLanguage } from "@/context/LanguageContext";

interface ChannelHeaderEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    channel: DiscussionChannel;
}

export default function ChannelHeaderEditModal({ isOpen, onClose, onSuccess, channel }: ChannelHeaderEditModalProps) {
    const { t } = useLanguage();
    const [headerImageUrl, setHeaderImageUrl] = useState(channel.header_image_url || "");
    const [politicalIntro, setPoliticalIntro] = useState(channel.political_intro || "");
    const [impactStats, setImpactStats] = useState<Record<string, string>>(
        (channel.impact_stats as Record<string, string>) || {}
    );
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setHeaderImageUrl(channel.header_image_url || "");
            setPoliticalIntro(channel.political_intro || "");
            setImpactStats((channel.impact_stats as Record<string, string>) || {});
        }
    }, [isOpen, channel]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];

        setUploading(true);
        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const filePath = `channel-headers/${channel.id}/${Date.now()}-${file.name}`;
            const { error } = await supabase.storage
                .from("attachments")
                .upload(filePath, file, { upsert: true });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from("attachments")
                .getPublicUrl(filePath);

            setHeaderImageUrl(publicUrl);
        } catch (err) {
            console.error("Upload error:", err);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleAddStat = () => {
        const key = prompt(t("तथ्याङ्क नाम (जस्तै: जनसंख्या)", "Stat name (e.g., Population)"));
        if (key) {
            setImpactStats(prev => ({ ...prev, [key]: "" }));
        }
    };

    const handleRemoveStat = (key: string) => {
        setImpactStats(prev => {
            const newStats = { ...prev };
            delete newStats[key];
            return newStats;
        });
    };

    const handleStatChange = (key: string, value: string) => {
        setImpactStats(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/discussions/channels", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: channel.id,
                    header_image_url: headerImageUrl || null,
                    political_intro: politicalIntro || null,
                    impact_stats: impactStats,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update");
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error("Save error:", err);
            alert("Failed to save: " + (err instanceof Error ? err.message : "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-brand-navy">
                        {t("च्यानल हेडर सम्पादन", "Edit Channel Header")}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Header Image */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            {t("हेडर छवि (नक्सा)", "Header Image (Map)")}
                        </label>
                        {headerImageUrl ? (
                            <div className="relative">
                                <img
                                    src={headerImageUrl}
                                    alt="Header"
                                    className="w-full h-48 object-cover rounded-lg border"
                                />
                                <button
                                    type="button"
                                    onClick={() => setHeaderImageUrl("")}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                                {uploading ? (
                                    <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                        <span className="text-sm text-slate-500">
                                            {t("छवि अपलोड गर्नुहोस्", "Upload an image")}
                                        </span>
                                    </>
                                )}
                            </label>
                        )}
                    </div>

                    {/* Political Intro */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            {t("राजनीतिक परिचय", "Political Introduction")}
                        </label>
                        <textarea
                            value={politicalIntro}
                            onChange={(e) => setPoliticalIntro(e.target.value)}
                            rows={6}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                            placeholder={t(
                                "यस क्षेत्रको राजनीतिक परिचय...",
                                "Political introduction of this area..."
                            )}
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            {t("मार्कडाउन समर्थित", "Markdown supported")}
                        </p>
                    </div>

                    {/* Impact Stats */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-slate-700">
                                {t("तथ्याङ्कहरू", "Statistics")}
                            </label>
                            <button
                                type="button"
                                onClick={handleAddStat}
                                className="text-xs text-brand-blue hover:underline"
                            >
                                + {t("थप्नुहोस्", "Add")}
                            </button>
                        </div>
                        <div className="space-y-2">
                            {Object.entries(impactStats).map(([key, value]) => (
                                <div key={key} className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-slate-600 min-w-[120px]">
                                        {key}:
                                    </span>
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => handleStatChange(key, e.target.value)}
                                        className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm"
                                        placeholder={t("मान", "Value")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveStat(key)}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {Object.keys(impactStats).length === 0 && (
                                <p className="text-sm text-slate-400 italic">
                                    {t("कुनै तथ्याङ्क छैन", "No statistics yet")}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                            disabled={loading}
                        >
                            {t("रद्द गर्नुहोस्", "Cancel")}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 disabled:opacity-50 flex items-center gap-2"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {t("सुरक्षित गर्नुहोस्", "Save")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
