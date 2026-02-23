export interface LandingTheme {
  mode: "light" | "dark";
  bg: string; bg2: string; bg3: string;
  txt: string; sub: string; mut: string;
  brd: string; card: string;
  glass: string; glassBorder: string;
  accent: string; lime: string;
  shadow: string; shadowHover: string;
  heroOverlay: string; destOverlay: string; fadeBottom: string;
  greenBg: string; greenBrd: string; greenTxt: string; greenSub: string;
  redBg: string; redBrd: string; redTxt: string; redSub: string;
}

export const themes: Record<"light" | "dark", LandingTheme> = {
  light: {
    mode: "light",
    bg: "#f8fafc", bg2: "#ffffff", bg3: "#f1f5f9",
    txt: "#0f172a", sub: "#475569", mut: "#94a3b8",
    brd: "#e2e8f0", card: "#ffffff",
    glass: "rgba(248,250,252,.92)",
    glassBorder: "rgba(0,0,0,.06)",
    accent: "#1CABB0", lime: "#D4F24D",
    shadow: "rgba(0,0,0,.06)",
    shadowHover: "rgba(28,171,176,.15)",
    heroOverlay: "linear-gradient(135deg,rgba(248,250,252,.68),rgba(248,250,252,.3),rgba(248,250,252,.75))",
    destOverlay: "linear-gradient(to top,rgba(15,23,42,.85) 0%,rgba(15,23,42,.15) 50%,transparent 100%)",
    fadeBottom: "linear-gradient(transparent 30%,#f8fafc)",
    greenBg: "#f0fdfa", greenBrd: "#ccfbf1", greenTxt: "#15803d", greenSub: "#166534",
    redBg: "#fef2f2", redBrd: "#fecaca", redTxt: "#dc2626", redSub: "#991b1b",
  },
  dark: {
    mode: "dark",
    bg: "#0c0f1a", bg2: "#141825", bg3: "#1a1f30",
    txt: "#f1f5f9", sub: "#94a3b8", mut: "#64748b",
    brd: "#1e2538", card: "#161b2e",
    glass: "rgba(12,15,26,.92)",
    glassBorder: "rgba(255,255,255,.06)",
    accent: "#1CABB0", lime: "#D4F24D",
    shadow: "rgba(0,0,0,.3)",
    shadowHover: "rgba(28,171,176,.25)",
    heroOverlay: "linear-gradient(135deg,rgba(12,15,26,.68),rgba(12,15,26,.3),rgba(12,15,26,.7))",
    destOverlay: "linear-gradient(to top,rgba(12,15,26,.9) 0%,rgba(12,15,26,.2) 50%,transparent 100%)",
    fadeBottom: "linear-gradient(transparent 30%,#0c0f1a)",
    greenBg: "#052e16", greenBrd: "#14532d", greenTxt: "#4ade80", greenSub: "#86efac",
    redBg: "#450a0a", redBrd: "#7f1d1d", redTxt: "#f87171", redSub: "#fca5a5",
  },
};

/** Override the accent color with a client's primary_color if set */
export function applyAccentOverride(theme: LandingTheme, primaryColor?: string | null): LandingTheme {
  if (!primaryColor) return theme;
  return {
    ...theme,
    accent: primaryColor,
    shadowHover: `${primaryColor}40`,
  };
}
