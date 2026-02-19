"use client";

/**
 * Subtle but VISIBLE mountain landscape for the dashboard main area.
 * Mountains at 15-25% opacity — visible in empty spaces between cards.
 * Light mode: turquoise pastels. Dark mode: dark turquoise tones.
 */
export default function DashboardBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1200 800"
      fill="none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Light mode subtle sky tint */}
        <linearGradient id="dashSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="60%" stopColor="#E6F9FA" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#CCF3F5" stopOpacity="0.5" />
        </linearGradient>
        {/* Dark mode sky */}
        <linearGradient id="dashSkyDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#041820" stopOpacity="0" />
          <stop offset="70%" stopColor="#072331" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0C4551" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Light mode */}
      <g className="dark:hidden">
        {/* Sky tint in lower half */}
        <rect width="1200" height="800" fill="url(#dashSky)" />

        {/* Mountain layer 3 — farthest */}
        <path
          d="M0 500 Q100 380 200 440 Q300 360 400 420 Q500 350 600 400 Q700 340 800 410 Q900 370 1000 430 Q1100 380 1200 420 L1200 800 L0 800Z"
          fill="#CCF3F5"
          opacity="0.3"
        />

        {/* Mountain layer 2 — middle */}
        <path
          d="M0 570 Q80 470 180 520 Q280 440 380 500 Q480 420 580 480 Q680 440 780 490 Q880 430 980 500 Q1080 460 1200 490 L1200 800 L0 800Z"
          fill="#99E7EB"
          opacity="0.25"
        />

        {/* Mountain layer 1 — front */}
        <path
          d="M0 630 Q100 550 200 590 Q300 530 400 580 Q500 540 600 570 Q700 530 800 570 Q900 540 1000 580 Q1100 550 1200 570 L1200 800 L0 800Z"
          fill="#66DBE1"
          opacity="0.2"
        />
      </g>

      {/* Dark mode */}
      <g className="hidden dark:block">
        <rect width="1200" height="800" fill="url(#dashSkyDark)" />

        <path
          d="M0 500 Q100 380 200 440 Q300 360 400 420 Q500 350 600 400 Q700 340 800 410 Q900 370 1000 430 Q1100 380 1200 420 L1200 800 L0 800Z"
          fill="#0C4551"
          opacity="0.2"
        />
        <path
          d="M0 570 Q80 470 180 520 Q280 440 380 500 Q480 420 580 480 Q680 440 780 490 Q880 430 980 500 Q1080 460 1200 490 L1200 800 L0 800Z"
          fill="#126771"
          opacity="0.15"
        />
        <path
          d="M0 630 Q100 550 200 590 Q300 530 400 580 Q500 540 600 570 Q700 530 800 570 Q900 540 1000 580 Q1100 550 1200 570 L1200 800 L0 800Z"
          fill="#178991"
          opacity="0.1"
        />
      </g>
    </svg>
  );
}
