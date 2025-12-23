"use client";

import React, { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { ProfessionCategory } from "@/types";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfessionFilterProps {
    selected: string[];
    onChange: (categories: string[]) => void;
}

export default function ProfessionFilter({ selected, onChange }: ProfessionFilterProps) {
    const [categories, setCategories] = useState<ProfessionCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const supabase = createBrowserClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                );

                const { data } = await supabase
                    .from("profession_categories")
                    .select("*")
                    .order("sort_order");

                if (data) setCategories(data);
            } catch (error) {
                console.error("Failed to load profession categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const toggleCategory = (categoryName: string) => {
        if (selected.includes(categoryName)) {
            onChange(selected.filter(c => c !== categoryName));
        } else {
            onChange([...selected, categoryName]);
        }
    };

    const clearAll = () => {
        onChange([]);
        setIsOpen(false);
    };

    if (loading) {
        return <div className="h-10 w-36 bg-slate-100 animate-pulse rounded-lg" />;
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 hover:border-slate-300 transition-colors"
            >
                <span>
                    {selected.length === 0
                        ? "All Professions"
                        : `${selected.length} selected`}
                </span>
                <ChevronDown className={cn(
                    "h-4 w-4 text-slate-400 transition-transform",
                    isOpen && "rotate-180"
                )} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute z-20 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                        <div className="p-2 border-b border-slate-100 flex justify-between items-center">
                            <span className="text-xs font-medium text-slate-500 uppercase">Filter by Profession</span>
                            {selected.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="text-xs text-brand-blue hover:underline"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                        <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => toggleCategory(category.name_en)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                                        selected.includes(category.name_en)
                                            ? "bg-brand-blue/10 text-brand-blue"
                                            : "hover:bg-slate-50 text-slate-700"
                                    )}
                                >
                                    <span>{category.name_en}</span>
                                    {selected.includes(category.name_en) && (
                                        <Check className="h-4 w-4" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
