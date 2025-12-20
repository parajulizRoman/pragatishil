"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import NepaliDate from "nepali-date-converter";
import { createClient } from "@/lib/supabase/client";
import { upsertNewsItem, deleteNewsItem } from "@/actions/cms";
import { Plus, Edit, Trash2, X, Globe, Calendar, FileText, ExternalLink, Link as LinkIcon, AlertTriangle } from "lucide-react";
import { NewsItem, NewsStatus, NewsType, NewsAttachment, NewsReference } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const convertADtoBS = (adDate: string): string => {
    try {
        const [y, m, d] = adDate.split('-').map(Number);
        const bsDate = new NepaliDate(new Date(y, m - 1, d));
        const bsY = bsDate.getYear();
        const bsM = String(bsDate.getMonth() + 1).padStart(2, '0');
        const bsD = String(bsDate.getDate()).padStart(2, '0');
        return `${bsY}-${bsM}-${bsD}`;
    } catch { return ''; }
};

const convertBStoAD = (bsDate: string): string => {
    try {
        const [y, m, d] = bsDate.split('-').map(Number);
        const adObj = new NepaliDate(y, m - 1, d).toJsDate();
        return adObj.toISOString().split('T')[0];
    } catch { return ''; }
};

export default function NewsManager() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<NewsItem> | null>(null);
    const [filterStatus, setFilterStatus] = useState<NewsStatus | 'all'>('all');
    const [deleteReason, setDeleteReason] = useState("");

    // Local state for textareas mapped to JSON arrays
    const [referencesText, setReferencesText] = useState("");
    const [attachmentsText, setAttachmentsText] = useState("");

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('news_items')
            .select('*')
            .order('date', { ascending: false });

        if (error) {
            console.error("Fetch Error:", error);
        }

        if (data) setNews(data as NewsItem[]);
        setLoading(false);
    };

    const handleEdit = (item: NewsItem) => {
        // Map JSON arrays to textarea strings for editing
        const refsStr = (item.references || [])
            .map(r => (typeof r === 'string' ? r : r.url))
            .join('\n');

        const attsStr = (item.attachments || [])
            .map(a => (typeof a === 'string' ? a : a.url))
            .join('\n');

        setReferencesText(refsStr);
        setAttachmentsText(attsStr);

        setCurrentItem({
            ...item,
            // Ensure arrays are initialized even if null from DB
            attachments: item.attachments || [],
            references: item.references || []
        });
        setIsEditing(true);
    };

    const handleAddNew = () => {
        const today = new Date().toISOString().split('T')[0];

        setReferencesText("");
        setAttachmentsText("");

        setCurrentItem({
            title: '',
            title_ne: '',
            summary_en: '',
            summary_ne: '',
            body_en: '',
            body_ne: '',
            source: '',
            date: today,
            date_bs: convertADtoBS(today),
            type: 'Article',
            link: '',
            image_url: '',
            status: 'draft',
            author_name: '',
            attachments: [],
            references: [],
            content_type: 'official',  // Default to official
            visibility: 'public',
        });
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        if (!deleteReason && !confirm("Are you sure you want to delete this news item? Please provide a reason in the audit log.")) {
            const reason = prompt("Reason for deletion (for audit log):");
            if (!reason) return;
            await deleteNewsItem(id, reason);
        } else {
            await deleteNewsItem(id, deleteReason || "Admin manual deletion");
        }
        fetchNews();
        setDeleteReason("");
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Map textarea strings back to typed JSON arrays
            const referencesArray: NewsReference[] = referencesText
                .split('\n')
                .map(s => s.trim())
                .filter(Boolean)
                .map(url => ({ url }));

            const attachmentsArray: NewsAttachment[] = attachmentsText
                .split('\n')
                .map(s => s.trim())
                .filter(Boolean)
                .map(url => ({ url }));

            const payload = {
                ...currentItem,
                references: referencesArray,
                attachments: attachmentsArray
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await upsertNewsItem(payload as any);
            setIsEditing(false);
            fetchNews();
        } catch (error) {
            alert("Failed to save: " + (error as Error).message);
        }
    };

    // Handler for AD Date Change
    const handleAdDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const adDate = e.target.value;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updates: any = { date: adDate };
        if (adDate) {
            const bsDate = convertADtoBS(adDate);
            if (bsDate) updates.date_bs = bsDate;
        }
        setCurrentItem({ ...currentItem, ...updates });
    };

    // Handler for BS Date Change
    const handleBsDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const bsDate = e.target.value;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updates: any = { date_bs: bsDate };

        // Only attempt convert if valid format YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(bsDate)) {
            const adDate = convertBStoAD(bsDate);
            if (adDate) updates.date = adDate;
        }
        setCurrentItem({ ...currentItem, ...updates });
    };

    const filteredNews = filterStatus === 'all' ? news : news.filter(n => n.status === filterStatus);

    if (loading) return <div className="p-8"><Skeleton className="h-10 w-48 mb-6" /><div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}</div></div>;

    return (
        <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-brand-navy">News Room</h1>
                    <p className="text-slate-500 mt-1">Manage articles, videos, and interviews for the public feed.</p>
                </div>
                <Button onClick={handleAddNew} className="bg-brand-blue hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" /> Add News Item
                </Button>
            </div>

            {/* Filters */}
            <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl w-fit">
                {(['all', 'draft', 'published', 'archived'] as const).map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filterStatus === status
                            ? 'bg-white text-brand-blue shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="grid gap-4">
                {filteredNews.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                        <FileText className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                        <h3 className="text-lg font-medium text-slate-900">No news found</h3>
                        <p className="text-slate-500">Get started by creating a new article.</p>
                    </div>
                ) : (
                    filteredNews.map((item) => (
                        <Card key={item.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-0 flex flex-col md:flex-row gap-6">
                                <Link
                                    href={`/news/${item.slug || item.id}`}
                                    className="relative w-full md:w-48 h-48 md:h-auto shrink-0 bg-slate-100 overflow-hidden block group"
                                >
                                    {item.image_url ? (
                                        <Image
                                            src={item.image_url}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 200px"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-400 bg-slate-50">
                                            <div className="text-center">
                                                <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                                <span className="text-xs">No Image</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2 z-10">
                                        <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                                            {item.status}
                                        </Badge>
                                    </div>
                                    {item.type === 'Video' && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                                            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                                                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-brand-red border-b-[6px] border-b-transparent ml-1"></div>
                                            </div>
                                        </div>
                                    )}
                                </Link>
                                <div className="p-6 flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center space-x-2 text-sm text-slate-500 mb-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>{item.date}</span>
                                                {item.date_bs && <span className="text-xs px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">BS {item.date_bs}</span>}
                                                <span>•</span>
                                                <span className="font-medium text-brand-blue">{item.source || 'Pragatishil'}</span>
                                                <span>•</span>
                                                <span>{item.type}</span>
                                            </div>
                                            <Link href={`/news/${item.slug || item.id}`} className="hover:underline decoration-brand-blue decoration-2 underline-offset-2">
                                                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">{item.title}</h3>
                                            </Link>
                                            <p className="text-slate-600 line-clamp-2 md:line-clamp-3 mb-2">{item.summary_en || item.summary_ne || 'No summary available.'}</p>

                                            {item.thread_id && (
                                                <div className="inline-flex items-center text-xs text-brand-blue bg-blue-50 px-2 py-1 rounded-full">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mr-1.5 animate-pulse"></span>
                                                    Comments Enabled
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex space-x-2 shrink-0">
                                            {item.link && (
                                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-md transition-colors" title={`Original: ${item.link}`}>
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            )}
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(item.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Edit Modal */}
            {
                isEditing && currentItem && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10 shadow-sm">
                                <div>
                                    <h2 className="text-xl font-bold">{currentItem.id ? 'Edit News Item' : 'New News Item'}</h2>
                                    <p className="text-xs text-slate-400">Please upload files via &quot;Media Gallery&quot; first, then paste the public URLs here. One URL per line.</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 space-y-8">

                                {/* Content Type Selector */}
                                <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-xl border border-slate-200">
                                    <Label className="text-sm font-semibold text-slate-700 mb-3 block">Content Type</Label>
                                    <div className="flex gap-4">
                                        <label className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${currentItem.content_type === 'official'
                                                ? 'bg-blue-50 border-brand-blue text-brand-blue'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}>
                                            <input
                                                type="radio"
                                                name="content_type"
                                                value="official"
                                                checked={currentItem.content_type === 'official'}
                                                onChange={() => setCurrentItem(prev => ({ ...prev!, content_type: 'official', visibility: 'public' }))}
                                                className="sr-only"
                                            />
                                            <span className="font-medium">Official Statement</span>
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Party</span>
                                        </label>
                                        <label className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${currentItem.content_type === 'article'
                                                ? 'bg-green-50 border-green-600 text-green-700'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}>
                                            <input
                                                type="radio"
                                                name="content_type"
                                                value="article"
                                                checked={currentItem.content_type === 'article'}
                                                onChange={() => setCurrentItem(prev => ({ ...prev!, content_type: 'article', visibility: 'party' }))}
                                                className="sr-only"
                                            />
                                            <span className="font-medium">Personal Article</span>
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Author</span>
                                        </label>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        {currentItem.content_type === 'official'
                                            ? 'Official statements are published on behalf of the party. Only admins can create these.'
                                            : 'Personal articles are authored by you and linked to your profile.'}
                                    </p>
                                </div>

                                {/* Visibility Selector (only for articles) */}
                                {currentItem.content_type === 'article' && (
                                    <div className="space-y-2">
                                        <Label>Visibility</Label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            value={currentItem.visibility || 'party'}
                                            onChange={e => setCurrentItem(prev => ({ ...prev!, visibility: e.target.value as 'public' | 'party' | 'team' }))}
                                        >
                                            <option value="public">🌍 Public - Visible to everyone</option>
                                            <option value="party">🏛️ Party Only - Only party members can see</option>
                                            <option value="team">👥 Team Only - Only team members and above</option>
                                        </select>
                                    </div>
                                )}

                                {/* Official news visibility badge */}
                                {currentItem.content_type === 'official' && (
                                    <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                                        <span className="font-medium">Visibility:</span>
                                        <span className="bg-blue-100 px-2 py-0.5 rounded">Public</span>
                                        <span className="text-blue-500 text-xs">(Official statements are always public)</span>
                                    </div>
                                )}

                                {/* Metadata Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Source / Publisher</Label>
                                        <Input
                                            value={currentItem.source}
                                            onChange={e => setCurrentItem(prev => ({ ...prev!, source: e.target.value }))}
                                            placeholder="e.g. Kantipur, Spokesperson, Press Release"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date (AD)</Label>
                                        <Input
                                            type="date"
                                            value={currentItem.date}
                                            onChange={handleAdDateChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date (BS)</Label>
                                        <Input
                                            value={currentItem.date_bs || ''}
                                            onChange={handleBsDateChange}
                                            placeholder="2081-05-15"
                                        />
                                        <p className="text-[10px] text-slate-400">
                                            YYYY-MM-DD format. Auto-updates when AD changes.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Type</Label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={currentItem.type}
                                            onChange={e => setCurrentItem(prev => ({ ...prev!, type: e.target.value as NewsType }))}
                                        >
                                            <option value="Article">Article</option>
                                            <option value="Video">Video</option>
                                            <option value="Interview">Interview</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={currentItem.status}
                                            onChange={e => setCurrentItem(prev => ({ ...prev!, status: e.target.value as NewsStatus }))}
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>External Link (Original)</Label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                            <Input
                                                value={currentItem.link || ''}
                                                onChange={e => setCurrentItem(prev => ({ ...prev!, link: e.target.value }))}
                                                placeholder="https://..."
                                                className="pl-9"
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-400">Used for &quot;Read Original&quot; button.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Featured Image URL</Label>
                                        <Input
                                            value={currentItem.image_url || ''}
                                            onChange={e => setCurrentItem(prev => ({ ...prev!, image_url: e.target.value }))}
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Author Name</Label>
                                        <Input
                                            value={currentItem.author_name || ''}
                                            onChange={e => setCurrentItem(prev => ({ ...prev!, author_name: e.target.value }))}
                                            placeholder="e.g. Roman Parajuli"
                                        />
                                    </div>
                                </div>

                                <hr className="border-gray-100" />

                                {/* English Content */}
                                <div className="space-y-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <h3 className="font-semibold text-lg flex items-center"><Globe className="w-4 h-4 mr-2" /> English Content</h3>
                                    <div className="space-y-2">
                                        <Label>Title (EN)</Label>
                                        <Input
                                            value={currentItem.title || ''}
                                            onChange={e => setCurrentItem(prev => ({ ...prev!, title: e.target.value }))}
                                            placeholder="Article Headline"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Short Summary (EN)</Label>
                                        <Textarea
                                            value={currentItem.summary_en || ''}
                                            onChange={e => setCurrentItem(prev => ({ ...prev!, summary_en: e.target.value }))}
                                            placeholder="Brief summary for the card view..."
                                            rows={2}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Full Article Body (EN)</Label>
                                        <Textarea
                                            value={currentItem.body_en || ''}
                                            onChange={e => setCurrentItem(prev => ({ ...prev!, body_en: e.target.value }))}
                                            placeholder="Paste or write the full article text in English here..."
                                            rows={8}
                                            className="min-h-[160px]"
                                        />
                                    </div>
                                </div>

                                <hr className="border-gray-100" />

                                {/* Nepali Content */}
                                <div className="space-y-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <h3 className="font-semibold text-lg flex items-center"><Globe className="w-4 h-4 mr-2 text-red-600" /> Nepali Content</h3>
                                    <div className="space-y-2">
                                        <Label>Title (NE)</Label>
                                        <Input
                                            value={currentItem.title_ne || ''}
                                            onChange={e => setCurrentItem(prev => ({ ...prev!, title_ne: e.target.value }))}
                                            placeholder="लेखको शीर्षक"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Short Summary (NE)</Label>
                                        <Textarea
                                            value={currentItem.summary_ne || ''}
                                            onChange={e => setCurrentItem(prev => ({ ...prev!, summary_ne: e.target.value }))}
                                            placeholder="छोटो विवरण..."
                                            rows={2}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Full Article Body (NE)</Label>
                                        <Textarea
                                            value={currentItem.body_ne || ''}
                                            onChange={e => setCurrentItem(prev => ({ ...prev!, body_ne: e.target.value }))}
                                            placeholder="ठुलो समाचार सामग्री नेपालीमा यहाँ लेख्नुहोस्…"
                                            rows={8}
                                            className="min-h-[160px]"
                                        />
                                    </div>
                                </div>

                                <hr className="border-gray-100" />

                                {/* Attachments Section (Simplifed for v2 prompt) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2 text-brand-navy">
                                            <Globe size={18} className="text-slate-400" />
                                            <h3 className="font-bold text-sm uppercase tracking-wide">References</h3>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-normal text-slate-500">One URL per line</Label>
                                            <Textarea
                                                className="font-mono text-xs bg-slate-50 min-h-[150px]"
                                                value={referencesText}
                                                onChange={e => setReferencesText(e.target.value)}
                                                placeholder={`https://kathmandupost.com/example/article\nhttps://onlinekhabar.com/...`}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2 text-brand-navy">
                                            <FileText size={18} className="text-slate-400" />
                                            <h3 className="font-bold text-sm uppercase tracking-wide">Attachments</h3>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-normal text-slate-500">One PDF/File URL per line</Label>
                                            <Textarea
                                                className="font-mono text-xs bg-slate-50 min-h-[150px]"
                                                value={attachmentsText}
                                                onChange={e => setAttachmentsText(e.target.value)}
                                                placeholder={`https://.../rules.pdf\nhttps://.../manifesto.pdf`}
                                            />
                                            <div className="flex items-start gap-2 text-amber-600 bg-amber-50 p-2 rounded text-xs">
                                                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                                                <p>Use the &quot;Media Gallery&quot; to upload files first if you need to host them yourself, then paste the URL here.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white border-t border-gray-100 p-4 -mx-6 -mb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                    <Button type="submit">Save News Item</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
