// Build sonrası: klasik görünümü dist/index.html'e basar (JS'siz ziyaretçi, arama
// motoru ve LCP için), CSS'i gömer, <head>'e SEO etiketleri ve font preload'ları ekler,
// robots.txt ve sitemap.xml üretir. SSR derlemesi (dist-server) iş bitince silinir.
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const dist = path.join(root, "dist");
const serverDir = path.join(root, "dist-server");

const { renderClassic, headTags, siteUrl } = await import(
  pathToFileURL(path.join(serverDir, "entry-server.js")).href
);

const indexPath = path.join(dist, "index.html");
let html = await fs.readFile(indexPath, "utf8");

// Yalnızca gövde fontu (latin + Türkçe karakterler için latin-ext) preload edilir.
// Martian Mono'yu da preload etmek ölçümde LCP'yi ~40ms uzattı; terminal fontu
// CSS'ten normal yüklenir.
const assets = await fs.readdir(path.join(dist, "assets"));
const preloads = assets
  .filter((file) => /^instrument-sans-latin(-ext)?-wght-normal-.+\.woff2$/.test(file))
  .map(
    (file) =>
      `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin />`,
  );

const replaceOnce = (source, pattern, replacement) => {
  if (!pattern.test(source)) throw new Error(`index.html içinde bulunamadı: ${pattern}`);
  return source.replace(pattern, () => replacement);
};

// CSS küçük (~5 KB gzip): ayrı, render'ı bloklayan bir istek yerine HTML'e gömülür.
const stylesheet = html.match(/<link rel="stylesheet"[^>]*href="\/assets\/([^"]+\.css)"[^>]*>/);
if (!stylesheet) throw new Error("index.html içinde stylesheet bulunamadı");
const css = await fs.readFile(path.join(dist, "assets", stylesheet[1]), "utf8");
html = html.replace(stylesheet[0], () => `<style>${css}</style>`);

// Module script fontlar ve ilk boyamayla bant genişliği için yarışmasın (FCP ~1.35 → ~0.9 sn).
html = replaceOnce(html, /<script type="module"/, `<script type="module" fetchpriority="low"`);

html = replaceOnce(html, /\s*<title>[\s\S]*?<\/title>/, "");
html = replaceOnce(html, /\s*<meta name="description"[^>]*>/, "");
html = replaceOnce(
  html,
  /<\/head>/,
  `  ${headTags()}\n    ${preloads.join("\n    ")}\n    <noscript><style>#mini-terminal { display: none; }</style></noscript>\n  </head>`,
);
html = replaceOnce(html, /<div id="root"><\/div>/, `<div id="root">${renderClassic()}</div>`);
await fs.writeFile(indexPath, html);

await fs.writeFile(
  path.join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);
await fs.writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${siteUrl}/</loc></url>
</urlset>
`,
);

await fs.rm(serverDir, { recursive: true, force: true });

if (siteUrl.includes("{")) {
  console.warn("prerender: src/content/site.ts içindeki siteUrl henüz doldurulmamış.");
}
console.log(`prerender: index.html (${preloads.length} font preload), robots.txt, sitemap.xml`);
