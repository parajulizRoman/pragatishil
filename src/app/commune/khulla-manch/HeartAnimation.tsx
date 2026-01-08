"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeartAnimationProps {
    show: boolean;
    onComplete: () => void;
}

export default function HeartAnimation({ show, onComplete }: HeartAnimationProps) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onAnimationComplete={onComplete}
                >
                    <motion.svg
                        viewBox="0 0 24 24"
                        className="w-32 h-32 text-white drop-shadow-2xl"
                        fill="currentColor"
                        initial={{ scale: 0, rotate: -15 }}
                        animate={{
                            scale: [0, 1.3, 1],
                            rotate: [-15, 5, 0],
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                            duration: 0.5,
                            ease: "easeOut",
                        }}
                    >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </motion.svg>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
