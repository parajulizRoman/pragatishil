"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

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

interface NotificationBellProps {
    className?: string;
}

const PLACEHOLDERS = [
    "/placeholders/eye-red.svg",
    "/placeholders/eye-blue.svg",
];

export default function NotificationBell({ className }: NotificationBellProps) {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Fetch notifications
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/notifications?limit=10");
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

    // Fetch on mount and periodically
    useEffect(() => {
        fetchNotifications();

        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Mark all as read
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

    // Mark single as read
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

    // Get icon based on notification type
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'mention': return '@';
            case 'follow': return '👤';
            case 'comment': return '💬';
            case 'like': return '❤️';
            default: return '🔔';
        }
    };

    return (
        <div className={cn("relative", className)}>
            <button
                ref={buttonRef}
                onClick={() => setOpen(!open)}
                className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5 text-slate-600" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-red text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-semibold text-slate-800">Notifications</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs text-brand-blue hover:underline flex items-center gap-1"
                                >
                                    <Check className="w-3 h-3" />
                                    Mark all read
                                </button>
                            )}
                            <button
                                onClick={() => setOpen(false)}
                                className="p-1 hover:bg-slate-200 rounded"
                            >
                                <X className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-96 overflow-y-auto">
                        {loading && notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                Loading...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <Bell className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                                No notifications yet
                            </div>
                        ) : (
                            <ul>
                                {notifications.map((notif) => {
                                    const avatar = notif.actor?.avatar_url ||
                                        PLACEHOLDERS[notif.id.charCodeAt(0) % PLACEHOLDERS.length];

                                    return (
                                        <li
                                            key={notif.id}
                                            className={cn(
                                                "border-b border-slate-50 last:border-0 transition-colors",
                                                notif.is_read ? "bg-white" : "bg-blue-50/50"
                                            )}
                                        >
                                            <Link
                                                href={notif.link || "#"}
                                                onClick={() => {
                                                    if (!notif.is_read) markAsRead(notif.id);
                                                    setOpen(false);
                                                }}
                                                className="flex items-start gap-3 p-4 hover:bg-slate-50"
                                            >
                                                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0">
                                                    {notif.actor ? (
                                                        <Image
                                                            src={avatar}
                                                            alt={notif.actor.full_name || "User"}
                                                            fill
                                                            className="object-cover"
                                                            sizes="40px"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-lg">
                                                            {getTypeIcon(notif.type)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-slate-800">
                                                        <span className="font-semibold">
                                                            {notif.title}
                                                        </span>
                                                    </p>
                                                    {notif.body && (
                                                        <p className="text-xs text-slate-500 truncate mt-0.5">
                                                            {notif.body}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-slate-400 mt-1">
                                                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                                                    </p>
                                                </div>
                                                {!notif.is_read && (
                                                    <span className="w-2 h-2 rounded-full bg-brand-blue shrink-0 mt-2" />
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <Link
                            href="/notifications"
                            onClick={() => setOpen(false)}
                            className="block text-center py-3 text-sm text-brand-blue hover:bg-slate-50 border-t border-slate-100 font-medium"
                        >
                            View All Notifications
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
