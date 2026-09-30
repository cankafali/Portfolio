import type { Localized } from "../i18n/lang";

export type EducationItem = {
  start: string;
  end: string | null; // null = devam ediyor
  school: string;
  program: Localized;
};

// Zaman sırasıyla, en yeni üstte.
export const education: EducationItem[] = [
  {
    start: "2018",
    end: null,
    school: "Erciyes Üniversitesi",
    program: { tr: "Bilgisayar Mühendisliği", en: "Computer Engineering" },
  },
  {
    start: "2026",
    end: "2027",
    school: "Workintech",
    program: { tr: "Full Stack Web Developer programı", en: "Full Stack Web Developer program" },
  },
];
