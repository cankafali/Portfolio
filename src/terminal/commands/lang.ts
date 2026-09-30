import { LANGS, type Lang } from "../../i18n/lang";
import { messages } from "../../i18n/useLanguage";
import { line, text, type Command } from "../types";

const isLang = (value: string | undefined): value is Lang => LANGS.some((code) => code === value);

export const lang: Command = {
  name: "lang",
  usage: { tr: "lang tr|en", en: "lang tr|en" },
  description: { tr: "Dili değiştir", en: "Change language" },
  run: ({ args, lang: current, actions }) => {
    const target = args[0]?.toLowerCase();
    if (!isLang(target)) return [line(text(messages[current].terminal.langUsage, "muted"))];
    actions.setLang(target);
    // Onay yeni dilde basılır.
    return [line(text(messages[target].terminal.langChanged, "teal"))];
  },
};
