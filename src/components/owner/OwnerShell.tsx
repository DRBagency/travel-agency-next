"use client";

import { ReactNode, useState, useEffect } from "react";
import {
  Menu,
  X,
  Pin,
  PinOff,
} from "lucide-react";

interface OwnerShellProps {
  children: ReactNode;
}

const navItems = [
  { label: "Dashboard", href: "/owner", emoji: "\u{1F3E0}" },
  { label: "Clientes", href: "/owner/clientes", emoji: "\u{1F465}" },
  { label: "Calendario", href: "/owner/calendario", emoji: "\u{1F4C5}" },
  { label: "Emails", href: "/owner/emails", emoji: "\u{1F4E7}" },
  { label: "Monetización", href: "/owner/monetizacion", emoji: "\u{1F4B0}" },
  { label: "Stripe", href: "/owner/stripe", emoji: "\u{1F4B3}" },
  { label: "Automatización", href: "/owner/automatizaciones", emoji: "\u{26A1}" },
  { label: "Soporte", href: "/owner/soporte", emoji: "\u{1F6E0}\u{FE0F}" },
];

export default function OwnerShell({ children }: OwnerShellProps) {
  const [navOpen, setNavOpen] = useState(false);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("owner-sidebar-pinned");
    if (stored === "true") setPinned(true);
  }, []);

  const togglePin = () => {
    const next = !pinned;
    setPinned(next);
    localStorage.setItem("owner-sidebar-pinned", String(next));
    if (next) setNavOpen(false);
  };

  return (
    <div className="-mt-20 min-h-screen bg-gradient-to-b from-drb-turquoise-800 via-drb-turquoise-700 to-drb-turquoise-600 text-white">
      {/* Pinned sidebar */}
      {pinned && (
        <nav className="fixed left-0 top-0 bottom-0 w-72 bg-drb-turquoise-800 border-r border-white/10 z-50 overflow-y-auto">
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-drb-turquoise-400 to-drb-lime-500" />
              <span className="font-semibold">DRB Agency</span>
            </div>
            <button
              onClick={togglePin}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="Desfijar sidebar"
            >
              <PinOff className="w-4 h-4 text-white/70" />
            </button>
          </div>
          <div className="p-3 space-y-0.5">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white"
              >
                <span className="text-lg leading-none">{item.emoji}</span>
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-40 border-b border-white/10 bg-drb-turquoise-800/80 backdrop-blur-md ${pinned ? "ml-72" : ""}`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {!pinned && (
              <button
                onClick={() => setNavOpen(true)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-drb-turquoise-400 to-drb-lime-500" />
              <div>
                <div className="text-xs text-white/50">Panel Owner</div>
                <div className="font-display text-base font-semibold">DRB Agency</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/50 hidden sm:block">Acceso restringido</span>
            <a
              href="/owner/logout"
              className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/70 hover:text-white hover:border-white/30 transition-all"
            >
              Cerrar sesión
            </a>
          </div>
        </div>
      </header>

      {/* Slide-out nav drawer — only when not pinned */}
      {!pinned && navOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in"
            onClick={() => setNavOpen(false)}
          />
          <nav className="fixed left-0 top-0 bottom-0 w-72 bg-drb-turquoise-800 border-r border-white/10 z-50 animate-slide-in-left overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-drb-turquoise-400 to-drb-lime-500" />
                <span className="font-semibold">DRB Agency</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={togglePin}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  title="Fijar sidebar"
                >
                  <Pin className="w-4 h-4 text-white/70" />
                </button>
                <button
                  onClick={() => setNavOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>
            </div>
            <div className="p-3 space-y-0.5">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setNavOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white"
                >
                  <span className="text-lg leading-none">{item.emoji}</span>
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        </>
      )}

      {/* Main content */}
      <main className={`w-full max-w-7xl mx-auto px-6 py-8 ${pinned ? "ml-72" : ""}`}>
        {children}
      </main>
    </div>
  );
}
