"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import {
  LOCALE_FLAGS,
  LOCALE_NATIVE_NAMES,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/lib/i18n/config";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, dict } = useI18n();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-label={dict.a11y.languageSwitcher}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:border-accent/40 hover:text-white cursor-pointer ${
          compact ? "" : "min-w-[3.5rem]"
        }`}
      >
        <span aria-hidden className="text-base leading-none">
          {LOCALE_FLAGS[locale]}
        </span>
        <span className="uppercase tracking-wider">{locale}</span>
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 max-h-80 w-48 overflow-auto rounded-xl border border-white/10 bg-[#0C0C0C]/95 backdrop-blur-xl py-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50"
          >
            {SUPPORTED_LOCALES.map((loc: Locale) => (
              <li key={loc}>
                <button
                  type="button"
                  role="option"
                  aria-selected={loc === locale}
                  onClick={() => {
                    setLocale(loc);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-3.5 py-2 text-left text-sm transition-colors cursor-pointer ${
                    loc === locale
                      ? "bg-accent/15 text-white"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span aria-hidden className="text-base leading-none">
                    {LOCALE_FLAGS[loc]}
                  </span>
                  <span className="flex-1">{LOCALE_NATIVE_NAMES[loc]}</span>
                  {loc === locale && (
                    <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
