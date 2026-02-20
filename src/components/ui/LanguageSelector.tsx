"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { setLocale } from "@/lib/set-locale";
import { Globe } from "lucide-react";

const languages = [
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
] as const;

export default function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === locale) || languages[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSelect(code: string) {
    setIsOpen(false);
    await setLocale(code);
    router.refresh();
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors text-sm"
        title={current.label}
      >
        <Globe className="w-4 h-4 text-gray-500 dark:text-white/60" />
        <span className="text-base leading-none">{current.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute end-0 top-full mt-1 bg-white dark:bg-drb-turquoise-900 border border-gray-200 dark:border-white/[0.1] rounded-xl shadow-lg overflow-hidden z-50 min-w-[120px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`flex items-center gap-2 w-full px-4 py-2.5 text-start text-sm transition-colors ${
                lang.code === locale
                  ? "bg-drb-turquoise-50 dark:bg-drb-turquoise-500/10 text-drb-turquoise-600 dark:text-drb-turquoise-400 font-medium"
                  : "text-gray-700 dark:text-white/80 hover:bg-gray-50 dark:hover:bg-white/[0.06]"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
