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
  repoUrl: string;
  cvFile: Localized;
};

export const profile: Profile = {
  name: "{AD SOYAD}",
  handle: "cankafali",
  role: { tr: "Frontend developer", en: "Frontend developer" },
  tagline: {
    tr: "Frontend developer, Erciyes Üniversitesi Bilgisayar Mühendisliği öğrencisi",
    en: "Frontend developer, Computer Engineering student at Erciyes University",
  },
  focus: { tr: "{odak cümlesi}", en: "{focus sentence}" },
  location: { tr: "{ŞEHİR}", en: "{CITY}" },
  availability: { tr: "{MÜSAİTLİK}", en: "{AVAILABILITY}" },
  email: "{EPOSTA}",
  links: { github: "https://github.com/cankafali", linkedin: "{LINKEDIN_URL}" },
  repoUrl: "https://github.com/cankafali/{REPO}",
  cvFile: { tr: "/cv-tr.pdf", en: "/cv-en.pdf" },
};
