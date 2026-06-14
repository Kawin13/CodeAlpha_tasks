/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Cabinet Grotesk'", "Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        surface: {
          DEFAULT: "var(--surface)",
          raised: "var(--surface-raised)",
          overlay: "var(--surface-overlay)",
        },
      },
      backgroundImage: {
        "grid-white": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M40 0v40M0 0h40' stroke='%23ffffff08' stroke-width='1'/%3E%3C/svg%3E\")",
        "grid-dark":  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M40 0v40M0 0h40' stroke='%2300000012' stroke-width='1'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        "fade-up":   { "0%": { opacity: 0, transform: "translateY(12px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        "fade-in":   { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        shimmer:     { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        "spin-slow": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
        float:       { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        pulse2:      { "0%,100%": { opacity: 0.4 }, "50%": { opacity: 1 } },
      },
      animation: {
        "fade-up":   "fade-up 0.4s ease-out both",
        "fade-in":   "fade-in 0.3s ease-out both",
        shimmer:     "shimmer 1.8s linear infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        float:       "float 3s ease-in-out infinite",
        pulse2:      "pulse2 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
