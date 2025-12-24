"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { PenLine } from "lucide-react";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function BlogsHeaderClient() {
    const { t } = useLanguage();
    const [canWrite, setCanWrite] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", user.id)
                    .single();
                if (profile) {
                    const writeRoles = ["central_committee", "board", "admin_party", "yantrik", "admin", "party_member"];
                    setCanWrite(writeRoles.includes(profile.role));
                }
            }
        };
        checkAuth();
    }, []);

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

                {/* Prominent Write Blog Button */}
                {canWrite && (
                    <div className="pt-6">
                        <Link
                            href="/blogs/write"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-blue font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        >
                            <PenLine className="w-5 h-5" />
                            {t("Write a Blog", "ब्लग लेख्नुहोस्")}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
