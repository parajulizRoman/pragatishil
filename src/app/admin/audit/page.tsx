
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage({ searchParams }: { searchParams: { actor?: string, target?: string } }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return <div className="p-8 text-red-500">Unauthorized</div>;

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    const role = profile?.role;
    const allowed = ['admin']; // STRICT ROOT ONLY

    if (!allowed.includes(role)) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <div className="p-4 bg-red-50 rounded-full">
                    <ShieldAlert size={48} className="text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Access Restricted</h2>
                <p className="text-slate-500 max-w-md">
                    Audit logs contain sensitive system activity and are restricted to Root Admin only.
                </p>
            </div>
        );
    }

    // Basic query
    let query = supabase
        .from("audit_logs")
        .select(`
            id,
            action_type,
            target_type,
            target_id,
            metadata,
            old_data,
            new_data,
            reason,
            created_at,
            actor:profiles(id, full_name, role, avatar_url)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

    if (searchParams.actor) {
        query = query.eq("actor_id", searchParams.actor);
    }

    if (searchParams.target) {
        query = query.eq("target_id", searchParams.target);
    }

    const { data: logs, error } = await query;

    if (error) {
        return <div className="text-red-500 p-4">Error loading audit logs: {error.message}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-brand-navy">Audit Logs</h1>
                    {(searchParams.actor || searchParams.target) && (
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs font-medium px-2 py-1 bg-brand-blue/10 text-brand-blue rounded-full">
                                Filter Active: {searchParams.actor ? "Actor" : "Target"} ({searchParams.actor || searchParams.target})
                            </span>
                            <a href="/admin/audit" className="text-xs text-slate-400 hover:text-brand-blue underline">
                                Clear Filter
                            </a>
                        </div>
                    )}
                </div>
                <span className="text-slate-500 text-sm">Last 100 Actions</span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-brand-navy text-[10px] font-black uppercase border-b border-slate-200 tracking-widest">
                            <th className="px-6 py-4">Actor</th>
                            <th className="px-6 py-4">Action</th>
                            <th className="px-6 py-4">Target</th>
                            <th className="px-6 py-4">Reason</th>
                            <th className="px-6 py-4 w-64">Snapshots</th>
                            <th className="px-6 py-4">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {logs?.map((log) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const actor = log.actor as any;
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
                                                    <p className="font-semibold text-slate-700 text-sm whitespace-nowrap">{actor.full_name}</p>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">{actor.role}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 italic">System / Deleted</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider 
                                            ${getActionColor(log.action_type)}`}>
                                            {log.action_type.replace(/_/g, " ")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-600">
                                        {log.target_type}
                                        <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{log.target_id.slice(0, 8)}...</span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500 max-w-xs overflow-hidden text-ellipsis italic">
                                        {log.reason || "N/A"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {log.old_data || log.new_data ? (
                                            <details className="text-[10px] font-mono">
                                                <summary className="cursor-pointer text-brand-blue font-bold hover:underline">View Snapshots</summary>
                                                <div className="mt-2 p-2 bg-slate-100 rounded border border-slate-200 overflow-auto max-h-40">
                                                    {log.old_data && (
                                                        <div className="mb-2">
                                                            <span className="text-red-600 font-bold uppercase">Before:</span>
                                                            <pre className="mt-1">{JSON.stringify(log.old_data, null, 2)}</pre>
                                                        </div>
                                                    )}
                                                    {log.new_data && (
                                                        <div>
                                                            <span className="text-green-600 font-bold uppercase">After:</span>
                                                            <pre className="mt-1">{JSON.stringify(log.new_data, null, 2)}</pre>
                                                        </div>
                                                    )}
                                                </div>
                                            </details>
                                        ) : (
                                            <span className="text-[10px] text-slate-300">No diff</span>
                                        )}
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
    if (!action) return "bg-slate-50 text-slate-600 border border-slate-200";
    if (action.includes("BAN")) return "bg-red-50 text-red-700 border border-red-100";
    if (action.includes("VETO")) return "bg-amber-50 text-amber-700 border border-amber-100";
    if (action.includes("CHANNEL")) return "bg-purple-50 text-purple-700 border border-purple-100";
    if (action.includes("POST")) return "bg-sky-50 text-sky-700 border border-sky-100";
    if (action.includes("MANAGE_NEWS")) return "bg-emerald-50 text-emerald-700 border border-emerald-100";
    if (action.includes("MANAGE_MEDIA")) return "bg-orange-50 text-orange-700 border border-orange-100";
    if (action.includes("UPDATE_SITE_CONTENT")) return "bg-pink-50 text-pink-700 border border-pink-100";
    return "bg-slate-50 text-slate-600 border border-slate-200";
}
