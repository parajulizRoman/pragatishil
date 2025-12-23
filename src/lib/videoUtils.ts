/**
 * Video URL utilities for parsing and embedding videos from various platforms
 */

export interface ParsedVideo {
    platform: 'youtube' | 'facebook' | 'tiktok' | 'twitter' | 'unknown';
    videoId: string | null;
    embedUrl: string | null;
    thumbnailUrl: string | null;
    originalUrl: string;
}

/**
 * Parse a video URL and extract platform-specific information
 */
export function parseVideoUrl(url: string): ParsedVideo {
    const result: ParsedVideo = {
        platform: 'unknown',
        videoId: null,
        embedUrl: null,
        thumbnailUrl: null,
        originalUrl: url,
    };

    // YouTube patterns (includes watch, shorts, live, embed, youtu.be)
    const youtubePatterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of youtubePatterns) {
        const match = url.match(pattern);
        if (match) {
            result.platform = 'youtube';
            result.videoId = match[1];
            result.embedUrl = `https://www.youtube.com/embed/${match[1]}`;
            result.thumbnailUrl = `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
            return result;
        }
    }

    // Facebook video patterns
    const facebookPattern = /facebook\.com\/(?:watch\/?\?v=|.*\/videos\/|video\.php\?v=)(\d+)/;
    const fbMatch = url.match(facebookPattern);
    if (fbMatch) {
        result.platform = 'facebook';
        result.videoId = fbMatch[1];
        result.embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
        return result;
    }

    // TikTok patterns
    const tiktokPattern = /tiktok\.com\/@[\w.-]+\/video\/(\d+)/;
    const tiktokMatch = url.match(tiktokPattern);
    if (tiktokMatch) {
        result.platform = 'tiktok';
        result.videoId = tiktokMatch[1];
        result.embedUrl = `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`;
        return result;
    }

    // Twitter/X video patterns
    const twitterPattern = /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/;
    const twitterMatch = url.match(twitterPattern);
    if (twitterMatch) {
        result.platform = 'twitter';
        result.videoId = twitterMatch[1];
        // Twitter embeds require their widget.js, so we just return the URL
        result.embedUrl = url;
        return result;
    }

    return result;
}

/**
 * Extract all video URLs from text content
 */
export function extractVideoUrls(text: string): ParsedVideo[] {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlPattern) || [];

    return urls
        .map(parseVideoUrl)
        .filter(v => v.platform !== 'unknown' && v.embedUrl);
}

/**
 * Check if a URL is a video URL
 */
export function isVideoUrl(url: string): boolean {
    const parsed = parseVideoUrl(url);
    return parsed.platform !== 'unknown';
}
