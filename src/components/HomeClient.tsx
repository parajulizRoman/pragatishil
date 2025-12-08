"use client";

import Link from "next/link";
import { BrandButton } from "@/components/BrandButton";
import { SectionHeader } from "@/components/SectionHeader";
import { useLanguage } from "@/context/LanguageContext";
import { SiteSettings, NewsItem, MediaVideo } from "@/types/cms";
import { siteContent as fallbackContent } from "@/config/siteContent";

interface HomeClientProps {
    content: SiteSettings;
    news: NewsItem[];
    videos: MediaVideo[];
}

export default function HomeClient({ content, news, videos }: HomeClientProps) {
    const { t } = useLanguage();

    // Fallback if fetch failed completely and content is null (shouldn't happen with getSiteSettings logic but safe)
    const c = content || fallbackContent;
    const n = news && news.length > 0 ? news : fallbackContent.news;
    const v = videos && videos.length > 0 ? videos : fallbackContent.videos;

    return (
        <main className="flex flex-col min-h-screen">

            {/* Hero Section */}
            <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden text-white">

                {/* Background Tri-color Gradient - Managed by body globally */}
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 z-0"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    {/* Slogan Pill */}
                    <div className="inline-block mb-6 px-4 py-1.5 border border-brand-navy/20 bg-white/10 backdrop-blur-sm rounded-full text-brand-navy text-sm md:text-base font-bold tracking-wide shadow-sm">
                        {t(c.nav.brand.firstEn + " " + c.nav.brand.secondEn, c.hero.pillNe)}
                    </div>

                    {/* Main Title (Bilingual) */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-xl leading-tight text-brand-blue">
                        {t(c.hero.titleEn, c.hero.titleNe)}
                    </h1>

                    {/* Secondary Line (Bilingual) */}
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6 drop-shadow-md">
                        {t(c.hero.subtitleEnLine1, c.hero.subtitleNe)}
                    </h2>

                    {/* English/Nepali Support Text */}
                    <div className="max-w-3xl mx-auto mb-10 text-blue-950 font-medium text-lg md:text-xl space-y-1">
                        <p>{t(c.hero.subtitleEnLine2, "")}</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <BrandButton href="/join" variant="primary" className="px-8 py-4 text-lg">
                            {t(c.hero.ctaPrimary, c.nav.join.ne)}
                        </BrandButton>
                        <BrandButton href="/members" variant="secondary" className="px-8 py-4 text-lg border-slate-400 text-slate-100 hover:text-white hover:border-white">
                            {t(c.hero.ctaSecondary, c.nav.members.ne)}
                        </BrandButton>
                    </div>
                </div>
            </section>

            {/* Vision Section */}
            <section className="py-24 bg-white/60 backdrop-blur-sm">
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
                            <div key={idx} className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group">
                                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{pillar.icon}</div>
                                <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-blue transition-colors">
                                    {t(pillar.titleEn, pillar.titleNe)}
                                </h4>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    {t(pillar.descEn, pillar.descEn)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest News Section */}
            <section className="py-20 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12 border-b border-slate-100 pb-4">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">{t("Latest News & Media", "ताजा समाचार र मिडिया")}</h2>
                        </div>
                        <Link href="/news" className="text-brand-blue font-semibold hover:underline hidden md:block">
                            {t("View all news", "सबै समाचार हेर्नुहोस्")} &rarr;
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {n.slice(0, 3).map((item) => (
                            <Link key={item.id} href={item.link} className="block group h-full">
                                <div className="bg-slate-50 rounded-xl overflow-hidden hover:shadow-lg transition-all border border-slate-100 flex flex-col h-full">
                                    {/* Image */}
                                    {item.image && (
                                        <div className="relative h-48 w-full overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 self-start
                                      ${item.type === 'Video' ? 'bg-red-50 text-brand-red border border-red-100' : 'bg-blue-50 text-brand-blue border border-blue-100'}`}>
                                            {item.type}
                                        </span>
                                        <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">{item.title}</h3>
                                        <p className="text-sm text-slate-500 mt-auto">{item.source} • {item.date}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-8 text-center md:hidden">
                        <Link href="/news" className="text-brand-blue font-semibold hover:underline">
                            {t("View all news", "सबै समाचार हेर्नुहोस्")} &rarr;
                        </Link>
                    </div>
                </div>
            </section>

            {/* Watch & Follow Section */}
            <section className="py-24 text-white overflow-hidden relative">
                {/* Subtle Ambient Background */}
                <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-blue-900/10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl font-bold mb-16">Watch & Follow</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
                        {/* Embedded Video Placeholder */}
                        {v.map((video) => (
                            <div key={video.id} className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 hover:border-slate-500 transition-colors">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={video.url}
                                    title={video.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
}
