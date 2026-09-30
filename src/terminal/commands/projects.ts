import { projects as projectList } from "../../content/projects";
import { messages } from "../../i18n/useLanguage";
import { blank, line, text, type Command } from "../types";

export const projects: Command = {
  name: "projects",
  aliases: ["ls projects", "ls projects/"],
  description: { tr: "Projeleri listele", en: "List projects" },
  run: ({ lang }) => [
    {
      type: "table",
      rows: projectList.map((project) => [
        [{ kind: "command", text: `${project.slug}/`, command: `open ${project.slug}` }],
        [text(project.summary[lang])],
        [text(project.stack.join(", "), "muted")],
      ]),
    },
    blank(),
    line(text(messages[lang].terminal.openHint, "muted")),
  ],
};
