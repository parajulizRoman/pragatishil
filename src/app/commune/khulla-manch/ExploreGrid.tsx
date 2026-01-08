"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Heart, MessageCircle, Play, Image as ImageIcon } from "lucide-react";
import { DiscussionThread } from "@/types";

interface ExploreGridProps {
    channelId: string;
    threads?: DiscussionThread[];
    onSelectPost: (index: number) => void;
}

export default function ExploreGrid({ channelId, threads: initialThreads, onSelectPost }: ExploreGridProps) {
    const [threads, setThreads] = useState<DiscussionThread[]>(initialThreads || []);
    const [loading, setLoading] = useState(!initialThreads);

    useEffect(() => {
        if (!initialThreads) {
            fetchThreads();
        }
    }, [channelId, initialThreads]);

    const fetchThreads = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/discussions/threads?channel_id=${channelId}&limit=50`);
            if (res.ok) {
                const data = await res.json();
                setThreads(data.threads || []);
            }
        } catch (err) {
            console.error("Failed to fetch threads:", err);
        } finally {
            setLoading(false);
        }
    };

    // Get thumbnail URL for a thread
    const getThumbnail = (thread: DiscussionThread): string | null => {
        return (
            (thread as any).thumbnail_url ||
            thread.meta?.thumbnail_url ||
            thread.meta?.media_url ||
            thread.meta?.image_url ||
            null
        );
    };

    // Check if thread has video
    const isVideo = (thread: DiscussionThread): boolean => {
        return thread.meta?.media_type === "video";
    };

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-white/50" />
            </div>
        );
    }

    if (threads.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                <ImageIcon className="w-16 h-16 text-white/30 mb-4" />
                <p className="text-lg font-medium text-white/60">No posts yet</p>
                <p className="text-sm text-white/40">Be the first to share something!</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-y-auto bg-black p-1">
            <div className="grid grid-cols-3 gap-1">
                {threads.map((thread, index) => {
                    const thumbnail = getThumbnail(thread);
                    const hasVideo = isVideo(thread);

                    return (
                        <motion.div
                            key={thread.id}
                            className="relative aspect-square cursor-pointer group overflow-hidden bg-slate-900"
                            onClick={() => onSelectPost(index)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Thumbnail */}
                            {thumbnail ? (
                                <img
                                    src={thumbnail}
                                    alt={thread.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-red/20 to-brand-blue/20">
                                    <img
                                        src="/favicon.png"
                                        alt="Pragatishil"
                                        className="w-12 h-12 opacity-50"
                                    />
                                </div>
                            )}

                            {/* Video Indicator */}
                            {hasVideo && (
                                <div className="absolute top-2 right-2">
                                    <Play className="w-5 h-5 text-white drop-shadow-lg fill-current" />
                                </div>
                            )}

                            {/* Hover Overlay with Stats */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <div className="flex items-center gap-1 text-white">
                                    <Heart className="w-5 h-5 fill-current" />
                                    <span className="font-semibold text-sm">
                                        {(thread.upvotes || 0) - (thread.downvotes || 0)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-white">
                                    <MessageCircle className="w-5 h-5 fill-current" />
                                    <span className="font-semibold text-sm">
                                        {thread.reply_count || 0}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
