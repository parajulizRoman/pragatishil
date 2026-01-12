"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import EyeLoadingAnimation from "@/components/EyeLoadingAnimation";

// Dynamically import ChannelListingPage
const ChannelListingPage = dynamic(() => import("./ChannelListingPage"), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black flex flex-col items-center justify-center">
            <EyeLoadingAnimation />
        </div>
    ),
});

export default function CommunePage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black flex flex-col items-center justify-center">
                    <EyeLoadingAnimation />
                </div>
            }
        >
            <ChannelListingPage />
        </Suspense>
    );
}
