"use client";

/**
 * Full-height SVG mountain landscape for the admin right column.
 * Dark sky at top (blends with Eden's dark artboard), lighter toward bottom.
 * 4 mountain layers + pine silhouettes + subtle moon glow.
 */
export default function MountainBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 300 800"
      fill="none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Sky gradient: dark top → lighter bottom */}
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#072331" />
          <stop offset="15%" stopColor="#0C4551" />
          <stop offset="35%" stopColor="#126771" />
          <stop offset="55%" stopColor="#178991" />
          <stop offset="75%" stopColor="#1CABB0" />
          <stop offset="90%" stopColor="#99E7EB" />
          <stop offset="100%" stopColor="#CCF3F5" />
        </linearGradient>

        {/* Moon glow */}
        <radialGradient id="moonGlow" cx="0.73" cy="0.11" r="0.12">
          <stop offset="0%" stopColor="#D4F24D" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#D4F24D" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#D4F24D" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky fill */}
      <rect width="300" height="800" fill="url(#sky)" />

      {/* Moon glow circle */}
      <circle cx="220" cy="90" r="100" fill="url(#moonGlow)" />
      <circle cx="220" cy="90" r="18" fill="#D4F24D" opacity="0.15" />

      {/* Stars (small dots in dark sky area) */}
      <circle cx="40" cy="30" r="1" fill="white" opacity="0.4" />
      <circle cx="120" cy="50" r="0.8" fill="white" opacity="0.3" />
      <circle cx="80" cy="80" r="0.6" fill="white" opacity="0.25" />
      <circle cx="260" cy="40" r="0.8" fill="white" opacity="0.35" />
      <circle cx="180" cy="25" r="0.7" fill="white" opacity="0.3" />
      <circle cx="50" cy="120" r="0.6" fill="white" opacity="0.2" />
      <circle cx="250" cy="130" r="0.5" fill="white" opacity="0.15" />

      {/* Mountain layer 4 — farthest (subtle, lighter) */}
      <path
        d="M0 450 Q30 370 60 410 Q90 350 120 400 Q150 330 180 380 Q210 310 240 370 Q270 340 300 360 L300 520 L0 520Z"
        fill="#33CFD7"
        opacity="0.25"
      />

      {/* Mountain layer 3 — mid-far */}
      <path
        d="M0 490 Q25 410 55 450 Q80 380 110 430 Q140 370 170 420 Q200 360 230 400 Q260 370 290 410 L300 410 L300 560 L0 560Z"
        fill="#178991"
        opacity="0.35"
      />

      {/* Mountain layer 2 — mid-close */}
      <path
        d="M0 530 Q30 460 65 500 Q90 440 125 480 Q155 420 185 470 Q215 430 245 460 Q275 420 300 460 L300 600 L0 600Z"
        fill="#126771"
        opacity="0.45"
      />

      {/* Mountain layer 1 — closest (darkest) */}
      <path
        d="M0 570 Q20 520 50 550 Q75 500 105 540 Q130 490 160 530 Q190 510 220 540 Q250 500 280 535 L300 520 L300 640 L0 640Z"
        fill="#0C4551"
        opacity="0.55"
      />

      {/* Pine tree silhouettes — continuous strip */}
      <path
        d="M0 630 L8 608 L16 630 L22 610 L28 630 L36 605 L44 630 L50 612 L56 630 L64 606 L72 630 L78 614 L84 630 L92 608 L100 630 L106 610 L112 630 L120 604 L128 630 L134 612 L140 630 L148 606 L156 630 L162 614 L168 630 L176 608 L184 630 L190 610 L196 630 L204 604 L212 630 L218 612 L224 630 L232 606 L240 630 L246 614 L252 630 L260 608 L268 630 L274 612 L280 630 L288 606 L296 630 L300 625 L300 800 L0 800Z"
        fill="#0C4551"
        opacity="0.4"
      />

      {/* Bottom fog/haze */}
      <rect y="700" width="300" height="100" fill="#CCF3F5" opacity="0.15" />
    </svg>
  );
}
