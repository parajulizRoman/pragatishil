"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Compass,
    Users,
    Radio,
    Bell,
    PlusSquare,
    User,
    MoreHorizontal,
    Search,
    MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
    icon: React.ReactNode;
    label: string;
    href: string;
    badge?: number;
    requiresAuth?: boolean;
    onClick?: () => void;
}

interface FeedSidebarProps {
    isAuthenticated: boolean;
    userAvatar?: string | null;
    userName?: string;
    onUploadClick?: () => void;
    onSignInClick?: () => void;
    onExploreClick?: () => void;
}

export default function FeedSidebar({
    isAuthenticated,
    userAvatar,
    userName,
    onUploadClick,
    onSignInClick,
    onExploreClick,
}: FeedSidebarProps) {
    const pathname = usePathname();

    const navItems: NavItem[] = [
        {
            icon: <Home className="w-6 h-6" />,
            label: "For You",
            href: "/commune/khulla-manch",
        },
        {
            icon: <Compass className="w-6 h-6" />,
            label: "Explore",
            href: "#explore",
            onClick: onExploreClick,
        },
        {
            icon: <Users className="w-6 h-6" />,
            label: "Following",
            href: "/commune/khulla-manch?filter=following",
            requiresAuth: true,
        },
        {
            icon: <Radio className="w-6 h-6" />,
            label: "LIVE",
            href: "#",
        },
        {
            icon: <MessageCircle className="w-6 h-6" />,
            label: "Messages",
            href: "/messages",
            requiresAuth: true,
        },
        {
            icon: <Bell className="w-6 h-6" />,
            label: "Activity",
            href: "/notifications",
            requiresAuth: true,
        },
    ];

    const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
        if (item.onClick) {
            e.preventDefault();
            item.onClick();
            return;
        }
        if (item.requiresAuth && !isAuthenticated) {
            e.preventDefault();
            onSignInClick?.();
        }
    };

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen bg-white dark:bg-black border-r border-slate-200 dark:border-slate-800 fixed left-0 top-0 z-40">
            {/* Logo */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold text-brand-red">प्रगतिशील</span>
                    <span className="text-xl font-bold text-brand-blue">TV</span>
                </Link>
            </div>

            {/* Search */}
            <div className="px-4 py-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/50"
                    />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={(e) => handleNavClick(item, e)}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors group",
                                isActive
                                    ? "text-brand-red font-semibold"
                                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            <span className={cn(
                                "transition-transform group-hover:scale-110",
                                isActive && "text-brand-red"
                            )}>
                                {item.icon}
                            </span>
                            <span className="text-lg">{item.label}</span>
                            {item.badge && item.badge > 0 && (
                                <span className="ml-auto bg-brand-red text-white text-xs px-2 py-0.5 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}

                {/* Upload Button */}
                <button
                    onClick={isAuthenticated ? onUploadClick : onSignInClick}
                    className="flex items-center gap-4 px-4 py-3 w-full rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                >
                    <PlusSquare className="w-6 h-6 transition-transform group-hover:scale-110" />
                    <span className="text-lg">Upload</span>
                </button>

                {/* Profile */}
                {isAuthenticated ? (
                    <Link
                        href="/settings/profile"
                        className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                    >
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                            {userAvatar ? (
                                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-4 h-4 text-slate-500" />
                            )}
                        </div>
                        <span className="text-lg">Profile</span>
                    </Link>
                ) : (
                    <button
                        onClick={onSignInClick}
                        className="flex items-center gap-4 px-4 py-3 w-full rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                    >
                        <User className="w-6 h-6" />
                        <span className="text-lg">Sign In</span>
                    </button>
                )}

                {/* More */}
                <button className="flex items-center gap-4 px-4 py-3 w-full rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                    <MoreHorizontal className="w-6 h-6" />
                    <span className="text-lg">More</span>
                </button>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-400">© 2026 Pragatishil TV</p>
            </div>
        </aside>
    );
}
