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
        muted: "#8A8A94", // subtext / captions
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
          muted: "#8A4F3E", // copper that hits AA on warm-light surfaces
          deep: "#8E5342",
        },
        // ── Mixed-surface visual system (warm light + neutral tones) ──────────
        // Warm darks (for strategic dark sections that aren't pure black)
        graphite: "#151515",
        charcoal: "#222220",
        slate: "#343330",
        // Warm lights & neutrals (editorial / product / catalog surfaces)
        ivory: "#F3EFE8",
        // Card tone that is LIGHTER than its warm ground, so elevation reads.
        chalk: "#FBF8F3",
        bone: "#E7E0D6",
        sand: "#D4C9BB",
        stone: "#B4AA9E",
        mushroom: "#8C857B",
        bronze: "#805346",
        clay: "#B77B68",
        // Text on warm-light surfaces
        "ink-dark": "#171614", // primary text/headings on light
        "ink-dark-2": "#4A453F", // secondary text on light
        "muted-dark": "#575249", // muted captions on light (AA on ivory/bone)
        gold: "#C6A15B", // reserved for warnings only
        // Verification semantics ONLY — never a CTA. Frees copper to mean "buy".
        assay: { DEFAULT: "#93A9A2", deep: "#46605A" },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"], // Syncopate
        sans: ["var(--font-sans)", "system-ui", "sans-serif"], // Montserrat
        // data/spec voice also uses Montserrat per brand (no monospace face)
        mono: ["var(--font-sans)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Syncopate is wide and uppercase: tracking ramps NEGATIVE as size grows,
        // and weight is baked in so it can never drift per-file.
        "display-xl": ["clamp(2.25rem, 5.2vw, 3.9rem)", { lineHeight: "1.02", letterSpacing: "-0.02em", fontWeight: "400" }],
        "display-lg": ["clamp(1.9rem, 4.2vw, 3rem)", { lineHeight: "1.06", letterSpacing: "-0.015em", fontWeight: "400" }],
        "display-md": ["clamp(1.6rem, 3.2vw, 2.4rem)", { lineHeight: "1.10", letterSpacing: "-0.01em", fontWeight: "400" }],
        // The missing rung between section headings and body: card + panel titles.
        "display-sm": ["clamp(1.2rem, 2vw, 1.5rem)", { lineHeight: "1.18", letterSpacing: "0", fontWeight: "700" }],
        // Numerals only — trust statistics sit ABOVE section headings on purpose.
        stat: ["clamp(2.4rem, 4.4vw, 3.4rem)", { lineHeight: "0.92", letterSpacing: "-0.03em", fontWeight: "700" }],
        label: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.18em", fontWeight: "600" }],
        "label-sm": ["0.625rem", { lineHeight: "1", letterSpacing: "0.15em", fontWeight: "600" }],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        // ── Light surfaces: warm shadow colour, three physical layers ────────
        "e-1": "0 1px 1px -0.5px rgba(35,28,22,0.07), 0 2px 4px -1px rgba(35,28,22,0.06)",
        "e-2": "0 1px 1px -0.5px rgba(35,28,22,0.06), 0 3px 6px -1.5px rgba(35,28,22,0.07), 0 8px 16px -4px rgba(35,28,22,0.07)",
        "e-3": "0 1px 1px -0.5px rgba(35,28,22,0.06), 0 4px 9px -2px rgba(35,28,22,0.08), 0 14px 28px -7px rgba(35,28,22,0.10)",
        "e-4": "0 1px 2px -0.5px rgba(35,28,22,0.06), 0 6px 13px -3px rgba(35,28,22,0.09), 0 24px 48px -12px rgba(35,28,22,0.13)",
        "e-5": "0 2px 4px -1px rgba(35,28,22,0.07), 0 12px 24px -6px rgba(35,28,22,0.11), 0 44px 84px -22px rgba(35,28,22,0.20)",
        // ── Dark surfaces: a drop shadow renders nothing on #000, so elevation
        //    is a top rim-light, a hairline ring, and a copper bloom above d-2.
        "d-1": "inset 0 1px 0 rgba(255,255,255,0.055), 0 0 0 1px rgba(255,255,255,0.035)",
        "d-2": "inset 0 1px 0 rgba(255,255,255,0.075), 0 0 0 1px rgba(255,255,255,0.05), 0 10px 24px -10px rgba(0,0,0,0.9)",
        "d-3": "inset 0 1px 0 rgba(255,255,255,0.095), 0 0 0 1px rgba(255,255,255,0.07), 0 20px 44px -18px rgba(0,0,0,0.95), 0 0 64px -22px rgba(183,110,89,0.26)",
        "d-4": "inset 0 1px 0 rgba(255,255,255,0.12), 0 0 0 1px rgba(255,255,255,0.09), 0 36px 78px -26px rgba(0,0,0,1), 0 0 96px -30px rgba(183,110,89,0.34)",
        // ── State ───────────────────────────────────────────────────────────
        press: "inset 0 2px 5px -1px rgba(35,28,22,0.18)",
        "press-dark": "inset 0 2px 6px -1px rgba(0,0,0,0.85)",
        copper: "0 6px 18px -6px rgba(183,110,89,0.45), 0 0 0 1px rgba(183,110,89,0.30)",
        "copper-lg": "0 10px 30px -8px rgba(183,110,89,0.55), 0 0 0 1px rgba(183,110,89,0.40), 0 0 48px -14px rgba(183,110,89,0.40)",
        drawer: "-1px 0 0 0 rgba(255,255,255,0.08), -30px 0 70px -24px rgba(0,0,0,0.85)",
        // Legacy aliases — kept so existing usages keep compiling.
        card: "inset 0 1px 0 rgba(255,255,255,0.075), 0 0 0 1px rgba(255,255,255,0.05), 0 10px 24px -10px rgba(0,0,0,0.9)",
        lift: "inset 0 1px 0 rgba(255,255,255,0.095), 0 0 0 1px rgba(255,255,255,0.07), 0 20px 44px -18px rgba(0,0,0,0.95), 0 0 64px -22px rgba(183,110,89,0.26)",
        "card-light": "0 1px 1px -0.5px rgba(35,28,22,0.06), 0 3px 6px -1.5px rgba(35,28,22,0.07), 0 8px 16px -4px rgba(35,28,22,0.07)",
        "lift-light": "0 1px 1px -0.5px rgba(35,28,22,0.06), 0 4px 9px -2px rgba(35,28,22,0.08), 0 14px 28px -7px rgba(35,28,22,0.10)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "spring-soft": "cubic-bezier(0.34, 1.3, 0.5, 1)",
        "in-out-quart": "cubic-bezier(0.76, 0, 0.24, 1)",
        "spring-out": "cubic-bezier(0.22, 1.35, 0.36, 1)",
        "ease-snap": "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      transitionDuration: {
        "120": "120ms",
        "160": "160ms",
        "200": "200ms",
        "320": "320ms",
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
        "reveal-blur": {
          "0%": { opacity: "0", transform: "translate3d(0,10px,0) scale(0.985)" },
          "100%": { opacity: "1", transform: "translate3d(0,0,0) scale(1)" },
        },
        "chip-confirm": {
          "0%": { transform: "scale(1)" },
          "45%": { transform: "scale(0.93)" },
          "100%": { transform: "scale(1)" },
        },
        "pulse-ring": {
          "0%": { opacity: "0.55", transform: "scale(0.85)" },
          "100%": { opacity: "0", transform: "scale(1.7)" },
        },
        sheen: {
          "0%": { transform: "translateX(-120%) skewX(-18deg)" },
          "100%": { transform: "translateX(220%) skewX(-18deg)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        "fade-up": "fade-up 0.28s cubic-bezier(0.16,1,0.3,1) both",
        "reveal-blur": "reveal-blur 320ms cubic-bezier(0.16,1,0.3,1) both",
        "chip-confirm": "chip-confirm 180ms cubic-bezier(0.32,0.72,0,1)",
        "pulse-ring": "pulse-ring 420ms cubic-bezier(0.16,1,0.3,1) forwards",
        sheen: "sheen 520ms cubic-bezier(0.16,1,0.3,1)",
      },
    },
  },
  plugins: [],
};

export default config;
