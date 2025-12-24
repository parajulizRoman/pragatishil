"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { createBrowserClient } from "@supabase/ssr";

interface MessageSender {
    id: string;
    full_name: string | null;
    handle: string | null;
    avatar_url: string | null;
}

interface Message {
    id: string;
    content: string;
    created_at: string;
    sender: MessageSender;
}

const PLACEHOLDERS = [
    "/placeholders/eye-red.svg",
    "/placeholders/eye-blue.svg",
];

export default function ConversationPage() {
    const params = useParams();
    const router = useRouter();
    const { t } = useLanguage();
    const conversationId = params.conversationId as string;

    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Get current user
    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        supabase.auth.getUser().then(({ data }) => {
            setCurrentUserId(data.user?.id || null);
        });
    }, []);

    // Fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/messages/${conversationId}`);
                if (!res.ok) {
                    const data = await res.json();
                    setError(data.error || "Failed to load messages");
                    return;
                }
                const data = await res.json();
                setMessages(data.messages || []);
            } catch (e) {
                console.error("Failed to fetch messages:", e);
                setError("Failed to load messages");
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();

        // Poll for new messages every 5 seconds
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [conversationId]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Send message
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const res = await fetch(`/api/messages/${conversationId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newMessage.trim() })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, data.message]);
                setNewMessage("");
                inputRef.current?.focus();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to send message");
            }
        } catch (e) {
            console.error("Send message error:", e);
            alert("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    // Get other participant info
    const otherParticipant = messages.find(m => m.sender.id !== currentUserId)?.sender;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
                <div className="container max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <p className="text-slate-500 mb-4">{error}</p>
                        <button
                            onClick={() => router.push("/messages")}
                            className="px-6 py-3 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            {t("फिर्ता जानुहोस्", "Go Back")}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="container max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
                    <Link
                        href="/messages"
                        className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Link>

                    {otherParticipant && (
                        <Link href={`/members/${otherParticipant.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0">
                                <Image
                                    src={otherParticipant.avatar_url || PLACEHOLDERS[0]}
                                    alt={otherParticipant.full_name || "User"}
                                    fill
                                    className="object-cover"
                                    sizes="40px"
                                />
                            </div>
                            <div className="min-w-0">
                                <h1 className="font-semibold text-slate-800 truncate">
                                    {otherParticipant.full_name || "User"}
                                </h1>
                                {otherParticipant.handle && (
                                    <p className="text-xs text-slate-500">@{otherParticipant.handle}</p>
                                )}
                            </div>
                        </Link>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
                <div className="container max-w-2xl mx-auto px-4 py-4">
                    {messages.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            {t("कुराकानी सुरु गर्नुहोस्", "Start the conversation")}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {messages.map((msg, index) => {
                                const isOwn = msg.sender.id === currentUserId;
                                const showAvatar = !isOwn && (index === 0 || messages[index - 1]?.sender.id !== msg.sender.id);
                                const avatar = msg.sender.avatar_url || PLACEHOLDERS[msg.sender.id.charCodeAt(0) % PLACEHOLDERS.length];

                                return (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex items-end gap-2",
                                            isOwn ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        {!isOwn && (
                                            <div className={cn("w-8", !showAvatar && "invisible")}>
                                                {showAvatar && (
                                                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100">
                                                        <Image
                                                            src={avatar}
                                                            alt={msg.sender.full_name || "User"}
                                                            fill
                                                            className="object-cover"
                                                            sizes="32px"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div
                                            className={cn(
                                                "max-w-[75%] rounded-2xl px-4 py-2",
                                                isOwn
                                                    ? "bg-brand-blue text-white rounded-br-sm"
                                                    : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                                            )}
                                        >
                                            <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                                            <p className={cn(
                                                "text-[10px] mt-1",
                                                isOwn ? "text-blue-100" : "text-slate-400"
                                            )}>
                                                {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
            </div>

            {/* Input */}
            <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0">
                <form onSubmit={handleSend} className="container max-w-2xl mx-auto">
                    <div className="flex items-center gap-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={t("सन्देश लेख्नुहोस्...", "Type a message...")}
                            className="flex-1 px-4 py-3 rounded-full border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue focus:bg-white transition-all"
                            disabled={sending}
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim() || sending}
                            className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                                newMessage.trim()
                                    ? "bg-brand-blue text-white hover:bg-blue-600"
                                    : "bg-slate-100 text-slate-400"
                            )}
                        >
                            {sending ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
