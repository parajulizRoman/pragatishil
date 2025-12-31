"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, ArrowRight, MapPin, Building2, Globe } from "lucide-react";
import { moveThread, getChannelsForMove } from "@/app/commune/actions";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface Channel {
    id: string;
    name: string;
    name_ne?: string;
    slug: string;
    category?: string;
    location_type?: string;
    visibility?: string;
}

interface MoveThreadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newChannelId: string, newChannelName: string) => void;
    threadId: string;
    threadTitle: string;
    currentChannelId: string;
    currentChannelName: string;
}

export default function MoveThreadModal({
    isOpen,
    onClose,
    onSuccess,
    threadId,
    threadTitle,
    currentChannelId,
    currentChannelName
}: MoveThreadModalProps) {
    const { t, language } = useLanguage();
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(false);
    const [moving, setMoving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [moveReason, setMoveReason] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadChannels();
        }
    }, [isOpen, currentChannelId]);

    const loadChannels = async () => {
        setLoading(true);
        try {
            const data = await getChannelsForMove(currentChannelId);
            setChannels(data);
        } catch (err) {
            console.error("Failed to load channels:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredChannels = channels.filter(c => {
        const query = searchQuery.toLowerCase();
        return (
            (c.name || '').toLowerCase().includes(query) ||
            (c.name_ne || '').toLowerCase().includes(query) ||
            (c.category || '').toLowerCase().includes(query)
        );
    });

    // Group channels by category
    const groupedChannels = filteredChannels.reduce((acc, channel) => {
        const cat = channel.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(channel);
        return acc;
    }, {} as Record<string, Channel[]>);

    const getLocationIcon = (locationType?: string) => {
        switch (locationType) {
            case 'central': return <Building2 size={12} className="text-brand-red" />;
            case 'state': return <MapPin size={12} className="text-brand-blue" />;
            case 'district': return <MapPin size={12} className="text-slate-500" />;
            case 'department': return <Building2 size={12} className="text-purple-500" />;
            default: return <Globe size={12} className="text-slate-400" />;
        }
    };

    const handleMove = async () => {
        if (!selectedChannel) return;

        setMoving(true);
        setError(null);

        try {
            const result = await moveThread(threadId, selectedChannel.id, moveReason);
            if (result.success) {
                onSuccess(selectedChannel.id, result.targetChannelName);
                onClose();
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to move thread";
            setError(message);
        } finally {
            setMoving(false);
        }
    };

    const handleClose = () => {
        setSelectedChannel(null);
        setSearchQuery("");
        setMoveReason("");
        setError(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ArrowRight size={18} className="text-brand-blue" />
                        {t("थ्रेड सार्नुहोस्", "Move Thread")}
                    </DialogTitle>
                    <DialogDescription>
                        {t(
                            "यो थ्रेड अर्को च्यानलमा सार्नुहोस्। Stack Overflow जस्तो माइग्रेसन।",
                            "Move this thread to a different channel. Similar to Stack Overflow migration."
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col gap-4">
                    {/* Current Thread Info */}
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <div className="text-xs text-slate-500 mb-1">{t("सार्ने थ्रेड", "Moving thread")}:</div>
                        <div className="font-medium text-slate-800 text-sm truncate">{threadTitle}</div>
                        <div className="text-xs text-slate-400 mt-1">
                            {t("वर्तमान", "Currently in")}: <span className="text-brand-blue">{currentChannelName}</span>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder={t("च्यानल खोज्नुहोस्...", "Search channels...")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {/* Channel List */}
                    <div className="flex-1 overflow-y-auto border border-slate-200 rounded-lg bg-white">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="animate-spin text-slate-400" />
                            </div>
                        ) : filteredChannels.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 text-sm">
                                {t("कुनै च्यानल भेटिएन", "No channels found")}
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {Object.entries(groupedChannels).map(([category, chans]) => (
                                    <div key={category}>
                                        <div className="px-3 py-2 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky top-0">
                                            {category}
                                        </div>
                                        {chans.map(channel => (
                                            <button
                                                key={channel.id}
                                                onClick={() => setSelectedChannel(channel)}
                                                className={cn(
                                                    "w-full px-3 py-2.5 flex items-center gap-2 text-left hover:bg-slate-50 transition-colors",
                                                    selectedChannel?.id === channel.id && "bg-brand-blue/10 border-l-2 border-brand-blue"
                                                )}
                                            >
                                                {getLocationIcon(channel.location_type)}
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-slate-800 truncate">
                                                        {language === 'ne' && channel.name_ne ? channel.name_ne : channel.name}
                                                    </div>
                                                </div>
                                                {channel.visibility && channel.visibility !== 'public' && (
                                                    <Badge variant="outline" className="text-[9px] shrink-0">
                                                        {channel.visibility === 'party_only' ? t("पार्टी", "Party") :
                                                            channel.visibility === 'members' ? t("सदस्य", "Members") :
                                                                t("आन्तरिक", "Internal")}
                                                    </Badge>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Selected Channel Preview */}
                    {selectedChannel && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <ArrowRight size={16} className="text-green-600" />
                                <span className="text-sm text-green-800">
                                    {t("मा सार्दै", "Moving to")}:{" "}
                                    <strong>
                                        {language === 'ne' && selectedChannel.name_ne ? selectedChannel.name_ne : selectedChannel.name}
                                    </strong>
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Move Reason */}
                    <div className="space-y-2">
                        <Label htmlFor="moveReason" className="text-sm">
                            {t("सार्नुको कारण (वैकल्पिक)", "Reason for moving (optional)")}
                        </Label>
                        <Input
                            id="moveReason"
                            placeholder={t("यो विषय अर्को च्यानलमा राम्रो फिट हुन्छ...", "This topic fits better in another channel...")}
                            value={moveReason}
                            onChange={(e) => setMoveReason(e.target.value)}
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                            {error}
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={handleClose} disabled={moving}>
                        {t("रद्द गर्नुहोस्", "Cancel")}
                    </Button>
                    <Button
                        onClick={handleMove}
                        disabled={!selectedChannel || moving}
                        className="bg-brand-blue hover:bg-brand-blue/90"
                    >
                        {moving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t("सार्दै...", "Moving...")}
                            </>
                        ) : (
                            <>
                                <ArrowRight className="mr-2 h-4 w-4" />
                                {t("थ्रेड सार्नुहोस्", "Move Thread")}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
