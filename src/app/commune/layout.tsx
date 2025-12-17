"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DiscussionChannel, UserRole } from "@/types";
import { createBrowserClient } from "@supabase/ssr";
import ChannelModal from "./ChannelModal";
import { canManageChannels } from "@/lib/permissions";

export default function CommuneLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [channels, setChannels] = useState<DiscussionChannel[]>([]);
    const [userRole, setUserRole] = useState<UserRole | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChannel, setEditingChannel] = useState<DiscussionChannel | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // 1. Fetch User Role
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
        try {
            const res = await fetch("/api/discussions/channels");
            if (res.ok) {
                const data = await res.json();
                setChannels(data.channels);
            }
        } catch (err) {
            console.error("Failed to load sidebar channels", err);
        }
    };

    const handleCreate = () => {
        setEditingChannel(null);
        setIsModalOpen(true);
    };

    const handleEdit = (e: React.MouseEvent, channel: DiscussionChannel) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingChannel(channel);
        setIsModalOpen(true);
    };

    // Use Capability Helper
    const canEditChannels = canManageChannels(userRole);

    // Dynamic Grouping & Ordering
    const groupedChannels = channels.reduce((acc, channel) => {
        const cat = channel.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(channel);
        return acc;
    }, {} as Record<string, DiscussionChannel[]>);

    const CATEGORY_ORDER = ['Public Space', 'Q&A', 'Public Resources'];

    const sortedCategories = Object.keys(groupedChannels).sort((a, b) => {
        const idxA = CATEGORY_ORDER.indexOf(a);
        const idxB = CATEGORY_ORDER.indexOf(b);

        // If both in priority list, sort by index
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        // If A is priority, it goes first
        if (idxA !== -1) return -1;
        // If B is priority, it goes first
        if (idxB !== -1) return 1;

        // Otherwise alphabetical
        return a.localeCompare(b);
    });

    const renderChannelLink = (c: DiscussionChannel, icon: string, activeClass: string) => (
        <li key={c.id} className="group flex items-center justify-between hover:bg-slate-50 rounded-md">
            <Link
                href={`/commune/${c.id}`}
                className={`flex-grow block px-2 py-1.5 rounded-md text-sm transition-colors ${pathname.includes(c.id) ? activeClass : 'text-slate-600 hover:text-slate-900'} flex items-center gap-1`}
            >
                <span className="opacity-70 text-xs">{icon}</span> {c.name}
            </Link>
            {canEditChannels && (
                <button
                    onClick={(e) => handleEdit(e, c)}
                    className="p-1 text-slate-300 hover:text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity mr-1"
                    title="Edit Channel"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
            )}
        </li>
    );

    const renderCategoryGroup = (cat: string) => {
        const _channels = groupedChannels[cat].sort((a, b) => {
            // Prioritize "Khulla Manch" in any category
            if (a.name.toLowerCase().includes('khulla manch')) return -1;
            if (b.name.toLowerCase().includes('khulla manch')) return 1;
            return a.name.localeCompare(b.name);
        });

        // Default open for priority categories
        const isOpen = CATEGORY_ORDER.includes(cat) || cat === 'General';

        return (
            <details key={cat} open={isOpen} className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2 hover:text-slate-700 transition-colors">
                    <span>{cat}</span>
                    <span className="text-[10px] transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <ul className="space-y-1 mb-4 pl-1 border-l-2 border-slate-100 ml-1">
                    {_channels.map(c => {
                        let icon = '#';
                        let activeClass = 'bg-slate-100 text-slate-900 font-medium';

                        if (c.visibility === 'public') {
                            activeClass = 'bg-blue-50 text-brand-blue font-medium';
                        } else if (['members', 'party_only'].includes(c.visibility)) {
                            activeClass = 'bg-red-50 text-brand-red font-medium';
                        } else {
                            icon = '🔒';
                        }
                        return renderChannelLink(c, icon, activeClass);
                    })}
                </ul>
            </details>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 pt-16">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-16 h-[calc(100vh-4rem)] z-20">
                <div className="p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                    <div className="flex justify-between items-center mb-6 px-2 sticky top-0 bg-white pb-2 z-10">
                        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-brand-red/20 pb-1">Discussions</h2>
                        {canEditChannels && (
                            <button
                                onClick={handleCreate}
                                className="text-slate-400 hover:text-brand-blue p-1 rounded hover:bg-slate-50"
                                title="Create New Channel"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            </button>
                        )}
                    </div>

                    <div className="space-y-2">
                        {sortedCategories.map(renderCategoryGroup)}

                        {/* Fallback if no channels */}
                        {channels.length === 0 && (
                            <div className="px-2 text-xs text-slate-400 italic">No channels loaded.</div>
                        )}
                    </div>
                </div>
                {/* User Role Debug / Info */}
                <div className="p-4 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400">
                        Posting as: <span className="font-semibold text-slate-600">{userRole || 'Guest'}</span>
                    </p>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-64 w-full">
                {children}
            </main>

            {/* Modal - Global for Commune Section */}
            <ChannelModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
                editChannel={editingChannel}
            />
        </div>
    );
}
