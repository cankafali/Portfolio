import { useCallback, useEffect, useRef, useState } from "react";
import { ClassicView } from "./classic/ClassicView";
import { LanguageProvider } from "./i18n/LanguageContext";
import { useLanguage } from "./i18n/useLanguage";
import { Terminal } from "./terminal/Terminal";
import { useTerminalSession } from "./terminal/useTerminalSession";

type View = "terminal" | "classic";

function readInitialView(): View {
  return new URLSearchParams(window.location.search).get("view") === "classic"
    ? "classic"
    : "terminal";
}

function Shell() {
  const { lang } = useLanguage();
  const [view, setView] = useState<View>(readInitialView);
  const session = useTerminalSession(lang);
  const terminalOpen = view === "terminal";
  const focusHeroRef = useRef(false);

  const openClassic = useCallback(() => {
    focusHeroRef.current = true;
    setView("classic");
  }, []);

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
      {terminalOpen && <Terminal session={session} onClose={openClassic} />}
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
