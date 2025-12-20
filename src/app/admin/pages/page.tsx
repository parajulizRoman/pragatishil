"use client";

import { useState, useEffect } from "react";
import { updateSiteSettings } from "@/actions/cms";
import { createClient } from "@/lib/supabase/client";
import { Save, Loader2, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PagesManager() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // We manage Hero, Vision, About separately or tabbed
    const [activeTab, setActiveTab] = useState<'hero' | 'vision' | 'about' | 'contact'>('hero');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [heroSettings, setHeroSettings] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [visionSettings, setVisionSettings] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [aboutSettings, setAboutSettings] = useState<any>(null);

    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        loadAll();
    }, []);

    async function loadAll() {
        const supabase = createClient();

        // 1. Fetch Role & User
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: p } = await supabase.from('profiles').select('role').eq('id', user.id).single();
            setUserRole(p?.role);

            // STRICT GUARD: Central Committee cannot access Pages Manager
            if (p?.role === 'central_committee') {
                alert("Restricted: Central Committee members cannot edit Site Pages.");
                // Redirect or show error state (state handled below)
                // For now, let's just set loading false and return early in render?
                // Better: set a "restricted" state
                setLoading(false);
                return;
            }
        }

        // 2. Fetch Settings
        const { data: hero } = await supabase.from('site_settings').select('content').eq('key', 'hero').single();
        if (hero) setHeroSettings(hero.content);

        const { data: vision } = await supabase.from('site_settings').select('content').eq('key', 'vision').single();
        if (vision) setVisionSettings(vision.content);

        const { data: about } = await supabase.from('site_settings').select('content').eq('key', 'about').single();
        if (about) setAboutSettings(about.content);

        setLoading(false);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [errors, setErrors] = useState<any[] | null>(null);

    // ... (rest of loadAll, etc)

    async function handleSave() {
        setSaving(true);
        setErrors(null);
        try {
            let result;
            if (activeTab === 'hero') result = await updateSiteSettings('hero', heroSettings);
            if (activeTab === 'vision') result = await updateSiteSettings('vision', visionSettings);
            if (activeTab === 'about') result = await updateSiteSettings('about', aboutSettings);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const r = result as any;

            if (r && !r.success) {
                if (r.type === 'validation') {
                    setErrors(r.error);
                    alert("Validation Failed. Please check the highlighted fields.");
                } else {
                    alert("Save failed: " + r.error);
                }
            } else {
                alert("Page content saved!");
            }
        } catch (e) {
            console.error(e);
            alert("Save failed due to unexpected error.");
        }
        setSaving(false);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (setter: any, path: string, value: string) => {
        const keys = path.split('.');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setter((prev: any) => {
            const deepClone = JSON.parse(JSON.stringify(prev));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let current = deepClone;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return deepClone;
        });
    };

    if (loading) return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-12 w-40 rounded-2xl" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-2">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-14 w-full rounded-2xl" />)}
                </div>
                <div className="lg:col-span-3">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6">
                        <Skeleton className="h-8 w-40" />
                        <div className="grid grid-cols-2 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-12 w-full rounded-2xl" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // GUARD RENDER
    if (userRole === 'central_committee') {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <div className="bg-red-50 p-6 rounded-full">
                    <Shield size={48} className="text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800">Access Restricted</h1>
                <p className="text-slate-500 max-w-md">
                    Central Committee members do not have permission to manage global site pages.
                    Please use the <span className="font-bold text-slate-700">News Room</span> or <span className="font-bold text-slate-700">Media Gallery</span> instead.
                </p>
                <a href="/admin" className="text-brand-blue font-bold hover:underline">Return to Dashboard</a>
            </div>
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allTabs = [
        { id: 'hero', label: 'Hero Section', icon: '🚀', restricted: true },
        { id: 'vision', label: 'Vision & Pillars', icon: '🎯' },
        { id: 'about', label: 'About Us', icon: '📖' },
        { id: 'contact', label: 'Contact & Footer', icon: '📞' },
    ] as const;

    const canEditHero = userRole && ['admin', 'admin_party', 'yantrik', 'board'].includes(userRole);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allowedTabs = allTabs.filter(t => !(t as any).restricted || canEditHero);

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md pb-4 pt-4 mb-8 border-b border-slate-200">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-brand-navy tracking-tight">Pages Content</h1>
                        <p className="text-sm text-slate-500 font-medium mt-1">Manage global site areas and static translations.</p>
                    </div>
                    {/* Hide Save button if restricted tab and somehow active */}
                    {(activeTab !== 'hero' || allowedTabs.find(t => t.id === 'hero')) && (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center space-x-2 bg-brand-blue text-white px-8 py-3 rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200 font-black uppercase text-xs tracking-widest"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            <span>Save {activeTab.toUpperCase()}</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1 space-y-2">
                    {allowedTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all text-sm border-2 ${activeTab === tab.id
                                ? "bg-white text-brand-blue border-brand-blue shadow-md scale-[1.02]"
                                : "bg-transparent text-slate-500 border-transparent hover:bg-slate-100"
                                }`}
                        >
                            <span className="text-xl">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Form Area */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Error Banner */}
                    {errors && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700 font-bold">
                                        Please fix the following validation errors:
                                    </p>
                                    <ul className="list-disc list-inside text-xs text-red-600 mt-1">
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {Array.isArray(errors) ? errors.map((err: any, i) => (
                                            <li key={i}>{err.path.join('.')} : {err.message}</li>
                                        )) : <li>{String(errors)}</li>}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Hero Form */}
                    {activeTab === 'hero' && heroSettings && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-8">
                                <div className="border-l-8 border-brand-red pl-4">
                                    <h2 className="text-xl font-black text-brand-navy uppercase tracking-tight">Hero Section</h2>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Main banner content.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="form-label">Hero Pill (NE)</label>
                                        <input type="text" className="form-input !font-bold"
                                            value={heroSettings.pillNe || ""} onChange={e => handleChange(setHeroSettings, 'pillNe', e.target.value)} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="form-label">Title (EN)</label>
                                        <textarea rows={3} className="form-input !font-bold"
                                            value={heroSettings.titleEn} onChange={e => handleChange(setHeroSettings, 'titleEn', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="form-label">Title (NE)</label>
                                        <textarea rows={3} className="form-input !font-bold"
                                            value={heroSettings.titleNe} onChange={e => handleChange(setHeroSettings, 'titleNe', e.target.value)} />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="form-label">Subtitle Line 1 (EN)</label>
                                        <input type="text" className="form-input !font-bold"
                                            value={heroSettings.subtitleEnLine1} onChange={e => handleChange(setHeroSettings, 'subtitleEnLine1', e.target.value)} />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="form-label">Subtitle Line 2 (EN)</label>
                                        <textarea rows={2} className="form-input !font-bold"
                                            value={heroSettings.subtitleEnLine2} onChange={e => handleChange(setHeroSettings, 'subtitleEnLine2', e.target.value)} />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="form-label">Subtitle (NE)</label>
                                        <textarea rows={2} className="form-input !text-lg !font-bold"
                                            value={heroSettings.subtitleNe} onChange={e => handleChange(setHeroSettings, 'subtitleNe', e.target.value)} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="form-label">Primary CTA (EN)</label>
                                        <input type="text" className="form-input !font-bold"
                                            value={heroSettings.ctaPrimary || ""} onChange={e => handleChange(setHeroSettings, 'ctaPrimary', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="form-label">Secondary CTA (EN)</label>
                                        <input type="text" className="form-input !font-bold"
                                            value={heroSettings.ctaSecondary || ""} onChange={e => handleChange(setHeroSettings, 'ctaSecondary', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Vision Form */}
                    {activeTab === 'vision' && visionSettings && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-8">
                                <div className="border-l-8 border-brand-blue pl-4">
                                    <h2 className="text-xl font-black text-brand-navy uppercase tracking-tight">Vision Header</h2>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Core philosophy and mission.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="form-label">Header (EN)</label>
                                        <input type="text" className="form-input !font-bold"
                                            value={visionSettings.titleEn || ""} onChange={e => handleChange(setVisionSettings, 'titleEn', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="form-label">Header (NE)</label>
                                        <input type="text" className="form-input !text-lg !font-bold"
                                            value={visionSettings.titleNe || ""} onChange={e => handleChange(setVisionSettings, 'titleNe', e.target.value)} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="form-label">Vision Text (EN)</label>
                                        <textarea rows={4} className="form-input !font-medium"
                                            value={visionSettings.textEn} onChange={e => handleChange(setVisionSettings, 'textEn', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="form-label">Vision Text (NE)</label>
                                        <textarea rows={4} className="form-input !font-medium"
                                            value={visionSettings.textNe} onChange={e => handleChange(setVisionSettings, 'textNe', e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-8">
                                <div className="border-l-8 border-brand-red pl-4">
                                    <h2 className="text-xl font-black text-brand-navy uppercase tracking-tight">Pillars</h2>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Six core ideological pillars.</p>
                                </div>

                                <div className="space-y-6">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {visionSettings.pillars.map((pillar: any, index: number) => (
                                        <div key={index} className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-100 group hover:border-brand-blue transition-all">
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                                <div className="md:col-span-2 space-y-2">
                                                    <label className="form-label text-center">Icon</label>
                                                    <input type="text" className="form-input !text-3xl text-center" value={pillar.icon}
                                                        onChange={e => {
                                                            const newPillars = [...visionSettings.pillars];
                                                            newPillars[index].icon = e.target.value;
                                                            setVisionSettings({ ...visionSettings, pillars: newPillars });
                                                        }}
                                                    />
                                                </div>
                                                <div className="md:col-span-5 space-y-2">
                                                    <label className="form-label">Title (EN)</label>
                                                    <input type="text" className="form-input !font-black !text-brand-navy" value={pillar.titleEn}
                                                        onChange={e => {
                                                            const newPillars = [...visionSettings.pillars];
                                                            newPillars[index].titleEn = e.target.value;
                                                            setVisionSettings({ ...visionSettings, pillars: newPillars });
                                                        }}
                                                    />
                                                </div>
                                                <div className="md:col-span-5 space-y-2">
                                                    <label className="form-label">Title (NE)</label>
                                                    <input type="text" className="form-input !font-black !text-brand-navy" value={pillar.titleNe || ""}
                                                        onChange={e => {
                                                            const newPillars = [...visionSettings.pillars];
                                                            newPillars[index].titleNe = e.target.value;
                                                            setVisionSettings({ ...visionSettings, pillars: newPillars });
                                                        }}
                                                    />
                                                </div>
                                                <div className="md:col-span-6 space-y-2">
                                                    <label className="form-label">Description (EN)</label>
                                                    <textarea rows={2} className="form-input !text-sm !font-medium !text-slate-600" value={pillar.descEn}
                                                        onChange={e => {
                                                            const newPillars = [...visionSettings.pillars];
                                                            newPillars[index].descEn = e.target.value;
                                                            setVisionSettings({ ...visionSettings, pillars: newPillars });
                                                        }}
                                                    />
                                                </div>
                                                <div className="md:col-span-6 space-y-2">
                                                    <label className="form-label">Description (NE)</label>
                                                    <textarea rows={2} className="form-input !text-sm !font-medium !text-slate-600" value={pillar.descNe || ""}
                                                        onChange={e => {
                                                            const newPillars = [...visionSettings.pillars];
                                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                            newPillars[index].descNe = e.target.value;
                                                            setVisionSettings({ ...visionSettings, pillars: newPillars });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* About Form */}
                    {activeTab === 'about' && aboutSettings && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-8">
                                <div className="border-l-8 border-brand-red pl-4">
                                    <h2 className="text-xl font-black text-brand-navy uppercase tracking-tight">About Us</h2>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Detailed organizational overview.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="form-label">Title (EN)</label>
                                        <input type="text" className="form-input !font-bold"
                                            value={aboutSettings.titleEn || ""} onChange={e => handleChange(setAboutSettings, 'titleEn', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="form-label">Title (NE)</label>
                                        <input type="text" className="form-input !text-lg !font-bold"
                                            value={aboutSettings.titleNe || ""} onChange={e => handleChange(setAboutSettings, 'titleNe', e.target.value)} />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="form-label">Description (EN)</label>
                                        <textarea rows={8} className="form-input !font-medium leading-relaxed"
                                            value={aboutSettings.descriptionEn} onChange={e => handleChange(setAboutSettings, 'descriptionEn', e.target.value)} />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="form-label">Description (NE)</label>
                                        <textarea rows={8} className="form-input !font-medium leading-relaxed"
                                            value={aboutSettings.descriptionNe} onChange={e => handleChange(setAboutSettings, 'descriptionNe', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact/Settings Tab Placeholder */}
                    {activeTab === 'contact' && (
                        <div className="p-12 text-center bg-white rounded-3xl border-4 border-dashed border-slate-100">
                            <span className="text-4xl mb-4 block">🛠️</span>
                            <h3 className="font-black text-slate-800 uppercase tracking-tight">Advanced Settings</h3>
                            <p className="text-slate-500 max-w-xs mx-auto mt-2 font-medium">Contact info, social links, and footer configuration are coming soon in this module.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
