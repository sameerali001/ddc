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
        primary: {
          DEFAULT: "#0B132B", // Deep Luxury Navy
          light: "#1C2541",
          dark: "#050914",
        },
        secondary: {
          DEFAULT: "#4B6F44", // Cadet Olive Green
          light: "#608F56",
          dark: "#354E30",
        },
        accent: {
          DEFAULT: "#D4AF37", // Officer Gold
          light: "#E5C158",
          dark: "#AA861E",
        },
        background: {
          DEFAULT: "#FFFFFF",
          offset: "#F8F9FA",
          dark: "#0B132B",
        },
        text: {
          primary: "#0B132B",
          secondary: "#4A5568",
          light: "#FFFFFF",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        }
      }
    },
  },
  plugins: [],
};

export default config;
