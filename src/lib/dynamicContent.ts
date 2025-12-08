import { createClient } from "@/lib/supabase/server";
import { siteContent as staticContent } from "@/config/siteContent";

// Fallback is staticContent if DB fails or key missing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getSiteSettings<T = any>(key: string): Promise<T> {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('site_settings')
            .select('content')
            .eq('key', key)
            .single();

        if (error || !data) {
            console.warn(`[CMS] Missing / Error for key '${key}', using static fallback.`);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return staticContent[key] as T;
        }

        return data.content as T;
    } catch (e) {
        console.error(`[CMS] Exception fetching '${key}': `, e);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return staticContent[key] as T;
    }
}

// Fetch all settings at once for optimization (optional)
export async function getAllSiteSettings() {
    // For specific pages, we might want to fetch multiple keys
    // This is a placeholder for more advanced caching/fetching
}
