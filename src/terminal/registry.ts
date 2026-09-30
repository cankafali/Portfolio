import { about } from "./commands/about";
import { clear } from "./commands/clear";
import { coffee } from "./commands/coffee";
import { contact } from "./commands/contact";
import { cv } from "./commands/cv";
import { date } from "./commands/date";
import { echo } from "./commands/echo";
import { education } from "./commands/education";
import { github } from "./commands/github";
import { gui } from "./commands/gui";
import { createHelpCommand } from "./commands/help";
import { history } from "./commands/history";
import { lang } from "./commands/lang";
import { open } from "./commands/open";
import { projects } from "./commands/projects";
import { pwd } from "./commands/pwd";
import { rmRf } from "./commands/rmRf";
import { skills } from "./commands/skills";
import { sudoHireMe } from "./commands/sudoHireMe";
import { whoami } from "./commands/whoami";
import { closest } from "./suggest";
import type { Command } from "./types";

// Sıra, help çıktısındaki sıradır (TASARIM.md §5.3). Gizli komutlar en sonda.
export const commands: Command[] = [];
commands.push(
  createHelpCommand(() => commands),
  whoami,
  about,
  projects,
  open,
  skills,
  education,
  github,
  contact,
  cv,
  lang,
  gui,
  clear,
  history,
  pwd,
  date,
  echo,
  sudoHireMe,
  coffee,
  rmRf,
);

export const visibleCommands = () => commands.filter((command) => !command.hidden);

export type ResolvedCommand = { command: Command; args: string[]; input: string };

const MAX_NAME_WORDS = 3; // "rm -rf /"

// Büyük/küçük harf duyarsız; çok kelimeli adlar ("sudo hire-me", "ls projects") önce denenir.
export function resolveCommand(input: string): ResolvedCommand | null {
  const trimmed = input.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const lowered = words.map((word) => word.toLowerCase());

  for (let size = Math.min(lowered.length, MAX_NAME_WORDS); size > 0; size--) {
    const key = lowered.slice(0, size).join(" ");
    const command = commands.find(
      (candidate) => candidate.name === key || candidate.aliases?.includes(key),
    );
    if (command) {
      const rest = trimmed.replace(new RegExp(`^(\\S+\\s*){${size}}`), "");
      return { command, args: words.slice(size), input: rest };
    }
  }
  return null;
}

// "?" gibi çok kısa takma adlar her kısa girdiye 2 mesafede kalır; öneriye katılmaz.
const MIN_SUGGEST_LENGTH = 3;

const suggestionKeys = (command: Command) =>
  [command.name, ...(command.aliases ?? [])].filter((key) => key.length >= MIN_SUGGEST_LENGTH);

/**
 * Bilinmeyen komut için öneri (Levenshtein ≤ 2). Çok kelimeli girdide önce tüm girdi
 * çok kelimeli takma adlarla ("ls projcts" → projects), sonra ilk kelime ad ve
 * takma adlarla karşılaştırılır. Gizli komutlar önerilmez.
 */
export function suggestCommand(input: string): Command | null {
  const lowered = input.trim().toLowerCase();
  const words = lowered.split(/\s+/);
  const visible = visibleCommands();

  if (words.length > 1) {
    const multiWord = closest(lowered, visible, (command) =>
      suggestionKeys(command).filter((key) => key.includes(" ")),
    );
    if (multiWord) return multiWord;
  }
  return closest(words[0] ?? lowered, visible, suggestionKeys);
}
