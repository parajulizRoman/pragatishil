"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, User, ThumbsUp, ThumbsDown } from "lucide-react";
import { DiscussionThread, DiscussionPost } from "@/types";
import { createBrowserClient } from "@supabase/ssr";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface CommentSheetProps {
    thread: DiscussionThread | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function CommentSheet({ thread, isOpen, onClose }: CommentSheetProps) {
    const { t } = useLanguage();
    const [posts, setPosts] = useState<DiscussionPost[]>([]);
    const [loading, setLoading] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        supabase.auth.getUser().then(({ data }) => {
            setIsAuthenticated(!!data.user);
        });
    }, []);

    useEffect(() => {
        if (isOpen && thread) {
            fetchPosts();
        }
    }, [isOpen, thread?.id]);

    const fetchPosts = async () => {
        if (!thread) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/discussions/posts?thread_id=${thread.id}`);
            if (res.ok) {
                const data = await res.json();
                // Skip first post (it's the thread content)
                setPosts(data.posts.slice(1));
            }
        } catch (err) {
            console.error("Failed to fetch posts:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !thread || submitting) return;

        setSubmitting(true);
        try {
            const res = await fetch("/api/discussions/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    threadId: thread.id,
                    content: newComment,
                }),
            });

            if (res.ok) {
                setNewComment("");
                fetchPosts();
            }
        } catch (err) {
            console.error("Failed to submit comment:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Sheet */}
                    <motion.div
                        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl z-50 max-h-[80vh] flex flex-col"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        {/* Handle */}
                        <div className="flex justify-center py-3">
                            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {t("टिप्पणीहरू", "Comments")} ({posts.length})
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        {/* Comments List */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="text-center py-12 text-slate-500">
                                    <p>{t("अहिलेसम्म कुनै टिप्पणी छैन।", "No comments yet.")}</p>
                                    <p className="text-sm mt-1">{t("पहिलो हुनुहोस्!", "Be the first!")}</p>
                                </div>
                            ) : (
                                posts.map((post) => (
                                    <div key={post.id} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                                            {post.author?.avatar_url ? (
                                                <img
                                                    src={post.author.avatar_url}
                                                    alt=""
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <User className="w-4 h-4 text-slate-500" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm text-slate-900 dark:text-white">
                                                    {post.is_anonymous ? t("बेनामी", "Anonymous") : post.author?.full_name || t("सदस्य", "Member")}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {new Date(post.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                                                {post.content}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-orange-500 transition-colors">
                                                    <ThumbsUp className={cn("w-3.5 h-3.5", post.user_vote === 1 && "fill-current text-orange-500")} />
                                                    <span>{post.upvotes || 0}</span>
                                                </button>
                                                <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-500 transition-colors">
                                                    <ThumbsDown className={cn("w-3.5 h-3.5", post.user_vote === -1 && "fill-current text-blue-500")} />
                                                    <span>{post.downvotes || 0}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Input */}
                        <div className="border-t border-slate-200 dark:border-slate-800 p-4">
                            {isAuthenticated ? (
                                <form onSubmit={handleSubmit} className="flex gap-3">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder={t("टिप्पणी थप्नुहोस्...", "Add a comment...")}
                                        className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newComment.trim() || submitting}
                                        className={cn(
                                            "p-2.5 rounded-full transition-colors",
                                            newComment.trim() && !submitting
                                                ? "bg-brand-blue text-white hover:bg-brand-blue/90"
                                                : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                                        )}
                                    >
                                        {submitting ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Send className="w-5 h-5" />
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <a
                                    href="/auth/login"
                                    className="block text-center py-2.5 px-4 bg-brand-blue text-white rounded-full text-sm font-medium hover:bg-brand-blue/90 transition-colors"
                                >
                                    {t("टिप्पणी गर्न लग इन गर्नुहोस्", "Log in to comment")}
                                </a>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
