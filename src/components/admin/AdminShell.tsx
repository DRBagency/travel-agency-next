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
  LifeBuoy,
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
  { label: "Documentos", href: "/admin/documentos", icon: FileText },
  { label: "Soporte", href: "/admin/soporte", icon: LifeBuoy },
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
    <div className="min-h-screen bg-gradient-to-br from-drb-turquoise-950 to-drb-turquoise-900 text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-drb-turquoise-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl"
              style={{
                background: primaryColor
                  ? `linear-gradient(135deg, ${primaryColor}, color-mix(in srgb, ${primaryColor} 65%, #1CABB0))`
                  : "linear-gradient(135deg, #1CABB0, #D4F24D)",
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
              className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-white/70 hover:text-white hover:border-drb-turquoise-400/50 transition-all"
            >
              Cerrar sesión
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
        <aside className="space-y-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition-all hover:bg-drb-turquoise-500/15 hover:text-white"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </a>
          ))}
        </aside>

        <main className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
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
    </div>
  );
};

export default AdminShell;
