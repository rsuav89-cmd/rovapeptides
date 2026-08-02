import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── RovaPeptides brand system: Obsidian black + Pure Copper ──
        // Backgrounds (deep black + obsidian tones)
        paper: "#000000", // page background — deep black
        "paper-2": "#0D0D11", // elevated obsidian surfaces / cards
        "paper-3": "#15151B", // higher elevation (inputs, chips)
        // Text & structure (crisp white + muted silver)
        ink: "#FFFFFF", // primary headings / high-contrast text
        "ink-2": "#B7B7C0", // secondary text / silver
        muted: "#7C7C86", // subtext / captions
        line: "rgba(255,255,255,0.10)", // hairlines / secondary borders
        "line-strong": "rgba(255,255,255,0.20)",
        // Copper — the single accent (CTAs, active states, borders, badges)
        brand: {
          DEFAULT: "#B76E59", // Pure Copper — accents, borders, large text (all pass AA)
          cta: "#A85E49", // deeper copper for text-bearing fills → white text hits AA 4.5 (4.81:1)
          deep: "#0A0A0D", // obsidian dark surface (notice bar / footer)
          soft: "#CE8A74", // lighter copper (hover / glow / copper text on dark)
        },
        // `signal` kept as an alias so existing accent classes map to copper
        signal: {
          DEFAULT: "#B76E59",
          ink: "#CE8A74", // copper text/icons on black
        },
        copper: {
          DEFAULT: "#B76E59",
          soft: "#CE8A74",
          light: "#E3AA96",
          muted: "#A86957", // copper that hits AA on warm-light surfaces
          deep: "#8E5342",
        },
        // ── Mixed-surface visual system (warm light + neutral tones) ──────────
        // Warm darks (for strategic dark sections that aren't pure black)
        graphite: "#151515",
        charcoal: "#222220",
        slate: "#343330",
        // Warm lights & neutrals (editorial / product / catalog surfaces)
        ivory: "#F3EFE8",
        bone: "#E7E0D6",
        sand: "#D4C9BB",
        stone: "#B4AA9E",
        mushroom: "#8C857B",
        bronze: "#805346",
        clay: "#B77B68",
        // Text on warm-light surfaces
        "ink-dark": "#171614", // primary text/headings on light
        "ink-dark-2": "#4A453F", // secondary text on light
        "muted-dark": "#6C665E", // muted captions on light (AA on ivory/bone)
        gold: "#C6A15B", // reserved for warnings only
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"], // Syncopate
        sans: ["var(--font-sans)", "system-ui", "sans-serif"], // Montserrat
        // data/spec voice also uses Montserrat per brand (no monospace face)
        mono: ["var(--font-sans)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Tuned for Syncopate (wide, uppercase) — smaller than a neo-grotesque scale
        "display-xl": ["clamp(2rem, 4.6vw, 3.75rem)", { lineHeight: "1.08", letterSpacing: "0.01em" }],
        "display-lg": ["clamp(1.65rem, 3.6vw, 2.9rem)", { lineHeight: "1.12", letterSpacing: "0.01em" }],
        "display-md": ["clamp(1.3rem, 2.6vw, 2rem)", { lineHeight: "1.16", letterSpacing: "0.02em" }],
        label: ["0.68rem", { lineHeight: "1", letterSpacing: "0.22em" }],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.5), 0 12px 34px -14px rgba(0,0,0,0.75)",
        lift: "0 10px 24px -8px rgba(0,0,0,0.6), 0 30px 70px -24px rgba(0,0,0,0.85)",
        // Soft neutral shadow for light cards on warm surfaces
        "card-light": "0 1px 2px rgba(23,22,20,0.06), 0 14px 34px -18px rgba(23,22,20,0.28)",
        "lift-light": "0 16px 40px -20px rgba(23,22,20,0.34)",
        drawer: "-24px 0 60px -20px rgba(0,0,0,0.75)",
        copper: "0 8px 26px -10px rgba(183,110,89,0.55)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "spring-soft": "cubic-bezier(0.34, 1.3, 0.5, 1)",
        "in-out-quart": "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      transitionDuration: {
        "160": "160ms",
        "220": "220ms",
        "280": "280ms",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "badge-pop": {
          "0%": { transform: "scale(0.4)", opacity: "0.4" },
          "60%": { transform: "scale(1.18)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        "fade-up": "fade-up 0.28s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
