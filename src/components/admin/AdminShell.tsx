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
  Search,
  Bell,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "@/components/ui/ThemeToggle";
import PageTransition from "@/components/ui/PageTransition";

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

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/mi-web": "Mi Web",
  "/admin/opiniones": "Opiniones",
  "/admin/destinos": "Destinos",
  "/admin/reservas": "Reservas",
  "/admin/analytics": "Analytics",
  "/admin/calendario": "Calendario",
  "/admin/documentos": "Documentos",
  "/admin/soporte": "Soporte",
  "/admin/stripe": "Stripe / Pagos",
  "/admin/emails": "Emails",
  "/admin/legales": "Legales",
};

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
    <div className="flex flex-col h-full bg-white dark:bg-[#0B1120]">
      {/* Logo + agency name */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-white/[0.06]">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={clientName}
            className="h-9 w-9 rounded-xl object-contain"
          />
        ) : (
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{
              background: primaryColor
                ? `linear-gradient(135deg, ${primaryColor}, #4A8FE7)`
                : "linear-gradient(135deg, #4A8FE7, #3B7DD8)",
            }}
          >
            {clientName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <div className="font-display text-sm font-semibold text-gray-900 dark:text-white truncate">
            {clientName}
          </div>
          {plan && (
            <div className="text-xs text-gray-400 dark:text-white/40">
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
                  ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* CTA banner with ocean background */}
      <div className="p-4">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500" />
          <div className="absolute inset-0 opacity-20 bg-[url('/images/sidebar-cta-bg.svg')] bg-cover bg-center" />
          <div className="relative p-4 text-white">
            <Sparkles className="w-5 h-5 mb-2 text-blue-200" />
            <p className="text-sm font-semibold">Mejora tu experiencia</p>
            <p className="text-xs text-white/70 mt-1">
              Desbloquea todas las funciones premium.
            </p>
            <Link
              href="/admin/stripe"
              className="mt-3 inline-flex items-center text-xs font-semibold bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 transition-colors backdrop-blur-sm"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="px-3 pb-4">
        <a
          href="/admin/logout"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-gray-400 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          Cerrar sesión
        </a>
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

  // Get page title from pathname
  const pageTitle = Object.entries(pageTitles).find(([path]) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  })?.[1] || "Panel";

  return (
    <div className="min-h-screen bg-[#F0F3F8] dark:bg-[#0B1120]">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-white dark:bg-[#0B1120] border-r border-gray-200/80 dark:border-white/[0.06] z-40 hidden lg:flex flex-col">
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
      <header className="sticky top-0 z-30 lg:ml-[260px] bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border-b border-gray-200/80 dark:border-white/[0.06]">
        <div className="flex items-center justify-between px-4 lg:px-8 h-16">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors lg:hidden">
                  <Menu className="w-5 h-5 text-gray-600 dark:text-white" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[260px] p-0 bg-white dark:bg-[#0B1120] border-r border-gray-200/80 dark:border-white/[0.06]">
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

            {/* Mobile branding */}
            <div className="flex items-center gap-2 lg:hidden">
              {logoUrl ? (
                <img src={logoUrl} alt={clientName} className="h-7 w-7 rounded-lg object-contain" />
              ) : (
                <div
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                  style={{
                    background: primaryColor
                      ? `linear-gradient(135deg, ${primaryColor}, #4A8FE7)`
                      : "linear-gradient(135deg, #4A8FE7, #3B7DD8)",
                  }}
                >
                  {clientName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Page title (desktop) */}
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white hidden lg:block">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Search bar (decorative) */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.06] w-64">
              <Search className="w-4 h-4 text-gray-400 dark:text-white/30" />
              <span className="text-sm text-gray-400 dark:text-white/30">Buscar...</span>
            </div>

            <ThemeToggle />

            {/* Notifications */}
            <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors">
              <Bell className="w-5 h-5 text-gray-500 dark:text-white/60" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User avatar + info */}
            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200/80 dark:border-white/[0.06]">
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {clientName}
                </div>
                {clientEmail && (
                  <div className="text-xs text-gray-400 dark:text-white/40">
                    {clientEmail}
                  </div>
                )}
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                {clientName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="lg:ml-[260px] px-4 lg:px-8 py-6">
        {subscriptionActive || allowWhenInactive ? (
          <PageTransition key={pathname}>{children}</PageTransition>
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
                className="btn-primary px-6 py-3 rounded-xl"
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
