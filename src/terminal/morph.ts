// Terminal ↔ mini terminal dönüşümü (TASARIM.md §6), Web Animations API ile.
//
// Pencere ölçeklenmez (metin ve köşeler bozulmasın diye); yerinde kalan pencere
// `clip-path: inset(... round r)` ile sağ alt köşesine doğru kırpılırken
// `transform: translate` ile mini terminalin konumuna taşınır. İkisi de layout
// tetiklemez; içerik (çıktı + çipler) önceden şeffaflaştığı için görünen yalnızca mürekkep zemindir.

import { prefersReducedMotion } from "../hooks/useReducedMotion";

const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)"; // --ease-out
const MORPH_MS = 720; // --dur-morph
const OUTPUT_FADE_MS = 160;
const WINDOW_DELAY_MS = 80;
const NAME_DELAY_MS = 400;
const NAME_FADE_MS = 240;
const OUTPUT_FADE_IN_DELAY_MS = 480;
const REDUCED_MS = 150;

// Mini terminal ölçülemezse (§7'deki konum ve boyut)
const MINI = { width: 176, height: 44, inset: 20 };

export type MorphParts = {
  overlay: HTMLElement;
  backdrop: HTMLElement;
  frame: HTMLElement;
  /** Çıktı ve komut çipleri: pencere küçülmeden önce solar. */
  content: HTMLElement;
};

function miniRect(mini: HTMLElement | null): DOMRect {
  if (mini) return mini.getBoundingClientRect();
  return new DOMRect(
    window.innerWidth - MINI.inset - MINI.width,
    window.innerHeight - MINI.inset - MINI.height,
    MINI.width,
    MINI.height,
  );
}

/** [tam pencere, mini terminal] anahtar kareleri; kırpma sağ alt köşeye sabitlenir. */
function frameKeyframes(frame: HTMLElement, mini: HTMLElement | null): Keyframe[] {
  const from = frame.getBoundingClientRect();
  const to = miniRect(mini);
  const dx = to.right - from.right;
  const dy = to.bottom - from.bottom;
  const top = Math.max(from.height - to.height, 0);
  const left = Math.max(from.width - to.width, 0);
  return [
    { transform: "translate(0px, 0px)", clipPath: "inset(0px 0px 0px 0px round 12px)" },
    {
      transform: `translate(${dx}px, ${dy}px)`,
      clipPath: `inset(${top}px 0px 0px ${left}px round 10px)`,
    },
  ];
}

const fade = (from: number, to: number): Keyframe[] => [{ opacity: from }, { opacity: to }];

/** gui: pencere mini terminale küçülür, klasik görünümdeki isim belirir. */
export function playClose(parts: MorphParts, mini: HTMLElement | null): Animation[] {
  if (prefersReducedMotion()) {
    return [parts.overlay.animate(fade(1, 0), { duration: REDUCED_MS, fill: "forwards" })];
  }
  const hero = document.getElementById("hero-name");
  return [
    parts.content.animate(fade(1, 0), { duration: OUTPUT_FADE_MS, fill: "forwards" }),
    parts.backdrop.animate(fade(1, 0), { duration: MORPH_MS, easing: EASE, fill: "forwards" }),
    parts.frame.animate(frameKeyframes(parts.frame, mini), {
      delay: WINDOW_DELAY_MS,
      duration: MORPH_MS,
      easing: EASE,
      fill: "both",
    }),
    ...(hero
      ? [
          hero.animate(fade(0, 1), {
            delay: NAME_DELAY_MS,
            duration: NAME_FADE_MS,
            easing: EASE,
            fill: "backwards",
          }),
        ]
      : []),
  ];
}

/** Mini terminal tam pencereye büyür; önceki çıktı sonunda belirir. */
export function playOpen(parts: MorphParts, mini: HTMLElement | null): Animation[] {
  if (prefersReducedMotion()) {
    return [parts.overlay.animate(fade(0, 1), { duration: REDUCED_MS, fill: "backwards" })];
  }
  return [
    parts.backdrop.animate(fade(0, 1), { duration: MORPH_MS, easing: EASE, fill: "backwards" }),
    parts.frame.animate(frameKeyframes(parts.frame, mini).reverse(), {
      duration: MORPH_MS,
      easing: EASE,
      fill: "backwards",
    }),
    parts.content.animate(fade(0, 1), {
      delay: OUTPUT_FADE_IN_DELAY_MS,
      duration: NAME_FADE_MS,
      fill: "backwards",
    }),
  ];
}
