
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
// import { Shield, AlertCircle } from "lucide-react"; // Icons if needed

export const dynamic = "force-dynamic";

export default async function AuditLogsPage({ searchParams }: { searchParams: { actor?: string } }) {
    const supabase = await createClient();

    // Basic query
    let query = supabase
        .from("audit_logs")
        .select(`
            id,
            action_type,
            target_type,
            target_id,
            metadata,
            created_at,
            actor:profiles(id, full_name, role, avatar_url)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

    if (searchParams.actor) {
        query = query.eq("actor_id", searchParams.actor);
    }

    const { data: logs, error } = await query;

    if (error) {
        return <div className="text-red-500 p-4">Error loading audit logs: {error.message}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Audit Logs</h1>
                <span className="text-slate-500 text-sm">Last 100 Actions</span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-sm uppercase border-b border-slate-200">
                            <th className="px-6 py-4 font-semibold">Actor</th>
                            <th className="px-6 py-4 font-semibold">Action</th>
                            <th className="px-6 py-4 font-semibold">Target</th>
                            <th className="px-6 py-4 font-semibold">Details</th>
                            <th className="px-6 py-4 font-semibold">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {logs?.map((log) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const actor = log.actor as any; // Cast for simplicity due to join
                            return (
                                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        {actor ? (
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-200">
                                                    <Image
                                                        src={actor.avatar_url || "/placeholders/default-user.png"}
                                                        alt={actor.full_name || "User"}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-700 text-sm">{actor.full_name}</p>
                                                    <p className="text-xs text-slate-400">{actor.role}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 italic">System / Deleted</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wider 
                                            ${getActionColor(log.action_type)}`}>
                                            {log.action_type.replace(/_/g, " ")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {log.target_type}: {log.target_id.split("-")[0]}...
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-mono w-64 break-all">
                                        {JSON.stringify(log.metadata || {})}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                                        {new Date(log.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {(!logs || logs.length === 0) && (
                    <div className="p-10 text-center text-slate-400">No logs found.</div>
                )}
            </div>
        </div>
    );
}

function getActionColor(action: string) {
    if (action.includes("BAN")) return "bg-red-100 text-red-700";
    if (action.includes("VETO")) return "bg-amber-100 text-amber-700";
    if (action.includes("CHANNEL")) return "bg-purple-100 text-purple-700";
    if (action.includes("POST")) return "bg-blue-100 text-blue-700";
    return "bg-slate-100 text-slate-600";
}
