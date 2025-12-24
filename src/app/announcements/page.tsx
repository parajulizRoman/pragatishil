"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Megaphone, Loader2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface Announcement {
    id: string;
    title: string;
    body: string;
    link: string | null;
    priority: 'normal' | 'important' | 'urgent';
    target_roles: string[] | null;
    created_at: string;
    sender: {
        id: string;
        full_name: string | null;
        handle: string | null;
        avatar_url: string | null;
    } | null;
}

const PLACEHOLDERS = [
    "/placeholders/eye-red.svg",
    "/placeholders/eye-blue.svg",
];

const priorityConfig = {
    normal: {
        icon: Info,
        bg: "bg-white",
        border: "border-slate-200",
        badge: "bg-slate-100 text-slate-600",
        label: "सामान्य"
    },
    important: {
        icon: AlertCircle,
        bg: "bg-blue-50/50",
        border: "border-blue-200",
        badge: "bg-blue-100 text-blue-700",
        label: "महत्वपूर्ण"
    },
    urgent: {
        icon: AlertTriangle,
        bg: "bg-red-50/50",
        border: "border-red-200",
        badge: "bg-red-100 text-red-700",
        label: "अत्यन्त जरुरी"
    }
};

export default function AnnouncementsPage() {
    const { t } = useLanguage();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await fetch("/api/announcements?limit=50");
                if (!res.ok) {
                    const data = await res.json();
                    setError(data.error || "Failed to load announcements");
                    return;
                }
                const data = await res.json();
                setAnnouncements(data.announcements || []);
            } catch (e) {
                console.error("Fetch announcements error:", e);
                setError("Failed to load announcements");
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
                <div className="container max-w-3xl mx-auto px-4">
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
                <div className="container max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <Megaphone className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                        <p className="text-slate-500">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
            <div className="container max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Megaphone className="w-8 h-8 text-brand-red" />
                        <h1 className="text-3xl font-bold text-slate-800">
                            {t("घोषणाहरू", "Announcements")}
                        </h1>
                    </div>
                    <p className="text-slate-500">
                        {t("पार्टीका आधिकारिक घोषणाहरू", "Official party announcements")}
                    </p>
                </div>

                {/* Announcements List */}
                {announcements.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <Megaphone className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                        <p className="text-slate-500">
                            {t("अझै कुनै घोषणा छैन", "No announcements yet")}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {announcements.map((ann) => {
                            const config = priorityConfig[ann.priority] || priorityConfig.normal;
                            const PriorityIcon = config.icon;
                            const avatar = ann.sender?.avatar_url || PLACEHOLDERS[0];

                            return (
                                <article
                                    key={ann.id}
                                    className={cn(
                                        "rounded-2xl shadow-sm border p-6 transition-shadow hover:shadow-md",
                                        config.bg,
                                        config.border
                                    )}
                                >
                                    {/* Priority Badge */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                                            config.badge
                                        )}>
                                            <PriorityIcon size={14} />
                                            {t(config.label, ann.priority)}
                                        </span>
                                        <time className="text-xs text-slate-400">
                                            {formatDistanceToNow(new Date(ann.created_at), { addSuffix: true })}
                                        </time>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-xl font-bold text-slate-800 mb-2">
                                        {ann.title}
                                    </h2>

                                    {/* Body */}
                                    <p className="text-slate-600 whitespace-pre-wrap mb-4">
                                        {ann.body}
                                    </p>

                                    {/* Link */}
                                    {ann.link && (
                                        <Link
                                            href={ann.link}
                                            className="inline-block text-brand-blue hover:underline text-sm mb-4"
                                        >
                                            {t("थप हेर्नुहोस् →", "Learn more →")}
                                        </Link>
                                    )}

                                    {/* Sender */}
                                    {ann.sender && (
                                        <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                                            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100">
                                                <Image
                                                    src={avatar}
                                                    alt={ann.sender.full_name || "Sender"}
                                                    fill
                                                    className="object-cover"
                                                    sizes="32px"
                                                />
                                            </div>
                                            <div className="text-sm">
                                                <span className="text-slate-500">{t("द्वारा", "Posted by")} </span>
                                                <Link
                                                    href={`/members/${ann.sender.id}`}
                                                    className="font-medium text-slate-700 hover:text-brand-blue"
                                                >
                                                    {ann.sender.full_name || "Unknown"}
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
