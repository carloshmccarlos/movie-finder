// i18n React Context - SSR-compatible translation provider
// i18n React 上下文 - 兼容服务端渲染的翻译提供者
// Fixed: Use consistent default locale for SSR to avoid hydration mismatch

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
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

// Default locale for SSR - must be consistent between server and client initial render
const DEFAULT_LOCALE: Locale = "zh";

// Default context value
const defaultContext: I18nContextType = {
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key) => translate(DEFAULT_LOCALE, key),
  examples: exampleQueries[DEFAULT_LOCALE],
};

const I18nContext = createContext<I18nContextType>(defaultContext);

export function I18nProvider({ children }: { children: ReactNode }) {
  // Start with default locale - this ensures SSR and initial client render match
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [mounted, setMounted] = useState(false);

  // Only read from localStorage after component mounts (client-side only)
  useEffect(() => {
    setMounted(true);
    // Read saved locale preference after hydration is complete
    const savedLocale = getLocale();
    if (savedLocale !== DEFAULT_LOCALE) {
      setLocaleState(savedLocale);
    }
  }, []);

  // Update locale and persist to localStorage
  const handleSetLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    saveLocale(newLocale);
  }, []);

  // Translation function - memoized to prevent unnecessary re-renders
  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      return translate(locale, key, params);
    },
    [locale]
  );

  // Memoize context value
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
