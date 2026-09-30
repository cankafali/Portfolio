import type { Command } from "../types";

export const clear: Command = {
  name: "clear",
  description: { tr: "Ekranı temizle (Ctrl+L)", en: "Clear the screen (Ctrl+L)" },
  run: ({ actions }) => {
    actions.clear();
    return [];
  },
};
