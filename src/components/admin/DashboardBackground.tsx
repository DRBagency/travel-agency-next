"use client";

/**
 * Rich mountain landscape background for the dashboard main area.
 * Fixed to viewport, covers full screen.
 * Dark mode: deep sky gradient + stars + moon + 4 mountain layers.
 * Light mode: soft turquoise sky gradient + 3 mountain layers.
 */
export default function DashboardBackground() {
  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      viewBox="0 0 1200 800"
      fill="none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Dark mode sky gradient */}
        <linearGradient id="dashSkyDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#041820" />
          <stop offset="40%" stopColor="#072331" />
          <stop offset="75%" stopColor="#0C4551" />
          <stop offset="100%" stopColor="#126771" />
        </linearGradient>
        {/* Light mode sky gradient */}
        <linearGradient id="dashSkyLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#E6F9FA" />
          <stop offset="100%" stopColor="#B3EFF2" />
        </linearGradient>
        {/* Moon glow */}
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E8F7F7" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#E8F7F7" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#E8F7F7" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ===== LIGHT MODE ===== */}
      <g className="dark:hidden">
        <rect width="1200" height="800" fill="url(#dashSkyLight)" opacity="0.6" />

        {/* Mountain layer 3 — farthest */}
        <path
          d="M0 480 Q60 370 150 410 Q250 330 350 390 Q450 310 550 370 Q650 300 750 380 Q850 320 950 400 Q1050 340 1150 390 L1200 380 L1200 800 L0 800Z"
          fill="#B3EFF2"
          opacity="0.3"
        />

        {/* Mountain layer 2 — middle */}
        <path
          d="M0 540 Q80 440 180 490 Q280 410 380 470 Q480 390 580 450 Q680 400 780 460 Q880 400 980 470 Q1080 420 1200 460 L1200 800 L0 800Z"
          fill="#80E5E9"
          opacity="0.25"
        />

        {/* Mountain layer 1 — front */}
        <path
          d="M0 610 Q100 530 200 570 Q300 510 400 560 Q500 510 600 550 Q700 510 800 550 Q900 510 1000 560 Q1100 530 1200 550 L1200 800 L0 800Z"
          fill="#4DD8DE"
          opacity="0.15"
        />
      </g>

      {/* ===== DARK MODE ===== */}
      <g className="hidden dark:block">
        <rect width="1200" height="800" fill="url(#dashSkyDark)" opacity="0.7" />

        {/* Stars — subtle dots */}
        <circle cx="120" cy="60" r="1" fill="#fff" opacity="0.4" />
        <circle cx="310" cy="90" r="0.8" fill="#fff" opacity="0.3" />
        <circle cx="480" cy="40" r="1.2" fill="#fff" opacity="0.35" />
        <circle cx="650" cy="100" r="0.7" fill="#fff" opacity="0.25" />
        <circle cx="780" cy="55" r="1" fill="#fff" opacity="0.4" />
        <circle cx="950" cy="75" r="0.9" fill="#fff" opacity="0.3" />
        <circle cx="1100" cy="45" r="1.1" fill="#fff" opacity="0.35" />
        <circle cx="200" cy="150" r="0.6" fill="#fff" opacity="0.2" />
        <circle cx="550" cy="170" r="0.8" fill="#fff" opacity="0.25" />
        <circle cx="850" cy="140" r="0.7" fill="#fff" opacity="0.2" />
        <circle cx="400" cy="130" r="0.5" fill="#fff" opacity="0.15" />
        <circle cx="1050" cy="120" r="0.6" fill="#fff" opacity="0.2" />
        <circle cx="70" cy="190" r="0.7" fill="#fff" opacity="0.15" />
        <circle cx="700" cy="30" r="0.9" fill="#fff" opacity="0.3" />

        {/* Moon — subtle */}
        <circle cx="980" cy="100" r="40" fill="url(#moonGlow)" />
        <circle cx="980" cy="100" r="14" fill="#E8F7F7" opacity="0.15" />

        {/* Mountain layer 4 — farthest */}
        <path
          d="M0 460 Q60 350 150 400 Q250 310 350 380 Q450 290 550 360 Q650 280 750 370 Q850 300 950 390 Q1050 330 1150 380 L1200 370 L1200 800 L0 800Z"
          fill="#0C4551"
          opacity="0.35"
        />

        {/* Mountain layer 3 */}
        <path
          d="M0 510 Q80 420 180 470 Q280 380 380 440 Q480 360 580 430 Q680 380 780 440 Q880 370 980 440 Q1080 400 1200 430 L1200 800 L0 800Z"
          fill="#0E5662"
          opacity="0.3"
        />

        {/* Mountain layer 2 */}
        <path
          d="M0 570 Q100 490 200 530 Q300 460 400 510 Q500 450 600 500 Q700 460 800 500 Q900 450 1000 510 Q1100 470 1200 500 L1200 800 L0 800Z"
          fill="#126771"
          opacity="0.25"
        />

        {/* Mountain layer 1 — front */}
        <path
          d="M0 630 Q100 560 200 590 Q300 540 400 580 Q500 540 600 570 Q700 540 800 570 Q900 540 1000 580 Q1100 555 1200 570 L1200 800 L0 800Z"
          fill="#178991"
          opacity="0.15"
        />
      </g>
    </svg>
  );
}
