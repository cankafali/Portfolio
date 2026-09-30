export const tr = {
  skipToContent: "İçeriğe atla",
  nav: {
    main: "Ana gezinme",
    projects: "Projeler",
    about: "Hakkımda",
    contact: "İletişim",
    menu: "Menü",
    close: "Kapat",
    language: "Dil",
  },
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
  project: { demo: "Demo", code: "Kod", solved: "Neyi çözdüm", learned: "Ne öğrendim" },
  education: { present: "devam" },
  footer: {
    builtWith: "Bu site React, TypeScript ve Vite ile yapıldı.",
    source: "Kaynak kodu GitHub'da.",
    performance: "Performans",
    accessibility: "Erişilebilirlik",
    bestPractices: "En iyi uygulamalar",
    seo: "SEO",
  },
  terminal: {
    skipHint: "Atlamak için bir tuşa basın",
    exploreHint: "Keşfetmek için bir komut yazın ya da help yazın.",
    openTerminal: "Terminali aç",
    label: "Terminal",
    inputLabel: "Komut",
    toClassic: "Klasik görünüme geç",
    minimize: "Küçült",
    fullscreen: "Tam ekran",
    notFound: "komut bulunamadı",
    helpIntro: "Kullanılabilir komutlar:",
    openUsage: "Kullanım: open <proje>",
    openHint: "Detay için bir projeye tıklayın ya da open <proje> yazın.",
    projectNotFound: "proje bulunamadı",
    stack: "Teknolojiler",
    email: "E-posta",
  },
} as const;

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };

export type Messages = Widen<typeof tr>;
