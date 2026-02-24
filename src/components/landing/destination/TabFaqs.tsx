"use client";

import { useLandingTheme } from "../LandingThemeProvider";
import { Accordion } from "../ui/Accordion";

const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

interface Faq {
  question: string;
  answer: string;
}

interface TabFaqsProps {
  faqs: Faq[];
}

export function TabFaqs({ faqs }: TabFaqsProps) {
  const T = useLandingTheme();

  return (
    <div
      style={{
        background: T.bg2,
        borderRadius: 22,
        border: `1.5px solid ${T.border}`,
        padding: "8px 28px",
      }}
    >
      {faqs.map((faq, i) => (
        <Accordion
          key={i}
          title={faq.question}
          defaultOpen={i === 0}
        >
          <p
            style={{
              fontFamily: FONT2,
              color: T.sub,
              fontSize: 15,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {faq.answer}
          </p>
        </Accordion>
      ))}
    </div>
  );
}
