import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/print.css";
import App from "./App.tsx";
import { logConsoleGreeting } from "./consoleGreeting";
import { readInitialLang } from "./i18n/lang";

if (import.meta.env.PROD) logConsoleGreeting(readInitialLang());

// #root, build'de ön-render edilmiş klasik görünümü (Türkçe) içerir. İstemcinin ilk
// ağacı bununla birebir aynıysa (?view=classic, Türkçe) hydrate edilir: <h1> yeniden
// çizilmez, LCP ön-render anında kalır. Terminalle ya da İngilizce açılışta ilk ağaç
// farklı olduğu için (hydration uyumsuzluğu olmasın diye) createRoot yeniden çizer.
const root = document.getElementById("root");
if (!root) throw new Error("#root bulunamadı");

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
const matchesPrerender =
  root.hasChildNodes() &&
  new URLSearchParams(window.location.search).get("view") === "classic" &&
  readInitialLang() === "tr";

if (matchesPrerender) hydrateRoot(root, app);
else createRoot(root).render(app);
