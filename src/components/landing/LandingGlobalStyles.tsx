"use client";

import { useLandingTheme } from "./LandingThemeProvider";

export function LandingGlobalStyles() {
  const T = useLandingTheme();

  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;700&display=swap');

      .landing-wrap * { box-sizing: border-box; }
      .landing-wrap ::selection { background: ${T.accent}; color: #fff; }

      .nav-link {
        color: ${T.sub};
        text-decoration: none;
        font-size: 15px;
        font-weight: 600;
        font-family: var(--font-syne), Syne, sans-serif;
        transition: all .3s;
        letter-spacing: .3px;
      }
      .nav-link:hover { color: ${T.accent}; }

      .dest-card {
        position: relative;
        border-radius: 22px;
        overflow: hidden;
        cursor: pointer;
        transition: all .5s cubic-bezier(.16,1,.3,1);
        box-shadow: 0 2px 12px ${T.shadow};
      }
      .dest-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 22px 44px rgba(28,171,176,.14);
      }
      .dest-card:hover img { transform: scale(1.06); }

      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-16px); }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: none; }
      }
      @keyframes orbFloat1 {
        0%, 100% { transform: translate(0,0); }
        25% { transform: translate(35px,-25px); }
        50% { transform: translate(-15px,30px); }
        75% { transform: translate(-30px,-18px); }
      }
      @keyframes orbFloat2 {
        0%, 100% { transform: translate(0,0); }
        33% { transform: translate(-25px,35px); }
        66% { transform: translate(30px,-15px); }
      }
      @keyframes checkmark {
        0% { transform: scale(0); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
    `}</style>
  );
}
