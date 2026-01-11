/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Bookmark, Share2, User, Edit2 } from "lucide-react";
import { DiscussionThread } from "@/types";
import HeartAnimation from "./HeartAnimation";
import { cn } from "@/lib/utils";

interface SwipeableCardProps {
    thread: DiscussionThread;
    isActive: boolean;
    isLiked: boolean;
    isSaved: boolean;
    currentUserId?: string | null;
    onLike: () => void;
    onSave: () => void;
    onComment: () => void;
    onShare: () => void;
    onEdit?: () => void;
}

export default function SwipeableCard({
    thread,
    isActive,
    isLiked,
    isSaved,
    currentUserId,
    onLike,
    onSave,
    onComment,
    onShare,
    onEdit,
}: SwipeableCardProps) {
    const [showHeartAnimation, setShowHeartAnimation] = useState(false);

    const lastTapRef = useRef<number>(0);

    // Check if current user is the author
    const isAuthor = currentUserId && thread.created_by === currentUserId;

    // Double-tap detection for like only
    const handleTap = useCallback(() => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;

        if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
            // Double tap detected - trigger like with heart animation
            setShowHeartAnimation(true);
            if (!isLiked) {
                onLike();
            }
        }
        // Single tap does nothing - use comment button instead
        lastTapRef.current = now;
    }, [isLiked, onLike]);

    // Get thumbnail or first attachment image - check multiple possible fields
    const imageUrl = (thread as any).thumbnail_url ||
        thread.meta?.thumbnail_url ||
        thread.meta?.media_url ||
        thread.meta?.image_url ||
        null;

    // Check if this is a media post (photo/video/audio)
    // Check if this is a media post (photo/video/audio)

    // Get author info
    const authorName = thread.is_anonymous
        ? "Anonymous"
        : thread.author?.full_name || "Member";
    const authorAvatar = thread.is_anonymous
        ? null
        : thread.author?.avatar_url;

    return (
        <motion.div
            className={cn(
                "absolute inset-0 w-full h-full overflow-hidden",
                "bg-gradient-to-b from-slate-900 to-black"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0.3 }}
            transition={{ duration: 0.2 }}
        >
            {/* Background/Media */}
            {imageUrl ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <img
                        src={imageUrl}
                        alt={thread.title}
                        className="max-w-full max-h-full object-contain"
                    />
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />
                </div>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center">
                    <img src="/favicon.png" alt="Logo" className="w-24 h-24 opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
                </div>
            )}

            {/* Tap Area */}
            <div
                className="absolute inset-0 z-10"
                onClick={handleTap}
            />

            {/* Heart Animation */}
            <HeartAnimation
                show={showHeartAnimation}
                onComplete={() => setShowHeartAnimation(false)}
            />

            {/* Content Overlay - Bottom */}
            <div className="absolute bottom-0 left-0 right-16 p-6 z-20 pointer-events-none">
                {/* Author Info */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-2 border-white/50">
                        {authorAvatar ? (
                            <img
                                src={authorAvatar}
                                alt={authorName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-5 h-5 text-white" />
                        )}
                    </div>
                    <div>
                        <p className="text-white font-semibold text-sm">{authorName}</p>
                        <p className="text-white/60 text-xs">
                            {new Date(thread.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Title / Caption */}
                <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight mb-3 drop-shadow-lg">
                    {thread.title}
                </h2>

                {/* Content Preview */}
                {thread.first_post_content && (
                    <p className="text-white/80 text-sm md:text-base line-clamp-3 leading-relaxed">
                        {thread.first_post_content}
                    </p>
                )}
            </div>

            {/* Action Buttons - Right Side */}
            <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-20">
                {/* Like Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onLike();
                    }}
                    className="flex flex-col items-center gap-1 group"
                >
                    <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                        isLiked
                            ? "bg-red-500 text-white"
                            : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                    )}>
                        <Heart className={cn("w-6 h-6", isLiked && "fill-current")} />
                    </div>
                    <span className="text-white text-xs font-medium">
                        {(thread.upvotes || 0) - (thread.downvotes || 0)}
                    </span>
                </button>

                {/* Comment Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onComment();
                    }}
                    className="flex flex-col items-center gap-1 group"
                >
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all">
                        <MessageCircle className="w-6 h-6" />
                    </div>
                    <span className="text-white text-xs font-medium">
                        {thread.reply_count || 0}
                    </span>
                </button>

                {/* Save Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onSave();
                    }}
                    className="flex flex-col items-center gap-1 group"
                >
                    <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                        isSaved
                            ? "bg-yellow-500 text-white"
                            : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                    )}>
                        <Bookmark className={cn("w-6 h-6", isSaved && "fill-current")} />
                    </div>
                </button>

                {/* Share Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onShare();
                    }}
                    className="flex flex-col items-center gap-1 group"
                >
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all">
                        <Share2 className="w-6 h-6" />
                    </div>
                </button>
            </div>

            {/* Progress Indicator & Author Actions */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center gap-2">
                <div className="flex-1 flex gap-1">
                    <div className="flex-1 h-1 rounded-full bg-white/30">
                        <div className="h-full w-full bg-white rounded-full" />
                    </div>
                </div>

                {/* Author Edit Button */}
                {isAuthor && onEdit && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                    >
                        <Edit2 className="w-4 h-4 text-white" />
                    </button>
                )}
            </div>
        </motion.div>
    );
}
