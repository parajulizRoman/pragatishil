"use client";

import { useState } from "react";
import NepaliDate from "nepali-date-converter";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Label } from "@/components/ui/label";

export default function DateConverterPage() {
    const [mode, setMode] = useState<"AD_BS" | "BS_AD">("AD_BS");

    // AD -> BS State
    const [adDate, setAdDate] = useState("");
    const [bsResult, setBsResult] = useState<string | null>(null);

    // BS -> AD State
    const [bsDate, setBsDate] = useState("");
    const [adResult, setAdResult] = useState<string | null>(null);

    // Handlers
    const convertAdToBs = () => {
        if (!adDate) return;
        try {
            const [y, m, d] = adDate.split('-').map(Number);
            const nd = new NepaliDate(new Date(y, m - 1, d));
            const bsY = nd.getYear();
            const bsM = String(nd.getMonth() + 1).padStart(2, '0');
            const bsD = String(nd.getDate()).padStart(2, '0');

            // Nepali Numerals
            const nepaliNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
            const convertToNepali = (str: string) => str.split('').map(c => /\d/.test(c) ? nepaliNumerals[parseInt(c)] : c).join('');

            const raw = `${bsY}-${bsM}-${bsD}`;
            // Removed unused 'formatted'
            const nepali = `${convertToNepali(String(bsY))} ${nd.format('MMMM')} ${convertToNepali(String(bsD))}, ${nd.format('dddd')}`;

            setBsResult(`${raw} (${nepali})`);
        } catch {
            setBsResult("Invalid Date");
        }
    };

    const convertBsToAd = () => {
        if (!bsDate) return;
        try {
            // Basic validation
            if (!/^\d{4}-\d{2}-\d{2}$/.test(bsDate)) {
                setAdResult("Format must be YYYY-MM-DD (e.g., 2081-05-15)");
                return;
            }

            const [y, m, d] = bsDate.split('-').map(Number);
            const nd = new NepaliDate(y, m - 1, d);
            const jsDate = nd.toJsDate();

            const fullDate = jsDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            setAdResult(fullDate);
        } catch {
            setAdResult("Invalid Nepali Date");
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-brand-navy">Nepali Date Converter</h1>
                    <p className="text-slate-600 max-w-xl mx-auto">
                        Easily convert English dates (AD) to Nepali Bikram Sambat (BS) dates and vice versa. Accurate, free, and simple to use.
                    </p>
                </div>

                {/* Converter Card */}
                <Card className="bg-white shadow-lg border-slate-200">
                    <CardHeader className="pb-4 border-b border-slate-100">
                        <div className="flex items-center justify-center space-x-2">
                            <Calendar className="w-5 h-5 text-brand-blue" />
                            <CardTitle>Date Converter Tool</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                        <div className="w-full">
                            <div className="grid w-full grid-cols-2 mb-8 bg-slate-100 p-1 rounded-xl">
                                <button
                                    onClick={() => setMode("AD_BS")}
                                    className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${mode === "AD_BS" ? "bg-white shadow text-brand-blue" : "text-slate-500 hover:text-slate-700"}`}
                                >
                                    AD to BS (English to Nepali)
                                </button>
                                <button
                                    onClick={() => setMode("BS_AD")}
                                    className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${mode === "BS_AD" ? "bg-white shadow text-brand-blue" : "text-slate-500 hover:text-slate-700"}`}
                                >
                                    BS to AD (Nepali to English)
                                </button>
                            </div>

                            {/* AD -> BS */}
                            {mode === "AD_BS" && (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Select English Date (AD)</Label>
                                            <Input
                                                type="date"
                                                value={adDate}
                                                onChange={(e) => setAdDate(e.target.value)}
                                                className="h-12 text-lg"
                                            />
                                        </div>
                                        <Button
                                            onClick={convertAdToBs}
                                            className="w-full h-12 text-lg bg-brand-blue hover:bg-blue-700"
                                            disabled={!adDate}
                                        >
                                            Convert to Nepali Date
                                        </Button>

                                        {bsResult && (
                                            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 text-center animate-in fade-in zoom-in duration-300">
                                                <p className="text-sm font-medium text-blue-400 uppercase tracking-wider mb-2">Nepali Date (BS)</p>
                                                <div className="text-2xl md:text-3xl font-bold text-brand-navy">
                                                    {bsResult}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* BS -> AD */}
                            {mode === "BS_AD" && (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Enter Nepali Date (BS)</Label>
                                            <Input
                                                placeholder="YYYY-MM-DD (e.g. 2081-01-01)"
                                                value={bsDate}
                                                onChange={(e) => setBsDate(e.target.value)}
                                                className="h-12 text-lg"
                                            />
                                            <p className="text-xs text-slate-400">Format: YYYY-MM-DD</p>
                                        </div>
                                        <Button
                                            onClick={convertBsToAd}
                                            className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700"
                                            disabled={!bsDate}
                                        >
                                            Convert to English Date
                                        </Button>

                                        {adResult && (
                                            <div className="mt-8 p-6 bg-emerald-50 rounded-xl border border-emerald-100 text-center animate-in fade-in zoom-in duration-300">
                                                <p className="text-sm font-medium text-emerald-600 uppercase tracking-wider mb-2">English Date (AD)</p>
                                                <div className="text-2xl md:text-3xl font-bold text-emerald-900">
                                                    {adResult}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* SEO Content / Footer Text */}
                <div className="prose prose-slate max-w-none text-center text-sm text-slate-500">
                    <p>
                        Our Miti Pariwartan tool converts dates between Bikram Sambat (BS) and Gregorian (AD) calendars instantly.
                        Useful for checking official documents, festivals, and events in Nepal.
                    </p>
                </div>
            </div>
        </main>
    );
}
