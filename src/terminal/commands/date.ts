import { line, text, type Command } from "../types";

export const date: Command = {
  name: "date",
  description: { tr: "Tarih ve saat", en: "Date and time" },
  run: ({ lang }) => [
    line(
      text(
        new Intl.DateTimeFormat(lang === "tr" ? "tr-TR" : "en-US", {
          dateStyle: "full",
          timeStyle: "short",
        }).format(new Date()),
      ),
    ),
  ],
};
