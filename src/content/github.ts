import data from "./github.json";

export type GithubStats = {
  fetchedAt: string | null;
  publicRepos: number;
  topLanguages: string[];
  lastUpdated: { name: string; url: string; pushedAt: string } | null;
};

// github.json, build öncesi scripts/fetch-github.mjs tarafından yazılır.
export const github = data as GithubStats;
