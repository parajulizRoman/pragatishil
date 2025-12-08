import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          red: "#E53935",   // Official Pragatishil Red
          blue: "#2563EB",  // Official Loktantrik Blue
          navy: "#0f172a",  // Dark theme base
          white: "#FFFFFF", // Standard White
        },
      },
      backgroundImage: {
        "brand-tricolor": "linear-gradient(135deg, #E53935 0%, #FFFFFF 50%, #2563EB 100%)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
