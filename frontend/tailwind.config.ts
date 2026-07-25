import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Pure institutional minimalist palette
        background: "#FAFAFA",
        card: "#FFFFFF",
        "text-primary": "#111111",
        "text-secondary": "#6B7280",
        
        // Exact Arc Network Brand Accents
        "arc-blue": {
          DEFAULT: "#0052FF", // Stablecoin native blue
          hover: "#0045D8",
          light: "#E6EFFF",
        },
        border: {
          DEFAULT: "rgba(17, 17, 17, 0.08)", // Sharp, subtle borders
          strong: "rgba(17, 17, 17, 0.15)",
        }
      },
      borderRadius: {
        card: "20px",
        control: "12px",
      },
      boxShadow: {
        // Soft, flat shadows only — no heavy neon glows
        soft: "0 2px 8px -1px rgba(0, 0, 0, 0.04), 0 1px 3px -1px rgba(0, 0, 0, 0.02)",
        "soft-lg": "0 12px 24px -4px rgba(0, 0, 0, 0.04), 0 4px 12px -2px rgba(0, 0, 0, 0.02)",
      },
      fontFamily: {
        sans: ["Geist", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
