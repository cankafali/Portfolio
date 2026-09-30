import { profile } from "../../content/profile";
import { line, text, type Command } from "../types";

export const pwd: Command = {
  name: "pwd",
  description: { tr: "Bulunduğun dizin", en: "Print working directory" },
  run: () => [line(text(`/home/${profile.handle}/portfolio`))],
};
