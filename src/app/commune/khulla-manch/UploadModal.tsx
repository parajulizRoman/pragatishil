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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess?: (newThread: any) => void;
}

type MediaType = "video" | "photo" | "audio";

interface MediaPreview {
    type: MediaType;
    file: File;
    previewUrl: string;
}

const MAX_CAROUSEL_PHOTOS = 10;

export default function UploadModal({ isOpen, onClose, channelId, onSuccess }: UploadModalProps) {
    const [mediaType, setMediaType] = useState<MediaType>("photo");
    const [media, setMedia] = useState<MediaPreview | null>(null);
    const [photos, setPhotos] = useState<MediaPreview[]>([]); // For carousel
    const [carouselIndex, setCarouselIndex] = useState(0);
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
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // For photos, support multiple files
        if (mediaType === "photo") {
            const validFiles: MediaPreview[] = [];
            const totalPhotos = photos.length + files.length;

            if (totalPhotos > MAX_CAROUSEL_PHOTOS) {
                setError(`Maximum ${MAX_CAROUSEL_PHOTOS} photos allowed`);
                return;
            }

            for (const file of files) {
                if (file.size > maxSizes.photo) {
                    setError(`${file.name} is too large. Maximum: 10MB per photo`);
                    continue;
                }
                const previewUrl = URL.createObjectURL(file);
                validFiles.push({ type: "photo", file, previewUrl });
            }

            if (validFiles.length > 0) {
                setPhotos(prev => [...prev, ...validFiles]);
                setCarouselIndex(photos.length); // Go to first new photo
                setError(null);
            }
        } else {
            // Single file for video/audio
            const file = files[0];
            if (file.size > maxSizes[mediaType]) {
                setError(`File too large. Maximum size: ${maxSizes[mediaType] / (1024 * 1024)}MB`);
                return;
            }
            const previewUrl = URL.createObjectURL(file);
            setMedia({ type: mediaType, file, previewUrl });
            setError(null);
        }

        // Reset input so same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [mediaType, photos.length]);

    const handleRemoveMedia = () => {
        if (media) {
            URL.revokeObjectURL(media.previewUrl);
            setMedia(null);
        }
    };

    const handleRemovePhoto = (index: number) => {
        setPhotos(prev => {
            const newPhotos = [...prev];
            URL.revokeObjectURL(newPhotos[index].previewUrl);
            newPhotos.splice(index, 1);
            return newPhotos;
        });
        if (carouselIndex >= photos.length - 1 && carouselIndex > 0) {
            setCarouselIndex(carouselIndex - 1);
        }
    };

    const clearAllMedia = () => {
        if (media) {
            URL.revokeObjectURL(media.previewUrl);
            setMedia(null);
        }
        photos.forEach(p => URL.revokeObjectURL(p.previewUrl));
        setPhotos([]);
        setCarouselIndex(0);
    };

    const handleUpload = async () => {
        const hasMedia = mediaType === "photo" ? photos.length > 0 : !!media;

        if (!hasMedia || !caption.trim()) {
            setError("Please add media and a caption");
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let metaData: any = {};

            if (mediaType === "photo" && photos.length > 0) {
                // Upload all photos for carousel
                const uploadedUrls: string[] = [];

                for (const photo of photos) {
                    // Get signed URL
                    const signRes = await fetch('/api/discussions/attachments/sign-url', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            filename: photo.file.name,
                            fileType: photo.file.type,
                            sizeBytes: photo.file.size
                        })
                    });

                    if (!signRes.ok) {
                        throw new Error("Failed to get upload URL");
                    }

                    const { uploadUrl, storagePath } = await signRes.json();

                    // Upload to storage
                    const uploadRes = await fetch(uploadUrl, {
                        method: 'PUT',
                        headers: { 'Content-Type': photo.file.type },
                        body: photo.file
                    });

                    if (!uploadRes.ok) {
                        throw new Error("Failed to upload photo");
                    }

                    // Get public URL
                    const { data: { publicUrl } } = supabase.storage
                        .from('commune-uploads')
                        .getPublicUrl(storagePath);

                    uploadedUrls.push(publicUrl);
                }

                metaData = {
                    media_type: photos.length > 1 ? "carousel" : "photo",
                    media_urls: uploadedUrls,
                    media_url: uploadedUrls[0],
                    thumbnail_url: uploadedUrls[0],
                };
            } else if (media) {
                // Single video/audio upload
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
                    throw new Error("Failed to get upload URL");
                }

                const { uploadUrl, storagePath } = await signRes.json();

                const uploadRes = await fetch(uploadUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': media.file.type },
                    body: media.file
                });

                if (!uploadRes.ok) {
                    throw new Error("Failed to upload file");
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('commune-uploads')
                    .getPublicUrl(storagePath);

                metaData = {
                    media_type: media.type,
                    media_url: publicUrl,
                    storage_path: storagePath,
                };
            }

            // Create thread
            const threadRes = await fetch('/api/discussions/threads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    channelId: channelId,
                    title: caption.slice(0, 100),
                    content: caption,
                    meta: metaData
                })
            });

            if (!threadRes.ok) {
                const errData = await threadRes.json();
                throw new Error(errData.error || "Failed to create post");
            }

            const { thread: newThread } = await threadRes.json();

            // Success
            clearAllMedia();
            setCaption("");
            onSuccess?.(newThread);
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
                                            clearAllMedia();
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
                                    {/* Photo Carousel Preview */}
                                    {mediaType === "photo" && photos.length > 0 ? (
                                        <div className="space-y-3">
                                            {/* Main Preview */}
                                            <div className="relative rounded-xl overflow-hidden bg-black">
                                                <img
                                                    src={photos[carouselIndex]?.previewUrl}
                                                    alt={`Photo ${carouselIndex + 1}`}
                                                    className="w-full h-48 object-contain bg-slate-900"
                                                />

                                                {/* Navigation Arrows */}
                                                {photos.length > 1 && (
                                                    <>
                                                        {carouselIndex > 0 && (
                                                            <button
                                                                onClick={() => setCarouselIndex(carouselIndex - 1)}
                                                                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white"
                                                            >
                                                                ‹
                                                            </button>
                                                        )}
                                                        {carouselIndex < photos.length - 1 && (
                                                            <button
                                                                onClick={() => setCarouselIndex(carouselIndex + 1)}
                                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white"
                                                            >
                                                                ›
                                                            </button>
                                                        )}
                                                    </>
                                                )}

                                                {/* Photo Counter */}
                                                {photos.length > 1 && (
                                                    <div className="absolute top-2 left-2 bg-black/50 rounded-full px-2 py-1 text-xs text-white">
                                                        {carouselIndex + 1} / {photos.length}
                                                    </div>
                                                )}

                                                {/* Remove Current Photo */}
                                                <button
                                                    onClick={() => handleRemovePhoto(carouselIndex)}
                                                    className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Thumbnail Strip */}
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {photos.map((photo, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setCarouselIndex(idx)}
                                                        className={cn(
                                                            "flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all",
                                                            idx === carouselIndex
                                                                ? "border-brand-red"
                                                                : "border-transparent opacity-60 hover:opacity-100"
                                                        )}
                                                    >
                                                        <img
                                                            src={photo.previewUrl}
                                                            alt={`Thumbnail ${idx + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                ))}

                                                {/* Add More Photos Button */}
                                                {photos.length < MAX_CAROUSEL_PHOTOS && (
                                                    <button
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="flex-shrink-0 w-14 h-14 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-brand-red hover:text-brand-red transition-all"
                                                    >
                                                        +
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ) : mediaType === "photo" && photos.length === 0 ? (
                                        /* Empty Photo Upload */
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-brand-red hover:bg-red-50/50 transition-all"
                                        >
                                            <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                                            <p className="text-slate-600 dark:text-slate-400 font-medium">
                                                Click to upload photos
                                            </p>
                                            <p className="text-sm text-slate-400 mt-1">
                                                Up to {MAX_CAROUSEL_PHOTOS} photos, max 10MB each
                                            </p>
                                        </div>
                                    ) : !media ? (
                                        /* Empty Video/Audio Upload */
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
                                        /* Video/Audio Preview */
                                        <div className="relative rounded-xl overflow-hidden bg-black">
                                            {media.type === "video" && (
                                                <video
                                                    ref={videoRef}
                                                    src={media.previewUrl}
                                                    className="w-full h-48 object-cover"
                                                    controls
                                                    muted
                                                />
                                            )}

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
                                        multiple={mediaType === "photo"}
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
                                    disabled={uploading || (mediaType === "photo" ? photos.length === 0 : !media) || !caption.trim()}
                                    className={cn(
                                        "px-6 py-2.5 rounded-full font-medium transition-all flex items-center gap-2",
                                        uploading || (mediaType === "photo" ? photos.length === 0 : !media) || !caption.trim()
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
