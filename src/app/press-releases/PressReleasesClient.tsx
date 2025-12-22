"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { FileText, Download, ExternalLink, Search, Calendar, Eye, Plus, Edit2, Trash2 } from "lucide-react";
import { MediaItem } from "@/types";
import { createBrowserClient } from "@supabase/ssr";
import { canManagePressReleases } from "@/lib/permissions";
import PressReleaseForm from "./PressReleaseForm";
import { Button } from "@/components/ui/button";

interface PressReleasesClientProps {
    documents: MediaItem[];
}

export default function PressReleasesClient({ documents: initialDocuments }: PressReleasesClientProps) {
    const { t } = useLanguage();
    const [search, setSearch] = useState("");
    const [selectedDoc, setSelectedDoc] = useState<MediaItem | null>(null);
    const [documents, setDocuments] = useState(initialDocuments);

    // Auth & permissions
    const [userRole, setUserRole] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingDoc, setEditingDoc] = useState<MediaItem | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                if (profile) setUserRole(profile.role);
            }
        };
        fetchUser();
    }, []);

    const canCreate = canManagePressReleases(userRole);

    // Refresh documents after create/edit
    const refreshDocuments = async () => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data } = await supabase
            .from('media_gallery')
            .select('*')
            .eq('media_type', 'document')
            .order('created_at', { ascending: false });
        if (data) setDocuments(data);
    };

    // Delete document
    const handleDelete = async (doc: MediaItem) => {
        if (!confirm(t(`"${doc.title}" मेटाउने हो?`, `Delete "${doc.title}"?`))) return;

        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { error } = await supabase
                .from('media_gallery')
                .delete()
                .eq('id', doc.id);
            if (error) throw error;
            refreshDocuments();
        } catch {
            alert(t("मेटाउन असफल", "Failed to delete"));
        }
    };

    const filteredDocs = documents.filter(doc =>
        doc.title?.toLowerCase().includes(search.toLowerCase()) ||
        doc.caption?.toLowerCase().includes(search.toLowerCase()) ||
        doc.caption_ne?.includes(search)
    );

    const isPdf = (url: string) => url.toLowerCase().endsWith('.pdf');

    // Use a simple date format to avoid hydration mismatch
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-brand-navy to-brand-blue py-16 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
                        {t("प्रेस विज्ञप्ति", "Press Releases")}
                    </h1>
                    <p className="text-white/80 max-w-2xl mx-auto mb-6">
                        {t(
                            "प्रगतिशील लोकतान्त्रिक पार्टीका आधिकारिक विज्ञप्ति, वक्तव्य र कागजातहरू",
                            "Official press releases, statements and documents from Pragatishil Loktantrik Party"
                        )}
                    </p>

                    {/* Create Button - Only for authorized users */}
                    {canCreate && (
                        <Button
                            onClick={() => {
                                setEditingDoc(null);
                                setShowForm(true);
                            }}
                            className="bg-white text-brand-blue hover:bg-white/90 font-bold gap-2"
                        >
                            <Plus size={18} />
                            {t("नयाँ प्रेस विज्ञप्ति", "New Press Release")}
                        </Button>
                    )}
                </div>
            </section>

            {/* Search & Content */}
            <section className="max-w-6xl mx-auto px-4 py-12">
                {/* Search Bar */}
                <div className="relative mb-8 max-w-md mx-auto">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("खोज्नुहोस्...", "Search documents...")}
                        className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all"
                    />
                </div>

                {/* Count */}
                <p className="text-sm text-slate-500 mb-6 text-center">
                    {filteredDocs.length} {t("कागजातहरू", "documents")}
                </p>

                {/* Documents Grid */}
                {filteredDocs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDocs.map((doc) => (
                            <article
                                key={doc.id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-slate-100 overflow-hidden group relative"
                            >
                                {/* Edit/Delete buttons for authorized users */}
                                {canCreate && (
                                    <div className="absolute top-3 left-3 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                setEditingDoc(doc);
                                                setShowForm(true);
                                            }}
                                            className="p-2 bg-white/90 rounded-full shadow hover:bg-brand-blue hover:text-white transition-colors"
                                            title={t("सम्पादन", "Edit")}
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(doc)}
                                            className="p-2 bg-white/90 rounded-full shadow hover:bg-red-500 hover:text-white transition-colors"
                                            title={t("मेटाउनुहोस्", "Delete")}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}

                                {/* Thumbnail */}
                                <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                                    {isPdf(doc.url) ? (
                                        <FileText size={64} className="text-brand-red/60" />
                                    ) : (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={doc.url}
                                                alt={doc.alt_text || doc.title || "Document"}
                                                fill
                                                className="object-cover"
                                                sizes="400px"
                                            />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <span className="px-2 py-1 bg-brand-red text-white text-[10px] font-bold rounded-full uppercase">
                                            {isPdf(doc.url) ? "PDF" : "Image"}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <h2 className="font-bold text-brand-navy mb-2 line-clamp-2 group-hover:text-brand-blue transition-colors">
                                        {t(doc.caption_ne || doc.title || '', doc.title || doc.caption || '') || "Untitled Document"}
                                    </h2>
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                                        {t(doc.caption_ne || '', doc.caption || '') || doc.alt_text}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {formatDate(doc.created_at)}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="px-5 pb-5 flex gap-2">
                                    <button
                                        onClick={() => setSelectedDoc(doc)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-blue text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors"
                                    >
                                        <Eye size={16} /> {t("हेर्नुहोस्", "View")}
                                    </button>
                                    <a
                                        href={doc.url}
                                        download
                                        className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                                        title="Download"
                                    >
                                        <Download size={16} />
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-400">
                        <FileText size={64} className="mx-auto mb-4 opacity-50" />
                        <p className="font-medium">{t("कुनै कागजात फेला परेन", "No documents found")}</p>
                    </div>
                )}
            </section>

            {/* Document Viewer Modal */}
            {selectedDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-brand-navy">
                                    {t(selectedDoc.caption_ne || '', selectedDoc.title || '') || "Document"}
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    {new Date(selectedDoc.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={selectedDoc.url}
                                    download
                                    className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white text-sm font-bold rounded-xl hover:bg-blue-700"
                                >
                                    <Download size={16} /> {t("डाउनलोड", "Download")}
                                </a>
                                <a
                                    href={selectedDoc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200"
                                    title="Open in new tab"
                                >
                                    <ExternalLink size={18} />
                                </a>
                                <button
                                    onClick={() => setSelectedDoc(null)}
                                    className="p-2 bg-slate-100 rounded-xl hover:bg-red-100 hover:text-red-500 text-xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        {/* Document Viewer */}
                        <div className="flex-1 overflow-auto bg-slate-100">
                            {isPdf(selectedDoc.url) ? (
                                <iframe
                                    src={`${selectedDoc.url}#toolbar=0`}
                                    className="w-full h-full min-h-[70vh]"
                                    title={selectedDoc.title || "Document"}
                                />
                            ) : (
                                <div className="relative w-full h-full min-h-[70vh]">
                                    <Image
                                        src={selectedDoc.url}
                                        alt={selectedDoc.alt_text || "Document"}
                                        fill
                                        className="object-contain"
                                        sizes="100vw"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Create/Edit Form Modal */}
            {showForm && (
                <PressReleaseForm
                    onClose={() => {
                        setShowForm(false);
                        setEditingDoc(null);
                    }}
                    onSuccess={refreshDocuments}
                    editItem={editingDoc}
                />
            )}
        </main>
    );
}
