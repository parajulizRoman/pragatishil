"use client";
import React, { useState, useEffect } from "react";
/* eslint-disable */
import { X, Plus, Trash2 } from "lucide-react";

interface CategoryManagerProps {
    isOpen: boolean;
    onClose: () => void;
    currentCategories: string[]; // Or fetch internally
    onUpdate: () => void;
}

export default function CategoryManagerModal({ isOpen, onClose, onUpdate }: CategoryManagerProps) {
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
        if (!confirm(`Delete category "${name}"?`)) return;
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

    // Rename logic could be added here (double click?)
    // For now, simpler: "Delete and Create" is not same as rename. 
    // Let's add simple Rename via prompt? Or inline? Prompt is easiest for MVP.
    const handleRename = async (oldName: string) => {
        const newName = prompt("Rename category to:", oldName);
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">Manage Categories</h3>
                    <button onClick={onClose}>&times;</button>
                </div>
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {/* List */}
                    <ul className="space-y-2 mb-4">
                        {categories.map(c => (
                            <li key={c.name} className="flex justify-between items-center p-2 bg-slate-50 rounded group">
                                <span className="text-sm font-medium text-slate-700">{c.name}</span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleRename(c.name)} className="text-xs text-blue-500 hover:underline">Rename</button>
                                    <button onClick={() => handleDelete(c.name)} className="text-xs text-red-500 hover:underline">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

                    {/* Add */}
                    <div className="flex gap-2">
                        <input
                            value={newCategory}
                            onChange={e => setNewCategory(e.target.value)}
                            placeholder="New category..."
                            className="flex-1 border rounded px-2 py-1 text-sm"
                            onKeyDown={e => e.key === 'Enter' && handleCreate()}
                        />
                        <button
                            onClick={handleCreate}
                            disabled={loading}
                            className="px-3 py-1 bg-brand-navy text-white text-sm rounded hover:bg-slate-800"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
