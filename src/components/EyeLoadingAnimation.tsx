import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function EyeLoadingAnimation() {
    return (
        <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Favicon with pulse animation */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: 1,
                    scale: [0.8, 1, 0.8],
                }}
                transition={{
                    opacity: { duration: 0.5 },
                    scale: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                }}
            >
                <Image
                    src="/favicon.png"
                    alt="Loading"
                    width={160}
                    height={160}
                    className="object-contain"
                />
            </motion.div>

            {/* Loading text */}
            <motion.p
                className="absolute -bottom-8 text-slate-600 dark:text-slate-400 text-sm font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                }}
            >
                Loading...
            </motion.p>
        </div>
    );
}
