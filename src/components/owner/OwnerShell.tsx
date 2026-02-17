"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  LayoutDashboard,
  Users,
  Calendar,
  Mail,
  TrendingUp,
  CreditCard,
  Zap,
  Headphones,
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

interface OwnerShellProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/owner", icon: LayoutDashboard },
  { label: "Clientes", href: "/owner/clientes", icon: Users },
  { label: "Calendario", href: "/owner/calendario", icon: Calendar },
  { label: "Emails", href: "/owner/emails", icon: Mail },
  { label: "Monetización", href: "/owner/monetizacion", icon: TrendingUp },
  { label: "Stripe", href: "/owner/stripe", icon: CreditCard },
  { label: "Automatización", href: "/owner/automatizaciones", icon: Zap },
  { label: "Soporte", href: "/owner/soporte", icon: Headphones },
];

const pageTitles: Record<string, string> = {
  "/owner": "Dashboard",
  "/owner/clientes": "Clientes",
  "/owner/calendario": "Calendario",
  "/owner/emails": "Emails",
  "/owner/monetizacion": "Monetización",
  "/owner/stripe": "Stripe",
  "/owner/automatizaciones": "Automatización",
  "/owner/soporte": "Soporte",
};

function SidebarNav({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  const isActive = (href: string) =>
    href === "/owner" ? pathname === "/owner" : pathname.startsWith(href);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0B1120]">
      {/* Logo + DRB branding */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-white/[0.06]">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
          D
        </div>
        <div className="min-w-0">
          <div className="font-display text-sm font-semibold text-gray-900 dark:text-white">
            DRB Agency
          </div>
          <div className="text-xs text-gray-400 dark:text-white/40">
            Panel Owner
          </div>
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

      {/* CTA banner */}
      <div className="p-4">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500" />
          <div className="absolute inset-0 opacity-20 bg-[url('/images/sidebar-cta-bg.svg')] bg-cover bg-center" />
          <div className="relative p-4 text-white">
            <Sparkles className="w-5 h-5 mb-2 text-blue-200" />
            <p className="text-sm font-semibold">Potencia tu plataforma</p>
            <p className="text-xs text-white/70 mt-1">
              Nuevas funciones disponibles.
            </p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="px-3 pb-4">
        <a
          href="/owner/logout"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-gray-400 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          Cerrar sesión
        </a>
      </div>
    </div>
  );
}

export default function OwnerShell({ children }: OwnerShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitle = Object.entries(pageTitles).find(([path]) => {
    if (path === "/owner") return pathname === "/owner";
    return pathname.startsWith(path);
  })?.[1] || "Panel Owner";

  return (
    <div className="min-h-screen bg-[#F0F3F8] dark:bg-[#0B1120]">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-white dark:bg-[#0B1120] border-r border-gray-200/80 dark:border-white/[0.06] z-40 hidden lg:flex flex-col">
        <SidebarNav
          items={navItems}
          pathname={pathname}
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
                />
              </SheetContent>
            </Sheet>

            {/* Branding (mobile only) */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                D
              </div>
              <span className="font-display text-sm font-semibold text-gray-900 dark:text-white">
                DRB Agency
              </span>
            </div>

            {/* Page title (desktop) */}
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white hidden lg:block">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Search bar */}
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

            {/* User avatar */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200/80 dark:border-white/[0.06]">
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  DRB Agency
                </div>
                <div className="text-xs text-gray-400 dark:text-white/40">
                  Owner
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                D
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="lg:ml-[260px] px-4 lg:px-8 py-6">
        <PageTransition key={pathname}>{children}</PageTransition>
      </main>
    </div>
  );
}
