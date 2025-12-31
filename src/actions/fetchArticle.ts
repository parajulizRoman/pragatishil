'use server';

import * as cheerio from 'cheerio';

// Simple HTML sanitizer that works on server-side without browser dependencies
function sanitizeHtml(html: string): string {
    const $ = cheerio.load(html);

    // Remove dangerous elements
    $('script, style, iframe, object, embed, form, input, button').remove();

    // Remove event handlers and dangerous attributes
    $('*').each((_, el) => {
        const attribs = (el as unknown as { attribs?: Record<string, string> }).attribs || {};
        for (const attr of Object.keys(attribs)) {
            if (attr.startsWith('on') || attr === 'style') {
                $(el).removeAttr(attr);
            }
        }
    });

    // Only allow safe tags
    const allowedTags = ['p', 'b', 'i', 'em', 'strong', 'a', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'br', 'img', 'blockquote', 'figure', 'figcaption', 'div', 'span'];
    $('*').each((_, el) => {
        const tagName = (el as unknown as { tagName?: string }).tagName?.toLowerCase();
        if (tagName && !allowedTags.includes(tagName)) {
            $(el).replaceWith($(el).contents());
        }
    });

    return $.html();
}

export interface ArticleData {
    title: string;
    content: string; // HTML string
    image?: string;
    source: string;
    date?: string;
    url: string;
    error?: string;
}

export async function fetchArticle(url: string): Promise<ArticleData> {
    try {
        if (!url) {
            throw new Error("No URL provided");
        }

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch article: ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // --- Metadata Extraction ---
        const title = $('h1').first().text().trim() ||
            $('meta[property="og:title"]').attr('content') ||
            $('title').text().trim() || 'Untitled Article';

        const image = $('meta[property="og:image"]').attr('content');
        const source = new URL(url).hostname.replace('www.', '');
        const date = $('meta[property="article:published_time"]').attr('content') ||
            $('time').first().text().trim();

        // --- Content Extraction (Heuristic) ---
        // Try to find the main content container specifically for major Nepali portals if known, else generic.
        // OnlineKhabar usually uses specific classes.
        let contentEl = $('.ok-container'); // OnlineKhabar
        if (contentEl.length === 0) contentEl = $('.article-body'); // General
        if (contentEl.length === 0) contentEl = $('article'); // Semantic HTML
        if (contentEl.length === 0) contentEl = $('main'); // Semantic HTML
        if (contentEl.length === 0) contentEl = $('body'); // Fallback (dangerous, but we clean it)

        // --- Cleaning ---
        // Remove unwanted elements
        contentEl.find('script, style, iframe, button, input, form, nav, footer, header, .advertisement, .ad-container, .social-share').remove();

        // Get HTML
        let rawHtml = contentEl.html() || '';

        // If content is too short, we might have missed the main container. 
        if (rawHtml.length < 200) {
            // Fallback: try p tags
            rawHtml = $('p').map((_, el) => `<p>${$(el).html()}</p>`).get().join('');
        }

        // --- Sanitize using cheerio-based sanitizer ---
        const cleanHtml = sanitizeHtml(rawHtml);

        return {
            title,
            content: cleanHtml,
            image,
            source,
            date,
            url
        };

    } catch (error: unknown) {
        console.error("fetchArticle Error:", error);
        return {
            title: "Error Loading Article",
            content: "<p>Could not load content. Please visit the original site.</p>",
            source: "",
            url,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
