import { profile } from "../../content/profile";
import { messages } from "../../i18n/useLanguage";
import type { Lang } from "../../i18n/lang";
import { text, type Command, type OutputLine } from "../types";

// sudo hire-me de aynı çıktıyı basar.
export const contactLines = (lang: Lang): OutputLine[] => [
  {
    type: "table",
    rows: [
      [
        [text(messages[lang].terminal.email, "muted")],
        [
          { kind: "link", text: profile.email, href: `mailto:${profile.email}` },
          text("  "),
          { kind: "copy", value: profile.email },
        ],
      ],
      [
        [text("LinkedIn", "muted")],
        [{ kind: "link", text: profile.links.linkedin, href: profile.links.linkedin }],
      ],
      [
        [text("GitHub", "muted")],
        [{ kind: "link", text: profile.links.github, href: profile.links.github }],
      ],
    ],
  },
];

export const contact: Command = {
  name: "contact",
  aliases: ["iletisim"],
  description: { tr: "İletişim bilgileri", en: "Contact details" },
  run: ({ lang }) => contactLines(lang),
};
