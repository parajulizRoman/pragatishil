/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { getUsers, updateUserRole, toggleBanUser } from "./actions";
import { Search, Shield, ShieldAlert, Ban, CheckCircle, UserCheck } from "lucide-react";
import Image from "next/image";

// Define roles for dropdown
const ROLES = [
    { value: 'member', label: 'Member' },
    { value: 'party_member', label: 'Party Member' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'admin', label: 'Admin (General)' },
    { value: 'admin_party', label: 'Party Admin' },
    { value: 'yantrik', label: 'Yantrik (Tech)' },
    { value: 'board', label: 'Board Member' },
];

export default function UserManagementPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [users, setUsers] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 500);
        return () => clearTimeout(timer);
    }, [search, page]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { users, total } = await getUsers(page, search);
            setUsers(users || []);
            setTotal(total);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        if (!confirm(`Change role to ${newRole}?`)) return;
        try {
            await updateUserRole(userId, newRole);
            fetchData(); // Refresh
        } catch (err) {
            alert("Failed to update role");
        }
    };

    // Modal State
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const [banReason, setBanReason] = useState("");

    const handleBanClick = (user: any) => {
        if (user.is_banned) {
            // Unban immediately with confirm
            if (confirm("Unban this user?")) {
                performBanToggle(user.id, false, "");
            }
        } else {
            // Open modal to ban
            setSelectedUser(user);
            setBanReason("");
            setIsBanModalOpen(true);
        }
    };

    const performBanToggle = async (userId: string, isBanned: boolean, reason: string) => {
        try {
            await toggleBanUser(userId, isBanned, reason);
            fetchData();
            setIsBanModalOpen(false);
        } catch (err) {
            alert("Failed: " + err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <UsersIcon className="text-brand-blue" />
                    User Management
                </h1>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                        placeholder="Search users..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600 text-sm">User</th>
                            <th className="p-4 font-semibold text-slate-600 text-sm">Email</th>
                            <th className="p-4 font-semibold text-slate-600 text-sm">Role</th>
                            <th className="p-4 font-semibold text-slate-600 text-sm">Status</th>
                            <th className="p-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading...</td></tr>
                        ) : users.map(user => (
                            <tr key={user.id} className={`hover:bg-slate-50 transition-colors ${user.is_banned ? 'bg-red-50/50' : ''}`}>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                                            <Image
                                                src={user.avatar_url || "/default-avatar.png"}
                                                alt="Avatar"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-800">{user.full_name || "Unknown"}</p>
                                            <p className="text-xs text-slate-500 font-mono">{user.id.slice(0, 8)}...</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-slate-600">{user.email || "-"}</td>
                                <td className="p-4">
                                    <select
                                        value={user.role || 'member'}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className="text-xs border border-slate-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-brand-blue/20 outline-none"
                                    >
                                        {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                    </select>
                                </td>
                                <td className="p-4">
                                    {user.is_banned ? (
                                        <div className="flex flex-col items-start">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-1">
                                                <Ban size={12} /> Banned
                                            </span>
                                            {user.ban_reason && (
                                                <span className="text-[10px] text-red-600 max-w-[150px] truncate" title={user.ban_reason}>
                                                    "{user.ban_reason}"
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                                            <CheckCircle size={12} /> Active
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleBanClick(user)}
                                        className={`text-xs px-3 py-1.5 rounded border font-medium transition-colors ${user.is_banned
                                            ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                                            : "bg-white border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                            }`}
                                    >
                                        {user.is_banned ? "Unban" : "Ban"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!loading && users.length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500">No users found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Ban Modal */}
            {isBanModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Ban User</h3>
                        <p className="text-sm text-slate-600 mb-4">
                            You are about to ban <span className="font-semibold text-slate-900">{selectedUser?.full_name}</span>.
                            They will lose access to posting and commenting.
                        </p>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Reason for Ban <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none min-h-[100px]"
                            placeholder="Violation of community guidelines..."
                        />

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsBanModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => performBanToggle(selectedUser.id, true, banReason)}
                                disabled={!banReason.trim()}
                                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Ban User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function UsersIcon(props: any) {
    return (
        <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}
