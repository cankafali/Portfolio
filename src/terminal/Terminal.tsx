import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { useCommandHistory } from "../hooks/useCommandHistory";
import { prefersReducedMotion } from "../hooks/useReducedMotion";
import { isAbort, useTypewriter } from "../hooks/useTypewriter";
import { useLanguage } from "../i18n/useLanguage";
import { CommandChips } from "./CommandChips";
import { complete } from "./complete";
import { MINI_TERMINAL_ID } from "./MiniTerminal";
import { playClose, playOpen } from "./morph";
import { OutputLine } from "./OutputLine";
import { Prompt } from "./Prompt";
import styles from "./Terminal.module.css";
import { TERMINAL_TITLE_ID, TerminalWindow } from "./TerminalWindow";
import { useIntro } from "./useIntro";
import type { TerminalSession } from "./useTerminalSession";
import { line, text } from "./types";

export type TerminalPhase = "opening" | "open" | "closing";

type Props = {
  session: TerminalSession;
  phase: TerminalPhase;
  /** Esc, kırmızı/sarı nokta: kapanış morph'unu başlatır. */
  onClose: () => void;
  onPhaseEnd: (phase: "opening" | "closing") => void;
  /** Yalnızca ilk açılışta, intro daha önce görülmediyse true. */
  playIntro: boolean;
  narrow: boolean;
  onIntroDone: () => void;
};

const TYPING_PAUSE_MS = 600;
const SWALLOW_CLICK_MS = 500;
const CHIP_CHAR_MS = 12;

const hasFinePointer = () => window.matchMedia("(pointer: fine)").matches;

export function Terminal({
  session,
  phase,
  onClose,
  onPhaseEnd,
  playIntro,
  narrow,
  onIntroDone,
}: Props) {
  const { lang, t } = useLanguage();
  const intro = useIntro({ enabled: playIntro, narrow, lang, session, onDone: onIntroDone });
  const [value, setValue] = useState("");
  const [caret, setCaret] = useState(0);
  const [typing, setTyping] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<number | undefined>(undefined);
  const chipController = useRef<AbortController | null>(null);
  const commandHistory = useCommandHistory(session.history);
  const chipTyper = useTypewriter();

  const focusInput = () => inputRef.current?.focus({ preventScroll: true });

  useEffect(
    () => () => {
      window.clearTimeout(typingTimer.current);
      chipController.current?.abort();
    },
    [],
  );

  // Pencere açık hale gelince odak input'a gelir. Dokunmatik cihazda klavyeyi zorla
  // açmamak için odak input yerine pencereye alınır.
  useEffect(() => {
    if (phase !== "open") return;
    if (hasFinePointer()) focusInput();
    else overlayRef.current?.focus({ preventScroll: true });
  }, [phase]);

  // Morph: layout effect içinde başlar ki ilk kare zaten başlangıç konumunda boyansın.
  useLayoutEffect(() => {
    if (phase === "open") return;
    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    const frame = frameRef.current;
    const content = bodyRef.current;
    if (!overlay || !backdrop || !frame || !content) return;

    const parts = { overlay, backdrop, frame, content };
    const mini = document.getElementById(MINI_TERMINAL_ID);
    const animations = phase === "closing" ? playClose(parts, mini) : playOpen(parts, mini);
    let cancelled = false;
    Promise.all(animations.map((animation) => animation.finished))
      .then(() => {
        if (!cancelled) onPhaseEnd(phase);
      })
      .catch(() => {
        // iptal edilen animasyon (ör. StrictMode'da effect tekrarı)
      });
    return () => {
      cancelled = true;
      for (const animation of animations) animation.cancel();
    };
  }, [phase, onPhaseEnd]);

  useLayoutEffect(() => {
    const output = outputRef.current;
    if (output) output.scrollTop = output.scrollHeight;
  }, [session.entries, intro.typed, chipTyper.typed]);

  // Intro sırasında herhangi bir tuş, tık veya dokunuş introyu anında tamamlar.
  // Atlatan tuş/tık başka bir iş yapmaz (ör. Esc pencereyi kapatmaz, tık yeni butona düşmez).
  const { running: introRunning, skip: skipIntro } = intro;
  useEffect(() => {
    if (!introRunning) return;
    const swallowClick = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      skipIntro();
    };
    const onPointerDown = () => {
      window.addEventListener("click", swallowClick, { capture: true, once: true });
      window.setTimeout(
        () => window.removeEventListener("click", swallowClick, { capture: true }),
        SWALLOW_CLICK_MS,
      );
      skipIntro();
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("pointerdown", onPointerDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("pointerdown", onPointerDown, { capture: true });
    };
  }, [introRunning, skipIntro]);

  const markTyping = () => {
    setTyping(true);
    window.clearTimeout(typingTimer.current);
    typingTimer.current = window.setTimeout(() => setTyping(false), TYPING_PAUSE_MS);
  };

  const syncCaret = () => setCaret(inputRef.current?.selectionStart ?? value.length);

  const setInput = (next: string) => {
    setValue(next);
    setCaret(next.length);
  };

  const resetInput = () => setInput("");

  // Çıktıdaki tıklanabilir öğeler ve çipler. Dokunmatikte input'a odaklanıp
  // klavyeyi açmaz (mobilde gezinme çiplerle yapılır).
  const runCommand = (command: string) => {
    void session.run(command);
    if (hasFinePointer()) focusInput();
  };

  // Çip: komut hızlandırılmış yazma animasyonuyla (12ms/karakter) yazılıp çalıştırılır.
  const runChip = async (command: string) => {
    if (chipController.current) return;
    commandHistory.reset();
    resetInput();
    if (prefersReducedMotion()) {
      runCommand(command);
      return;
    }
    const controller = new AbortController();
    chipController.current = controller;
    try {
      await chipTyper.type(command, () => CHIP_CHAR_MS, controller.signal);
      chipTyper.reset();
      runCommand(command);
    } catch (error) {
      if (!isAbort(error)) throw error;
    } finally {
      chipController.current = null;
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setCaret(event.target.selectionStart ?? event.target.value.length);
    markTyping();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const ctrl = event.ctrlKey || event.metaKey;

    if (event.key === "Enter") {
      event.preventDefault();
      commandHistory.reset();
      runCommand(value);
      resetInput();
    } else if (event.key === "Tab" && !event.shiftKey) {
      // Shift+Tab odağı dışarı taşımaya devam eder (klavye tuzağı olmasın).
      event.preventDefault();
      const completion = complete(value);
      if (completion.options.length > 1) {
        session.append([
          { type: "prompt", command: value },
          line(text(completion.options.join("   "), "teal")),
        ]);
      }
      setInput(completion.value);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const previous = commandHistory.previous(value);
      if (previous !== null) setInput(previous);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = commandHistory.next();
      if (next !== null) setInput(next);
    } else if (ctrl && event.key.toLowerCase() === "l") {
      event.preventDefault();
      session.clear();
    } else if (event.ctrlKey && event.key.toLowerCase() === "c") {
      event.preventDefault();
      session.append([{ type: "prompt", command: `${value}^C` }]);
      resetInput();
    }
  };

  // Esc pencerenin her yerinde çalışır (odak bir linkte ya da düğmede olsa bile).
  const handleWindowKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
  };

  // Pencereye tıklamak input'a odaklar; metin seçimi ve tıklanabilir öğeler hariç.
  const handleWindowClick = (event: MouseEvent<HTMLDivElement>) => {
    if (window.getSelection()?.toString()) return;
    if (event.target instanceof Element && event.target.closest("a, button")) return;
    focusInput();
  };

  // Aktif satır: intro ya da çip yazıyorsa yazılan komut, değilse input'un değeri.
  const animatedText = introRunning ? intro.typed : chipTyper.typed;
  const animating = introRunning || chipTyper.typed !== "";
  const shown = animating ? animatedText : value;
  const cursorAt = animating ? shown.length : caret;
  const before = shown.slice(0, cursorAt);
  const underCursor = shown.slice(cursorAt, cursorAt + 1) || " ";
  const after = shown.slice(cursorAt + 1);
  const cursorSteady = typing || animating;

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      data-phase={phase}
      role="dialog"
      aria-modal="true"
      aria-labelledby={TERMINAL_TITLE_ID}
      tabIndex={-1}
      onKeyDown={handleWindowKeyDown}
    >
      <div ref={backdropRef} className={styles.backdrop} />
      <TerminalWindow
        ref={frameRef}
        fullscreen={fullscreen}
        onClose={onClose}
        onToggleFullscreen={() => setFullscreen((on) => !on)}
      >
        <div ref={bodyRef} className={styles.body} onClick={handleWindowClick}>
          <div className={styles.outputArea}>
            <div ref={outputRef} className={styles.output}>
              <div role="log" aria-live="polite">
                {session.entries.map((entry) => (
                  <OutputLine key={entry.id} line={entry.line} onCommand={runCommand} />
                ))}
              </div>
              <div className={styles.activeLine}>
                <Prompt>
                  <span aria-hidden="true">
                    {before}
                    <span className={`${styles.cursor} ${cursorSteady ? styles.typing : ""}`}>
                      {underCursor}
                    </span>
                    {after}
                  </span>
                </Prompt>
                <input
                  ref={inputRef}
                  className={styles.input}
                  value={value}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onSelect={syncCaret}
                  aria-label={t.terminal.inputLabel}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="send"
                />
              </div>
            </div>
            {introRunning && (
              <p className={styles.skipHint} aria-hidden="true">
                {t.terminal.skipHint}
              </p>
            )}
          </div>
          <CommandChips onRun={(command) => void runChip(command)} />
        </div>
      </TerminalWindow>
    </div>
  );
}
