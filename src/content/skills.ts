import type { Localized } from "../i18n/lang";

export type SkillGroup = {
  id: "languages" | "frontend" | "tools" | "learning";
  title: Localized;
  items: string[];
};

// Seviye çubuğu veya yüzde yok; yalnızca liste.
export const skills: SkillGroup[] = [
  {
    id: "languages",
    title: { tr: "Diller", en: "Languages" },
    items: ["TypeScript", "JavaScript", "HTML", "CSS", "{dil}"],
  },
  {
    id: "frontend",
    title: { tr: "Frontend", en: "Frontend" },
    items: ["React", "Next.js", "{frontend}"],
  },
  {
    id: "tools",
    title: { tr: "Araçlar", en: "Tools" },
    items: ["Git", "Vite", "{araç}"],
  },
  {
    id: "learning",
    title: { tr: "Öğreniyorum", en: "Learning" },
    items: ["{ör. Java/Spring}", "{ör. Redux}"],
  },
];
