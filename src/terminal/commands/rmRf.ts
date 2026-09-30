import { messages } from "../../i18n/useLanguage";
import { line, text, type Command } from "../types";

export const rmRf: Command = {
  name: "rm -rf /",
  hidden: true,
  description: { tr: "Her şeyi sil", en: "Delete everything" },
  run: ({ lang }) => [line(text(messages[lang].terminal.rmRf, "amber"))],
};
