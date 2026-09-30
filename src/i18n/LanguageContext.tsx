import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { profile } from "../content/profile";
import type { Lang } from "./lang";
import { LanguageContext, messages } from "./useLanguage";

function readInitialLang(): Lang {
  return new URLSearchParams(window.location.search).get("lang") === "en" ? "en" : "tr";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", profile.focus[lang]);
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    const url = new URL(window.location.href);
    if (next === "tr") url.searchParams.delete("lang");
    else url.searchParams.set("lang", next);
    history.replaceState(history.state, "", url);
  }, []);

  const value = useMemo(() => ({ lang, setLang, t: messages[lang] }), [lang, setLang]);

  return <LanguageContext value={value}>{children}</LanguageContext>;
}
