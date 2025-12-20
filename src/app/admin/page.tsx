"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Newspaper, Image, Users, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [stats, setStats] = useState({
        newsCount: 0,
        mediaCount: 0,
        membersCount: 0,
        views: 1234
    });

    useEffect(() => {
        const init = async () => {
            const supabase = createClient();

            // 1. Fetch Role
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: p } = await supabase.from('profiles').select('role').eq('id', user.id).single();
                setUserRole(p?.role || "guest");
            }

            // 2. Mock Stats / Fetch Real Stats
            // In real app, we would fetch counts here
            setTimeout(() => {
                setStats({
                    newsCount: 12, // Replace with count(*)
                    mediaCount: 45,
                    membersCount: 150,
                    views: 5420
                });
                setLoading(false);
            }, 600);
        };

        init();
    }, []);

    // Access Control Helpers
    const canManageUsers = userRole && ['admin', 'yantrik', 'admin_party', 'board'].includes(userRole);
    // Hero editing is now strict: Admin/Party/Yantrik/Board only.
    const canEditHero = canManageUsers;
    const canViewSettings = canManageUsers;

    const cards = [
        { label: "Total News Articles", value: stats.newsCount, icon: Newspaper, color: "bg-brand-blue", href: "/admin/news" },
        { label: "Media Items", value: stats.mediaCount, icon: Image, color: "bg-purple-500", href: "/admin/media" },
        {
            label: "Total Members",
            value: stats.membersCount,
            icon: Users,
            color: "bg-brand-red",
            // Hide link for central_committee
            href: canManageUsers ? "/admin/users" : "#",
            disabled: !canManageUsers
        },
        { label: "Site Views (Est)", value: stats.views, icon: Eye, color: "bg-orange-500", href: "#" },
    ];

    if (loading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(idx => (
                        <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            href={card.href}
                            key={idx}
                            className={`block group ${card.disabled ? 'cursor-default pointer-events-none opacity-90' : ''}`}
                        >
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 group-hover:shadow-md transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20`}>
                                        <Icon size={24} />
                                    </div>
                                    <span className="text-slate-400 text-sm font-medium">Last 30 days</span>
                                </div>
                                <h3 className="text-3xl font-bold text-brand-navy mb-1">{card.value}</h3>
                                <p className="text-slate-600 text-sm font-medium">{card.label}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity Mock */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-brand-navy mb-4">Recent Updates</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center p-3 hover:bg-slate-50 rounded-lg transition-colors border-l-2 border-brand-blue pl-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-800">Updated Homepage Hero Text</p>
                                    <p className="text-xs text-slate-500">2 hours ago • by Admin</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-brand-navy mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/admin/news" className="p-4 bg-blue-50 text-blue-700 rounded-lg text-center font-medium hover:bg-blue-100 transition-colors">
                            + Add News
                        </Link>
                        <Link href="/admin/media" className="p-4 bg-purple-50 text-purple-700 rounded-lg text-center font-medium hover:bg-purple-100 transition-colors">
                            + Upload Media
                        </Link>

                        {canEditHero && (
                            <Link href="/admin/pages" className="p-4 bg-orange-50 text-orange-700 rounded-lg text-center font-medium hover:bg-orange-100 transition-colors">
                                Edit Hero
                            </Link>
                        )}

                        {canViewSettings && (
                            <Link href="/admin/settings" className="p-4 bg-slate-50 text-slate-700 rounded-lg text-center font-medium hover:bg-slate-100 transition-colors">
                                Settings
                            </Link>
                        )}

                        {canManageUsers && (
                            <Link href="/admin/users" className="p-4 bg-red-50 text-brand-red rounded-lg text-center font-medium hover:bg-red-100 transition-colors">
                                Manage Users
                            </Link>
                        )}

                        {/* If role is reduced (central_committee), show only allowed actions */}
                        {/* Pages Content is strictly forbidden now per new requirement */}
                    </div>
                </div>
            </div>
        </div>
    );
}
