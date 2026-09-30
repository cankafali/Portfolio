import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { useLanguage } from "../i18n/useLanguage";
import { OutputLine } from "./OutputLine";
import { Prompt } from "./Prompt";
import styles from "./Terminal.module.css";
import { TERMINAL_TITLE_ID, TerminalWindow } from "./TerminalWindow";
import { useIntro } from "./useIntro";
import type { TerminalSession } from "./useTerminalSession";

type Props = {
  session: TerminalSession;
  onClose: () => void;
  /** Yalnızca ilk açılışta, intro daha önce görülmediyse true. */
  playIntro: boolean;
  narrow: boolean;
  onIntroDone: () => void;
};

const TYPING_PAUSE_MS = 600;
const SWALLOW_CLICK_MS = 500;

export function Terminal({ session, onClose, playIntro, narrow, onIntroDone }: Props) {
  const { lang, t } = useLanguage();
  const intro = useIntro({ enabled: playIntro, narrow, lang, session, onDone: onIntroDone });
  const [value, setValue] = useState("");
  const [caret, setCaret] = useState(0);
  const [typing, setTyping] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<number | undefined>(undefined);

  const focusInput = () => inputRef.current?.focus({ preventScroll: true });

  // Dokunmatik cihazda açılışta klavyeyi zorla açma; yalnızca hassas işaretçide odaklan.
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) focusInput();
    return () => window.clearTimeout(typingTimer.current);
  }, []);

  useLayoutEffect(() => {
    const output = outputRef.current;
    if (output) output.scrollTop = output.scrollHeight;
  }, [session.entries, intro.typed]);

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

  const resetInput = () => {
    setValue("");
    setCaret(0);
  };

  const runCommand = (command: string) => {
    void session.run(command);
    focusInput();
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
      runCommand(value);
      resetInput();
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

  // Intro yazarken aktif satır yazılan komutu, sonra input'un değerini gösterir.
  const shown = introRunning ? intro.typed : value;
  const cursorAt = introRunning ? shown.length : caret;
  const before = shown.slice(0, cursorAt);
  const underCursor = shown.slice(cursorAt, cursorAt + 1) || " ";
  const after = shown.slice(cursorAt + 1);
  const cursorSteady = typing || introRunning;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby={TERMINAL_TITLE_ID}
      onKeyDown={handleWindowKeyDown}
    >
      <TerminalWindow
        fullscreen={fullscreen}
        onClose={onClose}
        onToggleFullscreen={() => setFullscreen((on) => !on)}
      >
        <div className={styles.body} onClick={handleWindowClick}>
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
      </TerminalWindow>
    </div>
  );
}
