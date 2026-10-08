import { createFileRoute, notFound } from "@tanstack/react-router";
import { urunGetirSlug } from "@/data/urunler";
import UrunDetay from "@/components/magaza/UrunDetay";

export const Route = createFileRoute("/urun/$slug")({
  loader: ({ params }) => {
    const urun = urunGetirSlug(params.slug);
    if (!urun) throw notFound();
    return urun;
  },
  head: ({ loaderData }) => {
    const urun = loaderData;
    if (!urun) {
      return {
        meta: [{ title: "Ürün bulunamadı — FOR COFFEE" }, { name: "robots", content: "noindex" }],
      };
    }
    const gorsel = urun.gorseller[0];
    return {
      meta: [
        { title: `${urun.ad} — FOR COFFEE Mağaza` },
        { name: "description", content: urun.kisaAciklama },
        { property: "og:title", content: `${urun.ad} | FOR COFFEE` },
        { property: "og:description", content: urun.kisaAciklama },
        { property: "og:type", content: "product" },
        ...(gorsel
          ? [
              { property: "og:image", content: gorsel },
              { name: "twitter:image", content: gorsel },
            ]
          : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/urun/${urun.slug}` }],
    };
  },
  component: UrunDetaySayfasi,
});

function UrunDetaySayfasi() {
  const urun = Route.useLoaderData();
  const varyant = urun.varyantlar[0];
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: urun.ad,
    description: urun.kisaAciklama,
    image: urun.gorseller,
    sku: String(urun.id),
    brand: { "@type": "Brand", name: "FOR COFFEE" },
    offers: {
      "@type": "Offer",
      url: `/urun/${urun.slug}`,
      priceCurrency: "TRY",
      price: varyant?.fiyat,
      availability:
        (varyant?.stok ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };
  return (
    <>
      <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
      <UrunDetay key={urun.slug} urun={urun} />
    </>
  );
}
