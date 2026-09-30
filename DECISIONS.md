# Kararlar

TASARIM.md'de açık kalan noktalar için verilen kararlar (her biri tek satır).

- TypeScript `~6.0` sabitlendi: typescript-eslint henüz TS 7'yi desteklemiyor (`<6.1.0`).
- Fontlar `@fontsource-variable` paketlerinden, ama paketin tüm-alt-küme CSS'i yerine `src/styles/fonts.css` içinde yalnızca latin + latin-ext `@font-face` tanımlandı.
- Değişken font `font-weight` aralığı 400–600 ile sınırlandı (spesifikasyondaki kullanılan ağırlıklar).
- Profile `tagline` (whoami ikinci satırı) ve `repoUrl` alanları eklendi; §5.2 ve §10'daki metinler içerik dosyasından gelsin diye.
- `src/content/github.ts` eklendi: `github.json`'ı tipli olarak dışa veren ince sarmalayıcı.
- `prefers-reduced-motion` altında `--dur-fast`/`--dur-base` 0ms, `--dur-morph` 150ms (§3.4'teki opaklık geçişi süresi).
- `--muted` / `--ink` kontrastı 4.99:1 (AA geçer); `--muted` / `--ink-raised` 4.29:1 olduğu için başlık çubuğunda normal boyutlu metin `--muted` yerine `--paper` kullanılacak.
