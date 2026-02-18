"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SearchBarProps {
  navItems: NavItem[];
}

export default function SearchBar({ navItems }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const tc = useTranslations('common');

  const results = query.trim()
    ? navItems.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.06] w-64">
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
          placeholder={tc('search')}
          className="w-full bg-transparent text-sm text-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-drb-turquoise-900 border border-gray-200 dark:border-white/[0.1] rounded-xl shadow-lg overflow-hidden z-50">
          {results.map((item) => {
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

      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-drb-turquoise-900 border border-gray-200 dark:border-white/[0.1] rounded-xl shadow-lg z-50 p-3">
          <p className="text-sm text-gray-400 dark:text-white/40 text-center">
            {tc('noResults')}
          </p>
        </div>
      )}
    </div>
  );
}
