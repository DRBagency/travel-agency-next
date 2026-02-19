"use client";

/**
 * SVG mountain landscape background for the admin right column.
 * Inspired by layered mountain silhouettes with sky gradient.
 * Uses DRB turquoise palette.
 */
export default function MountainBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #E6F9FA 0%, #CCF3F5 20%, #99E7EB 45%, #33CFD7 70%, #1CABB0 90%, #126771 100%)",
        }}
      />

      {/* Dark mode sky */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            "linear-gradient(180deg, #072331 0%, #0C4551 20%, #0C4551 40%, #126771 65%, #178991 85%, #1CABB0 100%)",
        }}
      />

      {/* Sun/moon glow */}
      <div
        className="absolute top-8 start-1/2 -translate-x-1/2 w-16 h-16 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(212,242,77,0.6) 0%, rgba(212,242,77,0.2) 40%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-10 start-1/2 -translate-x-1/2 w-8 h-8 rounded-full dark:hidden"
        style={{ background: "rgba(212,242,77,0.5)" }}
      />
      <div
        className="absolute top-10 start-1/2 -translate-x-1/2 w-8 h-8 rounded-full hidden dark:block"
        style={{ background: "rgba(212,242,77,0.3)" }}
      />

      {/* Mountain layers — SVG */}
      <svg
        className="absolute bottom-0 start-0 w-full"
        style={{ height: "65%" }}
        viewBox="0 0 300 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Layer 4 — farthest mountains */}
        <path
          d="M0 120 Q30 60 60 100 Q80 70 100 90 Q130 40 160 85 Q180 55 210 80 Q240 50 270 95 Q285 70 300 100 L300 200 L0 200Z"
          className="fill-drb-turquoise-300/40 dark:fill-drb-turquoise-700/30"
        />

        {/* Layer 3 — mid-far mountains */}
        <path
          d="M0 140 Q20 90 50 120 Q70 85 100 110 Q120 75 150 105 Q175 65 200 100 Q225 80 260 115 Q280 90 300 120 L300 200 L0 200Z"
          className="fill-drb-turquoise-500/50 dark:fill-drb-turquoise-600/40"
        />

        {/* Layer 2 — mid-close mountains */}
        <path
          d="M0 155 Q25 115 55 140 Q75 110 110 135 Q135 100 165 130 Q185 105 215 125 Q245 100 275 140 Q290 120 300 145 L300 200 L0 200Z"
          className="fill-drb-turquoise-700/60 dark:fill-drb-turquoise-500/35"
        />

        {/* Layer 1 — closest mountains */}
        <path
          d="M0 170 Q20 140 45 160 Q65 135 90 155 Q110 130 140 150 Q160 135 185 155 Q210 130 240 160 Q265 140 285 165 Q295 150 300 170 L300 200 L0 200Z"
          className="fill-drb-turquoise-800/70 dark:fill-drb-turquoise-400/25"
        />

        {/* Pine tree silhouettes — bottom strip */}
        {/* Group of pines left */}
        <path
          d="M10 200 L15 175 L20 200 M18 200 L24 178 L30 200 M26 200 L30 180 L34 200"
          className="fill-drb-turquoise-900/30 dark:fill-drb-turquoise-300/15"
        />
        {/* Group of pines center-left */}
        <path
          d="M70 200 L76 177 L82 200 M78 200 L85 172 L92 200 M88 200 L93 179 L98 200"
          className="fill-drb-turquoise-900/30 dark:fill-drb-turquoise-300/15"
        />
        {/* Group of pines center */}
        <path
          d="M135 200 L140 180 L145 200 M142 200 L148 174 L154 200 M150 200 L155 182 L160 200"
          className="fill-drb-turquoise-900/30 dark:fill-drb-turquoise-300/15"
        />
        {/* Group of pines center-right */}
        <path
          d="M195 200 L200 178 L205 200 M202 200 L208 173 L214 200 M210 200 L214 180 L218 200"
          className="fill-drb-turquoise-900/30 dark:fill-drb-turquoise-300/15"
        />
        {/* Group of pines right */}
        <path
          d="M260 200 L266 176 L272 200 M268 200 L275 170 L282 200 M278 200 L282 178 L286 200"
          className="fill-drb-turquoise-900/30 dark:fill-drb-turquoise-300/15"
        />
      </svg>

      {/* Atmospheric haze overlay at bottom */}
      <div
        className="absolute bottom-0 start-0 w-full h-1/4"
        style={{
          background:
            "linear-gradient(0deg, rgba(18,103,113,0.3) 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute bottom-0 start-0 w-full h-1/4 hidden dark:block"
        style={{
          background:
            "linear-gradient(0deg, rgba(4,24,32,0.5) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
