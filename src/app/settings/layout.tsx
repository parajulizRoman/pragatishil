"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, FileText } from "lucide-react";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const tabs = [
        { name: "Public Profile", href: "/settings/profile", icon: User },
        { name: "Membership Data", href: "/settings/membership", icon: FileText },
    ];

    return (
        <div className="min-h-screen pt-20 pb-20 bg-slate-50">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
                    <div className="flex space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-fit">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = pathname === tab.href;
                            return (
                                <Link
                                    key={tab.name}
                                    href={tab.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? "bg-brand-blue text-white shadow-sm"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    <Icon size={16} />
                                    {tab.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
}
