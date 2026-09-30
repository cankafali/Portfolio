// Canonical, Open Graph, sitemap ve robots.txt bu adresle üretilir (sonunda / yok).
export const siteUrl = "https://{alan-adi}";

export type LighthouseScores = {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
};

// Build sonrası Lighthouse (mobil) ölçümüyle elle güncellenir.
// null iken alt bilgide gösterilmez.
// Son ölçüm: 2026-09-30, ana sayfa (/), Lighthouse 12 mobil, 3 koşunun medyanı.
export const lighthouse: LighthouseScores | null = {
  performance: 99,
  accessibility: 100,
  bestPractices: 100,
  seo: 100,
};
