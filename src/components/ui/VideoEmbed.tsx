"use client";

import React from 'react';
import { parseVideoUrl } from '@/lib/videoUtils';
import { ExternalLink, Play } from 'lucide-react';

interface VideoEmbedProps {
    url: string;
    className?: string;
}

/**
 * Video embed component for YouTube, Facebook, TikTok, and Twitter
 */
export default function VideoEmbed({ url, className = "" }: VideoEmbedProps) {
    const video = parseVideoUrl(url);

    if (video.platform === 'unknown' || !video.embedUrl) {
        // Fallback to link
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brand-blue hover:underline"
            >
                <ExternalLink className="w-4 h-4" />
                {url}
            </a>
        );
    }

    // YouTube embed
    if (video.platform === 'youtube') {
        return (
            <div className={`relative w-full max-w-2xl aspect-video rounded-xl overflow-hidden bg-black shadow-lg ${className}`}>
                <iframe
                    src={video.embedUrl}
                    title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                />
            </div>
        );
    }

    // Facebook embed
    if (video.platform === 'facebook') {
        return (
            <div className={`relative w-full max-w-2xl aspect-video rounded-xl overflow-hidden shadow-lg ${className}`}>
                <iframe
                    src={video.embedUrl}
                    title="Facebook video"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                />
            </div>
        );
    }

    // TikTok embed
    if (video.platform === 'tiktok') {
        return (
            <div className={`relative w-full max-w-sm aspect-[9/16] rounded-xl overflow-hidden shadow-lg ${className}`}>
                <iframe
                    src={video.embedUrl}
                    title="TikTok video"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                />
            </div>
        );
    }

    // Twitter/X - link with thumbnail
    if (video.platform === 'twitter') {
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block relative w-full max-w-2xl aspect-video rounded-xl overflow-hidden bg-slate-100 group shadow-lg ${className}`}
            >
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-brand-blue/90 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 ml-1" fill="currentColor" />
                    </div>
                </div>
                <div className="absolute bottom-3 left-3 bg-white/90 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700">
                    Watch on X/Twitter
                </div>
            </a>
        );
    }

    return null;
}

/**
 * Component to render text with embedded videos
 */
export function RichTextWithVideos({ content }: { content: string }) {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlPattern);

    return (
        <div className="space-y-4">
            {parts.map((part, index) => {
                if (part.match(urlPattern)) {
                    const video = parseVideoUrl(part);
                    if (video.platform !== 'unknown' && video.embedUrl) {
                        return (
                            <div key={index} className="my-4">
                                <VideoEmbed url={part} />
                            </div>
                        );
                    }
                    // Regular link
                    return (
                        <a
                            key={index}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-blue hover:underline break-all"
                        >
                            {part}
                        </a>
                    );
                }
                // Regular text
                return part ? <span key={index}>{part}</span> : null;
            })}
        </div>
    );
}
