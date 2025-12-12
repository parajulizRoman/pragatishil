
import { createClient } from "@/lib/supabase/server"; // Helper
import { rotateVeto } from "./actions";
import { Crown, AlertTriangle, RefreshCw } from "lucide-react";
import Image from "next/image";

// Force dynamic
export const dynamic = "force-dynamic";

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

export default async function AdminCouncilPage() {
    const supabase = await createClient(); // Await helper

    // 1. Fetch Council Members with Profile Data
    // We join profiles.
    const { data: rawData, error } = await supabase
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
        .order("is_veto_holder", { ascending: false }); // Veto holder first

    if (error) {
        console.error(error);
        return <div>Error loading council members.</div>;
    }

    // Cast data safely
    const councilMembers = (rawData || []) as unknown as CouncilMember[];

    // Find current veto holder
    const currentVeto = councilMembers.find(m => m.is_veto_holder);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-800">Admin Council</h1>

            {/* Veto Card */}
            <div className={`p-6 rounded-2xl border-2 ${currentVeto ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
                            <Crown size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Current Veto Holder</h2>
                            {currentVeto && currentVeto.profile ? (
                                <p className="text-amber-700 font-medium">
                                    {currentVeto.profile.full_name}
                                    <span className="text-sm opacity-75 ml-2">(Since {new Date(currentVeto.term_start).toLocaleDateString()})</span>
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
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-800">Active Council Members</h3>
                    <span className="text-sm text-slate-500">{councilMembers.length} Members</span>
                </div>

                <div className="divide-y divide-slate-100">
                    {councilMembers.map((member) => (
                        <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
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
                                    <p className="font-semibold text-slate-800">{member.profile?.full_name}</p>
                                    <p className="text-xs text-slate-500 uppercase">{member.profile?.role?.replace("_", " ")}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {member.is_veto_holder ? (
                                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Crown size={12} /> Veto Holder
                                    </span>
                                ) : (
                                    <form action={async () => {
                                        "use server";
                                        if (currentVeto?.id) {
                                            await rotateVeto(currentVeto.id, member.id);
                                        } else {
                                            // First veto assignment (no current holder)
                                            await rotateVeto("NONE", member.id); // Handle this in action
                                        }
                                    }}>
                                        <button
                                            title="Assign Veto Power"
                                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors"
                                        >
                                            <RefreshCw size={18} />
                                        </button>
                                    </form>
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
                    <strong>Veto Rotation:</strong> Rotating the veto power is a critical action.
                    It immediately transfers the power to block consensus decisions.
                    This action is logged in the Audit Trail.
                </p>
            </div>
        </div>
    );
}
