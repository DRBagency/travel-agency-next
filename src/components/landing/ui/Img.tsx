"use client";

import { useState, CSSProperties } from "react";

interface ImgProps {
  src: string;
  alt?: string;
  style?: CSSProperties;
  isDark?: boolean;
}

export function Img({ src, alt, style, isDark }: ImgProps) {
  const [error, setError] = useState(false);
  const fallbackBg = isDark
    ? "linear-gradient(135deg,#151a2a,#0d1220)"
    : "linear-gradient(135deg,#dff5f5,#e8f8e0)";
  return (
    <div
      style={{
        ...style,
        overflow: "hidden",
        position: "relative",
        background: fallbackBg,
      }}
    >
      {!error ? (
        <img
          src={src}
          alt={alt || ""}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform .6s",
          }}
          onError={() => setError(true)}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#1CABB0",
            fontFamily: "var(--font-syne), Syne, sans-serif",
            fontSize: 32,
            fontWeight: 700,
          }}
        >
          {(alt && alt.charAt(0)) || "V"}
        </div>
      )}
    </div>
  );
}
