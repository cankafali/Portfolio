import { skills as skillGroups } from "../../content/skills";
import { text, type Command } from "../types";

// Seviye çubuğu ya da yüzde yok; yalnızca gruplanmış liste.
export const skills: Command = {
  name: "skills",
  aliases: ["yetenekler"],
  description: { tr: "Yetenekler", en: "Skills" },
  run: ({ lang }) => [
    {
      type: "table",
      rows: skillGroups.map((group) => [
        [text(group.title[lang], "muted")],
        [text(group.items.join(", "))],
      ]),
    },
  ],
};
