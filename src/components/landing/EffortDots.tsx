"use client";

import { useLandingTheme } from "./LandingThemeProvider";

export function EffortDots({ level }: { level: number }) {
  const T = useLandingTheme();
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{
          width: 10, height: 10, borderRadius: "50%",
          background: i <= level ? T.accent : T.brd,
          transition: "background .3s",
        }} />
      ))}
    </div>
  );
}
