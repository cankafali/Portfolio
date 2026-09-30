import { useRef } from "react";

/**
 * ↑/↓ ile komut geçmişinde gezinme. İlk ↑'da yazılmakta olan satır saklanır,
 * en yeni kaydın ötesine ↓ ile inilince geri verilir.
 */
export function useCommandHistory(history: readonly string[]) {
  const indexRef = useRef<number | null>(null);
  const draftRef = useRef("");

  const previous = (current: string): string | null => {
    if (history.length === 0) return null;
    if (indexRef.current === null) {
      draftRef.current = current;
      indexRef.current = history.length - 1;
    } else if (indexRef.current > 0) {
      indexRef.current -= 1;
    }
    return history[indexRef.current] ?? null;
  };

  const next = (): string | null => {
    if (indexRef.current === null) return null;
    if (indexRef.current < history.length - 1) {
      indexRef.current += 1;
      return history[indexRef.current] ?? null;
    }
    indexRef.current = null;
    return draftRef.current;
  };

  const reset = () => {
    indexRef.current = null;
  };

  return { previous, next, reset };
}
