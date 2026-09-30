import { messages } from "../../i18n/useLanguage";
import { line, text, type Command } from "../types";

const BREW_MS = 900;

export const coffee: Command = {
  name: "coffee",
  hidden: true,
  description: { tr: "Kahve", en: "Coffee" },
  run: async ({ lang, actions }) => {
    const t = messages[lang].terminal;
    const update = actions.printLive(line(text(t.coffeeBrewing)));
    await actions.wait(BREW_MS);
    update(line(text(t.coffeeBrewing), text(t.coffeeReady, "teal")));
    return [];
  },
};
