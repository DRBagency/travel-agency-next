"use client";

/**
 * Mountain landscape background for the dashboard main area.
 * Fixed to viewport, covers full screen.
 * Dark mode: sky gradient + stars + crescent moon + 4 peaked mountain layers + pines.
 * Light mode: turquoise sky gradient + 3 peaked mountain layers.
 * Mountains use angular peaks (not rounded curves) to look like real mountains.
 */
export default function DashboardBackground() {
  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      viewBox="0 0 1600 900"
      fill="none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Dark mode sky gradient */}
        <linearGradient id="dashSkyDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#041820" />
          <stop offset="35%" stopColor="#072331" />
          <stop offset="65%" stopColor="#0C4551" />
          <stop offset="100%" stopColor="#126771" />
        </linearGradient>
        {/* Light mode sky gradient */}
        <linearGradient id="dashSkyLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#E6F9FA" />
          <stop offset="100%" stopColor="#B3EFF2" />
        </linearGradient>
        {/* Moon glow — warm lime-white */}
        <radialGradient id="dashMoonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4F24D" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#D4F24D" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#D4F24D" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ===== LIGHT MODE ===== */}
      <g className="dark:hidden">
        <rect width="1600" height="900" fill="url(#dashSkyLight)" opacity="0.6" />

        {/* Mountain layer 3 — farthest, soft turquoise */}
        <path
          d="M0 520 L60 470 L130 500 L200 430 L280 480 L360 400 L440 460 L520 380 L600 440 L680 390 L760 450 L840 370 L920 430 L1000 380 L1080 440 L1160 400 L1240 460 L1320 410 L1400 450 L1480 420 L1560 460 L1600 440 L1600 900 L0 900Z"
          fill="#B3EFF2"
          opacity="0.20"
        />

        {/* Mountain layer 2 — middle */}
        <path
          d="M0 590 L80 530 L160 570 L250 490 L340 550 L430 480 L510 540 L600 470 L690 530 L780 480 L860 540 L950 460 L1040 520 L1120 480 L1200 530 L1290 470 L1380 520 L1460 490 L1540 530 L1600 510 L1600 900 L0 900Z"
          fill="#80E5E9"
          opacity="0.15"
        />

        {/* Mountain layer 1 — front */}
        <path
          d="M0 660 L100 600 L190 640 L280 580 L370 630 L470 570 L560 620 L650 580 L740 620 L830 570 L920 610 L1010 580 L1100 620 L1190 570 L1280 610 L1370 580 L1460 620 L1540 590 L1600 610 L1600 900 L0 900Z"
          fill="#4DD8DE"
          opacity="0.10"
        />
      </g>

      {/* ===== DARK MODE ===== */}
      <g className="hidden dark:block">
        <rect width="1600" height="900" fill="url(#dashSkyDark)" opacity="0.75" />

        {/* Stars — scattered across sky */}
        <circle cx="80" cy="45" r="1.1" fill="#fff" opacity="0.5" />
        <circle cx="190" cy="80" r="0.8" fill="#fff" opacity="0.35" />
        <circle cx="310" cy="35" r="1.3" fill="#fff" opacity="0.45" />
        <circle cx="420" cy="100" r="0.7" fill="#fff" opacity="0.3" />
        <circle cx="540" cy="55" r="1" fill="#fff" opacity="0.4" />
        <circle cx="660" cy="25" r="0.9" fill="#fff" opacity="0.45" />
        <circle cx="770" cy="90" r="0.6" fill="#fff" opacity="0.25" />
        <circle cx="880" cy="40" r="1.2" fill="#fff" opacity="0.4" />
        <circle cx="1000" cy="70" r="0.8" fill="#fff" opacity="0.35" />
        <circle cx="1120" cy="30" r="1" fill="#fff" opacity="0.5" />
        <circle cx="1240" cy="85" r="0.7" fill="#fff" opacity="0.3" />
        <circle cx="1360" cy="50" r="1.1" fill="#fff" opacity="0.4" />
        <circle cx="1480" cy="75" r="0.9" fill="#fff" opacity="0.35" />
        <circle cx="150" cy="160" r="0.6" fill="#fff" opacity="0.2" />
        <circle cx="350" cy="180" r="0.5" fill="#fff" opacity="0.15" />
        <circle cx="500" cy="150" r="0.7" fill="#fff" opacity="0.2" />
        <circle cx="720" cy="170" r="0.5" fill="#fff" opacity="0.15" />
        <circle cx="950" cy="140" r="0.6" fill="#fff" opacity="0.2" />
        <circle cx="1150" cy="155" r="0.5" fill="#fff" opacity="0.15" />
        <circle cx="1400" cy="130" r="0.7" fill="#fff" opacity="0.2" />
        <circle cx="260" cy="120" r="0.4" fill="#fff" opacity="0.12" />
        <circle cx="600" cy="115" r="0.5" fill="#fff" opacity="0.15" />
        <circle cx="1050" cy="110" r="0.4" fill="#fff" opacity="0.12" />
        <circle cx="1300" cy="175" r="0.6" fill="#fff" opacity="0.18" />

        {/* Moon — crescent with glow and craters */}
        {/* Outer glow */}
        <circle cx="1320" cy="95" r="60" fill="url(#dashMoonGlow)" />
        {/* Moon body — bright disc */}
        <circle cx="1320" cy="95" r="18" fill="#E8F4D0" opacity="0.2" />
        {/* Shadow to create crescent shape — overlapping dark circle */}
        <circle cx="1330" cy="88" r="15" fill="#072331" opacity="0.2" />
        {/* Crater details on the lit part */}
        <circle cx="1312" cy="90" r="2.5" fill="#D4F24D" opacity="0.06" />
        <circle cx="1318" cy="102" r="1.8" fill="#D4F24D" opacity="0.05" />
        <circle cx="1310" cy="98" r="1.2" fill="#D4F24D" opacity="0.04" />

        {/* Mountain layer 4 — farthest, brightest teal */}
        <path
          d="M0 480 L70 420 L140 460 L220 370 L310 430 L400 350 L480 410 L570 340 L660 400 L740 350 L830 420 L920 340 L1010 390 L1090 340 L1180 400 L1260 360 L1350 420 L1440 370 L1520 410 L1600 380 L1600 900 L0 900Z"
          fill="#33CFD7"
          opacity="0.16"
        />

        {/* Mountain layer 3 */}
        <path
          d="M0 540 L90 470 L170 520 L260 430 L350 490 L440 410 L530 470 L620 400 L710 460 L800 410 L890 470 L980 390 L1060 450 L1150 400 L1240 460 L1330 410 L1420 470 L1500 430 L1600 450 L1600 900 L0 900Z"
          fill="#1CABB0"
          opacity="0.14"
        />

        {/* Mountain layer 2 */}
        <path
          d="M0 600 L100 540 L190 580 L280 500 L370 560 L460 490 L550 540 L640 480 L730 540 L820 490 L910 550 L1000 470 L1090 530 L1180 480 L1270 540 L1360 490 L1440 530 L1530 500 L1600 520 L1600 900 L0 900Z"
          fill="#126771"
          opacity="0.16"
        />

        {/* Mountain layer 1 — closest, dark silhouette */}
        <path
          d="M0 670 L80 620 L160 660 L250 590 L340 640 L430 580 L520 630 L610 590 L700 630 L790 580 L870 620 L960 580 L1050 630 L1140 580 L1230 620 L1320 580 L1400 620 L1490 600 L1560 630 L1600 610 L1600 900 L0 900Z"
          fill="#0C4551"
          opacity="0.18"
        />

        {/* Pine tree silhouettes along bottom */}
        <path
          d="M0 740 L12 718 L24 740 L36 712 L48 740 L60 710 L72 740 L84 715 L96 740 L108 708 L120 740 L132 716 L144 740 L156 710 L168 740 L180 714 L192 740 L204 708 L216 740 L228 716 L240 740 L252 710 L264 740 L276 714 L288 740 L300 708 L312 740 L324 716 L336 740 L348 712 L360 740 L372 710 L384 740 L396 715 L408 740 L420 708 L432 740 L444 714 L456 740 L468 710 L480 740 L492 716 L504 740 L516 712 L528 740 L540 708 L552 740 L564 714 L576 740 L588 710 L600 740 L612 716 L624 740 L636 712 L648 740 L660 710 L672 740 L684 715 L696 740 L708 708 L720 740 L732 714 L744 740 L756 710 L768 740 L780 716 L792 740 L804 712 L816 740 L828 710 L840 740 L852 714 L864 740 L876 708 L888 740 L900 716 L912 740 L924 710 L936 740 L948 714 L960 740 L972 708 L984 740 L996 716 L1008 740 L1020 712 L1032 740 L1044 710 L1056 740 L1068 714 L1080 740 L1092 708 L1104 740 L1116 716 L1128 740 L1140 712 L1152 740 L1164 710 L1176 740 L1188 714 L1200 740 L1212 708 L1224 740 L1236 716 L1248 740 L1260 710 L1272 740 L1284 714 L1296 740 L1308 708 L1320 740 L1332 716 L1344 740 L1356 712 L1368 740 L1380 710 L1392 740 L1404 714 L1416 740 L1428 708 L1440 740 L1452 716 L1464 740 L1476 712 L1488 740 L1500 710 L1512 740 L1524 714 L1536 740 L1548 708 L1560 740 L1572 716 L1584 740 L1600 735 L1600 900 L0 900Z"
          fill="#0C4551"
          opacity="0.12"
        />
      </g>
    </svg>
  );
}
