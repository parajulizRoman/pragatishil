/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DiscussionChannel, UserRole } from "@/types";
import ChannelModal from "./ChannelModal";
import { createBrowserClient } from "@supabase/ssr";
import { canManageChannels, canManageUsers } from "@/lib/permissions";

export default function CommunityPage() {
    const [channels, setChannels] = useState<DiscussionChannel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editingChannel, setEditingChannel] = useState<DiscussionChannel | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userRole, setUserRole] = useState<UserRole | null>(null);

    useEffect(() => {
        const init = async () => {
            // 1. Fetch User Role
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                if (profile) setUserRole(profile.role);
            }

            // 2. Fetch Channels
            fetchChannels();
        };

        init();
    }, []);

    const fetchChannels = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/discussions/channels");
            if (!res.ok) throw new Error("Failed to load channels");
            const data = await res.json();
            setChannels(data.channels);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingChannel(null);
        setIsModalOpen(true);
    };

    const handleEdit = (e: React.MouseEvent, channel: DiscussionChannel) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();
        setEditingChannel(channel);
        setIsModalOpen(true);
    };

    const handleSuccess = () => {
        fetchChannels();
    };


    if (loading) return <div className="p-10 text-center">Loading community...</div>;
    if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

    // Use Capability Helpers
    const canEditChannels = canManageChannels(userRole);
    const canManageAll = canManageUsers(userRole); // For broader admin

    // Grouping Logic
    const grouped = {
        public: channels.filter(c => c.visibility === 'public'),
        members: channels.filter(c => ['members', 'logged_in', 'party_only'].includes(c.visibility)),
        leadership: channels.filter(c => ['central_committee', 'board_only', 'leadership', 'internal'].includes(c.visibility)),
    };

    const renderChannelCard = (channel: DiscussionChannel) => (
        <Link key={channel.id} href={`/commune/${channel.slug || channel.id}`} className="block group h-full relative">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:border-brand-blue/50 h-full flex flex-col relative">
                {canEditChannels && (
                    <button
                        onClick={(e) => handleEdit(e, channel)}
                        className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-brand-blue hover:bg-blue-50 rounded-full transition-colors z-10"
                        title="Edit Channel"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                )}
                <div className="flex justify-between items-start mb-2 pr-6">
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-brand-blue transition-colors">
                        {channel.name}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-500 uppercase font-semibold">
                        {channel.visibility.replace('_', ' ')}
                    </span>
                </div>
                {channel.name_ne && (
                    <h4 className="text-sm font-medium text-slate-500 mb-2 font-nepali">{channel.name_ne}</h4>
                )}
                <div className="flex-grow">
                    <p className="text-slate-600 text-sm mb-1 line-clamp-3">
                        {channel.description_en || channel.description}
                    </p>
                    {channel.description_ne && (
                        <p className="text-slate-500 text-xs italic font-nepali">
                            {channel.description_ne}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <div className="mb-10 text-center relative">
                <h1 className="text-4xl font-bold text-brand-navy mb-2">Community Discussions</h1>
                <p className="text-slate-600">Join the conversation. Select a channel below.</p>

                {/* Admin Create Button - Top Right or Centered? Let's put it floating fixed or inline. Inline bottom is safer. */}
            </div>

            {channels.length === 0 ? (
                <div className="text-center p-10 bg-slate-50 rounded-lg">
                    <p>No discussion channels available to you yet.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* Public Section */}
                    {grouped.public.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px bg-slate-200 flex-grow"></div>
                                <h2 className="text-2xl font-bold text-brand-blue">Open Public Forum</h2>
                                <div className="h-px bg-slate-200 flex-grow"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {grouped.public.map(renderChannelCard)}
                            </div>
                        </section>
                    )}

                    {/* Members Section */}
                    {grouped.members.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px bg-slate-200 flex-grow"></div>
                                <h2 className="text-2xl font-bold text-brand-red">Members Area</h2>
                                <div className="h-px bg-slate-200 flex-grow"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {grouped.members.map(renderChannelCard)}
                            </div>
                        </section>
                    )}

                    {/* Leadership Section */}
                    {grouped.leadership.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px bg-slate-200 flex-grow"></div>
                                <h2 className="text-2xl font-bold text-slate-800">Leadership Circle</h2>
                                <div className="h-px bg-slate-200 flex-grow"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {grouped.leadership.map(renderChannelCard)}
                            </div>
                        </section>
                    )}
                </div>
            )}

            {/* Admin Create Action */}
            {canEditChannels && (
                <div className="mt-12 text-center">
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-navy text-white rounded-full font-bold shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Create New Channel
                    </button>
                    <p className="text-xs text-slate-400 mt-2">Visible only to Admins & Yantriks</p>
                </div>
            )}

            <ChannelModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
                editChannel={editingChannel}
            />
        </div>
    );
}
