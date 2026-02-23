"use client";

import { useState, type CSSProperties } from "react";
import { useLandingTheme } from "./LandingThemeProvider";

export function Img({
  src, alt, style, className,
}: {
  src?: string | null;
  alt?: string;
  style?: CSSProperties;
  className?: string;
}) {
  const [error, setError] = useState(false);
  const T = useLandingTheme();
  const fallbackBg = T.mode === "dark"
    ? "linear-gradient(135deg,#1a2332,#0f1923)"
    : "linear-gradient(135deg,#e8fafa,#f0fbe0)";

  return (
    <div className={className} style={{ ...style, overflow: "hidden", position: "relative", background: fallbackBg }}>
      {!error && src ? (
        <img
          src={src}
          alt={alt || ""}
          onError={() => setError(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .6s" }}
        />
      ) : (
        <div style={{
          width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
          color: T.accent, fontFamily: "var(--font-syne), 'Syne', sans-serif", fontSize: 28, fontWeight: 700,
        }}>
          {alt?.charAt(0) || "\u2726"}
        </div>
      )}
    </div>
  );
}
