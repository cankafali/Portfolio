import { github as stats } from "../../content/github";
import { profile } from "../../content/profile";
import { messages } from "../../i18n/useLanguage";
import { line, text, type Command, type Segment } from "../types";

// Veri build öncesi scripts/fetch-github.mjs ile src/content/github.json'a yazılır.
export const github: Command = {
  name: "github",
  description: { tr: "GitHub özeti", en: "GitHub summary" },
  run: ({ lang }) => {
    const t = messages[lang].terminal;
    const profileLink: Segment[] = [
      { kind: "link", text: profile.links.github, href: profile.links.github },
    ];
    if (!stats.fetchedAt) {
      return [line(text(t.githubMissing, "muted")), line(...profileLink)];
    }

    const locale = lang === "tr" ? "tr-TR" : "en-US";
    const latest: Segment[] = stats.lastUpdated
      ? [
          { kind: "link", text: stats.lastUpdated.name, href: stats.lastUpdated.url },
          text(`  ${new Date(stats.lastUpdated.pushedAt).toLocaleDateString(locale)}`, "muted"),
        ]
      : [text("-")];

    return [
      {
        type: "table",
        rows: [
          [[text(t.githubRepos, "muted")], [text(String(stats.publicRepos))]],
          [
            [text(t.githubLanguages, "muted")],
            [text(stats.topLanguages.slice(0, 3).join(", ") || "-")],
          ],
          [[text(t.githubLatest, "muted")], latest],
          [[text(t.githubProfile, "muted")], profileLink],
        ],
      },
    ];
  },
};
