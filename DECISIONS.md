# Kararlar

TASARIM.md'de açık kalan noktalar için verilen kararlar (her biri tek satır).

- TypeScript `~6.0` sabitlendi: typescript-eslint henüz TS 7'yi desteklemiyor (`<6.1.0`).
- Fontlar `@fontsource-variable` paketlerinden, ama paketin tüm-alt-küme CSS'i yerine `src/styles/fonts.css` içinde yalnızca latin + latin-ext `@font-face` tanımlandı.
- Değişken font `font-weight` aralığı 400–600 ile sınırlandı (spesifikasyondaki kullanılan ağırlıklar).
- Profile `tagline` (whoami ikinci satırı) ve `repoUrl` alanları eklendi; §5.2 ve §10'daki metinler içerik dosyasından gelsin diye.
- `src/content/github.ts` eklendi: `github.json`'ı tipli olarak dışa veren ince sarmalayıcı.
- `prefers-reduced-motion` altında `--dur-fast`/`--dur-base` 0ms, `--dur-morph` 150ms (§3.4'teki opaklık geçişi süresi).
- `--muted` / `--ink` kontrastı 4.99:1 (AA geçer); `--muted` / `--ink-raised` 4.29:1 olduğu için başlık çubuğunda normal boyutlu metin `--muted` yerine `--paper` kullanılacak.
- `LanguageContext` 2. aşamada eklendi (klasik görünümün TR | EN geçişi için); `?lang=en` URL'ye yazılır, `<html lang>` ve meta description güncellenir.
- Tema yalnızca sistem tercihini (`prefers-color-scheme`) izler; spesifikasyonda tema düğmesi olmadığı için eklenmedi.
- Bölüm başlıklarındaki `~/projects` gibi yollar terminal gelene kadar tıklanamaz düz metin (`aria-hidden`); 5. aşamada terminali açan düğmeye dönüşecek.
- Alt bilgideki `~` tuşu ipucu terminal eklenene kadar gösterilmiyor; Lighthouse skorları `src/content/site.ts` içinde `null` iken gizli.
- Mobil menü yerel `<dialog>` (showModal) ile yapıldı: odak tuzağı ve Esc ile kapanma tarayıcıdan gelir.
- Mobilde TR | EN üst çubukta kalır, yalnızca bölüm linkleri "Menü"ye taşınır.
- Proje önizleme görseli yoksa (`public/projects/*.webp` henüz eklenmedi) `onError` ile gizlenir; kırık görsel gösterilmez.
- Print: proje detayları (akordeon), görseller, butonlar, üst çubuk ve alt bilgi basılmaz; `http` linklerinin URL'si parantez içinde yazılır.
- Terminal oturumu (çıktı geçmişi) `useTerminalSession` ile App seviyesinde tutulur; pencere kapanıp açılınca geçmiş korunur (5. aşamadaki morph buna dayanacak).
- 3. aşamada görünüm geçişi animasyonsuz: kırmızı/sarı nokta ve Esc klasik görünüme geçer, `~` geri açar, `?view=classic` yalnızca açılışta okunur. Morph, mini terminal ve URL'ye yazma 5. aşamada.
- Ctrl+L ve Ctrl+C çekirdekle birlikte eklendi (tek satırlık işler); Tab tamamlama, ↑/↓ geçmiş ve Levenshtein önerisi 6. aşamada.
- Her komut çıktısından sonra bir boş satır basılır (§5.2 intro senaryosundaki düzenle aynı).
- `help` komutu registry'ye fabrika fonksiyonuyla bağlanır (`createHelpCommand`); döngüsel import yok.
- Proje klasörleri terminalde `lup/` biçiminde (§5.2'deki `ls` çıktısı gibi) ve tıklanınca `open <slug>` çalışır; `open` sondaki `/`'yi kabul eder.
- Terminal input'u yalnızca `(pointer: fine)` cihazlarda açılışta odak alır; dokunmatikte klavye kendiliğinden açılmaz.
- Terminal katmanı `role="dialog"` + `aria-modal`; çıktı `role="log"`, aktif satır ve input log bölgesinin dışında (her tuş duyurulmasın diye).
- Intro zamanlaması: ilk karakterden önce 300ms, adımlar arası 200ms bekleme (spesifikasyonda yok; komutlar birbirine yapışmasın diye). Ölçülen toplam: masaüstü ~4.1 sn, mobil ~3.1 sn. 4.5 sn bütçesi aşılırsa yalnızca yazma hızı ölçeklenir.
- Intro yalnızca sayfa terminalle açıldığında oynar; `?view=classic` ile açılıp sonra terminale geçilirse yalnızca ipucu satırı görünür (§4 akışında morph interaktif terminale gider).
- `prefers-reduced-motion` açıkken intro, tekrar ziyaretteki gibi tamamlanmış haliyle anında basılır.
- Introyu atlatan tuş/tık başka iş yapmaz: tuş `preventDefault` edilir (Esc pencereyi kapatmaz), tıktan sonraki 500ms içindeki click yutulur (yeni beliren butona yanlışlıkla basılmasın).
- Intro komutları (`cat focus.txt`, `./contact.sh`) gerçek komut olarak kaydedilmedi; yalnızca senaryonun parçası. `ls projects/` ise `projects` komutunun takma adı.
- `gui` komutu (takma adlar: `exit`, `klasik`) 4. aşamada eklendi, çünkü introdaki "Klasik görünüm" butonu onu çalıştırıyor; morph 5. aşamada.
- `./contact.sh` butonları arasındaki boşluk metin değil CSS boşluğu; §5.2'deki iki boşluklu girinti dar ekranda buton alt satıra kayınca hizayı bozduğu için kaldırıldı.
- Intro bitince ya da atlanınca `sessionStorage`'a `intro-seen=1` yazılır.
