"use client";

import { useState } from "react";
import { Globe } from "lucide-react";

interface LanguageToggleProps {
    contentEn?: string | null;
    contentNe?: string | null;
}

export function LanguageToggle({ contentEn, contentNe }: LanguageToggleProps) {
    const [lang, setLang] = useState<"en" | "ne">(contentNe ? "ne" : "en");

    if (!contentEn && !contentNe) return null;

    // If only one language exists, just show it without toggle
    if (!contentEn) return <div className="prose prose-lg max-w-none prose-slate" dangerouslySetInnerHTML={{ __html: contentNe || "" }} />;
    if (!contentNe) return <div className="prose prose-lg max-w-none prose-slate" dangerouslySetInnerHTML={{ __html: contentEn || "" }} />;

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4 bg-slate-50 p-2 rounded-lg w-fit">
                <div className="text-sm font-medium text-slate-500 px-2 flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    Language:
                </div>
                <button
                    onClick={() => setLang("en")}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${lang === "en"
                            ? "bg-white text-brand-blue shadow-sm ring-1 ring-black/5"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                        }`}
                >
                    English
                </button>
                <button
                    onClick={() => setLang("ne")}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${lang === "ne"
                            ? "bg-white text-brand-red shadow-sm ring-1 ring-black/5"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                        }`}
                >
                    नेपाली
                </button>
            </div>

            <div
                className={`prose prose-lg max-w-none ${lang === 'ne' ? 'font-nepali' : ''}`}
            // Using whitespace-pre-wrap to respect newlines if it's plain text, 
            // or just letting prose handle it if it's HTML/Markdown-like.
            // Assuming simple text with newlines for now based on the admin input being a textarea.
            >
                <div className="whitespace-pre-wrap">
                    {lang === "en" ? contentEn : contentNe}
                </div>
            </div>
        </div>
    );
}
