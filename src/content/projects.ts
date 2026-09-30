import type { Localized } from "../i18n/lang";

export type Project = {
  slug: string; // terminalde klasör adı, küçük harf-tire
  name: string;
  summary: Localized; // tek cümle
  details: Localized; // 2–4 cümle
  solved: Localized;
  learned: Localized | null; // null iken "Ne öğrendim" satırı gösterilmez
  stack: string[];
  year: number;
  demoUrl: string;
  repoUrl: string;
  image: string; // /projects/<slug>.webp
};

// En güçlü proje en üstte. Canlı demosu olmayan proje listeye alınmaz.
// Kaynaklar: cv-tr.pdf / cv-eng.pdf, repo README'leri ve canlı demolar.
export const projects: Project[] = [
  {
    slug: "lup",
    name: "Lup",
    summary: {
      tr: "Hayali bir kuyumcu için animasyonlu e-ticaret vitrini.",
      en: "An animated e-commerce storefront for a fictional jeweler.",
    },
    details: {
      tr: "Hayali Sönmez Kuyumculuk için hazırlanmış, parçaların sitede büyütülerek yakından incelenebildiği bir vitrin. GSAP ve React ile zengin arayüz animasyonları ve akıcı mikro etkileşimler kuruldu. Tailwind CSS ile tüm ekran boyutlarına uyumlu, performanslı bir arayüz tasarlandı.",
      en: "A storefront for the fictional Sönmez Kuyumculuk where pieces can be magnified and inspected up close. Rich UI animations and smooth micro-interactions are built with GSAP and React. The interface is responsive and performant across all screen sizes with Tailwind CSS.",
    },
    solved: {
      tr: "Kullanıcı deneyimini artıran özel basılı tutma (press-and-hold) etkileşimleri ve dinamik animasyon tetikleyicileri kurguladım.",
      en: "Designed custom press-and-hold interactions and dynamic animation triggers to enhance the user experience.",
    },
    learned: null,
    stack: ["Next.js", "React", "TypeScript", "GSAP", "Tailwind CSS"],
    year: 2026,
    demoUrl: "https://lup-pied.vercel.app/",
    repoUrl: "https://github.com/cankafali/lup",
    image: "/projects/lup.webp",
  },
  {
    slug: "sismo",
    name: "Sismo",
    summary: {
      tr: "Türkiye'deki depremleri AFAD verisiyle harita üzerinde canlı gösteren full-stack uygulama.",
      en: "A full-stack app that shows earthquakes in Turkey live on a map using AFAD data.",
    },
    details: {
      tr: "Bağımsız bir backend API ve web arayüzünden oluşan modüler bir deprem takip sistemi. Backend AFAD'dan her 60 saniyede veri çekip veritabanına yazıyor, yeni ve güncellenen depremleri SignalR ile açık sayfalara anında iletiyor. Zaman, büyüklük, il ve konum filtreleri URL'de saklanıyor; backend Docker ile konteynerleştirildi.",
      en: "A modular earthquake tracking system with a decoupled backend API and web frontend. The backend pulls AFAD data every 60 seconds, stores it, and pushes new and revised earthquakes to open pages via SignalR. Time, magnitude, province and location filters live in the URL; the backend is containerized with Docker.",
    },
    solved: {
      tr: "SQLite'ta coğrafi indeks olmadığı için yarıçap sorgusunu iki aşamalı kurdum: önce kapsayan bir kutuyla SQL'de daraltıp kalan kayıtlarda Haversine ile kesin mesafeyi hesapladım. SignalR bağlantısı koptuğunda üstel geri çekilmeyle yeniden bağlanıp kaçırılan veriyi REST'ten tazeliyorum.",
      en: "Since SQLite has no geo index, I made radius queries two-step: narrow down in SQL with a bounding box, then compute exact Haversine distance on the remaining rows. When the SignalR connection drops, the client reconnects with exponential backoff and refreshes missed data over REST.",
    },
    learned: {
      tr: "Gerçek zamanlı veri akışı (SignalR), harita entegrasyonu (MapLibre) ve Docker ile servis paketleme konularında deneyim kazandım.",
      en: "Gained hands-on experience with real-time data streaming (SignalR), map integration (MapLibre) and packaging services with Docker.",
    },
    stack: ["ASP.NET Core", "C#", "React", "TypeScript", "SignalR", "Docker"],
    year: 2026,
    demoUrl: "https://deprem-lac.vercel.app/",
    repoUrl: "https://github.com/cankafali/DEPREM",
    image: "/projects/sismo.webp",
  },
  {
    slug: "yitik",
    name: "Yitik Sözlük",
    summary: {
      tr: "Türkçe'nin unutulmaya yüz tutmuş kelimelerini sesle keşfettiren etkileşimli sözlük.",
      en: "An audio-interactive dictionary for exploring forgotten Turkish words.",
    },
    details: {
      tr: "Türkçe'nin unutulmaya yüz tutmuş ve edebi kelimelerini keşfetmek için tasarlanmış etkileşimli bir web deneyimi. Kelimelerin üzerine gelince sesli geri bildirim alınıyor, seçilen kelimenin anlamı bir panelde açılıyor. Framer Motion ile giriş animasyonları, Tailwind CSS 4 ile duyarlı bir arayüz kuruldu.",
      en: "An interactive web experience for exploring forgotten and literary Turkish words. Hovering over words gives audio feedback, and selecting one opens its meaning in a panel. Entry animations are built with Framer Motion and the responsive UI with Tailwind CSS 4.",
    },
    solved: {
      tr: "Tone.js ile kelime boyutuna göre değişen gezinme tonları, ilk etkileşimden sonra başlayan ambiyans sesi ve ses açma/kapatma denetimi kurguladım.",
      en: "Built navigation tones scaled by word size, ambient audio that starts after the first interaction, and a sound toggle using Tone.js.",
    },
    learned: {
      tr: "React ve Tailwind CSS ile modern arayüz mimarisi kurma, durum yönetimi ve Vercel ile canlıya alma konularında deneyimimi pekiştirdim.",
      en: "Strengthened my experience in building modern UI architecture with React and Tailwind CSS, state management, and deploying with Vercel.",
    },
    stack: ["React", "Redux", "Tailwind CSS", "Framer Motion", "Tone.js"],
    year: 2026,
    demoUrl: "https://yitik.vercel.app/",
    repoUrl: "https://github.com/cankafali/Yitik",
    image: "/projects/yitik.webp",
  },
];
