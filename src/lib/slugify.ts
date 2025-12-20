/**
 * Generates a URL-safe slug from a string.
 * Example: "Hello World! This is a Test" → "hello-world-this-is-a-test"
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')       // Remove special characters
        .replace(/\s+/g, '-')           // Replace spaces with hyphens
        .replace(/-+/g, '-')            // Collapse multiple hyphens
        .replace(/^-+|-+$/g, '');       // Trim hyphens from start/end
}

/**
 * Generates a unique slug by appending a suffix if needed.
 * @param baseSlug - The base slug to make unique
 * @param existingSlugChecker - Async function that returns true if slug already exists
 * @param maxAttempts - Maximum attempts before falling back to timestamp
 */
export async function generateUniqueSlug(
    baseSlug: string,
    existingSlugChecker: (slug: string) => Promise<boolean>,
    maxAttempts = 10
): Promise<string> {
    let slug = baseSlug;
    let attempt = 0;

    while (await existingSlugChecker(slug) && attempt < maxAttempts) {
        attempt++;
        slug = `${baseSlug}-${attempt}`;
    }

    // Fallback to timestamp if still not unique
    if (await existingSlugChecker(slug)) {
        slug = `${baseSlug}-${Date.now()}`;
    }

    return slug;
}
