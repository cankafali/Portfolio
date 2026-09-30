import { profile } from "./content/profile";
import type { Lang } from "./i18n/lang";

// TASARIM.md §10: yalnızca production'da, bir kez.
const text: Record<Lang, { title: string; body: string; source: string }> = {
  tr: {
    title: "Merhaba, meraklı geliştirici.",
    body: "Konsolu açtıysan seninle aynı dili konuşuyoruz. Birlikte çalışalım:",
    source: "Kaynak kod:",
  },
  en: {
    title: "Hello, curious developer.",
    body: "If you opened the console, we speak the same language. Let's work together:",
    source: "Source code:",
  },
};

export function logConsoleGreeting(lang: Lang) {
  const t = text[lang];
  console.log(
    `%c${t.title}`,
    "font: 600 16px 'Martian Mono Variable', monospace; color: #FFB547; background: #0F1B2D; padding: 8px 12px; border-radius: 6px;",
  );
  console.log(
    `%c${t.body} ${profile.email}\n${t.source} ${profile.repoUrl}`,
    "font: 13px system-ui; color: #4A5A70; line-height: 1.6;",
  );
}
