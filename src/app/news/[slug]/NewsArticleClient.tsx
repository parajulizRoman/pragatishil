"use client";

import { useLanguage } from "@/context/LanguageContext";
import { createT, Lang } from "@/lib/translations";
import { NewsItem, NewsAttachment, NewsReference } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, ExternalLink, FileText, Download, Languages } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ThreadEmbed from "@/components/discussion/ThreadEmbed";

interface NewsArticleClientProps {
    item: NewsItem;
}

export default function NewsArticleClient({ item }: NewsArticleClientProps) {
    const { language, toggleLanguage } = useLanguage();
    const lang = language as Lang;
    const T = createT(lang);

    // Compute language-aware content with fallbacks
    const title = (lang === "ne" && item.title_ne?.trim()) ? item.title_ne : item.title;
    const body = (lang === "ne" && item.body_ne?.trim()) ? item.body_ne : (item.body_en ?? "");

    // Parse attachments and references
    const attachments = (Array.isArray(item.attachments) ? item.attachments : []) as NewsAttachment[];
    const references = (Array.isArray(item.references) ? item.references : []) as NewsReference[];

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Header / Hero */}
            <div className="bg-white border-b border-slate-100 pb-8 pt-24 md:pt-32 px-4 shadow-sm">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="flex justify-between items-center">
                        <Link href="/news" className="inline-flex items-center text-slate-500 hover:text-brand-blue transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" /> {T("news.backToNews")}
                        </Link>

                        {/* Language Toggle Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleLanguage}
                            className="gap-2 text-sm"
                        >
                            <Languages className="w-4 h-4" />
                            {lang === "en" ? "नेपालीमा हेर्नुहोस्" : "View in English"}
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                        {/* Content Type Badge */}
                        {item.content_type === 'official' ? (
                            <Badge variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700">
                                Official Statement
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100">
                                Personal Article
                            </Badge>
                        )}

                        <Badge variant="secondary" className="bg-blue-50 text-brand-blue hover:bg-blue-100">
                            {item.type}
                        </Badge>
                        <span className="text-slate-400 text-sm flex items-center gap-1">
                            <Calendar className="w-4 h-4" /> {item.date}
                            {item.date_bs && <span className="text-slate-500 ml-1">({item.date_bs})</span>}
                        </span>
                        {item.source && (
                            <span className="text-slate-500 text-sm border-l border-slate-200 pl-3 ml-1">
                                {T("news.source")}: <span className="font-semibold text-slate-700">{item.source}</span>
                            </span>
                        )}

                        {/* Author Link (for articles) */}
                        {item.content_type === 'article' && item.author_id && (
                            <Link
                                href={`/members/${item.author_id}`}
                                className="text-slate-500 text-sm border-l border-slate-200 pl-3 ml-1 hover:text-brand-blue transition-colors"
                            >
                                By: <span className="font-semibold text-slate-700 hover:text-brand-blue underline decoration-dotted underline-offset-2">
                                    {item.author_name || 'Member'}
                                </span>
                            </Link>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                        {title}
                    </h1>

                    {/* Featured Image */}
                    {item.image_url && (
                        <div className="relative w-full aspect-video md:aspect-[2.4/1] bg-slate-100 rounded-2xl overflow-hidden shadow-lg mt-8">
                            <Image
                                src={item.image_url}
                                alt={title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-[1fr_300px] gap-12">
                <div className="space-y-12">
                    {/* Article Body - Only showing selected language */}
                    {body ? (
                        <article className={`prose prose-slate lg:prose-lg max-w-none ${lang === "ne" ? "font-nepali leading-loose" : ""}`}>
                            <div className="whitespace-pre-wrap">{body}</div>
                        </article>
                    ) : (
                        <p className="text-slate-500 italic">
                            {lang === "ne"
                                ? "यस लेखको नेपाली संस्करण उपलब्ध छैन।"
                                : "No content available for this article."}
                        </p>
                    )}

                    {/* Original Source Button */}
                    {item.link && (
                        <div className="flex justify-center py-6">
                            <Button variant="outline" size="lg" asChild className="gap-2 rounded-full h-12 px-8">
                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                    {T("news.readOriginal")} {item.source && `(${item.source})`} <ExternalLink className="w-4 h-4" />
                                </a>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Attachments Widget */}
                    {(attachments.length > 0 || references.length > 0) && (
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm sticky top-24">
                            {attachments.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-brand-blue" /> {T("news.attachments")}
                                    </h3>
                                    <div className="space-y-3">
                                        {attachments.map((att: NewsAttachment, idx: number) => {
                                            const url = typeof att === 'string' ? att : att.url;
                                            const name = typeof att === 'string' ? `${T("news.attachments")} ${idx + 1}` : (att.name || 'Document');
                                            return (
                                                <a
                                                    key={idx}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-brand-blue transition-colors group"
                                                >
                                                    <div className="bg-white p-2 rounded shadow-sm group-hover:shadow text-brand-red">
                                                        <Download size={16} />
                                                    </div>
                                                    <div className="text-sm font-medium truncate">{name}</div>
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* References Widget */}
                            {references.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <ExternalLink className="w-5 h-5 text-slate-400" /> {T("news.references")}
                                    </h3>
                                    <ul className="space-y-2">
                                        {references.map((ref: NewsReference, idx: number) => {
                                            const url = typeof ref === 'string' ? ref : ref.url;
                                            let label = url;
                                            try {
                                                label = (typeof ref !== 'string' && ref.label) ? ref.label : new URL(url).hostname;
                                            } catch {
                                                // Invalid URL, use as-is
                                            }
                                            return (
                                                <li key={idx}>
                                                    <a
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-slate-500 hover:text-brand-blue hover:underline break-all"
                                                    >
                                                        {label}
                                                    </a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Discussion Section */}
            {item.thread_id && (
                <div className="bg-white border-t border-slate-200 py-16">
                    <div className="max-w-4xl mx-auto px-4">
                        <ThreadEmbed threadId={item.thread_id} />
                    </div>
                </div>
            )}
        </div>
    );
}
