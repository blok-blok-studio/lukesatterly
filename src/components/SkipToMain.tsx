"use client";

import { useT } from "@/lib/i18n/context";

export function SkipToMain() {
  const t = useT();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
    >
      {t.a11y.skipToMain}
    </a>
  );
}
