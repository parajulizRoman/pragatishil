"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Users, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";
// Badge component available if needed
import { useLanguage } from "@/context/LanguageContext";
import {
    getChannelMembers,
    removeChannelMember,
    updateChannelMemberRole,
    bulkAddChannelMembers,
    ChannelMember
} from "@/actions/channelMembers";

interface ChannelMembersModalProps {
    isOpen: boolean;
    onClose: () => void;
    channelId: string;
    channelName: string;
}

// Role badge colors
const roleBadgeColors: Record<string, string> = {
    viewer: "bg-slate-100 text-slate-600",
    member: "bg-blue-100 text-blue-700",
    moderator: "bg-purple-100 text-purple-700",
    incharge: "bg-red-100 text-red-700"
};

export default function ChannelMembersModal({
    isOpen,
    onClose,
    channelId,
    channelName
}: ChannelMembersModalProps) {
    const { t } = useLanguage();
    const [members, setMembers] = useState<ChannelMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<'members' | 'add'>('members');

    // Individual add member feature - TODO: implement user search

    // Bulk add state
    const [bulkFilter, setBulkFilter] = useState({
        role: "",
        state: "",
        district: "",
        department: ""
    });
    const [bulkAdding, setBulkAdding] = useState(false);

    useEffect(() => {
        if (isOpen && channelId) {
            loadMembers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, channelId]);

    const loadMembers = async () => {
        setLoading(true);
        const data = await getChannelMembers(channelId);
        setMembers(data);
        setLoading(false);
    };

    const handleRemoveMember = async (userId: string) => {
        if (!confirm(t("के तपाईं यो सदस्यलाई हटाउन चाहनुहुन्छ?", "Remove this member from the channel?"))) return;

        const result = await removeChannelMember(channelId, userId);
        if (result.success) {
            loadMembers();
        } else {
            alert(result.error);
        }
    };

    const handleRoleChange = async (userId: string, newRole: 'viewer' | 'member' | 'moderator' | 'admin') => {
        const result = await updateChannelMemberRole(channelId, userId, newRole);
        if (result.success) {
            loadMembers();
        } else {
            alert(result.error);
        }
    };

    // TODO: Add individual member search/add feature

    const handleBulkAdd = async () => {
        if (!bulkFilter.role && !bulkFilter.state && !bulkFilter.district && !bulkFilter.department) {
            alert(t("कम्तीमा एउटा फिल्टर छान्नुहोस्", "Select at least one filter"));
            return;
        }

        setBulkAdding(true);
        const result = await bulkAddChannelMembers(channelId, bulkFilter);

        if (result.success) {
            alert(t(`${result.count} सदस्यहरू थपियो`, `Added ${result.count} members`));
            loadMembers();
            setActiveTab('members');
        } else {
            alert(result.error);
        }
        setBulkAdding(false);
    };

    if (!isOpen) return null;

    const filteredMembers = members.filter(m =>
        m.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Users className="text-brand-blue" size={24} />
                        <div>
                            <Typography variant="h3" className="text-lg font-bold">
                                {t("च्यानल सदस्यहरू", "Channel Members")}
                            </Typography>
                            <Typography variant="muted" className="text-sm">{channelName}</Typography>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 px-5">
                    <button
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'members'
                            ? 'border-brand-blue text-brand-blue'
                            : 'border-transparent text-slate-500'
                            }`}
                        onClick={() => setActiveTab('members')}
                    >
                        <Users size={16} className="inline mr-2" />
                        {t("सदस्यहरू", "Members")} ({members.length})
                    </button>
                    <button
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'add'
                            ? 'border-brand-blue text-brand-blue'
                            : 'border-transparent text-slate-500'
                            }`}
                        onClick={() => setActiveTab('add')}
                    >
                        <UserPlus size={16} className="inline mr-2" />
                        {t("थप्नुहोस्", "Add Members")}
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5">
                    {activeTab === 'members' ? (
                        <div className="space-y-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <Input
                                    placeholder={t("सदस्य खोज्नुहोस्...", "Search members...")}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Members List */}
                            {loading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                                            <Skeleton className="w-10 h-10 rounded-full" />
                                            <div className="flex-1">
                                                <Skeleton className="h-4 w-32 mb-1" />
                                                <Skeleton className="h-3 w-24" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredMembers.length === 0 ? (
                                <div className="text-center py-8 text-slate-400">
                                    {members.length === 0
                                        ? t("कुनै सदस्य छैन", "No members yet")
                                        : t("खोजी मिलेन", "No matching members")}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredMembers.map(member => (
                                        <div
                                            key={member.id}
                                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-slate-50 transition"
                                        >
                                            {/* Avatar */}
                                            <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-medium">
                                                {member.user?.full_name?.[0] || '?'}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-slate-800 truncate">
                                                    {member.user?.full_name || 'Unknown'}
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {t("थपिएको", "Added")} {new Date(member.added_at).toLocaleDateString()}
                                                </div>
                                            </div>

                                            {/* Role Selector */}
                                            <select
                                                value={member.role}
                                                onChange={(e) => handleRoleChange(member.user_id, e.target.value as 'viewer' | 'member' | 'moderator' | 'admin')}
                                                className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${roleBadgeColors[member.role]}`}
                                            >
                                                <option value="viewer">{t("हेर्ने", "Viewer")}</option>
                                                <option value="member">{t("सदस्य", "Member")}</option>
                                                <option value="moderator">{t("मोडेरेटर", "Moderator")}</option>
                                                <option value="incharge">{t("इन्चार्ज", "Incharge")}</option>
                                            </select>

                                            {/* Remove */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveMember(member.user_id)}
                                                className="h-8 w-8 text-slate-400 hover:text-red-500"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Bulk Add by Filter */}
                            <div className="p-4 bg-slate-50 rounded-lg space-y-4">
                                <Typography variant="h4" className="text-base font-semibold">
                                    {t("फिल्टर अनुसार थप्नुहोस्", "Bulk Add by Filter")}
                                </Typography>
                                <Typography variant="muted" className="text-sm">
                                    {t("भूमिका, राज्य, जिल्ला वा विभाग अनुसार सदस्यहरू थप्नुहोस्",
                                        "Add all users matching the selected filters")}
                                </Typography>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">
                                            {t("भूमिका", "Role")}
                                        </label>
                                        <select
                                            value={bulkFilter.role}
                                            onChange={(e) => setBulkFilter({ ...bulkFilter, role: e.target.value })}
                                            className="w-full h-9 rounded-md border px-3 text-sm"
                                        >
                                            <option value="">{t("सबै", "All")}</option>
                                            <option value="ward_committee">Ward Committee</option>
                                            <option value="palika_committee">Palika Committee</option>
                                            <option value="district_committee">District Committee</option>
                                            <option value="state_committee">State Committee</option>
                                            <option value="central_committee">Central Committee</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">
                                            {t("विभाग", "Department")}
                                        </label>
                                        <select
                                            value={bulkFilter.department}
                                            onChange={(e) => setBulkFilter({ ...bulkFilter, department: e.target.value })}
                                            className="w-full h-9 rounded-md border px-3 text-sm"
                                        >
                                            <option value="">{t("सबै", "All")}</option>
                                            <option value="health">Health</option>
                                            <option value="education">Education</option>
                                            <option value="agriculture">Agriculture</option>
                                            <option value="infrastructure">Infrastructure</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">
                                            {t("राज्य", "State")}
                                        </label>
                                        <Input
                                            placeholder="e.g. Bagmati"
                                            value={bulkFilter.state}
                                            onChange={(e) => setBulkFilter({ ...bulkFilter, state: e.target.value })}
                                            className="h-9"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">
                                            {t("जिल्ला", "District")}
                                        </label>
                                        <Input
                                            placeholder="e.g. Kathmandu"
                                            value={bulkFilter.district}
                                            onChange={(e) => setBulkFilter({ ...bulkFilter, district: e.target.value })}
                                            className="h-9"
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={handleBulkAdd}
                                    disabled={bulkAdding}
                                    className="w-full"
                                >
                                    <Plus size={16} className="mr-2" />
                                    {bulkAdding
                                        ? t("थप्दै...", "Adding...")
                                        : t("मिल्ने सदस्यहरू थप्नुहोस्", "Add Matching Members")}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
