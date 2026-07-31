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
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#eef5ff",
          100: "#d9e9ff",
          200: "#bcd8ff",
          300: "#8ebfff",
          400: "#589cff",
          500: "#2f78f5",
          600: "#1c5ce0",
          700: "#1748b5",
          800: "#173e8f",
          900: "#152f5e",
        },
        accent: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
        ink: {
          900: "#0b1220",
          800: "#111a2e",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
