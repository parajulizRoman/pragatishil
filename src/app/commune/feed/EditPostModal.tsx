"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Camera, Image, Trash2 } from "lucide-react";
import { DiscussionThread } from "@/types";
import { cn } from "@/lib/utils";

interface EditPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    thread: DiscussionThread;
    onSave: (title: string, content: string) => Promise<void>;
    onDelete: () => Promise<void>;
}

export default function EditPostModal({ isOpen, onClose, thread, onSave, onDelete }: EditPostModalProps) {
    const [title, setTitle] = useState(thread.title);
    const [content, setContent] = useState(thread.first_post_content || "");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        if (!title.trim()) {
            setError("Title is required");
            return;
        }
        setSaving(true);
        setError(null);
        try {
            await onSave(title, content);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        setError(null);
        try {
            await onDelete();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete");
        } finally {
            setDeleting(false);
        }
    };

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

                    {/* Modal */}
                    <motion.div
                        className="fixed inset-x-4 top-[10%] bottom-auto lg:inset-auto lg:top-[10%] lg:left-1/2 lg:-translate-x-1/2 z-50 lg:w-full lg:max-w-lg"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    >
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Edit Post
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {/* Media Preview (if exists) */}
                                {thread.meta?.media_url && (
                                    <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                                        <img
                                            src={thread.meta.media_url}
                                            alt="Post media"
                                            className="w-full max-h-48 object-contain"
                                        />
                                        <div className="absolute top-2 right-2 bg-black/50 rounded-full px-2 py-1 text-xs text-white flex items-center gap-1">
                                            <Image className="w-3 h-3" />
                                            Media cannot be changed
                                        </div>
                                    </div>
                                )}

                                {/* Title Input */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter title..."
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                        maxLength={200}
                                    />
                                </div>

                                {/* Content Input */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Caption
                                    </label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="What's on your mind..."
                                        rows={4}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                                        maxLength={2000}
                                    />
                                    <p className="text-xs text-slate-400 text-right mt-1">
                                        {content.length}/2000
                                    </p>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                                {/* Delete Button */}
                                {!showDeleteConfirm ? (
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="flex items-center gap-2 px-4 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-red-500">Are you sure?</span>
                                        <button
                                            onClick={handleDelete}
                                            disabled={deleting}
                                            className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 disabled:opacity-50"
                                        >
                                            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Delete"}
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}

                                {/* Save Button */}
                                <button
                                    onClick={handleSave}
                                    disabled={saving || !title.trim()}
                                    className={cn(
                                        "px-6 py-2.5 rounded-full font-medium transition-all",
                                        title.trim() && !saving
                                            ? "bg-brand-blue text-white hover:bg-brand-blue/90"
                                            : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                                    )}
                                >
                                    {saving ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
