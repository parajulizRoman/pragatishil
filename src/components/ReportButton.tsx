"use client";

import { useState } from "react";
import { Flag, Loader2 } from "lucide-react";
import { flagContent } from "@/app/commune/actions";

interface ReportButtonProps {
    targetId: string;
    targetType: 'post' | 'thread';
}

export default function ReportButton({ targetId, targetType }: ReportButtonProps) {
    const [loading, setLoading] = useState(false);
    const [reported, setReported] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleReport = async () => {
        setLoading(true);
        try {
            // Default reason for MVP 'spam'. 
            // Ideally show a modal to select reason.
            await flagContent(targetId, targetType, 'spam');
            setReported(true);
            setShowConfirm(false);
        } catch (error) {
            console.error(error);
            alert("Failed to report.");
        } finally {
            setLoading(false);
        }
    };

    if (reported) {
        return <span className="text-xs text-slate-400 italic">Reported</span>;
    }

    if (showConfirm) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-xs text-red-600 font-bold">Report as Spam?</span>
                <button
                    onClick={handleReport}
                    disabled={loading}
                    className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                >
                    {loading ? <Loader2 size={12} className="animate-spin" /> : "Yes"}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    className="text-xs text-slate-500 hover:underline"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="text-slate-400 hover:text-red-500 transition-colors p-1"
            title="Report Content"
        >
            <Flag size={14} />
        </button>
    );
}
