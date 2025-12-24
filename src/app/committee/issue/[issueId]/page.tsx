"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import {
    updateIssueStatus,
    escalateIssue,
    addIssueComment,
    getIssueComments
} from "@/actions/committee";
import { OrgIssue, OrgIssueComment, canEscalate, getOrgLevelName, ESCALATION_PATH, OrgLevelKey } from "@/types/org";
import { createBrowserClient } from "@supabase/ssr";
import {
    ArrowLeft, CheckCircle2, ArrowUpCircle, MessageSquare,
    User, Calendar, Clock, Send, AlertTriangle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function IssueDetailPage() {
    const { t, language } = useLanguage();
    const params = useParams();
    const router = useRouter();
    const issueId = params.issueId as string;

    const [loading, setLoading] = useState(true);
    const [issue, setIssue] = useState<OrgIssue | null>(null);
    const [comments, setComments] = useState<OrgIssueComment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [showEscalateModal, setShowEscalateModal] = useState(false);
    const [escalateReason, setEscalateReason] = useState("");

    useEffect(() => {
        loadIssue();
        loadComments();
    }, [issueId]);

    const loadIssue = async () => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data } = await supabase
            .from("org_issues")
            .select(`
                *,
                creator:profiles!org_issues_created_by_fkey(id, full_name, avatar_url),
                current_committee:org_committees!org_issues_current_committee_id_fkey(id, level_key, name)
            `)
            .eq("id", issueId)
            .single();

        setIssue(data);
        setLoading(false);
    };

    const loadComments = async () => {
        const data = await getIssueComments(issueId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setComments(data as any);
    };

    const handleResolve = async () => {
        setActionLoading(true);
        await updateIssueStatus(issueId, 'resolved');
        await loadIssue();
        setActionLoading(false);
    };

    const handleEscalate = async () => {
        setActionLoading(true);
        const result = await escalateIssue(issueId, escalateReason);
        if (result.success) {
            setShowEscalateModal(false);
            router.push("/committee/inbox");
        }
        setActionLoading(false);
    };

    const handleComment = async () => {
        if (!newComment.trim()) return;
        setActionLoading(true);
        await addIssueComment(issueId, newComment);
        setNewComment("");
        await loadComments();
        setActionLoading(false);
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Skeleton className="h-8 w-48 mb-6" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (!issue) {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center">
                <AlertTriangle className="mx-auto h-16 w-16 text-red-400 mb-4" />
                <h2 className="text-xl font-semibold text-slate-700">
                    {t("मुद्दा फेला परेन", "Issue not found")}
                </h2>
                <Link href="/committee/inbox" className="text-brand-blue hover:underline mt-4 inline-block">
                    {t("इनबक्समा फर्कनुहोस्", "Back to Inbox")}
                </Link>
            </div>
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentLevelKey = (issue as any).current_committee?.level_key as OrgLevelKey;
    const canEscalateIssue = canEscalate(currentLevelKey);
    const nextLevel = ESCALATION_PATH[currentLevelKey];

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Back Button */}
            <Link
                href="/committee/inbox"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-blue mb-6"
            >
                <ArrowLeft size={18} />
                {t("इनबक्समा फर्कनुहोस्", "Back to Inbox")}
            </Link>

            {/* Issue Header */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${issue.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                issue.status === 'escalated' ? 'bg-purple-100 text-purple-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                {issue.status}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${issue.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                issue.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                    'bg-slate-100 text-slate-700'
                                }`}>
                                {issue.priority}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-brand-navy">
                            {issue.subject}
                        </h1>
                    </div>
                </div>

                {issue.body && (
                    <p className="text-slate-700 whitespace-pre-wrap mb-4">
                        {issue.body}
                    </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 border-t pt-4 mt-4">
                    <span className="flex items-center gap-1">
                        <User size={14} />
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {(issue as any).creator?.full_name}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(issue.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {getOrgLevelName((issue as any).current_committee?.level_key, language)}
                    </span>
                </div>

                {/* Action Buttons */}
                {issue.status !== 'resolved' && issue.status !== 'closed' && (
                    <div className="flex gap-3 mt-6 pt-4 border-t">
                        <button
                            onClick={handleResolve}
                            disabled={actionLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                        >
                            <CheckCircle2 size={18} />
                            {t("समाधान गर्नुहोस्", "Resolve")}
                        </button>

                        {canEscalateIssue && (
                            <button
                                onClick={() => setShowEscalateModal(true)}
                                disabled={actionLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                            >
                                <ArrowUpCircle size={18} />
                                {t("माथि पठाउनुहोस्", "Escalate")}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Comments Section */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h2 className="font-semibold text-brand-navy flex items-center gap-2 mb-4">
                    <MessageSquare size={18} />
                    {t("टिप्पणीहरू", "Comments")} ({comments.length})
                </h2>

                <div className="space-y-4 mb-6">
                    {comments.map((comment) => (
                        <div
                            key={comment.id}
                            className={`p-4 rounded-lg ${comment.is_internal
                                ? 'bg-amber-50 border border-amber-200'
                                : 'bg-slate-50'
                                }`}
                        >
                            {comment.is_internal && (
                                <span className="text-xs font-medium text-amber-700 mb-1 block">
                                    {t("आन्तरिक नोट", "Internal Note")}
                                </span>
                            )}
                            <p className="text-slate-700">{comment.content}</p>
                            <div className="text-xs text-slate-500 mt-2">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {(comment as any).author?.full_name} • {new Date(comment.created_at).toLocaleString()}
                            </div>
                        </div>
                    ))}

                    {comments.length === 0 && (
                        <p className="text-slate-500 text-center py-4">
                            {t("कुनै टिप्पणी छैन", "No comments yet")}
                        </p>
                    )}
                </div>

                {/* Add Comment */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={t("टिप्पणी थप्नुहोस्...", "Add a comment...")}
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                    />
                    <button
                        onClick={handleComment}
                        disabled={!newComment.trim() || actionLoading}
                        className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition disabled:opacity-50"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            {/* Escalate Modal */}
            {showEscalateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-brand-navy mb-4">
                            {t("मुद्दा माथि पठाउनुहोस्", "Escalate Issue")}
                        </h3>
                        <p className="text-slate-600 mb-4">
                            {t("यो मुद्दा", "This issue will be escalated to")}{" "}
                            <strong>{nextLevel && getOrgLevelName(nextLevel, language)}</strong>
                        </p>
                        <textarea
                            value={escalateReason}
                            onChange={(e) => setEscalateReason(e.target.value)}
                            placeholder={t("कारण (ऐच्छिक)...", "Reason (optional)...")}
                            className="w-full p-3 border border-slate-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                            rows={3}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowEscalateModal(false)}
                                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
                            >
                                {t("रद्द गर्नुहोस्", "Cancel")}
                            </button>
                            <button
                                onClick={handleEscalate}
                                disabled={actionLoading}
                                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                            >
                                {t("माथि पठाउनुहोस्", "Escalate")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
