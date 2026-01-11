/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    const [carouselIndex, setCarouselIndex] = useState(0);
    const lastTapRef = useRef<number>(0);

    // Check if current user is the author
    const isAuthor = !!(currentUserId && thread.created_by && currentUserId === thread.created_by);

    // Debug logging
    console.log("[SwipeableCard] Author check:", {
        currentUserId,
        threadCreatedBy: thread.created_by,
        isAuthor,
        hasOnEdit: !!onEdit,
        threadId: thread.id
    });

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

    // Get carousel images or single image
    const mediaUrls: string[] = thread.meta?.media_urls || [];
    const imageUrl = mediaUrls.length > 0
        ? mediaUrls[carouselIndex]
        : (thread as any).thumbnail_url ||
        thread.meta?.thumbnail_url ||
        thread.meta?.media_url ||
        thread.meta?.image_url ||
        null;
    const isCarousel = mediaUrls.length > 1;

    // Debug logging
    console.log('[SwipeableCard] Carousel debug:', {
        threadId: thread.id,
        mediaUrls,
        mediaUrlsLength: mediaUrls.length,
        isCarousel,
        carouselIndex,
        currentImageUrl: imageUrl
    });




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
                <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden group">
                    {/* Carousel or Single Image */}
                    <div className="relative w-full h-full flex items-center justify-center">
                        <AnimatePresence initial={false} mode="popLayout">
                            <motion.img
                                key={imageUrl} // Key changes with index causing animation
                                src={imageUrl}
                                alt={thread.title}
                                className={cn(
                                    "max-w-full max-h-full object-contain pointer-events-auto",
                                    isCarousel && "cursor-grab active:cursor-grabbing"
                                )}
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -300, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                drag={isCarousel ? "x" : false}
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.2}
                                onDragStart={(e) => {
                                    console.log('[SwipeableCard] Drag started', { isCarousel });
                                    if (isCarousel) {
                                        e.stopPropagation();
                                    }
                                }}
                                onDragEnd={(_, info) => {
                                    console.log('[SwipeableCard] Drag ended', {
                                        isCarousel,
                                        offsetX: info.offset.x,
                                        carouselIndex,
                                        mediaUrlsLength: mediaUrls.length
                                    });
                                    if (!isCarousel) return;
                                    const swipeThreshold = 50;
                                    if (info.offset.x > swipeThreshold && carouselIndex > 0) {
                                        console.log('[SwipeableCard] Swiping to previous');
                                        setCarouselIndex(prev => prev - 1);
                                    } else if (info.offset.x < -swipeThreshold && carouselIndex < mediaUrls.length - 1) {
                                        console.log('[SwipeableCard] Swiping to next');
                                        setCarouselIndex(prev => prev + 1);
                                    }
                                }}
                            />
                        </AnimatePresence>
                    </div>

                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />

                    {/* Navigation Arrows for Desktop */}
                    {isCarousel && (
                        <>
                            {carouselIndex > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCarouselIndex(prev => prev - 1);
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 pointer-events-auto"
                                    aria-label="Previous image"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            )}
                            {carouselIndex < mediaUrls.length - 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCarouselIndex(prev => prev + 1);
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 pointer-events-auto"
                                    aria-label="Next image"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            )}
                        </>
                    )}
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
                {/* Carousel Dot Indicators */}
                {isCarousel && (
                    <div className="flex justify-center gap-1.5 mb-3 pointer-events-auto">
                        {mediaUrls.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); setCarouselIndex(idx); }}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all",
                                    idx === carouselIndex ? "bg-white w-4" : "bg-white/50"
                                )}
                            />
                        ))}
                    </div>
                )}

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

                {/* Title / Caption - Clickable to open comments */}
                <h2
                    onClick={(e) => {
                        e.stopPropagation();
                        onComment();
                    }}
                    className="text-white text-2xl md:text-3xl font-bold leading-tight mb-3 drop-shadow-lg cursor-pointer hover:text-white/90 transition-colors pointer-events-auto"
                >
                    {thread.title}
                </h2>

                {/* Content Preview - Clickable to open comments */}
                {thread.first_post_content && (
                    <p
                        onClick={(e) => {
                            e.stopPropagation();
                            onComment();
                        }}
                        className="text-white/80 text-sm md:text-base line-clamp-3 leading-relaxed cursor-pointer hover:text-white/90 transition-colors pointer-events-auto"
                    >
                        {thread.first_post_content}
                    </p>
                )}
            </div>

            {/* Action Buttons - Right Side */}
            <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-20">
                {/* Edit Button - Only for Author */}
                {isAuthor && onEdit && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        className="flex flex-col items-center gap-1 group"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all">
                            <Edit2 className="w-6 h-6" />
                        </div>
                        <span className="text-white text-xs font-medium">Edit</span>
                    </button>
                )}

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

            {/* Progress Indicator */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center gap-2">
                <div className="flex-1 flex gap-1">
                    <div className="flex-1 h-1 rounded-full bg-white/30">
                        <div className="h-full w-full bg-white rounded-full" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
