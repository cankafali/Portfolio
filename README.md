# Terminal Portfolyo

Terminal girişli kişisel portfolyo sitesi. Tasarım ve teknik spesifikasyon: [TASARIM.md](TASARIM.md).

## Yerel çalıştırma

```bash
npm install
npm run dev
```

## Komutlar

| Komut             | Açıklama                                  |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Geliştirme sunucusu                       |
| `npm run build`   | Tip kontrolü + üretim derlemesi (`dist/`) |
| `npm run preview` | Derlenmiş çıktıyı önizle                  |
| `npm run lint`    | ESLint                                    |
| `npm run format`  | Prettier ile biçimlendir                  |

İçerik (isim, projeler, yetenekler vb.) `src/content/` altındadır; `{SÜSLÜ_PARANTEZ}` içindeki değerler doldurulmalıdır.
