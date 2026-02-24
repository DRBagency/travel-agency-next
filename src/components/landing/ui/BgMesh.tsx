"use client";

import { useLandingTheme } from "../LandingThemeProvider";

export function BgMesh() {
  const T = useLandingTheme();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Turquoise orb - top right */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${T.accent}18, ${T.accent}05, transparent 70%)`,
          top: "-15%",
          right: "-10%",
          animation: "orbFloat1 20s ease-in-out infinite",
          filter: "blur(60px)",
        }}
      />
      {/* Lime orb - bottom left */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${T.lime}15, ${T.lime}03, transparent 70%)`,
          bottom: "5%",
          left: "-8%",
          animation: "orbFloat2 25s ease-in-out infinite",
          filter: "blur(50px)",
        }}
      />
      {/* Purple accent orb - center */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, #8b5cf615, transparent 70%)",
          top: "40%",
          left: "50%",
          animation: "orbFloat1 30s ease-in-out infinite reverse",
          filter: "blur(70px)",
        }}
      />
      {/* Subtle radial overlays */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            T.mode === "light"
              ? `radial-gradient(ellipse at 20% 0%, ${T.accent}06, transparent 50%), radial-gradient(ellipse at 80% 100%, ${T.lime}06, transparent 50%)`
              : `radial-gradient(ellipse at 20% 0%, ${T.accent}08, transparent 50%), radial-gradient(ellipse at 80% 100%, ${T.lime}05, transparent 50%)`,
        }}
      />
    </div>
  );
}
