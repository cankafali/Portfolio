import type { Lang } from "../i18n/lang";

// Klasik görünüm: en fazla 3 paragraf, toplam ≤ 120 kelime.
// Terminal (`about`): 3–5 kısa satır.
export const about: Record<Lang, { paragraphs: string[]; terminal: string[] }> = {
  tr: {
    paragraphs: [
      "Erciyes Üniversitesi'nde bilgisayar mühendisliği okuyorum. Bir fikrin çalışan, dokunulabilir bir ürüne dönüştüğü anı seviyorum; web de bunu en hızlı yapabildiğim alan.",
      "Frontend'de React ve Next.js ile arayüzler geliştiriyorum, backend tarafında Java ve ASP.NET ile çalışıyorum. Workintech Full Stack eğitimiyle iki tarafı aynı projede birleştirmeyi öğreniyorum.",
      "Şablon hissi veren siteler yerine karakteri olan işler yapmayı seviyorum. Yitik Sözlük'te unutulmaya yüz tutmuş Türkçe kelimeleri tipografi ve hareketle canlandırdım; şu an canlı bir deprem haritası üzerinde çalışıyorum.",
    ],
    terminal: [
      "rol: bilgisayar mühendisliği öğrencisi @ Erciyes Üniversitesi",
      "frontend: React, Next.js, JavaScript",
      "backend: Java, ASP.NET",
      "şu an: canlı deprem haritası",
    ],
  },
  en: {
    paragraphs: [
      "I'm a computer engineering student at Erciyes University. I love the moment an idea turns into a working, tangible product, and the web is where I can make that happen fastest.",
      "On the frontend I build interfaces with React and Next.js; on the backend I work with Java and ASP.NET. Through the Workintech Full Stack program, I'm learning to bring both sides together in a single project.",
      "I prefer building things with character over template-looking sites. In Yitik Sözlük, I brought fading Turkish words back to life through typography and motion. Right now I'm working on a live earthquake map.",
    ],
    terminal: [
      "role: computer engineering student @ Erciyes University",
      "frontend: React, Next.js, JavaScript",
      "backend: Java, ASP.NET",
      "now: live earthquake map",
    ],
  },
};
