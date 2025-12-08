"use client";

import { useState, useEffect } from "react";
import { updateSiteSettings } from "@/actions/cms";
// Simplified: I will fetch initial data via a useEffect calling a Server Action that returns data.

import { Save, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function GeneralSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        // We can use the public API or a server action. 
        // For simplicity in this protected route, let's use a server action wrapper or just direct supabase if RLS allows.
        // `site_settings` is public read.
        const supabase = createClient();
        const { data } = await supabase
            .from('site_settings')
            .select('content')
            .eq('key', 'global')
            .single();

        if (data) {
            setSettings(data.content);
        } else {
            // Fallback to defaults (would come from seeding)
            console.log("No global settings found in DB");
        }
        setLoading(false);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            await updateSiteSettings('global', settings);
            alert("Settings saved successfully!");
        } catch (error) {
            alert("Failed to save settings");
            console.error(error);
        }
        setSaving(false);
    }

    if (loading) return <div className="p-8">Loading settings...</div>;
    if (!settings) return <div className="p-8">Error loading settings. Ensure database is seeded.</div>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (path: string, value: string) => {
        const keys = path.split('.');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setSettings((prev: any) => {
            const deepClone = JSON.parse(JSON.stringify(prev));
            let current = deepClone;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return deepClone;
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">General Settings</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-brand-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    <span>Save Changes</span>
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">Brand Names</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Brand First (EN)</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={settings.nav.brand.firstEn}
                            onChange={e => handleChange('nav.brand.firstEn', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Brand Second (EN)</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={settings.nav.brand.secondEn}
                            onChange={e => handleChange('nav.brand.secondEn', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Brand First (NE)</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={settings.nav.brand.firstNe}
                            onChange={e => handleChange('nav.brand.firstNe', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Brand Second (NE)</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={settings.nav.brand.secondNe}
                            onChange={e => handleChange('nav.brand.secondNe', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">Contact Information</h2>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={settings.contact.address}
                            onChange={e => handleChange('contact.address', e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full p-2 border rounded"
                                value={settings.contact.email}
                                onChange={e => handleChange('contact.email', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={settings.contact.phone}
                                onChange={e => handleChange('contact.phone', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">Footer Taglines</h2>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Tagline (EN)</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={settings.footer.taglineEn}
                            onChange={e => handleChange('footer.taglineEn', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tagline (NE)</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={settings.footer.taglineNe}
                            onChange={e => handleChange('footer.taglineNe', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Socials could be added here similarly */}
        </div>
    );
}
