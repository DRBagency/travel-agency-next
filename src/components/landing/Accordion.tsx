"use client";

import { useState, type ReactNode } from "react";
import { useLandingTheme } from "./LandingThemeProvider";

export function Accordion({
  title, children, defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const T = useLandingTheme();

  return (
    <div style={{ borderBottom: `1px solid ${T.brd}`, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "none", border: "none", cursor: "pointer", textAlign: "start", padding: "16px 0",
      }}>
        <span style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: T.txt }}>{title}</span>
        <span style={{ fontSize: 18, color: T.accent, transition: "transform .3s", transform: open ? "rotate(180deg)" : "none" }}>{"\u25BE"}</span>
      </button>
      <div style={{ maxHeight: open ? 500 : 0, transition: "max-height .5s cubic-bezier(.16,1,.3,1)", overflow: "hidden" }}>
        <div style={{ paddingBottom: 16 }}>{children}</div>
      </div>
    </div>
  );
}
