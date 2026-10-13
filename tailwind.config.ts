import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        atelier: {
          bg: "#060A12",
          surface: "#0B1324",
          elevated: "#111C35",
          card: "#0E172C",
          text: "#F0F6FC",
          muted: "#8A9BB2",
          border: "rgba(56, 189, 248, 0.12)",
          accent: "#00E5FF",
          accentHover: "#38EFFF",
          success: "#00F5A0",
        },
        obsidian: {
          950: "#040711",
          900: "#060A12",
          850: "#0B1324",
          800: "#111C35",
        },
        sapphire: {
          950: "#040711",
          900: "#060A12",
          850: "#0B1324",
          800: "#111C35",
          700: "#1A2B4E",
          600: "#1E3A6B",
          500: "#0284C7",
          400: "#38BDF8",
        },
        cyan: {
          ice: "#00E5FF",
          glow: "#38EFFF",
          deep: "#00B4D8",
          dim: "rgba(0, 229, 255, 0.14)",
        },
        amber: {
          glow: "#00E5FF",
          deep: "#00B4D8",
          dim: "rgba(0, 229, 255, 0.14)",
        },
        titanium: {
          100: "#F0F6FC",
          200: "#CBD5E1",
          300: "#94A3B8",
          400: "#64748B",
          500: "#475569",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "SF Mono", "Fira Code", "monospace"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.02em",
        widest: "0.15em",
        ultra: "0.25em",
      },
    },
  },
  plugins: [],
};
export default config;
