"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

/* ─── Theme palettes matching the template exactly ─── */
export interface LandingPalette {
  mode: "light" | "dark";
  bg: string;
  bg2: string;
  bg3: string;
  text: string;
  sub: string;
  muted: string;
  border: string;
  glass: string;
  accent: string;
  lime: string;
  shadow: string;
  darkOverlay: string;
  fadeBottom: string;
  greenBg: string;
  greenBorder: string;
  greenText: string;
  redBg: string;
  redBorder: string;
  redText: string;
}

const lightPalette: LandingPalette = {
  mode: "light",
  bg: "#f0f4f8",
  bg2: "#ffffff",
  bg3: "#e8ecf1",
  text: "#0f172a",
  sub: "#475569",
  muted: "#94a3b8",
  border: "#dce3eb",
  glass: "rgba(240,244,248,.88)",
  accent: "#1CABB0",
  lime: "#D4F24D",
  shadow: "rgba(0,0,0,.05)",
  darkOverlay:
    "linear-gradient(to top,rgba(15,23,42,.88),rgba(15,23,42,.12) 55%,transparent)",
  fadeBottom: "linear-gradient(transparent 20%,#f0f4f8)",
  greenBg: "#ecfdf5",
  greenBorder: "#a7f3d0",
  greenText: "#047857",
  redBg: "#fef2f2",
  redBorder: "#fecaca",
  redText: "#b91c1c",
};

const darkPalette: LandingPalette = {
  mode: "dark",
  bg: "#080b16",
  bg2: "#10141f",
  bg3: "#171c2c",
  text: "#f1f5f9",
  sub: "#94a3b8",
  muted: "#64748b",
  border: "#1c2236",
  glass: "rgba(8,11,22,.88)",
  accent: "#1CABB0",
  lime: "#D4F24D",
  shadow: "rgba(0,0,0,.35)",
  darkOverlay:
    "linear-gradient(to top,rgba(8,11,22,.92),rgba(8,11,22,.15) 55%,transparent)",
  fadeBottom: "linear-gradient(transparent 20%,#080b16)",
  greenBg: "#052e16",
  greenBorder: "#14532d",
  greenText: "#4ade80",
  redBg: "#450a0a",
  redBorder: "#7f1d1d",
  redText: "#f87171",
};

interface ThemeCtx {
  theme: LandingPalette;
  mode: "light" | "dark";
  toggleTheme: () => void;
}

const LandingThemeContext = createContext<ThemeCtx>({
  theme: lightPalette,
  mode: "light",
  toggleTheme: () => {},
});

export const useLandingTheme = () => useContext(LandingThemeContext).theme;
export const useLandingMode = () => {
  const ctx = useContext(LandingThemeContext);
  return { mode: ctx.mode, toggleTheme: ctx.toggleTheme };
};

export function LandingThemeProvider({
  children,
  primaryColor,
  darkModeEnabled = true,
}: {
  children: ReactNode;
  primaryColor?: string | null;
  darkModeEnabled?: boolean;
}) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  // Persist choice in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("drb-landing-theme");
    if (saved === "dark" && darkModeEnabled) setMode("dark");
  }, [darkModeEnabled]);

  const toggleTheme = () => {
    if (!darkModeEnabled) return;
    setMode((m) => {
      const next = m === "light" ? "dark" : "light";
      localStorage.setItem("drb-landing-theme", next);
      return next;
    });
  };

  const base = mode === "dark" ? darkPalette : lightPalette;
  const theme: LandingPalette = primaryColor
    ? { ...base, accent: primaryColor }
    : base;

  return (
    <LandingThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      <div style={{ background: theme.bg, color: theme.text, minHeight: "100vh", position: "relative" }}>
        {children}
      </div>
    </LandingThemeContext.Provider>
  );
}
