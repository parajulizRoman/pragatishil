"use client";

import { useEffect, useState } from "react";
import { Hash, Users, Lock, Globe, UserCheck } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import ChannelMembersModal from "@/app/commune/ChannelMembersModal";

interface Channel {
    id: string;
    name: string;
    slug: string;
    access_type: string;
    visibility: string;
    member_count?: number;
}

const accessTypeBadge: Record<string, { bgColor: string; textColor: string; icon: React.ReactNode; label: string }> = {
    public: { bgColor: "#dcfce7", textColor: "#166534", icon: <Globe size={12} />, label: "Public" },
    members: { bgColor: "#dbeafe", textColor: "#1e40af", icon: <UserCheck size={12} />, label: "Members" },
    role_based: { bgColor: "#f3e8ff", textColor: "#7c3aed", icon: <Users size={12} />, label: "Role-Based" },
    private: { bgColor: "#fef3c7", textColor: "#92400e", icon: <Lock size={12} />, label: "Private" },
};

export default function ChannelsTab() {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

    useEffect(() => {
        loadChannels();
    }, []);

    const loadChannels = async () => {
        setLoading(true);
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Get channels
        const { data: channelsData, error } = await supabase
            .from("discussion_channels")
            .select("id, name, slug, access_type, visibility")
            .order("name");

        if (error) {
            console.error(error);
            setLoading(false);
            return;
        }

        // Get member counts for each channel
        const channelsWithCounts = await Promise.all(
            (channelsData || []).map(async (ch) => {
                const { count } = await supabase
                    .from("channel_members")
                    .select("*", { count: "exact", head: true })
                    .eq("channel_id", ch.id);
                return { ...ch, member_count: count || 0 };
            })
        );

        setChannels(channelsWithCounts);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500">
                    Manage channel memberships. Click a channel to view/add members.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50 grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <div className="col-span-5">Channel</div>
                    <div className="col-span-3">Access Type</div>
                    <div className="col-span-2">Members</div>
                    <div className="col-span-2">Actions</div>
                </div>

                <div className="divide-y divide-slate-100">
                    {channels.map((channel) => {
                        const accessInfo = accessTypeBadge[channel.access_type] || accessTypeBadge.public;
                        return (
                            <div
                                key={channel.id}
                                className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-slate-50 transition-colors"
                            >
                                {/* Channel Name */}
                                <div className="col-span-5 flex items-center gap-3">
                                    <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-lg">
                                        <Hash size={16} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">{channel.name}</p>
                                        <p className="text-xs text-slate-400">/{channel.slug}</p>
                                    </div>
                                </div>

                                {/* Access Type */}
                                <div className="col-span-3">
                                    <span
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                                        style={{
                                            backgroundColor: accessInfo.bgColor,
                                            color: accessInfo.textColor
                                        }}
                                    >
                                        {accessInfo.icon}
                                        {accessInfo.label}
                                    </span>
                                </div>

                                {/* Member Count */}
                                <div className="col-span-2">
                                    <span className="text-sm font-medium text-slate-600">
                                        {channel.member_count || 0}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="col-span-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedChannel(channel)}
                                        className="text-xs"
                                    >
                                        <Users size={14} className="mr-1" />
                                        Manage
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Channel Members Modal */}
            {selectedChannel && (
                <ChannelMembersModal
                    isOpen={!!selectedChannel}
                    onClose={() => {
                        setSelectedChannel(null);
                        loadChannels(); // Refresh counts
                    }}
                    channelId={selectedChannel.id}
                    channelName={selectedChannel.name}
                />
            )}
        </div>
    );
}
