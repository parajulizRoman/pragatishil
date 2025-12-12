"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DiscussionChannel } from "@/types";
// import { createBrowserClient } from "@supabase/ssr"; // Unused

export default function CommuneLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [channels, setChannels] = useState<DiscussionChannel[]>([]);
    // const [loading, setLoading] = useState(true); // Unused for now, or use it for skeleton

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const res = await fetch("/api/discussions/channels");
                if (res.ok) {
                    const data = await res.json();
                    setChannels(data.channels);
                }
            } catch (err) {
                console.error("Failed to load sidebar channels", err);
            } finally {
                // setLoading(false);
            }
        };
        fetchChannels();
    }, []);

    // Grouping (Simplified for Sidebar)
    const menuGroups = {
        public: channels.filter(c => c.visibility === 'public'),
        members: channels.filter(c => ['members', 'logged_in', 'party_only'].includes(c.visibility)),
        leadership: channels.filter(c => ['central_committee', 'board_only', 'leadership', 'internal'].includes(c.visibility)),
    };

    return (
        <div className="flex min-h-screen bg-slate-50 pt-16">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 bg-white border-r border-slate-200 fixed h-full overflow-y-auto pb-20">
                <div className="p-4">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Discussions</h2>

                    <div className="space-y-6">
                        {/* Public */}
                        {menuGroups.public.length > 0 && (
                            <div>
                                <h3 className="text-xs font-semibold text-brand-blue mb-2 px-2 flex items-center gap-1">
                                    Open Forum
                                </h3>
                                <ul className="space-y-1">
                                    {menuGroups.public.map(c => (
                                        <li key={c.id}>
                                            <Link
                                                href={`/commune/${c.id}`}
                                                className={`block px-2 py-1.5 rounded-md text-sm transition-colors ${pathname.includes(c.id) ? 'bg-blue-50 text-brand-blue font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                            >
                                                # {c.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Members */}
                        {menuGroups.members.length > 0 && (
                            <div>
                                <h3 className="text-xs font-semibold text-brand-red mb-2 px-2 flex items-center gap-1">
                                    Members
                                </h3>
                                <ul className="space-y-1">
                                    {menuGroups.members.map(c => (
                                        <li key={c.id}>
                                            <Link
                                                href={`/commune/${c.id}`}
                                                className={`block px-2 py-1.5 rounded-md text-sm transition-colors ${pathname.includes(c.id) ? 'bg-red-50 text-brand-red font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                            >
                                                # {c.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Leadership */}
                        {menuGroups.leadership.length > 0 && (
                            <div>
                                <h3 className="text-xs font-semibold text-slate-800 mb-2 px-2 flex items-center gap-1">
                                    Leadership
                                </h3>
                                <ul className="space-y-1">
                                    {menuGroups.leadership.map(c => (
                                        <li key={c.id}>
                                            <Link
                                                href={`/commune/${c.id}`}
                                                className={`block px-2 py-1.5 rounded-md text-sm transition-colors ${pathname.includes(c.id) ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                            >
                                                🔒 {c.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-64 w-full">
                {children}
            </main>
        </div>
    );
}
