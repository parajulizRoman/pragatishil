"use client";

import React from 'react';
import { X, Calendar, Sun, Moon, Clock, MapPin, Video } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { useLanguage } from '@/context/LanguageContext';
import { formatBSDate } from '@/lib/bsDateFormat';
import { getAstrologyData } from '@/lib/moonCycle';
import { cn } from '@/lib/utils';
import NepaliDate from 'nepali-date-converter';

interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    start_datetime: string;
    end_datetime?: string;
    event_type: string;
    location?: string;
    meeting_link?: string;
    is_live: boolean;
}

interface Festival {
    id: string;
    name_en: string;
    name_ne: string;
    description_en?: string;
    description_ne?: string;
    image_url?: string;
    category: string;
    is_public_holiday: boolean;
}

interface DayDetailsModalProps {
    date: Date;
    events: CalendarEvent[];
    festival?: Festival | null;
    onClose: () => void;
}

export default function DayDetailsModal({ date, events, festival, onClose }: DayDetailsModalProps) {
    const { t, language } = useLanguage();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _bsDate = new NepaliDate(date); // Reserved for future BS date formatting
    const astrology = getAstrologyData(date, language);

    const bsDateStr = formatBSDate(date.toISOString(), 'full', language);
    const adDateStr = date.toLocaleDateString(language === 'ne' ? 'ne-NP' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Group events by time
    const sortedEvents = [...events].sort((a, b) =>
        new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime()
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <CardHeader className="border-b bg-gradient-to-r from-brand-blue/5 to-brand-red/5 pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            {/* Dual Dates */}
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-5 h-5 text-brand-blue" />
                                <div>
                                    <Typography variant="h2" className="text-xl font-bold text-slate-900">
                                        {bsDateStr}
                                    </Typography>
                                    <Typography variant="muted" className="text-sm text-slate-600">
                                        {adDateStr}
                                    </Typography>
                                </div>
                            </div>

                            {/* Festival Badge */}
                            {festival && (
                                <Badge className={cn(
                                    "mt-2",
                                    festival.is_public_holiday
                                        ? "bg-red-100 text-red-700 border-red-200"
                                        : "bg-amber-100 text-amber-700 border-amber-200"
                                )}>
                                    {festival.is_public_holiday && '🏛️ '}
                                    {language === 'ne' ? festival.name_ne : festival.name_en}
                                </Badge>
                            )}
                        </div>

                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </CardHeader>

                {/* Content */}
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Astrology Section */}
                    <div className="space-y-3">
                        <Typography variant="h3" className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <Moon className="w-5 h-5 text-brand-blue" />
                            {t('नेपाली ज्योतिष', 'Nepali Astrology')}
                        </Typography>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Tithi */}
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <div className="text-xs text-slate-500 mb-1">{t('तिथि', 'Tithi')}</div>
                                <div className="font-medium text-slate-800">{astrology.tithi}</div>
                            </div>

                            {/* Moon Cycle */}
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <div className="text-xs text-slate-500 mb-1">{t('चन्द्र पक्ष', 'Moon Phase')}</div>
                                <div className="font-medium text-slate-800 flex items-center gap-1">
                                    <span>{astrology.moonCycle.emoji}</span>
                                    <span>{language === 'ne' ? astrology.moonCycle.name_ne : astrology.moonCycle.name_en}</span>
                                </div>
                            </div>
                        </div>

                        {/* Special Day Indicators */}
                        {(astrology.isEkadashi || astrology.isPurnima || astrology.isAmavasya) && (
                            <div className="flex gap-2">
                                {astrology.isEkadashi && (
                                    <Badge className="bg-purple-100 text-purple-700">
                                        🌓 {t('एकादशी', 'Ekadashi')}
                                    </Badge>
                                )}
                                {astrology.isPurnima && (
                                    <Badge className="bg-yellow-100 text-yellow-700">
                                        🌕 {t('पूर्णिमा', 'Purnima')}
                                    </Badge>
                                )}
                                {astrology.isAmavasya && (
                                    <Badge className="bg-slate-100 text-slate-700">
                                        🌑 {t('औंसी', 'Amavasya')}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sun Times */}
                    <div className="space-y-3">
                        <Typography variant="h3" className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <Sun className="w-5 h-5 text-orange-500" />
                            {t('सूर्योदय र सूर्यास्त', 'Sunrise & Sunset')}
                        </Typography>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-orange-50 rounded-lg">
                                <div className="text-xs text-orange-600 mb-1">{t('सूर्योदय', 'Sunrise')}</div>
                                <div className="font-medium text-orange-800 flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {astrology.sunrise}
                                </div>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-lg">
                                <div className="text-xs text-indigo-600 mb-1">{t('सूर्यास्त', 'Sunset')}</div>
                                <div className="font-medium text-indigo-800 flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {astrology.sunset}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Festival Description */}
                    {festival && (festival.description_en || festival.description_ne) && (
                        <div className="space-y-2">
                            <Typography variant="h3" className="text-lg font-semibold text-slate-800">
                                {t('चाडको बारेमा', 'About the Festival')}
                            </Typography>
                            <p className="text-sm text-slate-600">
                                {language === 'ne' ? festival.description_ne : festival.description_en}
                            </p>
                        </div>
                    )}

                    {/* Events Timeline */}
                    <div className="space-y-3">
                        <Typography variant="h3" className="text-lg font-semibold text-slate-800">
                            {t('कार्यक्रमहरू', 'Events')} ({events.length})
                        </Typography>

                        {events.length === 0 ? (
                            /* Empty Timeline */
                            <div className="border-l-2 border-slate-200 pl-4 py-8">
                                <div className="text-center text-slate-400">
                                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">{t('यो दिन कुनै कार्यक्रम छैन', 'No events scheduled for this day')}</p>
                                </div>
                            </div>
                        ) : (
                            /* Events List */
                            <div className="border-l-2 border-brand-blue/30 space-y-4">
                                {sortedEvents.map((event) => {
                                    const eventTime = new Date(event.start_datetime).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    });

                                    return (
                                        <div key={event.id} className="relative pl-6">
                                            {/* Timeline Dot */}
                                            <div className={cn(
                                                "absolute left-0 top-2 w-3 h-3 rounded-full -translate-x-[7px]",
                                                event.is_live
                                                    ? "bg-red-500 ring-4 ring-red-200 animate-pulse"
                                                    : "bg-brand-blue ring-4 ring-blue-100"
                                            )} />

                                            <div className="bg-slate-50 rounded-lg p-3 hover:bg-slate-100 transition-colors">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div className="flex-1">
                                                        <div className="font-medium text-slate-900">
                                                            {event.is_live && <span className="text-red-600">🔴 </span>}
                                                            {event.title}
                                                        </div>
                                                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {eventTime}
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className="text-xs">
                                                        {event.event_type}
                                                    </Badge>
                                                </div>

                                                {event.description && (
                                                    <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                                                )}

                                                <div className="flex flex-wrap gap-2 text-xs">
                                                    {event.location && (
                                                        <div className="flex items-center gap-1 text-slate-500">
                                                            <MapPin className="w-3 h-3" />
                                                            {event.location}
                                                        </div>
                                                    )}
                                                    {event.meeting_link && (
                                                        <a
                                                            href={event.meeting_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 text-brand-blue hover:underline"
                                                        >
                                                            <Video className="w-3 h-3" />
                                                            {t('अनलाइन बैठक', 'Online Meeting')}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* Footer */}
                <div className="border-t p-4 bg-slate-50">
                    <Button
                        onClick={onClose}
                        className="w-full bg-brand-blue hover:bg-brand-blue/90"
                    >
                        {t('बन्द गर्नुहोस्', 'Close')}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
