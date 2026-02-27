"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  Menu,
  LogOut,
  Sparkles,
  Pin,
  PinOff,
  MessageCircle,
  X,
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
import OwnerRightColumn from "./OwnerRightColumn";
import DashboardBackground from "../admin/DashboardBackground";

// --- Constants ---
const SIDEBAR_W_COLLAPSED = 64;
const SIDEBAR_W_EXPANDED = 240;
const RIGHT_COL_W = 300;
const RIGHT_COL_W_COLLAPSED = 48;
const LS_KEY_PINNED = "drb_owner_sidebar_pinned";
const LS_KEY_RIGHT_PINNED = "drb_owner_rightcol_pinned";

interface OwnerShellProps {
  ownerEmail: string;
  platformContext: string;
  children: ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

// ====================================================================
// Gradient nav divider
// ====================================================================
function OwnerSidebarSeparator({ expanded }: { expanded: boolean }) {
  if (!expanded) return <div className="my-1.5" />;
  return (
    <div className="h-px mx-3 my-2 bg-gradient-to-r from-transparent via-[rgba(28,171,176,0.15)] to-transparent" />
  );
}

// ====================================================================
// DESKTOP SIDEBAR (Collapsible with pin)
// ====================================================================
function DesktopSidebar({
  navGroups,
  pathname,
  t,
  tc,
  pinned,
  onTogglePin,
  expanded,
  onHoverStart,
  onHoverEnd,
}: {
  navGroups: NavItem[][];
  pathname: string;
  t: (key: string) => string;
  tc: (key: string) => string;
  pinned: boolean;
  onTogglePin: () => void;
  expanded: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const isActive = (href: string) =>
    href === "/owner" ? pathname === "/owner" : pathname.startsWith(href);

  const showLabels = expanded || pinned;

  return (
    <motion.aside
      className="fixed start-0 top-0 bottom-0 glass-sidebar z-40 hidden lg:flex flex-col"
      animate={{ width: showLabels ? SIDEBAR_W_EXPANDED : SIDEBAR_W_COLLAPSED }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      {/* Logo + pin button */}
      <div className="flex items-center h-16 border-b border-white/[0.06] px-3 gap-2">
        <div className="shrink-0 h-9 w-9 rounded-xl bg-gradient-to-br from-drb-turquoise-500 to-drb-turquoise-600 flex items-center justify-center text-white font-bold text-sm">
          D
        </div>
        {showLabels && (
          <motion.div
            className="min-w-0 flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 }}
          >
            <div className="font-display text-sm font-semibold text-gray-900 dark:text-white truncate">
              DRB Agency
            </div>
            <div className="text-xs text-gray-400 dark:text-white/40">
              {t("panelOwner")}
            </div>
          </motion.div>
        )}
        {showLabels && (
          <button
            onClick={onTogglePin}
            className="shrink-0 p-1.5 rounded-lg hover:bg-white/[0.10] dark:hover:bg-white/[0.06] transition-colors"
            title={pinned ? tc("unpin") : tc("pin")}
          >
            {pinned ? (
              <Pin className="w-3.5 h-3.5 text-drb-turquoise-500" />
            ) : (
              <PinOff className="w-3.5 h-3.5 text-gray-400 dark:text-white/40" />
            )}
          </button>
        )}
      </div>

      {/* Nav items with group separators */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {gi > 0 && <OwnerSidebarSeparator expanded={showLabels} />}
            <div className="space-y-0.5">
              {group.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={!showLabels ? item.label : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all ${
                      active
                        ? "bg-drb-turquoise-500/10 text-drb-turquoise-600 dark:text-drb-turquoise-400"
                        : "text-gray-600 dark:text-white/60 hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <span className="text-[1.15rem] w-5 text-center leading-none shrink-0">{item.icon}</span>
                    {showLabels && (
                      <motion.span
                        className="flex-1 truncate"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.05 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* CTA banner — only when expanded */}
      {showLabels && (
        <motion.div
          className="p-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-drb-turquoise-600 via-drb-turquoise-500 to-drb-lime-500" />
            <div className="absolute inset-0 opacity-20 bg-[url('/images/sidebar-cta-bg.svg')] bg-cover bg-center" />
            <div className="relative p-3 text-white">
              <Sparkles className="w-4 h-4 mb-1.5 text-drb-turquoise-200" />
              <p className="text-xs font-semibold">{tc("boostPlatform")}</p>
              <p className="text-[11px] text-white/70 mt-1">
                {tc("newFeaturesAvailable")}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Logout */}
      <div className="px-2 pb-2">
        <a
          href="/owner/logout"
          title={!showLabels ? tc("logout") : undefined}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-gray-400 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {showLabels && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {tc("logout")}
            </motion.span>
          )}
        </a>
      </div>

      {/* DRB branding */}
      {showLabels && (
        <motion.div
          className="px-3 pb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-2 px-3 py-1.5">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-drb-turquoise-500 to-drb-turquoise-600 flex items-center justify-center text-white font-bold text-[8px]">
              D
            </div>
            <span className="text-[10px] text-gray-400 dark:text-white/30">
              {tc("poweredBy")}{" "}
              <span className="font-semibold text-gray-500 dark:text-white/50">
                DRB Agency
              </span>
            </span>
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
}

// ====================================================================
// MOBILE SIDEBAR (Sheet-based, full expanded)
// ====================================================================
function MobileSidebarNav({
  navGroups,
  pathname,
  onNavigate,
  t,
  tc,
}: {
  navGroups: NavItem[][];
  pathname: string;
  onNavigate?: () => void;
  t: (key: string) => string;
  tc: (key: string) => string;
}) {
  const isActive = (href: string) =>
    href === "/owner" ? pathname === "/owner" : pathname.startsWith(href);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 h-16 border-b border-white/[0.06]">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-drb-turquoise-500 to-drb-turquoise-600 flex items-center justify-center text-white font-bold text-sm">
          D
        </div>
        <div className="min-w-0">
          <div className="font-display text-sm font-semibold text-gray-900 dark:text-white truncate">
            DRB Agency
          </div>
          <div className="text-xs text-gray-400 dark:text-white/40">
            {t("panelOwner")}
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {gi > 0 && <OwnerSidebarSeparator expanded />}
            <div className="space-y-0.5">
              {group.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all ${
                      active
                        ? "bg-drb-turquoise-500/10 text-drb-turquoise-600 dark:text-drb-turquoise-400"
                        : "text-gray-600 dark:text-white/60 hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <span className="text-[1.15rem] w-5 text-center leading-none shrink-0">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 pb-2">
        <a
          href="/owner/logout"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-gray-400 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {tc("logout")}
        </a>
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-drb-turquoise-500 to-drb-turquoise-600 flex items-center justify-center text-white font-bold text-[9px]">
            D
          </div>
          <span className="text-[11px] text-gray-400 dark:text-white/30">
            {tc("poweredBy")}{" "}
            <span className="font-semibold text-gray-500 dark:text-white/50">DRB Agency</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ====================================================================
// MAIN SHELL
// ====================================================================
export default function OwnerShell({
  ownerEmail,
  platformContext,
  children,
}: OwnerShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const t = useTranslations("owner");
  const tc = useTranslations("common");
  const locale = useLocale();

  // Sidebar pin state (persisted in localStorage)
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY_PINNED);
    if (stored === "true") setPinned(true);
  }, []);

  const togglePin = () => {
    const next = !pinned;
    setPinned(next);
    localStorage.setItem(LS_KEY_PINNED, String(next));
  };

  const sidebarExpanded = pinned || hovered;
  const sidebarWidth = sidebarExpanded ? SIDEBAR_W_EXPANDED : SIDEBAR_W_COLLAPSED;

  // Right column pin state (persisted in localStorage)
  const [rightPinned, setRightPinned] = useState(true);
  const [rightHovered, setRightHovered] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY_RIGHT_PINNED);
    if (stored !== null) setRightPinned(stored === "true");
  }, []);

  const toggleRightPin = () => {
    const next = !rightPinned;
    setRightPinned(next);
    localStorage.setItem(LS_KEY_RIGHT_PINNED, String(next));
  };

  const rightColExpanded = rightPinned || rightHovered;
  const rightColWidth = rightColExpanded ? RIGHT_COL_W : RIGHT_COL_W_COLLAPSED;

  const navGroups: NavItem[][] = [
    // Home
    [{ label: t("nav.dashboard"), href: "/owner", icon: "📊" }],
    // Core
    [
      { label: t("nav.clientes"), href: "/owner/clientes", icon: "🏢" },
      { label: t("nav.crm"), href: "/owner/crm", icon: "🤝" },
      { label: t("nav.calendario"), href: "/owner/calendario", icon: "📅" },
      { label: t("nav.soporte"), href: "/owner/soporte", icon: "🛟" },
    ],
    // Revenue
    [
      { label: t("nav.monetizacion"), href: "/owner/monetizacion", icon: "📈" },
      { label: t("nav.stripe"), href: "/owner/stripe", icon: "💳" },
    ],
    // Config
    [
      { label: t("nav.emails"), href: "/owner/emails", icon: "📧" },
      { label: t("nav.automatizaciones"), href: "/owner/automatizaciones", icon: "⚡" },
    ],
  ];
  const navItems = navGroups.flat();

  return (
    <div className="min-h-screen bg-[#E8EEF4] dark:bg-[#0B1825]">
      {/* ========== DESKTOP SIDEBAR ========== */}
      <DesktopSidebar
        navGroups={navGroups}
        pathname={pathname}
        t={t}
        tc={tc}
        pinned={pinned}
        onTogglePin={togglePin}
        expanded={hovered}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      />

      {/* ========== DESKTOP RIGHT COLUMN (xl only) ========== */}
      <motion.aside
        className="fixed end-0 top-0 bottom-0 hidden xl:flex flex-col z-40 overflow-hidden glass-sidebar border-s border-white/[0.06]"
        animate={{ width: rightColWidth }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        onMouseEnter={() => setRightHovered(true)}
        onMouseLeave={() => setRightHovered(false)}
      >
        {/* Pin/Unpin toggle */}
        <div className="flex justify-start px-2 pt-2 shrink-0" style={{ minWidth: RIGHT_COL_W }}>
          <button
            onClick={toggleRightPin}
            className="p-1.5 rounded-lg hover:bg-white/[0.10] dark:hover:bg-white/[0.06] transition-colors"
            title={rightPinned ? tc("unpin") : tc("pin")}
          >
            {rightPinned ? (
              <Pin className="w-3.5 h-3.5 text-drb-turquoise-500" />
            ) : (
              <PinOff className="w-3.5 h-3.5 text-gray-400 dark:text-white/40" />
            )}
          </button>
        </div>
        {rightColExpanded ? (
          <div className="flex-1 overflow-hidden" style={{ minWidth: RIGHT_COL_W }}>
            <OwnerRightColumn
              ownerEmail={ownerEmail}
              platformContext={platformContext}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center pt-3 gap-3">
            <MessageCircle className="w-5 h-5 text-drb-turquoise-500" />
          </div>
        )}
      </motion.aside>

      {/* ========== HEADER ========== */}
      <header
        className="sticky top-0 z-30 glass-header transition-all duration-200"
        style={{
          marginInlineStart: `var(--sidebar-w, ${SIDEBAR_W_COLLAPSED}px)`,
          marginInlineEnd: `var(--right-col-w, 0px)`,
        }}
      >
        <style>{`
          @media (min-width: 1024px) {
            header { --sidebar-w: ${sidebarWidth}px; }
          }
          @media (max-width: 1023px) {
            header { --sidebar-w: 0px; }
          }
          @media (min-width: 1280px) {
            header { --right-col-w: ${rightColWidth}px; }
          }
        `}</style>
        <div className="flex items-center justify-between px-4 lg:px-6 h-16">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="p-2 rounded-xl hover:bg-white/[0.10] dark:hover:bg-white/[0.06] transition-colors lg:hidden">
                  <Menu className="w-5 h-5 text-gray-600 dark:text-white" />
                </button>
              </SheetTrigger>
              <SheetContent
                side={locale === "ar" ? "right" : "left"}
                className="w-[260px] p-0 glass-sidebar border-e border-white/[0.06]"
              >
                <MobileSidebarNav
                  navGroups={navGroups}
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                  t={t}
                  tc={tc}
                />
              </SheetContent>
            </Sheet>

            {/* Mobile branding */}
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
            <SearchBar navItems={navItems} />
            <LanguageSelector />
            <ThemeToggle />
            <NotificationBell isOwner />

            {/* Eden FAB for tablet/mobile (opens right panel) */}
            <button
              onClick={() => setRightPanelOpen(true)}
              className="xl:hidden p-2 rounded-xl hover:bg-white/[0.10] dark:hover:bg-white/[0.06] transition-colors"
              title="Eden"
            >
              <MessageCircle className="w-5 h-5 text-drb-turquoise-500" />
            </button>

            {/* User avatar + info */}
            <div className="hidden sm:flex xl:hidden items-center gap-3 ps-3 border-s border-white/[0.08]">
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

      {/* ========== MAIN CONTENT ========== */}
      <main
        className="relative px-4 lg:px-6 pt-3 pb-6 transition-all duration-200"
        style={{
          marginInlineStart: `var(--main-sidebar-w, 0px)`,
          marginInlineEnd: `var(--main-right-w, 0px)`,
        }}
      >
        <style>{`
          @media (min-width: 1024px) {
            main { --main-sidebar-w: ${sidebarWidth}px; }
          }
          @media (min-width: 1280px) {
            main { --main-right-w: ${rightColWidth}px; }
          }
        `}</style>
        <DashboardBackground />
        {/* Curved separator — sidebar right edge */}
        <div
          className="fixed top-0 w-[6px] h-screen z-20 pointer-events-none hidden lg:block"
          style={{ insetInlineStart: sidebarWidth - 3 }}
        >
          <svg viewBox="0 0 22 800" preserveAspectRatio="none" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="osepSbV" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="15%" stopColor="rgba(28,171,176,0.6)" />
                <stop offset="35%" stopColor="rgba(212,242,77,0.45)" />
                <stop offset="55%" stopColor="rgba(167,139,250,0.4)" />
                <stop offset="75%" stopColor="rgba(28,171,176,0.5)" />
                <stop offset="90%" stopColor="rgba(212,242,77,0.35)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <filter id="osepGlow1"><feGaussianBlur stdDeviation="1.5" result="g" /><feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <path d="M11,0 Q4,40 11,80 Q18,120 11,160 Q4,200 11,240 Q18,280 11,320 Q4,360 11,400 Q18,440 11,480 Q4,520 11,560 Q18,600 11,640 Q4,680 11,720 Q18,760 11,800" stroke="url(#osepSbV)" strokeWidth="0.4" fill="none" filter="url(#osepGlow1)" />
            <path d="M11,0 Q4,40 11,80 Q18,120 11,160 Q4,200 11,240 Q18,280 11,320 Q4,360 11,400 Q18,440 11,480 Q4,520 11,560 Q18,600 11,640 Q4,680 11,720 Q18,760 11,800" stroke="url(#osepSbV)" strokeWidth="1" fill="none" opacity="0.04" filter="blur(3px)" />
          </svg>
        </div>
        {/* Curved separator — header bottom edge */}
        <div
          className="fixed h-[6px] z-20 pointer-events-none hidden lg:block"
          style={{ top: 61, insetInlineStart: sidebarWidth, insetInlineEnd: 0 }}
        >
          <svg viewBox="0 0 1200 22" preserveAspectRatio="none" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="osepHdH" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="10%" stopColor="rgba(28,171,176,0.5)" />
                <stop offset="30%" stopColor="rgba(212,242,77,0.4)" />
                <stop offset="50%" stopColor="rgba(167,139,250,0.35)" />
                <stop offset="70%" stopColor="rgba(244,114,182,0.3)" />
                <stop offset="90%" stopColor="rgba(28,171,176,0.4)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <filter id="osepGlow2"><feGaussianBlur stdDeviation="1.5" result="g" /><feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <path d="M0,11 Q60,4 120,11 Q180,18 240,11 Q300,4 360,11 Q420,18 480,11 Q540,4 600,11 Q660,18 720,11 Q780,4 840,11 Q900,18 960,11 Q1020,4 1080,11 Q1140,18 1200,11" stroke="url(#osepHdH)" strokeWidth="0.4" fill="none" filter="url(#osepGlow2)" />
            <path d="M0,11 Q60,4 120,11 Q180,18 240,11 Q300,4 360,11 Q420,18 480,11 Q540,4 600,11 Q660,18 720,11 Q780,4 840,11 Q900,18 960,11 Q1020,4 1080,11 Q1140,18 1200,11" stroke="url(#osepHdH)" strokeWidth="1" fill="none" opacity="0.03" filter="blur(3px)" />
          </svg>
        </div>
        <div className="relative z-[1]">
          <PageTransition key={pathname}>{children}</PageTransition>
        </div>
      </main>

      {/* ========== MOBILE/TABLET RIGHT PANEL DRAWER ========== */}
      {rightPanelOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setRightPanelOpen(false)}
          />
          <div className="absolute end-0 top-0 bottom-0 w-[320px] max-w-[90vw] animate-slide-in-right">
            <div className="h-full relative">
              <button
                onClick={() => setRightPanelOpen(false)}
                className="absolute top-3 start-3 z-10 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-white/70" />
              </button>
              <OwnerRightColumn
                ownerEmail={ownerEmail}
                platformContext={platformContext}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
