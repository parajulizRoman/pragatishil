/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DiscussionChannel, UserRole } from "@/types";
import ChannelModal from "./ChannelModal";
import { createBrowserClient } from "@supabase/ssr";
import { canManageChannels, canManageUsers } from "@/lib/permissions";
import { useLanguage } from "@/context/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Edit2 } from "lucide-react";

function ChannelCardSkeleton() {
    return (
        <Card className="h-full animate-pulse border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
            </CardContent>
        </Card>
    );
}

export default function CommunityPage() {
    const { t, language } = useLanguage();
    const [channels, setChannels] = useState<DiscussionChannel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editingChannel, setEditingChannel] = useState<DiscussionChannel | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userRole, setUserRole] = useState<UserRole | null>(null);

    useEffect(() => {
        const init = async () => {
            // 1. Fetch User Role
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

            // 2. Fetch Channels
            fetchChannels();
        };

        init();
    }, []);

    const fetchChannels = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/discussions/channels");
            if (!res.ok) throw new Error("Failed to load channels");
            const data = await res.json();
            setChannels(data.channels);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingChannel(null);
        setIsModalOpen(true);
    };

    const handleEdit = (e: React.MouseEvent, channel: DiscussionChannel) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();
        setEditingChannel(channel);
        setIsModalOpen(true);
    };

    const handleSuccess = () => {
        fetchChannels();
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-6xl">
                <div className="mb-12 text-center">
                    <Skeleton className="h-10 w-64 mx-auto mb-4" />
                    <Skeleton className="h-5 w-48 mx-auto" />
                </div>
                <div className="space-y-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <ChannelCardSkeleton key={i} />)}
                    </div>
                </div>
            </div>
        );
    }
    if (error) return <div className="p-10 text-center text-destructive font-medium">{t("त्रुटि", "Error")}: {error}</div>;

    // Use Capability Helpers
    const canEditChannels = canManageChannels(userRole);

    // Grouping Logic
    const grouped = {
        public: channels.filter(c => c.visibility === 'public'),
        members: channels.filter(c => ['members', 'logged_in', 'party_only'].includes(c.visibility)),
        leadership: channels.filter(c => ['central_committee', 'board_only', 'leadership', 'internal'].includes(c.visibility)),
    };

    // Visibility labels
    const getVisibilityLabel = (visibility: string) => {
        const labels: Record<string, { en: string; ne: string }> = {
            'public': { en: 'Public', ne: 'सार्वजनिक' },
            'members': { en: 'Members', ne: 'सदस्य' },
            'logged_in': { en: 'Logged In', ne: 'लग-इन' },
            'party_only': { en: 'Party Only', ne: 'पार्टी मात्र' },
            'central_committee': { en: 'Central Committee', ne: 'केन्द्रीय समिति' },
            'board_only': { en: 'Board Only', ne: 'बोर्ड मात्र' },
            'leadership': { en: 'Leadership', ne: 'नेतृत्व' },
            'internal': { en: 'Internal', ne: 'आन्तरिक' },
        };
        const label = labels[visibility] || { en: visibility, ne: visibility };
        return t(label.ne, label.en);
    };

    const renderChannelCard = (channel: DiscussionChannel) => {
        let badgeVariant: "default" | "secondary" | "destructive" | "outline" | "party" | "leadership" = "outline";
        if (channel.visibility === 'public') badgeVariant = "secondary";
        else if (['members', 'logged_in', 'party_only'].includes(channel.visibility)) badgeVariant = "party";
        else badgeVariant = "leadership";

        return (
            <Link key={channel.id} href={`/commune/${channel.slug || channel.id}`} className="block group h-full">
                <Card className="h-full hover:shadow-md hover:border-brand-blue/30 transition-all duration-300 relative group-hover:-translate-y-1">
                    {canEditChannels && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleEdit(e, channel)}
                            className="absolute top-2 right-2 h-8 w-8 text-slate-400 hover:text-brand-blue z-10"
                            title={t("च्यानल सम्पादन", "Edit Channel")}
                        >
                            <Edit2 size={14} />
                        </Button>
                    )}
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-1 pr-6">
                            <Typography variant="h4" className="text-xl group-hover:text-brand-blue transition-colors">
                                {language === 'ne' && channel.name_ne ? channel.name_ne : channel.name}
                            </Typography>
                        </div>
                        <div className="flex gap-2 items-center mb-2">
                            <Badge variant={badgeVariant} className="uppercase text-[10px] tracking-wider">
                                {getVisibilityLabel(channel.visibility)}
                            </Badge>
                            {channel.category && (
                                <span className="text-xs text-slate-400 font-medium">
                                    • {channel.category}
                                </span>
                            )}
                        </div>
                        {language === 'en' && channel.name_ne && (
                            <Typography variant="muted" className="text-sm font-nepali text-brand-blue/80 font-medium">
                                {channel.name_ne}
                            </Typography>
                        )}
                    </CardHeader>
                    <CardContent>
                        <Typography variant="p" className="text-sm text-slate-600 line-clamp-3 mt-0 leading-relaxed">
                            {language === 'ne' && channel.description_ne ? channel.description_ne : (channel.description_en || channel.description)}
                        </Typography>
                        {language === 'en' && channel.description_ne && (
                            <Typography variant="muted" className="text-xs italic font-nepali mt-2 opacity-80">
                                {channel.description_ne}
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Link>
        );
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-6xl min-h-[80vh]">
            <div className="mb-16 text-center">
                <Typography variant="h1" className="mb-3 text-brand-navy">{t("समुदाय छलफल", "Community Discussions")}</Typography>
                <Typography variant="lead">{t("छलफलमा सहभागी हुनुहोस्। तलको च्यानल छान्नुहोस्।", "Join the conversation. Select a channel below.")}</Typography>
            </div>

            {channels.length === 0 ? (
                <Card className="max-w-md mx-auto p-8 text-center bg-slate-50/50">
                    <CardContent>
                        <Typography variant="p">{t("तपाईंको लागि अहिले कुनै छलफल च्यानलहरू उपलब्ध छैनन्।", "No discussion channels available to you yet.")}</Typography>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-16">
                    {/* Public Section */}
                    {grouped.public.length > 0 && (
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px bg-slate-200 flex-grow"></div>
                                <Typography variant="h2" className="text-2xl text-brand-blue border-none !pb-0">{t("खुला सार्वजनिक मञ्च", "Open Public Forum")}</Typography>
                                <div className="h-px bg-slate-200 flex-grow"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {grouped.public.map(renderChannelCard)}
                            </div>
                        </section>
                    )}

                    {/* Members Section */}
                    {grouped.members.length > 0 && (
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px bg-slate-200 flex-grow"></div>
                                <Typography variant="h2" className="text-2xl text-brand-red border-none !pb-0">{t("सदस्य क्षेत्र", "Members Area")}</Typography>
                                <div className="h-px bg-slate-200 flex-grow"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {grouped.members.map(renderChannelCard)}
                            </div>
                        </section>
                    )}

                    {/* Leadership Section */}
                    {grouped.leadership.length > 0 && (
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px bg-slate-200 flex-grow"></div>
                                <Typography variant="h2" className="text-2xl text-brand-navy border-none !pb-0">{t("नेतृत्व वृत्त", "Leadership Circle")}</Typography>
                                <div className="h-px bg-slate-200 flex-grow"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {grouped.leadership.map(renderChannelCard)}
                            </div>
                        </section>
                    )}
                </div>
            )}

            {/* Admin Create Action */}
            {canEditChannels && (
                <div className="mt-20 text-center">
                    <Button onClick={handleCreate} size="lg" className="rounded-full shadow-lg hover:shadow-xl px-8">
                        <Plus className="mr-2 h-5 w-5" />
                        {t("नयाँ च्यानल सिर्जना", "Create New Channel")}
                    </Button>
                    <Typography variant="muted" className="mt-3 text-xs">{t("एडमिन र यान्त्रिकहरूलाई मात्र देखिने", "Visible only to Admins & Yantriks")}</Typography>
                </div>
            )}

            <ChannelModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
                editChannel={editingChannel}
            />
        </div>
    );
}
