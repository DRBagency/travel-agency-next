"use client";

import { useLandingTheme } from "../LandingThemeProvider";
import { AnimateIn } from "../ui/AnimateIn";

const FONT = `var(--font-syne), Syne, sans-serif`;
const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface WhyUsItem {
  icon: string;
  title: string;
  description: string;
}

interface WhyUsProps {
  items?: WhyUsItem[];
  sectionTitle?: string;
  sectionSubtitle?: string;
}

const DEFAULT_ITEMS: WhyUsItem[] = [
  {
    icon: "🛡️",
    title: "Seguridad total",
    description:
      "Viaja con la tranquilidad de saber que cada detalle esta cubierto. Seguro completo incluido en todos nuestros viajes.",
  },
  {
    icon: "💎",
    title: "Experiencias unicas",
    description:
      "Acceso a experiencias exclusivas y destinos seleccionados que no encontraras en otras agencias.",
  },
  {
    icon: "🤝",
    title: "Atencion personalizada",
    description:
      "Un equipo dedicado a ti desde el primer momento. Te acompanamos antes, durante y despues del viaje.",
  },
  {
    icon: "💰",
    title: "Mejor precio garantizado",
    description:
      "Precios competitivos sin comprometer la calidad. Si encuentras un precio mejor, lo igualamos.",
  },
];

export default function WhyUs({
  items,
  sectionTitle = "¿Por que elegirnos?",
  sectionSubtitle,
}: WhyUsProps) {
  const T = useLandingTheme();
  const cards = items && items.length > 0 ? items.slice(0, 4) : DEFAULT_ITEMS;

  return (
    <section id="why" style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Section heading */}
        <AnimateIn>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: "clamp(28px, 4vw, 42px)",
                color: T.text,
                margin: 0,
                marginBottom: 12,
                letterSpacing: "-0.5px",
              }}
            >
              {sectionTitle}
            </h2>
            {sectionSubtitle && (
              <p
                style={{
                  fontFamily: FONT2,
                  fontSize: 17,
                  color: T.sub,
                  margin: 0,
                  maxWidth: 500,
                  marginLeft: "auto",
                  marginRight: "auto",
                  lineHeight: 1.6,
                }}
              >
                {sectionSubtitle}
              </p>
            )}
          </div>
        </AnimateIn>

        {/* 4-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 22,
          }}
          className="whyus-grid"
        >
          {cards.map((item, i) => (
            <AnimateIn key={i} delay={i * 0.1}>
              <div
                style={{
                  background: T.bg2,
                  border: `1px solid ${T.border}`,
                  borderRadius: 22,
                  padding: 30,
                  transition: "all .4s cubic-bezier(.16,1,.3,1)",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = `0 16px 40px ${T.shadow}`;
                  e.currentTarget.style.borderColor = `${T.accent}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = T.border;
                }}
              >
                <div
                  style={{
                    fontSize: 40,
                    marginBottom: 18,
                    lineHeight: 1,
                  }}
                >
                  {item.icon}
                </div>
                <h3
                  style={{
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: 18,
                    color: T.text,
                    margin: 0,
                    marginBottom: 10,
                    letterSpacing: "-.2px",
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: FONT2,
                    fontWeight: 400,
                    fontSize: 14,
                    color: T.sub,
                    margin: 0,
                    lineHeight: 1.65,
                  }}
                >
                  {item.description}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>

      <style>{`
        .whyus-grid {
          grid-template-columns: repeat(4, 1fr);
        }
        @media (max-width: 900px) {
          .whyus-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 520px) {
          .whyus-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
