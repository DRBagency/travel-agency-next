"use client";

import { useTheme as useNextTheme } from "next-themes";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  themes,
  applyAccentOverride,
  type LandingTheme,
} from "@/lib/landing-theme";
import { LandingGlobalStyles } from "./LandingGlobalStyles";

interface LandingThemeCtx extends LandingTheme {
  toggle: () => void;
}

const Ctx = createContext<LandingThemeCtx | null>(null);

export function useLandingTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLandingTheme must be inside LandingThemeProvider");
  return ctx;
}

export function LandingThemeProvider({
  children,
  primaryColor,
  darkModeEnabled = true,
}: {
  children: ReactNode;
  primaryColor?: string | null;
  darkModeEnabled?: boolean;
}) {
  const { resolvedTheme, setTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const mode = mounted ? (resolvedTheme === "dark" ? "dark" : "light") : "dark";
  const base = themes[mode];
  const T = applyAccentOverride(base, primaryColor);

  const toggle = () => {
    if (!darkModeEnabled) return;
    setTheme(mode === "dark" ? "light" : "dark");
  };

  return (
    <Ctx.Provider value={{ ...T, toggle }}>
      <LandingGlobalStyles theme={T} />
      <div
        className="noise-bg"
        style={{
          background: T.bg,
          fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
          color: T.txt,
          transition: "background .4s, color .4s",
          minHeight: "100vh",
        }}
      >
        {children}
      </div>
    </Ctx.Provider>
  );
}
