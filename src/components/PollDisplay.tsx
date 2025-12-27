"use client";

import React, { useState } from "react";
import { DiscussionPoll } from "@/types";
import { cn } from "@/lib/utils";
import { Check, Clock, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

interface PollDisplayProps {
    poll: DiscussionPoll;
    onVote?: (pollId: string, optionIds: string[]) => void; // Optional callback for parent refresh
}

export default function PollDisplay({ poll, onVote }: PollDisplayProps) {
    const { t } = useLanguage();
    const [selectedOptions, setSelectedOptions] = useState<string[]>(poll.user_votes || []);
    const [isVoting, setIsVoting] = useState(false);

    // Calculate totals
    const totalVotes = poll.total_votes || poll.options?.reduce((acc, opt) => acc + (opt.vote_count || 0), 0) || 0;
    const isExpired = poll.expires_at ? new Date(poll.expires_at) < new Date() : false;
    const hasVoted = poll.user_votes && poll.user_votes.length > 0;
    const canVote = !isExpired && !hasVoted; // Simpler mode: once voted, can't change via this UI immediately unless we handle it. 
    // Actually, usually users can change votes or just see results. 
    // Let's assume if hasVoted, we show results. If not, we show voting options.

    const handleOptionClick = (optionId: string) => {
        if (!canVote && !poll.allow_multiple_votes) return;
        if (hasVoted) return; // Verify backend policy, but UIwise lock it usually.

        if (poll.allow_multiple_votes) {
            setSelectedOptions(prev =>
                prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]
            );
        } else {
            setSelectedOptions([optionId]);
        }
    };

    const submitVote = async () => {
        if (selectedOptions.length === 0) return;

        setIsVoting(true);
        try {
            const res = await fetch("/api/discussions/polls/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pollId: poll.id,
                    optionIds: selectedOptions
                })
            });

            if (!res.ok) throw new Error(await res.text());

            if (onVote) onVote(poll.id, selectedOptions);
            // Optimistic update could happen here or parent re-fetches
            window.location.reload(); // Simple refresh for now to get updated stats
        } catch (err) {
            console.error(err);
            alert(t("भोट गर्न असफल भयो", "Failed to vote"));
        } finally {
            setIsVoting(false);
        }
    };

    // Calculate percentages
    const getPercentage = (count: number = 0) => {
        if (totalVotes === 0) return 0;
        return Math.round((count / totalVotes) * 100);
    };

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 my-4 max-w-xl">
            <div className="mb-3">
                <h3 className="font-semibold text-lg text-slate-800">{poll.question}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    {poll.allow_multiple_votes ? (
                        <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{t("बहु-छनोट", "Multiple Choice")}</span>
                    ) : (
                        <span>{t("एकल छनोट", "Single Choice")}</span>
                    )}
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {isExpired ? t("समाप्त भयो", "Ended") : (
                            poll.expires_at ? `${t("सकिन्छ", "Ends")} ${new Date(poll.expires_at).toLocaleDateString()}` : t("समय सीमा छैन", "No Limit")
                        )}
                    </span>
                    <span>•</span>
                    <span>{totalVotes} {t("भोटहरू", "Votes")}</span>
                </div>
            </div>

            <div className="space-y-2">
                {poll.options?.sort((a, b) => a.position - b.position).map((option) => {
                    const isSelected = selectedOptions.includes(option.id);
                    const percentage = getPercentage(option.vote_count);
                    const isWinner = isExpired && percentage === Math.max(...(poll.options?.map(o => getPercentage(o.vote_count)) || [0]));

                    if (hasVoted || isExpired) {
                        // Result View
                        return (
                            <div key={option.id} className="relative">
                                {/* Progress Bar Background */}
                                <div className="absolute inset-0 bg-slate-100 rounded-md overflow-hidden">
                                    <div
                                        className={cn("h-full transition-all duration-500", isWinner ? "bg-brand-blue/20" : "bg-slate-200")}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                {/* Content */}
                                <div className="relative flex justify-between items-center p-3 text-sm z-10">
                                    <div className="flex items-center gap-2">
                                        {isSelected && <Check className="w-4 h-4 text-brand-blue" />}
                                        <span className={cn("font-medium", isSelected ? "text-brand-blue" : "text-slate-700")}>
                                            {option.option_text}
                                        </span>
                                    </div>
                                    <span className="font-bold text-slate-600">{percentage}%</span>
                                </div>
                            </div>
                        );
                    } else {
                        // Voting View
                        return (
                            <button
                                key={option.id}
                                onClick={() => handleOptionClick(option.id)}
                                className={cn(
                                    "w-full flex items-center p-3 rounded-md border text-sm font-medium transition-all text-left",
                                    isSelected
                                        ? "border-brand-blue bg-brand-blue/5 text-brand-blue ring-1 ring-brand-blue"
                                        : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-400"
                                )}
                            >
                                <div className={cn(
                                    "w-4 h-4 rounded-full border mr-3 flex items-center justify-center shrink-0",
                                    isSelected ? "border-brand-blue bg-brand-blue" : "border-slate-400"
                                )}>
                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                {option.option_text}
                            </button>
                        );
                    }
                })}
            </div>

            {!hasVoted && !isExpired && (
                <div className="mt-4 flex justify-end">
                    <Button
                        onClick={submitVote}
                        disabled={selectedOptions.length === 0 || isVoting}
                        className="bg-brand-blue hover:bg-brand-blue/90"
                    >
                        {isVoting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {t("भोट हाल्नुहोस्", "Vote")}
                    </Button>
                </div>
            )}
        </div>
    );
}
