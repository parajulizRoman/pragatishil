"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    LayoutDashboard,
    Settings,
    FileText,
    Newspaper,
    Image,
    LogOut,
    Menu,
    X,
    Users,
    UserCog,
    Shield,
    Skull
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/join"); // Redirect to login/join if not authenticated
                // Note: In a real app, we'd have a dedicated /login page for admins
            }
            setLoading(false);
        };
        checkAuth();
    }, [router, supabase]);

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "User Management", href: "/admin/users", icon: UserCog },
        { name: "Council", href: "/admin/council", icon: Users },
        { name: "Audit Logs", href: "/admin/audit", icon: Shield },
        { name: "Graveyard", href: "/admin/graveyard", icon: Skull },
        { name: "General Settings", href: "/admin/settings", icon: Settings },
        { name: "Pages Content", href: "/admin/pages", icon: FileText },
        { name: "News Room", href: "/admin/news", icon: Newspaper },
        { name: "Media Gallery", href: "/admin/media", icon: Image },
    ];

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center bg-slate-100">Loading Admin...</div>;
    }

    return (
        <div className="flex h-screen bg-slate-100">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between h-16 px-4 bg-slate-950">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-brand-red to-brand-blue bg-clip-text text-transparent">
                        CMS Admin
                    </h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? "bg-brand-blue/20 text-brand-blue font-medium"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    }`}
                            >
                                <Icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-3 text-slate-400 hover:text-red-400 transition-colors w-full px-4 py-2"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center h-16 bg-white shadow-sm px-4 md:px-8">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="mr-4 md:hidden text-slate-500 hover:text-brand-blue"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex ml-auto items-center space-x-4">
                        <span className="text-sm text-slate-500">Admin Mode</span>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
