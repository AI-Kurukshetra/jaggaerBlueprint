import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9ecff",
          200: "#b6dcff",
          300: "#84c4ff",
          400: "#4ba4ff",
          500: "#1a7fff",
          600: "#0f60db",
          700: "#0e4cb1",
          800: "#0f428e",
          900: "#103a75"
        }
      },
      boxShadow: {
        soft: "0 12px 30px rgba(15, 28, 63, 0.08)",
        card: "0 10px 24px rgba(15, 28, 63, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
