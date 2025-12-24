"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Loader2, Search, Plus, X, Send, ArrowLeft, Paperclip, FileText, Download, AlertCircle } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

// Types
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

interface Message {
    id: string;
    content: string;
    created_at: string;
    sender: Participant;
    attachment_url?: string | null;
    attachment_type?: string | null;
    attachment_name?: string | null;
    attachment_size?: number | null;
}

interface SearchUser {
    id: string;
    full_name: string | null;
    handle: string | null;
    avatar_url: string | null;
    role: string;
}

const PLACEHOLDERS = ["/placeholders/eye-red.svg", "/placeholders/eye-blue.svg"];

// Format timestamp helper
function formatTime(date: Date): string {
    if (isToday(date)) return format(date, "h:mm a");
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d");
}

export default function MessagesPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeId = searchParams.get("id");

    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"active" | "all">("active");

    // Chat state
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // New message modal
    const [showNewMessage, setShowNewMessage] = useState(false);
    const [memberSearch, setMemberSearch] = useState("");
    const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
    const [searching, setSearching] = useState(false);

    // Attachment state
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [attachmentError, setAttachmentError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Fetch conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await fetch("/api/messages/conversations");
                if (!res.ok) {
                    const data = await res.json();
                    setError(data.error || "Failed to load");
                    return;
                }
                const data = await res.json();
                setConversations(data.conversations || []);
            } catch (e) {
                console.error("Fetch error:", e);
                setError("Failed to load conversations");
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

    // Fetch messages when activeId changes
    useEffect(() => {
        if (!activeId) {
            setMessages([]);
            return;
        }

        let isMounted = true;

        // Initial load with loading indicator
        const loadInitialMessages = async () => {
            setLoadingMessages(true);
            try {
                const res = await fetch(`/api/messages/${activeId}`);
                if (res.ok && isMounted) {
                    const data = await res.json();
                    setMessages(data.messages || []);
                }
            } catch (e) {
                console.error("Fetch messages error:", e);
            } finally {
                if (isMounted) setLoadingMessages(false);
            }
        };

        // Silent background poll - only adds new messages
        const pollNewMessages = async () => {
            try {
                const res = await fetch(`/api/messages/${activeId}`);
                if (res.ok && isMounted) {
                    const data = await res.json();
                    const newMessages = data.messages || [];
                    // Only update if there are new messages
                    setMessages(prev => {
                        if (newMessages.length > prev.length) {
                            return newMessages;
                        }
                        return prev;
                    });
                }
            } catch (e) {
                console.error("Poll messages error:", e);
            }
        };

        loadInitialMessages();

        // Poll for new messages silently
        const interval = setInterval(pollNewMessages, 5000);
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [activeId]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Search members
    useEffect(() => {
        if (!memberSearch.trim() || memberSearch.length < 2) {
            setSearchResults([]);
            return;
        }
        const timer = setTimeout(async () => {
            setSearching(true);
            try {
                const res = await fetch(`/api/users/search?q=${encodeURIComponent(memberSearch)}&limit=10`);
                if (res.ok) {
                    const data = await res.json();
                    setSearchResults(data.users || []);
                }
            } catch (e) {
                console.error("Search error:", e);
            } finally {
                setSearching(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [memberSearch]);

    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAttachmentError(null);

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            setAttachmentError("File too large (max 10MB). Upload to Google Drive and share the link instead.");
            e.target.value = '';
            return;
        }

        // Check file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            setAttachmentError("File type not allowed. Use images, PDFs, or Word documents.");
            e.target.value = '';
            return;
        }

        setPendingFile(file);
        e.target.value = '';
    };

    // Clear pending file
    const clearPendingFile = () => {
        setPendingFile(null);
        setAttachmentError(null);
    };

    // Send message (with optional attachment)
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!newMessage.trim() && !pendingFile) || sending || uploading || !activeId) return;

        const messageToSend = newMessage.trim();
        const fileToSend = pendingFile;

        setNewMessage(""); // Clear immediately for better UX
        setPendingFile(null);
        setSending(true);

        let attachmentData: { url: string; type: string; name: string; size: number } | null = null;

        try {
            // Upload attachment first if present
            if (fileToSend) {
                setUploading(true);
                const formData = new FormData();
                formData.append('file', fileToSend);

                const uploadRes = await fetch(`/api/messages/${activeId}/upload`, {
                    method: 'POST',
                    body: formData
                });

                if (!uploadRes.ok) {
                    const data = await uploadRes.json();
                    throw new Error(data.suggestion || data.error || 'Upload failed');
                }

                attachmentData = await uploadRes.json();
                setUploading(false);
            }

            // Send message with attachment data
            const res = await fetch(`/api/messages/${activeId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: messageToSend,
                    attachment_url: attachmentData?.url,
                    attachment_type: attachmentData?.type,
                    attachment_name: attachmentData?.name,
                    attachment_size: attachmentData?.size
                })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, data.message]);
            }
        } catch (e) {
            console.error("Send error:", e);
            // Restore on failure
            setNewMessage(messageToSend);
            if (fileToSend) setPendingFile(fileToSend);
            setAttachmentError(e instanceof Error ? e.message : 'Failed to send');
        } finally {
            setSending(false);
            setUploading(false);
            requestAnimationFrame(() => {
                inputRef.current?.focus();
            });
        }
    };

    // Start new conversation
    const startConversation = async (userId: string) => {
        try {
            const res = await fetch("/api/messages/conversations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId })
            });
            if (res.ok) {
                const data = await res.json();
                router.push(`/messages?id=${data.conversationId}`);
                setShowNewMessage(false);
                setMemberSearch("");
                // Refresh conversations
                const listRes = await fetch("/api/messages/conversations");
                if (listRes.ok) {
                    const listData = await listRes.json();
                    setConversations(listData.conversations || []);
                }
            }
        } catch (e) {
            console.error("Start conversation error:", e);
        }
    };

    // Filter conversations
    const filteredConversations = conversations.filter(conv => {
        if (!searchQuery) return true;
        return conv.participants.some(p =>
            p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.handle?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // Get active conversation
    const activeConversation = conversations.find(c => c.id === activeId);
    const activeParticipant = activeConversation?.participants[0];

    if (loading) {
        return (
            <div className="fixed inset-0 top-[64px] flex items-center justify-center bg-slate-100 z-10">
                <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 top-[64px] flex items-center justify-center bg-slate-100 z-10">
                <div className="text-center p-8">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-500 mb-4">{error}</p>
                    <Link href="/members" className="text-brand-blue hover:underline">
                        {t("सदस्यहरू हेर्नुहोस्", "View Members")}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 top-[64px] flex bg-slate-100 overflow-hidden z-10">
            {/* Left Panel - Conversation List */}
            <div className={cn(
                "w-full md:w-[360px] bg-white border-r border-slate-200 flex flex-col",
                activeId && "hidden md:flex"
            )}>
                {/* Header */}
                <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold text-slate-800">
                            {t("सन्देशहरू", "Messages")}
                        </h1>
                        <button
                            onClick={() => setShowNewMessage(true)}
                            className="p-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
                            title="New Message"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder={t("खोज्नुहोस्...", "Search...")}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={() => setActiveTab("active")}
                            className={cn(
                                "flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors",
                                activeTab === "active"
                                    ? "bg-slate-100 text-slate-800"
                                    : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setActiveTab("all")}
                            className={cn(
                                "flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors",
                                activeTab === "all"
                                    ? "bg-slate-100 text-slate-800"
                                    : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            All
                        </button>
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                        <div className="p-8 text-center">
                            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                            <p className="text-slate-400 text-sm">
                                {t("कुनै कुराकानी छैन", "No conversations")}
                            </p>
                        </div>
                    ) : (
                        <ul>
                            {filteredConversations.map(conv => {
                                const participant = conv.participants[0];
                                const isActive = conv.id === activeId;
                                const avatar = participant?.avatar_url || PLACEHOLDERS[0];

                                return (
                                    <li key={conv.id}>
                                        <button
                                            onClick={() => router.push(`/messages?id=${conv.id}`)}
                                            className={cn(
                                                "w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left",
                                                isActive && "bg-blue-50 border-l-2 border-brand-blue"
                                            )}
                                        >
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100">
                                                    <Image
                                                        src={avatar}
                                                        alt={participant?.full_name || "User"}
                                                        width={48}
                                                        height={48}
                                                        className="object-cover"
                                                    />
                                                </div>
                                                {conv.unreadCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-blue text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                        {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h3 className={cn(
                                                        "font-medium truncate",
                                                        conv.unreadCount > 0 ? "text-slate-900" : "text-slate-700"
                                                    )}>
                                                        {participant?.full_name || "User"}
                                                    </h3>
                                                    {conv.lastMessage && (
                                                        <span className="text-xs text-slate-400 shrink-0 ml-2">
                                                            {formatTime(new Date(conv.lastMessage.created_at))}
                                                        </span>
                                                    )}
                                                </div>
                                                {conv.lastMessage && (
                                                    <p className={cn(
                                                        "text-sm truncate",
                                                        conv.unreadCount > 0 ? "text-slate-700 font-medium" : "text-slate-500"
                                                    )}>
                                                        {conv.lastMessage.content}
                                                    </p>
                                                )}
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>

            {/* Right Panel - Chat View */}
            <div className={cn(
                "flex-1 flex flex-col bg-white",
                !activeId && "hidden md:flex"
            )}>
                {!activeId ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                            <p className="text-slate-500">
                                {t("कुराकानी छान्नुहोस्", "Select a conversation")}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                            <button
                                onClick={() => router.push("/messages")}
                                className="md:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg"
                            >
                                <ArrowLeft size={20} className="text-slate-600" />
                            </button>
                            {activeParticipant && (
                                <Link href={`/members/${activeParticipant.id}`} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                                        <Image
                                            src={activeParticipant.avatar_url || PLACEHOLDERS[0]}
                                            alt={activeParticipant.full_name || "User"}
                                            width={40}
                                            height={40}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-slate-800">
                                            {activeParticipant.full_name || "User"}
                                        </h2>
                                        {activeParticipant.handle && (
                                            <p className="text-xs text-slate-500">@{activeParticipant.handle}</p>
                                        )}
                                    </div>
                                </Link>
                            )}
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                            {loadingMessages ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="text-center py-8 text-slate-400">
                                    {t("कुराकानी सुरु गर्नुहोस्", "Start the conversation")}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {messages.map((msg, idx) => {
                                        const isOwn = msg.sender.id === currentUserId;
                                        const showName = !isOwn && (idx === 0 || messages[idx - 1]?.sender.id !== msg.sender.id);
                                        const hasAttachment = !!msg.attachment_url;
                                        const isImage = msg.attachment_type?.startsWith('image/');

                                        return (
                                            <div
                                                key={msg.id}
                                                className={cn("flex", isOwn ? "justify-end" : "justify-start")}
                                            >
                                                <div className={cn("max-w-[70%]", isOwn && "text-right")}>
                                                    {showName && (
                                                        <p className="text-xs text-slate-500 mb-1 ml-1">
                                                            {msg.sender.full_name}
                                                        </p>
                                                    )}
                                                    <div
                                                        className={cn(
                                                            "inline-block px-4 py-2 rounded-2xl",
                                                            isOwn
                                                                ? "bg-brand-blue text-white rounded-br-sm"
                                                                : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                                                        )}
                                                    >
                                                        {/* Attachment display */}
                                                        {hasAttachment && (
                                                            <div className="mb-2">
                                                                {isImage ? (
                                                                    <a href={msg.attachment_url!} target="_blank" rel="noopener noreferrer">
                                                                        <Image
                                                                            src={msg.attachment_url!}
                                                                            alt={msg.attachment_name || 'Image'}
                                                                            width={200}
                                                                            height={150}
                                                                            className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90"
                                                                        />
                                                                    </a>
                                                                ) : (
                                                                    <a
                                                                        href={msg.attachment_url!}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className={cn(
                                                                            "flex items-center gap-2 p-2 rounded-lg",
                                                                            isOwn ? "bg-blue-500" : "bg-slate-100"
                                                                        )}
                                                                    >
                                                                        <FileText size={20} className={isOwn ? "text-white" : "text-slate-500"} />
                                                                        <div className="flex-1 min-w-0 text-left">
                                                                            <p className={cn("text-sm truncate", isOwn ? "text-white" : "text-slate-700")}>
                                                                                {msg.attachment_name || 'File'}
                                                                            </p>
                                                                            {msg.attachment_size && (
                                                                                <p className={cn("text-xs", isOwn ? "text-blue-100" : "text-slate-400")}>
                                                                                    {(msg.attachment_size / 1024).toFixed(1)} KB
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                        <Download size={16} className={isOwn ? "text-white" : "text-slate-400"} />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                        {msg.content && (
                                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                        )}
                                                    </div>
                                                    <p className={cn(
                                                        "text-[10px] mt-1 mx-1",
                                                        isOwn ? "text-slate-400" : "text-slate-400"
                                                    )}>
                                                        {format(new Date(msg.created_at), "h:mm a")}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white">
                            {/* Pending file preview */}
                            {pendingFile && (
                                <div className="flex items-center gap-2 mb-2 p-2 bg-slate-50 rounded-lg">
                                    {pendingFile.type.startsWith('image/') ? (
                                        <Image
                                            src={URL.createObjectURL(pendingFile)}
                                            alt="Preview"
                                            width={48}
                                            height={48}
                                            className="w-12 h-12 rounded object-cover"
                                        />
                                    ) : (
                                        <FileText className="w-8 h-8 text-slate-400" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{pendingFile.name}</p>
                                        <p className="text-xs text-slate-400">{(pendingFile.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                    <button type="button" onClick={clearPendingFile} className="p-1 hover:bg-slate-200 rounded">
                                        <X size={16} className="text-slate-500" />
                                    </button>
                                </div>
                            )}

                            {/* Error message */}
                            {attachmentError && (
                                <div className="flex items-center gap-2 mb-2 p-2 bg-amber-50 text-amber-700 rounded-lg text-sm">
                                    <AlertCircle size={16} />
                                    <span>{attachmentError}</span>
                                    <button type="button" onClick={() => setAttachmentError(null)} className="ml-auto">
                                        <X size={14} />
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                {/* Attachment button */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,.pdf,.doc,.docx,.txt"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={sending || uploading}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-700"
                                    title="Add attachment"
                                >
                                    <Paperclip size={20} />
                                </button>

                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    placeholder={t("सन्देश लेख्नुहोस्...", "Type a message...")}
                                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                                    disabled={sending || uploading}
                                />
                                <button
                                    type="submit"
                                    disabled={(!newMessage.trim() && !pendingFile) || sending || uploading}
                                    className={cn(
                                        "p-3 rounded-full transition-colors",
                                        (newMessage.trim() || pendingFile)
                                            ? "bg-brand-blue text-white hover:bg-blue-600"
                                            : "bg-slate-100 text-slate-400"
                                    )}
                                >
                                    {(sending || uploading) ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <Send size={18} />
                                    )}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>

            {/* New Message Modal */}
            {showNewMessage && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowNewMessage(false)}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-slate-100">
                            <h2 className="text-lg font-semibold">{t("नयाँ सन्देश", "New Message")}</h2>
                            <button onClick={() => setShowNewMessage(false)} className="p-1 hover:bg-slate-100 rounded">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="relative mb-3">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder={t("सदस्य खोज्नुहोस्...", "Search members...")}
                                    value={memberSearch}
                                    onChange={e => setMemberSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                                    autoFocus
                                />
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {searching ? (
                                    <div className="py-8 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" />
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <ul className="divide-y divide-slate-100">
                                        {searchResults.map(user => (
                                            <li key={user.id}>
                                                <button
                                                    onClick={() => startConversation(user.id)}
                                                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left"
                                                >
                                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                                                        <Image
                                                            src={user.avatar_url || PLACEHOLDERS[0]}
                                                            alt={user.full_name || "User"}
                                                            width={40}
                                                            height={40}
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-800">{user.full_name || "User"}</p>
                                                        {user.handle && <p className="text-xs text-slate-500">@{user.handle}</p>}
                                                    </div>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : memberSearch.length >= 2 ? (
                                    <p className="py-8 text-center text-slate-400 text-sm">{t("कुनै सदस्य भेटिएन", "No members found")}</p>
                                ) : (
                                    <p className="py-8 text-center text-slate-400 text-sm">{t("कम्तिमा २ अक्षर टाइप गर्नुहोस्", "Type at least 2 characters")}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
