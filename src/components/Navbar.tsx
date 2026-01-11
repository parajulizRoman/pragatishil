"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BrandButton } from "./BrandButton";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { createBrowserClient } from "@supabase/ssr";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null);
    const { t } = useLanguage();
    const { nav } = useSiteSettings();

    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setUser((session as any)?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const navLinks = [
        { name: t(nav?.home?.en || "Home", nav?.home?.ne || "गृहपृष्ठ"), href: "/" },
        { name: t(nav?.media?.en || "Media", nav?.media?.ne || "मिडिया"), href: "/media" },
        { name: t(nav?.about?.en || "About", nav?.about?.ne || "हाम्रो बारेमा"), href: "/about" },
        { name: t(nav?.contact?.en || "Contact", nav?.contact?.ne || "सम्पर्क"), href: "/contact" },
    ];

    return (
        <nav className="bg-white/90 backdrop-blur-md shadow-sm fixed w-full z-50 transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex-shrink-0">
                            {/* Just text logo for now to match prompt "Party logo and name" */}
                            <span className="font-bold text-xl tracking-tight text-brand-red">
                                {t(nav?.brand?.firstEn || "Pragatishil", nav?.brand?.firstNe || "प्रगतिशील")} <span className="text-brand-blue">{t(nav?.brand?.secondEn || "Loktantrik", nav?.brand?.secondNe || "लोकतान्त्रिक")}</span>
                            </span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href} // Changed key to href as name is dynamic
                                    href={link.href}
                                    className="text-slate-700 hover:text-brand-blue px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="/members"
                                className="text-slate-700 hover:text-brand-blue px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                {t(nav?.members?.en || "Members", nav?.members?.ne || "सदस्यहरू")}
                            </Link>
                            <Link
                                href="/commune/khulla-manch"
                                className="text-slate-700 hover:text-brand-blue px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                {t("Community", "समुदाय")}
                            </Link>
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <NotificationBell />
                                    <Link
                                        href={`/members/${user.id}`}
                                        className="text-sm font-medium text-slate-700 hover:text-brand-blue"
                                    >
                                        {t("My Profile", "मेरो प्रोफाइल")}
                                    </Link>
                                    <button
                                        onClick={async () => {
                                            const supabase = createBrowserClient(
                                                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                                                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                                            );
                                            await supabase.auth.signOut();
                                            window.location.href = "/"; // Force reload/redirect
                                        }}
                                        className="text-sm font-medium text-slate-500 hover:text-brand-red"
                                    >
                                        {t("Sign Out", "बाहिर निस्कनुहोस्")}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <BrandButton href="/join" variant="primary" className="px-4 py-2 text-sm">
                                        {t(nav?.join?.en || "Join Movement", nav?.join?.ne || "अभियानमा जोडिनुहोस्")}
                                    </BrandButton>
                                    <Link href="/auth/login" className="text-sm font-medium text-slate-500 hover:text-brand-blue">
                                        {t("Sign In", "साइन इन")}
                                    </Link>
                                </>
                            )}

                            <div className="ml-4 border-l pl-4 border-slate-200">
                                <LanguageSwitcher />
                            </div>
                        </div>
                    </div>

                    <div className="-mr-2 flex md:hidden items-center gap-2">
                        {user && <NotificationBell className="md:hidden" />}
                        <LanguageSwitcher />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="bg-slate-100 inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 focus:ring-blue-500"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {/* Icon Menu */}
                            {!isOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-slate-100" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-slate-700 hover:text-brand-blue block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/members"
                            className="text-slate-700 hover:text-brand-blue block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            {t(nav?.members?.en || "Members", nav?.members?.ne || "सदस्यहरू")}
                        </Link>
                        <Link
                            href="/commune/khulla-manch"
                            className="text-slate-700 hover:text-brand-blue block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            {t("Community", "समुदाय")}
                        </Link>

                        {user ? (
                            <>
                                {/* Mobile-only quick links for logged in users */}
                                <div className="border-t border-slate-100 my-2 pt-2">
                                    <Link
                                        href="/messages"
                                        className="text-slate-700 hover:text-brand-blue flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        {t("Messages", "सन्देश")}
                                    </Link>
                                    <Link
                                        href="/notifications"
                                        className="text-slate-700 hover:text-brand-blue flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        {t("Notifications", "सूचना")}
                                    </Link>
                                    <Link
                                        href="/write"
                                        className="text-slate-700 hover:text-brand-blue flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        {t("Write", "लेख्नुहोस्")}
                                    </Link>
                                </div>

                                <div className="border-t border-slate-100 my-2 pt-2">
                                    <Link
                                        href={`/members/${user.id}`}
                                        className="text-slate-700 hover:text-brand-blue block px-3 py-2 rounded-md text-base font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {t("My Profile", "मेरो प्रोफाइल")}
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className="text-slate-700 hover:text-brand-blue block px-3 py-2 rounded-md text-base font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {t("Settings", "सेटिङ")}
                                    </Link>
                                    <button
                                        onClick={async () => {
                                            const supabase = createBrowserClient(
                                                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                                                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                                            );
                                            await supabase.auth.signOut();
                                            window.location.href = "/";
                                        }}
                                        className="w-full text-left text-red-600 font-medium px-3 py-2 rounded-md hover:bg-red-50"
                                    >
                                        {t("Sign Out", "बाहिर निस्कनुहोस्")}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="border-t border-slate-100 my-2 pt-2 space-y-2">
                                <Link
                                    href="/auth/login"
                                    className="text-slate-700 hover:text-brand-blue block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {t("Sign In", "साइन इन")}
                                </Link>
                                <BrandButton
                                    href="/join"
                                    variant="primary"
                                    className="w-full text-center justify-center"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {t(nav?.join?.en || "Join Movement", nav?.join?.ne || "अभियानमा जोडिनुहोस्")}
                                </BrandButton>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
