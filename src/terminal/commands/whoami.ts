import { profile } from "../../content/profile";
import { line, text, type Command } from "../types";

export const whoami: Command = {
  name: "whoami",
  description: { tr: "Ben kimim", en: "Who I am" },
  run: ({ lang }) => [line(text(profile.name, "strong")), line(text(profile.tagline[lang]))],
};
