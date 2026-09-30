// Ön-render girişi: build sonrası scripts/prerender.mjs klasik görünümü ve <head>
// etiketlerini dist/index.html'e yazar. Tarayıcıya gönderilmez.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { profile } from "./content/profile";
import { siteUrl } from "./content/site";

export { siteUrl };

export function renderClassic(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function headTags(): string {
  const title = escapeHtml(`${profile.name}, Frontend Developer`);
  const description = escapeHtml(profile.focus.tr);
  const url = escapeHtml(`${siteUrl}/`);
  const image = escapeHtml(`${siteUrl}/og.png`);
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:locale" content="tr_TR" />`,
    `<meta property="og:locale:alternate" content="en_US" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join("\n    ");
}
