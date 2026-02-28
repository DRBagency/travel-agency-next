"use client";

import { useState } from "react";
import { useLandingTheme } from "../LandingThemeProvider";
import { useTranslations } from "next-intl";
import { Img } from "../ui/Img";

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface HabitacionData {
  tipo: string;
  descripcion?: string;
  suplemento?: number;
  capacidad?: number;
  imagen?: string;
}

interface Hotel {
  nombre: string;
  estrellas?: number;
  imagen?: string;
  galeria?: string[];
  es_recomendado?: boolean;
  descripcion?: string;
  amenidades?: string[];
  direccion?: string;
  desayuno_incluido?: boolean;
  regimen?: string;
  suplemento?: number;
  habitaciones?: HabitacionData[];
}

/* Backward compat: single hotel object → array */
export function normalizeHotels(raw: any): Hotel[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  return [raw];
}

const REGIMEN_MAP: Record<string, string> = {
  solo_alojamiento: "regimenRoomOnly",
  desayuno: "regimenBreakfast",
  media_pension: "regimenHalfBoard",
  pension_completa: "regimenFullBoard",
  todo_incluido: "regimenAllInclusive",
};

interface TabHotelProps {
  hotels: Hotel[];
  basePrice: number;
  selectedHotelIndex: number;
  selectedRoomIndex: number;
  onSelectHotel: (index: number) => void;
  onSelectRoom: (hotelIndex: number, roomIndex: number) => void;
}

export function TabHotel({
  hotels,
  basePrice,
  selectedHotelIndex,
  selectedRoomIndex,
  onSelectHotel,
  onSelectRoom,
}: TabHotelProps) {
  const T = useLandingTheme();
  const t = useTranslations("landing.destino");

  if (hotels.length === 0) return null;

  const [galleryIdx, setGalleryIdx] = useState<Record<number, number>>({});

  const compat = (h: any) => ({
    nombre: h.nombre || h.name || "",
    estrellas: h.estrellas ?? h.stars ?? 0,
    imagen: h.imagen || h.image || "",
    galeria: h.galeria || [],
    es_recomendado: h.es_recomendado ?? false,
    descripcion: h.descripcion || h.description || "",
    amenidades: h.amenidades || h.amenities || [],
    direccion: h.direccion || h.address || "",
    desayuno_incluido: h.desayuno_incluido ?? false,
    regimen: h.regimen || "solo_alojamiento",
    suplemento: h.suplemento ?? 0,
    habitaciones: h.habitaciones || [],
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <h3
        style={{
          fontFamily: FONT,
          fontSize: 22,
          fontWeight: 800,
          color: T.text,
          margin: 0,
        }}
      >
        {t("hotelOptions")}
      </h3>

      {/* Hotel cards */}
      {hotels.map((rawHotel, hIdx) => {
        const h = compat(rawHotel);
        const isSelected = hIdx === selectedHotelIndex;
        const minRoomSupplement = h.habitaciones.length > 0
          ? Math.min(...h.habitaciones.map((r: any) => r.suplemento ?? 0))
          : 0;
        const hotelFromPrice = basePrice + h.suplemento + minRoomSupplement;

        return (
          <div
            key={hIdx}
            style={{
              borderRadius: 22,
              overflow: "hidden",
              border: isSelected
                ? `2.5px solid ${T.accent}`
                : `1.5px solid ${T.border}`,
              background: T.bg2,
              transition: "border-color 0.3s, box-shadow 0.3s",
              boxShadow: isSelected ? `0 0 20px ${T.accent}20` : "none",
            }}
          >
            {/* Hotel image */}
            {(() => {
              const allImages = [h.imagen, ...h.galeria].filter(Boolean) as string[];
              const activeIdx = galleryIdx[hIdx] ?? 0;
              const activeImg = allImages[activeIdx] || h.imagen;
              return allImages.length > 0 ? (
                <div style={{ position: "relative" }}>
                  <Img
                    src={activeImg}
                    alt={h.nombre}
                    isDark={T.mode === "dark"}
                    style={{ width: "100%", height: 240 }}
                  />
                  {/* Price badge */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 14,
                      insetInlineEnd: 14,
                      background: T.accent,
                      color: "#fff",
                      fontFamily: FONT,
                      fontWeight: 800,
                      fontSize: 15,
                      padding: "8px 16px",
                      borderRadius: 50,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                    }}
                  >
                    {h.suplemento === 0
                      ? t("includedInPrice")
                      : `+${h.suplemento}€ ${t("perPerson")}`}
                  </div>
                  {/* Recommended badge */}
                  {h.es_recomendado && (
                    <div
                      style={{
                        position: "absolute",
                        top: 14,
                        insetInlineStart: 14,
                        background: "#10b981",
                        color: "#fff",
                        fontFamily: FONT2,
                        fontWeight: 700,
                        fontSize: 12,
                        padding: "6px 14px",
                        borderRadius: 50,
                        boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
                      }}
                    >
                      ⭐ {t("recommended")}
                    </div>
                  )}
                  {/* Gallery thumbnails */}
                  {allImages.length > 1 && (
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        padding: "8px 14px",
                        overflowX: "auto",
                      }}
                    >
                      {allImages.map((img, gIdx) => (
                        <div
                          key={gIdx}
                          onClick={() => setGalleryIdx((prev) => ({ ...prev, [hIdx]: gIdx }))}
                          style={{
                            width: 56,
                            height: 40,
                            borderRadius: 8,
                            overflow: "hidden",
                            flexShrink: 0,
                            cursor: "pointer",
                            border: gIdx === activeIdx
                              ? `2px solid ${T.accent}`
                              : `1.5px solid ${T.border}`,
                            opacity: gIdx === activeIdx ? 1 : 0.7,
                            transition: "all 0.2s",
                          }}
                        >
                          <Img
                            src={img}
                            alt={`${h.nombre} ${gIdx + 1}`}
                            isDark={T.mode === "dark"}
                            style={{ width: 56, height: 40 }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null;
            })()}

            <div style={{ padding: 24 }}>
              {/* Name + stars + select button */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <h4
                    style={{
                      fontFamily: FONT,
                      color: T.text,
                      margin: 0,
                      fontSize: 22,
                      fontWeight: 800,
                    }}
                  >
                    {h.nombre}
                  </h4>
                  {h.estrellas > 0 && (
                    <span style={{ color: "#f59e0b", fontSize: 18 }}>
                      {"★".repeat(h.estrellas)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onSelectHotel(hIdx)}
                  style={{
                    fontFamily: FONT2,
                    fontSize: 13,
                    fontWeight: 700,
                    padding: "8px 20px",
                    borderRadius: 50,
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    background: isSelected ? T.accent : `${T.accent}15`,
                    color: isSelected ? "#fff" : T.accent,
                  }}
                >
                  {isSelected ? `✓ ${t("selected")}` : t("selectThisHotel")}
                </button>
              </div>

              {/* Regimen + breakfast badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                <span
                  style={{
                    padding: "5px 14px",
                    borderRadius: 50,
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: FONT2,
                    background: `${T.accent}12`,
                    color: T.accent,
                    border: `1px solid ${T.accent}25`,
                  }}
                >
                  {t(REGIMEN_MAP[h.regimen] || "regimenRoomOnly")}
                </span>
                {h.desayuno_incluido && (
                  <span
                    style={{
                      padding: "5px 14px",
                      borderRadius: 50,
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: FONT2,
                      background: "#10b98115",
                      color: "#10b981",
                      border: "1px solid #10b98125",
                    }}
                  >
                    ☕ {t("regimenBreakfast")}
                  </span>
                )}
              </div>

              {/* Description */}
              {h.descripcion && (
                <p
                  style={{
                    fontFamily: FONT2,
                    color: T.sub,
                    margin: "0 0 16px",
                    lineHeight: 1.7,
                    fontSize: 15,
                  }}
                >
                  {h.descripcion}
                </p>
              )}

              {/* Amenities */}
              {h.amenidades.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  {h.amenidades.map((amenity: string, i: number) => (
                    <span
                      key={i}
                      style={{
                        padding: "5px 14px",
                        borderRadius: 50,
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: FONT2,
                        background: `${T.accent}10`,
                        color: T.accent,
                        border: `1px solid ${T.accent}18`,
                      }}
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              )}

              {/* Address / Google Maps */}
              {h.direccion && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 16px",
                    borderRadius: 14,
                    background: T.bg,
                    border: `1px solid ${T.border}`,
                    marginBottom: 16,
                  }}
                >
                  <span style={{ fontSize: 16 }}>📍</span>
                  <p
                    style={{
                      fontFamily: FONT2,
                      fontSize: 13,
                      color: T.text,
                      margin: 0,
                      fontWeight: 600,
                      flex: 1,
                    }}
                  >
                    {h.direccion.startsWith("http") ? t("viewLocation") : h.direccion}
                  </p>
                  <a
                    href={
                      h.direccion.startsWith("http")
                        ? h.direccion
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.direccion)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "5px 12px",
                      borderRadius: 50,
                      background: `${T.accent}15`,
                      color: T.accent,
                      fontFamily: FONT2,
                      fontSize: 11,
                      fontWeight: 700,
                      textDecoration: "none",
                      border: `1px solid ${T.accent}25`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    🗺️ {t("viewOnMaps")}
                  </a>
                </div>
              )}

              {/* Room types */}
              {isSelected && h.habitaciones.length > 0 && (
                <div>
                  <h5
                    style={{
                      fontFamily: FONT,
                      fontSize: 16,
                      fontWeight: 700,
                      color: T.text,
                      margin: "0 0 12px",
                    }}
                  >
                    {t("roomTypes")}
                  </h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {h.habitaciones.map((room: any, rIdx: number) => {
                      const isRoomSelected = rIdx === selectedRoomIndex;
                      const roomPrice = basePrice + h.suplemento + (room.suplemento ?? 0);

                      return (
                        <div
                          key={rIdx}
                          onClick={() => onSelectRoom(hIdx, rIdx)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            padding: "14px 18px",
                            borderRadius: 16,
                            border: isRoomSelected
                              ? `2px solid ${T.accent}`
                              : `1.5px solid ${T.border}`,
                            background: isRoomSelected ? `${T.accent}08` : T.bg,
                            cursor: "pointer",
                            transition: "all 0.25s",
                          }}
                        >
                          {/* Room image thumbnail */}
                          {room.imagen && (
                            <div
                              style={{
                                width: 70,
                                height: 50,
                                borderRadius: 10,
                                overflow: "hidden",
                                flexShrink: 0,
                              }}
                            >
                              <Img
                                src={room.imagen}
                                alt={room.tipo}
                                isDark={T.mode === "dark"}
                                style={{ width: 70, height: 50 }}
                              />
                            </div>
                          )}

                          {/* Room info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontFamily: FONT2,
                                fontSize: 14,
                                fontWeight: 700,
                                color: T.text,
                              }}
                            >
                              {room.tipo || `${t("roomTypes")} ${rIdx + 1}`}
                            </div>
                            {room.descripcion && (
                              <div
                                style={{
                                  fontFamily: FONT2,
                                  fontSize: 12,
                                  color: T.sub,
                                  marginTop: 2,
                                }}
                              >
                                {room.descripcion}
                              </div>
                            )}
                            <div
                              style={{
                                fontFamily: FONT2,
                                fontSize: 11,
                                color: T.sub,
                                marginTop: 4,
                              }}
                            >
                              {t("capacity")}: {room.capacidad || 2} {t("guests")}
                            </div>
                          </div>

                          {/* Room price */}
                          <div style={{ textAlign: "end", flexShrink: 0 }}>
                            <div
                              style={{
                                fontFamily: FONT,
                                fontSize: 16,
                                fontWeight: 800,
                                color: T.accent,
                              }}
                            >
                              {roomPrice.toLocaleString("es-ES")}€
                            </div>
                            <div
                              style={{
                                fontFamily: FONT2,
                                fontSize: 11,
                                color: T.sub,
                              }}
                            >
                              {t("perPerson")}
                            </div>
                            {(room.suplemento ?? 0) > 0 && (
                              <div
                                style={{
                                  fontFamily: FONT2,
                                  fontSize: 10,
                                  color: T.sub,
                                  marginTop: 2,
                                }}
                              >
                                +{room.suplemento}€ {t("supplement")}
                              </div>
                            )}
                          </div>

                          {/* Selection indicator */}
                          <div
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: "50%",
                              border: isRoomSelected
                                ? `2px solid ${T.accent}`
                                : `2px solid ${T.border}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              transition: "all 0.25s",
                            }}
                          >
                            {isRoomSelected && (
                              <div
                                style={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  background: T.accent,
                                }}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
