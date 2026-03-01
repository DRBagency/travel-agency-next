"use client";

import { ReactNode } from "react";
import { useLandingTheme } from "@/components/landing/LandingThemeProvider";
import PortalNavbar from "./PortalNavbar";

interface PortalShellProps {
  children: ReactNode;
  logoUrl?: string | null;
  clientName: string;
  email: string;
  availableLanguages?: string[];
  currentLang?: string;
  onLangChange?: (lang: string) => void;
}

export default function PortalShell({
  children,
  logoUrl,
  clientName,
  email,
  availableLanguages,
  currentLang,
  onLangChange,
}: PortalShellProps) {
  const T = useLandingTheme();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <PortalNavbar
        logoUrl={logoUrl}
        clientName={clientName}
        email={email}
        availableLanguages={availableLanguages}
        currentLang={currentLang}
        onLangChange={onLangChange}
      />

      {/* Main content */}
      <main
        style={{
          flex: 1,
          maxWidth: 1024,
          width: "100%",
          margin: "0 auto",
          padding: "32px 20px",
        }}
      >
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: `1px solid ${T.border}`,
          padding: "20px 24px",
          textAlign: "center",
          fontSize: 12,
          color: T.muted,
        }}
      >
        <span>{clientName}</span>
        <span style={{ margin: "0 8px" }}>·</span>
        <span>Powered by DRB Agency</span>
      </footer>
    </div>
  );
}
