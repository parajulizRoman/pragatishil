import { BrandButton } from "@/components/BrandButton";
import { SectionHeader } from "@/components/SectionHeader";
import { siteContent } from "@/config/siteContent";

export const metadata = {
    title: "About Us | Pragatishil Loktantrik",
    description: siteContent.about.descriptionEn,
};

export default function AboutPage() {
    return (
        <main className="min-h-screen py-12 md:py-20">
            <div className="container mx-auto px-4">

                <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Header Image or Gradient */}
                    <div className="h-64 bg-brand-tricolor flex items-center justify-center p-8 text-center relative overflow-hidden">
                        {/* Overlay to ensure text readability if needed, or rely on text shadow */}
                        <div className="absolute inset-0 bg-brand-navy/10"></div>
                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                        <div className="relative z-10 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm inline-block">
                            <SectionHeader
                                titleEn="About Us"
                                titleNe="हाम्रो बारेमा"
                            />
                        </div>
                    </div>

                    <div className="p-8 md:p-16">
                        {/* Intro Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                            <div className="prose prose-lg">
                                <h3 className="text-2xl font-bold text-blue-800 mb-4 border-b-2 border-blue-100 pb-2">Our Mission</h3>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    {siteContent.about.descriptionEn}
                                </p>
                                <p className="text-slate-600 mt-4 leading-relaxed">
                                    {siteContent.vision.textEn}
                                </p>
                            </div>
                            <div className="prose prose-lg">
                                <h3 className="text-2xl font-bold text-red-800 mb-4 border-b-2 border-red-100 pb-2">हाम्रो अभियान</h3>
                                <p className="text-slate-600 leading-relaxed text-lg font-medium">
                                    {siteContent.about.descriptionNe}
                                </p>
                                <p className="text-slate-600 mt-4 leading-relaxed font-medium">
                                    {siteContent.vision.textNe}
                                </p>
                            </div>
                        </div>

                        {/* Pillars */}
                        <div className="mb-16">
                            <h3 className="text-center text-2xl font-bold text-slate-800 mb-8">Our Core Values / हाम्रा मूल्यमान्यताहरू</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {siteContent.vision.pillars.map((pillar, idx) => (
                                    <div key={idx} className="p-6 bg-slate-50 border border-slate-100 rounded-xl text-center hover:bg-white hover:shadow-lg transition-all">
                                        <div className="text-5xl mb-4">{pillar.icon}</div>
                                        <div className="font-bold text-slate-800">{pillar.titleEn}</div>
                                        <div className="text-sm text-brand-blue font-medium">{pillar.titleNe}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row justify-center gap-6 border-t border-slate-100 pt-12">
                            <button className="px-8 py-3 bg-slate-100 text-slate-600 font-semibold rounded-full hover:bg-slate-200 transition-colors cursor-not-allowed opacity-70" title="Coming soon">
                                Read Official Documents
                            </button>
                            <BrandButton href="/join" variant="solid-blue" className="px-8 py-3 rounded-full text-base">
                                Join the Movement
                            </BrandButton>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
