import type { Config } from "tailwindcss";

// Colors/radius pulled straight from docs/FRONTEND_BRIEF.md's Design Language
// section — keep this in sync if the brief changes rather than hardcoding
// hex values in components.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FAFAFA",
        card: "#FFFFFF",
        "text-primary": "#111111",
        "text-secondary": "#6B7280",
        "arc-blue": "#2563EB",
      },
      borderRadius: {
        card: "20px",
        control: "16px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 12px rgba(0, 0, 0, 0.06)",
        "soft-lg": "0 8px 30px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
