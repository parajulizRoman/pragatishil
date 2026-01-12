"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { SectionHeader } from "@/components/SectionHeader";
import { useLanguage } from "@/context/LanguageContext";
import { SiteSettings, NewsItem, MediaVideo } from "@/types/cms";
import { MediaItem } from "@/types";
import { siteContent as fallbackContent } from "@/config/siteContent";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface HomeClientProps {
    content: SiteSettings;
    news: NewsItem[];
    videos: MediaVideo[];
    documents?: MediaItem[];
}

export default function HomeClient({ content, news, videos, documents = [] }: HomeClientProps) {
    const { t } = useLanguage();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Check auth status
    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data: { user } } = await supabase.auth.getUser();
            setIsAuthenticated(!!user);
            setLoading(false);
        };
        checkAuth();
    }, []);

    // Defensive Merge: Ensure every section has defaults even if DB returns partial objects
    const c = {
        ...fallbackContent,
        ...content,
        hero: { ...fallbackContent.hero, ...content?.hero },
        vision: { ...fallbackContent.vision, ...content?.vision, pillars: content?.vision?.pillars || fallbackContent.vision.pillars },
        nav: { ...fallbackContent.nav, ...content?.nav },
        about: { ...fallbackContent.about, ...content?.about },
        contact: { ...fallbackContent.contact, ...content?.contact },
        // Arrays are harder to merge deeply, we usually take DB if it exists and has length, else default
        social: (content?.social && content.social.length > 0) ? content.social : fallbackContent.social,
        footer: { ...fallbackContent.footer, ...content?.footer },
    };

    // Use database items directly - no fallback placeholder content
    const n = news || [];
    const v = videos || [];

    return (
        <main className="flex flex-col min-h-screen">

            {/* Hero Section */}
            <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden text-center pb-20 pt-32">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] z-0 pointer-events-none"></div>

                {/* Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-white/40 blur-[120px] rounded-full -z-10"></div>

                <div className="relative z-10 container mx-auto px-4 flex flex-col items-center max-w-5xl">
                    {/* Slogan Pill */}
                    <div className="inline-flex items-center justify-center px-6 py-2 mb-8 border border-brand-navy/10 bg-white/60 backdrop-blur-md rounded-full text-brand-navy text-sm md:text-base font-bold tracking-wide shadow-sm animate-fade-in-up">
                        {t(c.nav.brand.firstEn + " " + c.nav.brand.secondEn, c.hero.pillNe)}
                    </div>

                    {/* Main Title */}
                    <Typography as="h1" variant="h1" className="mb-6 drop-shadow-sm leading-[1.1] !text-5xl md:!text-7xl lg:!text-8xl">
                        {(() => {
                            const text = t(c.hero.titleEn, c.hero.titleNe);
                            const words = text.split(" ");
                            return words.map((word, i) => {
                                const lower = word.toLowerCase().replace(/[^a-z\u0900-\u097f]/g, "");
                                let colorClass = "text-brand-navy";

                                if (lower.includes("pragatishil") || lower.includes("प्रगतिशील")) colorClass = "text-brand-red";
                                else if (lower.includes("loktantrik") || lower.includes("लोकतान्त्रिक")) colorClass = "text-brand-blue";
                                else if (lower.includes("party") || lower.includes("पार्टी")) colorClass = "text-brand-red";
                                else if (lower.includes("welcome") || lower.includes("स्वागत") || lower.includes("छ")) colorClass = "text-brand-blue";

                                return (
                                    <span key={i} className={`${colorClass} inline-block mx-1.5`}>
                                        {word}
                                    </span>
                                );
                            });
                        })()}
                    </Typography>

                    {/* Secondary Line */}
                    <Typography variant="h2" className="!text-2xl md:!text-4xl text-brand-blue/90 mb-8 font-bold border-none !pb-0">
                        {t(c.hero.subtitleEnLine1, c.hero.subtitleNe)}
                    </Typography>

                    {/* Support Text */}
                    <Typography variant="lead" className="max-w-2xl mx-auto mb-12 text-brand-navy/70 text-lg md:text-xl font-medium">
                        {t(c.hero.subtitleEnLine2, "")}
                    </Typography>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
                        {!loading && (
                            <Button asChild size="lg" className="px-10 py-7 text-lg shadow-xl shadow-brand-red/20 bg-brand-red hover:bg-brand-red/90 rounded-full transition-transform hover:-translate-y-1">
                                <Link href={isAuthenticated ? "/commune" : "/join"}>
                                    {isAuthenticated ? t("Commune", "कम्युन") : t(c.hero.ctaPrimary, c.nav.join.ne)}
                                </Link>
                            </Button>
                        )}
                        <Button asChild variant="outline" size="lg" className="px-10 py-7 text-lg border-brand-navy/20 text-brand-navy hover:bg-white/80 backdrop-blur-sm rounded-full transition-transform hover:-translate-y-1">
                            <Link href="/members">
                                {t(c.hero.ctaSecondary, c.nav.members.ne)}
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Vision Section */}
            <section className="py-24 bg-white/60 backdrop-blur-sm relative z-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <SectionHeader
                            titleEn={c.vision.titleEn}
                            titleNe={c.vision.titleNe}
                            descriptionEn={c.vision.textEn}
                            descriptionNe={c.vision.textNe}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {c.vision.pillars.map((pillar, idx) => (
                            <div key={idx} className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group hover:-translate-y-1">
                                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-md">{pillar.icon}</div>
                                <h4 className="text-xl font-bold text-brand-navy mb-3 group-hover:text-brand-blue transition-colors">
                                    {t(pillar.titleEn, pillar.titleNe)}
                                </h4>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    {t(pillar.descEn, pillar.descNe || pillar.descEn)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest News Section */}
            <section className="py-24 bg-brand-bg relative z-20 border-t border-brand-navy/5">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12 border-b border-slate-200 pb-4">
                        <Link href="/news" className="hover:opacity-80 transition-opacity">
                            <Typography variant="h2" className="border-none !pb-0 mb-1">{t("Latest News", "ताजा समाचार")}</Typography>
                            <Typography variant="muted">{t("Updates from the party", "पार्टीका गतिविधिहरु")}</Typography>
                        </Link>
                        <Button variant="link" asChild className="hidden md:flex text-brand-blue font-semibold">
                            <Link href="/news">
                                {t("View all news", "सबै समाचार हेर्नुहोस्")} &rarr;
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {n.slice(0, 3).map((item) => {
                            // For fallback/external news (small IDs), link to external source
                            // For DB news (id > 10), link to internal page
                            const isDbItem = typeof item.id === 'number' && item.id > 10;
                            const href = isDbItem
                                ? `/news/${item.slug || item.id}`
                                : (item.link || `/news/${item.slug || item.id}`);
                            const isExternal = !isDbItem && item.link;

                            return (
                                <Link
                                    key={item.id}
                                    href={href}
                                    target={isExternal ? "_blank" : undefined}
                                    rel={isExternal ? "noopener noreferrer" : undefined}
                                    className="block group h-full"
                                >
                                    <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full hover:-translate-y-1">
                                        {/* Image */}
                                        {(item.image_url || item.image) && (
                                            <div className="relative h-56 w-full overflow-hidden">
                                                <Image
                                                    src={item.image_url || item.image || ''}
                                                    alt={item.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 400px"
                                                    className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                                                />
                                                <div className="absolute top-3 left-3">
                                                    <span className={cn(
                                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide",
                                                        item.type === 'Video' ? 'bg-brand-red text-white shadow-md' : 'bg-brand-blue text-white shadow-md'
                                                    )}>
                                                        {item.type}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="text-lg font-bold text-brand-navy mb-3 line-clamp-2 group-hover:text-brand-blue transition-colors">
                                                {t(item.title, item.title_ne || item.title)}
                                            </h3>
                                            {(item.summary_en || item.summary_ne) && (
                                                <p className="text-sm text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                                                    {t(item.summary_en || "", item.summary_ne || "")}
                                                </p>
                                            )}
                                            <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400 font-medium uppercase tracking-wider">
                                                <span>{item.source}</span>
                                                <span>{item.date}</span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            );
                        })}
                    </div>
                    <div className="mt-8 text-center md:hidden">
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/news">
                                {t("View all news", "सबै समाचार हेर्नुहोस्")}
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Press Releases Section */}
            {documents && documents.length > 0 && (
                <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
                    <div className="container mx-auto px-4">
                        <SectionHeader
                            titleEn="Press Releases"
                            titleNe="प्रेस विज्ञप्ति"
                            descriptionEn="Official statements and documents from the party"
                            descriptionNe="पार्टीका आधिकारिक विज्ञप्ति र कागजातहरू"
                            href="/press-releases"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                            {documents.slice(0, 4).map((doc) => (
                                <a
                                    key={doc.id}
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                                >
                                    <div className="relative h-36 bg-gradient-to-br from-brand-red/10 to-brand-blue/10 flex items-center justify-center">
                                        <FileText size={48} className="text-brand-red/60 group-hover:scale-110 transition-transform" />
                                        <div className="absolute top-2 right-2">
                                            <span className="px-2 py-0.5 bg-brand-red text-white text-[9px] font-bold rounded-full uppercase">
                                                {doc.url?.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOC'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-sm text-brand-navy line-clamp-2 group-hover:text-brand-blue transition-colors">
                                            {t(doc.caption_ne || doc.title || '', doc.title || doc.caption || '')}
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-2">
                                            {new Date(doc.created_at).toISOString().split('T')[0]}
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>

                        <div className="text-center mt-10">
                            <Button asChild variant="outline" className="rounded-full px-8">
                                <Link href="/press-releases">
                                    {t("सबै प्रेस विज्ञप्ति हेर्नुहोस्", "View All Press Releases")} →
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            {/* Watch & Follow Section */}
            <section className="py-24 bg-brand-navy text-white overflow-hidden relative">
                {/* Subtle Ambient Background */}
                <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-brand-blue/20 blur-[150px] rounded-full pointer-events-none"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <Typography variant="h2" className="text-white border-none mb-16 !text-4xl">
                        {t("Watch & Follow", "हेर्नुहोस् र पछ्याउनुहोस्")}
                    </Typography>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
                        {v.map((video) => (
                            <div key={video.id} className="group">
                                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover:border-brand-blue transition-all duration-300 relative">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={video.embed_url || video.url}
                                        title={video.title || "Video"}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute inset-0 w-full h-full"
                                    ></iframe>
                                </div>
                                <h3 className="mt-5 text-base font-bold text-slate-300 group-hover:text-white transition-colors line-clamp-2">{video.title}</h3>
                            </div>
                        ))}
                    </div>

                    {/* View All Media Link */}
                    <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-brand-navy rounded-full px-10 py-7 text-lg transition-all">
                        <Link href="/media">
                            {t("View All Media", "सबै मिडिया हेर्नुहोस्")} →
                        </Link>
                    </Button>
                </div>
            </section>

        </main>
    );
}
