import { about } from "./commands/about";
import { clear } from "./commands/clear";
import { contact } from "./commands/contact";
import { gui } from "./commands/gui";
import { createHelpCommand } from "./commands/help";
import { open } from "./commands/open";
import { projects } from "./commands/projects";
import { whoami } from "./commands/whoami";
import type { Command } from "./types";

// Sıra, help çıktısındaki sıradır.
export const commands: Command[] = [];
commands.push(
  createHelpCommand(() => commands),
  whoami,
  about,
  projects,
  open,
  contact,
  gui,
  clear,
);

export type ResolvedCommand = { command: Command; args: string[] };

// Büyük/küçük harf duyarsız; "ls projects" gibi çok kelimeli takma adlar önce denenir.
export function resolveCommand(input: string): ResolvedCommand | null {
  const words = input.trim().split(/\s+/).filter(Boolean);
  const lowered = words.map((word) => word.toLowerCase());

  for (let size = Math.min(lowered.length, 2); size > 0; size--) {
    const key = lowered.slice(0, size).join(" ");
    const command = commands.find(
      (candidate) => candidate.name === key || candidate.aliases?.includes(key),
    );
    if (command) return { command, args: words.slice(size) };
  }
  return null;
}
