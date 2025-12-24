"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { Check, X, Clock, ArrowLeft, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface PendingBlog {
    id: number;
    slug: string;
    title: string;
    title_ne: string | null;
    summary_en: string | null;
    status: string;
    date: string;
    updated_at: string;
    author_id: string;
    pending_reviewer_id: string;
    author?: {
        full_name: string;
        avatar_url: string | null;
    };
}

export default function AdminReviewsPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<PendingBlog[]>([]);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push("/auth/login?redirect=/admin/reviews");
            return;
        }
        setUserId(user.id);

        // Get user role
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (!profile || !["admin", "yantrik", "admin_party", "board"].includes(profile.role)) {
            router.push("/");
            return;
        }
        setUserRole(profile.role);

        // Fetch blogs pending review (assigned to this user or all for admin)
        const query = supabase
            .from("news_items")
            .select(`
                id, slug, title, title_ne, summary_en, status, date, updated_at, 
                author_id, pending_reviewer_id,
                author:profiles!news_items_author_id_fkey(full_name, avatar_url)
            `)
            .eq("status", "submitted")
            .eq("content_type", "article")
            .order("updated_at", { ascending: false });

        // If not super admin, only show blogs assigned to this reviewer
        if (profile.role !== "admin" && profile.role !== "yantrik") {
            query.eq("pending_reviewer_id", user.id);
        }

        const { data: pendingBlogs, error } = await query;

        if (error) {
            console.error("Error loading pending blogs:", error);
        } else {
            setBlogs(pendingBlogs as unknown as PendingBlog[] || []);
        }

        setLoading(false);
    };

    const handleApprove = async (blog: PendingBlog) => {
        if (!confirm(t("यो ब्लग प्रकाशित गर्ने हो?", `Publish "${blog.title}"?`))) return;

        setActionLoading(blog.id);
        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const { error } = await supabase
                .from("news_items")
                .update({
                    status: "published",
                    published_at: new Date().toISOString(),
                    pending_reviewer_id: null
                })
                .eq("id", blog.id);

            if (error) throw error;

            // Create notification for author
            if (blog.author_id) {
                await supabase.from("notifications").insert({
                    user_id: blog.author_id,
                    type: "blog_approved",
                    title: t("ब्लग प्रकाशित भयो!", "Blog Published!"),
                    body: t(
                        `तपाईंको ब्लग "${blog.title.slice(0, 30)}..." प्रकाशित भएको छ।`,
                        `Your blog "${blog.title.slice(0, 30)}..." has been published.`
                    ),
                    link: `/blogs/${blog.slug}`,
                    actor_id: userId
                });
            }

            // Refresh list
            setBlogs(prev => prev.filter(b => b.id !== blog.id));
            alert(t("ब्लग प्रकाशित भयो!", "Blog published!"));
        } catch (error) {
            alert("Failed to approve: " + (error as Error).message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (blog: PendingBlog) => {
        const reason = prompt(t("अस्वीकार गर्ने कारण:", "Reason for rejection:"));
        if (!reason) return;

        setActionLoading(blog.id);
        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const { error } = await supabase
                .from("news_items")
                .update({
                    status: "rejected",
                    pending_reviewer_id: null
                })
                .eq("id", blog.id);

            if (error) throw error;

            // Create notification for author
            if (blog.author_id) {
                await supabase.from("notifications").insert({
                    user_id: blog.author_id,
                    type: "blog_rejected",
                    title: t("ब्लग अस्वीकृत", "Blog Rejected"),
                    body: `${t("कारण:", "Reason:")} ${reason}`,
                    link: `/blogs/write?edit=${blog.id}`,
                    actor_id: userId
                });
            }

            // Refresh list
            setBlogs(prev => prev.filter(b => b.id !== blog.id));
            alert(t("ब्लग अस्वीकृत गरियो", "Blog rejected"));
        } catch (error) {
            alert("Failed to reject: " + (error as Error).message);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-16 px-4 bg-slate-50">
                <div className="max-w-4xl mx-auto space-y-4">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 bg-slate-50">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/blogs" className="inline-flex items-center text-slate-500 hover:text-brand-blue mb-2">
                        <ArrowLeft className="w-4 h-4 mr-2" />{t("ब्लगमा फर्कनुहोस्", "Back to Blogs")}
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Clock className="w-8 h-8 text-amber-500" />
                        {t("समीक्षा पर्खिरहेका ब्लगहरू", "Blogs Pending Review")}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {t(
                            `${blogs.length} ब्लग समीक्षाको लागि पर्खिरहेका छन्`,
                            `${blogs.length} blog(s) waiting for your review`
                        )}
                    </p>
                </div>

                {/* Pending Blogs List */}
                {blogs.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-slate-800 mb-2">
                            {t("सबै समीक्षा पूरा!", "All Caught Up!")}
                        </h2>
                        <p className="text-slate-500">
                            {t("समीक्षाको लागि कुनै पनि ब्लग छैन।", "No blogs pending review.")}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {blogs.map((blog) => (
                            <div
                                key={blog.id}
                                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-slate-800 mb-1 truncate">
                                            {blog.title}
                                        </h3>
                                        {blog.title_ne && (
                                            <p className="text-sm text-slate-500 mb-2 font-nepali truncate">
                                                {blog.title_ne}
                                            </p>
                                        )}

                                        {/* Summary */}
                                        {blog.summary_en && (
                                            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                                                {blog.summary_en}
                                            </p>
                                        )}

                                        {/* Meta */}
                                        <div className="flex items-center gap-4 text-xs text-slate-400">
                                            <span>
                                                {t("लेखक:", "Author:")} {(blog.author as unknown as { full_name: string })?.full_name || "Unknown"}
                                            </span>
                                            <span>
                                                {t("पेश गरिएको:", "Submitted:")} {new Date(blog.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Link href={`/blogs/${blog.slug}`}>
                                            <Button variant="outline" size="sm" className="gap-1">
                                                <Eye className="w-4 h-4" />
                                                {t("हेर्नुहोस्", "View")}
                                            </Button>
                                        </Link>
                                        <Button
                                            onClick={() => handleApprove(blog)}
                                            disabled={actionLoading === blog.id}
                                            className="gap-1 bg-green-600 hover:bg-green-700"
                                            size="sm"
                                        >
                                            {actionLoading === blog.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Check className="w-4 h-4" />
                                            )}
                                            {t("स्वीकृत", "Approve")}
                                        </Button>
                                        <Button
                                            onClick={() => handleReject(blog)}
                                            disabled={actionLoading === blog.id}
                                            variant="destructive"
                                            size="sm"
                                            className="gap-1"
                                        >
                                            <X className="w-4 h-4" />
                                            {t("अस्वीकृत", "Reject")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
