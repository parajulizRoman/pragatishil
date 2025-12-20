"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translate, Lang } from "@/lib/translations";
import ContributeButton from "@/components/ContributeButton";

export default function NewsHeaderClient() {
    const { language } = useLanguage();
    const lang = language as Lang;

    return (
        <div className="bg-gradient-to-r from-brand-blue to-brand-navy text-white py-16 md:py-24 px-4">
            <div className="max-w-7xl mx-auto text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    {translate("news.headerTitle", lang)}
                </h1>
                <p className="text-xl md:text-2xl font-nepali opacity-90">
                    {lang === "en" ? "समाचार कक्ष" : "News Room"}
                </p>
                <p className="text-blue-100 max-w-2xl mx-auto mt-4 text-sm md:text-base">
                    {translate("news.headerSubtitle", lang)}
                </p>

                {/* Contribute Button - shows only for authenticated contributors */}
                <div className="pt-4">
                    <ContributeButton />
                </div>
            </div>
        </div>
    );
}

