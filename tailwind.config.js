/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  safelist: [
    "bg-dark-iron",
    "bg-black",
    "border-border-color",
    "text-ash",
    "text-smoke",
    "text-white",
    "text-gold",
    "bg-charcoal",
    "bg-header-bg",
    "border-gold/50",
    "border-gold/20",
    "bg-gold/10",
    "bg-gold/5",
    "hover:border-gold/50",
    "hover:border-gold/30",
    "hover:text-gold",
    "group-hover:text-gold",
    "group-hover:border-gold/50",
    "group-hover:border-gold/30",
    "bg-iron",
  ],
  theme: {
    extend: {
      colors: {
        black: "var(--black)",
        gold: "var(--gold)",
        "dark-gold": "var(--dark-gold)",
        "gold-text": "var(--gold-text)",
        charcoal: "var(--charcoal)",
        "dark-iron": "var(--dark-iron)",
        "border-color": "var(--border-color)",
        "ghost-border": "var(--ghost-border)",
        "ghost-hover-bg": "var(--ghost-hover-bg)",
        "table-hover-bg": "var(--table-hover-bg)",
        "dropzone-bg": "var(--dropzone-bg)",
        "header-bg": "var(--header-bg)",
        white: "var(--white)",
        smoke: "var(--smoke)",
        ash: "var(--ash)",
        steel: "var(--steel)",
        iron: "var(--iron)",
      },
      fontFamily: {
        display: ['Outfit', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        brand: ['Unbounded', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Space Grotesk', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        container: "1200px",
      },
      keyframes: {
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.3s ease",
      },
    },
  },
  plugins: [],
};


