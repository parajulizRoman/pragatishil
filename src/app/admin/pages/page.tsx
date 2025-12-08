"use client";

import { useState, useEffect } from "react";
import { updateSiteSettings } from "@/actions/cms";
import { createClient } from "@/lib/supabase/client";
import { Save, Loader2 } from "lucide-react";

export default function PagesManager() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // We manage Hero, Vision, About separately or tabbed
    const [activeTab, setActiveTab] = useState<'hero' | 'vision' | 'about'>('hero');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [heroSettings, setHeroSettings] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [visionSettings, setVisionSettings] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [aboutSettings, setAboutSettings] = useState<any>(null);

    useEffect(() => {
        loadAll();
    }, []);

    async function loadAll() {
        const supabase = createClient();
        const { data: hero } = await supabase.from('site_settings').select('content').eq('key', 'hero').single();
        if (hero) setHeroSettings(hero.content);

        const { data: vision } = await supabase.from('site_settings').select('content').eq('key', 'vision').single();
        if (vision) setVisionSettings(vision.content);

        const { data: about } = await supabase.from('site_settings').select('content').eq('key', 'about').single();
        if (about) setAboutSettings(about.content);

        setLoading(false);
    }

    async function handleSave() {
        setSaving(true);
        try {
            if (activeTab === 'hero') await updateSiteSettings('hero', heroSettings);
            if (activeTab === 'vision') await updateSiteSettings('vision', visionSettings);
            if (activeTab === 'about') await updateSiteSettings('about', aboutSettings);
            alert("Page content saved!");
        } catch (e) {
            console.error(e);
            alert("Save failed");
        }
        setSaving(false);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (setter: any, path: string, value: string) => {
        const keys = path.split('.');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setter((prev: any) => {
            const deepClone = JSON.parse(JSON.stringify(prev));
            let current = deepClone;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return deepClone;
        });
    };

    if (loading) return <div className="p-8">Loading content...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Pages Content</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-brand-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    <span>Save {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-200 p-1 rounded-lg inline-block">
                {['hero', 'vision', 'about'].map(tab => (
                    <button
                        key={tab}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 rounded-md font-medium transition-all ${activeTab === tab ? "bg-white text-brand-blue shadow-sm" : "text-slate-600 hover:text-slate-900"
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Hero Form */}
            {activeTab === 'hero' && heroSettings && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2">Hero Section</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title (EN)</label>
                            <textarea rows={3} className="w-full p-2 border rounded" value={heroSettings.titleEn} onChange={e => handleChange(setHeroSettings, 'titleEn', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Title (NE)</label>
                            <textarea rows={3} className="w-full p-2 border rounded" value={heroSettings.titleNe} onChange={e => handleChange(setHeroSettings, 'titleNe', e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Subtitle Line 1 (EN)</label>
                            <input type="text" className="w-full p-2 border rounded" value={heroSettings.subtitleEnLine1} onChange={e => handleChange(setHeroSettings, 'subtitleEnLine1', e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Subtitle Line 2 (EN)</label>
                            <textarea rows={2} className="w-full p-2 border rounded" value={heroSettings.subtitleEnLine2} onChange={e => handleChange(setHeroSettings, 'subtitleEnLine2', e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Subtitle (NE)</label>
                            <textarea rows={2} className="w-full p-2 border rounded" value={heroSettings.subtitleNe} onChange={e => handleChange(setHeroSettings, 'subtitleNe', e.target.value)} />
                        </div>
                    </div>
                </div>
            )}

            {/* Vision Form */}
            {activeTab === 'vision' && visionSettings && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
                    <h2 className="text-lg font-semibold border-b pb-2">Vision & Pillars</h2>
                    <div>
                        <label className="block text-sm font-medium mb-1">Vision Text (EN)</label>
                        <textarea rows={3} className="w-full p-2 border rounded" value={visionSettings.textEn} onChange={e => handleChange(setVisionSettings, 'textEn', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Vision Text (NE)</label>
                        <textarea rows={3} className="w-full p-2 border rounded" value={visionSettings.textNe} onChange={e => handleChange(setVisionSettings, 'textNe', e.target.value)} />
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-slate-700">Pillars</h3>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {visionSettings.pillars.map((pillar: any, index: number) => (
                            <div key={index} className="border p-4 rounded-lg bg-slate-50 relative">
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                    <div className="md:col-span-1">
                                        <label className="block text-xs font-medium">Icon</label>
                                        <input type="text" className="w-full p-2 border rounded text-center text-xl" value={pillar.icon}
                                            onChange={e => {
                                                const newPillars = [...visionSettings.pillars];
                                                newPillars[index].icon = e.target.value;
                                                setVisionSettings({ ...visionSettings, pillars: newPillars });
                                            }}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-medium">Title (EN)</label>
                                        <input type="text" className="w-full p-2 border rounded" value={pillar.titleEn}
                                            onChange={e => {
                                                const newPillars = [...visionSettings.pillars];
                                                newPillars[index].titleEn = e.target.value;
                                                setVisionSettings({ ...visionSettings, pillars: newPillars });
                                            }}
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="block text-xs font-medium">Description (EN)</label>
                                        <input type="text" className="w-full p-2 border rounded" value={pillar.descEn}
                                            onChange={e => {
                                                const newPillars = [...visionSettings.pillars];
                                                newPillars[index].descEn = e.target.value;
                                                setVisionSettings({ ...visionSettings, pillars: newPillars });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* About Form */}
            {activeTab === 'about' && aboutSettings && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2">About Us Content</h2>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description (EN)</label>
                        <textarea rows={6} className="w-full p-2 border rounded" value={aboutSettings.descriptionEn} onChange={e => handleChange(setAboutSettings, 'descriptionEn', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description (NE)</label>
                        <textarea rows={6} className="w-full p-2 border rounded" value={aboutSettings.descriptionNe} onChange={e => handleChange(setAboutSettings, 'descriptionNe', e.target.value)} />
                    </div>
                </div>
            )}
        </div>
    );
}
