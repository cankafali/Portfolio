import type { Lang, Localized } from "../i18n/lang";

export type SkillGroup = {
  id: "languages" | "frontend" | "backend" | "tools";
  title: Localized;
  items: Record<Lang, string[]>;
};

// Seviye çubuğu veya yüzde yok; yalnızca liste. Kaynak: cv-tr.pdf / cv-eng.pdf.
export const skills: SkillGroup[] = [
  {
    id: "languages",
    title: { tr: "Diller", en: "Languages" },
    items: {
      tr: ["JavaScript (ES6+)", "Java"],
      en: ["JavaScript (ES6+)", "Java"],
    },
  },
  {
    id: "frontend",
    title: { tr: "Frontend", en: "Frontend" },
    items: {
      tr: [
        "React.js",
        "Redux / Redux Toolkit",
        "React Router, özel hook'lar",
        "HTML5, CSS3, DOM manipülasyonu",
        "Tek sayfa uygulama (SPA) mimarisi",
      ],
      en: [
        "React.js",
        "Redux / Redux Toolkit",
        "React Router, custom hooks",
        "HTML5, CSS3, DOM manipulation",
        "Single page application (SPA) architecture",
      ],
    },
  },
  {
    id: "backend",
    title: { tr: "Backend", en: "Backend" },
    items: {
      tr: [
        "Java (Core ve OOP)",
        "RESTful API tasarımı ve entegrasyonu",
        "Sunucu tarafı iş mantığı",
        "HTTP ve JSON",
      ],
      en: [
        "Java (Core & OOP)",
        "RESTful API design & integration",
        "Server-side business logic",
        "HTTP & JSON",
      ],
    },
  },
  {
    id: "tools",
    title: { tr: "Araçlar", en: "Tools" },
    items: {
      tr: ["Git ve GitHub", "Figma", "Vercel ve Vercel CLI", "Terminal / CLI ve tmux"],
      en: ["Git & GitHub", "Figma", "Vercel & Vercel CLI", "Terminal / CLI & tmux"],
    },
  },
];
