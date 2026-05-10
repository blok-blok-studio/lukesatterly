export const SUPPORTED_LOCALES = [
  "en",
  "de",
  "es",
  "fr",
  "it",
  "pt",
  "nl",
  "pl",
  "ru",
  "ar",
  "ja",
  "zh",
  "ko",
  "hi",
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const RTL_LOCALES = new Set<Locale>(["ar"]);

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_NATIVE_NAMES: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  pt: "Português",
  nl: "Nederlands",
  pl: "Polski",
  ru: "Русский",
  ar: "العربية",
  ja: "日本語",
  zh: "中文",
  ko: "한국어",
  hi: "हिन्दी",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇬🇧",
  de: "🇩🇪",
  es: "🇪🇸",
  fr: "🇫🇷",
  it: "🇮🇹",
  pt: "🇵🇹",
  nl: "🇳🇱",
  pl: "🇵🇱",
  ru: "🇷🇺",
  ar: "🇸🇦",
  ja: "🇯🇵",
  zh: "🇨🇳",
  ko: "🇰🇷",
  hi: "🇮🇳",
};

export function resolveLocale(input: string | undefined | null): Locale {
  if (!input) return DEFAULT_LOCALE;
  const lower = input.toLowerCase();
  // Exact match
  for (const loc of SUPPORTED_LOCALES) {
    if (lower === loc) return loc;
  }
  // Prefix match (e.g. "en-US" -> "en", "zh-Hans" -> "zh")
  const base = lower.split(/[-_]/)[0];
  for (const loc of SUPPORTED_LOCALES) {
    if (base === loc) return loc;
  }
  return DEFAULT_LOCALE;
}
