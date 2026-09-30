export const tr = {
  skipToContent: "İçeriğe atla",
  nav: { projects: "Projeler", about: "Hakkımda", contact: "İletişim", menu: "Menü" },
  actions: {
    workTogether: "Birlikte çalışalım",
    classicView: "Klasik görünüm",
    downloadCv: "CV'yi indir",
    copy: "Kopyala",
    copied: "Kopyalandı",
    liveDemo: "Canlı demo",
    sourceCode: "Kaynak kod",
  },
  sections: {
    projects: "Projeler",
    about: "Hakkımda",
    skills: "Yetenekler",
    education: "Eğitim",
    contact: "İletişim",
  },
  project: { solved: "Neyi çözdüm", learned: "Ne öğrendim" },
  terminal: {
    skipHint: "Atlamak için bir tuşa basın",
    exploreHint: "Keşfetmek için bir komut yazın ya da help yazın.",
    openTerminal: "Terminali aç",
  },
} as const;

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };

export type Messages = Widen<typeof tr>;
