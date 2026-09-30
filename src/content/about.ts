import type { Lang } from "../i18n/lang";

// Klasik görünüm: en fazla 3 paragraf, toplam ≤ 120 kelime.
// Terminal (`about`): 3–5 kısa satır.
export const about: Record<Lang, { paragraphs: string[]; terminal: string[] }> = {
  tr: {
    paragraphs: ["{paragraf 1}", "{paragraf 2}", "{paragraf 3}"],
    terminal: ["{satır 1}", "{satır 2}", "{satır 3}"],
  },
  en: {
    paragraphs: ["{paragraph 1}", "{paragraph 2}", "{paragraph 3}"],
    terminal: ["{line 1}", "{line 2}", "{line 3}"],
  },
};
