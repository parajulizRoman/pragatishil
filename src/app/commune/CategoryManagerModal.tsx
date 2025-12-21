"use client";
import React, { useState, useEffect } from "react";
/* eslint-disable */
import { X, Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

interface CategoryManagerProps {
    isOpen: boolean;
    onClose: () => void;
    currentCategories: string[]; // Or fetch internally
    onUpdate: () => void;
}

export default function CategoryManagerModal({ isOpen, onClose, onUpdate }: CategoryManagerProps) {
    const { t } = useLanguage();
    const [categories, setCategories] = useState<{ name: string }[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCats = async () => {
        const res = await fetch("/api/discussions/categories");
        if (res.ok) {
            const data = await res.json();
            setCategories(data.categories);
            onUpdate(); // Refresh parent too
        }
    };

    useEffect(() => {
        if (isOpen) fetchCats();
    }, [isOpen]);

    const handleCreate = async () => {
        if (!newCategory.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/discussions/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newCategory })
            });
            if (!res.ok) throw new Error((await res.json()).error);
            setNewCategory("");
            fetchCats();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (name: string) => {
        if (!confirm(t(`"${name}" विधा मेटाउने हो?`, `Delete category "${name}"?`))) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/discussions/categories?name=${encodeURIComponent(name)}`, {
                method: "DELETE"
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error);
            }
            fetchCats();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRename = async (oldName: string) => {
        const newName = prompt(t("विधा नाम बदल्नुहोस्:", "Rename category to:"), oldName);
        if (!newName || newName === oldName) return;

        try {
            const res = await fetch("/api/discussions/categories", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ oldName, newName })
            });
            if (!res.ok) throw new Error((await res.json()).error);
            fetchCats();
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
                    <Typography variant="h4" className="text-base font-bold text-slate-800">{t('विधाहरू व्यवस्थापन', 'Manage Categories')}</Typography>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-slate-400 hover:text-slate-600">
                        <X size={18} />
                    </Button>
                </div>
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {/* List */}
                    <ul className="space-y-2 mb-4">
                        {categories.map(c => (
                            <li key={c.name} className="flex justify-between items-center p-2 bg-slate-50 rounded group hover:bg-slate-100 transition-colors">
                                <span className="text-sm font-medium text-slate-700">{c.name}</span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" onClick={() => handleRename(c.name)} className="h-7 w-7 text-blue-500 hover:text-blue-700 hover:bg-blue-50" title={t("नाम बदल्नुहोस्", "Rename")}>
                                        <Edit2 size={12} />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(c.name)} className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50" title={t("मेटाउनुहोस्", "Delete")}>
                                        <Trash2 size={12} />
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {error && <Typography variant="muted" className="text-destructive mb-2 text-xs">{error}</Typography>}

                    {/* Add */}
                    <div className="flex gap-2">
                        <Input
                            value={newCategory}
                            onChange={e => setNewCategory(e.target.value)}
                            placeholder={t("नयाँ विधा...", "New category...")}
                            className="flex-1 h-9 text-sm"
                            onKeyDown={e => e.key === 'Enter' && handleCreate()}
                        />
                        <Button
                            onClick={handleCreate}
                            disabled={loading}
                            size="sm"
                            className="bg-brand-navy hover:bg-brand-navy/90 text-white"
                        >
                            <Plus size={16} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
