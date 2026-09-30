import { profile } from "../content/profile";
import { projects } from "../content/projects";
import type { Lang } from "../i18n/lang";
import { messages } from "../i18n/useLanguage";
import { whoamiLines } from "./commands/whoami";
import { blank, line, text, type OutputLine, type Segment } from "./types";

// TASARIM.md §5.2 zamanlamaları
export const INTRO_TIMING = {
  startMs: 300,
  charMs: 32,
  charJitterMs: 12,
  afterCommandMs: 220,
  lineMs: 50,
  betweenStepsMs: 200,
  maxTotalMs: 4500,
} as const;

export type IntroStep = { command: string; output: OutputLine[] };

type StepDefinition = {
  command: string;
  desktopOnly?: boolean;
  output: (lang: Lang) => OutputLine[];
};

const definitions: StepDefinition[] = [
  { command: "whoami", output: whoamiLines },
  {
    command: "cat focus.txt",
    desktopOnly: true,
    output: (lang) => [line(text(profile.focus[lang]))],
  },
  {
    command: "ls projects/",
    output: () => [
      line(
        ...projects.flatMap((project, i): Segment[] => [
          ...(i > 0 ? [text("   ")] : []),
          { kind: "command", text: `${project.slug}/`, command: `open ${project.slug}` },
        ]),
      ),
    ],
  },
  {
    command: "./contact.sh",
    output: (lang) => [
      line(
        {
          kind: "button",
          text: messages[lang].actions.workTogether,
          command: "contact",
          variant: "primary",
        },
        {
          kind: "button",
          text: messages[lang].actions.classicView,
          command: "gui",
          variant: "secondary",
        },
      ),
    ],
  },
];

/** Mobilde (`narrow`) `cat focus.txt` adımı atlanır. Her çıktıdan sonra boş satır gelir. */
export function introSteps(lang: Lang, narrow: boolean): IntroStep[] {
  return definitions
    .filter((step) => !(narrow && step.desktopOnly))
    .map((step) => ({ command: step.command, output: [...step.output(lang), blank()] }));
}

export const introHint = (lang: Lang): OutputLine =>
  line(text(messages[lang].terminal.exploreHint, "muted"));

/** Animasyonsuz, tamamlanmış intro: atlama, tekrar ziyaret ve reduced motion için. */
export function introTranscript(lang: Lang, narrow: boolean): OutputLine[] {
  return [
    ...introSteps(lang, narrow).flatMap((step): OutputLine[] => [
      { type: "prompt", command: step.command },
      ...step.output,
    ]),
    introHint(lang),
  ];
}

/**
 * Her komut için karakter başına gecikmeler (32ms ± 12ms).
 * Toplam süre 4.5 sn'yi aşarsa yalnızca yazma hızı orantılı artırılır.
 */
export function introCharDelays(steps: IntroStep[], random: () => number = Math.random) {
  const t = INTRO_TIMING;
  const delays = steps.map((step) =>
    [...step.command].map(() => t.charMs + (random() * 2 - 1) * t.charJitterMs),
  );
  const outputLines = steps.reduce((sum, step) => sum + step.output.length, 0) + 1;
  const fixed =
    t.startMs +
    steps.length * t.afterCommandMs +
    (steps.length - 1) * t.betweenStepsMs +
    outputLines * t.lineMs;
  const typing = delays.flat().reduce((sum, ms) => sum + ms, 0);
  const budget = t.maxTotalMs - fixed;
  const scale = typing > budget ? Math.max(budget, 0) / typing : 1;
  return delays.map((row) => row.map((ms) => ms * scale));
}
