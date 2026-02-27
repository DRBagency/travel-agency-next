"use client";

import { useLandingTheme } from "../LandingThemeProvider";
import { Accordion } from "../ui/Accordion";

const FONT2 = `var(--font-dm), DM Sans, sans-serif`;

/* eslint-disable @typescript-eslint/no-explicit-any */

interface TabFaqsProps {
  faqs: any[];
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
      {faqs.map((faq, i) => {
        const question = faq.pregunta || faq.question;
        const answer = faq.respuesta || faq.answer;
        return (
          <Accordion
            key={i}
            title={question}
            defaultOpen
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
              {answer}
            </p>
          </Accordion>
        );
      })}
    </div>
  );
}
