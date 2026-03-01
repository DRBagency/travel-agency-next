"use client";

import { ReactNode, useCallback } from "react";
import { useLandingTheme } from "@/components/landing/LandingThemeProvider";
import PortalNavbar from "./PortalNavbar";

interface PortalShellProps {
  children: ReactNode;
  logoUrl?: string | null;
  clientName: string;
  email: string;
  availableLanguages?: string[];
  currentLang?: string;
}

export default function PortalShell({
  children,
  logoUrl,
  clientName,
  email,
  availableLanguages,
  currentLang,
}: PortalShellProps) {
  const T = useLandingTheme();

  const handleLangChange = useCallback((lang: string) => {
    document.cookie = `LANDING_LOCALE=${lang};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    window.location.reload();
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <PortalNavbar
        logoUrl={logoUrl}
        clientName={clientName}
        email={email}
        availableLanguages={availableLanguages}
        currentLang={currentLang}
        onLangChange={handleLangChange}
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
