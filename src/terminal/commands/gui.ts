import type { Command } from "../types";

export const gui: Command = {
  name: "gui",
  aliases: ["exit", "klasik"],
  description: { tr: "Klasik görünüme geç (Esc)", en: "Switch to classic view (Esc)" },
  run: ({ actions }) => {
    actions.openClassic();
    return [];
  },
};
