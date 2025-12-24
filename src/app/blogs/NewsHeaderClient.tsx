"use client";

import { useLanguage } from "@/context/LanguageContext";
import ContributeButton from "@/components/ContributeButton";

export default function BlogsHeaderClient() {
    const { t } = useLanguage();

    return (
        <div className="bg-gradient-to-r from-brand-blue to-brand-navy text-white py-16 md:py-24 px-4">
            <div className="max-w-7xl mx-auto text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    {t("Progressive Blogs", "प्रगतिशील विचार")}
                </h1>
                <p className="text-xl md:text-2xl font-nepali opacity-90">
                    {t("प्रगतिशील विचार", "Progressive Blogs")}
                </p>
                <p className="text-blue-100 max-w-2xl mx-auto mt-4 text-sm md:text-base">
                    {t(
                        "Insights, ideas, and thought leadership from our committee members.",
                        "हाम्रा समिति सदस्यहरूबाट विचार, लेख र नेतृत्व"
                    )}
                </p>

                {/* Contribute Button - shows only for authenticated contributors */}
                <div className="pt-4">
                    <ContributeButton />
                </div>
            </div>
        </div>
    );
}
