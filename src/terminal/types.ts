import type { Lang } from "../i18n/lang";

export type Tone = "default" | "muted" | "teal" | "amber" | "red" | "strong";

// Çıktı düz metin değil, parça listesi: HTML hiçbir zaman string olarak basılmaz.
export type Segment =
  | { kind: "text"; text: string; tone?: Tone }
  | { kind: "link"; text: string; href: string; download?: boolean }
  | { kind: "command"; text: string; command: string }
  | { kind: "copy"; value: string }
  | { kind: "button"; text: string; command: string; variant: "primary" | "secondary" };

export type OutputLine =
  | { type: "prompt"; command: string }
  | { type: "text"; segments: Segment[] }
  | { type: "table"; rows: Segment[][][] };

export type TerminalActions = {
  clear: () => void;
  openClassic: () => void;
};

export type CommandContext = { args: string[]; lang: Lang; actions: TerminalActions };

export type Command = {
  name: string;
  aliases?: string[];
  hidden?: boolean;
  usage?: Record<Lang, string>;
  description: Record<Lang, string>;
  run: (ctx: CommandContext) => OutputLine[] | Promise<OutputLine[]>;
};

export const text = (value: string, tone?: Tone): Segment => ({ kind: "text", text: value, tone });

export const line = (...segments: Segment[]): OutputLine => ({ type: "text", segments });

export const blank = (): OutputLine => ({ type: "text", segments: [] });
