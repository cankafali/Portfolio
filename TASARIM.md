# Terminal Portfolyo — Tasarım ve Teknik Spesifikasyon

> **Claude Code için not:** Bu doküman sitenin tek doğruluk kaynağıdır. Renkler, süreler, metinler ve davranışlar burada yazdığı gibi uygulanmalı. Belirsiz kalan bir nokta olursa en yakın bölümün ruhuna uygun, en sade çözümü seç ve kararını `DECISIONS.md` dosyasına tek satırla not et. `{SÜSLÜ_PARANTEZ}` içindeki her şey kullanıcının dolduracağı yer tutucudur; bunları `src/content/` altındaki içerik dosyalarında topla, bileşenlerin içine gömme.

---

## 1. Amaç

Site bir İK uzmanının ya da teknik mülakatçının CV'yi okumadan önce "bu kişi işini biliyor" demesini sağlamalı. Bunu efekt yığınıyla değil, **tek bir akılda kalan an** (terminal girişi ve terminalin sayfaya dönüşmesi) ve geri kalan her yerde **kusursuz, hızlı, okunaklı** bir deneyimle yapıyoruz.

Üç ziyaretçi tipi var ve hepsi memnun ayrılmalı:

| Ziyaretçi | Ne ister | Nasıl karşılıyoruz |
|---|---|---|
| İK uzmanı (acele eden, teknik olmayan) | 30 saniyede kim, ne biliyor, nasıl ulaşırım | Intro 4.5 sn'yi geçmez, her an atlanabilir, iki büyük buton: "Birlikte çalışalım" ve "Klasik görünüm" |
| Teknik mülakatçı | Kodun kalitesi, detaylar | Gerçek çalışan komut satırı, tab tamamlama, geçmiş, konsol mesajı, açık kaynak repo, Lighthouse skorları |
| Mobil ziyaretçi (linke telefondan tıklayan) | Hızlı açılsın, klavye gerektirmesin | Dokunulabilir komut çipleri, mobilde kısaltılmış intro |

**Paylaşım linki kuralı:** CV'ye ve başvuru formlarına konacak link `https://{alan-adi}/?view=classic` olabilir; bu parametre introyu atlayıp direkt klasik görünümü açar. Ana link (`/`) terminalle açılır.

---

## 2. Teknoloji Yığını

| Alan | Seçim | Neden |
|---|---|---|
| Build | **Vite** (son kararlı sürüm) | Hızlı, sade, statik çıktı |
| UI | **React** (son kararlı sürüm) + **TypeScript** (strict) | Mülakatçı için güven sinyali |
| Stil | **CSS Modules** + `src/styles/tokens.css` içinde CSS değişkenleri | Tailwind kullanılmayacak; site sahibi düz CSS'i daha rahat düzenliyor |
| Animasyon | **motion** (Framer Motion'ın güncel paketi) | Terminal → sayfa dönüşümü için `layoutId` tabanlı paylaşılan eleman animasyonu |
| Fontlar | **@fontsource** paketleri ile self-host | Google Fonts isteği yok, CLS yok |
| Çoklu dil | Kendi yazdığımız küçük `LanguageContext` + `tr.ts` / `en.ts` | Kütüphane gereksiz |
| Router | **Yok.** Görünüm bir state (`terminal` / `classic`), URL parametresiyle senkron | Tek sayfa |
| GitHub verisi | Build öncesi çalışan `scripts/fetch-github.mjs` → `src/content/github.json` | Çalışma zamanında API limiti ve yavaşlık yok |
| Lint/format | ESLint (typescript-eslint) + Prettier | |
| Deploy | **Vercel** | Kullanıcının diğer projesi de orada |

Başka bağımlılık ekleme. Toplam JS bütçesi (gzip) **≤ 90 KB**.

---

## 3. Tasarım Sistemi

### 3.1 Konsept

Klasik "siyah ekran, yeşil yazı" hacker terminali **kullanılmayacak**; o, binlerce portfolyoda var. Bizim terminalimiz **gece mavisi mürekkep** zeminli, kehribar imleçli, sakin ve modern bir terminal. Klasik görünüm ise aynı mürekkep renginin **serin açık gri kâğıt** üzerine basılmış hali: terminal "çıktıyı kâğıda basıyor" fikri.

Cesaret tek yerde harcanıyor: **terminal penceresinin küçülüp sağ alttaki mini terminal sekmesine dönüşmesi**. Onun dışında hiçbir bölüm kendi kendine giriş animasyonu yapmaz.

### 3.2 Renkler (`tokens.css`)

```css
:root {
  /* Terminal */
  --ink:        #0F1B2D;  /* terminal zemini, klasik görünümde ana metin */
  --ink-raised: #172840;  /* terminal başlık çubuğu, seçili satır */
  --paper:      #E8ECF1;  /* terminal ana metni */
  --muted:      #7B8BA3;  /* prompt yolu, ikincil metin, yorumlar */
  --amber:      #FFB547;  /* imleç, prompt işareti ($), odak halkası — TEK vurgu rengi */
  --teal:       #7FD6C2;  /* klasör isimleri, başarılı çıktı, linkler (terminal içinde) */
  --red:        #FF7A7A;  /* "komut bulunamadı" */

  /* Klasik görünüm (açık tema) */
  --page:       #EEF1F5;  /* sayfa zemini — serin gri, krem DEĞİL */
  --page-line:  #D3DAE3;  /* ayırıcı çizgiler */
  --text:       #0F1B2D;  /* = --ink */
  --text-soft:  #4A5A70;
  --link:       #1F5FBF;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --page:      #0F1B2D;
    --page-line: #26374F;
    --text:      #E8ECF1;
    --text-soft: #9AA9BE;
    --link:      #7FD6C2;
  }
}
:root[data-theme="dark"] { /* aynı değerler */ }
```

Kurallar: Kehribar (`--amber`) klasik görünümde yalnızca odak halkasında ve mini terminal imlecinde görünür. Gradient, gölge yığını, cam efekti (glassmorphism) yok. Tek gölge: terminal penceresinin altında `0 30px 80px -20px rgb(15 27 45 / 0.55)`.

### 3.3 Tipografi

| Rol | Font | Ağırlıklar |
|---|---|---|
| Terminal, komut çipleri, mini terminal | **Martian Mono** (`@fontsource-variable/martian-mono`) | 400, 600 |
| Klasik görünüm başlık ve gövde | **Instrument Sans** (`@fontsource-variable/instrument-sans`) | 400, 500, 600 |

Fallback: `ui-monospace, "SFMono-Regular", Menlo, monospace` ve `system-ui, -apple-system, "Segoe UI", sans-serif`. Türkçe karakterlerin (ğ, ş, ı, İ) her iki fontta da doğru göründüğünü kontrol et.

Tip ölçeği (klasik görünüm, `clamp` ile akışkan):

| Token | Boyut | Satır yüksekliği | Kullanım |
|---|---|---|---|
| `--fs-display` | `clamp(2.5rem, 6vw, 4.5rem)` | 1.05 | Hero'daki isim |
| `--fs-h2` | `clamp(1.5rem, 3vw, 2rem)` | 1.2 | Bölüm başlıkları |
| `--fs-body` | `1.0625rem` | 1.6 | Gövde |
| `--fs-small` | `0.875rem` | 1.5 | Yıl, teknoloji listesi |
| `--fs-term` | `clamp(0.8125rem, 1.4vw, 0.9375rem)` | 1.65 | Terminal metni |

Yasaklar: BÜYÜK HARFLİ küçük etiketler (eyebrow), başlıkta tek kelimeyi farklı renge boyamak, buton metnine `→` eklemek, `A · B · C` şeklinde orta nokta dizileri. Gövde satır uzunluğu en fazla **68ch**.

### 3.4 Boşluk, köşe, hareket

- Boşluk ölçeği: `4, 8, 12, 16, 24, 32, 48, 72, 112` px (`--space-1` … `--space-9`).
- Köşe yarıçapı: terminal penceresi `12px`, mini terminal `10px`, butonlar `8px`, komut çipleri `6px`. Klasik görünümdeki içerik blokları köşesiz (kart yok).
- Hareket token'ları:
  - `--ease-out: cubic-bezier(0.2, 0.8, 0.2, 1)`
  - `--dur-fast: 140ms` (hover, odak)
  - `--dur-base: 240ms` (panel açma)
  - `--dur-morph: 720ms` (terminal ↔ sayfa dönüşümü)
- `prefers-reduced-motion: reduce` aktifse: yazma animasyonu yok (metin anında basılır), dönüşüm yerine 150ms opaklık geçişi, imleç yanıp sönmez.

---

## 4. Genel Akış

```
            ?view=classic                        (varsayılan)
                 │                                    │
                 ▼                                    ▼
        ┌────────────────┐                  ┌──────────────────┐
        │ KLASİK GÖRÜNÜM │◀── morph ───────│  BOOT (0–300ms)  │
        │ + mini terminal│                  └────────┬─────────┘
        └───────┬────────┘                           ▼
                │                           ┌──────────────────┐
                │ mini terminale tıkla /    │ INTRO (≤ 4.5 sn) │── herhangi bir tuş/tık ─┐
                │ "~" tuşu                   └────────┬─────────┘                          │
                │                                    ▼                                    ▼
                └────────── morph ─────────▶ ┌────────────────────────────────────────────┐
                                             │ INTERAKTİF TERMİNAL (komut yazılabilir)     │
                                             └────────────────────────────────────────────┘
```

- **Tekrar ziyaret:** `sessionStorage` içinde `intro-seen=1` varsa intro animasyonsuz, tamamlanmış haliyle anında gösterilir. (try/catch ile sar; storage yoksa intro normal oynar.)
- **Klasik görünüm her zaman DOM'da:** Terminal onun üstünde tam ekran bir katman. Böylece klasik içerik arama motorlarına, ekran okuyuculara ve JavaScript'siz ziyaretçiye her zaman erişilebilir. Terminal açıkken klasik içerik `inert` + `aria-hidden` olur.
- URL senkronu: Görünüm değişince `history.replaceState` ile `?view=classic` eklenir/kaldırılır. Dil `?lang=en` ile de açılabilir.

---

## 5. Terminal Ekranı

### 5.1 Pencere yerleşimi (masaüstü)

```
 sayfa zemini: --ink ile %92 opak, altındaki klasik sayfa hafifçe bulanık görünmez (blur yok, sadece koyu örtü)
 ┌──────────────────────────────────────────────────────────────────────┐
 │ ● ● ●            cankafali@portfolio: ~                   TR | EN    │  ← başlık çubuğu, --ink-raised, 40px
 ├──────────────────────────────────────────────────────────────────────┤
 │ cankafali@portfolio:~$ whoami                                         │
 │ {AD SOYAD}                                                            │
 │ ...                                                                   │  ← çıktı alanı, kaydırılabilir
 │                                                                       │
 │ cankafali@portfolio:~$ █                                              │  ← aktif satır
 ├──────────────────────────────────────────────────────────────────────┤
 │ [help] [about] [projects] [skills] [contact] [cv] [gui]               │  ← komut çipleri
 └──────────────────────────────────────────────────────────────────────┘
```

- Pencere genişliği `min(920px, 100vw - 48px)`, yüksekliği `min(620px, 100dvh - 96px)`, ekranın ortasında.
- Başlık çubuğundaki üç nokta dekoratif değil: kırmızı = `gui` (klasik görünüme geç), sarı = pencereyi küçült (aynı işlev), yeşil = tam ekran aç/kapat. `aria-label` verilmeli.
- Prompt biçimi: `cankafali@portfolio` (`--teal`), `:~` (`--muted`), `$` (`--amber`), ardından komut (`--paper`).
- İmleç: `--amber` renkli dolu blok, 1.1s aralıkla yanıp söner; kullanıcı yazarken yanıp sönmeyi durdurur.
- Pencerenin herhangi bir yerine tıklamak gizli `<input>`'a odaklanır. Gerçek bir `<input>` kullan (mobil klavye ve ekran okuyucu için), görsel satır onun değerini yansıtır.

### 5.2 Intro senaryosu

Yazma hızı karakter başına 32ms ± 12ms rastgele sapma. Komut yazıldıktan sonra 220ms bekle, çıktıyı bas. Çıktı satırları 50ms arayla gelir. Toplam süre **4.5 saniyeyi geçmemeli**; geçerse yazma hızını orantılı artır.

```
cankafali@portfolio:~$ whoami
{AD SOYAD}
Frontend developer, Erciyes Üniversitesi Bilgisayar Mühendisliği öğrencisi

cankafali@portfolio:~$ cat focus.txt
{Tek cümlelik odak: ör. "React ve TypeScript ile hızlı, erişilebilir arayüzler geliştiriyorum."}

cankafali@portfolio:~$ ls projects/
lup/   {proje-2}/   {proje-3}/

cankafali@portfolio:~$ ./contact.sh
  [ Birlikte çalışalım ]   [ Klasik görünüm ]

Keşfetmek için bir komut yazın ya da help yazın.
cankafali@portfolio:~$ █
```

- `ls projects/` çıktısındaki klasör isimleri `--teal` renkte ve **tıklanabilir** (`open <isim>` çalıştırır).
- **Birlikte çalışalım**: dolgulu buton, zemin `--amber`, metin `--ink`. Tıklanınca `contact` komutunu çalıştırır (komut satırına yazılmış gibi görünür).
- **Klasik görünüm**: çerçeveli buton, çerçeve ve metin `--paper`. Tıklanınca `gui` komutunu çalıştırır.
- Intro sırasında sağ altta küçük, `--muted` renkte bir ipucu: "Atlamak için bir tuşa basın". Herhangi bir tuş, tık veya dokunuş introyu anında tamamlanmış haline getirir.
- Mobilde (`max-width: 640px`) `cat focus.txt` adımı atlanır.

### 5.3 Komutlar

Komutlar İngilizce (terminal geleneği), çıktılar seçili dilde. Büyük/küçük harf duyarsız. Birkaç Türkçe takma ad desteklenir.

| Komut | Takma ad | Çıktı / davranış |
|---|---|---|
| `help` | `yardim`, `?` | Komut listesi, iki sütun: komut (`--teal`) ve açıklama (`--muted`) |
| `whoami` | | İsim ve unvan |
| `about` | `hakkimda` | 3–5 satırlık kısa tanıtım (`content/about`) |
| `projects` | `ls projects` | Proje listesi: isim, tek cümle açıklama, teknolojiler. Her isim tıklanabilir |
| `open <proje>` | | Projenin detayı: açıklama, teknolojiler, "Canlı demo" ve "Kaynak kod" linkleri. Tab ile proje adı tamamlanır |
| `skills` | `yetenekler` | Gruplanmış yetenekler (Diller, Frontend, Araçlar, Öğreniyorum). Seviye çubuğu veya yüzde **yok**; yalnızca liste |
| `education` | `egitim` | Zaman sırasıyla: Erciyes Üniv. Bilgisayar Müh., Workintech Full Stack bootcamp |
| `github` | | `github.json`'dan: public repo sayısı, en çok kullanılan 3 dil, son güncellenen repo |
| `contact` | `iletisim` | E-posta (yanında "Kopyala" butonu, tıklayınca "Kopyalandı" yazar 1.5sn), LinkedIn, GitHub linkleri |
| `cv` | | PDF CV'yi indirir, çıktıya `cv.pdf indiriliyor...` basar |
| `lang tr` / `lang en` | | Dili değiştirir, `Dil: Türkçe` onayı basar |
| `gui` | `exit`, `klasik` | Klasik görünüme dönüşüm animasyonu |
| `clear` | | Ekranı temizler (Ctrl+L de aynısını yapar) |
| `history` | | Bu oturumda yazılan komutlar, numaralı |
| `pwd` | | `/home/cankafali/portfolio` |
| `date` | | Seçili dilde tarih ve saat |
| `echo <metin>` | | Metni geri basar (HTML olarak yorumlama, düz metin) |
| `sudo hire-me` | | Easter egg, aşağıda |

**Gizli komutlar** (`help`'te listelenmez): `sudo hire-me`, `coffee`, `rm -rf /`.

- `sudo hire-me`:
  ```
  [sudo] password for recruiter: ********
  Erişim verildi. Harika bir karar.
  ```
  ardından `contact` çıktısı basılır. Şifre yıldızları 70ms arayla tek tek belirir.
- `coffee`: `Kahve hazırlanıyor... ☕  Hazır. Şimdi kod yazabiliriz.`
- `rm -rf /`: `Güzel deneme. Bu sistem salt okunur, ama merakın not edildi.`

**Bilinmeyen komut:** `--red` renkte `komut bulunamadı: <komut>`. Levenshtein mesafesi ≤ 2 olan bir komut varsa altına `--muted`: `Bunu mu demek istediniz: projects`.

**Klavye:**
- `Tab`: komut ve proje adı tamamlama; birden fazla eşleşme varsa hepsini listele.
- `↑` / `↓`: komut geçmişi.
- `Ctrl+L`: temizle. `Ctrl+C`: mevcut satırı iptal et, `^C` basıp yeni prompt aç.
- `Esc`: klasik görünüme geç.

**Komut çipleri:** Pencerenin altında sabit, yatay kaydırılabilir satır. Tıklanınca komut yazma animasyonuyla (hızlandırılmış, 12ms/karakter) çalıştırılır. Mobilde ana gezinme yolu budur.

**Kod yapısı:** Her komut `src/terminal/commands/` altında ayrı dosya, ortak arayüz:
```ts
type CommandContext = { args: string[]; lang: Lang; actions: TerminalActions };
type Command = {
  name: string;
  aliases?: string[];
  hidden?: boolean;
  description: Record<Lang, string>;
  run: (ctx: CommandContext) => OutputLine[] | Promise<OutputLine[]>;
};
```
`OutputLine` düz metin değil, küçük bir yapı (metin parçaları + renk + opsiyonel link/aksiyon) olsun; böylece `dangerouslySetInnerHTML` hiç kullanılmaz.

---

## 6. Dönüşüm Animasyonu (sitenin imza anı)

`gui` çalıştığında:

1. (0ms) Terminalin çıktı alanı %0 opaklığa iner (160ms).
2. (0ms) Arka plan örtüsü (`--ink` %92) 0'a iner (`--dur-morph`).
3. (80ms) Terminal penceresi, `motion`'ın `layoutId="terminal"` ile sağ alttaki mini terminal konumuna ve boyutuna (`176 × 44px`) küçülür. Süre `--dur-morph`, easing `--ease-out`. Köşe yarıçapı 12px → 10px.
4. (400ms) Klasik görünümün hero bölümündeki isim, soldan değil, **terminalde yazıldığı noktadan** gelmiş gibi hissettirmek için yalnızca opaklık 0 → 1 (240ms). Başka hiçbir bölüm giriş animasyonu yapmaz.
5. Bitişte odak klasik görünümdeki `<h1>`'e taşınır.

Tersine (mini terminale tıklayınca ya da `~` tuşuna basınca): mini terminal aynı `layoutId` ile büyüyerek tam pencereye döner, önceki çıktı geçmişi korunmuş olarak görünür, odak input'a gelir.

---

## 7. Mini Terminal (klasik görünümde)

- Konum: `position: fixed`, sağ alt, `right: 20px`, `bottom: calc(20px + env(safe-area-inset-bottom))`.
- Görünüm: `--ink` zemin, `176 × 44px`, içinde `cankafali:~$ █` (imleç `--amber`, yavaş yanıp söner, 1.6s).
- Hover: 4px yukarı kalkar (`--dur-fast`), altında `Terminali aç (~)` ipucu belirir.
- `aria-label="Terminali aç"`, klavyeyle odaklanabilir, `Enter`/`Space` ile açılır.
- Yazdırmada gizlenir.

---

## 8. Klasik Görünüm

Tek sütun, **sola hizalı**, içerik genişliği `max-width: 72rem`, gövde metni `68ch`. Kart yok; bölümler yalnızca `--page-line` renkli ince yatay çizgilerle ayrılır. Terminalden gelen bir izi korur: bölüm başlıklarının solunda küçük, `--text-soft` renkte mono bir yol yazısı var (ör. `~/projects`). Bu bir süs değil, terminaldeki karşılık gelen komutu gösterir ve tıklanınca terminali o komutla açar.

### 8.1 Üst çubuk

```
 {AD SOYAD}                                    Projeler  Hakkımda  İletişim     TR | EN
```
- Yükseklik 64px, kaydırınca yapışkan, zemin `--page` (%90 opak), alt çizgi yalnızca kaydırma başladıktan sonra görünür.
- Mobilde linkler gizlenir, yerine "Menü" metin butonu; tam ekran basit bir liste açar.

### 8.2 Hero

```
 ┌───────────────────────────────────────────────────────────────────┐
 │                                                                   │
 │  {AD SOYAD}                                  ← --fs-display, 600  │
 │  Frontend developer. React ve TypeScript ile                      │
 │  hızlı, erişilebilir arayüzler geliştiriyorum.  ← --fs-body*1.25  │
 │                                                                   │
 │  [ Birlikte çalışalım ]  [ CV'yi indir ]                          │
 │                                                                   │
 │  {ŞEHİR}.  {MÜSAİTLİK}                                    │
 └───────────────────────────────────────────────────────────────────┘
```
- Dikey yükseklik ekranın %70'i, fazlası değil; projeler ilk ekranda hafifçe görünmeli ki kaydırma davet edilsin.
- "Birlikte çalışalım" dolgulu (`--text` zemin, `--page` metin), "CV'yi indir" çerçeveli.
- Durum satırı (`{MÜSAİTLİK}`) içerik dosyasından gelir.

### 8.3 Projeler (`~/projects`)

Kart ızgarası **değil**, `ls -l` çıktısından esinlenen satır listesi:

```
 lup              Hayali bir kuyumcu için e-ticaret vitrini.        Next.js, CSS     {yıl}  Demo  Kod
 {proje-2}        {tek cümle}                                       {stack}          {yıl}  Demo  Kod
 {proje-3}        {tek cümle}                                       {stack}          {yıl}  Demo  Kod
```
- Proje adı 600 ağırlık; stack ve yıl `--fs-small`, `--text-soft`.
- Masaüstünde satırın üzerine gelince sağda 320×200 önizleme görseli belirir (imleci 24px geriden takip eder, `--dur-base`). Görseller `public/projects/*.webp`, en fazla 60KB, `loading="lazy"`.
- Satıra tıklamak satırı genişletir (akordeon): 2–4 cümle açıklama, "Neyi çözdüm" ve "Ne öğrendim" alt satırları. Aynı anda tek satır açık.
- Mobilde satır dikey yığılır: ad, açıklama, stack + yıl, linkler. Önizleme görseli genişletilmiş halde üstte gösterilir.
- **İçerik notu (site sahibine):** En güçlü proje en üstte. Her projenin canlı demosu olmalı; demosu olmayan proje listeye alınmamalı.

### 8.4 Hakkımda (`~/about`)

İki sütun (masaüstü): solda 3 kısa paragraf (en fazla 120 kelime), sağda yetenek grupları. Yetenekler düz metin listesi, virgülle değil satır satır; seviye göstergesi yok. "Öğreniyorum" grubu ayrı ve dürüst (ör. Java/Spring, Redux).

### 8.5 Eğitim (`~/education`)

Gerçek bir zaman sırası olduğu için burada sıralı düzen uygun:
```
 {yıl} – devam   Erciyes Üniversitesi, Bilgisayar Mühendisliği
 {yıl} – {yıl}   Workintech, Full Stack Web Developer programı
```

### 8.6 İletişim (`~/contact`)

Büyük tipografiyle e-posta adresi (`--fs-h2`) ve yanında "Kopyala" butonu. Altında LinkedIn ve GitHub metin linkleri. Form **yok** (spam ve backend gerektirir, e-posta yeterli).

### 8.7 Alt bilgi

Tek satır: `Bu site React, TypeScript ve Vite ile yapıldı. Kaynak kodu GitHub'da.` + Lighthouse skorları (build sonrası elle güncellenen sabit değerler, ör. `Performans 100, Erişilebilirlik 100`) + `~` tuşu ipucu.

---

## 9. İçerik Dosyaları

Tüm metin ve veri `src/content/` altında. Bileşenlerde sabit metin olmaz (arayüz metinleri `src/i18n/tr.ts`, `en.ts`).

```ts
// src/content/profile.ts
export const profile = {
  name: "{AD SOYAD}",
  handle: "cankafali",
  role: { tr: "Frontend developer", en: "Frontend developer" },
  focus: { tr: "{odak cümlesi}", en: "{focus sentence}" },
  location: { tr: "{ŞEHİR}", en: "{CITY}" },
  availability: { tr: "{MÜSAİTLİK}", en: "{AVAILABILITY}" },
  email: "{EPOSTA}",
  links: { github: "https://github.com/cankafali", linkedin: "{LINKEDIN_URL}" },
  cvFile: { tr: "/cv-tr.pdf", en: "/cv-en.pdf" },
};

// src/content/projects.ts
export type Project = {
  slug: string;                         // terminalde klasör adı, küçük harf-tire
  name: string;
  summary: Record<Lang, string>;        // tek cümle
  details: Record<Lang, string>;        // 2–4 cümle
  solved: Record<Lang, string>;
  learned: Record<Lang, string>;
  stack: string[];
  year: number;
  demoUrl: string;
  repoUrl: string;
  image: string;                        // /projects/<slug>.webp
};
```
Aynı kalıpta `skills.ts`, `education.ts`, `about.ts`.

---

## 10. Konsol Mesajı

`main.tsx` içinde, yalnızca production'da, bir kez:

```ts
console.log(
  "%cMerhaba, meraklı geliştirici.",
  "font: 600 16px 'Martian Mono', monospace; color: #FFB547; background: #0F1B2D; padding: 8px 12px; border-radius: 6px;"
);
console.log(
  "%cKonsolu açtıysan seninle aynı dili konuşuyoruz. Birlikte çalışalım: {EPOSTA}\nKaynak kod: https://github.com/cankafali/{REPO}",
  "font: 13px system-ui; color: #4A5A70; line-height: 1.6;"
);
```
Dil seçiliyse İngilizce karşılığı basılır.

---

## 11. Erişilebilirlik

- Terminal çıktı alanı `role="log"`, `aria-live="polite"`; intro yazma animasyonu sırasında her karakter değil, satır tamamlandığında duyurulur.
- Tüm etkileşimli öğeler klavyeyle erişilebilir; odak halkası `2px solid var(--amber)`, `outline-offset: 3px`, her iki temada da görünür.
- Kontrast: tüm metinler WCAG AA (normal metin 4.5:1). `--muted` renginin `--ink` üzerindeki kontrastını doğrula; yetmezse açıklaştır.
- `<noscript>` gerekmez çünkü klasik içerik HTML'de zaten var; JS yoksa terminal katmanı hiç render edilmez.
- Sayfanın başında "İçeriğe atla" linki.
- Dil değişince `<html lang>` güncellenir.

---

## 12. Yazdırma ve CV

- `@media print`: terminal, mini terminal, üst çubuk, butonlar ve önizleme görselleri gizlenir; klasik görünüm siyah-beyaz, A4, tek sayfaya sığacak şekilde (`font-size: 10.5pt`, kenar boşluğu 14mm) basılır. Linklerin URL'leri parantez içinde yazdırılır.
- Ayrıca kullanıcının hazırladığı PDF CV `public/cv-tr.pdf` ve `public/cv-en.pdf` olarak durur; `cv` komutu ve "CV'yi indir" butonu seçili dildekini indirir.

---

## 13. SEO ve Paylaşım

- `<title>`: `{AD SOYAD}, Frontend Developer`
- Meta description seçili dilin `focus` cümlesi.
- Open Graph görseli `public/og.png` (1200×630): `--ink` zemin, üzerinde terminal prompt'u ve isim, Martian Mono. Görseli `scripts/` altında basit bir build adımıyla değil, tasarlanıp elle konacak statik dosya olarak bekle; yoksa yer tutucu üret.
- Favicon: `--ink` kare üzerinde `--amber` renkte `>_` işareti, SVG.
- `robots.txt` ve `sitemap.xml`.

---

## 14. Performans Bütçesi

| Metrik | Hedef |
|---|---|
| Lighthouse (mobil) Performance / A11y / Best Practices / SEO | 100 / 100 / 100 / 100 (en az 95) |
| LCP | < 1.5 sn |
| CLS | 0 |
| JS (gzip) | ≤ 90 KB |
| Fontlar | Yalnızca kullanılan ağırlıklar, `latin` + `latin-ext` alt kümesi, `font-display: swap`, ana fontlar `preload` |

`motion` paketini yalnızca kullanılan parçalarla içe aktar (`LazyMotion` + `domAnimation`).

---

## 15. Klasör Yapısı

```
/
├─ public/
│  ├─ cv-tr.pdf, cv-en.pdf, og.png, favicon.svg, robots.txt, sitemap.xml
│  └─ projects/<slug>.webp
├─ scripts/
│  └─ fetch-github.mjs          # prebuild: public repo verisini src/content/github.json'a yazar, hata olursa eski dosyayı korur
├─ src/
│  ├─ main.tsx, App.tsx
│  ├─ styles/        tokens.css, global.css, print.css
│  ├─ i18n/          LanguageContext.tsx, tr.ts, en.ts
│  ├─ content/       profile.ts, projects.ts, skills.ts, education.ts, about.ts, github.json
│  ├─ hooks/         useTypewriter.ts, useCommandHistory.ts, useViewParam.ts, useReducedMotion.ts
│  ├─ terminal/
│  │  ├─ Terminal.tsx, TerminalWindow.tsx, OutputLine.tsx, Prompt.tsx, CommandChips.tsx, MiniTerminal.tsx
│  │  ├─ introScript.ts
│  │  ├─ registry.ts            # komutları toplar, takma adları ve tamamlamayı çözer
│  │  └─ commands/              # her komut ayrı dosya
│  └─ classic/
│     ├─ ClassicView.tsx, TopBar.tsx, Hero.tsx, Projects.tsx, ProjectRow.tsx, About.tsx, Education.tsx, Contact.tsx, Footer.tsx
├─ DECISIONS.md
└─ README.md                    # proje açıklaması, komut listesi, yerel çalıştırma, Lighthouse ekran görüntüsü
```

---

## 16. Geliştirme Sırası

Her aşama bitince çalışır durumda commit at, sonrakine geç.

1. **İskelet:** Vite + React + TS, ESLint/Prettier, fontlar, `tokens.css`, içerik dosyaları (yer tutucularla).
2. **Klasik görünüm:** Tüm bölümler, responsive, açık/koyu tema, print CSS. Terminal olmadan da tek başına eksiksiz bir site olmalı.
3. **Terminal çekirdeği:** Pencere, input, çıktı modeli, komut kayıt sistemi, temel komutlar (`help`, `whoami`, `about`, `projects`, `open`, `contact`, `clear`).
4. **Intro:** `useTypewriter`, intro senaryosu, atlama, `sessionStorage` kontrolü, mobil kısaltma.
5. **Dönüşüm:** `gui` morph animasyonu, mini terminal, geri açılma, `?view=classic` senkronu.
6. **Detaylar:** Kalan komutlar, tab tamamlama, geçmiş, öneri (Levenshtein), gizli komutlar, komut çipleri, TR/EN.
7. **Cila:** Konsol mesajı, GitHub script'i, SEO, OG görseli, reduced motion, erişilebilirlik denetimi, Lighthouse, README.

---

## 17. Kabul Kriterleri

- [ ] `/` açıldığında intro 4.5 saniye içinde tamamlanıyor, herhangi bir tuş/tık anında atlatıyor.
- [ ] `/?view=classic` terminali hiç göstermeden klasik görünümü açıyor.
- [ ] Tüm komutlar TR ve EN çıktı veriyor; bilinmeyen komutta öneri çıkıyor.
- [ ] Tab tamamlama, ↑/↓ geçmiş, Ctrl+L, Ctrl+C, Esc çalışıyor.
- [ ] Terminal ↔ klasik dönüşümü akıcı (60fps), geri dönünce terminal geçmişi korunuyor.
- [ ] Mobilde (375px) klavye açmadan tüm içerik komut çipleri ve klasik görünümle gezilebiliyor.
- [ ] `prefers-reduced-motion` açıkken yazma ve morph animasyonu yok.
- [ ] Yalnızca klavyeyle tüm site gezilebiliyor, odak her zaman görünür.
- [ ] Ctrl+P tek sayfalık temiz bir CV çıkarıyor.
- [ ] Lighthouse mobil skorları en az 95, CLS 0.
- [ ] Kodda `dangerouslySetInnerHTML`, `any` ve Tailwind yok.
- [ ] Konsolda mesaj görünüyor, başka uyarı/hata yok.
