import { projects } from "../../content/projects";
import { messages } from "../../i18n/useLanguage";
import { closest } from "../suggest";
import { line, text, type Command, type Segment } from "../types";

export const findProject = (slug: string) =>
  projects.find((project) => project.slug === slug.toLowerCase().replace(/\/$/, ""));

export const open: Command = {
  name: "open",
  usage: { tr: "open <proje>", en: "open <project>" },
  description: { tr: "Proje detayını göster", en: "Show project details" },
  run: ({ args, lang }) => {
    const t = messages[lang];
    const available: Segment[] = projects.flatMap((project, i) => [
      ...(i > 0 ? [text("  ")] : []),
      { kind: "command", text: project.slug, command: `open ${project.slug}` } as const,
    ]);

    const slug = args[0];
    if (!slug) {
      return [line(text(t.terminal.openUsage, "muted")), line(...available)];
    }

    const project = findProject(slug);
    if (!project) {
      const suggestion = closest(slug.toLowerCase(), projects, (candidate) => [candidate.slug]);
      return [
        line(text(`${t.terminal.projectNotFound}: ${slug}`, "red")),
        suggestion
          ? line(text(`${t.terminal.didYouMean} `, "muted"), {
              kind: "command",
              text: suggestion.slug,
              command: `open ${suggestion.slug}`,
            })
          : line(...available),
      ];
    }

    return [
      line(text(project.name, "strong"), text(`  ${project.year}`, "muted")),
      line(text(project.details[lang])),
      line(text(`${t.terminal.stack}: `, "muted"), text(project.stack.join(", "))),
      line({ kind: "link", text: t.actions.liveDemo, href: project.demoUrl }, text("   "), {
        kind: "link",
        text: t.actions.sourceCode,
        href: project.repoUrl,
      }),
    ];
  },
};
