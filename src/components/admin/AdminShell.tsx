"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  LayoutDashboard,
  Globe,
  Star,
  MapPin,
  CalendarCheck,
  BarChart3,
  Calendar,
  FileText,
  Headphones,
  CreditCard,
  Mail,
  Scale,
  LogOut,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface AdminShellProps {
  clientName: string;
  clientEmail?: string;
  plan?: string;
  primaryColor?: string | null;
  logoUrl?: string | null;
  subscriptionActive?: boolean;
  children: ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Mi Web", href: "/admin/mi-web", icon: Globe },
  { label: "Opiniones", href: "/admin/opiniones", icon: Star },
  { label: "Destinos", href: "/admin/destinos", icon: MapPin },
  { label: "Reservas", href: "/admin/reservas", icon: CalendarCheck },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Calendario", href: "/admin/calendario", icon: Calendar },
  { label: "Documentos", href: "/admin/documentos", icon: FileText },
  { label: "Soporte", href: "/admin/soporte", icon: Headphones },
  { label: "Stripe / Pagos", href: "/admin/stripe", icon: CreditCard },
  { label: "Emails", href: "/admin/emails", icon: Mail },
  { label: "Legales", href: "/admin/legales", icon: Scale },
];

function SidebarNav({
  items,
  pathname,
  onNavigate,
  clientName,
  logoUrl,
  primaryColor,
  plan,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
  clientName: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  plan?: string;
}) {
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="flex flex-col h-full">
      {/* Logo + agency name */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark:border-white/10">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={clientName}
            className="h-9 w-9 rounded-xl object-contain"
          />
        ) : (
          <div
            className="h-9 w-9 rounded-xl"
            style={{
              background: primaryColor
                ? `linear-gradient(135deg, ${primaryColor}, #1CABB0)`
                : "linear-gradient(135deg, #1CABB0, #D4F24D)",
            }}
          />
        )}
        <div className="min-w-0">
          <div className="font-display text-sm font-semibold text-gray-900 dark:text-white truncate">
            {clientName}
          </div>
          {plan && (
            <div className="text-xs text-gray-500 dark:text-white/50">
              Plan {plan}
            </div>
          )}
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {items.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all ${
                active
                  ? "bg-drb-turquoise-50 text-drb-turquoise-700 dark:bg-drb-turquoise-900/30 dark:text-drb-turquoise-300 border-l-[3px] border-drb-turquoise-500"
                  : "text-gray-600 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white border-l-[3px] border-transparent"
              }`}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* CTA banner */}
      <div className="p-4">
        <div className="rounded-2xl bg-gradient-to-br from-drb-turquoise-500 to-drb-turquoise-600 p-4 text-white">
          <Sparkles className="w-5 h-5 mb-2" />
          <p className="text-sm font-semibold">Mejora tu plan</p>
          <p className="text-xs text-white/80 mt-1">
            Desbloquea todas las funciones premium.
          </p>
          <Link
            href="/admin/stripe"
            className="mt-3 inline-flex items-center text-xs font-semibold bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 transition-colors"
          >
            Ver planes
          </Link>
        </div>
      </div>
    </div>
  );
}

const AdminShell = ({
  clientName,
  clientEmail,
  plan,
  primaryColor,
  logoUrl,
  subscriptionActive = true,
  children,
}: AdminShellProps) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const allowWhenInactive = pathname.startsWith("/admin/stripe");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 z-40 hidden lg:flex flex-col">
        <SidebarNav
          items={navItems}
          pathname={pathname}
          clientName={clientName}
          logoUrl={logoUrl}
          primaryColor={primaryColor}
          plan={plan}
        />
      </aside>

      {/* Header */}
      <header className="sticky top-0 z-30 lg:ml-[280px] bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 lg:px-8 h-16">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors lg:hidden">
                  <Menu className="w-5 h-5 text-gray-600 dark:text-white" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800">
                <SidebarNav
                  items={navItems}
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                  clientName={clientName}
                  logoUrl={logoUrl}
                  primaryColor={primaryColor}
                  plan={plan}
                />
              </SheetContent>
            </Sheet>

            {/* Agency info (mobile only) */}
            <div className="flex items-center gap-2 lg:hidden">
              {logoUrl ? (
                <img src={logoUrl} alt={clientName} className="h-7 w-7 rounded-lg object-contain" />
              ) : (
                <div
                  className="h-7 w-7 rounded-lg"
                  style={{
                    background: primaryColor
                      ? `linear-gradient(135deg, ${primaryColor}, #1CABB0)`
                      : "linear-gradient(135deg, #1CABB0, #D4F24D)",
                  }}
                />
              )}
              <span className="font-display text-sm font-semibold text-gray-900 dark:text-white">
                {clientName}
              </span>
            </div>

            {/* Desktop: page context */}
            <span className="text-sm text-gray-500 dark:text-white/50 hidden lg:block">
              Panel de gestión
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-800">
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {clientName}
                </div>
                {clientEmail && (
                  <div className="text-xs text-gray-500 dark:text-white/50">
                    {clientEmail}
                  </div>
                )}
              </div>
              <a
                href="/admin/logout"
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4 text-gray-500 dark:text-white/60" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="lg:ml-[280px] px-4 lg:px-8 py-6">
        {subscriptionActive || allowWhenInactive ? (
          children
        ) : (
          <div className="space-y-4">
            <div className="panel-card p-6 border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Tu suscripción no está activa
              </h2>
              <p className="text-sm text-gray-600 dark:text-white/70 mt-2">
                Activa la suscripción para acceder a todas las funciones del panel.
              </p>
            </div>
            <div className="flex justify-end">
              <a
                href="/admin/stripe"
                className="px-5 py-3 rounded-full bg-drb-turquoise-500 hover:bg-drb-turquoise-600 text-white font-semibold transition-all hover:scale-105"
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
