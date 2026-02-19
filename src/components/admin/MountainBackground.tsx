"use client";

/**
 * Vivid mountain landscape for the admin right column.
 * Sky gradient dark→light with clearly visible mountain layers.
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
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#072331" />
          <stop offset="25%" stopColor="#0C4551" />
          <stop offset="50%" stopColor="#178991" />
          <stop offset="75%" stopColor="#33CFD7" />
          <stop offset="100%" stopColor="#99E7EB" />
        </linearGradient>
        <radialGradient id="moonGlow" cx="0.75" cy="0.08" r="0.1">
          <stop offset="0%" stopColor="#D4F24D" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#D4F24D" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="300" height="800" fill="url(#sky)" />

      {/* Moon */}
      <circle cx="225" cy="65" r="80" fill="url(#moonGlow)" />
      <circle cx="225" cy="65" r="12" fill="#D4F24D" opacity="0.15" />

      {/* Stars */}
      <circle cx="40" cy="30" r="1" fill="white" opacity="0.5" />
      <circle cx="120" cy="55" r="0.8" fill="white" opacity="0.4" />
      <circle cx="80" cy="90" r="0.7" fill="white" opacity="0.3" />
      <circle cx="260" cy="45" r="0.9" fill="white" opacity="0.45" />
      <circle cx="180" cy="30" r="0.6" fill="white" opacity="0.35" />

      {/* Mountain layer 4 — farthest, vivid */}
      <path
        d="M0 440 Q40 360 80 400 Q120 340 160 380 Q200 310 240 370 Q270 330 300 355 L300 520 L0 520Z"
        fill="#33CFD7"
        opacity="0.4"
      />

      {/* Mountain layer 3 — mid-far */}
      <path
        d="M0 490 Q35 400 70 450 Q100 380 140 430 Q170 360 210 410 Q240 370 280 405 L300 395 L300 570 L0 570Z"
        fill="#1CABB0"
        opacity="0.5"
      />

      {/* Mountain layer 2 — mid-close */}
      <path
        d="M0 540 Q30 470 65 510 Q95 450 130 490 Q160 430 195 475 Q225 440 260 470 Q285 445 300 465 L300 620 L0 620Z"
        fill="#126771"
        opacity="0.6"
      />

      {/* Mountain layer 1 — closest, darkest */}
      <path
        d="M0 580 Q25 530 55 560 Q80 510 115 545 Q145 500 175 535 Q205 515 235 540 Q260 510 290 540 L300 530 L300 660 L0 660Z"
        fill="#0C4551"
        opacity="0.7"
      />

      {/* Pine tree silhouettes */}
      <path
        d="M0 645 L8 622 L16 645 L24 618 L32 645 L40 615 L48 645 L56 620 L64 645 L72 616 L80 645 L88 622 L96 645 L104 618 L112 645 L120 614 L128 645 L136 620 L144 645 L152 616 L160 645 L168 622 L176 645 L184 618 L192 645 L200 614 L208 645 L216 620 L224 645 L232 616 L240 645 L248 622 L252 645 L260 618 L268 645 L276 614 L284 645 L292 620 L300 640 L300 800 L0 800Z"
        fill="#0C4551"
        opacity="0.5"
      />

      {/* Bottom terrain fill */}
      <rect y="660" width="300" height="140" fill="#0C4551" opacity="0.35" />
    </svg>
  );
}
