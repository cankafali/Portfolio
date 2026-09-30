import { about as aboutContent } from "../../content/about";
import { line, text, type Command } from "../types";

export const about: Command = {
  name: "about",
  aliases: ["hakkimda"],
  description: { tr: "Kısa tanıtım", en: "Short introduction" },
  run: ({ lang }) => aboutContent[lang].terminal.map((row) => line(text(row))),
};
