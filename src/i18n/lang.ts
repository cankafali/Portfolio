export const LANGS = ["tr", "en"] as const;
export type Lang = (typeof LANGS)[number];
export type Localized = Record<Lang, string>;

/** Tarayıcıda ?lang=en; sunucuda (ön-render) varsayılan Türkçe. */
export function readInitialLang(): Lang {
  if (typeof window === "undefined") return "tr";
  return new URLSearchParams(window.location.search).get("lang") === "en" ? "en" : "tr";
}
