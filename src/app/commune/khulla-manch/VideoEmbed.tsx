"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Loader2, AlertCircle, Play, Volume2, VolumeX } from "lucide-react";

interface VideoEmbedProps {
    url: string;
    isActive: boolean;
    onError?: (error: string) => void;
}

// Video platform detection
type VideoPlatform = "tiktok" | "youtube" | "facebook" | "instagram" | "direct" | "unknown";

function detectPlatform(url: string): VideoPlatform {
    if (!url) return "unknown";

    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes("tiktok.com") || lowerUrl.includes("vm.tiktok.com")) {
        return "tiktok";
    }
    if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
        return "youtube";
    }
    if (lowerUrl.includes("facebook.com") || lowerUrl.includes("fb.watch")) {
        return "facebook";
    }
    if (lowerUrl.includes("instagram.com")) {
        return "instagram";
    }
    if (url.match(/\.(mp4|webm|ogg|mov)(\?|$)/i)) {
        return "direct";
    }

    return "unknown";
}

// Extract video ID from various platforms
function getYouTubeId(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}

function getTikTokId(url: string): string | null {
    const match = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
    return match ? match[1] : null;
}

export default function VideoEmbed({ url, isActive, onError }: VideoEmbedProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [muted, setMuted] = useState(true);

    const platform = useMemo(() => detectPlatform(url), [url]);

    useEffect(() => {
        setLoading(true);
        setError(null);

        // Simulate loading check
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [url]);

    const handleError = (message: string) => {
        setError(message);
        setLoading(false);
        onError?.(message);
    };

    // Render YouTube embed
    const renderYouTube = () => {
        const videoId = getYouTubeId(url);
        if (!videoId) {
            return <ErrorState message="Invalid YouTube URL" />;
        }

        return (
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=${isActive ? 1 : 0}&mute=${muted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                onLoad={() => setLoading(false)}
                onError={() => handleError("Failed to load YouTube video")}
            />
        );
    };

    // Render TikTok embed
    const renderTikTok = () => {
        const videoId = getTikTokId(url);

        return (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
                <iframe
                    src={`https://www.tiktok.com/embed/v2/${videoId}?autoplay=${isActive ? 1 : 0}`}
                    className="w-full h-full"
                    allow="autoplay"
                    allowFullScreen
                    onLoad={() => setLoading(false)}
                    onError={() => handleError("This TikTok video cannot be played. It may be private or removed.")}
                />
            </div>
        );
    };

    // Render direct video
    const renderDirectVideo = () => {
        return (
            <video
                src={url}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay={isActive}
                loop
                muted={muted}
                playsInline
                onLoadedData={() => setLoading(false)}
                onError={() => handleError("Failed to load video")}
            />
        );
    };

    // Render Facebook/Instagram placeholder (limited support)
    const renderLimitedPlatform = (platformName: string) => {
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 text-center p-6">
                <Play className="w-16 h-16 text-white/60 mb-4" />
                <p className="text-white text-lg font-medium mb-2">
                    {platformName} Video
                </p>
                <p className="text-white/60 text-sm mb-4">
                    Tap to watch on {platformName}
                </p>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-colors"
                >
                    Open in {platformName}
                </a>
            </div>
        );
    };

    // Loading state
    if (loading) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
                <Loader2 className="w-10 h-10 animate-spin text-white/60" />
            </div>
        );
    }

    // Error state
    if (error) {
        return <ErrorState message={error} />;
    }

    return (
        <div className="absolute inset-0 bg-black">
            {platform === "youtube" && renderYouTube()}
            {platform === "tiktok" && renderTikTok()}
            {platform === "direct" && renderDirectVideo()}
            {platform === "facebook" && renderLimitedPlatform("Facebook")}
            {platform === "instagram" && renderLimitedPlatform("Instagram")}
            {platform === "unknown" && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900">
                    <p className="text-white/60">Unsupported video format</p>
                </div>
            )}

            {/* Mute toggle for direct videos */}
            {platform === "direct" && (
                <button
                    onClick={() => setMuted(!muted)}
                    className="absolute bottom-4 right-4 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                    {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
            )}
        </div>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 text-center p-6">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-white text-lg font-medium mb-2">
                Video Unavailable
            </p>
            <p className="text-white/60 text-sm max-w-xs">
                {message}
            </p>
        </div>
    );
}
