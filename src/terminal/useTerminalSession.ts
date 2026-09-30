import { useCallback, useMemo, useRef, useState } from "react";
import type { Lang } from "../i18n/lang";
import { messages } from "../i18n/useLanguage";
import { resolveCommand } from "./registry";
import { blank, line, text, type OutputLine, type TerminalActions } from "./types";

export type Entry = { id: number; line: OutputLine };

export type TerminalSession = {
  entries: Entry[];
  run: (input: string) => Promise<void>;
  append: (lines: OutputLine[]) => void;
  clear: () => void;
};

// Çıktı geçmişi terminal penceresinden bağımsız tutulur;
// pencere kapanıp açıldığında (klasik ↔ terminal) geçmiş korunur.
export function useTerminalSession(lang: Lang): TerminalSession {
  const [entries, setEntries] = useState<Entry[]>(() => [
    { id: 0, line: line(text(messages[lang].terminal.exploreHint, "muted")) },
  ]);
  const nextId = useRef(1);

  const append = useCallback((lines: OutputLine[]) => {
    const created = lines.map((item) => ({ id: nextId.current++, line: item }));
    setEntries((prev) => [...prev, ...created]);
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  const actions = useMemo<TerminalActions>(() => ({ clear }), [clear]);

  const run = useCallback(
    async (input: string) => {
      append([{ type: "prompt", command: input }]);
      const trimmed = input.trim();
      if (!trimmed) return;

      const resolved = resolveCommand(trimmed);
      if (!resolved) {
        const name = trimmed.split(/\s+/)[0] ?? trimmed;
        append([line(text(`${messages[lang].terminal.notFound}: ${name}`, "red")), blank()]);
        return;
      }
      const output = await resolved.command.run({ args: resolved.args, lang, actions });
      // Çıktıdan sonra boş satır: komutlar görsel olarak ayrışsın (intro senaryosundaki gibi).
      if (output.length > 0) append([...output, blank()]);
    },
    [append, actions, lang],
  );

  return useMemo(() => ({ entries, run, append, clear }), [entries, run, append, clear]);
}
