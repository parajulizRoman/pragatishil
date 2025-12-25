"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
    getRoleLevels,
    getMessagingPermissions,
    updateRoleLevel,
    addMessagingPermission,
    removeMessagingPermission,
    RoleLevel,
    MessagingPermission
} from "@/actions/roles";
import { Shield, Save, MessageSquare, Check, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function RolesTab() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [roles, setRoles] = useState<RoleLevel[]>([]);
    const [permissions, setPermissions] = useState<MessagingPermission[]>([]);
    const [showMatrix, setShowMatrix] = useState(false);
    const [editingRole, setEditingRole] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<Partial<RoleLevel>>({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [rolesData, permsData] = await Promise.all([
            getRoleLevels(),
            getMessagingPermissions()
        ]);
        setRoles(rolesData);
        setPermissions(permsData);
        setLoading(false);
    };

    const handleSaveRole = async (role: RoleLevel) => {
        setSaving(true);
        await updateRoleLevel(role.id, editValues);
        setEditingRole(null);
        await loadData();
        setSaving(false);
    };

    const handleTogglePermission = async (senderKey: string, recipientKey: string, hasPermission: boolean) => {
        setSaving(true);
        if (hasPermission) {
            await removeMessagingPermission(senderKey, recipientKey);
        } else {
            await addMessagingPermission(senderKey, recipientKey);
        }
        await loadData();
        setSaving(false);
    };

    const hasPermission = (sender: string, recipient: string): boolean => {
        return permissions.some(p => p.sender_role === sender && p.recipient_role === recipient);
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-brand-navy flex items-center gap-2">
                    <Shield className="text-brand-blue" size={20} />
                    {t("भूमिका व्यवस्थापन", "Role Management")}
                </h2>

                <button
                    onClick={() => setShowMatrix(!showMatrix)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition text-sm"
                >
                    <MessageSquare size={16} />
                    {showMatrix ? t("सूची हेर्नुहोस्", "View List") : t("म्याट्रिक्स हेर्नुहोस्", "View Matrix")}
                </button>
            </div>

            {!showMatrix ? (
                /* Role List View */
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 font-medium text-slate-600">{t("स्तर", "Level")}</th>
                                <th className="text-left px-4 py-3 font-medium text-slate-600">{t("कुञ्जी", "Key")}</th>
                                <th className="text-left px-4 py-3 font-medium text-slate-600">{t("अंग्रेजी", "English")}</th>
                                <th className="text-left px-4 py-3 font-medium text-slate-600">{t("नेपाली", "Nepali")}</th>
                                <th className="text-center px-4 py-3 font-medium text-slate-600">{t("जवाफ", "Reply")}</th>
                                <th className="text-center px-4 py-3 font-medium text-slate-600">{t("इतिहास", "History")}</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role) => (
                                <tr key={role.id} className="border-b hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        <span className="bg-brand-blue text-white px-2 py-0.5 rounded text-xs font-medium">
                                            {role.level}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs">{role.key}</td>
                                    <td className="px-4 py-3">
                                        {editingRole === role.id ? (
                                            <input
                                                type="text"
                                                value={editValues.name_en ?? role.name_en}
                                                onChange={(e) => setEditValues({ ...editValues, name_en: e.target.value })}
                                                className="px-2 py-1 border rounded w-full text-sm"
                                            />
                                        ) : role.name_en}
                                    </td>
                                    <td className="px-4 py-3">
                                        {editingRole === role.id ? (
                                            <input
                                                type="text"
                                                value={editValues.name_ne ?? role.name_ne ?? ''}
                                                onChange={(e) => setEditValues({ ...editValues, name_ne: e.target.value })}
                                                className="px-2 py-1 border rounded w-full text-sm"
                                            />
                                        ) : role.name_ne}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {editingRole === role.id ? (
                                            <input
                                                type="checkbox"
                                                checked={editValues.can_reply ?? role.can_reply}
                                                onChange={(e) => setEditValues({ ...editValues, can_reply: e.target.checked })}
                                                className="w-4 h-4"
                                            />
                                        ) : role.can_reply ?
                                            <Check className="inline text-green-600" size={16} /> :
                                            <X className="inline text-slate-300" size={16} />
                                        }
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {editingRole === role.id ? (
                                            <input
                                                type="checkbox"
                                                checked={editValues.has_full_history ?? role.has_full_history}
                                                onChange={(e) => setEditValues({ ...editValues, has_full_history: e.target.checked })}
                                                className="w-4 h-4"
                                            />
                                        ) : role.has_full_history ?
                                            <Check className="inline text-green-600" size={16} /> :
                                            <X className="inline text-slate-300" size={16} />
                                        }
                                    </td>
                                    <td className="px-4 py-3">
                                        {editingRole === role.id ? (
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleSaveRole(role)}
                                                    disabled={saving}
                                                    className="p-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    <Save size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setEditingRole(null)}
                                                    className="p-1.5 bg-slate-200 rounded hover:bg-slate-300"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setEditingRole(role.id);
                                                    setEditValues({
                                                        name_en: role.name_en,
                                                        name_ne: role.name_ne,
                                                        can_reply: role.can_reply,
                                                        has_full_history: role.has_full_history
                                                    });
                                                }}
                                                className="text-brand-blue hover:underline text-xs"
                                            >
                                                {t("सम्पादन", "Edit")}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* Messaging Permissions Matrix */
                <div className="bg-white border border-slate-200 rounded-xl p-4 overflow-x-auto">
                    <h3 className="font-semibold text-brand-navy mb-2">
                        {t("सन्देश अनुमति म्याट्रिक्स", "Messaging Permissions Matrix")}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                        {t("पङ्क्तिले कुन भूमिकाले स्तम्भको भूमिकालाई सन्देश पठाउन सक्छ देखाउँछ",
                            "Rows show which role can message the column role. Click to toggle.")}
                    </p>

                    <table className="border-collapse text-xs">
                        <thead>
                            <tr>
                                <th className="border p-2 bg-slate-50">{t("प्रेषक / प्राप्तकर्ता", "Sender / Recipient")}</th>
                                {roles.filter(r => r.level >= 2).map(r => (
                                    <th key={r.key} className="border p-2 bg-slate-50 whitespace-nowrap">
                                        {r.name_en}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {roles.filter(r => r.level >= 2 && r.level < 11).map(sender => (
                                <tr key={sender.key}>
                                    <td className="border p-2 font-medium bg-slate-50">{sender.name_en}</td>
                                    {roles.filter(r => r.level >= 2).map(recipient => (
                                        <td
                                            key={recipient.key}
                                            className="border p-2 text-center cursor-pointer hover:bg-slate-100"
                                            onClick={() => {
                                                if (sender.key !== recipient.key) {
                                                    handleTogglePermission(sender.key, recipient.key, hasPermission(sender.key, recipient.key));
                                                }
                                            }}
                                        >
                                            {sender.key === recipient.key ? (
                                                <span className="text-slate-300">—</span>
                                            ) : hasPermission(sender.key, recipient.key) ? (
                                                <Check className="inline text-green-600" size={14} />
                                            ) : (
                                                <span className="text-slate-300">○</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
