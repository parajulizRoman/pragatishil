"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Loader2, User, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface Participant {
    id: string;
    full_name: string | null;
    handle: string | null;
    avatar_url: string | null;
}

interface Conversation {
    id: string;
    participants: Participant[];
    lastMessage: {
        id: string;
        content: string;
        created_at: string;
        sender_id: string;
    } | null;
    unreadCount: number;
    updatedAt: string;
}

const PLACEHOLDERS = [
    "/placeholders/eye-red.svg",
    "/placeholders/eye-blue.svg",
];

export default function MessagesPage() {
    const { t } = useLanguage();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await fetch("/api/messages/conversations");
                if (!res.ok) {
                    const data = await res.json();
                    if (res.status === 403) {
                        setError(data.error || "Messaging requires party member role or higher");
                    } else {
                        setError(data.error || "Failed to load conversations");
                    }
                    return;
                }
                const data = await res.json();
                setConversations(data.conversations || []);
            } catch (e) {
                console.error("Failed to fetch conversations:", e);
                setError("Failed to load conversations");
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

    // Filter conversations by search
    const filteredConversations = conversations.filter(conv => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return conv.participants.some(p =>
            p.full_name?.toLowerCase().includes(query) ||
            p.handle?.toLowerCase().includes(query)
        );
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
                <div className="container max-w-2xl mx-auto px-4">
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
                <div className="container max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">
                            {t("सन्देशहरू", "Messages")}
                        </h1>
                        <p className="text-slate-500 mb-6">{error}</p>
                        <Link
                            href="/members"
                            className="inline-block px-6 py-3 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            {t("सदस्यहरू हेर्नुहोस्", "View Members")}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
            <div className="container max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        {t("सन्देशहरू", "Messages")}
                    </h1>
                    <p className="text-slate-500">
                        {t("पार्टी सदस्यहरूसँग निजी कुराकानी", "Private conversations with party members")}
                    </p>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder={t("कुराकानी खोज्नुहोस्...", "Search conversations...")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                    />
                </div>

                {/* Conversations List */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {filteredConversations.length === 0 ? (
                        <div className="p-12 text-center">
                            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                            <p className="text-slate-500 mb-4">
                                {conversations.length === 0
                                    ? t("अझै कुनै कुराकानी छैन", "No conversations yet")
                                    : t("कुनै परिणाम भेटिएन", "No results found")
                                }
                            </p>
                            {conversations.length === 0 && (
                                <Link
                                    href="/members"
                                    className="inline-block px-6 py-3 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    {t("सदस्यहरूलाई सन्देश पठाउनुहोस्", "Message a member")}
                                </Link>
                            )}
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {filteredConversations.map((conv) => {
                                const participant = conv.participants[0];
                                const avatar = participant?.avatar_url ||
                                    PLACEHOLDERS[conv.id.charCodeAt(0) % PLACEHOLDERS.length];

                                return (
                                    <li key={conv.id}>
                                        <Link
                                            href={`/messages/${conv.id}`}
                                            className={cn(
                                                "flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors",
                                                conv.unreadCount > 0 && "bg-blue-50/50"
                                            )}
                                        >
                                            {/* Avatar */}
                                            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-slate-100 shrink-0">
                                                {participant ? (
                                                    <Image
                                                        src={avatar}
                                                        alt={participant.full_name || "User"}
                                                        fill
                                                        className="object-cover"
                                                        sizes="56px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <User className="w-6 h-6 text-slate-400" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-semibold text-slate-800 truncate">
                                                        {participant?.full_name || "Unknown User"}
                                                    </h3>
                                                    {conv.lastMessage && (
                                                        <span className="text-xs text-slate-400 shrink-0 ml-2">
                                                            {formatDistanceToNow(new Date(conv.lastMessage.created_at), { addSuffix: true })}
                                                        </span>
                                                    )}
                                                </div>
                                                {participant?.handle && (
                                                    <p className="text-xs text-slate-500 mb-1">
                                                        @{participant.handle}
                                                    </p>
                                                )}
                                                {conv.lastMessage && (
                                                    <p className={cn(
                                                        "text-sm truncate",
                                                        conv.unreadCount > 0 ? "text-slate-800 font-medium" : "text-slate-500"
                                                    )}>
                                                        {conv.lastMessage.content}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Unread Badge */}
                                            {conv.unreadCount > 0 && (
                                                <span className="w-6 h-6 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center shrink-0">
                                                    {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
