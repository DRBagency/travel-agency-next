"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useLandingTheme } from "../LandingThemeProvider";
import { AnimateIn, useInView } from "../ui/AnimateIn";

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface StatsProps {
  travelers?: string;
  destinations?: string;
  rating?: string;
  repeat?: string;
}

function AnimatedNumber({ value, visible }: { value: string; visible: boolean }) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!visible) return;

    // Extract numeric part
    const str = String(value);
    const numMatch = str.match(/[\d.]+/);
    if (!numMatch) {
      setDisplay(str);
      return;
    }

    const target = parseFloat(numMatch[0]);
    const prefix = str.slice(0, str.indexOf(numMatch[0]));
    const suffix = str.slice(str.indexOf(numMatch[0]) + numMatch[0].length);
    const isDecimal = numMatch[0].includes(".");
    const duration = 1500;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      if (isDecimal) {
        setDisplay(`${prefix}${current.toFixed(1)}${suffix}`);
      } else {
        setDisplay(`${prefix}${Math.round(current)}${suffix}`);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplay(str);
      }
    };

    requestAnimationFrame(animate);
  }, [visible, value]);

  return <>{display}</>;
}

export default function Stats({
  travelers = "15K+",
  destinations = "50+",
  rating = "4.9",
  repeat = "92%",
}: StatsProps) {
  const T = useLandingTheme();
  const t = useTranslations('landing.stats');
  const [ref, visible] = useInView();

  const stats = [
    { emoji: "🌍", value: travelers, label: t('travelers') },
    { emoji: "📍", value: destinations, label: t('uniqueDests') },
    { emoji: "⭐", value: rating, label: t('avgRating') },
    { emoji: "🔁", value: repeat, label: t('repeat') },
  ];

  return (
    <section style={{ padding: "60px 24px" }} ref={ref}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
        }}
        className="stats-grid"
      >
        {stats.map((stat, i) => (
          <AnimateIn key={i} delay={i * 0.1}>
            <div
              style={{
                background: T.glass,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: `1px solid ${T.border}`,
                borderRadius: 20,
                padding: 28,
                textAlign: "center",
                transition: "all .4s cubic-bezier(.16,1,.3,1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 12px 32px ${T.shadow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>{stat.emoji}</div>
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 36,
                  color: T.text,
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                <AnimatedNumber value={stat.value} visible={visible} />
              </div>
              <div
                style={{
                  fontFamily: FONT2,
                  fontWeight: 500,
                  fontSize: 14,
                  color: T.muted,
                  lineHeight: 1.4,
                }}
              >
                {stat.label}
              </div>
            </div>
          </AnimateIn>
        ))}
      </div>

      <style>{`
        .stats-grid {
          grid-template-columns: repeat(4, 1fr);
        }
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
