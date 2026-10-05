/**
 * FOR COFFEE yerel ürün kataloğu.
 * Tüm mağaza, ürün detay, sepet ve arama sistemleri bu veri yapısını kullanır.
 * WooCommerce'e hiçbir bağımlılık yoktur.
 *
 * NOT: Fiyat ve stok bilgileri buradan tek noktadan güncellenir.
 */

export type OgutmeSecenegi =
  "Çekirdek" | "Filtre" | "Espresso" | "Moka Pot" | "French Press" | "Türk Kahvesi";

export const TUM_OGUTMELER: OgutmeSecenegi[] = [
  "Çekirdek",
  "Filtre",
  "Espresso",
  "Moka Pot",
  "French Press",
  "Türk Kahvesi",
];

export interface Varyant {
  /** Varyant kimliği, sepette kullanılır (ör. "250g") */
  id: string;
  /** Görünen etiket (ör. "250 g") */
  etiket: string;
  fiyat: number;
  eskiFiyat?: number;
  stok: number;
}

export interface Urun {
  id: number;
  slug: string;
  ad: string;
  kisaAciklama: string;
  aciklama: string;
  gorseller: string[];
  kategori: KategoriSlug;
  etiketler: string[];
  koken?: string;
  bolge?: string;
  rakim?: string;
  isleme?: string;
  kavrum?: string;
  tatProfili?: string[];
  demlemeOnerileri?: string[];
  varyantlar: Varyant[];
  ogutmeSecenekleri: OgutmeSecenegi[];
  oneCikan?: boolean;
  cokSatan?: boolean;
  yeni?: boolean;
  puan?: number;
  degerlendirmeSayisi?: number;
}

export type KategoriSlug = "tek-koken" | "harman" | "cay" | "ekipman";

export interface Kategori {
  slug: KategoriSlug;
  ad: string;
  ozet: string;
}

export const KATEGORILER: Kategori[] = [
  {
    slug: "tek-koken",
    ad: "Tek Köken Kahveler",
    ozet: "Tek bir çiftliğin ya da bölgenin karakterini olduğu gibi yansıtan, mikro partiler halinde kavrulan çekirdekler.",
  },
  {
    slug: "harman",
    ad: "Harman Kahveler",
    ozet: "Farklı kökenlerin dengeli bir gövde ve tekrarlanabilir tat profili için bir araya getirildiği FOR COFFEE harmanları.",
  },
  {
    slug: "cay",
    ad: "Çay ve Sıcak İçecekler",
    ozet: "Kahve dışındaki ritüelleriniz için matcha, bitki çayları ve sıcak çikolata.",
  },
  {
    slug: "ekipman",
    ad: "Ekipman",
    ozet: "Evde barista kalitesinde demleme için seçtiğimiz demlik, termos ve setler.",
  },
];

export function kategoriGetir(slug: string): Kategori | undefined {
  return KATEGORILER.find((k) => k.slug === slug);
}

const IMG = "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/02";

/** Kahve ürünleri için standart gramaj basamakları. */
function kahveVaryantlari(taban: number, stok = 24, indirim?: number): Varyant[] {
  const yuvarla = (n: number) => Math.round(n / 5) * 5;
  return [
    {
      id: "250g",
      etiket: "250 g",
      fiyat: taban,
      ...(indirim ? { eskiFiyat: yuvarla(taban * (1 + indirim)) } : {}),
      stok,
    },
    { id: "500g", etiket: "500 g", fiyat: yuvarla(taban * 1.9), stok },
    { id: "1kg", etiket: "1 kg", fiyat: yuvarla(taban * 3.6), stok },
  ];
}

function tekVaryant(fiyat: number, stok = 12, eskiFiyat?: number): Varyant[] {
  return [{ id: "tek", etiket: "Standart", fiyat, ...(eskiFiyat ? { eskiFiyat } : {}), stok }];
}

const KAHVE_OGUTME: OgutmeSecenegi[] = TUM_OGUTMELER;

export const URUNLER: Urun[] = [
  {
    id: 14,
    slug: "guatemala-antigua",
    ad: "Guatemala Antigua",
    kisaAciklama:
      "Antigua vadisinin volkanik topraklarında yetişen, çikolata ve karamel ağırlıklı dengeli bir tek köken.",
    aciklama:
      "Guatemala Antigua, üç volkanla çevrili Antigua vadisinde, mineral bakımından zengin volkanik topraklarda yetişir. Gündüz ile gece arasındaki belirgin sıcaklık farkı çekirdeğin yavaş olgunlaşmasını sağlar; bu da fincanda daha yoğun bir tatlılık ve kadifemsi bir gövde olarak karşımıza çıkar. Orta kavrumda çikolata ve karamel notaları öne çıkarken, arka planda fındıksı bir tatlılık ve zarif bir meyve asiditesi kendini hissettirir. Hem espresso hem de filtre demlemede istikrarlı sonuç veren, günlük içim için ideal bir tek kökendir.",
    gorseller: [`${IMG}/Guatemala-grade1.png`, `${IMG}/for-urun-gorselleri.png`],
    kategori: "tek-koken",
    etiketler: ["espresso", "filtre", "çikolata", "karamel", "dengeli"],
    koken: "Guatemala",
    bolge: "Antigua",
    rakim: "1300–1600 m",
    isleme: "Washed",
    kavrum: "Orta",
    tatProfili: ["Bitter çikolata", "Karamel", "Fındık", "Hafif turunç"],
    demlemeOnerileri: ["Espresso", "V60", "Chemex", "Moka Pot"],
    varyantlar: kahveVaryantlari(320, 30),
    ogutmeSecenekleri: KAHVE_OGUTME,
    oneCikan: true,
    cokSatan: true,
    puan: 4.8,
    degerlendirmeSayisi: 42,
  },
  {
    id: 12,
    slug: "ethiopia-sidamo",
    ad: "Ethiopia Sidamo",
    kisaAciklama: "Çiçeksi aroması ve turunç asiditesiyle filtre demlemenin klasiği.",
    aciklama:
      "Kahvenin anavatanı Etiyopya'nın Sidamo bölgesinden gelen bu çekirdek, yüksek rakımın getirdiği yoğun aromatik yapısıyla tanınır. Yıkanmış işleme yöntemi fincanda temiz, berrak bir yapı bırakır; yasemin benzeri çiçeksi bir üst nota ile bergamot ve limon kabuğunu andıran canlı bir asidite eşlik eder. Açık-orta kavrum, çekirdeğin doğal karakterini bastırmadan öne çıkarır. Filtre demlemelerde en iyi sonucu verir.",
    gorseller: [`${IMG}/Ethiopian-sidamo.png`, `${IMG}/ethiopian-sidamo-grade1.png`],
    kategori: "tek-koken",
    etiketler: ["filtre", "çiçeksi", "meyvemsi", "asidik"],
    koken: "Etiyopya",
    bolge: "Sidamo",
    rakim: "1700–2000 m",
    isleme: "Washed",
    kavrum: "Açık-Orta",
    tatProfili: ["Yasemin", "Bergamot", "Limon kabuğu", "Siyah çay"],
    demlemeOnerileri: ["V60", "Chemex", "Aeropress", "French Press"],
    varyantlar: kahveVaryantlari(345, 22),
    ogutmeSecenekleri: KAHVE_OGUTME,
    cokSatan: true,
    puan: 4.7,
    degerlendirmeSayisi: 31,
  },
  {
    id: 15,
    slug: "kenya-aa",
    ad: "Kenya AA",
    kisaAciklama: "Frenk üzümü ve kırmızı meyve notalarıyla yüksek asiditeli, iddialı bir kahve.",
    aciklama:
      "Kenya AA, çekirdek büyüklüğüne göre yapılan en üst sınıflandırmayı ifade eder. Kenya'nın yanardağ kökenli topraklarında yetişen SL28 ve SL34 çeşitleri, fincanda frenk üzümü ve kuşburnu benzeri yoğun kırmızı meyve notaları bırakır. Parlak asiditesi ve şurupsu gövdesiyle sade içimde karakterini en net gösteren kahvelerden biridir. Deneyimli damaklar ve filtre demleme tutkunları için önerilir.",
    gorseller: [`${IMG}/kenya.png`],
    kategori: "tek-koken",
    etiketler: ["filtre", "meyvemsi", "asidik", "yoğun"],
    koken: "Kenya",
    bolge: "Nyeri / Kirinyaga",
    rakim: "1600–1900 m",
    isleme: "Washed",
    kavrum: "Açık-Orta",
    tatProfili: ["Frenk üzümü", "Kuşburnu", "Kahverengi şeker", "Greyfurt"],
    demlemeOnerileri: ["V60", "Chemex", "Aeropress"],
    varyantlar: kahveVaryantlari(395, 18),
    ogutmeSecenekleri: KAHVE_OGUTME,
    oneCikan: true,
    puan: 4.9,
    degerlendirmeSayisi: 27,
  },
  {
    id: 20,
    slug: "kolombiya-supremo",
    ad: "Kolombiya Supremo",
    kisaAciklama: "Yumuşak içimi ve fındıksı tatlılığıyla her demleme yöntemine uyum sağlar.",
    aciklama:
      "Supremo, Kolombiya'da en büyük çekirdek sınıfına verilen isimdir. Dengeli asiditesi, orta gövdesi ve belirgin fındık–karamel tatlılığıyla hem yeni başlayanların hem de günlük içim arayanların favorisidir. Sütlü içeceklerde tatlılığını koruması, espresso bazlı tariflerde de güvenli bir seçim olmasını sağlar.",
    gorseller: [`${IMG}/Colombia-supremo.png`],
    kategori: "tek-koken",
    etiketler: ["espresso", "filtre", "fındık", "karamel", "dengeli"],
    koken: "Kolombiya",
    bolge: "Huila",
    rakim: "1400–1800 m",
    isleme: "Washed",
    kavrum: "Orta",
    tatProfili: ["Fındık", "Karamel", "Elma", "Kakao"],
    demlemeOnerileri: ["Espresso", "French Press", "Moka Pot", "V60"],
    varyantlar: kahveVaryantlari(300, 34),
    ogutmeSecenekleri: KAHVE_OGUTME,
    cokSatan: true,
    puan: 4.6,
    degerlendirmeSayisi: 55,
  },
  {
    id: 9,
    slug: "costa-rica-tarrazu",
    ad: "Costa Rica Tarrazu",
    kisaAciklama: "Berrak yapısı ve bal tatlılığıyla klasik bir Orta Amerika kahvesi.",
    aciklama:
      "Tarrazú, Kosta Rika'nın en bilinen kahve bölgesidir. Yüksek rakım ve düzenli yağış rejimi, çekirdeğe belirgin bir tatlılık ve temiz bir yapı kazandırır. Fincanda bal, kayısı ve badem notaları öne çıkar; asidite parlak ama yorucu değildir. Filtre demlemede aromatik derinliğini, espresso'da ise tatlı bir bitişi ortaya koyar.",
    gorseller: [`${IMG}/costarica-terrazu.png`],
    kategori: "tek-koken",
    etiketler: ["filtre", "bal", "tatlı", "dengeli"],
    koken: "Kosta Rika",
    bolge: "Tarrazú",
    rakim: "1200–1700 m",
    isleme: "Washed",
    kavrum: "Orta",
    tatProfili: ["Bal", "Kayısı", "Badem", "Kakao"],
    demlemeOnerileri: ["V60", "Chemex", "Espresso"],
    varyantlar: kahveVaryantlari(330, 20),
    ogutmeSecenekleri: KAHVE_OGUTME,
    puan: 4.7,
    degerlendirmeSayisi: 19,
  },
  {
    id: 10,
    slug: "el-salvador",
    ad: "El Salvador",
    kisaAciklama: "Kremsi gövdesi ve olgun meyve tatlılığıyla yumuşak bir tek köken.",
    aciklama:
      "El Salvador'un Bourbon ağırlıklı bahçelerinden gelen bu kahve, yumuşak asiditesi ve kremsi gövdesiyle öne çıkar. Fincanda olgun kırmızı elma, kahverengi şeker ve süt çikolatası notaları hissedilir. Sabah kahvesi olarak sade içimde ya da sütlü içeceklerde rahatlıkla kullanılabilir.",
    gorseller: [`${IMG}/EL-SALVADOR.png`, `${IMG}/EL-SALVADOR-1.png`],
    kategori: "tek-koken",
    etiketler: ["espresso", "yumuşak", "çikolata"],
    koken: "El Salvador",
    bolge: "Apaneca-Ilamatepec",
    rakim: "1200–1600 m",
    isleme: "Washed",
    kavrum: "Orta",
    tatProfili: ["Süt çikolatası", "Kırmızı elma", "Kahverengi şeker"],
    demlemeOnerileri: ["Espresso", "Moka Pot", "French Press"],
    varyantlar: kahveVaryantlari(295, 26),
    ogutmeSecenekleri: KAHVE_OGUTME,
    puan: 4.5,
    degerlendirmeSayisi: 23,
  },
  {
    id: 13,
    slug: "peru-papagoya",
    ad: "Peru Papagoya",
    kisaAciklama: "Organik tarımla yetişen, kakao ve kuruyemiş ağırlıklı yumuşak bir Peru kahvesi.",
    aciklama:
      "Peru'nun kuzeyindeki küçük üretici kooperatiflerinden gelen bu kahve, çoğunlukla gölge altında ve organik yöntemlerle yetiştirilir. Düşük asiditesi, kakao ve ceviz ağırlıklı tat profili ile gün boyu içilebilecek dengeli bir seçenektir. French Press ve Moka Pot gibi yoğun gövdeli demlemelerde karakteri belirginleşir.",
    gorseller: [`${IMG}/peru-papagoye-grade1.png`, `${IMG}/PERU-ECOFOREST.png`],
    kategori: "tek-koken",
    etiketler: ["filtre", "kakao", "düşük asidite", "organik"],
    koken: "Peru",
    bolge: "Cajamarca",
    rakim: "1200–1800 m",
    isleme: "Washed",
    kavrum: "Orta",
    tatProfili: ["Kakao", "Ceviz", "Kamış şekeri"],
    demlemeOnerileri: ["French Press", "Moka Pot", "Filtre"],
    varyantlar: kahveVaryantlari(285, 25),
    ogutmeSecenekleri: KAHVE_OGUTME,
    puan: 4.4,
    degerlendirmeSayisi: 16,
  },
  {
    id: 18,
    slug: "peru-ecoforest",
    ad: "Peru Ecoforest",
    kisaAciklama: "Orman dostu tarımla üretilen, yumuşak ve tatlı bitişli bir kahve.",
    aciklama:
      "Ecoforest partisi, doğal orman örtüsü korunarak yapılan gölge tarımından gelir. Bu üretim biçimi çekirdeğin daha yavaş olgunlaşmasını sağlar ve fincanda yumuşak bir tatlılık bırakır. Karamel ve kuru incir notaları, düşük asiditeyle birleşerek uzun ve tatlı bir bitiş oluşturur.",
    gorseller: [`${IMG}/PERU-ECOFOREST.png`],
    kategori: "tek-koken",
    etiketler: ["filtre", "karamel", "sürdürülebilir"],
    koken: "Peru",
    bolge: "Amazonas",
    rakim: "1300–1750 m",
    isleme: "Washed",
    kavrum: "Orta",
    tatProfili: ["Karamel", "Kuru incir", "Badem"],
    demlemeOnerileri: ["V60", "French Press", "Moka Pot"],
    varyantlar: kahveVaryantlari(290, 18),
    ogutmeSecenekleri: KAHVE_OGUTME,
    yeni: true,
    puan: 4.5,
    degerlendirmeSayisi: 11,
  },
  {
    id: 16,
    slug: "sumatra-blu-batak",
    ad: "Sumatra Blu Batak",
    kisaAciklama:
      "Toprağımsı derinliği ve baharatlı bitişiyle yoğun gövdeli bir Endonezya kahvesi.",
    aciklama:
      "Sumatra kahveleri, bölgeye özgü giling basah (ıslak soyma) işleme yöntemi sayesinde son derece yoğun bir gövde ve düşük asidite kazanır. Blu Batak partisinde sedir ağacı, tütün ve baharat notaları belirgindir. Sütlü espresso tariflerinde bile karakterini kaybetmeyen, iddialı bir seçimdir.",
    gorseller: [`${IMG}/Sumatra-blu-batak.png`],
    kategori: "tek-koken",
    etiketler: ["espresso", "yoğun", "baharatlı", "düşük asidite"],
    koken: "Endonezya",
    bolge: "Sumatra – Lintong",
    rakim: "1100–1500 m",
    isleme: "Giling Basah",
    kavrum: "Orta-Koyu",
    tatProfili: ["Sedir", "Baharat", "Bitter çikolata", "Tütün"],
    demlemeOnerileri: ["Espresso", "Moka Pot", "French Press", "Türk Kahvesi"],
    varyantlar: kahveVaryantlari(340, 15),
    ogutmeSecenekleri: KAHVE_OGUTME,
    puan: 4.6,
    degerlendirmeSayisi: 14,
  },
  {
    id: 17,
    slug: "uganda-bigusi",
    ad: "Uganda Bigusi",
    kisaAciklama: "Koyu meyve ve melas notalarıyla gövdeli, sıra dışı bir Afrika kahvesi.",
    aciklama:
      "Uganda'nın Bigusi bölgesinden gelen bu parti, Afrika kahvelerinin aromatik yapısını daha gövdeli bir dokuyla birleştirir. Fincanda kuru erik, melas ve kakao notaları hissedilir. Espresso'da yoğun bir crema ve tatlı bir bitiş verir.",
    gorseller: [`${IMG}/for-urun-gorselleri.png`],
    kategori: "tek-koken",
    etiketler: ["espresso", "gövdeli", "koyu meyve"],
    koken: "Uganda",
    bolge: "Bigusi",
    rakim: "1300–1800 m",
    isleme: "Washed",
    kavrum: "Orta-Koyu",
    tatProfili: ["Kuru erik", "Melas", "Kakao"],
    demlemeOnerileri: ["Espresso", "Moka Pot"],
    varyantlar: kahveVaryantlari(305, 10),
    ogutmeSecenekleri: KAHVE_OGUTME,
    puan: 4.3,
    degerlendirmeSayisi: 8,
  },
  {
    id: 23,
    slug: "nikaragua-gold",
    ad: "Nikaragua Gold",
    kisaAciklama: "Tatlı gövdesi ve vanilya bitişiyle yumuşak içimli bir Orta Amerika kahvesi.",
    aciklama:
      "Nikaragua'nın Jinotega bölgesinden gelen bu kahve, dengeli yapısı ve belirgin tatlılığıyla dikkat çeker. Fincanda vanilya, kahverengi şeker ve fındık notaları hissedilir; asidite yumuşaktır. Sütlü içeceklerle uyumu yüksektir.",
    gorseller: [`${IMG}/Nikaragua-gold.png`],
    kategori: "tek-koken",
    etiketler: ["espresso", "tatlı", "yumuşak"],
    koken: "Nikaragua",
    bolge: "Jinotega",
    rakim: "1100–1500 m",
    isleme: "Washed",
    kavrum: "Orta",
    tatProfili: ["Vanilya", "Kahverengi şeker", "Fındık"],
    demlemeOnerileri: ["Espresso", "Moka Pot", "Filtre"],
    varyantlar: kahveVaryantlari(295, 16),
    ogutmeSecenekleri: KAHVE_OGUTME,
    puan: 4.4,
    degerlendirmeSayisi: 12,
  },
  {
    id: 24,
    slug: "honduras",
    ad: "Honduras",
    kisaAciklama: "Kayısı tatlılığı ve temiz bitişiyle günlük içim için dengeli bir seçim.",
    aciklama:
      "Honduras'ın yüksek rakımlı Marcala bölgesinden gelen bu kahve, temiz yapısı ve kayısı–karamel tatlılığıyla öne çıkar. Orta gövdesi ve yumuşak asiditesi sayesinde hem filtre hem espresso demlemede rahat bir içim sunar.",
    gorseller: [`${IMG}/honduras.png`],
    kategori: "tek-koken",
    etiketler: ["filtre", "espresso", "kayısı", "dengeli"],
    koken: "Honduras",
    bolge: "Marcala",
    rakim: "1300–1600 m",
    isleme: "Washed",
    kavrum: "Orta",
    tatProfili: ["Kayısı", "Karamel", "Süt çikolatası"],
    demlemeOnerileri: ["V60", "Espresso", "French Press"],
    varyantlar: kahveVaryantlari(285, 20),
    ogutmeSecenekleri: KAHVE_OGUTME,
    puan: 4.4,
    degerlendirmeSayisi: 17,
  },
  {
    id: 22,
    slug: "jamaica-blue-mountain",
    ad: "Jamaica Blue Mountain",
    kisaAciklama: "Dünyanın en nadir kahvelerinden biri: ipeksi gövde, zarif tatlılık.",
    aciklama:
      "Jamaika'nın Blue Mountain bölgesinde, sisli ve serin bir mikro iklimde yetişen bu kahve, sınırlı üretimi nedeniyle dünyanın en özel partileri arasında sayılır. Fincanda son derece yumuşak bir asidite, ipeksi bir gövde ve çiçeksi–fındıksı zarif bir tatlılık sunar. Karakterini bastırmamak için sade içim önerilir.",
    gorseller: [`${IMG}/for-urun-gorselleri.png`],
    kategori: "tek-koken",
    etiketler: ["nadir", "özel seri", "filtre"],
    koken: "Jamaika",
    bolge: "Blue Mountain",
    rakim: "1000–1700 m",
    isleme: "Washed",
    kavrum: "Orta",
    tatProfili: ["Çiçeksi", "Fındık", "Tereyağı", "Hafif kakao"],
    demlemeOnerileri: ["V60", "Chemex", "Aeropress"],
    varyantlar: kahveVaryantlari(1250, 6),
    ogutmeSecenekleri: KAHVE_OGUTME,
    oneCikan: true,
    puan: 5,
    degerlendirmeSayisi: 9,
  },
  {
    id: 11,
    slug: "turk-kahvesi",
    ad: "Türk Kahvesi",
    kisaAciklama: "Geleneksel ritüel için toz inceliğinde öğütülmüş özel harman.",
    aciklama:
      "FOR COFFEE Türk Kahvesi, geleneksel fincanda bol köpük ve yoğun bir gövde verecek şekilde harmanlanır ve toz inceliğinde öğütülür. Kavrum, acılığı öne çıkarmadan kakao ve kuruyemiş tatlılığını koruyacak biçimde dengelenmiştir. Cezvede kısık ateşte, yavaş pişirildiğinde en iyi sonucu verir.",
    gorseller: [`${IMG}/turkish-coffee.png`],
    kategori: "harman",
    etiketler: ["türk kahvesi", "geleneksel", "harman"],
    kavrum: "Orta-Koyu",
    tatProfili: ["Kakao", "Kuruyemiş", "Kamış şekeri"],
    demlemeOnerileri: ["Cezve"],
    varyantlar: kahveVaryantlari(225, 40),
    ogutmeSecenekleri: ["Türk Kahvesi", "Çekirdek"],
    cokSatan: true,
    puan: 4.7,
    degerlendirmeSayisi: 63,
  },
  {
    id: 27,
    slug: "special-espresso-blend",
    ad: "Special Espresso Blend",
    kisaAciklama: "Yoğun crema, çikolatalı gövde: sütlü tariflerde bile net karakter.",
    aciklama:
      "Orta Amerika ve Endonezya çekirdeklerinin bir araya getirildiği bu harman, espresso makinesinde tutarlı sonuç vermek üzere tasarlandı. Yoğun crema, bitter çikolata gövdesi ve fındıksı bir bitiş sunar. Latte ve cappuccino gibi sütlü tariflerde tatlılığını ve karakterini korur.",
    gorseller: [`${IMG}/espressoblend.png`],
    kategori: "harman",
    etiketler: ["espresso", "harman", "çikolata", "sütlü kahve"],
    kavrum: "Orta-Koyu",
    tatProfili: ["Bitter çikolata", "Fındık", "Kahverengi şeker"],
    demlemeOnerileri: ["Espresso", "Moka Pot"],
    varyantlar: kahveVaryantlari(280, 45),
    ogutmeSecenekleri: KAHVE_OGUTME,
    oneCikan: true,
    cokSatan: true,
    puan: 4.8,
    degerlendirmeSayisi: 74,
  },
  {
    id: 28,
    slug: "signature-filter-blend",
    ad: "Signature Filter Blend",
    kisaAciklama: "Filtre demlemeler için tasarlanmış, meyveli ve berrak bir imza harman.",
    aciklama:
      "Afrika ve Orta Amerika çekirdeklerinin dengelendiği bu harman, filtre demlemede berrak bir yapı ve canlı bir meyve tatlılığı sunar. V60, Chemex ve batch brew ile hazırlandığında turunç ve kırmızı meyve notaları öne çıkar. Günlük filtre kahve rutini için tasarlandı.",
    gorseller: [`${IMG}/singature-filter.png`],
    kategori: "harman",
    etiketler: ["filtre", "harman", "meyvemsi"],
    kavrum: "Açık-Orta",
    tatProfili: ["Turunç", "Kırmızı meyve", "Bal"],
    demlemeOnerileri: ["V60", "Chemex", "Aeropress"],
    varyantlar: kahveVaryantlari(275, 38),
    ogutmeSecenekleri: KAHVE_OGUTME,
    puan: 4.6,
    degerlendirmeSayisi: 48,
  },
  {
    id: 26,
    slug: "africa-sunrise-blend",
    ad: "Africa Sunrise Blend",
    kisaAciklama: "Etiyopya ve Kenya çekirdeklerinin canlı, meyveli buluşması.",
    aciklama:
      "Africa Sunrise, Doğu Afrika kahvelerinin aromatik yoğunluğunu tek bir harmanda toplar. Etiyopya'nın çiçeksi üst notaları ile Kenya'nın kırmızı meyve asiditesi bir araya gelir; sonuç canlı, parlak ve ferahlatıcı bir fincandır. Özellikle soğuk demleme ve filtre yöntemlerinde etkileyicidir.",
    gorseller: [`${IMG}/AFRICA-SUNRISE-BLEND.png`],
    kategori: "harman",
    etiketler: ["filtre", "harman", "meyvemsi", "çiçeksi"],
    kavrum: "Açık-Orta",
    tatProfili: ["Yasemin", "Frenk üzümü", "Bergamot"],
    demlemeOnerileri: ["V60", "Chemex", "Cold Brew"],
    varyantlar: kahveVaryantlari(310, 22),
    ogutmeSecenekleri: KAHVE_OGUTME,
    yeni: true,
    puan: 4.7,
    degerlendirmeSayisi: 21,
  },
  // Çay ve sıcak içecekler
  {
    id: 1,
    slug: "sicak-cikolata",
    ad: "Sıcak Çikolata",
    kisaAciklama: "Yoğun kakao oranıyla hazırlanan, kıvamlı sıcak çikolata karışımı.",
    aciklama:
      "Yüksek kakao oranlı bu karışım, sütle hazırlandığında kıvamlı ve yoğun bir sıcak çikolata verir. Aşırı tatlı değildir; kakaonun hafif bitter karakteri korunur. Soğuk günlerin klasiği.",
    gorseller: [`${IMG}/sicak-cikolata.png`],
    kategori: "cay",
    etiketler: ["sıcak çikolata", "kakao"],
    varyantlar: tekVaryant(185, 30),
    ogutmeSecenekleri: [],
    puan: 4.6,
    degerlendirmeSayisi: 34,
  },
  {
    id: 2,
    slug: "orijinal-matcha",
    ad: "Orijinal Matcha",
    kisaAciklama: "Japon yeşil çay tozu; saf, tören kalitesinde matcha.",
    aciklama:
      "Gölgede yetiştirilen yaprakların taş değirmende öğütülmesiyle elde edilen saf matcha. Umami ağırlıklı, hafif tatlı ve ferah bir profile sahiptir. Sade olarak veya matcha latte tarifiyle hazırlanabilir.",
    gorseller: [`${IMG}/matcha.png`],
    kategori: "cay",
    etiketler: ["matcha", "yeşil çay", "latte"],
    varyantlar: tekVaryant(340, 18),
    ogutmeSecenekleri: [],
    yeni: true,
    puan: 4.7,
    degerlendirmeSayisi: 22,
  },
  {
    id: 3,
    slug: "winterfell-bitki-cayi",
    ad: "Winterfell Bitki Çayı",
    kisaAciklama: "Baharatlı ve ısıtıcı özel bitki çayı karışımı.",
    aciklama:
      "Tarçın, zencefil ve kuru meyvelerin dengelendiği bu karışım, soğuk günlerde ısıtıcı bir alternatif sunar. Kafeinsizdir; akşam saatlerinde de rahatlıkla tüketilebilir.",
    gorseller: [`${IMG}/winterfell.png`],
    kategori: "cay",
    etiketler: ["bitki çayı", "kafeinsiz", "baharatlı"],
    varyantlar: tekVaryant(165, 25),
    ogutmeSecenekleri: [],
    puan: 4.5,
    degerlendirmeSayisi: 15,
  },
  {
    id: 4,
    slug: "mavi-kelebek-cayi",
    ad: "Mavi Kelebek Çayı",
    kisaAciklama: "Renk değiştiren, kafeinsiz butterfly pea çiçeği çayı.",
    aciklama:
      "Butterfly pea çiçeğinden elde edilen bu çay, demlendiğinde derin mavi bir renk alır; limon eklendiğinde mora döner. Yumuşak, çiçeksi bir tada sahiptir ve kafeinsizdir.",
    gorseller: [`${IMG}/bluebutterfly.png`],
    kategori: "cay",
    etiketler: ["bitki çayı", "kafeinsiz", "çiçeksi"],
    varyantlar: tekVaryant(175, 20),
    ogutmeSecenekleri: [],
    puan: 4.4,
    degerlendirmeSayisi: 10,
  },
  // Ekipman
  {
    id: 7,
    slug: "v60-demleme-seti",
    ad: "V60 Demleme Seti",
    kisaAciklama: "Filtre kahveye başlamak için ihtiyacınız olan her şey tek sette.",
    aciklama:
      "Dripper, sürahi, filtre kağıdı ve ölçek içeren bu set, evde filtre kahve demlemeye başlamak için eksiksiz bir başlangıç sunar. V60'ın konik yapısı ve spiral kanalları, suyun kahveyle temas süresini kontrol etmenizi sağlar; böylece aromatik ve berrak bir fincan elde edersiniz.",
    gorseller: [`${IMG}/v60-demele-set.png`],
    kategori: "ekipman",
    etiketler: ["v60", "filtre", "demleme seti"],
    varyantlar: tekVaryant(1450, 8),
    ogutmeSecenekleri: [],
    cokSatan: true,
    puan: 4.8,
    degerlendirmeSayisi: 26,
  },
  {
    id: 8,
    slug: "chemex-400-ml",
    ad: "Chemex 400 ml",
    kisaAciklama: "İkonik cam demlik; berrak ve temiz bir fincan için.",
    aciklama:
      "Borosilikat camdan üretilen Chemex, kalın filtre kağıdı sayesinde yağları ve ince partikülleri tutar; sonuç son derece berrak ve temiz bir fincandır. 400 ml hacmi iki kişilik demleme için idealdir.",
    gorseller: [`${IMG}/chemex-400ml.png`],
    kategori: "ekipman",
    etiketler: ["chemex", "filtre", "cam demlik"],
    varyantlar: tekVaryant(1890, 6),
    ogutmeSecenekleri: [],
    puan: 4.9,
    degerlendirmeSayisi: 18,
  },
  {
    id: 5,
    slug: "stanley-classic-trigger",
    ad: "Stanley Classic Trigger Action Termos",
    kisaAciklama: "Kahvenizi saatlerce sıcak tutan klasik paslanmaz çelik termos.",
    aciklama:
      "Çift cidarlı paslanmaz çelik gövdesi ve tek elle kullanılabilen tetik kapağıyla Stanley Classic, günlük taşıma için tasarlandı. Sıcak içecekleri uzun süre ısıtıcı tutar, sızdırmaz kapağıyla çantada güven verir.",
    gorseller: [`${IMG}/Stanley-Classic-Trigger-Action-Termos.png`],
    kategori: "ekipman",
    etiketler: ["termos", "stanley", "taşınabilir"],
    varyantlar: tekVaryant(2450, 10),
    ogutmeSecenekleri: [],
    puan: 4.8,
    degerlendirmeSayisi: 30,
  },
  {
    id: 6,
    slug: "stanley-aerolight",
    ad: "Stanley AeroLight Termos",
    kisaAciklama: "Hafif gövdesiyle gün boyu yanınızda taşıyabileceğiniz termos.",
    aciklama:
      "AeroLight serisi, klasik Stanley dayanıklılığını belirgin şekilde daha hafif bir gövdeyle birleştirir. Çift cidarlı yalıtımı sayesinde içeceğinizin sıcaklığını korur; ince yapısı çoğu bardak gözüne uyar.",
    gorseller: [`${IMG}/STANLEY-The-AeroLight-Termos.png`],
    kategori: "ekipman",
    etiketler: ["termos", "stanley", "hafif"],
    varyantlar: tekVaryant(2190, 9),
    ogutmeSecenekleri: [],
    yeni: true,
    puan: 4.7,
    degerlendirmeSayisi: 12,
  },
];

/* ----------------------------- Yardımcılar ----------------------------- */

export function urunGetirSlug(slug: string): Urun | undefined {
  return URUNLER.find((u) => u.slug === slug);
}

export function kategoriUrunleri(slug: KategoriSlug): Urun[] {
  return URUNLER.filter((u) => u.kategori === slug);
}

export function cokSatanlar(limit = 4): Urun[] {
  return URUNLER.filter((u) => u.cokSatan).slice(0, limit);
}

export function yeniUrunler(limit = 4): Urun[] {
  return URUNLER.filter((u) => u.yeni).slice(0, limit);
}

/** Kategori, köken ve etiket yakınlığına göre benzer ürünler. */
export function benzerUrunler(urun: Urun, limit = 4): Urun[] {
  const puan = (u: Urun) => {
    let p = 0;
    if (u.kategori === urun.kategori) p += 3;
    if (u.koken && u.koken === urun.koken) p += 2;
    p += u.etiketler.filter((e) => urun.etiketler.includes(e)).length;
    return p;
  };
  return URUNLER.filter((u) => u.id !== urun.id)
    .map((u) => ({ u, p: puan(u) }))
    .filter((x) => x.p > 0)
    .sort((a, b) => b.p - a.p)
    .slice(0, limit)
    .map((x) => x.u);
}

/** Ürün adı, kategori, köken, tat profili ve etiketler üzerinden arama. */
export function urunAra(sorgu: string): Urun[] {
  const q = sorgu.trim().toLocaleLowerCase("tr");
  if (!q) return URUNLER;
  return URUNLER.filter((u) =>
    [
      u.ad,
      u.kisaAciklama,
      u.koken ?? "",
      u.bolge ?? "",
      u.kavrum ?? "",
      kategoriGetir(u.kategori)?.ad ?? "",
      ...(u.tatProfili ?? []),
      ...(u.demlemeOnerileri ?? []),
      ...u.etiketler,
    ]
      .join(" ")
      .toLocaleLowerCase("tr")
      .includes(q),
  );
}

export function fiyatBicimle(tutar: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(tutar);
}

export function enDusukFiyat(urun: Urun): number {
  return Math.min(...urun.varyantlar.map((v) => v.fiyat));
}

export function stoktaVar(urun: Urun): boolean {
  return urun.varyantlar.some((v) => v.stok > 0);
}
