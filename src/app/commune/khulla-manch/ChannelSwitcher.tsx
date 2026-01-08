"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Hash, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DiscussionChannel } from "@/types";
import { createBrowserClient } from "@supabase/ssr";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function ChannelSwitcher() {
    const pathname = usePathname();
    const { language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [channels, setChannels] = useState<DiscussionChannel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChannels = async () => {
            setLoading(true);
            try {
                const supabase = createBrowserClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                );

                // Get user's accessible channels
                const { data: user } = await supabase.auth.getUser();

                const res = await fetch("/api/discussions/channels");
                if (res.ok) {
                    const data = await res.json();
                    // Filter to only show accessible channels
                    const accessibleChannels = data.channels.filter(
                        (c: DiscussionChannel) =>
                            c.visibility === "public" ||
                            (user?.user && c.visibility === "logged_in")
                    );
                    setChannels(accessibleChannels);
                }
            } catch (err) {
                console.error("Failed to fetch channels:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchChannels();
    }, []);

    // Group channels by category
    const groupedChannels = channels.reduce((acc, channel) => {
        const category = channel.category || "General";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(channel);
        return acc;
    }, {} as Record<string, DiscussionChannel[]>);

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-6 left-6 z-40 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
                <Menu className="w-6 h-6" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-black/60 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Sidebar */}
                        <motion.div
                            className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-slate-900 z-50 flex flex-col shadow-2xl"
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Channels
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            {/* Channel List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                {loading ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div
                                                key={i}
                                                className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    Object.entries(groupedChannels).map(([category, chans]) => (
                                        <div key={category}>
                                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
                                                {category}
                                            </h3>
                                            <div className="space-y-1">
                                                {chans.map((channel) => {
                                                    const isActive =
                                                        pathname.includes(channel.id) ||
                                                        pathname.includes(channel.slug);
                                                    const isKhullaMunch = channel.name
                                                        .toLowerCase()
                                                        .includes("khulla");

                                                    return (
                                                        <Link
                                                            key={channel.id}
                                                            href={
                                                                isKhullaMunch
                                                                    ? "/commune/khulla-manch"
                                                                    : `/commune/${channel.slug || channel.id}`
                                                            }
                                                            onClick={() => setIsOpen(false)}
                                                            className={cn(
                                                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                                                                isActive
                                                                    ? "bg-brand-blue text-white"
                                                                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                            )}
                                                        >
                                                            <div
                                                                className={cn(
                                                                    "w-8 h-8 rounded-lg flex items-center justify-center text-lg",
                                                                    isActive
                                                                        ? "bg-white/20"
                                                                        : "bg-slate-100 dark:bg-slate-800"
                                                                )}
                                                            >
                                                                {channel.icon_emoji || (
                                                                    <Hash
                                                                        className={cn(
                                                                            "w-4 h-4",
                                                                            isActive
                                                                                ? "text-white"
                                                                                : "text-slate-400"
                                                                        )}
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p
                                                                    className={cn(
                                                                        "font-medium truncate",
                                                                        isActive
                                                                            ? "text-white"
                                                                            : "text-slate-900 dark:text-white"
                                                                    )}
                                                                >
                                                                    {language === "ne" && channel.name_ne
                                                                        ? channel.name_ne
                                                                        : channel.name}
                                                                </p>
                                                                {channel.thread_count !== undefined && (
                                                                    <p
                                                                        className={cn(
                                                                            "text-xs",
                                                                            isActive
                                                                                ? "text-white/70"
                                                                                : "text-slate-500"
                                                                        )}
                                                                    >
                                                                        {channel.thread_count} threads
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <ChevronRight
                                                                className={cn(
                                                                    "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity",
                                                                    isActive
                                                                        ? "text-white"
                                                                        : "text-slate-400"
                                                                )}
                                                            />
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                                <Link
                                    href="/commune"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                                >
                                    View All Channels
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
