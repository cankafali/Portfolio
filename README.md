# Terminal Portfolyo

Terminalle açılan kişisel portfolyo. Ziyaretçiyi kısa bir terminal introsu karşılar, gerçek bir komut satırıyla gezilebilir ve tek komutla (`gui`) mini terminale küçülerek sade bir "klasik" CV sayfasına dönüşür. Tasarım ve teknik spesifikasyon: [TASARIM.md](TASARIM.md), uygulama sırasında verilen kararlar: [DECISIONS.md](DECISIONS.md).

![Lighthouse mobil skorları: Performans 99, Erişilebilirlik 100, En iyi uygulamalar 100, SEO 100](docs/lighthouse.png)

- React + TypeScript (strict) + Vite, CSS Modules, çalışma zamanı bağımlılığı yalnızca React
- JS bütçesi: 83 KB gzip (sınır 90 KB)
- Klasik görünüm build sırasında HTML'e ön-render edilir: JavaScript olmadan da eksiksiz okunur, arama motorları içeriği görür
- Terminal ↔ sayfa dönüşümü kütüphanesiz, Web Animations API ile
- Açık/koyu tema, `prefers-reduced-motion`, tek sayfalık A4 çıktı (Ctrl+P), TR/EN

## Paylaşım linkleri

| Link             | Açılış                                                             |
| ---------------- | ------------------------------------------------------------------ |
| `/`              | Terminal introsu                                                   |
| `/?view=classic` | Doğrudan klasik görünüm (CV'ye ve başvuru formlarına konacak link) |
| `/?lang=en`      | İngilizce (ikisi birlikte de kullanılabilir)                       |

## Komutlar

Komutlar İngilizce, çıktılar seçili dilde; büyük/küçük harf duyarsız.

| Komut                         | Takma ad         | Ne yapar                                                    |
| ----------------------------- | ---------------- | ----------------------------------------------------------- |
| `help`                        | `yardim`, `?`    | Komut listesi                                               |
| `whoami`                      |                  | İsim ve unvan                                               |
| `about`                       | `hakkimda`       | Kısa tanıtım                                                |
| `projects`                    | `ls projects`    | Proje listesi (isimler tıklanabilir)                        |
| `open <proje>`                |                  | Proje detayı, demo ve kaynak kod linkleri                   |
| `skills`                      | `yetenekler`     | Gruplanmış yetenekler                                       |
| `education`                   | `egitim`         | Eğitim                                                      |
| `github`                      |                  | Repo sayısı, en çok kullanılan diller, son güncellenen repo |
| `contact`                     | `iletisim`       | E-posta (kopyala), LinkedIn, GitHub                         |
| `cv`                          |                  | PDF CV'yi indirir                                           |
| `lang tr` / `lang en`         |                  | Dili değiştirir                                             |
| `gui`                         | `exit`, `klasik` | Klasik görünüme dönüşür                                     |
| `clear`                       |                  | Ekranı temizler                                             |
| `history`                     |                  | Bu oturumda yazılan komutlar                                |
| `pwd`, `date`, `echo <metin>` |                  | Klasikler                                                   |

Klavye: `Tab` tamamlama, `↑`/`↓` geçmiş, `Ctrl+L` temizle, `Ctrl+C` satırı iptal et, `Esc` klasik görünüm. Klasik görünümde `~` terminali açar. Birkaç gizli komut da var.

## Yerel çalıştırma

Node.js 20.19+ ya da 22.12+ gerekir (Vite 8).

```bash
npm install
```

```bash
npm run dev
```

| Script            | Açıklama                                                                     |
| ----------------- | ---------------------------------------------------------------------------- |
| `npm run dev`     | Geliştirme sunucusu (http://localhost:5173)                                  |
| `npm run build`   | GitHub verisini çeker, tip kontrolü, üretim derlemesi ve ön-render (`dist/`) |
| `npm run preview` | Derlenmiş çıktıyı önizler (http://localhost:4173)                            |
| `npm run lint`    | ESLint                                                                       |
| `npm run format`  | Prettier                                                                     |

### Build adımları

1. `prebuild` → [`scripts/fetch-github.mjs`](scripts/fetch-github.mjs): GitHub API'den public repo verisini `src/content/github.json`'a yazar. Ağ hatasında eski dosya korunur, build durmaz. `GITHUB_TOKEN` ortam değişkeni varsa kullanılır.
2. `tsc -b && vite build`: istemci derlemesi.
3. `vite build --ssr src/entry-server.tsx` + [`scripts/prerender.mjs`](scripts/prerender.mjs): klasik görünümü `dist/index.html`'e basar, CSS'i gömer, SEO/Open Graph etiketlerini ve font preload'larını ekler, `robots.txt` ve `sitemap.xml` üretir.

## İçeriği doldurma

Tüm metin ve veri `src/content/` altında; arayüz metinleri `src/i18n/tr.ts` ve `en.ts` içinde. `{SÜSLÜ_PARANTEZ}` içindeki her şey doldurulmalı:

- `profile.ts`: isim, odak cümlesi, şehir, müsaitlik, e-posta, LinkedIn, repo adresi
- `projects.ts`: projeler (en güçlüsü en üstte, her birinin canlı demosu olmalı)
- `skills.ts`, `education.ts`, `about.ts`
- `site.ts`: alan adı (`siteUrl`) ve Lighthouse skorları

Statik dosyalar (`public/`):

- `cv-tr.pdf`, `cv-en.pdf`: `cv` komutu ve "CV'yi indir" butonu bunları indirir
- `projects/<slug>.webp`: proje önizlemeleri (320×200, en fazla 60 KB)
- `og.png`: paylaşım görseli (1200×630); şu an yer tutucu, isim girildikten sonra yenilenmeli

## Deploy (Vercel)

Vercel Vite projesini otomatik tanır; ek ayar gerekmez (build: `npm run build`, çıktı: `dist`). GitHub API limitine takılmamak için proje ayarlarına `GITHUB_TOKEN` (yalnızca public okuma yetkili) eklenmesi önerilir.
