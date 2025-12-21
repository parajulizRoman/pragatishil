"use client";

import { useState } from "react";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ContactFormProps {
    contact: {
        address?: string;
        email?: string;
        phone?: string;
    };
    social: Array<{ name: string; url: string; icon?: string }>;
}

export default function ContactForm({ contact, social }: ContactFormProps) {
    const { t } = useLanguage();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // In a real app, we would send data to API here.
    };

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
        <main className="min-h-screen bg-slate-50 py-12 md:py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 bg-white rounded-2xl shadow-lg overflow-hidden">

                    {/* Left: Contact Info */}
                    <div className="w-full md:w-1/3 bg-gradient-to-b from-brand-red/90 to-brand-blue/90 text-white p-10 flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-8">{t("सम्पर्क", "Contact Us")}</h1>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs uppercase text-slate-300 font-semibold tracking-wider">{t("ठेगाना", "Address")}</label>
                                    <p className="text-lg">{contact.address || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="text-xs uppercase text-slate-300 font-semibold tracking-wider">{t("इमेल", "Email")}</label>
                                    <p className="text-lg text-blue-200">{contact.email || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="text-xs uppercase text-slate-300 font-semibold tracking-wider">{t("फोन", "Phone")}</label>
                                    <p className="text-lg">{contact.phone || "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-lg font-semibold mb-4">{t("हामीलाई पछ्याउनुहोस्", "Follow Us")}</h3>
                            <div className="flex gap-4">
                                {social.map((s) => (
                                    <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-brand-blue flex items-center justify-center transition-colors text-white">
                                        {getSocialIcon(s.name)}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="w-full md:w-2/3 p-10">
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-green-50 rounded-xl border border-green-100">
                                <div className="text-6xl mb-4">✅</div>
                                <h2 className="text-2xl font-bold text-green-800 mb-2">{t("सन्देश प्राप्त भयो!", "Message Received!")}</h2>
                                <p className="text-green-700">{t("हामीलाई सम्पर्क गर्नुभएकोमा धन्यवाद। हामी छिट्टै तपाईंलाई जवाफ दिनेछौं।", "Thank you for contacting us. We will get back to you soon.")}</p>
                                <button onClick={() => setSubmitted(false)} className="mt-6 text-sm text-green-600 underline hover:text-green-800">
                                    {t("अर्को सन्देश पठाउनुहोस्", "Send another message")}
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">{t("हामीलाई सन्देश पठाउनुहोस्", "Send us a message")}</h2>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">{t("तपाईंको नाम", "Your Name")}</label>
                                            <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder={t("शहीद जेनज", "Shahid Genz")} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">{t("इमेल ठेगाना", "Email Address")}</label>
                                            <input required type="email" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="shaidGenz@pragatishil.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t("सन्देश", "Message")}</label>
                                        <textarea required rows={5} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder={t("हाम्रो बलिदान स्मरण गरी प्रगतिशील विचार अगाडी लैजाउनुस्", "In memory of our sacrifices, carry forward the progressive ideas")}></textarea>
                                    </div>
                                    <button type="submit" className="px-8 py-3 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
                                        {t("सन्देश पठाउनुहोस्", "Send Message")}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </main>
    );
}
