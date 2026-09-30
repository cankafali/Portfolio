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
  setLang: (lang: Lang) => void;
  /** Bu oturumda çalıştırılan komutlar (eskiden yeniye). */
  history: () => readonly string[];
  /** Satırları hemen basar (akışlı çıktı veren komutlar için). */
  print: (lines: OutputLine[]) => void;
  /** Bir satır basar ve onu sonradan güncelleyen fonksiyonu döndürür. */
  printLive: (line: OutputLine) => (next: OutputLine) => void;
  /** Bekler; reduced motion açıkken beklemez. */
  wait: (ms: number) => Promise<void>;
  download: (url: string) => void;
};

export type CommandContext = {
  args: string[];
  /** Komut adından sonraki ham metin (echo boşlukları korusun diye). */
  input: string;
  lang: Lang;
  actions: TerminalActions;
};

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
