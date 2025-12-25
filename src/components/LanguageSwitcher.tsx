// LanguageSwitcher component - Modern dropdown to select language
// 语言切换组件 - 现代下拉选择语言

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useI18n } from "../lib/i18n-context";
import type { Locale } from "../lib/i18n";

// Language options
const languages: { value: Locale; label: string; flag: string }[] = [
  { value: "zh", label: "中文", flag: "🇨🇳" },
  { value: "en", label: "English", flag: "🇺🇸" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Current language display
  const currentLang = languages.find((l) => l.value === locale) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle language selection
  const handleSelect = (lang: Locale) => {
    setLocale(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg
                   bg-white/5 border border-white/10 
                   hover:bg-white/10 hover:border-white/20
                   transition-all duration-200 text-sm text-gray-300"
      >
        <Globe size={16} />
        <span>{currentLang.flag} {currentLang.label}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 py-1 rounded-xl
                        bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10
                        shadow-xl shadow-black/50 z-50
                        animate-in fade-in slide-in-from-top-2 duration-200">
          {languages.map((lang) => (
            <button
              key={lang.value}
              type="button"
              onClick={() => handleSelect(lang.value)}
              className={`w-full flex items-center justify-between px-4 py-2.5
                         text-sm transition-colors duration-150
                         ${locale === lang.value
                           ? "text-[#ff6b35] bg-[#ff6b35]/10"
                           : "text-gray-300 hover:bg-white/5 hover:text-white"
                         }`}
            >
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </span>
              {locale === lang.value && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
