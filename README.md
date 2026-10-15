# Ankara Tur — web sitesi

@ankara_tur Instagram hesabındaki ilanlardan (Mayıs – Ekim 2026 postları ve öne çıkan hikayeler) oluşturulmuş,
bağımlılıksız (saf HTML/CSS/JS) statik site. Kurulum gerektirmez: `index.html` dosyasını açmanız ya da klasörü
herhangi bir statik hostinge yüklemeniz yeterli.

## Klasör yapısı

```
index.html                Sayfa
assets/css/style.css      Tasarım
assets/js/data.js         ← TÜM TUR BİLGİLERİ (fiyat, tarih, program, duyuru) burada
assets/js/highlights.js   Instagram öne çıkan hikayeleri (otomatik üretildi)
assets/js/app.js          Site davranışları
assets/img/covers|tiles   Tur kartı görselleri
assets/img/posters        Instagram afişleri (1080 px) + thumb/ (480 px)
assets/img/hl, gallery    Hikaye ve galeri kareleri
assets/video/hl           Öne çıkan hikaye videoları
```

## Özellikler

- **WhatsApp rezervasyonu:** tur, tarih, otel/paket, kişi sayısı, biniş noktası, ad ve telefon seçilir; hazır mesaj
  `wa.me/905000000000` ile açılır. Tahmini tutar ve nakit %5 indirimli tutar otomatik hesaplanır. Sunucu gerekmez.
- **33 tur ilanı:** konaklamalı, günübirlik, tren, yurt dışı (₺ ve €), yaz tatili, 29 Ekim özel — kategori filtresi,
  Türkçe karakter duyarsız arama, paylaşılabilir tur bağlantısı (`#tur/yedigoller`).
- **Haftalık çıkışlar:** “Her Çarşamba–Cumartesi–Pazar” gibi düzenli turların önümüzdeki 6 haftalık tarihleri otomatik
  listelenir; geçmiş tarihler gizlenir. **Tur takvimi** tüm yaklaşan kalkışları gösterir.
- **Hikayeler:** güncel tur hikayeleri + Instagram’daki 5 öne çıkan hikaye (fotoğraf ve video, arşiv tarihiyle).
- **Duyuru şeridi:** `SITE.notice` (ör. fiyat artışı) belirtilen tarihten sonra kendiliğinden kaybolur.
- Sabit WhatsApp düğmesi, mobil alt çubuk, kalkış noktaları + harita, SSS, Instagram ızgarası, yapısal veri (SEO).

## Tur ekleme / güncelleme

`assets/js/data.js` içindeki `window.TOURS` listesine nesne ekleyin (dosyanın başındaki açıklamaya bakın):

```js
{
  id: "abant-gunubirlik", title: "Abant Gölü", tags: ["gunubirlik"], duration: "Günübirlik",
  price: 1990, tile: "assets/img/tiles/abant.webp", posters: ["d-beypazari"],
  summary: "Kısa açıklama",
  dates: [{ d: "2026-11-14", days: 1 }],                 // belirli tarihler
  weekly: { dow: [3, 6, 0], days: 1, until: "2026-11-29" }, // her Çar, Cmt, Paz
  includes: ["Ulaşım"], excludes: ["Öğle yemeği"], ig: "https://www.instagram.com/p/XXXX/"
}
```

Dosyaları değiştirdikten sonra `index.html` içindeki `?v=3` değerlerini artırın (ör. `?v=4`); ziyaretçiler eski
sürümü önbellekten görmez.

## Ücretsiz yayın

**Netlify Drop (en kolayı):** https://app.netlify.com/drop adresinde ücretsiz hesapla giriş yapın, `ankara-tur-site.zip`
dosyasını (veya klasörü) sayfaya sürükleyin. Birkaç saniyede `xxxx.netlify.app` adresi verilir; “Site configuration →
Change site name” ile `ankaratur-demo.netlify.app` gibi bir ad seçebilirsiniz.

**GitHub Pages:** klasörü bir GitHub deposuna gönderip Settings → Pages → “Deploy from a branch” (main / root) seçin.

## Yayına almadan önce / işletme devralınca

1. `index.html` içindeki `<meta name="robots" content="noindex, nofollow">` satırı ve `robots.txt` siteyi arama
   motorlarından gizler. İşletme onay verince bu satırı silin, `robots.txt` içinde `Disallow: /` yerine `Allow: /` yazın.
2. Alan adı belli olunca `og:image` değerini tam adres yapın (ör. `https://ankaratur.com/assets/img/og.jpg`).
3. Görsel ve metinler @ankara_tur paylaşımlarındandır; Karaelmas fotoğrafları @cookgezer’e aittir. Öne çıkan hikayelerde
   misafir fotoğrafları bulunur — kalıcı yayında işletmenin onayıyla kullanın.
4. Yaz tatili ve bazı kültür turu fiyatları 2026 yaz sezonu ilanlarındandır; güncel fiyatlarla değiştirin.

## Yerelde çalıştırma

```bash
python -m http.server 5179
```

Ardından `http://localhost:5179` adresini açın.
