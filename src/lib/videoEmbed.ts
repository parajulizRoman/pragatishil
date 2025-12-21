/**
 * Video Embed Utility
 * Converts video URLs from various platforms to embeddable formats
 */

export interface VideoEmbedResult {
    platform: 'youtube' | 'facebook' | 'tiktok' | 'instagram' | 'vimeo' | 'unknown';
    embedUrl: string | null;
    thumbnailUrl: string | null;
    videoId: string | null;
    originalUrl: string;
    canEmbed: boolean;
}

/**
 * Parse a video URL and return embed information
 */
export function parseVideoUrl(url: string): VideoEmbedResult {
    const trimmedUrl = url.trim();

    // YouTube
    const youtubePatterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of youtubePatterns) {
        const match = trimmedUrl.match(pattern);
        if (match) {
            const videoId = match[1];
            return {
                platform: 'youtube',
                videoId,
                embedUrl: `https://www.youtube.com/embed/${videoId}`,
                thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                originalUrl: trimmedUrl,
                canEmbed: true,
            };
        }
    }

    // Facebook Video
    const facebookPatterns = [
        /facebook\.com\/(?:watch\/?\?v=|.*\/videos\/)(\d+)/,
        /fb\.watch\/([a-zA-Z0-9]+)/,
    ];

    for (const pattern of facebookPatterns) {
        const match = trimmedUrl.match(pattern);
        if (match) {
            // Facebook embeds require their plugin - we'll use a different approach
            return {
                platform: 'facebook',
                videoId: match[1],
                embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmedUrl)}&show_text=false&width=560`,
                thumbnailUrl: null,
                originalUrl: trimmedUrl,
                canEmbed: true,
            };
        }
    }

    // TikTok - Note: TikTok embedding requires their embed SDK
    const tiktokPatterns = [
        /tiktok\.com\/@[^\/]+\/video\/(\d+)/,
        /vm\.tiktok\.com\/([a-zA-Z0-9]+)/,
    ];

    for (const pattern of tiktokPatterns) {
        const match = trimmedUrl.match(pattern);
        if (match) {
            // TikTok embeds are complex - we provide iframe but may need SDK
            return {
                platform: 'tiktok',
                videoId: match[1],
                embedUrl: `https://www.tiktok.com/embed/v2/${match[1]}`,
                thumbnailUrl: null,
                originalUrl: trimmedUrl,
                canEmbed: true,
            };
        }
    }

    // Instagram Reels/Video
    const instagramPatterns = [
        /instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of instagramPatterns) {
        const match = trimmedUrl.match(pattern);
        if (match) {
            return {
                platform: 'instagram',
                videoId: match[1],
                embedUrl: `https://www.instagram.com/p/${match[1]}/embed`,
                thumbnailUrl: null,
                originalUrl: trimmedUrl,
                canEmbed: true,
            };
        }
    }

    // Vimeo
    const vimeoPattern = /vimeo\.com\/(\d+)/;
    const vimeoMatch = trimmedUrl.match(vimeoPattern);
    if (vimeoMatch) {
        return {
            platform: 'vimeo',
            videoId: vimeoMatch[1],
            embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
            thumbnailUrl: null,
            originalUrl: trimmedUrl,
            canEmbed: true,
        };
    }

    // Unknown platform - return as-is (might be direct video URL)
    return {
        platform: 'unknown',
        videoId: null,
        embedUrl: null,
        thumbnailUrl: null,
        originalUrl: trimmedUrl,
        canEmbed: false,
    };
}

/**
 * Get platform display name
 */
export function getPlatformName(platform: VideoEmbedResult['platform']): string {
    const names: Record<VideoEmbedResult['platform'], string> = {
        youtube: 'YouTube',
        facebook: 'Facebook',
        tiktok: 'TikTok',
        instagram: 'Instagram',
        vimeo: 'Vimeo',
        unknown: 'Unknown',
    };
    return names[platform];
}

/**
 * Get platform color for UI
 */
export function getPlatformColor(platform: VideoEmbedResult['platform']): string {
    const colors: Record<VideoEmbedResult['platform'], string> = {
        youtube: 'bg-red-600',
        facebook: 'bg-blue-600',
        tiktok: 'bg-black',
        instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
        vimeo: 'bg-blue-400',
        unknown: 'bg-slate-500',
    };
    return colors[platform];
}
