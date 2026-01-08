"use client";

import React from "react";

/**
 * Custom layout for Khulla Munch feed page.
 * This layout intentionally bypasses the regular commune sidebar layout
 * to allow full-screen immersive TikTok-style feed experience.
 */
export default function KhullaMunchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 bg-black overflow-hidden">
            {children}
        </div>
    );
}
