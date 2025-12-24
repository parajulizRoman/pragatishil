"use client";

import React, { useState, useEffect } from "react";
import { Megaphone, Send, Loader2, AlertTriangle, AlertCircle, Info, Users, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface Announcement {
    id: string;
    title: string;
    body: string;
    priority: string;
    target_roles: string[] | null;
    created_at: string;
}

const ROLE_OPTIONS = [
    { value: 'member', label: 'Member (सदस्य)' },
    { value: 'party_member', label: 'Party Member (पार्टी सदस्य)' },
    { value: 'team_member', label: 'Team Member (टोली सदस्य)' },
    { value: 'central_committee', label: 'Central Committee (केन्द्रीय समिति)' },
    { value: 'board', label: 'Board (बोर्ड)' },
    { value: 'admin_party', label: 'Party Admin (पार्टी एडमिन)' },
    { value: 'admin', label: 'Admin (एडमिन)' },
    { value: 'yantrik', label: 'Yantrik (यन्त्रिक)' },
];

const PRIORITY_OPTIONS = [
    { value: 'normal', label: 'Normal', icon: Info, color: 'text-slate-500' },
    { value: 'important', label: 'Important', icon: AlertCircle, color: 'text-blue-500' },
    { value: 'urgent', label: 'Urgent', icon: AlertTriangle, color: 'text-red-500' },
];

export default function AdminAnnouncementsPage() {
    const { t } = useLanguage();

    // Form state
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [link, setLink] = useState("");
    const [priority, setPriority] = useState("normal");
    const [targetAll, setTargetAll] = useState(true);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Past announcements
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loadingList, setLoadingList] = useState(true);

    // Fetch past announcements
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await fetch("/api/announcements?limit=10");
                if (res.ok) {
                    const data = await res.json();
                    setAnnouncements(data.announcements || []);
                }
            } catch (e) {
                console.error("Fetch error:", e);
            } finally {
                setLoadingList(false);
            }
        };
        fetchAnnouncements();
    }, []);

    // Handle role selection
    const toggleRole = (role: string) => {
        setSelectedRoles(prev =>
            prev.includes(role)
                ? prev.filter(r => r !== role)
                : [...prev, role]
        );
    };

    // Submit announcement
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!title.trim() || !body.trim()) {
            setError("Title and body are required");
            return;
        }

        setSending(true);
        try {
            const res = await fetch("/api/announcements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    body: body.trim(),
                    link: link.trim() || null,
                    priority,
                    target_roles: targetAll ? null : selectedRoles
                })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(`Announcement sent to ${data.notified} members!`);
                setTitle("");
                setBody("");
                setLink("");
                setPriority("normal");
                setTargetAll(true);
                setSelectedRoles([]);

                // Refresh list
                const listRes = await fetch("/api/announcements?limit=10");
                if (listRes.ok) {
                    const listData = await listRes.json();
                    setAnnouncements(listData.announcements || []);
                }
            } else {
                setError(data.error || "Failed to send announcement");
            }
        } catch (e) {
            console.error("Send error:", e);
            setError("Failed to send announcement");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
            <div className="container max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-brand-red/10 rounded-xl">
                        <Megaphone className="w-7 h-7 text-brand-red" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            {t("घोषणाहरू पठाउनुहोस्", "Send Announcements")}
                        </h1>
                        <p className="text-slate-500 text-sm">
                            {t("सबै वा छनौट सदस्यहरूलाई सूचना पठाउनुहोस्", "Broadcast to all or selected members")}
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="font-semibold text-slate-800 mb-4">{t("नयाँ घोषणा", "New Announcement")}</h2>

                        {/* Title */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t("शीर्षक", "Title")} *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder={t("घोषणाको शीर्षक", "Announcement title")}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                            />
                        </div>

                        {/* Body */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t("विवरण", "Body")} *
                            </label>
                            <textarea
                                value={body}
                                onChange={e => setBody(e.target.value)}
                                placeholder={t("घोषणाको विवरण...", "Announcement details...")}
                                rows={4}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 resize-none"
                            />
                        </div>

                        {/* Link */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t("लिङ्क (वैकल्पिक)", "Link (Optional)")}
                            </label>
                            <input
                                type="url"
                                value={link}
                                onChange={e => setLink(e.target.value)}
                                placeholder="https://..."
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                            />
                        </div>

                        {/* Priority */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                {t("प्राथमिकता", "Priority")}
                            </label>
                            <div className="flex gap-2">
                                {PRIORITY_OPTIONS.map(opt => {
                                    const Icon = opt.icon;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setPriority(opt.value)}
                                            className={cn(
                                                "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                                                priority === opt.value
                                                    ? "bg-slate-100 border-slate-300"
                                                    : "border-slate-200 hover:bg-slate-50"
                                            )}
                                        >
                                            <Icon size={16} className={opt.color} />
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Target Audience */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                {t("लक्षित समूह", "Target Audience")}
                            </label>
                            <div className="flex gap-3 mb-3">
                                <button
                                    type="button"
                                    onClick={() => setTargetAll(true)}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                                        targetAll ? "bg-brand-blue text-white border-brand-blue" : "border-slate-200 hover:bg-slate-50"
                                    )}
                                >
                                    <Users size={16} />
                                    {t("सबैलाई", "All Members")}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTargetAll(false)}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                                        !targetAll ? "bg-brand-blue text-white border-brand-blue" : "border-slate-200 hover:bg-slate-50"
                                    )}
                                >
                                    {t("छनौट गर्नुहोस्", "Select Roles")}
                                </button>
                            </div>

                            {!targetAll && (
                                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg">
                                    {ROLE_OPTIONS.map(role => (
                                        <button
                                            key={role.value}
                                            type="button"
                                            onClick={() => toggleRole(role.value)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                                                selectedRoles.includes(role.value)
                                                    ? "bg-brand-blue text-white border-brand-blue"
                                                    : "bg-white border-slate-200 hover:border-brand-blue"
                                            )}
                                        >
                                            {selectedRoles.includes(role.value) && <Check size={12} className="inline mr-1" />}
                                            {role.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Error/Success */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                                {success}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={sending}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-red text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                            {sending ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Send size={18} />
                            )}
                            {t("घोषणा पठाउनुहोस्", "Send Announcement")}
                        </button>
                    </form>

                    {/* Past Announcements */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="font-semibold text-slate-800 mb-4">{t("पछिल्ला घोषणाहरू", "Recent Announcements")}</h2>

                        {loadingList ? (
                            <div className="py-8 text-center">
                                <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" />
                            </div>
                        ) : announcements.length === 0 ? (
                            <p className="text-slate-400 text-center py-8">{t("कुनै घोषणा छैन", "No announcements")}</p>
                        ) : (
                            <div className="space-y-3 max-h-[500px] overflow-y-auto">
                                {announcements.map(ann => (
                                    <div key={ann.id} className="p-3 border border-slate-100 rounded-lg">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={cn(
                                                "text-xs font-medium px-2 py-0.5 rounded-full",
                                                ann.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                                    ann.priority === 'important' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-slate-100 text-slate-600'
                                            )}>
                                                {ann.priority}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {formatDistanceToNow(new Date(ann.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <h3 className="font-medium text-slate-800 text-sm">{ann.title}</h3>
                                        <p className="text-xs text-slate-500 line-clamp-2">{ann.body}</p>
                                        {ann.target_roles && (
                                            <p className="text-xs text-slate-400 mt-1">
                                                → {ann.target_roles.join(', ')}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
