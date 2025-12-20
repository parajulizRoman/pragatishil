/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client"; // Add missing import
import { getUsers, updateUserRole, toggleBanUser, deactivateUser, adminUpdateProfile } from "./actions";
import { Search, Shield, ShieldAlert, Ban, CheckCircle, UserCheck, Edit2, Trash2, UserCog, X, Save, Loader2, UserMinus } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

// Define roles for dropdown - 'admin' is hidden (only settable via Supabase)
const ROLES = [
    { value: 'member', label: 'Member' },
    { value: 'party_member', label: 'Party Member' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'admin_party', label: 'Party Admin' },
    { value: 'yantrik', label: 'Yantrik (Tech)' },
    { value: 'team_member', label: 'Team Member' },
    { value: 'central_committee', label: 'Central Committee' },
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

    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

    // Initial Auth Check
    useEffect(() => {
        const checkRole = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
                const role = profile?.role;
                setCurrentUserRole(role);

                // Strict Guard
                const allowed = ['admin', 'yantrik', 'admin_party', 'board'];
                if (!allowed.includes(role)) {
                    // console.warn("Unauthorized access to user management");
                    // window.location.href = "/admin"; // Force redirect
                }
            }
        };
        checkRole();
    }, []);

    const isAuthorized = currentUserRole && ['admin', 'yantrik', 'admin_party', 'board'].includes(currentUserRole);

    if (!loading && !isAuthorized) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <ShieldAlert size={64} className="text-red-500" />
                <h2 className="text-2xl font-bold text-slate-800">Access Denied</h2>
                <p className="text-slate-500 max-w-md">
                    You do not have permission to manage users. This area is restricted to System Admins, Political Admins, and the Board.
                </p>
                <a href="/admin" className="text-brand-blue hover:underline font-bold">Return to Dashboard</a>
            </div>
        );
    }

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

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleDeactivateUser = async (user: any) => {
        if (!confirm(`Are you absolutely sure you want to DEACTIVATE ${user.full_name}?`)) return;

        const secondConfirm = confirm("This will permanently block their login but PRESERVE their posts and comments. Continue?");
        if (!secondConfirm) return;

        setIsDeleting(true);
        try {
            await deactivateUser(user.id);
            fetchData();
            alert("User deactivated successfully. Their access is blocked, but data is preserved.");
        } catch (err) {
            alert("Failed to deactivate user: " + err);
        } finally {
            setIsDeleting(false);
        }
    };

    const [editFormData, setEditFormData] = useState<any>({});
    const [savingEdit, setSavingEdit] = useState(false);

    const handleEditClick = (user: any) => {
        setSelectedUser(user);
        setEditFormData({
            full_name: user.full_name || "",
            bio: user.bio || "",
            location: user.location || "",
            contact_email_public: user.contact_email_public || "",
            contact_phone_public: user.contact_phone_public || "",
            is_public: user.is_public ?? true,
            role: user.role || "member"
        });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        setSavingEdit(true);
        try {
            await adminUpdateProfile(selectedUser.id, editFormData);
            fetchData();
            setIsEditModalOpen(false);
        } catch (err) {
            alert("Failed to update profile: " + err);
        } finally {
            setSavingEdit(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-brand-navy flex items-center gap-2">
                    <UsersIcon className="text-brand-blue" />
                    User Management
                </h1>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        className="form-input !pl-9 !py-2"
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
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="w-10 h-10 rounded-full" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-3 w-32" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                                    <td className="p-4"><Skeleton className="h-6 w-20 rounded" /></td>
                                    <td className="p-4"><Skeleton className="h-6 w-24 rounded-full" /></td>
                                    <td className="p-4 text-right"><Skeleton className="h-8 w-24 ml-auto rounded-lg" /></td>
                                </tr>
                            ))
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
                                        className="form-input !py-1 !px-2 !text-xs !w-auto"
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
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEditClick(user)}
                                            className="p-1.5 text-slate-400 hover:text-brand-blue hover:bg-slate-100 rounded-lg transition-colors"
                                            title="Edit Profile"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleBanClick(user)}
                                            className={`p-1.5 rounded-lg transition-colors ${user.is_banned
                                                ? "text-red-600 bg-red-50 hover:bg-red-100"
                                                : "text-slate-400 hover:text-red-500 hover:bg-red-50"
                                                }`}
                                            title={user.is_banned ? "Unban User" : "Ban User"}
                                        >
                                            <Ban size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeactivateUser(user)}
                                            disabled={isDeleting}
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                            title="Deactivate User (Preserve Data)"
                                        >
                                            <UserMinus size={16} />
                                        </button>
                                    </div>
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

                        <label className="form-label">
                            Reason for Ban <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                            className="form-input min-h-[100px]"
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

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-brand-navy flex items-center gap-2">
                                <UserCog className="text-brand-blue" />
                                Edit User Profile
                            </h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="form-label">Full Name</label>
                                <input
                                    value={editFormData.full_name}
                                    onChange={e => setEditFormData({ ...editFormData, full_name: e.target.value })}
                                    className="form-input"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="form-label">Role</label>
                                <select
                                    value={editFormData.role}
                                    onChange={e => setEditFormData({ ...editFormData, role: e.target.value })}
                                    className="form-input"
                                >
                                    {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="form-label">Bio</label>
                                <textarea
                                    value={editFormData.bio}
                                    onChange={e => setEditFormData({ ...editFormData, bio: e.target.value })}
                                    rows={3}
                                    className="form-input"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="form-label">Location</label>
                                <input
                                    value={editFormData.location}
                                    onChange={e => setEditFormData({ ...editFormData, location: e.target.value })}
                                    className="form-input"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="form-label">Profile Visibility</label>
                                    <input
                                        type="checkbox"
                                        checked={editFormData.is_public}
                                        onChange={e => setEditFormData({ ...editFormData, is_public: e.target.checked })}
                                        className="w-4 h-4 text-brand-blue border-slate-300 rounded focus:ring-brand-blue"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-500">Enable to show in public members gallery.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="form-label">Contact Email (Public)</label>
                                <input
                                    value={editFormData.contact_email_public}
                                    onChange={e => setEditFormData({ ...editFormData, contact_email_public: e.target.value })}
                                    className="form-input"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="form-label">Contact Phone (Public)</label>
                                <input
                                    value={editFormData.contact_phone_public}
                                    onChange={e => setEditFormData({ ...editFormData, contact_phone_public: e.target.value })}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={savingEdit}
                                className="flex items-center gap-2 px-6 py-2 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {savingEdit ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                Save Changes
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
