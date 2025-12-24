"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getUserCommittees, listIssuesForCommittee, updateIssueStatus, escalateIssue } from "@/actions/committee";
import { OrgCommitteeMember, OrgIssue, IssueStatus, canEscalate } from "@/types/org";
import {
    Inbox, CheckCircle2, ArrowUpCircle,
    ChevronRight, Filter, Plus, User, Calendar, Building
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

// Status badge colors
const STATUS_COLORS: Record<IssueStatus, string> = {
    'open': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'in_progress': 'bg-blue-100 text-blue-800 border-blue-200',
    'resolved': 'bg-green-100 text-green-800 border-green-200',
    'escalated': 'bg-purple-100 text-purple-800 border-purple-200',
    'closed': 'bg-slate-100 text-slate-600 border-slate-200'
};

const PRIORITY_COLORS: Record<string, string> = {
    'low': 'bg-slate-100 text-slate-600',
    'medium': 'bg-blue-100 text-blue-700',
    'high': 'bg-orange-100 text-orange-700',
    'urgent': 'bg-red-100 text-red-700'
};

export default function CommitteeInboxPage() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [committees, setCommittees] = useState<OrgCommitteeMember[]>([]);
    const [selectedCommittee, setSelectedCommittee] = useState<string | null>(null);
    const [issues, setIssues] = useState<OrgIssue[]>([]);
    const [statusFilter, setStatusFilter] = useState<IssueStatus | ''>('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        loadCommittees();
    }, []);

    useEffect(() => {
        if (selectedCommittee) {
            loadIssues();
        }
    }, [selectedCommittee, statusFilter]);

    const loadCommittees = async () => {
        setLoading(true);
        const data = await getUserCommittees();
        setCommittees(data);
        if (data.length > 0) {
            setSelectedCommittee(data[0].committee_id);
        }
        setLoading(false);
    };

    const loadIssues = async () => {
        if (!selectedCommittee) return;
        const data = await listIssuesForCommittee(
            selectedCommittee,
            statusFilter || undefined
        );
        setIssues(data);
    };

    const handleResolve = async (issueId: string) => {
        setActionLoading(issueId);
        await updateIssueStatus(issueId, 'resolved');
        await loadIssues();
        setActionLoading(null);
    };

    const handleEscalate = async (issueId: string) => {
        setActionLoading(issueId);
        const result = await escalateIssue(issueId, "Escalated by committee member");
        if (result.success) {
            await loadIssues();
        }
        setActionLoading(null);
    };

    const currentCommittee = committees.find(c => c.committee_id === selectedCommittee);
    const isInfoOfficer = currentCommittee?.is_information_officer;

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    if (committees.length === 0) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="text-center py-20">
                    <Building className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                    <h2 className="text-xl font-semibold text-slate-700">
                        {t("तपाईं कुनै समितिको सदस्य हुनुहुन्न", "You are not a member of any committee")}
                    </h2>
                    <p className="text-slate-500 mt-2">
                        {t("कृपया प्रशासकसँग सम्पर्क गर्नुहोस्", "Please contact an administrator")}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-brand-navy flex items-center gap-2">
                        <Inbox className="text-brand-blue" />
                        {t("समिति इनबक्स", "Committee Inbox")}
                    </h1>
                    {isInfoOfficer && (
                        <span className="text-sm bg-brand-blue/10 text-brand-blue px-2 py-1 rounded mt-1 inline-block">
                            {t("सूचना अधिकृत", "Information Officer")}
                        </span>
                    )}
                </div>

                <Link
                    href="/committee/new-issue"
                    className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red/90 transition"
                >
                    <Plus size={18} />
                    {t("नयाँ मुद्दा", "New Issue")}
                </Link>
            </div>

            {/* Committee Selector */}
            {committees.length > 1 && (
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {committees.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setSelectedCommittee(c.committee_id)}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${selectedCommittee === c.committee_id
                                ? 'bg-brand-navy text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            {c.committee?.name || c.committee?.level_key}
                            {c.is_information_officer && (
                                <span className="ml-2 text-xs opacity-75">★</span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-slate-600">
                    <Filter size={16} />
                    <span className="text-sm font-medium">{t("फिल्टर", "Filter")}:</span>
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as IssueStatus | '')}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                    <option value="">{t("सबै स्थिति", "All Status")}</option>
                    <option value="open">{t("खुला", "Open")}</option>
                    <option value="in_progress">{t("प्रगतिमा", "In Progress")}</option>
                    <option value="resolved">{t("समाधान भयो", "Resolved")}</option>
                    <option value="escalated">{t("माथि पठाइयो", "Escalated")}</option>
                </select>

                <span className="text-sm text-slate-500 ml-auto">
                    {issues.length} {t("मुद्दाहरू", "issues")}
                </span>
            </div>

            {/* Issues List */}
            <div className="space-y-3">
                {issues.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50 rounded-xl">
                        <CheckCircle2 className="mx-auto h-12 w-12 text-green-400 mb-3" />
                        <p className="text-slate-600">
                            {t("कुनै मुद्दा छैन", "No issues found")}
                        </p>
                    </div>
                ) : (
                    issues.map((issue) => (
                        <div
                            key={issue.id}
                            className="bg-white border border-slate-200 rounded-xl p-4 hover:border-brand-blue/30 transition"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${STATUS_COLORS[issue.status]}`}>
                                            {issue.status.replace('_', ' ')}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${PRIORITY_COLORS[issue.priority]}`}>
                                            {issue.priority}
                                        </span>
                                    </div>

                                    <h3 className="font-semibold text-slate-800 mb-1">
                                        {issue.subject}
                                    </h3>

                                    {issue.body && (
                                        <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                                            {issue.body}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <User size={12} />
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {(issue as any).creator?.full_name || 'Unknown'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(issue.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 ml-4">
                                    {issue.status !== 'resolved' && issue.status !== 'closed' && (
                                        <>
                                            <button
                                                onClick={() => handleResolve(issue.id)}
                                                disabled={actionLoading === issue.id}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                                                title={t("समाधान गर्नुहोस्", "Resolve")}
                                            >
                                                <CheckCircle2 size={20} />
                                            </button>

                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {canEscalate((issue as any).current_committee?.level_key) && (
                                                <button
                                                    onClick={() => handleEscalate(issue.id)}
                                                    disabled={actionLoading === issue.id}
                                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition disabled:opacity-50"
                                                    title={t("माथि पठाउनुहोस्", "Escalate")}
                                                >
                                                    <ArrowUpCircle size={20} />
                                                </button>
                                            )}
                                        </>
                                    )}

                                    <Link
                                        href={`/committee/issue/${issue.id}`}
                                        className="p-2 text-slate-400 hover:text-brand-blue hover:bg-slate-50 rounded-lg transition"
                                    >
                                        <ChevronRight size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
