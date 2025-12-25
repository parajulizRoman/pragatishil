"use client";

import { useState } from "react";
import { Crown, Users, Hash, Shield, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Tab components
import CouncilMembersTab from "./CouncilMembersTab";
import ChannelsTab from "./ChannelsTab";
import UserChannelsTab from "./UserChannelsTab";
import RolesTab from "./RolesTab";
import DepartmentsTab from "./DepartmentsTab";

type TabType = "council" | "roles" | "departments" | "channels" | "user-channels";

export default function CouncilPageClient() {
    const [activeTab, setActiveTab] = useState<TabType>("council");

    const tabs = [
        { id: "council" as TabType, label: "Council", icon: Crown },
        { id: "roles" as TabType, label: "Roles", icon: Shield },
        { id: "departments" as TabType, label: "Departments", icon: Building2 },
        { id: "channels" as TabType, label: "Channels", icon: Hash },
        { id: "user-channels" as TabType, label: "User Access", icon: Users },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-navy">Party Council</h1>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap",
                            activeTab === tab.id
                                ? "border-brand-blue text-brand-blue"
                                : "border-transparent text-muted-foreground hover:text-slate-800"
                        )}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === "council" && <CouncilMembersTab />}
                {activeTab === "roles" && <RolesTab />}
                {activeTab === "departments" && <DepartmentsTab />}
                {activeTab === "channels" && <ChannelsTab />}
                {activeTab === "user-channels" && <UserChannelsTab />}
            </div>
        </div>
    );
}
