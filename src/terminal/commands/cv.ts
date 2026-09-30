import { profile } from "../../content/profile";
import { messages } from "../../i18n/useLanguage";
import { line, text, type Command } from "../types";

export const cv: Command = {
  name: "cv",
  description: { tr: "CV'yi indir (PDF)", en: "Download CV (PDF)" },
  run: ({ lang, actions }) => {
    actions.download(profile.cvFile[lang]);
    return [line(text(messages[lang].terminal.cvDownloading, "teal"))];
  },
};
