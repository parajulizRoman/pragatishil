"use client";

import React, { useState, useMemo } from "react";
import { Profile, UserRole } from "@/types";
import MemberTabs, { MemberTab } from "./components/MemberTabs";
import MemberCard, { MemberCardSkeleton } from "./components/MemberCard";
import MemberSearch from "./components/MemberSearch";
import GeoFilter from "./components/GeoFilter";
import ProfessionFilter from "./components/ProfessionFilter";
import { Typography } from "@/components/ui/typography";
import { Grid, List, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface MembersClientProps {
    members: Profile[];
}

// Define leadership roles
const LEADERSHIP_ROLES: UserRole[] = ['admin', 'yantrik', 'admin_party', 'board', 'central_committee'];
const COMMITTEE_ROLES: UserRole[] = ['central_committee'];

export default function MembersClient({ members }: MembersClientProps) {
    // Tab state
    const [activeTab, setActiveTab] = useState<MemberTab>("community");

    // View mode
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
    const [selectedLocalLevel, setSelectedLocalLevel] = useState<number | null>(null);
    const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);

    // Filter members based on tab
    const tabFilteredMembers = useMemo(() => {
        switch (activeTab) {
            case "leadership":
                return members.filter(m => LEADERSHIP_ROLES.includes(m.role));
            case "committee":
                return members.filter(m => COMMITTEE_ROLES.includes(m.role));
            case "community":
            default:
                return members.filter(m => m.is_public);
        }
    }, [members, activeTab]);

    // Apply additional filters
    const filteredMembers = useMemo(() => {
        let result = tabFilteredMembers;

        // Search filter (name, handle, bio, expertise)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(m =>
                m.full_name?.toLowerCase().includes(query) ||
                m.handle?.toLowerCase().includes(query) ||
                m.bio?.toLowerCase().includes(query) ||
                m.expertise?.some(e => e.toLowerCase().includes(query)) ||
                m.profession?.toLowerCase().includes(query)
            );
        }

        // Geo filters
        if (selectedProvince) {
            result = result.filter(m => m.province_id === selectedProvince);
        }
        if (selectedDistrict) {
            result = result.filter(m => m.district_id === selectedDistrict);
        }
        if (selectedLocalLevel) {
            result = result.filter(m => m.local_level_id === selectedLocalLevel);
        }

        // Profession filter
        if (selectedProfessions.length > 0) {
            result = result.filter(m =>
                m.profession_category && selectedProfessions.includes(m.profession_category)
            );
        }

        return result;
    }, [tabFilteredMembers, searchQuery, selectedProvince, selectedDistrict, selectedLocalLevel, selectedProfessions]);

    // Count for tabs
    const counts = useMemo(() => ({
        leadership: members.filter(m => LEADERSHIP_ROLES.includes(m.role)).length,
        committee: members.filter(m => COMMITTEE_ROLES.includes(m.role)).length,
        community: members.filter(m => m.is_public).length,
    }), [members]);

    // Check if any filters are active
    const hasActiveFilters = searchQuery || selectedProvince || selectedDistrict || selectedLocalLevel || selectedProfessions.length > 0;

    // Reset all filters
    const resetFilters = () => {
        setSearchQuery("");
        setSelectedProvince(null);
        setSelectedDistrict(null);
        setSelectedLocalLevel(null);
        setSelectedProfessions([]);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            {/* Header */}
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-10">
                    <Typography as="h1" variant="h1" className="mb-3">
                        <span className="text-brand-blue">Progressive</span>{" "}
                        <span className="text-brand-red">Community</span>
                    </Typography>
                    <Typography variant="large" className="text-slate-600">
                        प्रगतिशील समुदाय • Meet Our Members
                    </Typography>
                </div>

                {/* Tabs */}
                <MemberTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    counts={counts}
                />

                {/* Filters Bar */}
                <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm">
                    {/* Search */}
                    <MemberSearch
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search by name, @handle..."
                    />

                    {/* Geo Filter - only for committee/community */}
                    {(activeTab === "committee" || activeTab === "community") && (
                        <GeoFilter
                            selectedProvince={selectedProvince}
                            selectedDistrict={selectedDistrict}
                            selectedLocalLevel={selectedLocalLevel}
                            onProvinceChange={setSelectedProvince}
                            onDistrictChange={setSelectedDistrict}
                            onLocalLevelChange={setSelectedLocalLevel}
                        />
                    )}

                    {/* Profession Filter - only for community */}
                    {activeTab === "community" && (
                        <ProfessionFilter
                            selected={selectedProfessions}
                            onChange={setSelectedProfessions}
                        />
                    )}

                    {/* Right side controls */}
                    <div className="flex items-center gap-2 ml-auto">
                        {/* Reset Filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={resetFilters}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Reset
                            </button>
                        )}

                        {/* View Mode Toggle */}
                        <div className="flex bg-slate-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={cn(
                                    "p-1.5 rounded",
                                    viewMode === "grid" ? "bg-white shadow-sm" : "text-slate-400"
                                )}
                            >
                                <Grid className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={cn(
                                    "p-1.5 rounded",
                                    viewMode === "list" ? "bg-white shadow-sm" : "text-slate-400"
                                )}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6 text-sm text-slate-500">
                    Showing {filteredMembers.length} {filteredMembers.length === 1 ? "member" : "members"}
                    {hasActiveFilters && " (filtered)"}
                </div>

                {/* Member Grid */}
                {filteredMembers.length === 0 ? (
                    <div className="text-center py-16">
                        <Typography variant="h4" className="text-slate-400 mb-2">
                            No members found
                        </Typography>
                        <Typography variant="muted">
                            Try adjusting your filters or search query
                        </Typography>
                        {hasActiveFilters && (
                            <button
                                onClick={resetFilters}
                                className="mt-4 text-brand-blue hover:underline"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {filteredMembers.map((member) => (
                            <MemberCard key={member.id} member={member} />
                        ))}
                    </div>
                ) : (
                    // List View
                    <div className="space-y-3">
                        {filteredMembers.map((member) => (
                            <MemberCard key={member.id} member={member} showDetails />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

// Loading state component
export function MembersLoading() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-10">
                    <div className="h-10 w-64 bg-slate-100 rounded-lg mx-auto mb-4 animate-pulse" />
                    <div className="h-6 w-48 bg-slate-100 rounded mx-auto animate-pulse" />
                </div>

                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-10 w-28 bg-slate-100 rounded-full animate-pulse" />
                    ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <MemberCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </main>
    );
}
