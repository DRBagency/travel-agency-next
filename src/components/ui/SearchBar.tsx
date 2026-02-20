"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Search,
  CalendarCheck,
  MapPin,
  MessageCircle,
  FileText,
  Loader2,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  type: string;
}

interface SearchCategory {
  category: string;
  items: SearchResult[];
}

interface SearchBarProps {
  navItems: NavItem[];
}

const categoryIcons: Record<string, LucideIcon> = {
  reservas: CalendarCheck,
  destinos: MapPin,
  mensajes: MessageCircle,
  documentos: FileText,
};

const categoryColors: Record<string, string> = {
  reservas: "text-emerald-500",
  destinos: "text-amber-500",
  mensajes: "text-drb-turquoise-500",
  documentos: "text-blue-500",
};

export default function SearchBar({ navItems }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [dbResults, setDbResults] = useState<SearchCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const router = useRouter();
  const tc = useTranslations("common");

  // Nav item search (instant, local)
  const navResults = query.trim()
    ? navItems.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Debounced DB search
  const searchDB = useCallback(async (q: string) => {
    if (q.length < 2) {
      setDbResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setDbResults(data.results || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length >= 2) {
      setLoading(true);
      debounceRef.current = setTimeout(() => searchDB(query.trim()), 300);
    } else {
      setDbResults([]);
      setLoading(false);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, searchDB]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut: Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    function handleGlobalKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    }
    document.addEventListener("keydown", handleGlobalKey);
    return () => document.removeEventListener("keydown", handleGlobalKey);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
      inputRef.current?.blur();
    }
  }

  function handleSelect(href: string) {
    router.push(href);
    setIsOpen(false);
    setQuery("");
  }

  const hasNavResults = navResults.length > 0;
  const hasDbResults = dbResults.length > 0;
  const hasAnyResults = hasNavResults || hasDbResults;
  const showDropdown = isOpen && query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.06] w-64 focus-within:border-drb-turquoise-300 dark:focus-within:border-drb-turquoise-500/30 transition-colors">
        <Search className="w-4 h-4 text-gray-400 dark:text-white/30" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={tc("search")}
          className="w-full bg-transparent text-sm text-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none"
        />
        {loading && (
          <Loader2 className="w-3.5 h-3.5 text-drb-turquoise-500 animate-spin shrink-0" />
        )}
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-gray-200/60 dark:bg-white/[0.06] text-[10px] text-gray-400 dark:text-white/30 font-mono">
          ⌘K
        </kbd>
      </div>

      {showDropdown && (hasAnyResults || loading) && (
        <div className="absolute top-full start-0 mt-1 w-96 bg-white dark:bg-drb-turquoise-900 border border-gray-200 dark:border-white/[0.1] rounded-xl shadow-xl overflow-hidden z-50 max-h-[400px] overflow-y-auto">
          {/* Nav results */}
          {hasNavResults && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-white/30 bg-gray-50 dark:bg-white/[0.02]">
                {tc("panel")}
              </div>
              {navResults.slice(0, 4).map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => handleSelect(item.href)}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-start text-sm text-gray-700 dark:text-white/80 hover:bg-drb-turquoise-50 dark:hover:bg-white/[0.06] transition-colors"
                  >
                    <Icon className="w-4 h-4 text-drb-turquoise-500 shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* DB results by category */}
          {dbResults.map((cat) => {
            const CatIcon = categoryIcons[cat.category] || Search;
            const catColor = categoryColors[cat.category] || "text-gray-500";
            return (
              <div key={cat.category}>
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-white/30 bg-gray-50 dark:bg-white/[0.02]">
                  {cat.category}
                </div>
                {cat.items.map((item) => (
                  <button
                    key={`${cat.category}-${item.id}`}
                    onClick={() => handleSelect(item.href)}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-start hover:bg-drb-turquoise-50 dark:hover:bg-white/[0.06] transition-colors"
                  >
                    <CatIcon className={`w-4 h-4 shrink-0 ${catColor}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-white/40 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            );
          })}

          {/* Loading state at bottom */}
          {loading && !hasDbResults && (
            <div className="px-4 py-3 text-center">
              <Loader2 className="w-4 h-4 text-drb-turquoise-500 animate-spin mx-auto" />
            </div>
          )}
        </div>
      )}

      {showDropdown && !hasAnyResults && !loading && (
        <div className="absolute top-full start-0 mt-1 w-96 bg-white dark:bg-drb-turquoise-900 border border-gray-200 dark:border-white/[0.1] rounded-xl shadow-lg z-50 p-4">
          <p className="text-sm text-gray-400 dark:text-white/40 text-center">
            {tc("noResults")}
          </p>
        </div>
      )}
    </div>
  );
}
