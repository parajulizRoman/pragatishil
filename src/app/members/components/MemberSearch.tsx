"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface MemberSearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function MemberSearch({ value, onChange, placeholder = "Search members..." }: MemberSearchProps) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full sm:w-64 pl-10 pr-9 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors"
            />
            {value && (
                <button
                    onClick={() => onChange("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
