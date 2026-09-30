import type { Localized } from "../i18n/lang";

export type Profile = {
  name: string;
  handle: string;
  role: Localized;
  tagline: Localized;
  focus: Localized;
  location: Localized;
  availability: Localized;
  email: string;
  links: { github: string; linkedin: string };
  /** Bu sitenin kaynak kodu; boşken alt bilgide ve konsol mesajında gösterilmez. */
  repoUrl: string;
  cvFile: Localized;
};

export const profile: Profile = {
  name: "Hakkı Can Kafalı",
  handle: "cankafali",
  role: { tr: "Full-Stack Developer", en: "Full-Stack Developer" },
  tagline: {
    tr: "Full-Stack Developer, Erciyes Üniversitesi Bilgisayar Mühendisliği öğrencisi",
    en: "Full-Stack Developer, Computer Engineering student at Erciyes University",
  },
  focus: {
    tr: "Fikirleri, karakteri olan ve gerçekten çalışan web deneyimlerine dönüştürüyorum.",
    en: "I turn ideas into web experiences with character, ones that actually work.",
  },
  location: { tr: "Kayseri", en: "Kayseri, Türkiye" },
  availability: { tr: "Junior pozisyonlara açığım.", en: "Open to junior positions." },
  email: "hakkicankafali@outlook.com",
  links: {
    github: "https://github.com/cankafali",
    linkedin: "https://www.linkedin.com/in/hakkicankafali/",
  },
  repoUrl: "",
  cvFile: { tr: "/cv-tr.pdf", en: "/cv-en.pdf" },
};
