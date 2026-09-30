import { useCallback, useState } from "react";

/** `signal` iptal edilirse AbortError ile reddedilen bekleme. */
export function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }
    const timer = window.setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

export const isAbort = (error: unknown) =>
  error instanceof DOMException && error.name === "AbortError";

/** Metni karakter karakter yazar; `typed` o ana kadar yazılmış kısımdır. */
export function useTypewriter() {
  const [typed, setTyped] = useState("");

  const type = useCallback(
    async (value: string, delayFor: (index: number) => number, signal: AbortSignal) => {
      for (let i = 0; i < value.length; i++) {
        await wait(delayFor(i), signal);
        setTyped(value.slice(0, i + 1));
      }
    },
    [],
  );

  const reset = useCallback(() => setTyped(""), []);

  return { typed, type, reset };
}
