export type BrewingMethod = {
  slug: string;
  name: string;
  short: string;
  title: string;
  description: string;
  duration: string;
  grind: string;
  ratio: string;
  difficulty: string;
  temperature: string;
  coffee: string;
  water: string;
  character: string;
  color: string;
  steps: string[];
  equipment: string[];
  notes: string[];
  errors: [string, string, string][];
};

export const DEMLEME_YONTEMLERI: BrewingMethod[] = [
  {
    slug: "espresso",
    name: "Espresso",
    short: "Yoğun, güçlü ve karakterli.",
    title: "Espresso Sanatı",
    description: "Yoğun aromalar, güçlü gövde ve kusursuz krema için espresso demleme rehberi.",
    duration: "25–30 sn",
    grind: "İnce",
    ratio: "1:2",
    difficulty: "İleri",
    temperature: "92–94°C",
    coffee: "18 g",
    water: "36 g çıktı",
    character: "Güçlü · Dramatik",
    color: "#5b2d20",
    steps: [
      "Kahveyi 18 g tartın ve ince öğütün.",
      "Portafiltreye dağıtın ve düz bir yüzey oluşturun.",
      "Tamper ile eşit basınç uygulayın.",
      "Portafiltreyi makineye takıp shot’ı başlatın.",
      "25–30 saniyede yaklaşık 36 g çıktıya ulaşın.",
    ],
    equipment: ["Espresso makinesi", "Kahve değirmeni", "Portafiltre", "Tamper", "Hassas tartı"],
    notes: ["Bitter çikolata", "Karamel", "Fındık", "Esmer şeker"],
    errors: [
      ["Espresso çok hızlı aktı", "Öğütüm fazla kalın olabilir.", "Bir kademe inceltin."],
      [
        "Espresso çok acı oldu",
        "Ekstraksiyon fazla uzamış olabilir.",
        "Daha kalın öğütün veya süreyi kısaltın.",
      ],
    ],
  },
  {
    slug: "v60",
    name: "V60",
    short: "Berrak, aromatik ve kontrollü.",
    title: "V60 ile Berrak Bir Fincan",
    description: "Kahvenin en saf aromalarını ortaya çıkaran kontrollü filtre kahve deneyimi.",
    duration: "2:30–3:30",
    grind: "Orta ince",
    ratio: "1:16.7",
    difficulty: "Orta",
    temperature: "92–96°C",
    coffee: "15 g",
    water: "250 ml",
    character: "Temiz · Zarif",
    color: "#a87843",
    steps: [
      "Filtreyi yerleştirip sıcak suyla durulayın.",
      "15 g kahveyi orta-ince öğütün ve yatağı düzleyin.",
      "Bloom için 30–40 ml su ekleyip 30–45 saniye bekleyin.",
      "Kontrollü dairesel döküşlerle 250 ml’ye ulaşın.",
      "Demlemenin 3 dakika civarında tamamlanmasını bekleyin.",
    ],
    equipment: ["V60 dripper", "V60 filtre", "Gooseneck kettle", "Hassas tartı", "Server"],
    notes: ["Çiçeksi", "Narenciye", "Meyvemsi", "Parlak asidite"],
    errors: [
      [
        "Kahve çok ekşi",
        "Ekstraksiyon kısa kalmış olabilir.",
        "Bir kademe inceltin veya döküşü yavaşlatın.",
      ],
      [
        "Akış çok yavaş",
        "Öğütüm fazla ince olabilir.",
        "Daha kalın öğütün ve yatağı karıştırmayın.",
      ],
    ],
  },
  {
    slug: "moka-pot",
    name: "Moka Pot",
    short: "İtalyan tarzı yoğun ve aromatik.",
    title: "Moka Pot ile Yoğun Aromalar",
    description: "İtalyan kahve geleneğinden gelen güçlü, aromatik ve yoğun bir fincan.",
    duration: "4–6 dk",
    grind: "Orta ince",
    ratio: "1:7",
    difficulty: "Kolay",
    temperature: "Düşük–orta ısı",
    coffee: "20 g",
    water: "140 ml",
    character: "Sıcak · Nostaljik",
    color: "#8b4b2f",
    steps: [
      "Alt hazneye güvenlik valfinin altına kadar sıcak su koyun.",
      "Kahveyi filtre haznesine doldurun; sıkıştırmayın.",
      "Moka Pot’u kapatıp düşük–orta ateşe alın.",
      "Kahve çıkmaya başlayınca akışı takip edin.",
      "Akış agresifleşmeden ocaktan alın.",
    ],
    equipment: ["Moka Pot", "Kahve değirmeni", "Ocak", "Hassas tartı"],
    notes: ["Kakao", "Karamel", "Baharat", "Kavrulmuş şeker"],
    errors: [
      ["Kahve yanık oldu", "Ateş fazla yüksek olabilir.", "Düşük ısı kullanın."],
      ["Kahve çok zayıf", "Hazne yeterince dolu olmayabilir.", "Filtreyi düz biçimde doldurun."],
    ],
  },
  {
    slug: "french-press",
    name: "French Press",
    short: "Zengin gövdeli ve yoğun aromalı.",
    title: "French Press ile Zengin Gövde",
    description: "Doğal yağları ve yoğun aromaları koruyan klasik kahve demleme yöntemi.",
    duration: "4 dk",
    grind: "Kalın",
    ratio: "1:16.7",
    difficulty: "Kolay",
    temperature: "92–96°C",
    coffee: "30 g",
    water: "500 ml",
    character: "Sıcak · Doğal",
    color: "#72503a",
    steps: [
      "Kahveyi kalın öğütün ve hazneye ekleyin.",
      "92–96°C sıcak suyu ekleyip hafifçe karıştırın.",
      "4 dakika bekleyin.",
      "Pistonu yavaşça indirin.",
      "Kahveyi bekletmeden servis edin.",
    ],
    equipment: ["Cam French Press", "Kahve değirmeni", "Hassas tartı", "Zamanlayıcı"],
    notes: ["Çikolata", "Ceviz", "Karamel", "Esmer şeker"],
    errors: [
      [
        "Kahve tortulu",
        "Öğütüm fazla ince olabilir.",
        "Daha kalın öğütün ve pistonu yavaş indirin.",
      ],
      ["Kahve acı", "Demleme fazla uzun sürmüş olabilir.", "4 dakikada servis edin."],
    ],
  },
  {
    slug: "chemex",
    name: "Chemex",
    short: "Saf, temiz ve zarif.",
    title: "Chemex ile Saflık ve Zarafet",
    description: "Kalın filtresi sayesinde temiz ve zarif aromalar sunan ikonik filtre deneyimi.",
    duration: "4–5 dk",
    grind: "Orta–orta kalın",
    ratio: "1:16.7",
    difficulty: "Orta",
    temperature: "92–96°C",
    coffee: "30 g",
    water: "500 ml",
    character: "Sofistike · Ferah",
    color: "#8b9a7a",
    steps: [
      "Kalın filtreyi yerleştirip sıcak suyla durulayın.",
      "30 g kahveyi ekleyin ve yatağı düzleyin.",
      "60 ml bloom suyu ekleyip 45 saniye bekleyin.",
      "Dairesel döküşlerle toplam 500 ml’ye ulaşın.",
      "Filtre tamamen süzülünce servis edin.",
    ],
    equipment: ["Chemex", "Chemex filtre", "Gooseneck kettle", "Server"],
    notes: ["Çiçeksi", "Narenciye", "Temiz", "Meyvemsi"],
    errors: [
      ["Fincan fazla hafif", "Öğütüm fazla kalın olabilir.", "Bir kademe inceltin."],
      ["Akış çok yavaş", "Filtre yatağı tıkanmış olabilir.", "Daha dengeli dökün."],
    ],
  },
  {
    slug: "aeropress",
    name: "AeroPress",
    short: "Modern, hızlı ve yaratıcı.",
    title: "AeroPress ile Sınırsız Kontrol",
    description: "Hızlı, pratik ve yaratıcı kahve demleme yönteminin tüm incelikleri.",
    duration: "2–3 dk",
    grind: "Orta ince",
    ratio: "1:13",
    difficulty: "Kolay",
    temperature: "85–94°C",
    coffee: "15–18 g",
    water: "200–250 ml",
    character: "Modern · Dinamik",
    color: "#6a7187",
    steps: [
      "Filtreyi hazırlayıp hazneyi ısıtın.",
      "Kahveyi ekleyin ve suyu dökün.",
      "30 saniye karıştırıp bekleyin.",
      "Press’i yavaş ve kontrollü uygulayın.",
      "Konsantreyi suyla açıp servis edin.",
    ],
    equipment: ["AeroPress", "Kağıt filtre", "Kettle", "Hassas tartı"],
    notes: ["Tatlı", "Temiz", "Kakao", "Kırmızı meyve"],
    errors: [
      ["Kahve ince ve acı", "Press fazla uzun sürmüş olabilir.", "Daha kısa demleyin."],
      ["Fincan sulu", "Kahve-su oranı düşük kalmış olabilir.", "Kahve miktarını artırın."],
    ],
  },
  {
    slug: "filtre-kahve",
    name: "Filtre Kahve",
    short: "Dengeli ve günlük keyif için ideal.",
    title: "Her Gün Mükemmel Filtre Kahve",
    description: "Doğru oran ve öğütme ile evde dengeli ve lezzetli filtre kahve hazırlayın.",
    duration: "5–8 dk",
    grind: "Orta",
    ratio: "1:15–1:17",
    difficulty: "Kolay",
    temperature: "92–96°C",
    coffee: "30 g",
    water: "500 ml",
    character: "Dengeli · Günlük",
    color: "#a38762",
    steps: [
      "Filtreyi yerleştirip makineyi ısıtın.",
      "Kahveyi orta ayarda öğütüp ekleyin.",
      "Su haznesini doğru ölçüde doldurun.",
      "Makineyi başlatın ve demlemenin tamamlanmasını bekleyin.",
      "Kahveyi server’da hafifçe karıştırıp servis edin.",
    ],
    equipment: ["Filtre kahve makinesi", "Kağıt filtre", "Hassas tartı", "Server"],
    notes: ["Dengeli", "Tatlı", "Orta gövde", "Karamel"],
    errors: [
      ["Kahve sulu", "Oran fazla yüksek olabilir.", "1:15 oranını deneyin."],
      ["Kahve acı", "Makine suyu fazla sıcak olabilir.", "Filtreyi ve öğütümü kontrol edin."],
    ],
  },
  {
    slug: "cold-brew",
    name: "Cold Brew",
    short: "Yavaş demlenmiş, pürüzsüz ve ferah.",
    title: "Cold Brew ile Yavaş Demlenen Lezzet",
    description: "Uzun süreli soğuk demleme ile pürüzsüz, tatlı ve düşük asiditeli kahve.",
    duration: "12–18 saat",
    grind: "Kalın",
    ratio: "1:10",
    difficulty: "Kolay",
    temperature: "Soğuk su",
    coffee: "100 g",
    water: "1 litre",
    character: "Serin · Pürüzsüz",
    color: "#527789",
    steps: [
      "Kahveyi kalın öğütün ve demleme kabına ekleyin.",
      "Soğuk suyu yavaşça ilave edin.",
      "Kahvenin tamamen ıslandığından emin olun.",
      "12–18 saat buzdolabında bekletin.",
      "Filtreleyip buzla servis edin.",
    ],
    equipment: ["Cold Brew kabı", "Kalın filtre", "Kahve değirmeni", "Ölçü kabı"],
    notes: ["Kakao", "Çikolata", "Karamel", "Esmer şeker"],
    errors: [
      ["Kahve fazla yoğun", "Konsantre suyla açılmamış olabilir.", "Servisten önce su ekleyin."],
      ["Kahve tatsız", "Öğütüm veya süre yetersiz olabilir.", "Daha uzun demleyin."],
    ],
  },
];
export const demlemeGetir = (slug: string) =>
  DEMLEME_YONTEMLERI.find((method) => method.slug === slug);
export const demlemeUrl = (slug: string) => `/demleme-yontemleri/${slug}`;
