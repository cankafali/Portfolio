import { profile } from "../../content/profile";
import type { Lang } from "../../i18n/lang";
import { line, text, type Command, type OutputLine } from "../types";

// Intro senaryosu da aynı çıktıyı kullanır.
export const whoamiLines = (lang: Lang): OutputLine[] => [
  line(text(profile.name, "strong")),
  line(text(profile.tagline[lang])),
];

export const whoami: Command = {
  name: "whoami",
  description: { tr: "Ben kimim", en: "Who I am" },
  run: ({ lang }) => whoamiLines(lang),
};
