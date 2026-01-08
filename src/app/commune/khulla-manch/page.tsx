"use client";

import React, { useEffect, useState } from "react";
import { DiscussionThread, DiscussionChannel } from "@/types";
import { createBrowserClient } from "@supabase/ssr";
import KhullaMunchFeed from "./KhullaMunchFeed";
import FeedSidebar from "./FeedSidebar";
import SignInPrompt from "./SignInPrompt";
import UploadModal from "./UploadModal";
import ExploreGrid from "./ExploreGrid";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function KhullaMunchPage() {
    const [threads, setThreads] = useState<DiscussionThread[]>([]);
    const [channel, setChannel] = useState<DiscussionChannel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Auth state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>("");
    const [showSignIn, setShowSignIn] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [showExplore, setShowExplore] = useState(false);
    const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(null);

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
                    if (profile) {
                        setUserName(profile.full_name || "");
                        setUserAvatar(profile.avatar_url);
                    }
                }

                // Find the Khulla Manch channel
                const channelsRes = await fetch("/api/discussions/channels");
                if (!channelsRes.ok) throw new Error("Failed to fetch channels");

                const channelsData = await channelsRes.json();
                const khullaManch = channelsData.channels.find(
                    (c: DiscussionChannel) =>
                        c.name.toLowerCase().includes("khulla") ||
                        c.slug?.toLowerCase().includes("khulla")
                );

                if (!khullaManch) {
                    throw new Error("Khulla Manch channel not found");
                }

                setChannel(khullaManch);

                // Fetch threads for this channel
                const threadsRes = await fetch(
                    `/api/discussions/threads?channel_id=${khullaManch.id}&limit=20`
                );
                if (!threadsRes.ok) throw new Error("Failed to fetch threads");

                const threadsData = await threadsRes.json();
                setThreads(threadsData.threads);
            } catch (err) {
                console.error("Error loading Khulla Manch:", err);
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
                    <p className="text-white/60">Loading...</p>
                </div>
            </div>
        );
    }

    if (error || !channel) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">😕</span>
                    </div>
                    <h1 className="text-xl font-bold text-white mb-2">
                        {error || "Channel not found"}
                    </h1>
                    <p className="text-white/60 mb-6">
                        The channel could not be loaded. Please try again later.
                    </p>
                    <Link
                        href="/commune"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Commune
                    </Link>
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
                onExploreClick={() => setShowExplore(!showExplore)}
                onUploadClick={() => {
                    if (isAuthenticated) {
                        setShowUpload(true);
                    } else {
                        setShowSignIn(true);
                    }
                }}
            />

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 flex justify-center">
                {showExplore ? (
                    /* Explore Grid View */
                    <div className="w-full max-w-4xl h-full relative">
                        <ExploreGrid
                            channelId={channel.id}
                            threads={threads}
                            onSelectPost={(index) => {
                                setSelectedPostIndex(index);
                                setShowExplore(false);
                            }}
                        />
                    </div>
                ) : (
                    /* Swipeable Feed View */
                    <div className="w-full max-w-[450px] h-full relative">
                        <KhullaMunchFeed
                            key={selectedPostIndex ?? 0}
                            initialThreads={threads}
                            channelId={channel.id}
                            isAuthenticated={isAuthenticated}
                            onAuthRequired={() => setShowSignIn(true)}
                            initialIndex={selectedPostIndex ?? 0}
                        />
                    </div>
                )}
            </div>

            {/* Navigation Hint - Mobile (only in feed mode) */}
            {!showExplore && (
                <div className="lg:hidden fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none z-30">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 animate-pulse">
                        <p className="text-white/80 text-sm">
                            Swipe up for more • Double tap to like
                        </p>
                    </div>
                </div>
            )}

            {/* Sign In Prompt */}
            <SignInPrompt
                isOpen={showSignIn}
                onClose={() => setShowSignIn(false)}
            />

            {/* Upload Modal */}
            {channel && (
                <UploadModal
                    isOpen={showUpload}
                    onClose={() => setShowUpload(false)}
                    channelId={channel.id}
                    onSuccess={(newThread) => {
                        // Optimistic update - add new post to beginning of feed
                        if (newThread) {
                            setThreads(prev => [newThread, ...prev]);
                            setSelectedPostIndex(0);
                            setShowExplore(false);
                        }
                    }}
                />
            )}
        </div>
    );
}
