"use client";

import { useState, ReactNode } from "react";
import { useLandingTheme } from "../LandingThemeProvider";

interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Accordion({ title, children, defaultOpen }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen || false);
  const T = useLandingTheme();

  return (
    <div style={{ borderBottom: "1px solid " + T.border }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          padding: "20px 0",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-syne), Syne, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: T.text,
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontSize: 15,
            color: T.accent,
            transition: "transform .3s",
            transform: open ? "rotate(180deg)" : "none",
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: T.accent + "10",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          &#9662;
        </span>
      </button>
      <div
        style={{
          maxHeight: open ? 700 : 0,
          transition: "max-height .5s cubic-bezier(.16,1,.3,1)",
          overflow: "hidden",
        }}
      >
        <div style={{ paddingBottom: 20 }}>{children}</div>
      </div>
    </div>
  );
}
