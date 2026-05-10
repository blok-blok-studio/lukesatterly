"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  RTL_LOCALES,
  resolveLocale,
  type Locale,
} from "./config";
import { dictionaries, type Dictionary } from "./dictionaries";

const STORAGE_KEY = "coachluki.locale";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: Dictionary;
  dir: "ltr" | "rtl";
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  // We start at DEFAULT_LOCALE on the server so SSR output is stable. On the
  // client we read localStorage / navigator.language in an effect and update.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    let next: Locale | null = null;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) next = resolveLocale(stored);
    } catch {
      // localStorage unavailable (private mode, etc.) — fall through to nav
    }
    if (!next) {
      const fromNav = navigator.languages?.[0] || navigator.language;
      next = resolveLocale(fromNav);
    }
    if (next !== locale) setLocaleState(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reflect locale on the <html> element so CSS / a11y tools see it.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale;
    document.documentElement.dir = RTL_LOCALES.has(locale) ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore — user just won't have their choice persisted
    }
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      dict: dictionaries[locale],
      dir: RTL_LOCALES.has(locale) ? "rtl" : "ltr",
    }),
    [locale, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}

/**
 * Convenience hook that returns just the active dictionary.
 *
 *   const t = useT();
 *   <h1>{t.hero.word1}</h1>
 */
export function useT(): Dictionary {
  return useI18n().dict;
}
