import { projects } from "../content/projects";
import { LANGS } from "../i18n/lang";
import { visibleCommands } from "./registry";

export type Completion = {
  /** Tamamlanmış girdi (tek eşleşmede sonuna boşluk eklenir). */
  value: string;
  /** Birden fazla eşleşme varsa hepsi (listelenmek üzere). */
  options: string[];
};

// Argüman tamamlama: open <proje>, lang <dil>
const argumentCandidates: Record<string, () => string[]> = {
  open: () => projects.map((project) => project.slug),
  lang: () => [...LANGS],
};

function commonPrefix(values: string[]): string {
  if (values.length === 0) return "";
  let prefix = values[0] ?? "";
  for (const value of values) {
    while (!value.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

function fill(input: string, partial: string, candidates: string[]): Completion {
  const lowered = partial.toLowerCase();
  const matches = candidates.filter((candidate) => candidate.startsWith(lowered));
  const base = input.slice(0, input.length - partial.length);
  if (matches.length === 0) return { value: input, options: [] };
  if (matches.length === 1) return { value: `${base}${matches[0]} `, options: [] };
  const prefix = commonPrefix(matches);
  return {
    value: prefix.length > partial.length ? base + prefix : input,
    options: matches,
  };
}

/** Tab: komut adı ya da (open/lang için) argüman tamamlar. */
export function complete(input: string): Completion {
  const words = input.trimStart().split(/\s+/);
  const endsWithSpace = /\s$/.test(input);
  const commandWord = (words[0] ?? "").toLowerCase();

  if (words.length === 1 && !endsWithSpace) {
    return fill(
      input,
      words[0] ?? "",
      visibleCommands().map((command) => command.name),
    );
  }

  // "open " → ["open", ""], "open l" → ["open", "l"]: yalnızca ilk argüman tamamlanır.
  const candidates = argumentCandidates[commandWord];
  const onFirstArgument = endsWithSpace ? words.filter(Boolean).length === 1 : words.length === 2;
  if (!candidates || !onFirstArgument) return { value: input, options: [] };

  const partial = endsWithSpace ? "" : (words[words.length - 1] ?? "");
  return fill(input, partial, candidates());
}
