import { education as educationList } from "../../content/education";
import { messages } from "../../i18n/useLanguage";
import { text, type Command } from "../types";

export const education: Command = {
  name: "education",
  aliases: ["egitim"],
  description: { tr: "Eğitim", en: "Education" },
  run: ({ lang }) => [
    {
      type: "table",
      rows: educationList.map((item) => [
        [text(`${item.start} – ${item.end ?? messages[lang].education.present}`, "muted")],
        [text(`${item.school}, ${item.program[lang]}`)],
      ]),
    },
  ],
};
