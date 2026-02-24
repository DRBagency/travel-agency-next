"use client";

import { useState } from "react";
import { useLandingTheme } from "../LandingThemeProvider";
import { Img } from "../ui/Img";

const FONT = `var(--font-syne), Syne, sans-serif`;

interface TabGalleryProps {
  gallery: string[];
  destinationName: string;
}

export function TabGallery({ gallery, destinationName }: TabGalleryProps) {
  const T = useLandingTheme();
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      {/* Grid of images */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
        }}
      >
        {gallery.map((url, i) => (
          <div
            key={i}
            onClick={() => setLightbox(i)}
            style={{
              borderRadius: 16,
              overflow: "hidden",
              cursor: "pointer",
              transition: "all .4s cubic-bezier(.16,1,.3,1)",
              border: `1.5px solid ${T.border}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = `0 12px 32px ${T.shadow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <Img
              src={url}
              alt={`${destinationName} ${i + 1}`}
              isDark={T.mode === "dark"}
              style={{ width: "100%", height: 220 }}
            />
          </div>
        ))}
      </div>

      {/* Responsive override: 2 columns on narrow screens */}
      <style>{`
        @media (max-width: 640px) {
          div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          div[style*="grid-template-columns: repeat(3"] > div img {
            height: 160px !important;
          }
        }
      `}</style>

      {/* Lightbox modal */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,.88)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 24,
          }}
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(255,255,255,.12)",
              border: "1px solid rgba(255,255,255,.2)",
              color: "#fff",
              fontSize: 22,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT,
            }}
          >
            {"\u00D7"}
          </button>

          {/* Navigation prev */}
          {gallery.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((prev) =>
                  prev !== null ? (prev > 0 ? prev - 1 : gallery.length - 1) : 0
                );
              }}
              style={{
                position: "absolute",
                left: 20,
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(255,255,255,.12)",
                border: "1px solid rgba(255,255,255,.2)",
                color: "#fff",
                fontSize: 24,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {"\u2039"}
            </button>
          )}

          {/* Main image */}
          <img
            src={gallery[lightbox]}
            alt={`${destinationName} ${lightbox + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              borderRadius: 16,
              objectFit: "contain",
              cursor: "default",
            }}
          />

          {/* Navigation next */}
          {gallery.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((prev) =>
                  prev !== null ? (prev < gallery.length - 1 ? prev + 1 : 0) : 0
                );
              }}
              style={{
                position: "absolute",
                right: 20,
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(255,255,255,.12)",
                border: "1px solid rgba(255,255,255,.2)",
                color: "#fff",
                fontSize: 24,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {"\u203A"}
            </button>
          )}

          {/* Image counter */}
          <span
            style={{
              position: "absolute",
              bottom: 24,
              fontFamily: FONT,
              fontSize: 14,
              fontWeight: 700,
              color: "rgba(255,255,255,.7)",
            }}
          >
            {lightbox + 1} / {gallery.length}
          </span>
        </div>
      )}
    </>
  );
}
