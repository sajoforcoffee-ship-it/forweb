import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { useCart } from "@/context/CartContext";
import { fiyatBicimle } from "@/data/urunler";

/** Mini sepet çekmecesi — global, tüm sayfalarda erişilebilir. */
export default function SepetCekmecesi() {
  const { kalemler, cekmeceAcik, cekmeceKapat, adetAyarla, kaldir, araToplam, toplamAdet } =
    useCart();

  useEffect(() => {
    if (!cekmeceAcik) return;
    const oncekiOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") cekmeceKapat();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = oncekiOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [cekmeceAcik, cekmeceKapat]);

  return (
    <>
      {/* Arka plan karartma */}
      <div
        onClick={cekmeceKapat}
        aria-hidden={!cekmeceAcik}
        role="presentation"
        className={`cart-drawer-overlay transition-opacity duration-300 ${
          cekmeceAcik ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-label="Sepet"
        aria-modal={cekmeceAcik}
        className={`cart-drawer transition-transform duration-300 ease-out ${
          cekmeceAcik ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: "var(--bg-primary, hsl(var(--background)))" }}
      >
        <header className="cart-drawer-header" style={{ borderColor: "rgba(201,169,110,0.20)" }}>
          <h2 className="font-serif text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Sepetim
            <span className="ml-2 text-sm font-normal" style={{ color: "var(--text-muted)" }}>
              ({toplamAdet} ürün)
            </span>
          </h2>
          <button onClick={cekmeceKapat} aria-label="Sepeti kapat" className="cart-drawer-close">
            <X size={18} />
          </button>
        </header>

        {kalemler.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <ShoppingBag size={40} style={{ color: "var(--accent)" }} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Sepetiniz henüz boş. Taze kavrulmuş çekirdeklerimizi keşfedin.
            </p>
            <Link
              to="/magaza"
              onClick={cekmeceKapat}
              className="rounded-pill px-6 py-3 text-sm font-medium text-white"
              style={{ backgroundColor: "var(--accent)", borderRadius: 999 }}
            >
              Mağazaya git
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              {kalemler.map((k) => (
                <div key={k.anahtar} className="flex gap-4">
                  <div
                    className="h-24 w-20 shrink-0 overflow-hidden rounded-xl"
                    style={{ backgroundColor: "var(--bg-secondary)" }}
                  >
                    {k.gorsel && (
                      <img
                        src={k.gorsel}
                        alt={k.ad}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      to="/urun/$slug"
                      params={{ slug: k.slug }}
                      onClick={cekmeceKapat}
                      className="font-serif text-sm font-semibold leading-snug"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {k.ad}
                    </Link>
                    <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                      {k.varyantEtiket}
                      {k.ogutme ? ` · ${k.ogutme}` : ""}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div
                        className="flex items-center gap-3 rounded-pill border px-2 py-1"
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
                      <div className="flex items-center gap-3">
                        <span
                          className="font-serif text-sm font-semibold"
                          style={{ color: "var(--accent)" }}
                        >
                          {fiyatBicimle(k.fiyat * k.adet)}
                        </span>
                        <button
                          aria-label="Ürünü kaldır"
                          onClick={() => kaldir(k.anahtar)}
                          style={{ color: "var(--text-muted)" }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer
              className="space-y-4 border-t px-6 py-5"
              style={{ borderColor: "rgba(201,169,110,0.20)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Ara toplam
                </span>
                <span
                  className="font-serif text-xl font-semibold"
                  style={{ color: "var(--accent)" }}
                >
                  {fiyatBicimle(araToplam)}
                </span>
              </div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Kargo ve vergiler ödeme adımında hesaplanır.
              </p>
              <Link
                to="/sepet"
                onClick={cekmeceKapat}
                className="block w-full py-3 text-center text-sm font-medium text-white"
                style={{
                  backgroundColor: "var(--accent)",
                  borderRadius: "14px",
                  boxShadow: "0 4px 16px rgba(201,169,110,0.20)",
                }}
              >
                Sepete git
              </Link>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
