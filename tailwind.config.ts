import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        background: "#0b0f1a",
        accent: {
          DEFAULT: "#7c3aed",
          neon: "#8b5cf6",
          glow: "#22d3ee"
        }
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        mono: ["JetBrains Mono", ...fontFamily.mono]
      },
      backgroundImage: {
        "stars": "radial-gradient(circle at 20% 20%, rgba(124,58,237,0.15), transparent 60%), radial-gradient(circle at 80% 30%, rgba(14,165,233,0.2), transparent 55%)"
      },
      boxShadow: {
        glow: "0 0 20px rgba(124,58,237,0.45)",
        "inner-glow": "inset 0 0 15px rgba(14,165,233,0.25)"
      }
    }
  },
  plugins: []
};

export default config;
