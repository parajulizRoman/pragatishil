"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DiscussionThread, DiscussionChannel } from "@/types";
import { createBrowserClient } from "@supabase/ssr";
import { useSearchParams, useRouter } from "next/navigation";
import ChannelFeed from "./ChannelFeed";
import ChannelTabs from "./ChannelTabs";
import FeedSidebar from "./FeedSidebar";
import SignInPrompt from "./SignInPrompt";
import UploadModal from "./UploadModal";
import ChannelCarousel from "./ChannelCarousel";
import { Loader2 } from "lucide-react";

export default function CommuneFeedPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get channel from URL params
    const channelParam = searchParams.get("channel");

    const [threads, setThreads] = useState<DiscussionThread[]>([]);
    const [channels, setChannels] = useState<DiscussionChannel[]>([]);
    const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Auth state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>("");
    const [showSignIn, setShowSignIn] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [showExplore, setShowExplore] = useState(false);

    // Fetch channels and auth on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Check auth
                const supabase = createBrowserClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                );
                const { data: userData } = await supabase.auth.getUser();
                setIsAuthenticated(!!userData.user);

                if (userData.user) {
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("full_name, avatar_url")
                        .eq("id", userData.user.id)
                        .single();
                    setUserName(profile?.full_name || "");
                    setUserAvatar(profile?.avatar_url || null);
                }

                // Fetch channels
                const channelsRes = await fetch("/api/discussions/channels");
                if (!channelsRes.ok) throw new Error("Failed to fetch channels");
                const channelsData = await channelsRes.json();
                setChannels(channelsData.channels || []);

                // Set active channel from URL param
                if (channelParam) {
                    const found = channelsData.channels?.find(
                        (c: DiscussionChannel) => c.id === channelParam || c.slug === channelParam
                    );
                    if (found) {
                        setActiveChannelId(found.id);
                    }
                }
            } catch (err) {
                console.error("Error loading commune:", err);
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [channelParam]);

    // Fetch threads when channel changes
    useEffect(() => {
        const fetchThreads = async () => {
            try {
                let url = "/api/discussions/threads?limit=20";
                if (activeChannelId) {
                    url += `&channel_id=${activeChannelId}`;
                }
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    setThreads(data.threads || []);
                }
            } catch (err) {
                console.error("Failed to fetch threads:", err);
            }
        };

        fetchThreads();
    }, [activeChannelId]);

    // Handle channel change
    const handleChannelChange = useCallback((channelId: string | null) => {
        setActiveChannelId(channelId);
        // Update URL without navigation
        if (channelId) {
            const channel = channels.find(c => c.id === channelId);
            router.push(`/commune?channel=${channel?.slug || channelId}`, { scroll: false });
        } else {
            router.push("/commune", { scroll: false });
        }
    }, [channels, router]);

    // Get active channel for upload
    const activeChannel = channels.find(c => c.id === activeChannelId);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-white" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center">
                <div className="text-center text-white">
                    <p className="text-xl font-semibold">Error loading feed</p>
                    <p className="text-white/60 mt-2">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black flex">
            {/* Sidebar - Desktop */}
            <FeedSidebar
                isAuthenticated={isAuthenticated}
                userAvatar={userAvatar}
                userName={userName}
                onSignInClick={() => setShowSignIn(true)}
                onExploreClick={() => setShowExplore(true)}
                onUploadClick={() => {
                    if (isAuthenticated) {
                        setShowUpload(true);
                    } else {
                        setShowSignIn(true);
                    }
                }}
            />

            {/* Main Feed Area */}
            <div className="flex-1 lg:ml-64 flex flex-col">
                {/* Channel Tabs - Top */}
                <div className="flex-shrink-0 pt-2 pb-1 bg-black/50 backdrop-blur-sm z-20">
                    <ChannelTabs
                        channels={channels}
                        activeChannelId={activeChannelId}
                        onChannelChange={handleChannelChange}
                    />
                </div>

                {/* Feed Container */}
                <div className="flex-1 flex justify-center relative overflow-hidden">
                    <div className="w-full max-w-[450px] h-full relative">
                        <ChannelFeed
                            initialThreads={threads}
                            channelId={activeChannelId}
                            isAuthenticated={isAuthenticated}
                            onAuthRequired={() => setShowSignIn(true)}
                        />
                    </div>
                </div>

                {/* Navigation Hint - Mobile */}
                <div className="lg:hidden fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none z-30">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 animate-pulse">
                        <p className="text-white/80 text-sm">
                            Swipe up for more • Double tap to like
                        </p>
                    </div>
                </div>
            </div>

            {/* Sign In Prompt */}
            <SignInPrompt
                isOpen={showSignIn}
                onClose={() => setShowSignIn(false)}
            />

            {/* Upload Modal */}
            <UploadModal
                isOpen={showUpload}
                onClose={() => setShowUpload(false)}
                channelId={activeChannel?.id || channels[0]?.id || ""}
                onSuccess={() => {
                    window.location.reload();
                }}
            />

            {/* Channel Carousel */}
            <ChannelCarousel
                isOpen={showExplore}
                onClose={() => setShowExplore(false)}
            />
        </div>
    );
}
