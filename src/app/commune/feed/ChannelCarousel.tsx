"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Hash, Lock, Users } from "lucide-react";
import Link from "next/link";
import { DiscussionChannel } from "@/types";
import { cn } from "@/lib/utils";

interface ChannelCarouselProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChannelCarousel({ isOpen, onClose }: ChannelCarouselProps) {
    const [channels, setChannels] = useState<DiscussionChannel[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchChannels();
        }
    }, [isOpen]);

    const fetchChannels = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/discussions/channels");
            if (res.ok) {
                const data = await res.json();
                setChannels(data.channels || []);
            }
        } catch (err) {
            console.error("Failed to fetch channels:", err);
        } finally {
            setLoading(false);
        }
    };

    // Group channels by category
    const groupedChannels = channels.reduce((acc, channel) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const categoryName = typeof channel.category === 'object' ? (channel.category as any)?.name : "General";
        const category = categoryName || "General";
        if (!acc[category]) acc[category] = [];
        acc[category].push(channel);
        return acc;
    }, {} as Record<string, DiscussionChannel[]>);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/70 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-slate-900 z-50 shadow-2xl overflow-hidden flex flex-col"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Explore Channels
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                                </div>
                            ) : (
                                Object.entries(groupedChannels).map(([category, categoryChannels]) => (
                                    <div key={category} className="mb-6">
                                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                            {category}
                                        </h3>
                                        <div className="space-y-1">
                                            {categoryChannels.map((channel) => (
                                                <Link
                                                    key={channel.id}
                                                    href={
                                                        channel.slug?.toLowerCase().includes("khulla")
                                                            ? "/commune/khulla-manch"
                                                            : `/commune/${channel.id}`
                                                    }
                                                    onClick={onClose}
                                                    className={cn(
                                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                                                        "hover:bg-slate-100 dark:hover:bg-slate-800",
                                                        "text-slate-700 dark:text-slate-300"
                                                    )}
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-red/20 to-brand-blue/20 flex items-center justify-center">
                                                        {String(channel.visibility) === "private" ? (
                                                            <Lock className="w-4 h-4 text-slate-500" />
                                                        ) : (
                                                            <Hash className="w-4 h-4 text-brand-red" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm truncate">
                                                            {channel.name}
                                                        </p>
                                                        {channel.description && (
                                                            <p className="text-xs text-slate-400 truncate">
                                                                {channel.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {channel.thread_count !== undefined && (
                                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                                            <Users className="w-3 h-3" />
                                                            {channel.thread_count}
                                                        </span>
                                                    )}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
