import { createContext, useContext } from "react";
import { en } from "./en";
import type { Lang } from "./lang";
import { tr, type Messages } from "./tr";

export const messages: Record<Lang, Messages> = { tr, en };

export type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Messages;
};

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage(): LanguageContextValue {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage, LanguageProvider içinde kullanılmalı");
  return value;
}
