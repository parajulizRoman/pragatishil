"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, Check, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface Notification {
    id: string;
    type: string;
    title: string;
    body: string | null;
    link: string | null;
    is_read: boolean;
    created_at: string;
    actor: {
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

export default function NotificationsPage() {
    const { t } = useLanguage();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [filter, setFilter] = useState<"all" | "unread">("all");

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`/api/notifications?limit=50&unread=${filter === "unread"}`);
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (e) {
            console.error("Failed to fetch notifications:", e);
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchNotifications();
    }, [filter]);

    const markAllRead = async () => {
        try {
            const res = await fetch("/api/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ all: true })
            });
            if (res.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                setUnreadCount(0);
            }
        } catch (e) {
            console.error("Failed to mark all read:", e);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch("/api/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: [id] })
            });
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (e) {
            console.error("Failed to mark as read:", e);
        }
    };

    const getTypeEmoji = (type: string) => {
        switch (type) {
            case 'mention': return '💬';
            case 'follow': return '👤';
            case 'comment': return '💬';
            case 'like': return '❤️';
            case 'dm': return '✉️';
            case 'new_article': return '📰';
            case 'thread_reply': return '💬';
            default: return '🔔';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
            <div className="container max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-1">
                            {t("सूचनाहरू", "Notifications")}
                        </h1>
                        <p className="text-slate-500">
                            {unreadCount > 0
                                ? t(`${unreadCount} नपढेका`, `${unreadCount} unread`)
                                : t("सबै पढिसकियो", "All caught up")
                            }
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-brand-blue hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Check className="w-4 h-4" />
                            {t("सबै पढ्नुहोस्", "Mark all read")}
                        </button>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setFilter("all")}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            filter === "all"
                                ? "bg-brand-blue text-white"
                                : "bg-white text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        {t("सबै", "All")}
                    </button>
                    <button
                        onClick={() => setFilter("unread")}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            filter === "unread"
                                ? "bg-brand-blue text-white"
                                : "bg-white text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        {t("नपढेका", "Unread")}
                    </button>
                </div>

                {/* Notifications List */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-12 text-center">
                            <Bell className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                            <p className="text-slate-500">
                                {filter === "unread"
                                    ? t("कुनै नपढेका सूचना छैन", "No unread notifications")
                                    : t("अझै कुनै सूचना छैन", "No notifications yet")
                                }
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {notifications.map((notif) => {
                                const avatar = notif.actor?.avatar_url ||
                                    PLACEHOLDERS[notif.id.charCodeAt(0) % PLACEHOLDERS.length];

                                return (
                                    <li
                                        key={notif.id}
                                        className={cn(
                                            "transition-colors",
                                            notif.is_read ? "bg-white" : "bg-blue-50/50"
                                        )}
                                    >
                                        <Link
                                            href={notif.link || "#"}
                                            onClick={() => {
                                                if (!notif.is_read) markAsRead(notif.id);
                                            }}
                                            className="flex items-start gap-4 p-4 hover:bg-slate-50"
                                        >
                                            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0">
                                                {notif.actor ? (
                                                    <Image
                                                        src={avatar}
                                                        alt={notif.actor.full_name || "User"}
                                                        fill
                                                        className="object-cover"
                                                        sizes="48px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xl">
                                                        {getTypeEmoji(notif.type)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-slate-800">
                                                    <span className="font-semibold">{notif.title}</span>
                                                </p>
                                                {notif.body && (
                                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                                        {notif.body}
                                                    </p>
                                                )}
                                                <p className="text-xs text-slate-400 mt-2">
                                                    {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                                                </p>
                                            </div>
                                            {!notif.is_read && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-brand-blue shrink-0 mt-1.5" />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
