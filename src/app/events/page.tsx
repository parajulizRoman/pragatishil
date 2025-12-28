"use client";

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, MapPin, Video, Users, Clock, ExternalLink } from 'lucide-react';
import Calendar from '@/components/Calendar';
import type { CalendarEvent } from '@/components/Calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { useLanguage } from '@/context/LanguageContext';
import { formatBSDate, getRelativeBSDate } from '@/lib/bsDateFormat';
import { cn } from '@/lib/utils';

interface PartyEvent {
    id: string;
    title: string;
    description?: string;
    event_type: string;
    start_datetime: string;
    end_datetime?: string;
    location?: string;
    location_type?: string;
    meeting_link?: string;
    recording_url?: string;
    is_live: boolean;
    status: string;
    visibility: string;
    creator?: {
        id: string;
        full_name: string;
        avatar_url?: string;
    };
    attendees?: { count: number }[];
}

export default function EventsPage() {
    const { t, language } = useLanguage();
    const [events, setEvents] = useState<PartyEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<PartyEvent | null>(null);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

    useEffect(() => {
        fetchEvents();
    }, [filter]);

    const fetchEvents = async () => {
        try {
            const params = new URLSearchParams();
            if (filter === 'upcoming') {
                params.append('upcoming', 'true');
            }

            const res = await fetch(`/api/events?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch events');

            const data = await res.json();
            setEvents(data.events || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEventClick = (event: CalendarEvent) => {
        const fullEvent = events.find(e => e.id === event.id);
        if (fullEvent) {
            setSelectedEvent(fullEvent);
        }
    };

    const handleRegister = async (eventId: string) => {
        try {
            const res = await fetch(`/api/events/${eventId}/register`, {
                method: 'POST',
            });

            if (!res.ok) throw new Error('Registration failed');

            alert(t('दर्ता सफल!', 'Registration successful!'));
            fetchEvents();
        } catch (error) {
            console.error('Registration error:', error);
            alert(t('दर्ता असफल भयो।', 'Registration failed.'));
        }
    };

    const getEventTypeLabel = (type: string) => {
        const types: Record<string, { en: string; ne: string; color: string }> = {
            meeting: { en: 'Meeting', ne: 'बैठक', color: 'bg-blue-100 text-blue-700' },
            training: { en: 'Training', ne: 'तालिम', color: 'bg-green-100 text-green-700' },
            rally: { en: 'Rally', ne: 'र्‍याली', color: 'bg-red-100 text-red-700' },
            conference: { en: 'Conference', ne: 'सम्मेलन', color: 'bg-purple-100 text-purple-700' },
            webinar: { en: 'Webinar', ne: 'वेबिनार', color: 'bg-orange-100 text-orange-700' },
            other: { en: 'Other', ne: 'अन्य', color: 'bg-slate-100 text-slate-700' },
        };

        const config = types[type] || types.other;
        return { label: language === 'ne' ? config.ne : config.en, color: config.color };
    };

    const upcomingEvents = events.filter(e => new Date(e.start_datetime) >= new Date());
    const pastEvents = events.filter(e => new Date(e.start_datetime) < new Date());

    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-12">
            <div className="container max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-brand-blue/10 rounded-lg">
                                <CalendarIcon className="w-6 h-6 text-brand-blue" />
                            </div>
                            <div>
                                <Typography variant="h1" className="text-2xl font-bold text-slate-900">
                                    {t('कार्यक्रम तालिका', 'Events Calendar')}
                                </Typography>
                                <Typography variant="muted" className="text-sm">
                                    {t('पार्टीका सबै कार्यक्रमहरू हेर्नुहोस् र दर्ता गर्नुहोस्', 'View and register for all party events')}
                                </Typography>
                            </div>
                        </div>

                        <Button className="bg-brand-blue hover:bg-brand-blue/90">
                            <Plus className="w-4 h-4 mr-2" />
                            {t('नयाँ कार्यक्रम', 'New Event')}
                        </Button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 border-b border-slate-200">
                        {(['all', 'upcoming', 'past'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                                    filter === tab
                                        ? "border-brand-blue text-brand-blue"
                                        : "border-transparent text-slate-600 hover:text-slate-900"
                                )}
                            >
                                {t(
                                    tab === 'all' ? 'सबै' : tab === 'upcoming' ? 'आगामी' : 'विगत',
                                    tab.charAt(0).toUpperCase() + tab.slice(1)
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar */}
                    <div className="lg:col-span-2">
                        <Calendar
                            events={events}
                            onEventClick={handleEventClick}
                        />
                    </div>

                    {/* Event Details / Upcoming Events */}
                    <div className="space-y-4">
                        {selectedEvent ? (
                            /* Selected Event Details */
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <Typography variant="h3" className="text-lg font-bold">
                                            {selectedEvent.title}
                                        </Typography>
                                        <button
                                            onClick={() => setSelectedEvent(null)}
                                            className="text-slate-400 hover:text-slate-600"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Badge className={getEventTypeLabel(selectedEvent.event_type).color}>
                                            {getEventTypeLabel(selectedEvent.event_type).label}
                                        </Badge>
                                        {selectedEvent.is_live && (
                                            <Badge className="bg-red-100 text-red-700">
                                                🔴 {t('लाइभ', 'Live')}
                                            </Badge>
                                        )}
                                    </div>

                                    {selectedEvent.description && (
                                        <p className="text-sm text-slate-600">{selectedEvent.description}</p>
                                    )}

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Clock className="w-4 h-4" />
                                            <span>{formatBSDate(selectedEvent.start_datetime, 'full', language)}</span>
                                        </div>

                                        {selectedEvent.location && (
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <MapPin className="w-4 h-4" />
                                                <span>{selectedEvent.location}</span>
                                            </div>
                                        )}

                                        {selectedEvent.meeting_link && (
                                            <a
                                                href={selectedEvent.meeting_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-brand-blue hover:underline"
                                            >
                                                <Video className="w-4 h-4" />
                                                <span>{t('अनलाइन बैठक लिङ्क', 'Online Meeting Link')}</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}

                                        {selectedEvent.recording_url && (
                                            <a
                                                href={selectedEvent.recording_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-brand-blue hover:underline"
                                            >
                                                <Video className="w-4 h-4" />
                                                <span>{t('रेकर्डिङ हेर्नुहोस्', 'View Recording')}</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}

                                        {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Users className="w-4 h-4" />
                                                <span>{selectedEvent.attendees[0].count} {t('सहभागी', 'attendees')}</span>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        onClick={() => handleRegister(selectedEvent.id)}
                                        className="w-full bg-brand-blue hover:bg-brand-blue/90"
                                    >
                                        {t('दर्ता गर्नुहोस्', 'Register')}
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            /* Upcoming Events List */
                            <Card>
                                <CardHeader>
                                    <Typography variant="h3" className="text-lg font-bold">
                                        {t('आगामी कार्यक्रमहरू', 'Upcoming Events')}
                                    </Typography>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {loading ? (
                                        <div className="text-center py-4 text-slate-500">
                                            {t('लोड गर्दै...', 'Loading...')}
                                        </div>
                                    ) : upcomingEvents.length === 0 ? (
                                        <div className="text-center py-4 text-slate-500 text-sm">
                                            {t('कुनै आगामी कार्यक्रम छैन', 'No upcoming events')}
                                        </div>
                                    ) : (
                                        upcomingEvents.slice(0, 5).map(event => (
                                            <button
                                                key={event.id}
                                                onClick={() => setSelectedEvent(event)}
                                                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-brand-blue hover:shadow-sm transition-all"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm text-slate-900 truncate">
                                                            {event.title}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {getRelativeBSDate(event.start_datetime, language)}
                                                        </p>
                                                    </div>
                                                    {event.is_live && (
                                                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                                            🔴 Live
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
