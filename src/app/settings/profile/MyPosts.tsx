/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { Loader2, Trash2, MessageSquare, FileText, AlertTriangle } from "lucide-react";
import { DiscussionThread, DiscussionPost } from "@/types";

export default function MyPosts({ userId }: { userId: string }) {
    const [activeTab, setActiveTab] = useState<'threads' | 'posts'>('threads');
    const [threads, setThreads] = useState<DiscussionThread[]>([]);
    const [posts, setPosts] = useState<DiscussionPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchContent();
    }, [activeTab]);

    const fetchContent = async () => {
        setLoading(true);
        setError(null);
        try {
            if (activeTab === 'threads') {
                const { data, error } = await supabase
                    .from('discussion_threads')
                    .select('*, channel:discussion_channels(slug, name)')
                    .eq('created_by', userId)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setThreads(data || []);
            } else {
                // Use the API we updated to include Context (Thread Title) if possible, 
                // or just fetch raw and join. 
                // Let's use Supabase directly for simplicity and to ensure we get what we need.
                const { data, error } = await supabase
                    .from('discussion_posts')
                    .select('*, thread:discussion_threads(id, title)')
                    .eq('author_id', userId)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setPosts(data as any || []); // Cast as any because of complex join typing
            }
        } catch (err: any) {
            console.error("Error fetching content:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, type: 'thread' | 'post') => {
        if (!confirm("Are you sure you want to delete this? This cannot be undone.")) return;

        try {
            const table = type === 'thread' ? 'discussion_threads' : 'discussion_posts';
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (error) throw error;

            alert("Deleted successfully.");
            fetchContent(); // Refresh
        } catch (err: any) {
            alert("Delete failed: " + err.message);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
            <div className="border-b border-slate-200 flex px-6">
                <button
                    onClick={() => setActiveTab('threads')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'threads' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <FileText size={16} />
                    My Discussions
                </button>
                <button
                    onClick={() => setActiveTab('posts')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'posts' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <MessageSquare size={16} />
                    My Comments
                </button>
            </div>

            <div className="p-6">
                {loading ? (
                    <div className="flex justify-center py-12 text-slate-400">
                        <Loader2 className="animate-spin w-8 h-8" />
                    </div>
                ) : error ? (
                    <div className="text-red-500 bg-red-50 p-4 rounded-lg flex items-center gap-2">
                        <AlertTriangle size={16} /> {error}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activeTab === 'threads' ? (
                            threads.length === 0 ? <p className="text-slate-500 italic text-center py-8">No specific discussions started.</p> :
                                threads.map(thread => (
                                    <div key={thread.id} className="group flex items-start justify-between p-4 rounded-xl border border-slate-100 hover:border-brand-blue/30 hover:bg-slate-50 transition-all">
                                        <div className="flex-1 min-w-0 mr-4">
                                            <Link href={`/commune/thread/${thread.id}`} className="font-semibold text-slate-800 hover:text-brand-blue line-clamp-1 block mb-1">
                                                {thread.title}
                                            </Link>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{thread.channel?.name || 'Channel'}</span>
                                                <span>• {new Date(thread.created_at).toLocaleDateString()}</span>
                                                {thread.is_anonymous && <span className="text-amber-600 bg-amber-50 px-1.5 rounded">Anonymous</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {/* Edit functionality requires a page or modal - for now likely just delete or link to edit page if exists */}
                                            <button
                                                onClick={() => handleDelete(thread.id, 'thread')}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                title="Delete Thread"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            posts.length === 0 ? <p className="text-slate-500 italic text-center py-8">No comments made.</p> :
                                posts.map((post: any) => (
                                    <div key={post.id} className="group flex items-start justify-between p-4 rounded-xl border border-slate-100 hover:border-brand-blue/30 hover:bg-slate-50 transition-all">
                                        <div className="flex-1 min-w-0 mr-4">
                                            <Link href={`/commune/thread/${post.thread?.id}#post-${post.id}`} className="text-sm text-slate-600 hover:text-slate-900 block mb-2 italic line-clamp-2">
                                                &quot;{post.content}&quot;
                                            </Link>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <span>On: {post.thread?.title || 'Unknown Thread'}</span>
                                                <span>• {new Date(post.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleDelete(post.id, 'post')}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                title="Delete Post"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
