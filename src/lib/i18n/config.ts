export const SUPPORTED_LOCALES = [
  "de",
  "en",
  "vi",
  "uk",
  "ar",
  "ru",
  "es",
  "fr",
  "it",
  "pt",
  "nl",
  "pl",
  "ja",
  "zh",
  "ko",
  "hi",
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const RTL_LOCALES = new Set<Locale>(["ar"]);

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_NATIVE_NAMES: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
  vi: "Tiếng Việt",
  uk: "Українська",
  ar: "العربية",
  ru: "Русский",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  pt: "Português",
  nl: "Nederlands",
  pl: "Polski",
  ja: "日本語",
  zh: "中文",
  ko: "한국어",
  hi: "हिन्दी",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  de: "🇩🇪",
  en: "🇬🇧",
  vi: "🇻🇳",
  uk: "🇺🇦",
  ar: "🇸🇦",
  ru: "🇷🇺",
  es: "🇪🇸",
  fr: "🇫🇷",
  it: "🇮🇹",
  pt: "🇵🇹",
  nl: "🇳🇱",
  pl: "🇵🇱",
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
