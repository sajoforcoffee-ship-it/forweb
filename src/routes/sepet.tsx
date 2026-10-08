import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useCart } from "@/context/CartContext";
import { fiyatBicimle } from "@/data/urunler";

export const Route = createFileRoute("/sepet")({
  head: () => ({
    meta: [
      { title: "Sepetim — FOR COFFEE" },
      {
        name: "description",
        content:
          "Seçtiğiniz taze kavrulmuş kahveleri gözden geçirin, gramaj ve öğütme tercihlerinizi kontrol edip siparişinizi tamamlayın.",
      },
      { property: "og:title", content: "Sepetim | FOR COFFEE" },
      {
        property: "og:description",
        content: "Sepetinizdeki kahveleri inceleyin ve siparişinizi tamamlayın.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SepetSayfasi,
});

function SepetSayfasi() {
  const { kalemler, adetAyarla, kaldir, temizle, araToplam } = useCart();
  const kargo = araToplam > 0 && araToplam < 750 ? 79 : 0;

  return (
    <div className="desktop-storefront mx-auto max-w-6xl px-6 py-16 md:py-28 desktop-page-space">
      <nav className="mb-6 text-xs" style={{ color: "var(--text-muted)" }}>
        <Link to="/">Ana Sayfa</Link> <span className="mx-2">/</span>
        <Link to="/magaza">Mağaza</Link> <span className="mx-2">/</span>
        <span style={{ color: "var(--text-secondary)" }}>Sepet</span>
      </nav>

      <h1
        className="mb-10 font-serif text-3xl font-semibold md:text-4xl"
        style={{ color: "var(--text-primary)" }}
      >
        Sepetim
      </h1>

      {kalemler.length === 0 ? (
        <div className="flex flex-col items-center gap-5 py-20 text-center">
          <ShoppingBag size={44} style={{ color: "var(--accent)" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Sepetiniz boş. Tek köken çekirdeklerimizi ve harmanlarımızı keşfedin.
          </p>
          <Link
            to="/magaza"
            className="px-8 py-3 text-sm font-medium text-white"
            style={{ backgroundColor: "var(--accent)", borderRadius: "14px" }}
          >
            Mağazaya git
          </Link>
        </div>
      ) : (
        <div className="desktop-cart-layout grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            {kalemler.map((k) => (
              <div
                key={k.anahtar}
                className="flex gap-5 border-b pb-6"
                style={{ borderColor: "rgba(201,169,110,0.18)" }}
              >
                <div
                  className="h-32 w-24 shrink-0 overflow-hidden rounded-xl"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  {k.gorsel && (
                    <img
                      src={k.gorsel}
                      alt={`${k.ad} ürün görseli`}
                      width={96}
                      height={128}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <Link
                    to="/urun/$slug"
                    params={{ slug: k.slug }}
                    className="font-serif text-lg font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {k.ad}
                  </Link>
                  <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                    {k.varyantEtiket}
                    {k.ogutme ? ` · ${k.ogutme}` : ""}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                    <div
                      className="flex items-center gap-4 border px-3 py-1.5"
                      style={{ borderColor: "rgba(201,169,110,0.25)", borderRadius: 999 }}
                    >
                      <button
                        aria-label="Adet azalt"
                        onClick={() => adetAyarla(k.anahtar, k.adet - 1)}
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                        {k.adet}
                      </span>
                      <button
                        aria-label="Adet artır"
                        onClick={() => adetAyarla(k.anahtar, k.adet + 1)}
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className="font-serif text-lg font-semibold"
                        style={{ color: "var(--accent)" }}
                      >
                        {fiyatBicimle(k.fiyat * k.adet)}
                      </span>
                      <button
                        aria-label="Ürünü kaldır"
                        onClick={() => kaldir(k.anahtar)}
                        style={{ color: "var(--text-muted)" }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={temizle}
              className="text-xs underline"
              style={{ color: "var(--text-muted)" }}
            >
              Sepeti boşalt
            </button>
          </div>

          <aside
            className="desktop-cart-summary h-fit space-y-4 border p-6"
            style={{ borderColor: "rgba(201,169,110,0.22)", borderRadius: "18px" }}
          >
            <h2
              className="font-serif text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Sipariş özeti
            </h2>
            <div
              className="flex justify-between text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <span>Ara toplam</span>
              <span>{fiyatBicimle(araToplam)}</span>
            </div>
            <div
              className="flex justify-between text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <span>Kargo</span>
              <span>{kargo === 0 ? "Ücretsiz" : fiyatBicimle(kargo)}</span>
            </div>
            <div
              className="flex justify-between border-t pt-4"
              style={{ borderColor: "rgba(201,169,110,0.22)" }}
            >
              <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                Toplam
              </span>
              <span className="font-serif text-xl font-semibold" style={{ color: "var(--accent)" }}>
                {fiyatBicimle(araToplam + kargo)}
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              750 TL ve üzeri siparişlerde kargo ücretsizdir.
            </p>
            <button
              className="w-full py-3 text-sm font-medium text-white"
              style={{
                backgroundColor: "var(--accent)",
                borderRadius: "14px",
                boxShadow: "0 4px 16px rgba(201,169,110,0.20)",
              }}
            >
              Ödemeye geç
            </button>
            <Link
              to="/magaza"
              className="block text-center text-xs underline"
              style={{ color: "var(--text-muted)" }}
            >
              Alışverişe devam et
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
