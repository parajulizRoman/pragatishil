"use client";

import React, { useRef, useEffect } from "react";
import { DiscussionChannel } from "@/types";
import { cn } from "@/lib/utils";

interface ChannelTabsProps {
    channels: DiscussionChannel[];
    activeChannelId: string | null; // null = "For You"
    onChannelChange: (channelId: string | null) => void;
}

export default function ChannelTabs({ channels, activeChannelId, onChannelChange }: ChannelTabsProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll active tab into view
    useEffect(() => {
        const active = scrollRef.current?.querySelector('[data-active="true"]');
        if (active) {
            active.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
    }, [activeChannelId]);

    return (
        <div className="relative">
            {/* Gradient fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            {/* Scrollable tabs */}
            <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {/* "For You" tab */}
                <button
                    data-active={activeChannelId === null}
                    onClick={() => onChannelChange(null)}
                    className={cn(
                        "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                        activeChannelId === null
                            ? "bg-white text-black"
                            : "bg-white/10 text-white hover:bg-white/20"
                    )}
                >
                    For You
                </button>

                {/* Channel tabs */}
                {channels.map((channel) => (
                    <button
                        key={channel.id}
                        data-active={activeChannelId === channel.id}
                        onClick={() => onChannelChange(channel.id)}
                        className={cn(
                            "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                            activeChannelId === channel.id
                                ? "bg-white text-black"
                                : "bg-white/10 text-white hover:bg-white/20"
                        )}
                    >
                        {channel.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
