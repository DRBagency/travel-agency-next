"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Pin,
  PinOff,
} from "lucide-react";

interface AdminShellProps {
  clientName: string;
  primaryColor?: string | null;
  logoUrl?: string | null;
  subscriptionActive?: boolean;
  allowWhenInactive?: boolean;
  children: ReactNode;
}

const navItems = [
  { label: "Dashboard", href: "/admin", emoji: "\u{1F3E0}" },
  { label: "Mi Web", href: "/admin/mi-web", emoji: "\u{1F310}" },
  { label: "Opiniones", href: "/admin/opiniones", emoji: "\u{2B50}" },
  { label: "Destinos", href: "/admin/destinos", emoji: "\u{1F30D}" },
  { label: "Reservas", href: "/admin/reservas", emoji: "\u{1F4CB}" },
  { label: "Analytics", href: "/admin/analytics", emoji: "\u{1F4CA}" },
  { label: "Calendario", href: "/admin/calendario", emoji: "\u{1F4C5}" },
  { label: "Documentos", href: "/admin/documentos", emoji: "\u{1F4C4}" },
  { label: "Soporte", href: "/admin/soporte", emoji: "\u{1F6E0}\u{FE0F}" },
  { label: "Stripe / Pagos", href: "/admin/stripe", emoji: "\u{1F4B3}" },
  { label: "Emails", href: "/admin/emails", emoji: "\u{1F4E7}" },
  { label: "Legales", href: "/admin/legales", emoji: "\u{1F4DC}" },
];

const AdminShell = ({
  clientName,
  primaryColor,
  logoUrl,
  subscriptionActive = true,
  allowWhenInactive = false,
  children,
}: AdminShellProps) => {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [ready, setReady] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  useEffect(() => {
    const stored = localStorage.getItem("admin-sidebar-pinned");
    if (stored === "true") setPinned(true);
    setReady(true);
  }, []);

  const togglePin = () => {
    const next = !pinned;
    setPinned(next);
    localStorage.setItem("admin-sidebar-pinned", String(next));
    if (next) setNavOpen(false);
  };

  return (
    <div className={`-mt-20 min-h-screen bg-gradient-to-b from-drb-turquoise-800 via-drb-turquoise-700 to-drb-turquoise-600 text-white transition-opacity duration-100 ${ready ? "opacity-100" : "opacity-0"}`}>
      {/* Pinned sidebar */}
      {pinned && (
        <nav className="fixed left-0 top-0 bottom-0 w-72 bg-drb-turquoise-800 border-r border-white/10 z-50 overflow-y-auto">
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={clientName}
                  className="h-8 w-8 rounded-lg object-contain"
                />
              ) : (
                <div
                  className="h-8 w-8 rounded-lg"
                  style={{
                    background: primaryColor
                      ? `linear-gradient(135deg, ${primaryColor}, #1CABB0)`
                      : "linear-gradient(135deg, #1CABB0, #D4F24D)",
                  }}
                />
              )}
              <span className="font-semibold">{clientName}</span>
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
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition-all ${
                  isActive(item.href)
                    ? "bg-white/15 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-lg leading-none">{item.emoji}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-40 border-b border-white/10 bg-drb-turquoise-800/80 backdrop-blur-md ${pinned ? "ml-72" : ""}`}>
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            {/* Hamburger — only when not pinned */}
            {!pinned && (
              <button
                onClick={() => setNavOpen(true)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
            )}
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={clientName}
                  className="h-8 w-8 rounded-lg object-contain"
                />
              ) : (
                <div
                  className="h-8 w-8 rounded-lg"
                  style={{
                    background: primaryColor
                      ? `linear-gradient(135deg, ${primaryColor}, color-mix(in srgb, ${primaryColor} 65%, #1CABB0))`
                      : "linear-gradient(135deg, #1CABB0, #D4F24D)",
                  }}
                />
              )}
              <div className="font-display text-base font-semibold">{clientName}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 h-8">
            <span className="text-sm text-white/50 hidden sm:block">Área de gestión</span>
            <a
              href="/admin/logout"
              className="rounded-full border border-white/15 px-4 h-8 flex items-center text-sm text-white/70 hover:text-white hover:border-white/30 transition-all"
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
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={clientName}
                    className="h-8 w-8 rounded-lg object-contain"
                  />
                ) : (
                  <div
                    className="h-8 w-8 rounded-lg"
                    style={{
                      background: primaryColor
                        ? `linear-gradient(135deg, ${primaryColor}, #1CABB0)`
                        : "linear-gradient(135deg, #1CABB0, #D4F24D)",
                    }}
                  />
                )}
                <span className="font-semibold">{clientName}</span>
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
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setNavOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition-all ${
                    isActive(item.href)
                      ? "bg-white/15 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="text-lg leading-none">{item.emoji}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </>
      )}

      {/* Main content */}
      <main className={`w-full max-w-7xl mx-auto px-6 py-8 ${pinned ? "ml-72" : ""}`}>
        {subscriptionActive || allowWhenInactive ? (
          children
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6">
              <h2 className="text-xl font-semibold">Tu suscripción no está activa</h2>
              <p className="text-sm text-white/70 mt-2">
                Activa la suscripción para acceder a todas las funciones del panel.
              </p>
            </div>
            <div className="flex justify-end">
              <a
                href="/admin/stripe"
                className="px-5 py-3 rounded-full bg-drb-magenta-500 hover:bg-drb-magenta-600 text-white font-semibold transition-all hover:scale-105"
              >
                Activar suscripción
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminShell;
