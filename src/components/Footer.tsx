"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin } from "lucide-react";

export default function Footer() {
    const { t } = useLanguage();
    const { contact, social, footer, nav, hero } = useSiteSettings();

    // Map social names to icons
    const getSocialIcon = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('facebook')) return <Facebook className="w-5 h-5" />;
        if (lower.includes('twitter') || lower.includes('x')) return <Twitter className="w-5 h-5" />;
        if (lower.includes('instagram')) return <Instagram className="w-5 h-5" />;
        if (lower.includes('youtube')) return <Youtube className="w-5 h-5" />;
        if (lower.includes('tiktok')) return (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
        );
        return <Mail className="w-5 h-5" />; // Fallback
    };

    return (
        <footer className="bg-slate-900/10 backdrop-blur-md text-slate-200 py-12 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Column 1: Brand & Slogan */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-brand-red">
                            {t(nav?.brand?.firstEn || "Pragatishil", nav?.brand?.firstNe || "प्रगतिशील")} <span className="text-blue-900">{t(nav?.brand?.secondEn || "Loktantrik", nav?.brand?.secondNe || "लोकतान्त्रिक")}</span>
                        </h3>
                        <p className="text-xl text-blue-900 font-bold">
                            {t(footer?.taglineEn || "Building a just, progressive and prosperous Nepal.", footer?.taglineNe || "नेपाली माटो, हाम्रो बाटो")}
                        </p>
                        <p className="text-sm text-slate-600 font-medium">
                            {t(hero?.subtitleEnLine1 || "Progressive socialist, democratic alternative for Nepal.", hero?.subtitleNe || "प्रगतिशील समाजवादी, लोकतान्त्रिक विकल्प")}
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-brand-red">{t("Quick Links", "द्रुत लिङ्कहरू")}</h4>
                        <div className="flex flex-col space-y-2">
                            <Link href="/about" className="text-blue-900 hover:text-brand-red transition-colors font-medium">{t(nav?.about?.en || "About", nav?.about?.ne || "हाम्रो बारेमा")}</Link>
                            <Link href="/media" className="text-blue-900 hover:text-brand-red transition-colors font-medium">{t(nav?.media?.en || "Media", nav?.media?.ne || "मिडिया")}</Link>
                            <Link href="/members" className="text-blue-900 hover:text-brand-red transition-colors font-medium">{t(nav?.members?.en || "Members", nav?.members?.ne || "सदस्यहरू")}</Link>
                            <Link href="/join" className="text-blue-900 hover:text-brand-red transition-colors font-medium">{t(nav?.join?.en || "Join Movement", nav?.join?.ne || "अभियानमा जोडिनुहोस्")}</Link>
                            <Link href="/tools/date-converter" className="text-blue-900 hover:text-brand-red transition-colors font-medium">{t(nav?.tools?.dateConverter?.en || "Date Converter", nav?.tools?.dateConverter?.ne || "मिति परिवर्तन")}</Link>
                        </div>
                    </div>

                    {/* Column 3: Contact & Social */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">{t(nav?.contact?.en || "Contact", nav?.contact?.ne || "सम्पर्क")}</h4>
                        <div className="flex items-start gap-3 text-slate-600">
                            <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{contact?.address || "Baneshwor, Kathmandu, Nepal"}</span>
                        </div>
                        <a href={`mailto:${contact?.email || "info@pragatishil.org.np"}`} className="flex items-center gap-3 text-slate-600 hover:text-brand-blue transition-colors">
                            <Mail className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{contact?.email || "info@pragatishil.org.np"}</span>
                        </a>

                        <div className="flex space-x-4 mt-6">
                            {(social || []).map((s) => (
                                <a
                                    key={s.name}
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-brand-red hover:scale-110 transition-all duration-300"
                                    title={s.name}
                                >
                                    <span className="sr-only">{s.name}</span>
                                    {getSocialIcon(s.name)}
                                </a>
                            ))}
                        </div>
                    </div>

                </div>
                <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} {t("Pragatishil Loktantrik Party", "प्रगतिशील लोकतान्त्रिक पार्टी")}. {t("All rights reserved.", "सबै अधिकार सुरक्षित।")}
                </div>
            </div>
        </footer>
    );
}
