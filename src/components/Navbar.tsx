"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandButton } from "./BrandButton";
import { siteContent } from "@/config/siteContent";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
// import { Menu, X } from "lucide-react"; // Removed to use raw SVGs if package missing 
// If lucide-react not present, I'll fallback to SVG. Next.js usually ships with basic SVGs or icons.
// I will use SVGs to be safe and avoid dependency errors if lucide not installed.

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();

    const navLinks = [
        { name: t(siteContent.nav.home.en, siteContent.nav.home.ne), href: "/" },
        { name: t(siteContent.nav.news.en, siteContent.nav.news.ne), href: "/news" },
        { name: t(siteContent.nav.media.en, siteContent.nav.media.ne), href: "/media" },
        { name: t(siteContent.nav.about.en, siteContent.nav.about.ne), href: "/about" },
        { name: t(siteContent.nav.contact.en, siteContent.nav.contact.ne), href: "/contact" },
    ];

    return (
        <nav className="bg-white/90 backdrop-blur-md shadow-sm fixed w-full z-50 transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex-shrink-0">
                            {/* Just text logo for now to match prompt "Party logo and name" */}
                            <span className="font-bold text-xl tracking-tight text-brand-red">
                                {t(siteContent.nav.brand.firstEn, siteContent.nav.brand.firstNe)} <span className="text-brand-blue">{t(siteContent.nav.brand.secondEn, siteContent.nav.brand.secondNe)}</span>
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
                                {t(siteContent.nav.members.en, siteContent.nav.members.ne)}
                            </Link>
                            <BrandButton href="/join" variant="primary" className="px-4 py-2 text-sm">
                                {t(siteContent.nav.join.en, siteContent.nav.join.ne)}
                            </BrandButton>

                            <div className="ml-4 border-l pl-4 border-slate-200">
                                <LanguageSwitcher />
                            </div>
                        </div>
                    </div>

                    <div className="-mr-2 flex md:hidden items-center gap-2">
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
                            {t(siteContent.nav.members.en, siteContent.nav.members.ne)}
                        </Link>
                        <BrandButton
                            href="/join"
                            variant="primary"
                            className="w-full text-center mt-4 justify-center"
                            onClick={() => setIsOpen(false)}
                        >
                            {t(siteContent.nav.join.en, siteContent.nav.join.ne)}
                        </BrandButton>
                    </div>
                </div>
            )}
        </nav>
    );
}
