// prebuild: public repo verisini src/content/github.json'a yazar.
// Ağ ya da API hatasında mevcut dosya korunur ve build devam eder.
// GITHUB_TOKEN tanımlıysa kullanılır (Vercel'de API limiti için önerilir).
import fs from "node:fs/promises";
import path from "node:path";

const USER = "cankafali";
const OUTPUT = path.join(process.cwd(), "src/content/github.json");
const TOP_LANGUAGES = 3;

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": `${USER}-portfolio-build`,
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function getJson(url) {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error(`${url} → ${response.status}`);
  return response.json();
}

try {
  const user = await getJson(`https://api.github.com/users/${USER}`);
  const repos = await getJson(
    `https://api.github.com/users/${USER}/repos?per_page=100&type=owner&sort=pushed`,
  );
  const own = repos.filter((repo) => !repo.fork && !repo.archived);

  // En çok kullanılan diller: kendi repolarının ana dillerine göre sayım
  const counts = new Map();
  for (const repo of own) {
    if (repo.language) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  const topLanguages = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, TOP_LANGUAGES)
    .map(([language]) => language);

  const latest = [...own].sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))[0];

  const data = {
    fetchedAt: new Date().toISOString(),
    publicRepos: user.public_repos,
    topLanguages,
    lastUpdated: latest
      ? { name: latest.name, url: latest.html_url, pushedAt: latest.pushed_at }
      : null,
  };
  await fs.writeFile(OUTPUT, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`fetch-github: ${data.publicRepos} repo, ${topLanguages.join(", ") || "dil yok"}`);
} catch (error) {
  console.warn(`fetch-github: veri alınamadı, mevcut github.json korunuyor (${error.message})`);
}
