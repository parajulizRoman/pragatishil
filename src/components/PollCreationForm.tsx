"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, Calendar, Settings2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/context/LanguageContext";
import { Label } from "@/components/ui/label";

export interface PollData {
    question: string;
    options: string[];
    allow_multiple: boolean;
    expires_at: string | null;
}

interface PollCreationFormProps {
    onChange: (data: PollData | null) => void;
}

export default function PollCreationForm({ onChange }: PollCreationFormProps) {
    const { t } = useLanguage();
    const [isActive, setIsActive] = useState(false);

    // Form State
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState<string[]>(["", ""]);
    const [allowMultiple, setAllowMultiple] = useState(false);
    const [expiresDays, setExpiresDays] = useState<string>("7"); // Default 7 days

    useEffect(() => {
        if (!isActive) {
            onChange(null);
            return;
        }

        // Validate: Need question and at least 2 non-empty options
        const validOptions = options.filter(o => o.trim().length > 0);
        if (!question.trim() || validOptions.length < 2) {
            onChange(null);
            // We pass null if invalid so parent knows not to submit poll data yet, 
            // OR we could pass the partial data and let parent validate.
            // Better: passing null implies "no valid poll to submit". 
            // But user might be typing. Let's pass the object but parent handles validation before "Create".
            return;
        }

        // Calculate Access Date
        let expiresAt: Date | null = null;
        if (expiresDays !== "never") {
            const date = new Date();
            date.setDate(date.getDate() + parseInt(expiresDays));
            expiresAt = date;
        }

        onChange({
            question: question.trim(),
            options: validOptions,
            allow_multiple: allowMultiple,
            expires_at: expiresAt ? expiresAt.toISOString() : null
        });
    }, [isActive, question, options, allowMultiple, expiresDays, onChange]);

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        if (options.length >= 10) return;
        setOptions([...options, ""]);
    };

    const removeOption = (index: number) => {
        if (options.length <= 2) return;
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    if (!isActive) {
        return (
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsActive(true)}
                className="gap-2 text-slate-600 border-slate-300 hover:bg-slate-50"
            >
                <HelpCircle className="w-4 h-4" />
                {t("पोल सिर्जना गर्नुहोस्", "Create Poll")}
            </Button>
        );
    }

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                    <Settings2 className="w-4 h-4" />
                    {t("पोल सेटिङहरू", "Poll Settings")}
                </h3>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsActive(false)}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <div className="space-y-4">
                {/* Question */}
                <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-600 uppercase">{t("प्रश्न", "Question")}</Label>
                    <Input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder={t("तपाइँ के सोध्न चाहनुहुन्छ?", "What would you like to ask?")}
                        maxLength={150}
                        className="bg-white"
                    />
                </div>

                {/* Options */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-600 uppercase">{t("विकल्पहरू", "Options")}</Label>
                    {options.map((opt, idx) => (
                        <div key={idx} className="flex gap-2">
                            <Input
                                value={opt}
                                onChange={(e) => handleOptionChange(idx, e.target.value)}
                                placeholder={`${t("विकल्प", "Option")} ${idx + 1}`}
                                className="bg-white"
                            />
                            {options.length > 2 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeOption(idx)}
                                    className="text-slate-400 hover:text-red-500 shrink-0"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                    {options.length < 10 && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addOption}
                            className="w-full border-dashed text-slate-500 hover:text-brand-blue hover:border-brand-blue/50"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {t("विकल्प थप्नुहोस्", "Add Option")}
                        </Button>
                    )}
                </div>

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center justify-between bg-white p-3 rounded border border-slate-200">
                        <Label className="cursor-pointer flex-1" htmlFor="allow-multiple">
                            {t("बहु-छनोट अनुमति दिनुहोस्", "Allow Multiple Votes")}
                        </Label>
                        <Switch
                            id="allow-multiple"
                            checked={allowMultiple}
                            onCheckedChange={setAllowMultiple}
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-white p-3 rounded border border-slate-200">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <Label className="whitespace-nowrap">{t("समाप्ति अवधि", "Duration")}:</Label>
                        <select
                            className="bg-transparent border-none focus:ring-0 text-sm font-medium text-brand-navy cursor-pointer"
                            value={expiresDays}
                            onChange={(e) => setExpiresDays(e.target.value)}
                        >
                            <option value="1">1 {t("दिन", "Day")}</option>
                            <option value="3">3 {t("दिन", "Days")}</option>
                            <option value="7">1 {t("हप्ता", "Week")}</option>
                            <option value="14">2 {t("हप्ता", "Weeks")}</option>
                            <option value="30">1 {t("महिना", "Month")}</option>
                            {/* <option value="never">{t("कहिल्यै", "Never")}</option> */}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
