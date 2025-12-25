// LanguageSwitcher component - Toggle between Chinese and English
// 语言切换组件 - 中英文切换 (SSR-compatible)

import { Globe } from "lucide-react";
import { useI18n } from "../lib/i18n-context";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const toggleLocale = () => {
    setLocale(locale === "zh" ? "en" : "zh");
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1 px-3 py-1.5 rounded-lg
                 bg-[#1a1a1a] border border-[#333333] text-[#a0a0a0]
                 hover:border-[#ff6b35] hover:text-white transition-colors text-sm"
      title={locale === "zh" ? "Switch to English" : "切换到中文"}
    >
      <Globe size={16} />
      <span>{locale === "zh" ? "EN" : "中文"}</span>
    </button>
  );
}
