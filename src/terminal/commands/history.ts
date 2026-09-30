import { messages } from "../../i18n/useLanguage";
import { line, text, type Command } from "../types";

export const history: Command = {
  name: "history",
  description: { tr: "Komut geçmişi", en: "Command history" },
  run: ({ lang, actions }) => {
    const entries = actions.history();
    if (entries.length === 0) return [line(text(messages[lang].terminal.historyEmpty, "muted"))];
    const width = String(entries.length).length;
    return [
      {
        type: "table",
        rows: entries.map((entry, i) => [
          [text(String(i + 1).padStart(width, " "), "muted")],
          [text(entry)],
        ]),
      },
    ];
  },
};
