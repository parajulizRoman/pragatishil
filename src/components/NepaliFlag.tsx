import React from "react";
import { motion } from "framer-motion";

export default function NepaliFlag() {
    return (
        <div className="relative w-32 h-40">
            {/* Flag SVG with wave animation */}
            <svg
                viewBox="0 0 100 130"
                className="w-full h-full"
                style={{
                    filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
                }}
            >
                {/* Upper Triangle - Crimson */}
                <motion.path
                    d="M 10 10 L 90 50 L 10 70 Z"
                    fill="#DC143C"
                    stroke="#003893"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Lower Triangle - Crimson */}
                <motion.path
                    d="M 10 70 L 90 95 L 10 120 Z"
                    fill="#DC143C"
                    stroke="#003893"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
                />

                {/* Moon - White */}
                <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                >
                    <circle cx="35" cy="45" r="8" fill="white" />
                    <circle cx="38" cy="43" r="7" fill="#DC143C" />
                </motion.g>

                {/* Sun - White */}
                <motion.g
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: 360
                    }}
                    transition={{
                        duration: 0.8,
                        delay: 1.3,
                        rotate: {
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                        }
                    }}
                >
                    {/* Sun rays */}
                    {[...Array(12)].map((_, i) => {
                        const angle = (i * 30 * Math.PI) / 180;
                        const x1 = 35 + Math.cos(angle) * 6;
                        const y1 = 95 + Math.sin(angle) * 6;
                        const x2 = 35 + Math.cos(angle) * 10;
                        const y2 = 95 + Math.sin(angle) * 10;
                        return (
                            <line
                                key={i}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="white"
                                strokeWidth="1.5"
                            />
                        );
                    })}
                    <circle cx="35" cy="95" r="5" fill="white" />
                </motion.g>
            </svg>

            {/* Wave effect overlay */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{ mixBlendMode: "overlay" }}
            />
        </div>
    );
}
