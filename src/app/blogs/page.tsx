import { createClient } from "@/lib/supabase/server";
import { NewsItem } from "@/types";
import { Metadata } from "next";
import BlogsHeaderClient from "./NewsHeaderClient";
import NewsClient from "./NewsClient";

export const metadata: Metadata = {
    title: "Progressive Blogs | प्रगतिशील विचार | Pragatishil",
    description: "Progressive ideas, thought leadership articles, and insights from Pragatishil Loktantrik Party members.",
};

export const revalidate = 60; // Revalidate every minute

export default async function NewsListPage() {
    const supabase = await createClient();

    // Get current user and role
    const { data: { user } } = await supabase.auth.getUser();
    let userRole: string | null = null;
    let userId: string | null = null;

    if (user) {
        userId = user.id;
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
        userRole = profile?.role || null;
    }

    // Check if user can review (admin-level roles)
    const canReview = ["admin", "yantrik", "admin_party", "board"].includes(userRole || "");

    // Fetch published blogs for everyone
    const { data: publishedItems } = await supabase
        .from("news_items")
        .select("id, slug, title, title_ne, summary_en, summary_ne, date, image_url, source, status, type, link, pending_reviewer_id, author_id")
        .eq("status", "published")
        .order("date", { ascending: false });

    let allItems = (publishedItems as NewsItem[]) || [];

    // For reviewers: also fetch submitted blogs
    if (canReview) {
        const { data: submittedItems } = await supabase
            .from("news_items")
            .select("id, slug, title, title_ne, summary_en, summary_ne, date, image_url, source, status, type, link, pending_reviewer_id, author_id")
            .eq("status", "submitted")
            .order("date", { ascending: false });

        // Add submitted items at the top (pending review first)
        if (submittedItems && submittedItems.length > 0) {
            allItems = [...(submittedItems as NewsItem[]), ...allItems];
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            {/* Header - Client component for language support */}
            <BlogsHeaderClient />

            {/* News Grid - Client component for edit/delete */}
            <NewsClient
                initialNews={allItems}
                userRole={userRole}
                userId={userId}
            />
        </main>
    );
}
