import { createClient } from "@/lib/supabase/server";
import { restorePost } from "./actions";
import { User, MessageSquare, RotateCcw } from "lucide-react";

export const dynamic = 'force-dynamic';

interface BuriedPost {
    id: string;
    content: string;
    created_at: string;
    buried_at: string | null;
    author: { full_name_en: string | null } | null;
    thread: { id: string; title: string } | null;
}

export default async function GraveyardPage() {
    const supabase = await createClient();

    // Fetch buried posts
    const { data: posts, error } = await supabase
        .from('discussion_posts')
        .select(`
      id,
      content,
      created_at,
      buried_at,
      author:author_id (
        full_name_en
      ),
      thread:thread_id (
        id,
        title
      )
    `)
        .not('buried_at', 'is', null) // Only buried
        .order('buried_at', { ascending: false });

    if (error) {
        return <div className="p-8 text-red-500">Error loading graveyard: {error.message}</div>;
    }

    // Cast for safety if needed, or rely on inference. Supabase inference might be partial.
    const safePosts = (posts || []) as unknown as BuriedPost[];

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-heading text-slate-800 flex items-center gap-3">
                    <span className="text-4xl">🪦</span>
                    Content Graveyard
                </h1>
                <p className="text-slate-500 mt-2">
                    Manage posts that have been buried by the community moderation system.
                </p>
            </div>

            {safePosts.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-medium text-slate-600">The graveyard is empty.</h3>
                    <p className="text-slate-400">No content is currently buried.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {safePosts.map((post) => (
                        <div key={post.id} className="bg-white p-6 rounded-xl border border-red-100 shadow-sm flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                                    <span className="px-2 py-1 bg-red-50 text-red-600 rounded-full font-bold">BURIED</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <User size={12} />
                                        {post.author?.full_name_en || 'Unknown'}
                                    </span>
                                    <span>•</span>
                                    <span>
                                        {post.buried_at ? new Date(post.buried_at).toLocaleString() : '-'}
                                    </span>
                                </div>

                                <p className="text-slate-800 whitespace-pre-wrap mb-3 font-medium">
                                    {post.content}
                                </p>

                                <div className="text-sm text-brand-blue flex items-center gap-1">
                                    <MessageSquare size={14} />
                                    Thread: {post.thread?.title || 'Unknown Thread'}
                                </div>
                            </div>

                            <div className="flex items-center justify-end">
                                <form action={async () => {
                                    'use server';
                                    await restorePost(post.id);
                                }}>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 font-medium"
                                    >
                                        <RotateCcw size={16} />
                                        Restore Post
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
