/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        main: "rgba(10, 12, 28, 1)",
        glass: "rgba(255, 255, 255, 0.06)",
        "glass-strong": "rgba(255, 255, 255, 0.1)",
        "glass-border": "rgba(255, 255, 255, 0.12)",
        primary: "rgba(124, 92, 255, 1)",
        "primary-soft": "rgba(124, 92, 255, 0.18)",
        income: "rgba(34, 211, 160, 1)",
        "income-soft": "rgba(34, 211, 160, 0.15)",
        expense: "rgba(255, 82, 120, 1)",
        "expense-soft": "rgba(255, 82, 120, 0.15)",
        balance: "rgba(56, 189, 248, 1)",
        "balance-soft": "rgba(56, 189, 248, 0.15)",
        ink: "rgba(255, 255, 255, 0.92)",
        muted: "rgba(255, 255, 255, 0.55)",
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 8px 32px rgba(124, 92, 255, 0.25)",
        "glow-income": "0 8px 32px rgba(34, 211, 160, 0.25)",
        "glow-expense": "0 8px 32px rgba(255, 82, 120, 0.25)",
        "glow-balance": "0 8px 32px rgba(56, 189, 248, 0.25)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(40px, -30px) scale(1.1)" },
          "66%": { transform: "translate(-30px, 30px) scale(0.95)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        float: "float 18s ease-in-out infinite",
        "float-slow": "float 26s ease-in-out infinite reverse",
        bob: "bob 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
