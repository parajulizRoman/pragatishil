"use client";

import React, { useEffect, useState } from "react";
import { DiscussionChannel, DiscussionThread } from "@/types";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquare, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import EyeLoadingAnimation from "@/components/EyeLoadingAnimation";
import Image from "next/image";

interface ChannelWithThreads extends DiscussionChannel {
    recentThreads?: DiscussionThread[];
}

export default function ChannelListingPage() {
    const router = useRouter();
    const [channels, setChannels] = useState<ChannelWithThreads[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const CHANNELS_PER_PAGE = 5;

    // Intersection Observer ref for infinite scroll
    const observerTarget = React.useRef<HTMLDivElement>(null);

    const fetchChannelsPage = async (pageNum: number) => {
        try {
            const isFirstPage = pageNum === 0;
            if (!isFirstPage) setLoadingMore(true);

            // Fetch channels with pagination
            const channelsRes = await fetch(`/api/discussions/channels?limit=${CHANNELS_PER_PAGE}&offset=${pageNum * CHANNELS_PER_PAGE}`);
            if (!channelsRes.ok) throw new Error("Failed to fetch channels");
            const channelsData = await channelsRes.json();
            const channelsList: DiscussionChannel[] = channelsData.channels || [];

            // Check if we have more channels
            if (channelsList.length < CHANNELS_PER_PAGE) {
                setHasMore(false);
            }

            // Fetch recent threads for each channel
            const channelsWithThreads = await Promise.all(
                channelsList.map(async (channel) => {
                    try {
                        const threadsRes = await fetch(
                            `/api/discussions/threads?channel_id=${channel.id}&limit=3`
                        );
                        if (threadsRes.ok) {
                            const threadsData = await threadsRes.json();
                            return {
                                ...channel,
                                recentThreads: threadsData.threads || [],
                            };
                        }
                    } catch (err) {
                        console.error(`Failed to fetch threads for ${channel.name}:`, err);
                    }
                    return { ...channel, recentThreads: [] };
                })
            );

            setChannels(prev => pageNum === 0 ? channelsWithThreads : [...prev, ...channelsWithThreads]);
        } catch (err) {
            console.error("Error loading channels:", err);
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchChannelsPage(0);
    }, []);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
                    setPage(prev => {
                        const nextPage = prev + 1;
                        fetchChannelsPage(nextPage);
                        return nextPage;
                    });
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, loadingMore, loading]);

    const getThumbnails = (threads: DiscussionThread[] = []) => {
        const thumbnails: string[] = [];
        for (const thread of threads) {
            if (thread.meta?.media_urls?.length > 0) {
                thumbnails.push(thread.meta.media_urls[0]);
            } else if (thread.meta?.media_url) {
                thumbnails.push(thread.meta.media_url);
            } else if (thread.meta?.thumbnail_url) {
                thumbnails.push(thread.meta.thumbnail_url);
            }
            if (thumbnails.length >= 3) break;
        }
        return thumbnails;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black flex flex-col items-center justify-center">
                <EyeLoadingAnimation />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl font-semibold text-slate-900 dark:text-white">Error loading channels</p>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                        Commune Channels
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Explore discussions across different channels and communities
                    </p>
                </div>

                {/* Group channels by parent */}
                {(() => {
                    // Separate channels into groups
                    const topLevelChannels = channels.filter(ch => !ch.parent_channel_id);
                    const childChannels = channels.filter(ch => ch.parent_channel_id);

                    // Group children by parent
                    const channelsByParent = new Map<string, typeof channels>();
                    childChannels.forEach(ch => {
                        const parentId = ch.parent_channel_id!;
                        if (!channelsByParent.has(parentId)) {
                            channelsByParent.set(parentId, []);
                        }
                        channelsByParent.get(parentId)!.push(ch);
                    });

                    return (
                        <>
                            {/* Top-level channels */}
                            {topLevelChannels.length > 0 && (
                                <div className="mb-12">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                                        Main Channels
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {topLevelChannels.map((channel) => renderChannelCard(channel))}
                                    </div>

                                    {/* Render children of each top-level channel */}
                                    {topLevelChannels.map(parent => {
                                        const children = channelsByParent.get(parent.id);
                                        if (!children || children.length === 0) return null;

                                        return (
                                            <div key={`group-${parent.id}`} className="mt-12">
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                                    <span className="text-2xl">{parent.icon_emoji || "📁"}</span>
                                                    {parent.name}
                                                    <span className="text-sm font-normal text-slate-500">
                                                        ({children.length})
                                                    </span>
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                    {children.map((channel) => renderChannelCard(channel))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    );
                })()}

                {/* Infinite Scroll Observer Target */}
                {hasMore && (
                    <div ref={observerTarget} className="py-8 flex justify-center">
                        {loadingMore && (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
                                <p className="text-sm text-slate-600 dark:text-slate-400">Loading more channels...</p>
                            </div>
                        )}
                    </div>
                )}

                {/* End of channels message */}
                {!hasMore && channels.length > 0 && (
                    <div className="text-center py-8">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            You've reached the end! 🎉
                        </p>
                    </div>
                )}

                {/* Empty State */}
                {channels.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">💬</div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                            No channels yet
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Channels will appear here once they are created
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

    // Helper function to render a channel card
    function renderChannelCard(channel: ChannelWithThreads) {
        const thumbnails = getThumbnails(channel.recentThreads);
        const icon = channel.icon_emoji || "💬";

        return (
            <div
                key={channel.id}
                onClick={() => router.push(`/commune?channel=${channel.slug || channel.id}`)}
                className="group cursor-pointer"
            >
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-brand-red dark:hover:border-brand-red">
                    {/* Thumbnail Stack */}
                    <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 overflow-hidden">
                        {thumbnails.length > 0 ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                {thumbnails.map((thumb, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "absolute w-32 h-32 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-105",
                                            idx === 0 && "z-30 rotate-0 group-hover:rotate-3",
                                            idx === 1 && "z-20 -rotate-6 translate-x-8 group-hover:translate-x-12",
                                            idx === 2 && "z-10 rotate-6 -translate-x-8 group-hover:-translate-x-12"
                                        )}
                                        style={{
                                            transform: `${idx === 0 ? 'rotate(0deg)' : idx === 1 ? 'rotate(-6deg) translateX(2rem)' : 'rotate(6deg) translateX(-2rem)'}`
                                        }}
                                    >
                                        <img
                                            src={thumb}
                                            alt=""
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center p-8">
                                <Image
                                    src="/favicon.png"
                                    alt={channel.name}
                                    width={120}
                                    height={120}
                                    className="object-contain opacity-40 group-hover:opacity-60 transition-opacity"
                                />
                            </div>
                        )}

                        {/* Trending Badge */}
                        {(channel.thread_count || 0) > 10 && (
                            <div className="absolute top-3 right-3 bg-brand-red text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Active
                            </div>
                        )}
                    </div>

                    {/* Channel Info */}
                    <div className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-red to-brand-blue flex items-center justify-center text-xl flex-shrink-0">
                                {icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 group-hover:text-brand-red transition-colors">
                                    {channel.name}
                                </h3>
                            </div>
                        </div>

                        {channel.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                                {channel.description}
                            </p>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                                <MessageSquare className="w-3.5 h-3.5" />
                                {channel.thread_count || 0}
                            </span>
                            {channel.member_count !== undefined && (
                                <span className="flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5" />
                                    {channel.member_count}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
