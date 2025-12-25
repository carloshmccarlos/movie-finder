// i18n React Context - SSR-compatible translation provider
// i18n React 上下文 - 兼容服务端渲染的翻译提供者

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import {
  type Locale,
  type TranslationKey,
  getLocale,
  setLocale as saveLocale,
  translate,
  exampleQueries,
} from "./i18n";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  examples: string[];
}

// Default context value for SSR
const defaultContext: I18nContextType = {
  locale: "zh",
  setLocale: () => {},
  t: (key) => translate("zh", key),
  examples: exampleQueries.zh,
};

const I18nContext = createContext<I18nContextType>(defaultContext);

export function I18nProvider({ children }: { children: ReactNode }) {
  // Initialize with default, then hydrate on client
  const [locale, setLocaleState] = useState<Locale>("zh");

  // Hydrate locale from localStorage on client mount
  useEffect(() => {
    setLocaleState(getLocale());
  }, []);

  // Update locale and save to localStorage
  const handleSetLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    saveLocale(newLocale);
  };

  // Translation function bound to current locale
  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    return translate(locale, key, params);
  };

  const value: I18nContextType = {
    locale,
    setLocale: handleSetLocale,
    t,
    examples: exampleQueries[locale],
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

// Hook to use i18n in components
export function useI18n() {
  return useContext(I18nContext);
}
