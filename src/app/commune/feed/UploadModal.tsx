"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Upload,
    Image as ImageIcon,
    Video,
    Music,
    Loader2,
    Play,
    Pause,
    Trash2
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { cn } from "@/lib/utils";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    channelId: string;
    onSuccess?: () => void;
}

type MediaType = "video" | "photo" | "audio";

interface MediaPreview {
    type: MediaType;
    file: File;
    previewUrl: string;
}

export default function UploadModal({ isOpen, onClose, channelId, onSuccess }: UploadModalProps) {
    const [mediaType, setMediaType] = useState<MediaType>("photo");
    const [media, setMedia] = useState<MediaPreview | null>(null);
    const [caption, setCaption] = useState("");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [audioPlaying, setAudioPlaying] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // File type constraints
    const acceptTypes: Record<MediaType, string> = {
        video: "video/mp4,video/webm,video/quicktime",
        photo: "image/jpeg,image/png,image/webp,image/gif",
        audio: "audio/mpeg,audio/mp3,audio/wav,audio/ogg",
    };

    const maxSizes: Record<MediaType, number> = {
        video: 100 * 1024 * 1024, // 100MB
        photo: 10 * 1024 * 1024,  // 10MB
        audio: 20 * 1024 * 1024,  // 20MB
    };

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size
        if (file.size > maxSizes[mediaType]) {
            setError(`File too large. Maximum size: ${maxSizes[mediaType] / (1024 * 1024)}MB`);
            return;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setMedia({ type: mediaType, file, previewUrl });
        setError(null);
    }, [mediaType]);

    const handleRemoveMedia = () => {
        if (media) {
            URL.revokeObjectURL(media.previewUrl);
            setMedia(null);
        }
    };

    const handleUpload = async () => {
        if (!media || !caption.trim()) {
            setError("Please add media and a caption");
            return;
        }

        setUploading(true);
        setError(null);

        try {
            // Step 1: Get signed upload URL from existing API
            const signRes = await fetch('/api/discussions/attachments/sign-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: media.file.name,
                    fileType: media.file.type,
                    sizeBytes: media.file.size
                })
            });

            if (!signRes.ok) {
                const errData = await signRes.json();
                throw new Error(errData.error || "Failed to get upload URL");
            }

            const { uploadUrl, storagePath } = await signRes.json();

            // Step 2: Upload file directly to Supabase Storage using signed URL
            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': media.file.type,
                },
                body: media.file
            });

            if (!uploadRes.ok) {
                throw new Error("Failed to upload file to storage");
            }

            // Step 3: Get the public URL for the uploaded file
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const { data: { publicUrl } } = supabase.storage
                .from('commune-uploads')
                .getPublicUrl(storagePath);

            // Step 4: Create thread via existing API with attachment metadata
            const threadRes = await fetch('/api/discussions/threads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    channelId: channelId,
                    title: caption.slice(0, 100),
                    content: caption,
                    meta: {
                        media_type: media.type,
                        media_url: publicUrl,
                        storage_path: storagePath,
                        thumbnail_url: media.type === "photo" ? publicUrl : undefined,
                    }
                })
            });

            if (!threadRes.ok) {
                const errData = await threadRes.json();
                throw new Error(errData.error || "Failed to create post");
            }

            // Success!
            handleRemoveMedia();
            setCaption("");
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error("Upload failed:", err);
            setError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const toggleAudio = () => {
        if (audioRef.current) {
            if (audioPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setAudioPlaying(!audioPlaying);
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
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden w-full max-h-[85vh] flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Create Post
                                </h2>
                                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Media Type Selector */}
                            <div className="flex p-4 gap-2 border-b border-slate-100 dark:border-slate-800">
                                {[
                                    { type: "photo" as MediaType, icon: ImageIcon, label: "Photo" },
                                    { type: "video" as MediaType, icon: Video, label: "Video" },
                                    { type: "audio" as MediaType, icon: Music, label: "Audio" },
                                ].map(({ type, icon: Icon, label }) => (
                                    <button
                                        key={type}
                                        onClick={() => {
                                            setMediaType(type);
                                            handleRemoveMedia();
                                        }}
                                        className={cn(
                                            "flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all",
                                            mediaType === type
                                                ? "bg-brand-red text-white"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="text-xs font-medium">{label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto">
                                {/* Upload Area */}
                                <div className="p-4">
                                    {!media ? (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-brand-red hover:bg-red-50/50 transition-all"
                                        >
                                            <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                                            <p className="text-slate-600 dark:text-slate-400 font-medium">
                                                Click to upload {mediaType}
                                            </p>
                                            <p className="text-sm text-slate-400 mt-1">
                                                Max {maxSizes[mediaType] / (1024 * 1024)}MB
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="relative rounded-xl overflow-hidden bg-black">
                                            {/* Photo Preview */}
                                            {media.type === "photo" && (
                                                <img
                                                    src={media.previewUrl}
                                                    alt="Preview"
                                                    className="w-full h-48 object-cover"
                                                />
                                            )}

                                            {/* Video Preview */}
                                            {media.type === "video" && (
                                                <video
                                                    ref={videoRef}
                                                    src={media.previewUrl}
                                                    className="w-full h-48 object-cover"
                                                    controls
                                                    muted
                                                />
                                            )}

                                            {/* Audio Preview */}
                                            {media.type === "audio" && (
                                                <div className="h-36 flex flex-col items-center justify-center bg-gradient-to-br from-brand-red to-brand-blue">
                                                    <button
                                                        onClick={toggleAudio}
                                                        className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all"
                                                    >
                                                        {audioPlaying ? (
                                                            <Pause className="w-8 h-8" />
                                                        ) : (
                                                            <Play className="w-8 h-8 ml-1" />
                                                        )}
                                                    </button>
                                                    <p className="text-white/80 text-sm mt-3">
                                                        {media.file.name}
                                                    </p>
                                                    <audio
                                                        ref={audioRef}
                                                        src={media.previewUrl}
                                                        onEnded={() => setAudioPlaying(false)}
                                                    />
                                                </div>
                                            )}

                                            {/* Remove Button */}
                                            <button
                                                onClick={handleRemoveMedia}
                                                className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept={acceptTypes[mediaType]}
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </div>

                                {/* Caption */}
                                <div className="px-4 pb-4">
                                    <textarea
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        placeholder="Write a caption..."
                                        className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-red/50 bg-white dark:bg-slate-800"
                                        rows={3}
                                        maxLength={500}
                                    />
                                    <p className="text-xs text-slate-400 mt-1 text-right">
                                        {caption.length}/500
                                    </p>
                                </div>
                            </div> {/* End Scrollable Content */}

                            {/* Error */}
                            {error && (
                                <div className="px-4 pb-4">
                                    <p className="text-red-500 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-full font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading || !media || !caption.trim()}
                                    className={cn(
                                        "px-6 py-2.5 rounded-full font-medium transition-all flex items-center gap-2",
                                        uploading || !media || !caption.trim()
                                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                            : "bg-brand-red text-white hover:bg-red-600"
                                    )}
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        "Post"
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
