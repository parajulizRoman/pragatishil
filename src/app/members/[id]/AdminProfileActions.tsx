"use client";

import React, { useState } from "react";
import { Profile, UserRole } from "@/types";
import { Shield, Edit2, Ban, X, Save, Loader2, UserCog, UserMinus } from "lucide-react";
import { adminUpdateProfile, deactivateUser, toggleBanUser } from "@/app/admin/users/actions";
import { useRouter } from "next/navigation";

// Reuse ROLES from admin page or just define here
const ROLES = [
    { value: 'member', label: 'Member' },
    { value: 'party_member', label: 'Party Member' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'admin', label: 'Admin (General)' },
    { value: 'admin_party', label: 'Party Admin' },
    { value: 'yantrik', label: 'Yantrik (Tech)' },
    { value: 'board', label: 'Board Member' },
];

export default function AdminProfileActions({ profile }: { profile: Profile }) {
    const router = useRouter();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [savingEdit, setSavingEdit] = useState(false);
    const [banReason, setBanReason] = useState("");
    interface EditFormData {
        full_name: string;
        bio: string;
        location: string;
        contact_email_public: string;
        contact_phone_public: string;
        is_public: boolean;
        role: UserRole;
    }

    const [editFormData, setEditFormData] = useState<Partial<EditFormData>>({});

    const handleEditClick = () => {
        setEditFormData({
            full_name: profile.full_name || "",
            bio: profile.bio || "",
            location: profile.location || "",
            contact_email_public: profile.contact_email_public || "",
            contact_phone_public: profile.contact_phone_public || "",
            is_public: profile.is_public ?? true,
            role: profile.role || "member"
        });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        setSavingEdit(true);
        try {
            await adminUpdateProfile(profile.id, editFormData);
            setIsEditModalOpen(false);
            router.refresh();
        } catch (err) {
            alert("Failed to update profile: " + err);
        } finally {
            setSavingEdit(false);
        }
    };

    const handleBanClick = () => {
        if (profile.is_banned) {
            if (confirm("Unban this user?")) {
                performBanToggle(false, "");
            }
        } else {
            setBanReason("");
            setIsBanModalOpen(true);
        }
    };

    const performBanToggle = async (isBanned: boolean, reason: string) => {
        try {
            await toggleBanUser(profile.id, isBanned, reason);
            setIsBanModalOpen(false);
            router.refresh();
        } catch (err) {
            alert("Failed: " + err);
        }
    };

    const handleDeactivateUser = async () => {
        if (!confirm(`Are you absolutely sure you want to DEACTIVATE ${profile.full_name}?`)) return;
        const secondConfirm = confirm("This will permanently block their login but PRESERVE their posts and comments. Continue?");
        if (!secondConfirm) return;

        setIsDeleting(true);
        try {
            await deactivateUser(profile.id);
            alert("User deactivated successfully. Their access is blocked, but data is preserved.");
            router.refresh();
        } catch (err) {
            alert("Failed to deactivate user: " + err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="mt-8 pt-8 border-t border-red-100 bg-red-50/50 -mx-8 px-8 pb-4">
                <div className="flex items-center gap-2 mb-4 text-red-700 font-semibold">
                    <Shield size={18} />
                    Admin Controls
                </div>
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={handleEditClick}
                        className="flex items-center gap-2 text-sm font-medium text-red-600 hover:underline px-3 py-1 bg-white border border-red-100 rounded-lg shadow-sm"
                    >
                        <Edit2 size={14} /> Edit Profile
                    </button>
                    <button
                        onClick={handleBanClick}
                        className="flex items-center gap-2 text-sm font-medium text-red-600 hover:underline px-3 py-1 bg-white border border-red-100 rounded-lg shadow-sm"
                    >
                        <Ban size={14} /> {profile.is_banned ? "Unban User" : "Ban User"}
                    </button>
                    <button
                        onClick={handleDeactivateUser}
                        disabled={isDeleting}
                        className="flex items-center gap-2 text-sm font-medium text-red-600 hover:underline px-3 py-1 bg-white border border-red-100 rounded-lg shadow-sm disabled:opacity-50"
                    >
                        <UserMinus size={14} /> {isDeleting ? "Deactivating..." : "Deactivate User"}
                    </button>
                    <a href={`/admin/audit?target=${profile.id}`} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:underline px-3 py-1 bg-white border border-red-100 rounded-lg shadow-sm">
                        <Shield size={14} /> View Audit Logs
                    </a>
                </div>
            </div>

            {/* Ban Modal */}
            {isBanModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Ban User</h3>
                        <p className="text-sm text-slate-600 mb-4">
                            You are about to ban <span className="font-semibold text-slate-900">{profile.full_name}</span>.
                        </p>
                        <textarea
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                            className="form-input"
                            placeholder="Reason for ban..."
                            rows={3}
                        />
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setIsBanModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">
                                Cancel
                            </button>
                            <button
                                onClick={() => performBanToggle(true, banReason)}
                                disabled={!banReason.trim()}
                                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
                            >
                                Ban User
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <UserCog className="text-brand-blue" />
                                Edit User Profile (Admin)
                            </h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                                <input
                                    value={editFormData.full_name}
                                    onChange={e => setEditFormData({ ...editFormData, full_name: e.target.value })}
                                    className="form-input"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Role</label>
                                <select
                                    value={editFormData.role}
                                    onChange={e => setEditFormData({ ...editFormData, role: e.target.value as UserRole })}
                                    className="form-input"
                                >
                                    {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700">Bio</label>
                                <textarea
                                    value={editFormData.bio}
                                    onChange={e => setEditFormData({ ...editFormData, bio: e.target.value })}
                                    rows={3}
                                    className="form-input"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Location</label>
                                <input
                                    value={editFormData.location}
                                    onChange={e => setEditFormData({ ...editFormData, location: e.target.value })}
                                    className="form-input"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-slate-700">Profile Visibility</label>
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
                                <label className="text-sm font-semibold text-slate-700">Contact Email (Public)</label>
                                <input
                                    value={editFormData.contact_email_public}
                                    onChange={e => setEditFormData({ ...editFormData, contact_email_public: e.target.value })}
                                    className="form-input"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Contact Phone (Public)</label>
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
        </>
    );
}
