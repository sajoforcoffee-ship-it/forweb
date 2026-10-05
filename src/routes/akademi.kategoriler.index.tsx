import { createFileRoute } from "@tanstack/react-router";
import { KategoriKarti } from "@/components/site/KategoriKarti";
import { kategoriler } from "@/data/akademi";

export const Route = createFileRoute("/akademi/kategoriler/")({
  head: () => ({
    meta: [
      { title: "Kategoriler — FOR COFFEE Dijital Kahve Akademisi" },
      {
        name: "description",
        content:
          "Kahveye giriş, çekirdek, tek köken, harman, öğütme rehberi ve demleme teknikleri kategorileri.",
      },
      { property: "og:title", content: "Kategoriler — FOR COFFEE Akademi" },
      {
        property: "og:description",
        content: "Kahve eğitiminin tüm başlıkları tek bir yerde.",
      },
    ],
  }),
  component: KategorilerSayfasi,
});

function KategorilerSayfasi() {
  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-40 lg:px-10 lg:pt-48">
        <p className="eyebrow">Müfredat</p>
        <h1 className="mt-6 max-w-3xl text-5xl leading-[1.05] lg:text-6xl">
          Kahve eğitiminin tüm başlıkları
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
          Her kategori kendi derslerini içerir. Temelden başlayın veya doğrudan ilgilendiğiniz
          yöntemin rehberine geçin.
        </p>
        <div className="mt-14 gold-rule" />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {kategoriler.map((k, i) => (
            <KategoriKarti key={k.slug} kategori={k} oncelikli={i < 3} />
          ))}
        </div>
      </section>
    </div>
  );
}
