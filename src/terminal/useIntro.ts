import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { isAbort, useTypewriter, wait } from "../hooks/useTypewriter";
import type { Lang } from "../i18n/lang";
import {
  INTRO_TIMING,
  introCharDelays,
  introHint,
  introSteps,
  introTranscript,
} from "./introScript";
import type { TerminalSession } from "./useTerminalSession";

type Options = {
  enabled: boolean;
  narrow: boolean;
  lang: Lang;
  session: TerminalSession;
  onDone: () => void;
};

export type IntroState = {
  running: boolean;
  typed: string;
  skip: () => void;
};

// Intro yazılan komutu aktif satırda gösterir; satır tamamlanınca log'a düşer,
// böylece ekran okuyucu karakter değil satır duyurur.
export function useIntro({ enabled, narrow, lang, session, onDone }: Options): IntroState {
  const { typed, type, reset } = useTypewriter();
  const [running, setRunning] = useState(enabled);
  const controllerRef = useRef<AbortController | null>(null);

  const finish = useCallback(() => {
    reset();
    setRunning(false);
    onDone();
  }, [reset, onDone]);

  const play = useEffectEvent(async (signal: AbortSignal) => {
    const t = INTRO_TIMING;
    const steps = introSteps(lang, narrow);
    const delays = introCharDelays(steps);

    for (const [i, step] of steps.entries()) {
      if (i > 0) await wait(t.betweenStepsMs, signal);
      await type(step.command, (c) => delays[i]?.[c] ?? t.charMs, signal);
      await wait(t.afterCommandMs, signal);
      reset();
      session.append([{ type: "prompt", command: step.command }]);
      for (const output of step.output) {
        await wait(t.lineMs, signal);
        session.append([output]);
      }
    }
    await wait(t.lineMs, signal);
    session.append([introHint(lang)]);
    finish();
  });

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    controllerRef.current = controller;
    // İlk karakterden önceki kısa bekleme (TASARIM.md zamanlamasına dahil).
    const timer = window.setTimeout(() => {
      play(controller.signal).catch((error: unknown) => {
        if (!isAbort(error)) throw error;
      });
    }, INTRO_TIMING.startMs);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [enabled]);

  const skip = useCallback(() => {
    controllerRef.current?.abort();
    session.clear();
    session.append(introTranscript(lang, narrow));
    finish();
  }, [session, lang, narrow, finish]);

  return { running, typed, skip };
}
