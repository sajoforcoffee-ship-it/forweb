import girisImg from "@/assets/cat-giris.jpg";
import cekirdekImg from "@/assets/cat-cekirdek.jpg";
import kokenImg from "@/assets/cat-koken.jpg";
import harmanImg from "@/assets/cat-harman.jpg";
import ogutmeImg from "@/assets/cat-ogutme.jpg";
import demlemeImg from "@/assets/cat-demleme.jpg";

export type Bolum = {
  baslik: string;
  paragraflar?: string[];
  maddeler?: string[];
  not?: string;
};

export type Kategori = {
  slug: string;
  ad: string;
  ozet: string;
  giris: string;
  seviye: "Başlangıç" | "Orta" | "İleri";
  sure: string;
  dersSayisi: number;
  gorsel: string;
  bolumler: Bolum[];
};

export const kategoriler: Kategori[] = [
  {
    slug: "kahveye-giris",
    ad: "Kahveye Giriş",
    ozet: "Kahve dünyasının temel kavramları, saf kahve tanımı ve doğru saklama.",
    giris:
      "Kahve yolculuğunuz doğru kavramlarla başlar. Bu bölümde demleme yöntemi ile kahve çeşidi arasındaki farkı, saf kahvenin ne anlama geldiğini ve tazeliği korumanın yollarını öğreneceksiniz.",
    seviye: "Başlangıç",
    sure: "12 dk",
    dersSayisi: 5,
    gorsel: girisImg,
    bolumler: [
      {
        baslik: "Demleme yöntemleri, kahve çeşidi değildir",
        paragraflar: [
          "Espresso, filtre kahve, Moka Pot, V60, Chemex, AeroPress ve French Press birer kahve çeşidi değil, demleme yöntemidir.",
          "Aynı kahve çekirdeği, doğru kavrum ve doğru öğütüm yapıldığı sürece tüm bu yöntemlerde kullanılabilir.",
        ],
      },
      {
        baslik: "Çekirdek kahve mi, öğütülmüş kahve mi?",
        maddeler: [
          "Öğütücünüz varsa çekirdek kahve tercih edin; her demlemeden hemen önce öğütmek en yüksek aromayı verir.",
          "Öğütücünüz yoksa endişelenmeyin: kullandığınız demleme yöntemine ve makinenize uygun öğütümü sizin için özenle hazırlıyoruz.",
        ],
      },
      {
        baslik: "Gerçek kahve ile aromalı/katkılı karışımlar aynı şey değildir",
        paragraflar: [
          "FOR COFFEE kahveleri yalnızca %100 kahve çekirdeğinden üretilir: ilave şeker, aroma verici, krema tozu, tatlandırıcı ve katkı maddesi içermez.",
          "Aromalı, hazır karışım veya “özel” kahve adı altında satılan ürünlerde üreticiye göre değişen oranlarda farklı içerikler bulunabilir.",
        ],
        maddeler: [
          "Aroma vericiler (doğal veya yapay)",
          "Şeker, tatlandırıcı, kıvam artırıcı",
          "Krema tozu / süt tozu, bitkisel yağlar",
          "Baharatlar (menengiç, keçiboynuzu, kakao vb.)",
          "Vitamin / mineral takviyeleri",
        ],
        not: "İçerikler markadan markaya büyük farklılık gösterir. Satın almadan önce ürün etiketini dikkatlice inceleyin.",
      },
      {
        baslik: "Dibek, menengiç ve aromalı karışımlar",
        maddeler: [
          "Dibek kahvesi ticari ürünlerde menengiç, kakao, keçiboynuzu, süt tozu, baharat ve aroma vericiler içerebilir.",
          "Menengiç kahvesi genellikle menengiç meyvesinden yapılır; kahve çekirdeği içermeyebilir.",
          "Damla sakızlı, vanilyalı, fındıklı, çikolatalı kahveler saf kahvenin doğal tat profilini yansıtmaz.",
          "Vitaminli kahveler takviye edici gıda niteliğindedir; düzenli kullanım için etiketi inceleyin ve gerektiğinde sağlık profesyoneline danışın.",
        ],
        not: "Bu ürünlerin “zararlı” olduğunu söylemek doğru değildir; ancak %100 saf kahveden farklı oldukları kesindir.",
      },
      {
        baslik: "Kahve saklama önerisi",
        maddeler: [
          "Hava geçirmez, opak bir kavanozda saklayın.",
          "Serin, kuru ve güneş ışığı almayan bir yerde muhafaza edin.",
          "Buzdolabına koymayın; nem ve kokular kahveyi bozar.",
          "Mümkünse çekirdek olarak satın alın ve demlemeden hemen önce öğütün.",
        ],
      },
    ],
  },
  {
    slug: "kahve-cekirdegi",
    ad: "Kahve Çekirdeği",
    ozet: "Kahvenin kimliğini belirleyen çekirdek, kavrum profilleri ve doğal aroma.",
    giris:
      "Bir fincandaki her tat, çekirdekle başlar. Kavrum ve çekirdek yapısının fincana nasıl yansıdığını bu bölümde ele alıyoruz.",
    seviye: "Başlangıç",
    sure: "9 dk",
    dersSayisi: 3,
    gorsel: cekirdekImg,
    bolumler: [
      {
        baslik: "Kahvenin kimliğini çekirdek belirler",
        paragraflar: [
          "Bir kahvenin ismi — örneğin Colombia Supremo, Guatemala Antigua, Jamaica Blue Mountain, Uganda Bugisu, Peru Papagayo, Sumatra Blue Batak — yetiştiği bölgeyi ve çekirdek türünü ifade eder.",
          "Bu isimler bir demleme yöntemi değildir.",
        ],
      },
      {
        baslik: "Kavrum en az öğütüm kadar önemlidir",
        maddeler: [
          "Espresso ve Moka Pot için genellikle orta-koyu kavrum tercih edilir: daha yoğun gövde, dolgun tat ve sütlü içeceklerde belirgin kahve karakteri.",
          "Filtre kahve, V60 ve Chemex gibi yöntemlerde orta kavrum tercih edilir: meyvemsi, çiçeksi ve doğal aromalar daha net hissedilir.",
        ],
        not: "Bu kesin bir kural değildir; çekirdeğin yapısına göre kavrum profili değişebilir.",
      },
      {
        baslik: "Gerçek kahvenin aroması doğadan gelir, eklenmez",
        paragraflar: [
          "İyi bir specialty kahvede hissettiğiniz çikolata, karamel, fındık, meyve, çiçek, narenciye, bal, yasemin veya bergamot notaları sonradan eklenmez.",
          "Bunlar; çekirdeğin yetiştiği bölge, rakım, işleme yöntemi ve kavrum profili sayesinde doğal olarak oluşur.",
        ],
      },
    ],
  },
  {
    slug: "tek-koken-kahveler",
    ad: "Tek Köken Kahveler",
    ozet: "Bölge, rakım ve işleme yönteminin tek köken karakterine etkisi.",
    giris:
      "Tek köken kahveler tek bir bölgenin karakterini fincana taşır. Terroir kavramını ve köken isimlerinin ne anlama geldiğini inceliyoruz.",
    seviye: "Orta",
    sure: "8 dk",
    dersSayisi: 3,
    gorsel: kokenImg,
    bolumler: [
      {
        baslik: "Köken ismi ne anlatır?",
        paragraflar: [
          "Tek köken kahvelerde isim, kahvenin yetiştiği ülkeyi, bölgeyi ya da çiftliği ifade eder. Colombia Supremo, Guatemala Antigua ya da Sumatra Blue Batak birer demleme yöntemi değil, birer kökendir.",
        ],
      },
      {
        baslik: "Karakteri belirleyen etkenler",
        maddeler: [
          "Yetiştiği bölge ve toprak yapısı",
          "Rakım",
          "İşleme yöntemi (yıkanmış, natural, honey)",
          "Kavrum profili",
        ],
      },
      {
        baslik: "Nasıl demlemeli?",
        paragraflar: [
          "Tek köken kahvelerin aromatik detayını en net gösteren yöntemler genellikle V60, Chemex ve filtre kahvedir. Orta kavrum, meyvemsi ve çiçeksi notaların öne çıkmasını sağlar.",
        ],
      },
    ],
  },
  {
    slug: "harman-kahveler",
    ad: "Harman Kahveler",
    ozet: "Dengeli gövde, süt uyumu ve tutarlı fincan için harmanlama mantığı.",
    giris:
      "Harmanlar, farklı kökenlerin güçlü yanlarını tek bir dengede buluşturur. Özellikle espresso ve sütlü içeceklerde tutarlılık sağlar.",
    seviye: "Orta",
    sure: "7 dk",
    dersSayisi: 3,
    gorsel: harmanImg,
    bolumler: [
      {
        baslik: "Harman neden yapılır?",
        maddeler: [
          "Gövde ve tatlılık dengesi kurmak",
          "Sütlü içeceklerde kahve karakterini belirgin tutmak",
          "Mevsimsel değişimlere rağmen tutarlı bir fincan sunmak",
        ],
      },
      {
        baslik: "Harman ve kavrum ilişkisi",
        paragraflar: [
          "Espresso harmanlarında genellikle orta-koyu kavrum tercih edilir. Bu profil, yoğun gövde ve dolgun tat üretir; sütle birlikte kaybolmayan bir kahve karakteri verir.",
        ],
        not: "Harman, kaliteyi gizlemek için değil; dengeyi kurmak için yapılır.",
      },
      {
        baslik: "Tek köken mi, harman mı?",
        paragraflar: [
          "Aromatik detay ve keşif arıyorsanız tek köken; her gün aynı dengeyi ve süt uyumunu arıyorsanız harman tercih edilir. İkisi de doğru seçimdir; belirleyici olan içme alışkanlığınızdır.",
        ],
      },
    ],
  },
  {
    slug: "ogutme-rehberi",
    ad: "Öğütme Rehberi",
    ozet: "Her demleme yöntemi için doğru öğütüm kalınlığı ve sık yapılan hatalar.",
    giris:
      "Demleme yöntemini belirleyen şey çekirdek değil, öğütümdür. Doğru öğütüm suyun kahveden geçiş hızını dengeler.",
    seviye: "Orta",
    sure: "10 dk",
    dersSayisi: 4,
    gorsel: ogutmeImg,
    bolumler: [
      {
        baslik: "Yönteme göre öğütüm kalınlığı",
        maddeler: [
          "Espresso — ince öğütüm",
          "Moka Pot — ince-orta öğütüm",
          "Filtre kahve makinesi — orta öğütüm",
          "V60 / Chemex — orta-ince öğütüm",
          "French Press — kalın öğütüm",
          "AeroPress — yönteme göre ince ile kalın arasında değişebilir",
        ],
      },
      {
        baslik: "Yanlış öğütümde ne olur?",
        paragraflar: [
          "Yanlış öğütümde kahve acı olabilir, aromalar kaybolabilir, demleme süresi uzayabilir veya espresso kreması oluşmayabilir.",
        ],
      },
      {
        baslik: "Aynı makinede bile sonuç neden değişir?",
        maddeler: [
          "Öğütüm kalınlığı",
          "Kahve miktarı",
          "Tamp basıncı",
          "Su sıcaklığı",
          "Demleme süresi ve basınç",
          "Filtre sepeti (basınçlı / basınçsız)",
          "Makinenin çalışma karakteri",
          "Kahvenin tazeliği",
        ],
        not: "Bu yüzden aynı model iki makinede bile farklı sonuçlar alınabilir. Makinenizin marka ve modelini sormamızın nedeni, kahvenizi makinenize uygun öğütüm profiliyle hazırlayabilmektir.",
      },
    ],
  },
  {
    slug: "demleme-teknikleri",
    ad: "Demleme Teknikleri",
    ozet: "Espresso, V60, Chemex, French Press, Moka Pot ve AeroPress temelleri.",
    giris:
      "Aynı çekirdek, farklı yöntemlerle bambaşka fincanlara dönüşür. Bu bölümde yöntemlerin karakterini ve doğru kurulumunu ele alıyoruz.",
    seviye: "İleri",
    sure: "14 dk",
    dersSayisi: 6,
    gorsel: demlemeImg,
    bolumler: [
      {
        baslik: "Yöntemler ve karakterleri",
        maddeler: [
          "Espresso — yoğun gövde, krema, ince öğütüm ve basınç",
          "Moka Pot — güçlü ve konsantre, ince-orta öğütüm",
          "Filtre kahve makinesi — dengeli günlük fincan, orta öğütüm",
          "V60 — berrak, aromatik, orta-ince öğütüm",
          "Chemex — temiz ve ipeksi gövde, orta-ince öğütüm",
          "French Press — dolgun ve yağlı gövde, kalın öğütüm",
          "AeroPress — esnek; tarifin öğütümü belirler",
        ],
      },
      {
        baslik: "Sonucu etkileyen değişkenler",
        maddeler: [
          "Su kalitesi ve sıcaklığı",
          "Kahve/su oranı",
          "Demleme süresi",
          "Öğütüm tutarlılığı",
          "Kahvenin tazeliği",
        ],
      },
      {
        baslik: "FOR COFFEE farkı",
        paragraflar: [
          "Bizim için önemli olan yalnızca kaliteli çekirdek kullanmak değildir. Kullandığınız makineyi ve demleme yöntemini dikkate alır, her siparişi doğru öğütüm ve uygun kavrum profiliyle hazırlarız.",
          "Amacımız sadece kahve göndermek değil; ilk fincandan itibaren en iyi sonucu almanıza yardımcı olmaktır.",
        ],
      },
    ],
  },
];

export const kategoriBul = (slug: string) => kategoriler.find((k) => k.slug === slug);
