/*
 * Ankara Tur — site verisi
 * ------------------------------------------------------------
 * Turları, tarihleri ve fiyatları güncellemek için sadece bu dosyayı düzenleyin.
 * Kaynak: instagram.com/ankara_tur paylaşımları (Mayıs – Ekim 2026).
 *
 * dates:   [{ d: "YYYY-AA-GG", days: 3, note: "..." }]  → belirli çıkış tarihleri
 * weekly:  { dow: [3, 6, 0], days: 1, until: "YYYY-AA-GG" } → haftalık düzenli çıkış
 *          (dow: 0 Pazar, 1 Pazartesi, … 6 Cumartesi). Önümüzdeki 6 hafta otomatik listelenir.
 * Geçmiş tarihler sitede otomatik gizlenir.
 * price:   kişi başı başlangıç fiyatı. Bilinmiyorsa null → "Fiyat için sorun". currency: "€" (varsayılan ₺)
 */
window.SITE = {
  brand: "Ankara Tur",
  igName: "Ankara_Gezi",
  handle: "ankara_tur",
  slogan: "Ankara çıkışlı günübirlik ve konaklamalı turlar",
  phone: "0 (500) 000 00 00",
  tel: "+905000000000",
  whatsapp: "905000000000",
  instagram: "https://www.instagram.com/ankara_tur/",
  instagram2: { handle: "ankara_etkinlikleri", url: "https://www.instagram.com/ankara_etkinlikleri/" },
  tursab: "A-11959",
  tursabUrl: "https://www.tursab.org.tr/tr/ddsv",
  followers: "19 B",
  postCount: "3.300+",
  /* Duyuru şeridi: until tarihinden sonra kendiliğinden kaybolur */
  notice: {
    until: "2026-10-18",
    title: "Fiyat artışı öncesi son günler!",
    text: "Artan maliyetler nedeniyle tur fiyatlarımız güncelleniyor. Hafta sonuna kadar mevcut fiyatlarla yerinizi ayırtın.",
    poster: "fiyat-artisi",
    ig: "https://www.instagram.com/p/DegV6iwIvNG/"
  },
  payment: [
    { icon: "card", title: "Kredi kartına 3 taksit", text: "Tüm kredi kartlarına vade farksız taksit." },
    { icon: "cash", title: "Nakit ödemede %5 indirim", text: "Peşin/nakit ödemelerde ek indirim." },
    { icon: "lock", title: "Ön ödemeyle yer ayırtın", text: "Kapora ile kaydolun, kalanı tur günü." }
  ],
  departures: [
    { time: "07:00", name: "Kızılay Gama İş Merkezi", map: "Gama İş Merkezi, Kızılay, Ankara" },
    { time: "07:15", name: "Milli Kütüphane", map: "Milli Kütüphane, Bahçelievler, Ankara" },
    { time: "07:20", name: "Armada AVM – Çapa Heykeli", map: "Armada AVM, Söğütözü, Ankara" },
    { time: "07:30", name: "Optimum AVM karşısı – Köfteci Yusuf", map: "Optimum Outlet AVM, Eryaman, Ankara" }
  ]
};

window.CATEGORIES = [
  { id: "hepsi", label: "Tümü" },
  { id: "gunubirlik", label: "Günübirlik" },
  { id: "konaklamali", label: "Konaklamalı" },
  { id: "ozel29", label: "29 Ekim özel" },
  { id: "tren", label: "Tren turları" },
  { id: "yurtdisi", label: "Yurt dışı" },
  { id: "yaz", label: "Yaz tatili" }
];

/* 29 Ekim haftası günübirlik çıkış günleri (afiş: "28-29-30-31 Ekim - 1 Kasım çıkışlı") */
var GUNUBIRLIK_29 = ["2026-10-28", "2026-10-29", "2026-10-30", "2026-10-31", "2026-11-01"];
function dayDates(extra) {
  var list = (extra || []).concat(["2026-10-18"], GUNUBIRLIK_29);
  return list.filter(function (d, i) { return list.indexOf(d) === i; }).sort().map(function (d) { return { d: d, days: 1 }; });
}
/* Günübirlik afişleri: "Her Çarşamba – Cumartesi – Pazar" */
var HAFTALIK_GUNUBIRLIK = { dow: [3, 6, 0], days: 1, until: "2026-11-29" };
var GUNUBIRLIK_INC = ["Lüks turizm araçlarıyla ulaşım", "Araç içi sabah kahvaltısı", "Profesyonel rehberlik", "Seyahat sağlık sigortası", "Acente refakati"];
var GUNUBIRLIK_EXC = ["Öğle yemeği", "Müze ve ören yeri giriş ücretleri", "Kişisel harcamalar"];
var SEZON_SONU = "2026-11-30";

window.TOURS = [
  /* ============================ KONAKLAMALI ============================ */
  {
    id: "guneydogu-anadolu",
    title: "Güneydoğu Anadolu Turu",
    subtitle: "Her şey dahil GAP turu",
    tags: ["konaklamali", "ozel29"],
    duration: "3 Gece 4 Gün",
    price: 14490,
    priceNote: "3 gece 4 gün, kişi başı",
    badge: "Her şey dahil",
    cover: "assets/img/covers/guneydogu.webp",
    posters: ["gap-3g", "gap-4g", "gap-kultur", "gap", "29-ekim"],
    summary: "Mardin, Midyat, Şanlıurfa, Halfeti, Göbeklitepe, Gaziantep, Nemrut ve Diyarbakır. Şanlıurfa’da yemekli sıra gecesi, Halfeti tekne turu ve Nemrut transferi fiyata dahil.",
    recurring: "Ağustos – Kasım: 3 gece her Çarşamba, 4 gece her Cumartesi hareketli",
    dates: [
      { d: "2026-10-16", days: 5, note: "4 Gece 5 Gün" },
      { d: "2026-10-21", days: 4, note: "3 Gece 4 Gün" },
      { d: "2026-10-29", days: 4, note: "29 Ekim özel" }
    ],
    weekly: { dow: [3], days: 4, until: SEZON_SONU, note: "3 Gece 4 Gün" },
    variants: [
      { name: "3 Gece 4 Gün · her Çarşamba", price: 14490 },
      { name: "4 Gece 5 Gün · her Cumartesi", price: 18490 }
    ],
    route: ["Mardin – Midyat, Deyrulzafaran, Mor Gabriel", "Şanlıurfa – Halfeti, Göbeklitepe, Harran, Balıklıgöl", "Gaziantep", "Adıyaman – Nemrut", "Diyarbakır – Ulu Camii, Keçi Burcu, On Gözlü Köprü"],
    highlights: [
      "Şanlıurfa’da yemekli sıra gecesi (2.000 TL değerinde)",
      "Halfeti tekne turu (400 TL değerinde)",
      "Nemrut Dağı transferi ve turu (600 TL değerinde)",
      "İlk gün restoranda kahvaltı",
      "4 gecelik turda Dara Antik Kenti ve Beyaz Su gezisi"
    ],
    includes: [
      "Lüks araçlarla ulaşım",
      "Tüm ekstra turlar ve transferler",
      "3 veya 4 gece belirtilen marka otellerde konaklama",
      "Otelde sabah kahvaltısı ve akşam yemeği",
      "Seyahat sağlık sigortası",
      "Profesyonel turist rehberliği",
      "Acente refakati ve araç içi ikramlar"
    ],
    excludes: ["Öğle yemekleri", "Müze ve ören yeri giriş ücretleri", "Kişisel harcamalar"],
    ig: "https://www.instagram.com/p/Ddlcz2giOWj/"
  },
  {
    id: "canakkale-bozcaada",
    title: "Çanakkale • Bozcaada • Assos • Cunda",
    subtitle: "Kazdağları ile Kuzey Ege",
    tags: ["konaklamali", "ozel29"],
    duration: "2 Gece 3 Gün",
    price: 10790,
    priceNote: "2 gece 3 gün, kişi başı",
    badge: "Kesin hareketli",
    cover: "assets/img/covers/canakkale-2.webp",
    posters: ["canakkale", "canakkale-kultur", "29-ekim"],
    summary: "Gelibolu Yarımadası ve şehitlikler, Bozcaada, Assos, Cunda Adası, Kazdağları ve Adatepe Köyü’nü kapsayan Kuzey Ege rotası.",
    recurring: "Mart – Kasım arası her Perşembe hareketli",
    dates: [
      { d: "2026-10-15", days: 3, note: "Kesin hareketli · son kontenjanlar" },
      { d: "2026-10-29", days: 3, note: "29 Ekim özel" },
      { d: "2026-10-30", days: 3, note: "29 Ekim özel" }
    ],
    weekly: { dow: [4], days: 3, until: SEZON_SONU },
    route: ["Çanakkale", "Gelibolu Yarımadası & Şehitlikler", "Bozcaada", "Assos & Ceneviz Kalesi", "Cunda Adası", "Kazdağları", "Adatepe Köyü"],
    ig: "https://www.instagram.com/p/DeeK9QLIbp2/"
  },
  {
    id: "ege-butik",
    title: "Butik Ege Turu",
    subtitle: "Ege’nin en güzel durakları",
    tags: ["konaklamali"],
    duration: "2 Gece 3 Gün",
    price: 9490,
    priceNote: "2 gece 3 gün, kişi başı",
    cover: "assets/img/covers/ege-butik.webp",
    posters: ["ege-butik"],
    summary: "Sığacık, Çeşme, Alaçatı, Kuşadası’nda yüzme molası, Efes Antik Kenti, Şirince ve Pamukkale tek programda.",
    recurring: "Mart – Kasım arası her Perşembe hareketli",
    weekly: { dow: [4], days: 3, until: SEZON_SONU },
    route: ["Sığacık", "Çeşme", "Alaçatı", "Kuşadası (yüzme molası)", "Efes Antik Kenti", "Şirince", "Pamukkale"],
    notes: ["Fiyat Haziran 2026 afişindendir; güncel fiyat için ekibimize danışın."],
    ig: "https://www.instagram.com/p/DaAA-T3iPkS/"
  },
  {
    id: "istanbul-adalar-sile",
    title: "İstanbul Adalar • Saraylar • Şile • Ağva",
    subtitle: "Boğaz’dan Karadeniz kıyısına",
    tags: ["konaklamali", "ozel29"],
    duration: "2 Gece 3 Gün",
    price: 9990,
    priceNote: "2 gece 3 gün, kişi başı",
    cover: "assets/img/covers/istanbul-sile.webp",
    posters: ["istanbul-sile", "29-ekim"],
    summary: "Topkapı Sarayı, Ayasofya ve Sultanahmet’ten Heybeliada ve Büyükada’ya, oradan Şile ve Ağva’nın Karadeniz kıyısına.",
    recurring: "Mart – Kasım arası her Perşembe hareketli",
    dates: [
      { d: "2026-10-29", days: 3, note: "29 Ekim özel" },
      { d: "2026-10-30", days: 3, note: "29 Ekim özel" }
    ],
    weekly: { dow: [4], days: 3, until: SEZON_SONU },
    route: ["Topkapı Sarayı", "Ayasofya", "Dikilitaş", "Sultanahmet Camii", "Mısır Çarşısı", "Heybeliada", "Büyükada", "Şile", "Ağva"],
    ig: "https://www.instagram.com/p/DeHm-ADiE0y/"
  },
  {
    id: "istanbul-adalar-saraylar",
    title: "İstanbul Adalar • Saraylar",
    subtitle: "Tarihi Yarımada ve Prens Adaları",
    tags: ["konaklamali", "ozel29"],
    duration: "1 Gece 2 Gün",
    price: 6290,
    priceNote: "1 gece 2 gün, kişi başı",
    cover: "assets/img/covers/istanbul-adalar.webp",
    posters: ["istanbul-adalar", "29-ekim", "bulten"],
    summary: "Topkapı Sarayı, Ayasofya, Sultanahmet ve Mısır Çarşısı ile Heybeliada ve Büyükada’yı kapsayan kısa İstanbul kaçamağı.",
    recurring: "Mart – Kasım arası her Cuma hareketli",
    dates: [
      { d: "2026-10-16", days: 2 },
      { d: "2026-10-29", days: 2, note: "29 Ekim özel" },
      { d: "2026-10-30", days: 2, note: "29 Ekim özel" },
      { d: "2026-10-31", days: 2, note: "29 Ekim özel" }
    ],
    weekly: { dow: [5], days: 2, until: SEZON_SONU },
    route: ["Topkapı Sarayı", "Ayasofya", "Dikilitaş", "Sultanahmet Camii", "Mısır Çarşısı", "Heybeliada", "Büyükada"],
    ig: "https://www.instagram.com/p/DeY4BKyIaON/"
  },
  {
    id: "kapadokya-ihlara",
    title: "Kapadokya • Ihlara Vadisi",
    subtitle: "Peri bacaları ve kanyon yürüyüşü",
    tags: ["konaklamali", "ozel29"],
    duration: "1 Gece 2 Gün",
    price: 5790,
    priceNote: "1 gece 2 gün, kişi başı",
    cover: "assets/img/covers/kapadokya-ihlara.webp",
    posters: ["kapadokya-ihlara", "29-ekim", "bulten"],
    summary: "Uçhisar Kalesi, Göreme Açık Hava Müzesi, Devrent (Hayal) Vadisi ve Ihlara Vadisi’ni kapsayan konaklamalı Kapadokya turu.",
    recurring: "Mart – Kasım arası her Cumartesi hareketli",
    dates: [
      { d: "2026-10-17", days: 2 },
      { d: "2026-10-29", days: 2, note: "29 Ekim özel" },
      { d: "2026-10-30", days: 2, note: "29 Ekim özel" },
      { d: "2026-10-31", days: 2, note: "29 Ekim özel" }
    ],
    weekly: { dow: [6], days: 2, until: SEZON_SONU },
    route: ["Güvercinlik Vadisi", "Uçhisar Kalesi", "Göreme Panorama", "Göreme Açık Hava Müzesi", "Devrent Vadisi", "Ihlara Vadisi", "Çanak Çömlek Atölyesi", "Şarap Mahzeni", "Sallanan Köprü"],
    ig: "https://www.instagram.com/p/DeHm-ADiE0y/"
  },
  {
    id: "bursa-cumalikizik",
    title: "Bursa • Cumalıkızık • Gölyazı • Mudanya • Trilye",
    subtitle: "Osmanlı köyleri ve Marmara kıyısı",
    tags: ["konaklamali", "ozel29"],
    duration: "1 Gece 2 Gün",
    price: 6290,
    priceNote: "1 gece 2 gün, kişi başı",
    cover: "assets/img/covers/bursa.webp",
    posters: ["bursa", "bursa-2", "29-ekim", "bulten"],
    summary: "Cumalıkızık’ın tarihi evleri, Koza Han, Gölyazı, Mudanya ve Trilye ile Bursa’nın en güzel durakları.",
    recurring: "Her Cuma hareketli",
    dates: [
      { d: "2026-10-17", days: 2 },
      { d: "2026-10-29", days: 2, note: "29 Ekim özel" },
      { d: "2026-10-30", days: 2, note: "29 Ekim özel" },
      { d: "2026-10-31", days: 2, note: "29 Ekim özel" }
    ],
    weekly: { dow: [5], days: 2, until: SEZON_SONU },
    route: ["Cumalıkızık", "Koza Han", "Gölyazı", "Bursa", "Mudanya", "Trilye"],
    ig: "https://www.instagram.com/p/DZDnqGpooeO/"
  },
  {
    id: "sinop-erfelek",
    title: "Sinop • Erfelek Şelaleleri • Küre Dağları",
    subtitle: "Şelaleler, kanyonlar ve Sinop",
    tags: ["konaklamali", "ozel29"],
    duration: "1 Gece 2 Gün",
    price: 5990,
    priceNote: "1 gece 2 gün, kişi başı",
    cover: "assets/img/covers/sinop.webp",
    posters: ["sinop", "29-ekim", "bulten"],
    summary: "Erfelek Tatlıca Şelaleleri, İnceburun, Hamsilos Koyu, Tarihi Sinop Cezaevi, Horma Kanyonu ve Ilıca Şelalesi.",
    recurring: "Mart – Kasım arası her Cumartesi hareketli",
    dates: [
      { d: "2026-10-17", days: 2 },
      { d: "2026-10-29", days: 2, note: "29 Ekim özel" },
      { d: "2026-10-30", days: 2, note: "29 Ekim özel" },
      { d: "2026-10-31", days: 2, note: "29 Ekim özel" }
    ],
    weekly: { dow: [6], days: 2, until: SEZON_SONU },
    route: ["Erfelek Tatlıca Şelaleleri", "İnceburun", "Hamsilos Koyu", "Tarihi Sinop Cezaevi", "Horma Kanyonu", "Ilıca Şelalesi", "Çatak Kanyonu Seyir Terası"],
    ig: "https://www.instagram.com/p/DeHm-ADiE0y/"
  },
  {
    id: "bati-karadeniz",
    title: "Batı Karadeniz Turu",
    subtitle: "Konaklamalı Karadeniz kaçamağı",
    tags: ["konaklamali"],
    duration: "1 Gece 2 Gün",
    price: null,
    cover: "assets/img/tiles/amasra.webp",
    posters: ["bulten"],
    summary: "Batı Karadeniz’in sahil kasabaları ve doğa durakları; 17 Ekim Cumartesi çıkışlı.",
    dates: [{ d: "2026-10-17", days: 2 }],
    route: ["Batı Karadeniz"],
    ig: "https://www.instagram.com/p/DeY4BKyIaON/"
  },
  {
    id: "dogu-karadeniz-batum",
    title: "Doğu Karadeniz Yaylalar & Batum Turu",
    subtitle: "Her şey dahil yayla turu",
    tags: ["konaklamali", "yurtdisi"],
    duration: "3 Gece 4 Gün",
    price: 14990,
    priceNote: "tüm ekstralar dahil, kişi başı",
    badge: "Her şey dahil",
    cover: "assets/img/covers/karadeniz-batum.webp",
    posters: ["karadeniz-3g", "karadeniz-4g", "karadeniz-kultur", "karadeniz-batum", "karadeniz-video"],
    summary: "Uzungöl, Ayder, Zilkale, Pokut, Sal, Çeçeva ve daha fazla yayla ile Batum. Yayla turları ve transferleri fiyata dahil; büyük otobüs garantisi.",
    recurring: "Sezon boyunca her hafta: 3 gece Cuma akşamı, 4 gece Salı akşamı hareket. Yeni sezon tarihleri için danışın.",
    departure: "Ankara / Afyon / Kırıkkale / Çorum / Merzifon / Samsun",
    variants: [
      { name: "3 Gece 4 Gün · Cuma akşamı hareket", price: 14990 },
      { name: "4 Gece 5 Gün · Salı akşamı hareket", price: 15990 }
    ],
    route: ["Samsun", "Ordu", "Giresun", "Trabzon – Uzungöl", "Rize – Ayder, Zilkale, Pokut, Sal, Çeçeva", "Artvin – Borçka Karagöl", "Batum"],
    highlights: [
      "Gerçek her şey dahil: yayla turları (3.000–4.000 TL değerinde) fiyata dahil, sürpriz ödeme yok",
      "%35 ön ödeme ile fiyat sabitleme",
      "Son 30 güne kadar iptal / değişiklik imkânı",
      "Konaklama: Rize (4★), Hopa/Artvin (4★), Piraziz/Giresun (3★) veya benzeri oteller",
      "Batum’da Avrupa Meydanı ve Piazza Meydanı"
    ],
    includes: [
      "Lüks büyük otobüslerle ulaşım",
      "İlk gün restoranda serpme kahvaltı",
      "Tüm yayla transferleri ve turları",
      "3 gece otel, 3 sabah kahvaltısı + 3 akşam yemeği (4 gecelikte 4+4)",
      "Batum transferi ve turu",
      "Profesyonel rehberlik, milli park girişleri",
      "Seyahat sağlık sigortası, araç içi ikramlar"
    ],
    excludes: ["Harç pulu (1.350 TL)", "Öğle yemekleri", "Müze ve ören yeri girişleri", "Sümela ring ücreti", "Boztepe teleferik", "Kişisel harcamalar"],
    notes: ["Gürcistan’a geçiş için geçerli pasaport ya da yeni tip (çipli) kimlik kartı gerekir."],
    ig: "https://www.instagram.com/p/Dct0wDWIBS8/"
  },

  /* ============================ TREN TURLARI ============================ */
  {
    id: "karaelmas-ekspresi",
    title: "Turistik Karaelmas Ekspresi ile Batı Karadeniz",
    subtitle: "Yenice • Zonguldak • Safranbolu",
    tags: ["tren", "konaklamali"],
    duration: "2 Gece 3 Gün",
    price: 10500,
    priceNote: "2 gece 3 gün, kişi başı",
    badge: "1 gece yataklı vagonda",
    cover: "assets/img/covers/karaelmas-bk.webp",
    posters: ["karaelmas-bk", "karaelmas"],
    gallery: ["karaelmas-02", "karaelmas-03", "karaelmas-04", "karaelmas-06", "karaelmas-07", "karaelmas-08", "karaelmas-09", "karaelmas-10", "karaelmas-11", "karaelmas-12", "karaelmas-13", "karaelmas-14", "karaelmas-15"],
    galleryCredit: "Karaelmas Ekspresi yolculuğundan kareler · 📸 @cookgezer",
    summary: "Ankara Garı’ndan trenle yola çıkıp ilk geceyi yataklı vagonda geçiriyoruz; Yenice Ormanları, Zonguldak ve Safranbolu’yu keşfediyoruz.",
    recurring: "Perşembe günleri hareketli",
    weekly: { dow: [4], days: 3, until: "2026-11-26" },
    departure: "Ankara Garı · 23.00",
    route: ["Ankara Garı", "Karabük – Yenice", "Ihlamur Teras", "Zonguldak", "Safranbolu"],
    program: [
      { day: "1. gece", title: "Ankara Garı’ndan hareket", text: "23.00’te Ankara Garı’ndan hareket; ilk gece iki kişilik yataklı kompartımanlarda trende konaklama." },
      { day: "2. gün", title: "Yenice Ormanları ve Zonguldak", text: "Sabah Karabük’e varış, Yenice Ormanları’na bakan Ihlamur Teras’ta kahvaltı; ardından Zonguldak gezisi ve otelde konaklama." },
      { day: "3. gün", title: "Safranbolu ve dönüş", text: "Tarihi Safranbolu evleri ve çarşısında gezi, ardından Ankara’ya dönüş." }
    ],
    highlights: [
      "Yaklaşık 120 kişilik tren; iki kişilik kompartımanlarda altlı üstlü yatak",
      "Odalarda temiz çarşaf, yastık, battaniye, lavabo, buzdolabı ve valiz alanı",
      "Yemekli vagonda menüden yiyecek–içecek satın alınabilir"
    ],
    notes: ["Program akışı örnektir; sefer günleri TCDD takvimine bağlıdır. Rezervasyonda teyit edin."],
    ig: "https://www.instagram.com/p/DdXHXiwoZp_/"
  },
  {
    id: "dogu-ekspresi",
    title: "Turistik Doğu Ekspresi ile Kars – Erzurum",
    subtitle: "Türkiye’nin en masalsı tren yolculuğu",
    tags: ["tren", "konaklamali"],
    duration: "Tren + uçak",
    price: 30500,
    priceNote: "paket tur, kişi başı",
    badge: "Biletler hızla tükeniyor",
    cover: "assets/img/covers/dogu-ekspresi.webp",
    posters: ["dogu-ekspresi", "dogu-ekspresi-2"],
    summary: "Karlı ovalardan geçen Turistik Doğu Ekspresi, Ani Harabeleri, Çıldır Gölü’nde atlı kızak ve Erzurum. 2026–2027 sezonu 21 Aralık’ta başlıyor.",
    recurring: "21 Aralık 2026 – 12 Mart 2027 · Ankara kalkışlı",
    variants: [
      { name: "Paket tur · tren gidiş – uçak dönüş", price: 30500 },
      { name: "Paket tur · uçak gidiş – tren dönüş", price: 30500 }
    ],
    route: ["Ankara", "Erzincan", "Erzurum", "Kars", "Ani Harabeleri", "Çıldır Gölü"],
    program: [
      { day: "Ankara → Kars", title: "Pazartesi • Çarşamba • Cuma, 13.55", text: "21 Aralık 2026 – 10 Mart 2027. Yaklaşık 32 saat; Erzincan (2,5 saat) ve Erzurum (3,5 saat) keşif molaları." },
      { day: "Kars → Ankara", title: "Çarşamba • Cuma • Pazar, 21.05", text: "23 Aralık 2026 – 12 Mart 2027. Yaklaşık 34 saat 20 dakika; İliç, Divriği ve Sivas molaları." }
    ],
    highlights: [
      "Yataklı vagonda iki kişilik oda: yatak olabilen koltuklar, lavabo, priz, mini buzdolabı, ısıtma",
      "Yemekli vagonda kahvaltı, öğle ve akşam menüleri",
      "Ani Harabeleri, Çıldır Gölü’nde atlı kızak ve Erzurum’un tarihi dokusu",
      "TCDD oda fiyatları (iki kişilik): Ankara→Kars 16.500 / 20.000 TL, Kars→Ankara 15.000 / 18.000 TL (düşük / yüksek dönem)"
    ],
    notes: ["Tren oda fiyatları TCDD 2026–2027 sezon tablosuna göredir; satış açıldığında müsaitlik teyit edilir."],
    ig: "https://www.instagram.com/p/DeD-H_socWo/"
  },

  /* ============================ YURT DIŞI ============================ */
  {
    id: "batum-yilbasi",
    title: "Yılbaşı Özel Batum Turu",
    subtitle: "Yeni yıla Batum’un ışıklarıyla merhaba",
    tags: ["yurtdisi", "konaklamali"],
    duration: "2 Gece 3 Gün",
    price: 9490,
    priceNote: "otobüslü, kişi başı",
    badge: "Yılbaşı özel",
    cover: "assets/img/covers/batum-yilbasi.webp",
    posters: ["batum-yilbasi"],
    summary: "31 Aralık – 2 Ocak, otobüslü program. Avrupa Meydanı ve Piazza Meydanı’na yürüme mesafesinde otellerde konaklama.",
    dates: [{ d: "2026-12-31", days: 3, note: "31 Aralık – 2 Ocak" }],
    variants: [
      { name: "Old Garden Hotel", price: 9490 },
      { name: "Old Batumi Hotel", price: 9990 }
    ],
    route: ["Ankara", "Batum", "Avrupa Meydanı", "Piazza Meydanı"],
    notes: ["Gürcistan’a geçiş için geçerli pasaport ya da yeni tip (çipli) kimlik kartı gerekir."],
    ig: "https://www.instagram.com/p/DeWWdNuo1dx/"
  },
  {
    id: "buyuk-balkan",
    title: "Büyük Balkan Turu",
    subtitle: "Vizesiz 6 ülke, uçaklı",
    tags: ["yurtdisi", "konaklamali"],
    duration: "6 Gece 7 Gün",
    price: 699,
    currency: "€",
    priceNote: "uçaklı, kişi başı",
    badge: "Vizesiz 6 ülke",
    cover: "assets/img/covers/balkan.webp",
    posters: ["balkan"],
    summary: "Sırbistan, Bosna Hersek, Karadağ, Arnavutluk, Kosova ve Makedonya. Ankara’dan Air Serbia ile uçaklı, 4★ otellerde konaklamalı.",
    recurring: "Nisan – Eylül ve Kasım dönemlerinde",
    route: ["Sırbistan", "Bosna Hersek", "Karadağ", "Arnavutluk", "Kosova", "Makedonya"],
    includes: ["Ankara – Air Serbia uçuşları", "4★ otellerde 6 gece konaklama", "6 sabah kahvaltısı", "4 akşam yemeği (Makedonya gecesi ve Boşnak köftesi dahil)"],
    notes: ["Kasım dönemi tarihleri ve güncel kur için ekibimize danışın."],
    ig: "https://www.instagram.com/p/DbH7qLto2bl/"
  },

  /* ============================ YAZ TATİLİ ============================ */
  {
    id: "bodrum-tatili",
    title: "Bodrum Tatili",
    subtitle: "Beach club, night club ve tekne turu",
    tags: ["yaz", "konaklamali", "ozel29"],
    duration: "3 Gece 4 Gün",
    price: 13990,
    priceNote: "29 Ekim özel 3 gece 4 gün",
    badge: "Her şey dahil",
    cover: "assets/img/covers/bodrum.webp",
    posters: ["yaz-02", "yaz-07", "yaz-08", "yaz-09", "yaz-10", "yaz-11", "yaz-12", "29-ekim"],
    summary: "Her şey dahil, denize sıfır otellerde Bodrum. Ankara’dan gidiş–dönüş ulaşım ile tatil boyunca beach club ve night club giriş–ulaşım ücretleri dahil.",
    recurring: "Yaz sezonu: her Çarşamba (3 gece) ve her Cumartesi (4 gece) garantili çıkış",
    dates: [{ d: "2026-10-29", days: 4, note: "29 Ekim – 1 Kasım" }],
    variantsTitle: "Yaz sezonu otel seçenekleri (3 gece / 4 gece)",
    variants: [
      { name: "Salinas Beach Hotel ★★★", price: 9490, price2: 11490 },
      { name: "Greenport Bodrum Hotel ★★★★", price: 10490, price2: 12990 },
      { name: "Ladonia Hotels Mio Bianco Resort ★★★★", price: 10490, price2: 12990 },
      { name: "Golden Beach Resort & Spa ★★★★", price: 10990, price2: 12990 },
      { name: "Leo Beach Resort Hotel ★★★★", price: 10990, price2: 12990 },
      { name: "Arcadia Of Bodrum Hotel Bitez ★★★★", price: 12490, price2: 15990 }
    ],
    highlights: [
      "Beach party, night club ve tekne turu",
      "3–4–7 gece konaklama seçeneği, her hafta garantili çıkış",
      "Diğer oteller: Phoenix Sun, Smart Holiday, Paloma Family, Söz, Blue Nuit, Diamond Of Bodrum"
    ],
    includes: ["Ankara’dan gidiş–dönüş ulaşım", "Her şey dahil konsept konaklama", "Tatil boyunca beach club & night club giriş ve ulaşım ücretleri"],
    notes: ["Otel fiyatları 2026 yaz sezonu ilanındandır; yeni sezon fiyatları için ekibimize danışın."],
    ig: "https://www.instagram.com/p/DZ4O0c1CNDF/"
  },
  {
    id: "adrasan-tatili",
    title: "Adrasan Tatili",
    subtitle: "Sakinlik, doğa ve turkuaz deniz",
    tags: ["yaz", "konaklamali", "ozel29"],
    duration: "3 Gece 4 Gün",
    price: 10990,
    priceNote: "3 gece 4 gün, kişi başı",
    cover: "assets/img/covers/adrasan.webp",
    posters: ["yaz-05", "29-ekim"],
    summary: "Buhana Otel’de yarım pansiyon (kahvaltı ve akşam yemeği) konaklama ile Adrasan koyları.",
    recurring: "Yaz sezonu: her Çarşamba (3 gece) ve her Cumartesi (4 gece) garantili çıkış",
    dates: [{ d: "2026-10-29", days: 4, note: "29 Ekim – 1 Kasım" }],
    variants: [
      { name: "3 Gece 4 Gün · her Çarşamba", price: 10990 },
      { name: "4 Gece 5 Gün · her Cumartesi", price: 13990 }
    ],
    highlights: ["Aktivite seçenekleri: Suluada tekne turu, mehtap turu, Yanartaş turu, Kemer gece kulüpleri, su sporları", "3–4–7 gece konaklama seçeneği"],
    includes: ["Buhana Otel’de konaklama", "Yarım pansiyon: kahvaltı ve akşam yemeği"],
    ig: "https://www.instagram.com/p/DZNuA1rIMTq/"
  },
  {
    id: "fethiye-likya",
    title: "Fethiye Likya Turu",
    subtitle: "Kaş, Kalkan, Olympos ve iki tekne turu",
    tags: ["yaz", "konaklamali"],
    duration: "4 Gece 5 Gün",
    price: 17490,
    priceNote: "4 gece 5 gün, kişi başı",
    badge: "İki tekne turu dahil",
    cover: "assets/img/covers/likya.webp",
    posters: ["likya"],
    summary: "Ölüdeniz, Saklıkent, Kaputaş, Kaş, Kalkan, Patara, Olympos ve Adrasan; öğle yemekli 12 Adalar ve Suluada tekne turları dahil.",
    recurring: "Yaz sezonu her hafta kesin hareket",
    route: ["Ölüdeniz", "Belcekız Plajı", "Tlos Antik Kenti", "Yaka Park", "Saklıkent Kanyonu", "Kaputaş Plajı", "Kaş", "Kalkan", "Patara Plajı", "Olympos Antik Kenti", "Adrasan", "Göynük Kanyonu", "Düden Şelalesi", "Fethiye 12 Adalar", "Suluada"],
    includes: [
      "Turizm belgeli araçlarla ulaşım",
      "İlk gün araç içi ikram paketi",
      "4 gece otel konaklaması, 4 kahvaltı + 4 akşam yemeği",
      "Tam gün öğle yemekli 12 Adalar tekne turu",
      "Tam gün öğle yemekli Suluada tekne turu",
      "Profesyonel rehberlik ve seyahat sigortası"
    ],
    notes: ["Fiyatlar iki kişilik odada kişi başı konaklama esasına göredir; kapora ile rezervasyon yapılabilir.", "Fiyat 2026 yaz sezonu ilanındandır."],
    ig: "https://www.instagram.com/p/DanILPAIx_W/"
  },
  {
    id: "fethiye-tatili",
    title: "Aktiviteli Fethiye Tatili",
    subtitle: "Ölüdeniz, jeep safari ve tekne turu",
    tags: ["yaz", "konaklamali"],
    duration: "4 Gece 5 Gün",
    price: 16490,
    priceNote: "4 gece 5 gün, kişi başı",
    badge: "Erken al az öde",
    cover: "assets/img/covers/fethiye.webp",
    posters: ["yaz-03", "yaz-tatili"],
    summary: "Casa De Levissi Hotel’de yarım pansiyon konaklama; isteğe göre jeep safari, Ölüdeniz tekne turu, dalış ve yamaç paraşütü paketleri.",
    recurring: "Yaz sezonu: her Cumartesi hareket",
    variantsTitle: "Aktivite paketleri (tatil fiyatına ek)",
    variants: [
      { name: "Eko paket — öğle yemekli jeep safari + Ölüdeniz tekne turu", price: 3200, addon: true },
      { name: "Standart paket — Eko + dalış", price: 5500, addon: true },
      { name: "Extreme paket — Standart + yamaç paraşütü", price: 11500, addon: true }
    ],
    includes: ["Casa De Levissi Hotel’de konaklama", "Yarım pansiyon (kahvaltı ve akşam yemeği)"],
    notes: ["Fiyatlar 2026 yaz sezonu ilanındandır; yeni sezon için ön bilgi alabilirsiniz."],
    ig: "https://www.instagram.com/p/DZ4O0c1CNDF/"
  },
  {
    id: "olympos-tatili",
    title: "Olympos Tatili",
    subtitle: "Doğa, deniz ve eğlence bir arada",
    tags: ["yaz", "konaklamali"],
    duration: "3 Gece 4 Gün",
    price: 9490,
    priceNote: "3 gece 4 gün, kişi başı",
    cover: "assets/img/covers/olympos.webp",
    posters: ["yaz-04"],
    summary: "Denize yürüme mesafesinde bungalov konaklama, yarım pansiyon (kahvaltı ve akşam yemeği).",
    recurring: "Yaz sezonu: her Çarşamba (3 gece) ve her Cumartesi (4 gece) garantili çıkış",
    variants: [
      { name: "3 Gece 4 Gün · her Çarşamba", price: 9490 },
      { name: "4 Gece 5 Gün · her Cumartesi", price: 12490 }
    ],
    includes: ["Bungalov konaklama", "Yarım pansiyon: kahvaltı ve akşam yemeği"],
    notes: ["Fiyatlar 2026 yaz sezonu ilanındandır."],
    ig: "https://www.instagram.com/p/DZ4O0c1CNDF/"
  },
  {
    id: "marmaris-datca",
    title: "Marmaris • Datça • Dalyan • Gökova • Akyaka",
    subtitle: "Tekne turlarıyla Muğla kıyıları",
    tags: ["yaz", "konaklamali"],
    duration: "4 Gece 5 Gün",
    price: 17490,
    priceNote: "4 gece 5 gün, kişi başı",
    badge: "Erken al az öde",
    cover: "assets/img/covers/marmaris.webp",
    posters: ["yaz-06"],
    summary: "Marmaris, Datça, Can Yücel Evi, Akyaka, Gökova ve Azmak Çayı. Üç tekne turu fiyata dahil.",
    recurring: "Yaz sezonu: her Cumartesi hareket",
    route: ["Marmaris", "Datça", "Can Yücel Evi", "Akyaka", "Gökova", "Azmak Çayı", "Dalyan"],
    includes: ["Öğle yemekli Gökova tekne turu", "Azmak Nehri tekne turu", "Dalyan tekne turu"],
    notes: ["Fiyatlar 2026 yaz sezonu ilanındandır."],
    ig: "https://www.instagram.com/p/DZ4O0c1CNDF/"
  },
  {
    id: "kemer-tatili",
    title: "Kemer Tatili",
    subtitle: "Denize sıfır, her şey dahil",
    tags: ["yaz", "konaklamali"],
    duration: "3 Gece 4 Gün",
    price: 10990,
    priceNote: "3 gece 4 gün, kişi başı",
    badge: "Her şey dahil",
    cover: "assets/img/covers/kemer.webp",
    posters: ["yaz-13", "yaz-14", "yaz-15"],
    summary: "Ankara’dan gidiş ve dönüş ulaşımı dahil, denize sıfır otellerde her şey dahil Kemer tatili.",
    recurring: "Yaz sezonu: her Çarşamba (3 gece) ve her Cumartesi (4 gece)",
    variantsTitle: "Otel seçenekleri (3 gece / 4 gece)",
    variants: [
      { name: "Club Hotel Sunbel ★★★★", price: 10990, price2: 14990 },
      { name: "Onkel Hotel Beldibi ★★★★", price: 13990, price2: 16990 },
      { name: "Rox Resort Hotel ★★★★★", price: 15990, price2: 20990 }
    ],
    includes: ["Ankara’dan gidiş ve dönüş ulaşımı", "Her şey dahil konsept konaklama"],
    notes: ["Fiyatlar 2026 yaz sezonu ilanındandır."],
    ig: "https://www.instagram.com/p/DZ4O0c1CNDF/"
  },

  /* ============================ GÜNÜBİRLİK ============================ */
  {
    id: "beypazari-abant-golcuk",
    title: "Beypazarı • Abant • Gölcük",
    subtitle: "Tarih, doğa ve huzur aynı rotada",
    tags: ["gunubirlik", "ozel29"],
    duration: "Günübirlik",
    price: 1990,
    priceNote: "kişi başı, başlayan fiyatlarla",
    badge: "Araçta kahvaltı dahil",
    cover: "assets/img/covers/beypazari.webp",
    tile: "assets/img/tiles/beypazari.webp",
    posters: ["beypazari", "d-beypazari", "29ekim-02"],
    summary: "Beypazarı’nın tarihi sokaklarından Abant’ın huzuruna, Gölcük’ün kartpostallık manzaralarına uzanan bir gün.",
    recurring: "Her Çarşamba, Cumartesi ve Pazar",
    dates: dayDates(["2026-10-24", "2026-11-07"]),
    weekly: HAFTALIK_GUNUBIRLIK,
    departure: "Sabah 07:00 Kızılay · dönüş 21:00–21:30",
    useSiteDepartures: true,
    route: ["Beypazarı", "Tarihi konaklar", "Geleneksel çarşılar", "Nallıhan Kuş Cenneti", "Abant Gölü", "Abant Tabiat Müzesi", "Gölcük Gölü"],
    program: [
      { day: "Sabah", title: "Beypazarı", text: "Tarihi konaklar ve çarşılarda yöresel ürünleri keşfediyoruz; Nallıhan Kuş Cenneti’ni panoramik görüyoruz." },
      { day: "Öğle", title: "Abant Gölü Milli Parkı", text: "Göl çevresinde yürüyüş ve serbest zaman, Abant Tabiat Müzesi." },
      { day: "Akşamüstü", title: "Gölcük Gölü", text: "Çam ormanlarıyla çevrili Gölcük’te günü tamamlıyoruz. Ankara’ya tahmini varış 21:00–21:30." }
    ],
    includes: [
      "Lüks turizm araçlarıyla ulaşım",
      "Araç içi kahvaltı: sıcak simit, poğaça ve demleme çay",
      "Milli park giriş ücretleri",
      "Otopark ücretleri",
      "Profesyonel rehberlik",
      "Seyahat sağlık sigortası",
      "Çevre gezileri ve acente refakati"
    ],
    excludes: ["Öğle yemeği", "Kişisel harcamalar", "Abant’ta isteğe bağlı aktiviteler"],
    ig: "https://www.instagram.com/p/DeG74ISobAa/"
  },
  {
    id: "yedigoller",
    title: "Yedigöller",
    subtitle: "Sonbaharın en renkli rotası",
    tags: ["gunubirlik", "ozel29"],
    duration: "Günübirlik",
    price: 1990,
    priceNote: "kişi başı",
    badge: "Milli park girişi dahil",
    tile: "assets/img/tiles/yedigoller.webp",
    posters: ["yedigoller", "d-yedigoller", "29ekim-02"],
    summary: "Yedi göl, Kapankaya Seyir Tepesi, Dilek Çeşmesi ve orman yürüyüşleriyle Yedigöller Milli Parkı’nda bir gün.",
    recurring: "Sezon boyunca her Çarşamba, Cumartesi ve Pazar",
    dates: dayDates(),
    weekly: HAFTALIK_GUNUBIRLIK,
    useSiteDepartures: true,
    route: ["İncegöl", "Sazlıgöl", "Kurugöl", "Nazlıgöl", "Büyükgöl", "Seringöl", "Deringöl", "Kapankaya Seyir Tepesi", "Dilek Çeşmesi", "Eski Geyik Üretme Çiftliği"],
    includes: [
      "Turizm paketli lüks araçlarla ulaşım",
      "Araç içi kahvaltı: sıcak simit, poğaça ve demleme çay",
      "Yedigöller Milli Parkı giriş ücretleri",
      "Otopark ücretleri ve çevre gezileri",
      "Profesyonel turist rehberliği",
      "Seyahat sağlık sigortası, acente refakati"
    ],
    excludes: ["Öğle yemeği", "Kişisel harcamalar"],
    ig: "https://www.instagram.com/p/Dd1Na_Aoy5K/"
  },
  {
    id: "amasra",
    title: "Amasra",
    subtitle: "Karadeniz’in incisi",
    tags: ["gunubirlik", "ozel29"],
    duration: "Günübirlik",
    price: 1990,
    priceNote: "kişi başı",
    badge: "Araçta kahvaltı dahil",
    tile: "assets/img/tiles/amasra.webp",
    posters: ["d-amasra", "amasra", "29ekim-02"],
    summary: "Amasra Kalesi, kale içi evleri, Bakacak Tepesi, Çekiciler Çarşısı ve sahil; dileyenlere yüzme molası.",
    recurring: "Her Çarşamba, Cumartesi ve Pazar · Ankara’ya dönüş 22:30",
    dates: dayDates(),
    weekly: HAFTALIK_GUNUBIRLIK,
    useSiteDepartures: true,
    route: ["Kuş Kayası Yol Anıtı", "Bakacak Tepesi", "Amasra Kalesi", "Boztepe", "Kale içi evleri", "Fatih Camii", "Küçük Kilise", "Çekiciler Çarşısı", "Büyük & Küçük Liman"],
    includes: ["Araç içi sabah kahvaltısı", "Lüks araçlarla ulaşım", "Seyahat sağlık sigortası", "Profesyonel turist rehberliği", "Araç içi ikramlar, çevre gezileri", "Acente refakati"],
    excludes: ["Öğle yemeği", "Müze, ören yeri ve plaj giriş ücretleri", "Kişisel harcamalar"],
    ig: "https://www.instagram.com/p/DZKv8IjIncF/"
  },
  { id: "balon-kapadokya", title: "Balon Seyirli Kapadokya", subtitle: "Gün doğumunda balon şöleni", tags: ["gunubirlik", "ozel29"], duration: "Günübirlik", price: 2490, tile: "assets/img/tiles/balon-kapadokya.webp", posters: ["d-balon", "balon-foto-1", "balon-foto-2", "29ekim-02"], summary: "Gün doğumunda Kapadokya semalarındaki balonları izleyip vadileri geziyoruz. Konaklamalı seçeneği de mevcut.", recurring: "Her Çarşamba, Cumartesi ve Pazar", dates: dayDates(), weekly: HAFTALIK_GUNUBIRLIK, route: ["Kapadokya", "Balon seyri", "Vadiler"], includes: GUNUBIRLIK_INC, excludes: GUNUBIRLIK_EXC, ig: "https://www.instagram.com/p/DZHgntQCPtW/" },
  { id: "frigya-sivrihisar", title: "Frigya • Sivrihisar • Gönül Dağı • Frig Vadisi", subtitle: "Anadolu’nun kadim uygarlığı", tags: ["gunubirlik", "ozel29"], duration: "Günübirlik", price: 2290, tile: "assets/img/tiles/frigya.webp", posters: ["d-frigya", "29ekim-02"], summary: "Sivrihisar, Gönül Dağı ve Afyon Frig Vadisi’nin kaya anıtları.", recurring: "Her Çarşamba, Cumartesi ve Pazar", dates: dayDates(), weekly: HAFTALIK_GUNUBIRLIK, route: ["Sivrihisar", "Gönül Dağı", "Afyon Frig Vadisi"], includes: GUNUBIRLIK_INC, excludes: GUNUBIRLIK_EXC, ig: "https://www.instagram.com/p/DaGRZ2eCNGj/" },
  { id: "duzce-selaleleri", title: "Düzce Şelaleleri", subtitle: "Şelaleler ve doğa yürüyüşü", tags: ["gunubirlik", "ozel29"], duration: "Günübirlik", price: 2290, tile: "assets/img/tiles/duzce.webp", posters: ["d-duzce", "29ekim-02"], summary: "Düzce’nin şelaleleri ve ahşap yürüyüş yollarıyla dolu bir gün.", recurring: "Her Çarşamba, Cumartesi ve Pazar", dates: dayDates(), weekly: HAFTALIK_GUNUBIRLIK, route: ["Düzce", "Şelaleler"], includes: GUNUBIRLIK_INC, excludes: GUNUBIRLIK_EXC, ig: "https://www.instagram.com/p/DaGRZ2eCNGj/" },
  { id: "kure-ilica", title: "Küre Dağları • Ilıca Şelalesi • Kanyonlar", subtitle: "Kanyon ve şelale yürüyüşü", tags: ["gunubirlik", "ozel29"], duration: "Günübirlik", price: 1990, tile: "assets/img/tiles/kure-ilica.webp", posters: ["d-kure", "29ekim-02"], summary: "Küre Dağları Milli Parkı, Ilıca Şelalesi ve kanyonlarda ahşap yürüyüş yolları.", recurring: "Her Çarşamba, Cumartesi ve Pazar", dates: dayDates(), weekly: HAFTALIK_GUNUBIRLIK, route: ["Küre Dağları", "Ilıca Şelalesi", "Kanyonlar"], includes: GUNUBIRLIK_INC, excludes: GUNUBIRLIK_EXC, ig: "https://www.instagram.com/p/DaGRZ2eCNGj/" },
  { id: "kapadokya-gunubirlik", title: "Kapadokya", subtitle: "Peri bacaları ve vadiler", tags: ["gunubirlik", "ozel29"], duration: "Günübirlik", price: 1990, tile: "assets/img/tiles/kapadokya.webp", posters: ["d-kapadokya", "29ekim-02"], summary: "Kapadokya’nın vadileri, peri bacaları ve panoramik noktaları.", recurring: "Her Çarşamba, Cumartesi ve Pazar", dates: dayDates(), weekly: HAFTALIK_GUNUBIRLIK, route: ["Kapadokya", "Vadiler", "Peri bacaları"], includes: GUNUBIRLIK_INC, excludes: GUNUBIRLIK_EXC, ig: "https://www.instagram.com/p/DaGRZ2eCNGj/" },
  { id: "sapanca-masukiye", title: "Ormanya • Maşukiye • Sapanca", subtitle: "Göl, orman ve doğal yaşam parkı", tags: ["gunubirlik", "ozel29"], duration: "Günübirlik", price: 1990, tile: "assets/img/tiles/sapanca.webp", posters: ["d-sapanca", "29ekim-02"], summary: "Ormanya doğal yaşam parkı, Maşukiye ve Sapanca Gölü kıyısı.", recurring: "Her Çarşamba, Cumartesi ve Pazar", dates: dayDates(), weekly: HAFTALIK_GUNUBIRLIK, route: ["Ormanya", "Maşukiye", "Sapanca"], includes: GUNUBIRLIK_INC, excludes: GUNUBIRLIK_EXC, ig: "https://www.instagram.com/p/DaGRZ2eCNGj/" },
  { id: "eskisehir", title: "Eskişehir", subtitle: "Odunpazarı ve Porsuk kıyısı", tags: ["gunubirlik", "ozel29"], duration: "Günübirlik", price: 1990, tile: "assets/img/tiles/eskisehir.webp", posters: ["d-eskisehir", "29ekim-02"], summary: "Odunpazarı evleri, Sazova Parkı ve Porsuk Çayı kıyısında bir gün.", recurring: "Her Çarşamba, Cumartesi ve Pazar", dates: dayDates(), weekly: HAFTALIK_GUNUBIRLIK, route: ["Eskişehir", "Odunpazarı", "Sazova Parkı"], includes: GUNUBIRLIK_INC, excludes: GUNUBIRLIK_EXC, ig: "https://www.instagram.com/p/DaGRZ2eCNGj/" },
  { id: "safranbolu", title: "Safranbolu", subtitle: "UNESCO mirası konaklar", tags: ["gunubirlik", "ozel29"], duration: "Günübirlik", price: 1990, tile: "assets/img/tiles/safranbolu.webp", posters: ["d-safranbolu", "29ekim-02"], summary: "Tarihi Safranbolu evleri, Cinci Hanı ve çarşıda serbest zaman.", recurring: "Her Çarşamba, Cumartesi ve Pazar", dates: dayDates(), weekly: HAFTALIK_GUNUBIRLIK, route: ["Safranbolu", "Tarihi çarşı", "Safranbolu evleri"], includes: GUNUBIRLIK_INC, excludes: GUNUBIRLIK_EXC, ig: "https://www.instagram.com/p/DaGRZ2eCNGj/" },
  { id: "konya-mevlana", title: "Konya • Kelebekler Vadisi • Mevlana • Sille", subtitle: "Mevlana’nın şehrinde bir gün", tags: ["gunubirlik", "ozel29"], duration: "Günübirlik", price: 1990, tile: "assets/img/tiles/konya.webp", posters: ["29ekim-02"], summary: "Mevlana Müzesi, Kelebekler Vadisi ve tarihi Sille Köyü.", dates: dayDates(), route: ["Konya", "Mevlana Müzesi", "Kelebekler Vadisi", "Sille Köyü"], includes: GUNUBIRLIK_INC, excludes: GUNUBIRLIK_EXC, ig: "https://www.instagram.com/p/DeHm-ADiE0y/" }
];

/* Güncel tur hikayeleri — afiş görselleri, tıklanınca tam ekran hikaye olarak açılır */
window.STORIES = [
  { id: "bu-hafta", title: "Bu hafta", frames: ["posters/bulten", "posters/fiyat-artisi"], caption: "14 – 21 Ekim haftalık tur bülteni" },
  { id: "29-ekim", title: "29 Ekim", frames: ["posters/29-ekim", "posters/29ekim-02"], caption: "29 Ekim haftası konaklamalı ve günübirlik turlar", filter: "ozel29" },
  { id: "yilbasi", title: "Yılbaşı Batum", frames: ["posters/batum-yilbasi"], tour: "batum-yilbasi" },
  { id: "dogu", title: "Doğu Ekspresi", frames: ["posters/dogu-ekspresi", "posters/dogu-ekspresi-2"], tour: "dogu-ekspresi" },
  { id: "karaelmas", title: "Karaelmas", frames: ["posters/karaelmas-bk", "posters/karaelmas", "gallery/karaelmas-02", "gallery/karaelmas-03", "gallery/karaelmas-04", "gallery/karaelmas-06", "gallery/karaelmas-07", "gallery/karaelmas-08", "gallery/karaelmas-09", "gallery/karaelmas-10", "gallery/karaelmas-11", "gallery/karaelmas-12", "gallery/karaelmas-13", "gallery/karaelmas-14", "gallery/karaelmas-15"], tour: "karaelmas-ekspresi", caption: "📸 @cookgezer" },
  { id: "gunubirlik", title: "Günübirlik", frames: ["posters/gunubirlik-turlar", "posters/d-balon", "posters/d-frigya", "posters/d-duzce", "posters/d-amasra", "posters/d-kure", "posters/d-sapanca", "posters/d-beypazari", "posters/d-eskisehir", "posters/d-kapadokya", "posters/d-safranbolu", "posters/d-yedigoller"], caption: "Her Çarşamba, Cumartesi ve Pazar", filter: "gunubirlik" },
  { id: "kultur", title: "Kültür turları", frames: ["posters/kultur-turlari", "posters/ege-butik", "posters/gap-kultur", "posters/istanbul-sile", "posters/karadeniz-kultur", "posters/canakkale-kultur", "posters/kapadokya-ihlara", "posters/istanbul-adalar", "posters/sinop", "posters/bursa"], caption: "Konaklamalı yurt içi kültür turları", filter: "konaklamali" },
  { id: "gap", title: "GAP", frames: ["posters/gap-3g", "posters/gap-4g", "posters/gap"], tour: "guneydogu-anadolu" },
  { id: "karadeniz", title: "Karadeniz", frames: ["posters/karadeniz-3g", "posters/karadeniz-4g", "posters/karadeniz-video"], tour: "dogu-karadeniz-batum" },
  { id: "balkan", title: "Balkanlar", frames: ["posters/balkan"], tour: "buyuk-balkan" },
  { id: "yaz", title: "Yaz tatili", frames: ["posters/yaz-tatili", "posters/likya", "posters/yaz-02", "posters/yaz-03", "posters/yaz-04", "posters/yaz-05", "posters/yaz-06", "posters/yaz-07", "posters/yaz-08", "posters/yaz-09", "posters/yaz-10", "posters/yaz-11", "posters/yaz-12", "posters/yaz-13", "posters/yaz-14", "posters/yaz-15"], caption: "Yaz 2026 tatil turları", filter: "yaz" }
];

/* Instagram'dan son paylaşımlar */
window.IG_POSTS = [
  { img: "fiyat-artisi", url: "https://www.instagram.com/p/DegV6iwIvNG/", date: "2026-10-14", title: "Fiyat artışı öncesi son günler" },
  { img: "canakkale", url: "https://www.instagram.com/p/DeeK9QLIbp2/", date: "2026-10-14", title: "Çanakkale, Bozcaada, Assos ve Cunda" },
  { img: "bulten", url: "https://www.instagram.com/p/DeY4BKyIaON/", date: "2026-10-12", title: "14 – 21 Ekim haftalık tur bülteni" },
  { img: "dogu-ekspresi", url: "https://www.instagram.com/p/DeWXm0noctN/", date: "2026-10-11", title: "Turistik Doğu Ekspresi ile Kars – Erzurum" },
  { img: "batum-yilbasi", url: "https://www.instagram.com/p/DeWWdNuo1dx/", date: "2026-10-11", title: "Yılbaşında Batum’da yeni yıla merhaba" },
  { img: "karaelmas", url: "https://www.instagram.com/p/DeTlC5ziPfE/", date: "2026-10-10", title: "Turistik Karaelmas Ekspresi" },
  { img: "29-ekim", url: "https://www.instagram.com/p/DeHm-ADiE0y/", date: "2026-10-05", title: "29 Ekim haftası özel turlar" },
  { img: "beypazari", url: "https://www.instagram.com/p/DeG74ISobAa/", date: "2026-10-05", title: "Günübirlik Beypazarı • Abant • Gölcük" },
  { img: "yedigoller", url: "https://www.instagram.com/p/Dd1Na_Aoy5K/", date: "2026-09-28", title: "Günübirlik Yedigöller turu" },
  { img: "karaelmas-bk", url: "https://www.instagram.com/p/DdXHXiwoZp_/", date: "2026-09-16", title: "Karaelmas Ekspresi ile Batı Karadeniz" },
  { img: "likya", url: "https://www.instagram.com/p/DanILPAIx_W/", date: "2026-07-10", title: "Fethiye Likya turu" },
  { img: "balkan", url: "https://www.instagram.com/p/DbH7qLto2bl/", date: "2026-07-23", title: "Büyük Balkan turu" }
];

/* Sık sorulan sorular */
window.FAQ = [
  { q: "Nasıl rezervasyon yaptırırım?", a: "Turun kartındaki “Rezervasyon yap” düğmesiyle tarih ve kişi sayısını seçin; hazır mesaj WhatsApp’ta açılır, ekibimiz kontenjanı teyit eder. Dilerseniz doğrudan 0 (500) 000 00 00’ü arayabilirsiniz." },
  { q: "Ödeme seçenekleri neler?", a: "Tüm kredi kartlarına vade farksız 3 taksit imkânı vardır, nakit ödemelerde %5 indirim uygulanır. Kapora / ön ödeme ile yerinizi ayırtıp kalanını tur günü tamamlayabilirsiniz." },
  { q: "Günübirlik turlar hangi günler?", a: "Günübirlik turlarımız sezon boyunca her Çarşamba, Cumartesi ve Pazar hareket eder; bayram ve tatil haftalarında ek çıkışlar yapılır." },
  { q: "Turlar nereden hareket ediyor?", a: "Günübirlik turlarda hareket noktaları: 07:00 Kızılay Gama İş Merkezi, 07:15 Milli Kütüphane, 07:20 Armada AVM – Çapa Heykeli, 07:30 Optimum AVM karşısı. Saatler tura göre değişebilir; rezervasyonda size bildirilir." },
  { q: "Fiyata neler dahil?", a: "Her turun detay penceresinde “Fiyata dahil / Dahil değil” listesi bulunur. Turlarımızda genellikle ulaşım, profesyonel rehberlik, seyahat sağlık sigortası ve acente refakati yer alır." },
  { q: "Çocuk fiyatı var mı?", a: "Çocuk ve grup fiyatları tura ve otele göre değişir. Rezervasyon formunda çocuk sayısını belirtin, size özel fiyat iletelim." },
  { q: "Acenteniz belgeli mi?", a: "Evet. TÜRSAB belge numaramız A-11959’dur; TÜRSAB’ın belge sorgulama sayfasından doğrulayabilirsiniz." }
];
