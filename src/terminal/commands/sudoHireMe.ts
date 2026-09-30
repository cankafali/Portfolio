import { messages } from "../../i18n/useLanguage";
import { line, text, type Command } from "../types";
import { contactLines } from "./contact";

const PASSWORD_LENGTH = 8;
const STAR_MS = 70;

export const sudoHireMe: Command = {
  name: "sudo hire-me",
  hidden: true,
  description: { tr: "İşe al", en: "Hire me" },
  run: async ({ lang, actions }) => {
    const prompt = "[sudo] password for recruiter: ";
    const update = actions.printLive(line(text(prompt)));
    // Şifre yıldızları 70ms arayla tek tek belirir.
    for (let i = 1; i <= PASSWORD_LENGTH; i++) {
      await actions.wait(STAR_MS);
      update(line(text(prompt), text("*".repeat(i), "amber")));
    }
    await actions.wait(STAR_MS * 3);
    actions.print([line(text(messages[lang].terminal.sudoGranted, "teal"))]);
    return contactLines(lang);
  },
};
