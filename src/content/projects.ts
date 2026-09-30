import type { Localized } from "../i18n/lang";

export type Project = {
  slug: string; // terminalde klasör adı, küçük harf-tire
  name: string;
  summary: Localized; // tek cümle
  details: Localized; // 2–4 cümle
  solved: Localized;
  learned: Localized;
  stack: string[];
  year: number;
  demoUrl: string;
  repoUrl: string;
  image: string; // /projects/<slug>.webp
};

// En güçlü proje en üstte. Canlı demosu olmayan proje listeye alınmaz.
export const projects: Project[] = [
  {
    slug: "lup",
    name: "lup",
    summary: {
      tr: "Hayali bir kuyumcu için e-ticaret vitrini.",
      en: "An e-commerce storefront for a fictional jeweler.",
    },
    details: { tr: "{2–4 cümle açıklama}", en: "{2–4 sentence description}" },
    solved: { tr: "{neyi çözdüm}", en: "{what I solved}" },
    learned: { tr: "{ne öğrendim}", en: "{what I learned}" },
    stack: ["Next.js", "CSS"],
    year: 2025,
    demoUrl: "{DEMO_URL}",
    repoUrl: "{REPO_URL}",
    image: "/projects/lup.webp",
  },
  {
    slug: "proje-2",
    name: "{proje-2}",
    summary: { tr: "{tek cümle}", en: "{one sentence}" },
    details: { tr: "{2–4 cümle açıklama}", en: "{2–4 sentence description}" },
    solved: { tr: "{neyi çözdüm}", en: "{what I solved}" },
    learned: { tr: "{ne öğrendim}", en: "{what I learned}" },
    stack: ["{stack}"],
    year: 2025,
    demoUrl: "{DEMO_URL}",
    repoUrl: "{REPO_URL}",
    image: "/projects/proje-2.webp",
  },
  {
    slug: "proje-3",
    name: "{proje-3}",
    summary: { tr: "{tek cümle}", en: "{one sentence}" },
    details: { tr: "{2–4 cümle açıklama}", en: "{2–4 sentence description}" },
    solved: { tr: "{neyi çözdüm}", en: "{what I solved}" },
    learned: { tr: "{ne öğrendim}", en: "{what I learned}" },
    stack: ["{stack}"],
    year: 2024,
    demoUrl: "{DEMO_URL}",
    repoUrl: "{REPO_URL}",
    image: "/projects/proje-3.webp",
  },
];
