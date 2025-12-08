"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export const LanguageSwitcher = ({ className = "" }: { className?: string }) => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className={`flex items-center justify-center p-2 rounded-full hover:bg-slate-100 transition-colors ${className}`}
            title={language === 'en' ? "Switch to Nepali" : "Switch to English"}
            aria-label="Toggle Language"
        >
            <span className="text-2xl leading-none">
                {language === 'en' ? '🇳🇵' : '🌍'}
            </span>
        </button>
    );
};
