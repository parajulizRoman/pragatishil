"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { Users, Crown, Building2 } from "lucide-react";

export type MemberTab = "leadership" | "committee" | "community";

interface MemberTabsProps {
    activeTab: MemberTab;
    onTabChange: (tab: MemberTab) => void;
    counts?: {
        leadership: number;
        committee: number;
        community: number;
    };
}

const TABS: { id: MemberTab; label: string; labelNe: string; icon: React.ReactNode }[] = [
    { id: "leadership", label: "Leadership", labelNe: "नेतृत्व", icon: <Crown size={16} /> },
    { id: "committee", label: "Committee", labelNe: "समिति", icon: <Building2 size={16} /> },
    { id: "community", label: "Community", labelNe: "समुदाय", icon: <Users size={16} /> },
];

export default function MemberTabs({ activeTab, onTabChange, counts }: MemberTabsProps) {
    const { language } = useLanguage();
    const isNepali = language === 'ne';

    return (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
            {TABS.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 text-sm",
                        activeTab === tab.id
                            ? "bg-brand-navy text-white shadow-lg scale-105"
                            : "bg-white/70 text-slate-600 hover:bg-white hover:shadow-md border border-slate-200"
                    )}
                >
                    {tab.icon}
                    <span>{isNepali ? tab.labelNe : tab.label}</span>
                    {counts && counts[tab.id] > 0 && (
                        <span className={cn(
                            "ml-1 px-2 py-0.5 rounded-full text-xs",
                            activeTab === tab.id
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 text-slate-500"
                        )}>
                            {counts[tab.id]}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}

