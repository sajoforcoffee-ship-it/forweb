import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Coffee, Leaf, Sparkles, Thermometer } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { KategoriKarti } from "@/components/site/KategoriKarti";
import { kategoriler } from "@/data/akademi";

export const Route = createFileRoute("/akademi/")({
  head: () => ({
    meta: [
      { title: "FOR COFFEE Dijital Kahve Akademisi" },
      {
        name: "description",
        content:
          "Uzman kahve bilgisini herkes için erişilebilir hale getiriyoruz. Çekirdek, kavrum, öğütüm ve demleme rehberleri.",
      },
      { property: "og:title", content: "FOR COFFEE Dijital Kahve Akademisi" },
      {
        property: "og:description",
        content: "Çekirdekten fincana: premium kahve eğitimi, tamamen Türkçe.",
      },
    ],
  }),
  component: AnaSayfa,
});

const ilkeler = [
  {
    icon: Leaf,
    baslik: "%100 Saf Kahve",
    metin: "İlave şeker, aroma verici ve katkı maddesi yok.",
  },
  {
    icon: Thermometer,
    baslik: "Makinene Göre Öğütüm",
    metin: "Her sipariş, yönteminize uygun öğütüm profiliyle hazırlanır.",
  },
  {
    icon: Coffee,
    baslik: "Doğal Aroma",
    metin: "Çikolata, karamel, meyve notaları eklenmez; çekirdekten gelir.",
  },
  {
    icon: Sparkles,
    baslik: "Taze Kavrum",
    metin: "Kavrum profili çekirdeğin karakterine göre belirlenir.",
  },
];

function AnaSayfa() {
  return (
    <div className="min-h-screen">
      <section className="relative flex min-h-[92vh] items-end overflow-hidden">
        <img
          src={heroImg}
          alt="Espresso ekstraksiyonu"
          width={1920}
          height={1080}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/40" />

        <div className="relative mx-auto w-full max-w-7xl px-6 pb-24 lg:px-10 lg:pb-32">
          <p className="rise eyebrow text-white/60">FOR COFFEE • Dijital Kahve Akademisi</p>
          <h1 className="rise mt-8 max-w-4xl text-5xl leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Çekirdekten fincana, kahvenin tamamını öğrenin.
          </h1>
          <p className="rise mt-8 max-w-xl text-base leading-relaxed text-white/70">
            Uzman kahve bilgisini herkes için erişilebilir hale getiriyoruz. Paketinizdeki QR kodu
            okutun, akademiye anında erişin.
          </p>
          <div className="rise mt-12 flex flex-wrap gap-4">
            <Link
              to="/akademi/kategoriler"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-black transition-transform duration-300 hover:scale-[1.02]"
            >
              Öğrenmeye başla <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/akademi/kategoriler/$slug"
              params={{ slug: "demleme-teknikleri" }}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm text-white transition-colors hover:bg-white/10"
            >
              Demleme teknikleri
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-4">
          {ilkeler.map((i) => (
            <div key={i.baslik}>
              <i.icon className="size-5 text-gold" />
              <h3 className="mt-6 text-lg">{i.baslik}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{i.metin}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-cream/40">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="eyebrow">Müfredat</p>
              <h2 className="mt-5 text-4xl lg:text-5xl">Kategoriler</h2>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Temel kavramlardan ileri demleme tekniklerine kadar adım adım ilerleyen bir öğrenme
                yolu.
              </p>
            </div>
            <Link
              to="/akademi/kategoriler"
              className="inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-gold"
            >
              Tümünü gör <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {kategoriler.map((k, i) => (
              <KategoriKarti key={k.slug} kategori={k} oncelikli={i < 3} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="eyebrow">FOR COFFEE Farkı</p>
            <h2 className="mt-5 text-4xl leading-tight lg:text-5xl">
              Katkı maddeleriyle değil, kahvenin doğal karakteriyle lezzet üretiriz.
            </h2>
            <p className="mt-8 text-base leading-relaxed text-muted-foreground">
              Kullandığınız makineyi ve demleme yöntemini dikkate alır, her siparişi doğru öğütüm ve
              uygun kavrum profiliyle hazırlarız. Amacımız sadece kahve göndermek değil; ilk
              fincandan itibaren en iyi sonucu almanıza yardımcı olmaktır.
            </p>
            <Link
              to="/akademi/kategoriler/$slug"
              params={{ slug: "kahveye-giris" }}
              className="mt-10 inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm transition-colors hover:border-gold hover:text-gold"
            >
              Kahveye giriş rehberi <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-3xl surface">
            <img
              src={kategoriler[1]!.gorsel}
              alt="Yeşil ve kavrulmuş kahve çekirdekleri"
              width={1024}
              height={768}
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
