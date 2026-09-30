import { useCallback, useEffect, useRef, useState } from "react";
import { ClassicView } from "./classic/ClassicView";
import { prefersReducedMotion } from "./hooks/useReducedMotion";
import { LanguageProvider } from "./i18n/LanguageContext";
import { useLanguage } from "./i18n/useLanguage";
import { introHint, introTranscript } from "./terminal/introScript";
import { Terminal } from "./terminal/Terminal";
import { useTerminalSession } from "./terminal/useTerminalSession";

type View = "terminal" | "classic";

/** play: animasyonlu intro; instant: tamamlanmış haliyle; none: klasikle açıldı, intro yok. */
type IntroMode = "play" | "instant" | "none";

const INTRO_SEEN_KEY = "intro-seen";

function readIntroSeen(): boolean {
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    // storage yoksa intro bir sonraki ziyarette yeniden oynar
  }
}

function readInitialState(): { view: View; intro: IntroMode; narrow: boolean } {
  const view =
    new URLSearchParams(window.location.search).get("view") === "classic" ? "classic" : "terminal";
  const intro: IntroMode =
    view === "classic" ? "none" : readIntroSeen() || prefersReducedMotion() ? "instant" : "play";
  const narrow = window.matchMedia("(max-width: 640px)").matches;
  return { view, intro, narrow };
}

function Shell() {
  const { lang } = useLanguage();
  const [initial] = useState(readInitialState);
  const [view, setView] = useState<View>(initial.view);
  const [introPlaying, setIntroPlaying] = useState(initial.intro === "play");
  const terminalOpen = view === "terminal";
  const focusHeroRef = useRef(false);

  const openClassic = useCallback(() => {
    focusHeroRef.current = true;
    setView("classic");
  }, []);

  const session = useTerminalSession({
    lang,
    initialLines: () => {
      if (initial.intro === "play") return [];
      if (initial.intro === "instant") return introTranscript(lang, initial.narrow);
      return [introHint(lang)];
    },
    onOpenClassic: openClassic,
  });

  const handleIntroDone = useCallback(() => {
    setIntroPlaying(false);
    markIntroSeen();
  }, []);

  useEffect(() => {
    if (initial.intro === "instant") markIntroSeen();
  }, [initial.intro]);

  // Terminal kapanınca odak klasik görünümdeki başlığa taşınır (TASARIM.md §6).
  // inert kalktıktan sonra, yani commit sonrasında yapılmalı.
  useEffect(() => {
    if (terminalOpen || !focusHeroRef.current) return;
    focusHeroRef.current = false;
    document.getElementById("hero-name")?.focus();
  }, [terminalOpen]);

  // Terminal açıkken arkadaki sayfa kaymasın.
  useEffect(() => {
    document.documentElement.style.overflow = terminalOpen ? "hidden" : "";
  }, [terminalOpen]);

  // Klasik görünümde "~" terminali açar (bir alana yazı yazılmıyorsa).
  useEffect(() => {
    if (terminalOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      const editing =
        target instanceof HTMLElement &&
        (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
      if (event.key === "~" && !editing) {
        event.preventDefault();
        setView("terminal");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [terminalOpen]);

  return (
    <>
      <div inert={terminalOpen} aria-hidden={terminalOpen || undefined}>
        <ClassicView />
      </div>
      {terminalOpen && (
        <Terminal
          session={session}
          onClose={openClassic}
          playIntro={introPlaying}
          narrow={initial.narrow}
          onIntroDone={handleIntroDone}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Shell />
    </LanguageProvider>
  );
}
