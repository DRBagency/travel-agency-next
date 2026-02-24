"use client";

import { useLandingTheme } from "../LandingThemeProvider";
import { Img } from "../ui/Img";

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface Hotel {
  nombre: string;
  estrellas?: number;
  imagen?: string;
  descripcion?: string;
  amenidades?: string[];
}

interface TabHotelProps {
  hotel: Hotel;
}

export function TabHotel({ hotel }: TabHotelProps) {
  const T = useLandingTheme();

  /* backwards compat with English-keyed seed data */
  const h = hotel as any;
  const nombre = hotel.nombre || h.name || "";
  const estrellas = hotel.estrellas ?? h.stars ?? 0;
  const imagen = hotel.imagen || h.image;
  const descripcion = hotel.descripcion || h.description;
  const amenidades: string[] = hotel.amenidades || h.amenities || [];

  return (
    <div
      style={{
        borderRadius: 22,
        overflow: "hidden",
        border: `1.5px solid ${T.border}`,
        background: T.bg2,
      }}
    >
      {/* Hotel image */}
      {imagen && (
        <Img
          src={imagen}
          alt={nombre}
          isDark={T.mode === "dark"}
          style={{ width: "100%", height: 300 }}
        />
      )}

      <div style={{ padding: 28 }}>
        {/* Name + stars */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <h3
            style={{
              fontFamily: FONT,
              color: T.text,
              margin: 0,
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            {nombre}
          </h3>
          {estrellas > 0 && (
            <span style={{ color: "#f59e0b", fontSize: 20 }}>
              {"★".repeat(estrellas)}
            </span>
          )}
        </div>

        {/* Description */}
        {descripcion && (
          <p
            style={{
              fontFamily: FONT2,
              color: T.sub,
              margin: "0 0 20px",
              lineHeight: 1.7,
              fontSize: 15,
            }}
          >
            {descripcion}
          </p>
        )}

        {/* Amenities as pill badges */}
        {amenidades.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {amenidades.map((amenity, i) => (
              <span
                key={i}
                style={{
                  padding: "6px 16px",
                  borderRadius: 50,
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: FONT2,
                  background: T.accent + "15",
                  color: T.accent,
                  border: `1px solid ${T.accent}25`,
                }}
              >
                {amenity}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
