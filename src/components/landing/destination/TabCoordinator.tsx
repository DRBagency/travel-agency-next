"use client";

import { useLandingTheme } from "../LandingThemeProvider";
import { Img } from "../ui/Img";

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface Coordinator {
  nombre: string;
  rol?: string;
  avatar?: string;
  descripcion?: string;
  idiomas?: string[];
}

interface TabCoordinatorProps {
  coordinator: Coordinator;
}

export function TabCoordinator({ coordinator }: TabCoordinatorProps) {
  const T = useLandingTheme();

  /* backwards compat with English-keyed seed data */
  const c = coordinator as any;
  const nombre = coordinator.nombre || c.name || "";
  const rol = coordinator.rol || c.role;
  const avatar = coordinator.avatar || c.avatar;
  const descripcion = coordinator.descripcion || c.bio;
  const idiomas: string[] = coordinator.idiomas || c.languages || [];

  return (
    <div
      style={{
        display: "flex",
        gap: 28,
        padding: 36,
        borderRadius: 22,
        background: T.bg2,
        border: `1.5px solid ${T.border}`,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* Avatar */}
      {avatar ? (
        <Img
          src={avatar}
          alt={nombre}
          isDark={T.mode === "dark"}
          style={{
            width: 110,
            height: 110,
            borderRadius: "50%",
            flexShrink: 0,
            border: `3px solid ${T.accent}`,
            boxShadow: `0 4px 20px ${T.accent}25`,
          }}
        />
      ) : (
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: "50%",
            flexShrink: 0,
            border: `3px solid ${T.accent}`,
            background: `linear-gradient(135deg, ${T.accent}30, ${T.accent}10)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 38,
            color: T.accent,
          }}
        >
          {nombre.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Info */}
      <div style={{ flex: 1, minWidth: 220 }}>
        <p
          style={{
            fontFamily: FONT2,
            color: T.accent,
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 2,
            marginBottom: 4,
          }}
        >
          Tu coordinador/a
        </p>

        <h3
          style={{
            fontFamily: FONT,
            fontSize: 26,
            fontWeight: 800,
            color: T.text,
            margin: "0 0 4px",
          }}
        >
          {nombre}
        </h3>

        {rol && (
          <p
            style={{
              fontFamily: FONT2,
              color: T.muted,
              fontSize: 14,
              margin: "0 0 12px",
            }}
          >
            {rol}
          </p>
        )}

        {descripcion && (
          <p
            style={{
              fontFamily: FONT2,
              color: T.sub,
              fontSize: 15,
              margin: "0 0 16px",
              lineHeight: 1.7,
            }}
          >
            {descripcion}
          </p>
        )}

        {/* Languages as pill badges */}
        {idiomas.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {idiomas.map((lang, i) => (
              <span
                key={i}
                style={{
                  padding: "5px 14px",
                  borderRadius: 50,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: FONT2,
                  background: T.accent + "12",
                  color: T.accent,
                  border: `1px solid ${T.accent}22`,
                }}
              >
                {lang}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
