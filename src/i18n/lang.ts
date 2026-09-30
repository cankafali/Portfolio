export const LANGS = ["tr", "en"] as const;
export type Lang = (typeof LANGS)[number];
export type Localized = Record<Lang, string>;
