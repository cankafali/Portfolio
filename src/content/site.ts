export type LighthouseScores = {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
};

// Build sonrası Lighthouse (mobil) ölçümüyle elle güncellenir.
// null iken alt bilgide gösterilmez.
export const lighthouse: LighthouseScores | null = null;
