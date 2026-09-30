import { useCallback, useEffect, useRef, useState } from "react";
import { ClassicView } from "./classic/ClassicView";
import { prefersReducedMotion } from "./hooks/useReducedMotion";
import { LanguageProvider } from "./i18n/LanguageContext";
import { useLanguage } from "./i18n/useLanguage";
import { introHint, introTranscript } from "./terminal/introScript";
import { TerminalLauncherContext } from "./terminal/launcher";
import { MiniTerminal } from "./terminal/MiniTerminal";
import { Terminal } from "./terminal/Terminal";
import { useTerminalSession } from "./terminal/useTerminalSession";

/** closing / opening: morph animasyonu sürüyor (TASARIM.md §6). */
type View = "terminal" | "closing" | "classic" | "opening";

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

function readInitialState(): { view: "terminal" | "classic"; intro: IntroMode; narrow: boolean } {
  const view =
    new URLSearchParams(window.location.search).get("view") === "classic" ? "classic" : "terminal";
  const intro: IntroMode =
    view === "classic" ? "none" : readIntroSeen() || prefersReducedMotion() ? "instant" : "play";
  const narrow = window.matchMedia("(max-width: 640px)").matches;
  return { view, intro, narrow };
}

function Shell() {
  const { lang, setLang } = useLanguage();
  const [initial] = useState(readInitialState);
  const [view, setView] = useState<View>(initial.view);
  const [introPlaying, setIntroPlaying] = useState(initial.intro === "play");
  const classicActive = view === "classic";
  const focusHeroRef = useRef(false);

  // gui, Esc, kırmızı/sarı nokta: yalnızca açık terminal kapanmaya başlar.
  const openClassic = useCallback(() => {
    setView((current) => (current === "terminal" ? "closing" : current));
  }, []);

  const session = useTerminalSession({
    lang,
    initialLines: () => {
      if (initial.intro === "play") return [];
      if (initial.intro === "instant") return introTranscript(lang, initial.narrow);
      return [introHint(lang)];
    },
    onOpenClassic: openClassic,
    onSetLang: setLang,
  });

  // Mini terminal, "~" tuşu, bölüm yolları. Komut varsa hemen çalışır;
  // çıktı pencere büyüdüğünde görünür halde olur.
  const { run } = session;
  const openTerminal = useCallback(
    (command?: string) => {
      setView((current) => (current === "classic" ? "opening" : current));
      if (command) void run(command);
    },
    [run],
  );

  const handlePhaseEnd = useCallback((phase: "opening" | "closing") => {
    if (phase === "closing") focusHeroRef.current = true;
    setView(phase === "closing" ? "classic" : "terminal");
  }, []);

  const handleIntroDone = useCallback(() => {
    setIntroPlaying(false);
    markIntroSeen();
  }, []);

  useEffect(() => {
    if (initial.intro === "instant") markIntroSeen();
  }, [initial.intro]);

  // Kapanış bitince odak klasik görünümdeki başlığa taşınır (TASARIM.md §6).
  // inert kalktıktan sonra, yani commit sonrasında yapılmalı. Sayfa kaydırılmışsa
  // kullanıcıyı yukarı fırlatmamak için kaydırma yapılmaz.
  useEffect(() => {
    if (!classicActive || !focusHeroRef.current) return;
    focusHeroRef.current = false;
    document.getElementById("hero-name")?.focus({ preventScroll: true });
  }, [classicActive]);

  // Görünüm oturunca URL güncellenir: klasikte ?view=classic, terminalde parametre yok.
  useEffect(() => {
    if (view !== "classic" && view !== "terminal") return;
    const url = new URL(window.location.href);
    if (view === "classic") url.searchParams.set("view", "classic");
    else url.searchParams.delete("view");
    if (url.href !== window.location.href) history.replaceState(history.state, "", url);
  }, [view]);

  // Terminal (ve morph) sürerken arkadaki sayfa kaymasın.
  useEffect(() => {
    document.documentElement.style.overflow = classicActive ? "" : "hidden";
  }, [classicActive]);

  // Klasik görünümde "~" terminali açar (bir alana yazı yazılmıyorsa).
  useEffect(() => {
    if (!classicActive) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      const editing =
        target instanceof HTMLElement &&
        (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
      if (event.key === "~" && !editing) {
        event.preventDefault();
        openTerminal();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [classicActive, openTerminal]);

  return (
    <TerminalLauncherContext value={openTerminal}>
      <div inert={!classicActive} aria-hidden={!classicActive || undefined}>
        <ClassicView />
      </div>
      <MiniTerminal visible={classicActive} onOpen={() => openTerminal()} />
      {!classicActive && (
        <Terminal
          session={session}
          phase={view === "terminal" ? "open" : view}
          onClose={openClassic}
          onPhaseEnd={handlePhaseEnd}
          playIntro={introPlaying}
          narrow={initial.narrow}
          onIntroDone={handleIntroDone}
        />
      )}
    </TerminalLauncherContext>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Shell />
    </LanguageProvider>
  );
}
