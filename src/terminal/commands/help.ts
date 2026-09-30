import { messages } from "../../i18n/useLanguage";
import { text, type Command } from "../types";

// help, kayıtlı komut listesine registry üzerinden erişir (döngüsel import olmasın diye fabrika).
export function createHelpCommand(list: () => Command[]): Command {
  return {
    name: "help",
    aliases: ["yardim", "?"],
    description: { tr: "Komut listesi", en: "List commands" },
    run: ({ lang }) => [
      { type: "text", segments: [text(messages[lang].terminal.helpIntro, "muted")] },
      {
        type: "table",
        rows: list()
          .filter((command) => !command.hidden)
          .map((command) => [
            [text(command.usage?.[lang] ?? command.name, "teal")],
            [text(command.description[lang], "muted")],
          ]),
      },
    ],
  };
}
