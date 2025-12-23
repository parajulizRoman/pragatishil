"use client";

import React, { useState, useEffect } from "react";
import { ProfessionCategory, UserRole, hasRole } from "@/types";
import { Plus, Pencil, Trash2, Loader2, X, Check } from "lucide-react";

interface ProfessionCategoryManagerProps {
    viewerRole: UserRole;
    onClose?: () => void;
}

export default function ProfessionCategoryManager({ viewerRole, onClose }: ProfessionCategoryManagerProps) {
    const [categories, setCategories] = useState<ProfessionCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // New category form
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ name_en: "", name_ne: "" });

    const canManage = hasRole(viewerRole, 'central_committee');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/profession-categories");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setCategories(data);
        } catch {
            setError("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!formData.name_en.trim()) return;

        setSaving(true);
        setError(null);

        try {
            const res = await fetch("/api/profession-categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to add");
            }

            await fetchCategories();
            setFormData({ name_en: "", name_ne: "" });
            setShowForm(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async () => {
        if (!editingId || !formData.name_en.trim()) return;

        setSaving(true);
        setError(null);

        try {
            const res = await fetch("/api/profession-categories", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editingId, ...formData })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update");
            }

            await fetchCategories();
            setFormData({ name_en: "", name_ne: "" });
            setEditingId(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this category?")) return;

        try {
            const res = await fetch(`/api/profession-categories?id=${id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete");
            }

            await fetchCategories();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
        }
    };

    const startEdit = (cat: ProfessionCategory) => {
        setEditingId(cat.id);
        setFormData({ name_en: cat.name_en, name_ne: cat.name_ne || "" });
        setShowForm(false);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ name_en: "", name_ne: "" });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800">Profession Categories</h3>
                {onClose && (
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Category List */}
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                        {editingId === cat.id ? (
                            <div className="flex-1 flex gap-2">
                                <input
                                    type="text"
                                    value={formData.name_en}
                                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                                    placeholder="English"
                                    className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                                />
                                <input
                                    type="text"
                                    value={formData.name_ne}
                                    onChange={(e) => setFormData({ ...formData, name_ne: e.target.value })}
                                    placeholder="नेपाली"
                                    className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                                />
                                <button
                                    onClick={handleUpdate}
                                    disabled={saving}
                                    className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    className="p-1.5 bg-slate-200 text-slate-600 rounded hover:bg-slate-300"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <span className="text-sm font-medium text-slate-700">{cat.name_en}</span>
                                    {cat.name_ne && (
                                        <span className="text-xs text-slate-400 ml-2">({cat.name_ne})</span>
                                    )}
                                </div>
                                {canManage && (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => startEdit(cat)}
                                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Add New Form */}
            {canManage && (
                <>
                    {showForm ? (
                        <div className="border-t border-slate-100 pt-4 space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    value={formData.name_en}
                                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                                    placeholder="Category name (English)"
                                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                />
                                <input
                                    type="text"
                                    value={formData.name_ne}
                                    onChange={(e) => setFormData({ ...formData, name_ne: e.target.value })}
                                    placeholder="नाम (नेपाली)"
                                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAdd}
                                    disabled={saving || !formData.name_en.trim()}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                                    Add Category
                                </button>
                                <button
                                    onClick={() => { setShowForm(false); setFormData({ name_en: "", name_ne: "" }); }}
                                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowForm(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-slate-200 text-slate-500 rounded-lg text-sm hover:border-slate-300 hover:text-slate-600"
                        >
                            <Plus size={16} />
                            Add New Category
                        </button>
                    )}
                </>
            )}

            {!canManage && (
                <p className="text-xs text-slate-400 mt-4 text-center">
                    Contact a Central Committee member to add new categories.
                </p>
            )}
        </div>
    );
}
