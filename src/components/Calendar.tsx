"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { toNepaliNumerals } from '@/lib/bsDateFormat';
import { cn } from '@/lib/utils';
import NepaliDate from 'nepali-date-converter';

export interface CalendarEvent {
    id: string;
    title: string;
    start_datetime: string;
    end_datetime?: string;
    event_type: string;
    is_live: boolean;
    status: string;
}

interface CalendarProps {
    events?: CalendarEvent[];
    onEventClick?: (event: CalendarEvent) => void;
    onDateClick?: (date: Date) => void;
}

export default function Calendar({ events = [], onEventClick, onDateClick }: CalendarProps) {
    const { t, language } = useLanguage();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

    // Get current BS date
//     const currentBS = getCurrentBSDate();
    const bsDate = new NepaliDate(currentDate);
    const currentBSYear = bsDate.getYear();
    const currentBSMonth = bsDate.getMonth(); // 0-indexed

    // Nepali month names
    const nepaliMonths = [
        'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज',
        'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फागुन', 'चैत'
    ];

    const englishMonths = [
        'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
        'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
    ];

    const weekDays = language === 'ne'
        ? ['आइत', 'सोम', 'मंगल', 'बुध', 'बिहि', 'शुक्र', 'शनि']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Navigate months
    const goToPreviousMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setCurrentDate(newDate);
    };

    const goToNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Get days in current BS month
    const getDaysInBSMonth = (year: number, month: number): number => {
        // NepaliDate months are 0-indexed

        // Find the last day by checking when the next month starts
        for (let day = 28; day <= 32; day++) {
            try {
                const testDate = new NepaliDate(year, month, day);
                const adDate = testDate.toJsDate();
                const backToBS = new NepaliDate(adDate);
                if (backToBS.getMonth() !== month) {
                    return day - 1;
                }
            } catch {
                return day - 1;
            }
        }
        return 30; // Default fallback
    };

    // Generate calendar grid for month view
    const generateMonthCalendar = () => {
        const daysInMonth = getDaysInBSMonth(currentBSYear, currentBSMonth);
        const firstDayOfMonth = new NepaliDate(currentBSYear, currentBSMonth, 1).toJsDate();
        const startingDayOfWeek = firstDayOfMonth.getDay();

        const days: (Date | null)[] = [];

        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add actual days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const bsDateObj = new NepaliDate(currentBSYear, currentBSMonth, day);
            days.push(bsDateObj.toJsDate());
        }

        return days;
    };

    // Get events for a specific date
    const getEventsForDate = (date: Date | null): CalendarEvent[] => {
        if (!date) return [];

        const dateStr = date.toISOString().split('T')[0];
        return events.filter(event => {
            const eventDate = new Date(event.start_datetime).toISOString().split('T')[0];
            return eventDate === dateStr;
        });
    };

    // Check if date is today
    const isToday = (date: Date | null): boolean => {
        if (!date) return false;
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const monthDays = generateMonthCalendar();
    const monthName = language === 'ne' ? nepaliMonths[currentBSMonth] : englishMonths[currentBSMonth];
    const yearDisplay = language === 'ne' ? toNepaliNumerals(currentBSYear) : currentBSYear.toString();

    return (
        <Card className="w-full">
            <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-brand-blue" />
                        <h2 className="text-lg font-bold text-slate-800">
                            {monthName} {yearDisplay}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* View Mode Toggle */}
                        <div className="hidden sm:flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
                            {(['month', 'week', 'day'] as const).map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={cn(
                                        "px-3 py-1 text-xs rounded transition-all",
                                        viewMode === mode
                                            ? "bg-white shadow-sm text-brand-blue font-medium"
                                            : "text-slate-600 hover:text-slate-800"
                                    )}
                                >
                                    {t(
                                        mode === 'month' ? 'महिना' : mode === 'week' ? 'हप्ता' : 'दिन',
                                        mode.charAt(0).toUpperCase() + mode.slice(1)
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goToPreviousMonth}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goToToday}
                                className="h-8 px-3 text-xs"
                            >
                                {t('आज', 'Today')}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goToNextMonth}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Month View */}
                {viewMode === 'month' && (
                    <div className="space-y-2">
                        {/* Week day headers */}
                        <div className="grid grid-cols-7 gap-1">
                            {weekDays.map(day => (
                                <div
                                    key={day}
                                    className="text-center text-xs font-semibold text-slate-600 py-2"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {monthDays.map((date, index) => {
                                const dayEvents = getEventsForDate(date);
                                const isCurrentDay = isToday(date);
                                const bsDay = date ? new NepaliDate(date).getDate() : null;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => date && onDateClick?.(date)}
                                        disabled={!date}
                                        className={cn(
                                            "min-h-[80px] p-2 rounded-lg border transition-all",
                                            !date && "bg-slate-50 cursor-not-allowed",
                                            date && "hover:border-brand-blue hover:shadow-sm cursor-pointer",
                                            isCurrentDay && "border-brand-blue bg-blue-50 ring-2 ring-brand-blue/20"
                                        )}
                                    >
                                        {date && (
                                            <div className="flex flex-col h-full">
                                                <span className={cn(
                                                    "text-sm font-medium mb-1",
                                                    isCurrentDay ? "text-brand-blue" : "text-slate-700"
                                                )}>
                                                    {language === 'ne' ? toNepaliNumerals(bsDay!) : bsDay}
                                                </span>

                                                {/* Event indicators */}
                                                <div className="flex-1 space-y-1">
                                                    {dayEvents.slice(0, 2).map(event => (
                                                        <div
                                                            key={event.id}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onEventClick?.(event);
                                                            }}
                                                            className={cn(
                                                                "text-[10px] px-1 py-0.5 rounded truncate",
                                                                event.is_live
                                                                    ? "bg-red-100 text-red-700 font-medium"
                                                                    : "bg-slate-100 text-slate-600"
                                                            )}
                                                        >
                                                            {event.is_live && '🔴 '}
                                                            {event.title}
                                                        </div>
                                                    ))}
                                                    {dayEvents.length > 2 && (
                                                        <div className="text-[10px] text-slate-500">
                                                            +{dayEvents.length - 2} {t('थप', 'more')}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Week and Day views - Placeholder for now */}
                {viewMode === 'week' && (
                    <div className="text-center py-8 text-slate-500">
                        {t('हप्ता दृश्य चाँडै आउँदैछ', 'Week view coming soon')}
                    </div>
                )}

                {viewMode === 'day' && (
                    <div className="text-center py-8 text-slate-500">
                        {t('दिन दृश्य चाँडै आउँदैछ', 'Day view coming soon')}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
