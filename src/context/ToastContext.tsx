"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { AlertTriangle, CheckCircle, Info, X, Wrench } from "lucide-react";
import Link from "next/link";

type ToastType = "error" | "success" | "info" | "warning";

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    showSupportLink?: boolean;
}

interface ToastContextType {
    showToast: (type: ToastType, title: string, message?: string, showSupportLink?: boolean) => void;
    showError: (title: string, message?: string) => void;
    showSuccess: (title: string, message?: string) => void;
    showInfo: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const SUPPORT_CHANNEL_ID = "45dc76fa-7690-4752-824e-f85f959063cd";

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (type: ToastType, title: string, message?: string, showSupportLink: boolean = type === "error") => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, type, title, message, showSupportLink }]);

        // Auto-dismiss after 8 seconds (longer for errors)
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, type === "error" ? 10000 : 5000);
    };

    const showError = (title: string, message?: string) => showToast("error", title, message, true);
    const showSuccess = (title: string, message?: string) => showToast("success", title, message, false);
    const showInfo = (title: string, message?: string) => showToast("info", title, message, false);

    const dismissToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const getIcon = (type: ToastType) => {
        switch (type) {
            case "error":
                return <AlertTriangle className="w-6 h-6 text-red-600" />;
            case "success":
                return <CheckCircle className="w-6 h-6 text-green-600" />;
            case "warning":
                return <AlertTriangle className="w-6 h-6 text-amber-600" />;
            default:
                return <Info className="w-6 h-6 text-blue-600" />;
        }
    };

    const getBorderColor = (type: ToastType) => {
        switch (type) {
            case "error":
                return "border-l-red-500";
            case "success":
                return "border-l-green-500";
            case "warning":
                return "border-l-amber-500";
            default:
                return "border-l-blue-500";
        }
    };

    return (
        <ToastContext.Provider value={{ showToast, showError, showSuccess, showInfo }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 max-w-md w-full pointer-events-none px-4">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`
                            pointer-events-auto rounded-lg border border-slate-200 border-l-4 ${getBorderColor(toast.type)}
                            bg-white p-5 shadow-xl animate-in slide-in-from-right-5 fade-in duration-300
                        `}
                    >
                        <div className="flex items-start gap-4">
                            <div className="shrink-0 mt-0.5">
                                {getIcon(toast.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-900 text-base">
                                    {toast.title}
                                </p>
                                {toast.message && (
                                    <p className="text-slate-700 text-sm mt-2 leading-relaxed break-words">
                                        {toast.message}
                                    </p>
                                )}
                                {toast.showSupportLink && (
                                    <Link
                                        href={`/commune/${SUPPORT_CHANNEL_ID}`}
                                        className="inline-flex items-center gap-2 mt-4 px-3 py-2 text-sm font-semibold text-white bg-brand-blue hover:bg-brand-red rounded-lg transition-colors shadow-sm"
                                    >
                                        <Wrench className="w-4 h-4" />
                                        यान्त्रिकलाई भन्नुहोस्
                                    </Link>
                                )}
                            </div>
                            <button
                                onClick={() => dismissToast(toast.id)}
                                className="shrink-0 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
