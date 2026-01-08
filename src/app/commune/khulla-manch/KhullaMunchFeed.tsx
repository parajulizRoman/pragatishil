/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useRouter } from "next/navigation";
import { DiscussionThread } from "@/types";
import { createBrowserClient } from "@supabase/ssr";
import { votePost, updateContent, deleteContent } from "@/app/commune/actions";
import SwipeableCard from "./SwipeableCard";
import CommentSheet from "./CommentSheet";
import EditPostModal from "@/app/commune/feed/EditPostModal";
import { Loader2 } from "lucide-react";

interface KhullaMunchFeedProps {
    initialThreads: DiscussionThread[];
    channelId: string;
    isAuthenticated?: boolean;
    onAuthRequired?: () => void;
    initialIndex?: number;
}

export default function KhullaMunchFeed({
    initialThreads,
    channelId,
    isAuthenticated: authProp,
    onAuthRequired,
    initialIndex = 0
}: KhullaMunchFeedProps) {
    const router = useRouter();
    const [threads, setThreads] = useState<DiscussionThread[]>(initialThreads);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string>("guest");
    const [commentThread, setCommentThread] = useState<DiscussionThread | null>(null);
    const [editThread, setEditThread] = useState<DiscussionThread | null>(null);
    const [savedThreads, setSavedThreads] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Auth check
    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        supabase.auth.getUser().then(async ({ data }) => {
            setIsAuthenticated(!!data.user);
            if (data.user) {
                setCurrentUserId(data.user.id);
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", data.user.id)
                    .single();
                setUserRole(profile?.role || "guest");
            }
        });
    }, []);

    // Load more threads when near end
    const loadMoreThreads = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const lastThread = threads[threads.length - 1];
            const res = await fetch(
                `/api/discussions/threads?channel_id=${channelId}&before=${lastThread?.created_at || ""}&limit=10`
            );
            if (res.ok) {
                const data = await res.json();
                if (data.threads.length === 0) {
                    setHasMore(false);
                } else {
                    setThreads((prev) => [...prev, ...data.threads]);
                }
            }
        } catch (err) {
            console.error("Failed to load more threads:", err);
        } finally {
            setLoading(false);
        }
    }, [channelId, threads, loading, hasMore]);

    // Preload when 3 cards from end
    useEffect(() => {
        if (currentIndex >= threads.length - 3 && hasMore && !loading) {
            loadMoreThreads();
        }
    }, [currentIndex, threads.length, hasMore, loading, loadMoreThreads]);

    // Swipe handlers
    const handleDragEnd = useCallback(
        (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
            const threshold = 100;
            const velocity = 500;

            if (info.offset.y < -threshold || info.velocity.y < -velocity) {
                // Swiped up - next card
                if (currentIndex < threads.length - 1) {
                    setCurrentIndex((prev) => prev + 1);
                }
            } else if (info.offset.y > threshold || info.velocity.y > velocity) {
                // Swiped down - previous card
                if (currentIndex > 0) {
                    setCurrentIndex((prev) => prev - 1);
                }
            }
        },
        [currentIndex, threads.length]
    );

    // Like handler
    const handleLike = useCallback(
        async (threadIndex: number) => {
            const thread = threads[threadIndex];
            if (!thread) return;

            if (!isAuthenticated && !authProp) {
                if (onAuthRequired) {
                    onAuthRequired();
                    return;
                }
                router.push("/auth/login?redirect=" + encodeURIComponent(window.location.pathname));
                return;
            }

            const canVote = [
                "party_member",
                "volunteer",
                "team_member",
                "central_committee",
                "board",
                "admin_party",
                "yantrik",
                "admin",
            ].includes(userRole);

            if (!canVote) {
                alert("You must be a party member to like posts.");
                return;
            }

            // Check if first_post_id exists
            if (!thread.first_post_id) {
                console.error("[handleLike] Missing first_post_id for thread:", thread.id);
                alert("Cannot vote on this post. Please try refreshing the page.");
                return;
            }

            // Store original state for rollback
            const originalVote = thread.user_vote || 0;
            const originalUpvotes = thread.upvotes || 0;
            const newVote = originalVote === 1 ? 0 : 1;
            const newUpvotes = originalVote === 1 ? originalUpvotes - 1 : originalUpvotes + 1;

            // Optimistic update
            setThreads((prev) =>
                prev.map((t, i) => {
                    if (i !== threadIndex) return t;
                    return { ...t, upvotes: newUpvotes, user_vote: newVote };
                })
            );

            try {
                console.log("[handleLike] Voting on post:", thread.first_post_id, "voteType:", 1);
                const result = await votePost(thread.first_post_id, 1);
                console.log("[handleLike] Vote result:", result);
            } catch (err) {
                console.error("[handleLike] Vote failed, rolling back:", err);
                // Rollback on error
                setThreads((prev) =>
                    prev.map((t, i) => {
                        if (i !== threadIndex) return t;
                        return { ...t, upvotes: originalUpvotes, user_vote: originalVote };
                    })
                );
                alert("Failed to save your vote. Please try again.");
            }
        },
        [isAuthenticated, authProp, userRole, router, threads, onAuthRequired]
    );

    // Save handler
    const handleSave = useCallback(
        async (threadId: string) => {
            if (!isAuthenticated && !authProp) {
                if (onAuthRequired) {
                    onAuthRequired();
                    return;
                }
                router.push("/auth/login?redirect=" + encodeURIComponent(window.location.pathname));
                return;
            }

            setSavedThreads((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(threadId)) {
                    newSet.delete(threadId);
                } else {
                    newSet.add(threadId);
                }
                return newSet;
            });

            // TODO: Persist to API
        },
        [isAuthenticated, router]
    );

    // Share handler
    const handleShare = useCallback((thread: DiscussionThread) => {
        if (navigator.share) {
            navigator.share({
                title: thread.title,
                url: `${window.location.origin}/commune/thread/${thread.id}`,
            });
        } else {
            navigator.clipboard.writeText(`${window.location.origin}/commune/thread/${thread.id}`);
            alert("Link copied to clipboard!");
        }
    }, []);

    // Edit save handler
    const handleEditSave = useCallback(async (title: string, content: string) => {
        if (!editThread) return;

        // Update thread title
        await updateContent(editThread.id, 'thread', title);

        // Update first post content if it exists
        if (editThread.first_post_id && content) {
            await updateContent(editThread.first_post_id, 'post', content);
        }

        // Update local state
        setThreads(prev => prev.map(t =>
            t.id === editThread.id
                ? { ...t, title, first_post_content: content }
                : t
        ));
    }, [editThread]);

    // Edit delete handler
    const handleEditDelete = useCallback(async () => {
        if (!editThread) return;

        await deleteContent(editThread.id, 'thread');

        // Remove from local state
        setThreads(prev => prev.filter(t => t.id !== editThread.id));

        // Adjust current index if needed
        if (currentIndex >= threads.length - 1 && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    }, [editThread, currentIndex, threads.length]);

    if (threads.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                    <p className="text-xl font-semibold">No posts yet</p>
                    <p className="text-white/60 mt-2">Be the first to share something!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-hidden">
            {/* Cards Container */}
            <motion.div
                className="relative w-full h-full"
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
            >
                <AnimatePresence mode="popLayout">
                    {threads.map((thread, index) => {
                        const offset = index - currentIndex;
                        // Only render current and adjacent cards
                        if (Math.abs(offset) > 1) return null;

                        return (
                            <motion.div
                                key={thread.id}
                                className="absolute inset-0"
                                initial={{ y: offset * 100 + "%", opacity: 0 }}
                                animate={{
                                    y: offset * 100 + "%",
                                    opacity: offset === 0 ? 1 : 0.5,
                                    scale: offset === 0 ? 1 : 0.95,
                                }}
                                exit={{ y: offset * 100 + "%", opacity: 0 }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            >
                                <SwipeableCard
                                    thread={thread}
                                    isActive={index === currentIndex}
                                    isLiked={(thread.user_vote || 0) === 1}
                                    isSaved={savedThreads.has(thread.id)}
                                    currentUserId={currentUserId}
                                    onLike={() => handleLike(index)}
                                    onSave={() => handleSave(thread.id)}
                                    onComment={() => setCommentThread(thread)}
                                    onShare={() => handleShare(thread)}
                                    onEdit={() => setEditThread(thread)}
                                />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>

            {/* Loading indicator */}
            {loading && (
                <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span className="text-white text-sm">Loading more...</span>
                    </div>
                </div>
            )}

            {/* Card counter */}
            <div className="absolute top-6 right-6 z-30 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-sm font-medium">
                    {currentIndex + 1} / {threads.length}
                </span>
            </div>

            {/* Comment Sheet */}
            <CommentSheet
                thread={commentThread}
                isOpen={!!commentThread}
                onClose={() => setCommentThread(null)}
            />

            {/* Edit Post Modal */}
            {editThread && (
                <EditPostModal
                    isOpen={!!editThread}
                    onClose={() => setEditThread(null)}
                    thread={editThread}
                    onSave={handleEditSave}
                    onDelete={handleEditDelete}
                />
            )}
        </div>
    );
}
