"use client";

import { ReactNode } from "react";
import {
  LayoutGrid,
  PenSquare,
  Map,
  FileText,
  ClipboardList,
  CreditCard,
  BarChart3,
  Calendar,
} from "lucide-react";

interface AdminShellProps {
  clientName: string;
  primaryColor?: string | null;
  subscriptionActive?: boolean;
  allowWhenInactive?: boolean;
  children: ReactNode;
}

const navItems = [
  { label: "Resumen", href: "/admin", icon: LayoutGrid },
  { label: "Contenido", href: "/admin/contenido", icon: PenSquare },
  { label: "Opiniones", href: "/admin/opiniones", icon: ClipboardList },
  { label: "Nosotros + Contacto", href: "/admin/nosotros-contacto", icon: PenSquare },
  { label: "Destinos", href: "/admin/destinos", icon: Map },
  { label: "Reservas", href: "/admin/reservas", icon: ClipboardList },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Calendario", href: "/admin/calendario", icon: Calendar },
  { label: "Stripe / Pagos", href: "/admin/stripe", icon: CreditCard },
  { label: "Emails", href: "/admin/emails", icon: FileText },
  { label: "Legales", href: "/admin/legales", icon: FileText },
];

const AdminShell = ({
  clientName,
  primaryColor,
  subscriptionActive = true,
  allowWhenInactive = false,
  children,
}: AdminShellProps) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl"
              style={{
                background: primaryColor
                  ? `linear-gradient(135deg, ${primaryColor}, color-mix(in srgb, ${primaryColor} 65%, #22d3ee))`
                  : "linear-gradient(135deg, #0ea5e9, #22d3ee)",
              }}
            />
            <div>
              <div className="text-sm text-white/60">Panel de</div>
              <div className="font-display text-lg font-semibold">{clientName}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60">Área de gestión</span>
            <a
              href="/admin/logout"
              className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/70 hover:text-white hover:border-white/30 transition"
            >
              Cerrar sesión
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
        <aside className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </a>
          ))}
        </aside>

        <main className="rounded-2xl border border-white/10 bg-white/5 p-6">
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
                  className={
                    primaryColor
                      ? "px-5 py-3 rounded-xl text-white font-semibold"
                      : "px-5 py-3 rounded-xl bg-white text-slate-950 font-semibold"
                  }
                  style={primaryColor ? { backgroundColor: primaryColor } : undefined}
                >
                  Activar suscripción
                </a>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
