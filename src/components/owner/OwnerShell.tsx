"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
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
import SearchBar from "@/components/ui/SearchBar";
import NotificationBell from "@/components/ui/NotificationBell";
import LanguageSelector from "@/components/ui/LanguageSelector";

interface OwnerShellProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

function OwnerSidebarSeparator() {
  return (
    <div className="my-1.5 mx-3 overflow-hidden">
      <svg viewBox="0 0 200 8" className="w-full h-2" preserveAspectRatio="none">
        <defs>
          <linearGradient id="osepLight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1CABB0" stopOpacity="0" />
            <stop offset="20%" stopColor="#1CABB0" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#D4F24D" stopOpacity="0.4" />
            <stop offset="80%" stopColor="#1CABB0" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1CABB0" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="osepDark" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1CABB0" stopOpacity="0" />
            <stop offset="20%" stopColor="#1CABB0" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#33CFD7" stopOpacity="0.5" />
            <stop offset="80%" stopColor="#1CABB0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1CABB0" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="osepShine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="45%" stopColor="#fff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.6" />
            <stop offset="55%" stopColor="#fff" stopOpacity="0" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M 0 4 Q 50 0, 100 4 Q 150 8, 200 4" stroke="url(#osepLight)" strokeWidth="1.5" fill="none" className="dark:hidden" />
        <path d="M 0 4 Q 50 0, 100 4 Q 150 8, 200 4" stroke="url(#osepDark)" strokeWidth="1.5" fill="none" className="hidden dark:block" />
        <path d="M 0 4 Q 50 0, 100 4 Q 150 8, 200 4" stroke="url(#osepShine)" strokeWidth="0.5" fill="none" className="opacity-50" />
      </svg>
    </div>
  );
}

function SidebarNav({
  items,
  navGroups,
  pathname,
  onNavigate,
  t,
  tc,
}: {
  items: NavItem[];
  navGroups?: NavItem[][];
  pathname: string;
  onNavigate?: () => void;
  t: (key: string) => string;
  tc: (key: string) => string;
}) {
  const isActive = (href: string) =>
    href === "/owner" ? pathname === "/owner" : pathname.startsWith(href);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#041820]">
      {/* Logo + DRB branding */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-white/[0.06]">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-drb-turquoise-500 to-drb-turquoise-600 flex items-center justify-center text-white font-bold text-sm">
          D
        </div>
        <div className="min-w-0">
          <div className="font-display text-sm font-semibold text-gray-900 dark:text-white">
            DRB Agency
          </div>
          <div className="text-xs text-gray-400 dark:text-white/40">
            {t("panelOwner")}
          </div>
        </div>
      </div>

      {/* Nav items with group separators */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {(navGroups || [items]).map((group, gi) => (
          <div key={gi}>
            {gi > 0 && <OwnerSidebarSeparator />}
            <div className="space-y-0.5">
              {group.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all ${
                      active
                        ? "bg-drb-turquoise-50 dark:bg-drb-turquoise-500/10 text-drb-turquoise-600 dark:text-drb-turquoise-400"
                        : "text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* CTA banner */}
      <div className="p-4">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-drb-turquoise-600 via-drb-turquoise-500 to-drb-lime-500" />
          <div className="absolute inset-0 opacity-20 bg-[url('/images/sidebar-cta-bg.svg')] bg-cover bg-center" />
          <div className="relative p-4 text-white">
            <Sparkles className="w-5 h-5 mb-2 text-drb-turquoise-200" />
            <p className="text-sm font-semibold">{tc("boostPlatform")}</p>
            <p className="text-xs text-white/70 mt-1">
              {tc("newFeaturesAvailable")}
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
          {tc("logout")}
        </a>
      </div>
    </div>
  );
}

export default function OwnerShell({ children }: OwnerShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("owner");
  const tc = useTranslations("common");
  const locale = useLocale();

  const navGroups: NavItem[][] = [
    // Home
    [{ label: t("nav.dashboard"), href: "/owner", icon: LayoutDashboard }],
    // Core
    [
      { label: t("nav.clientes"), href: "/owner/clientes", icon: Users },
      { label: t("nav.calendario"), href: "/owner/calendario", icon: Calendar },
      { label: t("nav.soporte"), href: "/owner/soporte", icon: Headphones },
    ],
    // Revenue
    [
      { label: t("nav.monetizacion"), href: "/owner/monetizacion", icon: TrendingUp },
      { label: t("nav.stripe"), href: "/owner/stripe", icon: CreditCard },
    ],
    // Config
    [
      { label: t("nav.emails"), href: "/owner/emails", icon: Mail },
      { label: t("nav.automatizaciones"), href: "/owner/automatizaciones", icon: Zap },
    ],
  ];
  const navItems = navGroups.flat();


  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#041820]">
      {/* Desktop sidebar */}
      <aside className="fixed start-0 top-0 bottom-0 w-[260px] bg-white dark:bg-[#041820] border-e border-gray-200/80 dark:border-white/[0.06] z-40 hidden lg:flex flex-col">
        <SidebarNav
          items={navItems}
          navGroups={navGroups}
          pathname={pathname}
          t={t}
          tc={tc}
        />
      </aside>

      {/* Header */}
      <header className="sticky top-0 z-30 lg:ms-[260px] bg-white/80 dark:bg-[#041820]/80 backdrop-blur-xl border-b border-gray-200/80 dark:border-white/[0.06]">
        <div className="flex items-center justify-between px-4 lg:px-8 h-16">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors lg:hidden">
                  <Menu className="w-5 h-5 text-gray-600 dark:text-white" />
                </button>
              </SheetTrigger>
              <SheetContent side={locale === "ar" ? "right" : "left"} className="w-[260px] p-0 bg-white dark:bg-[#041820] border-e border-gray-200/80 dark:border-white/[0.06]">
                <SidebarNav
                  items={navItems}
                  navGroups={navGroups}
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                  t={t}
                  tc={tc}
                />
              </SheetContent>
            </Sheet>

            {/* Branding (mobile only) */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-drb-turquoise-500 to-drb-turquoise-600 flex items-center justify-center text-white font-bold text-xs">
                D
              </div>
              <span className="font-display text-sm font-semibold text-gray-900 dark:text-white">
                DRB Agency
              </span>
            </div>

          </div>

          <div className="flex items-center gap-3">
            {/* Functional search bar */}
            <SearchBar navItems={navItems} />

            <LanguageSelector />

            <ThemeToggle />

            {/* Functional notifications */}
            <NotificationBell isOwner />

            {/* User avatar */}
            <div className="flex items-center gap-3 ps-3 border-s border-gray-200/80 dark:border-white/[0.06]">
              <div className="text-end hidden md:block">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  DRB Agency
                </div>
                <div className="text-xs text-gray-400 dark:text-white/40">
                  Owner
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-drb-turquoise-500 to-drb-turquoise-600 flex items-center justify-center text-white font-semibold text-sm">
                D
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="lg:ms-[260px] px-4 lg:px-8 py-6">
        <PageTransition key={pathname}>{children}</PageTransition>
      </main>
    </div>
  );
}
