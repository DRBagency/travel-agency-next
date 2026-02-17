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
  type LucideIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "@/components/ui/ThemeToggle";

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
    <div className="flex flex-col h-full">
      {/* Logo + DRB branding */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark:border-white/10">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-drb-turquoise-400 to-drb-lime-500" />
        <div className="min-w-0">
          <div className="font-display text-sm font-semibold text-gray-900 dark:text-white">
            DRB Agency
          </div>
          <div className="text-xs text-gray-500 dark:text-white/50">
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
    </div>
  );
}

export default function OwnerShell({ children }: OwnerShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 z-40 hidden lg:flex flex-col">
        <SidebarNav
          items={navItems}
          pathname={pathname}
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
                />
              </SheetContent>
            </Sheet>

            {/* Branding (mobile only) */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-drb-turquoise-400 to-drb-lime-500" />
              <span className="font-display text-sm font-semibold text-gray-900 dark:text-white">
                DRB Agency
              </span>
            </div>

            {/* Desktop context */}
            <span className="text-sm text-gray-500 dark:text-white/50 hidden lg:block">
              Acceso restringido
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-800">
              <a
                href="/owner/logout"
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
        {children}
      </main>
    </div>
  );
}
