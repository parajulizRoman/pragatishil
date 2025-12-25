"use client";

import { useEffect, useState } from "react";
import { Crown, RefreshCw, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";
import { Skeleton } from "@/components/ui/skeleton";

interface CouncilMember {
    id: string;
    is_veto_holder: boolean;
    is_active: boolean;
    term_start: string;
    profile: {
        id: string;
        full_name: string | null;
        role: string;
        avatar_url: string | null;
    } | null;
}

export default function CouncilMembersTab() {
    const [councilMembers, setCouncilMembers] = useState<CouncilMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [rotating, setRotating] = useState<string | null>(null);

    useEffect(() => {
        loadCouncilMembers();
    }, []);

    const loadCouncilMembers = async () => {
        setLoading(true);
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data, error } = await supabase
            .from("admin_council_members")
            .select(`
                id,
                is_active,
                is_veto_holder,
                term_start,
                profile:profiles (
                    id, full_name, role, avatar_url
                )
            `)
            .eq("is_active", true)
            .order("is_veto_holder", { ascending: false });

        if (error) {
            console.error(error);
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setCouncilMembers((data || []) as any);
        }
        setLoading(false);
    };

    const handleRotateVeto = async (fromId: string | null, toId: string) => {
        setRotating(toId);
        try {
            const res = await fetch("/api/admin/council/rotate-veto", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fromId, toId }),
            });
            if (res.ok) {
                loadCouncilMembers();
            } else {
                alert("Failed to rotate veto");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to rotate veto");
        }
        setRotating(null);
    };

    const currentVeto = councilMembers.find((m) => m.is_veto_holder);

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Veto Card */}
            <div
                className={`p-6 rounded-2xl border-2 ${currentVeto ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200"
                    }`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
                            <Crown size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-brand-navy">Current Veto Holder</h2>
                            {currentVeto && currentVeto.profile ? (
                                <p className="text-amber-700 font-medium">
                                    {currentVeto.profile.full_name}
                                    <span className="text-sm opacity-75 ml-2">
                                        (Since {new Date(currentVeto.term_start).toLocaleDateString()})
                                    </span>
                                </p>
                            ) : (
                                <p className="text-slate-500 italic">No Active Veto Holder Assigned</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Council List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-brand-navy uppercase text-xs tracking-widest">
                        Active Council Members
                    </h3>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">
                        {councilMembers.length} Members
                    </span>
                </div>

                <div className="divide-y divide-slate-100">
                    {councilMembers.map((member) => (
                        <div
                            key={member.id}
                            className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200">
                                    <Image
                                        src={member.profile?.avatar_url || "/placeholders/default-user.png"}
                                        alt={member.profile?.full_name || "User"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-bold text-brand-navy">{member.profile?.full_name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                        {member.profile?.role?.replace("_", " ")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {member.is_veto_holder ? (
                                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Crown size={12} /> Veto Holder
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handleRotateVeto(currentVeto?.id || null, member.id)}
                                        disabled={rotating === member.id}
                                        title="Assign Veto Power"
                                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors disabled:opacity-50"
                                    >
                                        <RefreshCw size={18} className={rotating === member.id ? "animate-spin" : ""} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Warning */}
            <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 text-blue-800 text-sm">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <p>
                    <strong>Veto Rotation:</strong> Rotating the veto power is a critical action. It immediately
                    transfers the power to block consensus decisions. This action is logged in the Audit Trail.
                </p>
            </div>
        </div>
    );
}
