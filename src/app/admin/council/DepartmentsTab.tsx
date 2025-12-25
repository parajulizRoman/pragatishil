"use client";

import { useState, useEffect } from "react";
import { Building2, Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";

interface Department {
    id: string;
    slug: string;
    name_en: string;
    name_ne: string | null;
    description: string | null;
    is_active: boolean;
}

export default function DepartmentsTab() {
    const { t } = useLanguage();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Department>>({});

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        loadDepartments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadDepartments = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("departments")
            .select("*")
            .order("name_en");

        if (error) {
            console.error(error);
        } else {
            setDepartments(data || []);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!editForm.name_en || !editForm.slug) {
            alert(t("नाम र स्लग आवश्यक छ", "Name and slug are required"));
            return;
        }

        setSaving(true);
        if (editingId) {
            // Update
            const { error } = await supabase
                .from("departments")
                .update({
                    name_en: editForm.name_en,
                    name_ne: editForm.name_ne,
                    slug: editForm.slug,
                    description: editForm.description,
                    is_active: editForm.is_active ?? true
                })
                .eq("id", editingId);

            if (error) console.error(error);
        } else {
            // Insert
            const { error } = await supabase
                .from("departments")
                .insert({
                    name_en: editForm.name_en,
                    name_ne: editForm.name_ne,
                    slug: editForm.slug,
                    description: editForm.description,
                    is_active: true
                });

            if (error) console.error(error);
        }

        setEditingId(null);
        setIsAdding(false);
        setEditForm({});
        await loadDepartments();
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t("के तपाईं यो विभाग हटाउन चाहनुहुन्छ?", "Are you sure you want to delete this department?"))) {
            return;
        }

        const { error } = await supabase
            .from("departments")
            .delete()
            .eq("id", id);

        if (error) {
            alert(t("हटाउन असफल। सदस्यहरू लिंक हुन सक्छ।", "Failed to delete. Members might be linked."));
        } else {
            loadDepartments();
        }
    };

    const startEdit = (dept: Department) => {
        setEditingId(dept.id);
        setIsAdding(false);
        setEditForm({
            name_en: dept.name_en,
            name_ne: dept.name_ne,
            slug: dept.slug,
            description: dept.description,
            is_active: dept.is_active
        });
    };

    const startAdd = () => {
        setIsAdding(true);
        setEditingId(null);
        setEditForm({ is_active: true });
    };

    const cancel = () => {
        setEditingId(null);
        setIsAdding(false);
        setEditForm({});
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-brand-navy flex items-center gap-2">
                    <Building2 className="text-brand-blue" size={20} />
                    {t("विभागहरू", "Departments")}
                </h2>
                <Button onClick={startAdd} disabled={isAdding} size="sm">
                    <Plus size={16} className="mr-1" />
                    {t("नयाँ विभाग", "New Department")}
                </Button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="text-left px-4 py-3 font-medium text-slate-600">{t("स्लग", "Slug")}</th>
                            <th className="text-left px-4 py-3 font-medium text-slate-600">{t("अंग्रेजी नाम", "English Name")}</th>
                            <th className="text-left px-4 py-3 font-medium text-slate-600">{t("नेपाली नाम", "Nepali Name")}</th>
                            <th className="text-center px-4 py-3 font-medium text-slate-600">{t("सक्रिय", "Active")}</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Add New Row */}
                        {isAdding && (
                            <tr className="border-b bg-green-50">
                                <td className="px-4 py-2">
                                    <Input
                                        value={editForm.slug || ""}
                                        onChange={(e) => setEditForm({ ...editForm, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                                        placeholder="slug"
                                        className="h-8 text-sm"
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <Input
                                        value={editForm.name_en || ""}
                                        onChange={(e) => setEditForm({ ...editForm, name_en: e.target.value })}
                                        placeholder="English name"
                                        className="h-8 text-sm"
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <Input
                                        value={editForm.name_ne || ""}
                                        onChange={(e) => setEditForm({ ...editForm, name_ne: e.target.value })}
                                        placeholder="नेपाली नाम"
                                        className="h-8 text-sm"
                                    />
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <input
                                        type="checkbox"
                                        checked={editForm.is_active ?? true}
                                        onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <div className="flex gap-1">
                                        <Button size="sm" onClick={handleSave} disabled={saving} className="h-7 px-2">
                                            <Save size={14} />
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={cancel} className="h-7 px-2">
                                            <X size={14} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {/* Department Rows */}
                        {departments.map((dept) => (
                            <tr key={dept.id} className="border-b hover:bg-slate-50">
                                {editingId === dept.id ? (
                                    <>
                                        <td className="px-4 py-2">
                                            <Input
                                                value={editForm.slug || ""}
                                                onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                                                className="h-8 text-sm"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                value={editForm.name_en || ""}
                                                onChange={(e) => setEditForm({ ...editForm, name_en: e.target.value })}
                                                className="h-8 text-sm"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                value={editForm.name_ne || ""}
                                                onChange={(e) => setEditForm({ ...editForm, name_ne: e.target.value })}
                                                className="h-8 text-sm"
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <input
                                                type="checkbox"
                                                checked={editForm.is_active ?? true}
                                                onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                                                className="w-4 h-4"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex gap-1">
                                                <Button size="sm" onClick={handleSave} disabled={saving} className="h-7 px-2">
                                                    <Save size={14} />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={cancel} className="h-7 px-2">
                                                    <X size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-4 py-3 font-mono text-xs">{dept.slug}</td>
                                        <td className="px-4 py-3">{dept.name_en}</td>
                                        <td className="px-4 py-3">{dept.name_ne || "-"}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-0.5 rounded text-xs ${dept.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                                                {dept.is_active ? t("सक्रिय", "Active") : t("निष्क्रिय", "Inactive")}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1">
                                                <button onClick={() => startEdit(dept)} className="p-1.5 hover:bg-slate-100 rounded">
                                                    <Edit2 size={14} className="text-slate-500" />
                                                </button>
                                                <button onClick={() => handleDelete(dept.id)} className="p-1.5 hover:bg-red-50 rounded">
                                                    <Trash2 size={14} className="text-red-400" />
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}

                        {departments.length === 0 && !isAdding && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                                    {t("कुनै विभाग छैन", "No departments yet")}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
