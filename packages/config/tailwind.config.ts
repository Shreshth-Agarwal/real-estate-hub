import type { Config } from "tailwindcss";

// Shared Tailwind configuration for Hub4Estate monorepo
const config: Config = {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        // Royal Theme Colors
        "royal-beige": "#F6F1E6",
        "royal-black": "#0B0B0B",
        "royal-white": "#FFFFFF",
        "royal-gold": "#B8860B",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        sketch: "sketch-draw 2s ease-in-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "sketch-draw": {
          to: { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;