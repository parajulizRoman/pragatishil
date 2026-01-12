import React from "react";
import { motion } from "framer-motion";

interface FlagVariationProps {
    channelId: string;
    className?: string;
}

// Generate a deterministic variation based on channel ID
function getVariationIndex(channelId: string): number {
    let hash = 0;
    for (let i = 0; i < channelId.length; i++) {
        hash = ((hash << 5) - hash) + channelId.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash) % 6;
}

export default function FlagVariation({ channelId, className = "" }: FlagVariationProps) {
    const variation = getVariationIndex(channelId);

    const variations = [
        // Variation 0: Classic crimson and blue
        {
            bg: "from-red-600 to-blue-600",
            upper: "#DC143C",
            lower: "#DC143C",
            border: "#003893",
        },
        // Variation 1: Blue to red gradient
        {
            bg: "from-blue-600 to-red-600",
            upper: "#003893",
            lower: "#DC143C",
            border: "#DC143C",
        },
        // Variation 2: Lighter crimson
        {
            bg: "from-red-500 to-blue-700",
            upper: "#E63946",
            lower: "#E63946",
            border: "#1D3557",
        },
        // Variation 3: Deep blue accent
        {
            bg: "from-red-700 to-blue-800",
            upper: "#B91C1C",
            lower: "#B91C1C",
            border: "#1E3A8A",
        },
        // Variation 4: Vibrant mix
        {
            bg: "from-rose-600 to-indigo-600",
            upper: "#E11D48",
            lower: "#E11D48",
            border: "#4F46E5",
        },
        // Variation 5: Royal colors
        {
            bg: "from-red-600 to-blue-900",
            upper: "#DC2626",
            lower: "#DC2626",
            border: "#1E40AF",
        },
    ];

    const config = variations[variation];

    return (
        <div className={`relative w-full h-full bg-gradient-to-br ${config.bg} ${className}`}>
            <svg
                viewBox="0 0 100 130"
                className="w-full h-full opacity-90"
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Upper Triangle */}
                <motion.path
                    d="M 10 10 L 90 50 L 10 70 Z"
                    fill={config.upper}
                    stroke={config.border}
                    strokeWidth="1.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                />

                {/* Lower Triangle */}
                <motion.path
                    d="M 10 70 L 90 95 L 10 120 Z"
                    fill={config.lower}
                    stroke={config.border}
                    strokeWidth="1.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                />

                {/* Moon */}
                <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <circle cx="35" cy="45" r="6" fill="white" opacity="0.9" />
                    <circle cx="37" cy="43" r="5" fill={config.upper} />
                </motion.g>

                {/* Sun */}
                <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                >
                    {/* Sun rays */}
                    {[...Array(12)].map((_, i) => {
                        const angle = (i * 30 * Math.PI) / 180;
                        const x1 = 35 + Math.cos(angle) * 5;
                        const y1 = 95 + Math.sin(angle) * 5;
                        const x2 = 35 + Math.cos(angle) * 8;
                        const y2 = 95 + Math.sin(angle) * 8;
                        return (
                            <line
                                key={i}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="white"
                                strokeWidth="1"
                                opacity="0.9"
                            />
                        );
                    })}
                    <circle cx="35" cy="95" r="4" fill="white" opacity="0.9" />
                </motion.g>
            </svg>

            {/* Subtle overlay pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        </div>
    );
}
