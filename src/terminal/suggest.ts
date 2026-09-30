/** İki dizge arasındaki düzenleme mesafesi (ekleme, silme, değiştirme). */
export function levenshtein(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        (previous[j] ?? 0) + 1,
        (current[j - 1] ?? 0) + 1,
        (previous[j - 1] ?? 0) + cost,
      );
    }
    previous = current;
  }
  return previous[b.length] ?? 0;
}

export const MAX_SUGGESTION_DISTANCE = 2;

/** Adaylar içinde mesafesi ≤ 2 olan en yakını; eşitlikte listedeki ilk aday. */
export function closest<T>(
  word: string,
  candidates: readonly T[],
  keysOf: (candidate: T) => readonly string[],
): T | null {
  let best: T | null = null;
  let bestDistance = MAX_SUGGESTION_DISTANCE + 1;
  for (const candidate of candidates) {
    for (const key of keysOf(candidate)) {
      const distance = levenshtein(word, key);
      if (distance < bestDistance) {
        best = candidate;
        bestDistance = distance;
      }
    }
  }
  return best;
}
