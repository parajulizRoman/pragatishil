/* eslint-disable */
import { X, Plus, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { DiscussionChannel, UserRole } from "@/types";
import { createBrowserClient } from "@supabase/ssr";

import CategoryManagerModal from "./CategoryManagerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/typography";
// import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Since I don't have shadcn Select yet, I'll use a styled native select
const NativeSelect = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, ...props }, ref) => (
    <div className="relative">
        <select
            className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            ref={ref}
            {...props}
        />
    </div>
));
NativeSelect.displayName = "NativeSelect";


interface ChannelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editChannel?: DiscussionChannel | null;
}

export default function ChannelModal({ isOpen, onClose, onSuccess, editChannel }: ChannelModalProps) {
    const { t } = useLanguage();
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [docsUrl, setDocsUrl] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [readmeContent, setReadmeContent] = useState("");
    const [category, setCategory] = useState("General");
    const [visibility, setVisibility] = useState<"public" | "logged_in" | "party_only">("public");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'details' | 'resources'>('details');

    // Resources State
    const [resources, setResources] = useState<{ title: string; type: string; url: string }[]>([]);

    // Category Manager State
    const [categoriesList, setCategoriesList] = useState<{ name: string }[]>([]);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    // Impact Stats State
    const [impactStats, setImpactStats] = useState<Record<string, string>>({});

    const handleAddStat = () => {
        setImpactStats({ ...impactStats, "": "" });
    };

    const handleRemoveStat = (keyToRemove: string) => {
        const newStats = { ...impactStats };
        delete newStats[keyToRemove];
        setImpactStats(newStats);
    };

    const handleStatChange = (oldKey: string, newKey: string, newValue: string) => {
        if (oldKey !== newKey) {
            // Key changed: create new entry, delete old
            const newStats = { ...impactStats };
            delete newStats[oldKey];
            newStats[newKey] = newValue;
            setImpactStats(newStats);
        } else {
            // Value changed
            setImpactStats({ ...impactStats, [newKey]: newValue });
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/discussions/categories");
            if (res.ok) {
                const data = await res.json();
                setCategoriesList(data.categories);
            }
        } catch (e) {
            console.error("Failed to load categories");
        }
    };

    useEffect(() => {
        if (isOpen) fetchCategories();
    }, [isOpen]);

    // Reset or Populate form
    useEffect(() => {
        if (isOpen) {
            if (editChannel) {
                setName(editChannel.name);
                setSlug(editChannel.slug);
                setDescription(editChannel.description || "");
                setDocsUrl(editChannel.docs_url || "");
                setVideoUrl(editChannel.video_playlist_url || "");
                setReadmeContent(editChannel.readme_content || "");
                setCategory(editChannel.category || "General");
                setVisibility((editChannel.visibility as "public" | "logged_in" | "party_only") || "public");
                if (editChannel.resources) {
                    setResources(editChannel.resources.map(r => ({
                        title: r.title,
                        type: r.type, // 'doc' | 'video' | 'link' | 'impact' | 'other'
                        url: r.url
                    })));
                } else {
                    setResources([]);
                }
                setImpactStats(
                    editChannel.impact_stats
                        ? Object.fromEntries(
                            Object.entries(editChannel.impact_stats).map(([k, v]) => [k, String(v)])
                        )
                        : {}
                );
            } else {
                // Reset for Create
                setName("");
                setSlug("");
                setDescription("");
                setDocsUrl("");
                setVideoUrl("");
                setReadmeContent("");
                setCategory("General");
                setVisibility("public");
                setResources([]);
                setImpactStats({});
            }
            setError(null);
            setActiveTab('details');
        }
    }, [isOpen, editChannel]);

    // Helper to auto-slugify
    const handleAutoSlug = (text: string) => {
        setName(text);
        if (!editChannel) {
            setSlug(
                text.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
            );
        }
    };

    // Resource Handlers
    const handleAddResource = () => {
        setResources([...resources, { title: "", type: "link", url: "" }]);
    };

    const handleRemoveResource = (index: number) => {
        const newRes = [...resources];
        newRes.splice(index, 1);
        setResources(newRes);
    };

    const handleResourceChange = (index: number, field: keyof typeof resources[0], value: string) => {
        const newRes = [...resources];
        newRes[index] = { ...newRes[index], [field]: value };
        setResources(newRes);
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const method = editChannel ? "PUT" : "POST";
            const url = "/api/discussions/channels";

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const body: any = {
                name,
                slug,
                description,
                visibility,
                category,
                readme_content: readmeContent || null,
                impact_stats: impactStats, // Add Impact Stats
                resources
            };

            if (editChannel) {
                body.id = editChannel.id;
            } else {
                // Default settings for new channels if not explicitly in form
                body.allow_anonymous_posts = false;
                body.min_role_to_post = 'member';
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save channel");
            }

            onSuccess();
            onClose();
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert("Error: " + err.message);
            } else {
                alert("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                    <Typography variant="h3" className="text-lg font-bold text-slate-800">
                        {editChannel ? t('च्यानल सम्पादन', 'Edit Channel') : t('नयाँ च्यानल सिर्जना', 'Create New Channel')}
                    </Typography>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </Button>
                </div>

                <div className="flex border-b border-slate-200 px-6 bg-slate-50/50">
                    <button
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setActiveTab('details')}
                    >
                        {t('विवरण', 'Details')}
                    </button>
                    <button
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'resources' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setActiveTab('resources')}
                    >
                        {t('स्रोत र सामग्री', 'Resources & Content')}
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
                    {activeTab === 'details' ? (
                        <form id="channel-form" onSubmit={handleSubmit} className="space-y-5">
                            {/* Existing Fields */}
                            <CategoryManagerModal
                                isOpen={isCategoryModalOpen}
                                onClose={() => setIsCategoryModalOpen(false)}
                                onUpdate={fetchCategories} // Use fetchCategories to refresh list
                                currentCategories={categoriesList.map(c => c.name)}
                            />

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('च्यानल नाम', 'Channel Name')}</label>
                                    <Input
                                        required
                                        value={name}
                                        onChange={e => handleAutoSlug(e.target.value)}
                                        placeholder={t('जस्तै स्वास्थ्य नीति', 'e.g. Health Policy')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('स्लग (URL)', 'Slug (URL)')}</label>
                                    <Input
                                        required
                                        className="bg-slate-50 font-mono text-slate-600"
                                        value={slug}
                                        onChange={e => setSlug(e.target.value)}
                                        placeholder="health-policy"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('विवरण', 'Description')}</label>
                                <Textarea
                                    rows={3}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder={t('यो च्यानल केबारेमा हो?', 'What is this channel about?')}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('पहुँच प्रकार', 'Access Type')}</label>
                                    <NativeSelect
                                        value={visibility}
                                        onChange={e => setVisibility(e.target.value as "public" | "logged_in" | "party_only")}
                                    >
                                        <option value="public">{t('सार्वजनिक (सबै)', 'Public (Everyone)')}</option>
                                        <option value="logged_in">{t('लग-इन मात्र', 'Logged In Users')}</option>
                                        <option value="party_only">{t('पार्टी मात्र', 'Party Members Only')}</option>
                                        <option value="private">{t('निजी (आमन्त्रित मात्र)', 'Private (Invite Only)')}</option>
                                    </NativeSelect>
                                    {visibility === 'private' as unknown && editChannel && (
                                        <p className="text-xs text-amber-600 mt-1">
                                            {t('सेभ पछि सदस्य व्यवस्थापन गर्नुहोस्', 'After saving, manage members from channel page')}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between">
                                        {t('विधा', 'Category')}
                                        <button
                                            type="button"
                                            onClick={() => setIsCategoryModalOpen(true)}
                                            className="text-xs text-brand-blue hover:underline"
                                        >
                                            {t('व्यवस्थापन', 'Manage')}
                                        </button>
                                    </label>
                                    <NativeSelect
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                    >
                                        <option value="">{t('विधा छान्नुहोस्...', 'Select a Category...')}</option>
                                        {categoriesList.map(c => (
                                            <option key={c.name} value={c.name}>{c.name}</option>
                                        ))}
                                    </NativeSelect>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            {/* Readme Section */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('Readme सामग्री (Markdown)', 'Readme Content (Markdown)')}</label>
                                <Typography variant="muted" className="text-xs">{t('च्यानलको "About" ट्याबमा देखाइन्छ।', 'Displayed in the "About" tab of the channel.')}</Typography>
                                <Textarea
                                    className="font-mono text-sm"
                                    rows={6}
                                    value={readmeContent}
                                    onChange={e => setReadmeContent(e.target.value)}
                                    placeholder="# Welcome to this channel..."
                                />
                            </div>

                            {/* Legacy URLs */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('Legacy Docs URL', 'Legacy Docs URL')}</label>
                                    <Input
                                        type="url"
                                        value={docsUrl}
                                        onChange={e => setDocsUrl(e.target.value)}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('Legacy Video URL', 'Legacy Video URL')}</label>
                                    <Input
                                        type="url"
                                        value={videoUrl}
                                        onChange={e => setVideoUrl(e.target.value)}
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>
                            </div>

                            {/* New Resources List */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('थप स्रोतहरू', 'Additional Resources')}</label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAddResource}
                                        className="h-7 text-xs"
                                    >
                                        + {t('स्रोत थप्नुहोस्', 'Add Resource')}
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {resources.map((res, idx) => (
                                        <div key={idx} className="flex gap-2 items-start border p-3 rounded-lg bg-slate-50">
                                            <div className="grid grid-cols-3 gap-2 flex-grow">
                                                <Input
                                                    placeholder="Title"
                                                    value={res.title}
                                                    onChange={e => handleResourceChange(idx, 'title', e.target.value)}
                                                    className="col-span-1 h-8 text-sm"
                                                />
                                                <NativeSelect
                                                    value={res.type}
                                                    onChange={e => handleResourceChange(idx, 'type', e.target.value)}
                                                    className="col-span-1 h-8 text-sm"
                                                >
                                                    <option value="link">{t('लिङ्क', 'Link')}</option>
                                                    <option value="doc">{t('कागजात', 'Document')}</option>
                                                    <option value="video">{t('भिडियो', 'Video')}</option>
                                                    <option value="impact">{t('प्रभाव', 'Impact')}</option>
                                                </NativeSelect>
                                                <Input
                                                    type="url"
                                                    placeholder="URL"
                                                    value={res.url}
                                                    onChange={e => handleResourceChange(idx, 'url', e.target.value)}
                                                    className="col-span-1 h-8 text-sm"
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveResource(idx)}
                                                className="h-8 w-8 text-slate-400 hover:text-destructive"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    ))}
                                    {resources.length === 0 && (
                                        <p className="text-xs text-slate-400 italic text-center py-2">{t('कुनै थप स्रोतहरू थपिएको छैन।', 'No additional resources added.')}</p>
                                    )}
                                </div>
                            </div>

                            {/* Impact Stats Editor */}
                            <div className="space-y-3 pt-4 border-t border-slate-100">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('प्रभाव तथ्याङ्क', 'Impact Statistics')}</label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAddStat}
                                        className="h-7 text-xs"
                                    >
                                        + {t('तथ्याङ्क थप्नुहोस्', 'Add Stat')}
                                    </Button>
                                </div>
                                <Typography variant="muted" className="text-xs">{t('Key-Value जोडीहरू (जस्तै, "गाउँहरू पुगिएको": "15")', 'Key-Value pairs (e.g., "Villages Reached": "15")')}</Typography>

                                <div className="space-y-2">
                                    {Object.entries(impactStats).map(([key, value], idx) => (
                                        <div key={idx} className="flex gap-2 items-center border p-2 rounded-lg bg-emerald-50/50 border-emerald-100">
                                            <Input
                                                placeholder={t('लेबल (जस्तै विद्यार्थीहरू)', 'Label (e.g. Students)')}
                                                value={key}
                                                onChange={e => handleStatChange(key, e.target.value, value)}
                                                className="flex-1 bg-white h-8 text-sm"
                                            />
                                            <span className="text-slate-400">:</span>
                                            <Input
                                                placeholder={t('मान (जस्तै 500)', 'Value (e.g. 500)')}
                                                value={value}
                                                onChange={e => handleStatChange(key, key, e.target.value)}
                                                className="w-24 bg-white h-8 text-sm font-mono"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveStat(key)}
                                                className="h-8 w-8 text-slate-400 hover:text-destructive"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    ))}
                                    {Object.keys(impactStats).length === 0 && (
                                        <p className="text-xs text-slate-400 italic text-center py-2">{t('कुनै प्रभाव तथ्याङ्क रेकर्ड छैन।', 'No impact stats recorded.')}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                    >
                        {t('रद्द गर्नुहोस्', 'Cancel')}
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-brand-blue hover:bg-brand-blue/90 text-white"
                    >
                        {loading ? t('सुरक्षित गर्दै...', 'Saving...') : (editChannel ? t('च्यानल अपडेट', 'Update Channel') : t('च्यानल सिर्जना', 'Create Channel'))}
                    </Button>
                </div>
            </div>
        </div>
    );
}
