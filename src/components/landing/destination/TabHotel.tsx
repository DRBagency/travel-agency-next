"use client";

import { useLandingTheme } from "../LandingThemeProvider";
import { Img } from "../ui/Img";

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface Hotel {
  name: string;
  stars?: number;
  image?: string;
  description?: string;
  amenities?: string[];
}

interface TabHotelProps {
  hotel: Hotel;
}

export function TabHotel({ hotel }: TabHotelProps) {
  const T = useLandingTheme();

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
      {hotel.image && (
        <Img
          src={hotel.image}
          alt={hotel.name}
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
            {hotel.name}
          </h3>
          {hotel.stars && hotel.stars > 0 && (
            <span style={{ color: "#f59e0b", fontSize: 20 }}>
              {"★".repeat(hotel.stars)}
            </span>
          )}
        </div>

        {/* Description */}
        {hotel.description && (
          <p
            style={{
              fontFamily: FONT2,
              color: T.sub,
              margin: "0 0 20px",
              lineHeight: 1.7,
              fontSize: 15,
            }}
          >
            {hotel.description}
          </p>
        )}

        {/* Amenities as pill badges */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {hotel.amenities.map((amenity, i) => (
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
