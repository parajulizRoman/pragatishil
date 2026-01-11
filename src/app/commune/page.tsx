"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// Dynamically import FeedPage to avoid SSR issues with framer-motion
const FeedPage = dynamic(() => import("./feed/FeedPage"), {
    ssr: false,
    loading: () => (
        <div className="fixed inset-0 bg-black flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-white" />
        </div>
    ),
});

export default function CommunePage() {
    return (
        <Suspense
            fallback={
                <div className="fixed inset-0 bg-black flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-white" />
                </div>
            }
        >
            <FeedPage />
        </Suspense>
    );
}
