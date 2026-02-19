"use client";

/**
 * Very subtle mountain landscape for the dashboard main content area.
 * Uses warm/lime tones at very low opacity — barely visible watermark effect.
 * Light mode: pale green mountains on white.
 * Dark mode: dark turquoise mountains on dark bg.
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
      {/* Light mode layers */}
      <g className="dark:hidden">
        {/* Subtle sky tint */}
        <rect width="1200" height="800" fill="#E6F9FA" opacity="0.3" />

        {/* Mountain layer 3 — far, lime tint */}
        <path
          d="M0 520 Q100 400 200 460 Q300 380 400 440 Q500 360 600 420 Q700 370 800 430 Q900 380 1000 450 Q1100 400 1200 440 L1200 800 L0 800Z"
          fill="#EBFBC3"
          opacity="0.08"
        />

        {/* Mountain layer 2 — mid, turquoise tint */}
        <path
          d="M0 580 Q80 480 180 530 Q280 450 380 510 Q480 440 580 500 Q680 460 780 510 Q880 450 980 520 Q1080 470 1200 500 L1200 800 L0 800Z"
          fill="#99E7EB"
          opacity="0.1"
        />

        {/* Mountain layer 1 — front, slightly stronger */}
        <path
          d="M0 640 Q100 560 200 600 Q300 540 400 590 Q500 550 600 580 Q700 540 800 580 Q900 550 1000 590 Q1100 560 1200 580 L1200 800 L0 800Z"
          fill="#66DBE1"
          opacity="0.08"
        />
      </g>

      {/* Dark mode layers */}
      <g className="hidden dark:block">
        {/* Mountain layer 3 — far */}
        <path
          d="M0 520 Q100 400 200 460 Q300 380 400 440 Q500 360 600 420 Q700 370 800 430 Q900 380 1000 450 Q1100 400 1200 440 L1200 800 L0 800Z"
          fill="#0C4551"
          opacity="0.06"
        />

        {/* Mountain layer 2 — mid */}
        <path
          d="M0 580 Q80 480 180 530 Q280 450 380 510 Q480 440 580 500 Q680 460 780 510 Q880 450 980 520 Q1080 470 1200 500 L1200 800 L0 800Z"
          fill="#126771"
          opacity="0.08"
        />

        {/* Mountain layer 1 — front */}
        <path
          d="M0 640 Q100 560 200 600 Q300 540 400 590 Q500 550 600 580 Q700 540 800 580 Q900 550 1000 590 Q1100 560 1200 580 L1200 800 L0 800Z"
          fill="#178991"
          opacity="0.06"
        />
      </g>
    </svg>
  );
}
