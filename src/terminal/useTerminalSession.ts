import { useCallback, useMemo, useRef, useState } from "react";
import { prefersReducedMotion } from "../hooks/useReducedMotion";
import type { Lang } from "../i18n/lang";
import { messages } from "../i18n/useLanguage";
import { resolveCommand, suggestCommand } from "./registry";
import { blank, line, text, type OutputLine, type TerminalActions } from "./types";

export type Entry = { id: number; line: OutputLine };

export type TerminalSession = {
  entries: Entry[];
  /** Bu oturumda çalıştırılan komutlar (↑/↓ ve history için). */
  history: readonly string[];
  run: (input: string) => Promise<void>;
  append: (lines: OutputLine[]) => void;
  clear: () => void;
};

type Options = {
  lang: Lang;
  /** Oturum açılırken basılı satırlar (intro durumuna göre App belirler). */
  initialLines: () => OutputLine[];
  onOpenClassic: () => void;
  onSetLang: (lang: Lang) => void;
};

function downloadFile(url: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = url.split("/").pop() ?? "";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
}

// Çıktı geçmişi terminal penceresinden bağımsız tutulur;
// pencere kapanıp açıldığında (klasik ↔ terminal) geçmiş korunur.
export function useTerminalSession({
  lang,
  initialLines,
  onOpenClassic,
  onSetLang,
}: Options): TerminalSession {
  const [entries, setEntries] = useState<Entry[]>(() =>
    initialLines().map((item, id) => ({ id, line: item })),
  );
  const [history, setHistory] = useState<readonly string[]>([]);
  const nextId = useRef(entries.length);
  const historyRef = useRef<readonly string[]>([]);
  const runningRef = useRef(false);
  const printedRef = useRef(false);

  const append = useCallback((lines: OutputLine[]) => {
    const created = lines.map((item) => ({ id: nextId.current++, line: item }));
    setEntries((prev) => [...prev, ...created]);
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  const actions = useMemo<TerminalActions>(
    () => ({
      clear,
      openClassic: onOpenClassic,
      setLang: onSetLang,
      history: () => historyRef.current,
      print: (lines) => {
        printedRef.current = true;
        append(lines);
      },
      printLive: (initial) => {
        printedRef.current = true;
        const id = nextId.current++;
        setEntries((prev) => [...prev, { id, line: initial }]);
        return (next) =>
          setEntries((prev) => prev.map((entry) => (entry.id === id ? { id, line: next } : entry)));
      },
      wait: (ms) =>
        prefersReducedMotion()
          ? Promise.resolve()
          : new Promise((resolve) => window.setTimeout(resolve, ms)),
      download: downloadFile,
    }),
    [clear, onOpenClassic, onSetLang, append],
  );

  const run = useCallback(
    async (input: string) => {
      // Akışlı bir komut (sudo hire-me, coffee) sürerken yenisi başlamaz; çıktılar karışmasın.
      if (runningRef.current) return;
      append([{ type: "prompt", command: input }]);
      const trimmed = input.trim();
      if (!trimmed) return;

      historyRef.current = [...historyRef.current, trimmed];
      setHistory(historyRef.current);

      const t = messages[lang].terminal;
      const resolved = resolveCommand(trimmed);
      if (!resolved) {
        const name = trimmed.split(/\s+/)[0] ?? trimmed;
        const suggestion = suggestCommand(trimmed);
        append([
          line(text(`${t.notFound}: ${name}`, "red")),
          ...(suggestion
            ? [
                line(text(`${t.didYouMean} `, "muted"), {
                  kind: "command",
                  text: suggestion.name,
                  command: suggestion.name,
                }),
              ]
            : []),
          blank(),
        ]);
        return;
      }

      runningRef.current = true;
      printedRef.current = false;
      try {
        const output = await resolved.command.run({
          args: resolved.args,
          input: resolved.input,
          lang,
          actions,
        });
        // Çıktıdan sonra boş satır: komutlar görsel olarak ayrışsın (intro senaryosundaki gibi).
        // clear ve gui gibi hiçbir şey basmayan komutlardan sonra boş satır olmaz.
        if (output.length > 0 || printedRef.current) append([...output, blank()]);
      } finally {
        runningRef.current = false;
      }
    },
    [append, actions, lang],
  );

  return useMemo(
    () => ({ entries, history, run, append, clear }),
    [entries, history, run, append, clear],
  );
}
