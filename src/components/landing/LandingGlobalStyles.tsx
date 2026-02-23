"use client";

import type { LandingTheme } from "@/lib/landing-theme";

export function LandingGlobalStyles({ theme: T }: { theme: LandingTheme }) {
  return (
    <style>{`
      /* Landing-specific resets */
      .noise-bg { position: relative; }
      .noise-bg::before {
        content: '';
        position: fixed; inset: 0; z-index: 0; pointer-events: none;
        opacity: ${T.mode === "dark" ? ".03" : ".015"};
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        background-size: 200px;
      }

      /* Selection */
      .noise-bg ::selection { background: ${T.accent}; color: #fff; }

      /* Nav links */
      .navl { color: ${T.sub}; text-decoration: none; font-size: 14px; font-weight: 500; transition: all .3s; position: relative; }
      .navl:hover { color: ${T.accent}; }
      .navl::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px; background: ${T.accent}; transition: width .3s; }
      .navl:hover::after { width: 100%; }

      /* Destination cards */
      .dcard { position: relative; border-radius: 24px; overflow: hidden; cursor: pointer; transition: all .5s cubic-bezier(.16,1,.3,1); box-shadow: 0 2px 12px ${T.shadow}; }
      .dcard:hover { transform: translateY(-10px); box-shadow: 0 24px 48px ${T.shadowHover}; }
      .dcard:hover img { transform: scale(1.08); }

      /* Tab buttons */
      .tab-btn { padding: 10px 22px; border-radius: 50px; white-space: nowrap; cursor: pointer; font-size: 14px; font-family: var(--font-dm), 'DM Sans', sans-serif; font-weight: 500; transition: all .3s; }
      .tab-btn.active { background: linear-gradient(135deg, ${T.accent}, #15868a); color: #fff; border: none; box-shadow: 0 4px 16px rgba(28,171,176,.25); }
      .tab-btn:not(.active) { background: ${T.bg2}; color: ${T.sub}; border: 1.5px solid ${T.brd}; }
      .tab-btn:not(.active):hover { border-color: ${T.accent}; color: ${T.accent}; }

      /* Floating animation */
      .floating { animation: float 6s ease-in-out infinite; }
      @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
      @keyframes pulse { 0%, 100% { opacity: .06; } 50% { opacity: .12; } }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }

      /* Glow orbs */
      .glow { position: absolute; border-radius: 50%; filter: blur(140px); pointer-events: none; }

      /* Responsive */
      @media (max-width: 768px) {
        .hide-mobile { display: none !important; }
        .grid-responsive { grid-template-columns: 1fr !important; }
        .flex-responsive { flex-direction: column !important; }
      }

      /* Scrollbar (landing only) */
      .noise-bg ::-webkit-scrollbar { width: 8px; }
      .noise-bg ::-webkit-scrollbar-track { background: ${T.bg}; }
      .noise-bg ::-webkit-scrollbar-thumb { background: ${T.brd}; border-radius: 4px; }
      .noise-bg ::-webkit-scrollbar-thumb:hover { background: ${T.accent}; }
    `}</style>
  );
}
