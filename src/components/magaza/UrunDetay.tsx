import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Citrus,
  Flower2,
  Leaf,
  Sparkles,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import {
  benzerUrunler,
  enDusukFiyat,
  fiyatBicimle,
  stoktaVar,
  type OgutmeSecenegi,
  type Urun,
  type Varyant,
} from "@/data/urunler";
import { useCart } from "@/context/CartContext";

interface UrunDetayProps {
  urun: Urun;
}

function Rating({ urun }: { urun: Urun }) {
  if (!urun.puan || !urun.degerlendirmeSayisi) return null;
  return (
    <div
      className="product-rating"
      aria-label={`${urun.puan} puan, ${urun.degerlendirmeSayisi} değerlendirme`}
    >
      <span className="product-stars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} size={14} fill={n <= Math.round(urun.puan!) ? "currentColor" : "none"} />
        ))}
      </span>
      <span>
        {urun.puan.toFixed(1)} · {urun.degerlendirmeSayisi} değerlendirme
      </span>
    </div>
  );
}

export default function UrunDetay({ urun }: UrunDetayProps) {
  const { sepeteEkle, cekmeceAc, toplamAdet } = useCart();
  const [varyant, setVaryant] = useState<Varyant | null>(null);
  const [ogutme, setOgutme] = useState<OgutmeSecenegi | null>(null);
  const [adet, setAdet] = useState(1);
  const [gorselHatasi, setGorselHatasi] = useState(false);
  const [hata, setHata] = useState("");
  const [ekleniyor, setEkleniyor] = useState(false);
  const [aktifGorsel, setAktifGorsel] = useState(0);
  const benzerler = useMemo(() => benzerUrunler(urun, 4), [urun]);
  const stokta = stoktaVar(urun);
  const gorsel = urun.gorseller[aktifGorsel] ?? urun.gorseller[0];

  const sepeteEkleTikla = () => {
    if (!varyant) return setHata("Önce gramaj seçiniz.");
    if (!ogutme) return setHata("Öğütme seçeneği seçiniz.");
    if (!varyant.stok) return setHata("Bu gramaj şu anda stokta değil.");
    setHata("");
    setEkleniyor(true);
    sepeteEkle(urun, varyant, ogutme, adet);
    cekmeceAc();
    toast.success("Sepete eklendi", { description: urun.ad });
    window.setTimeout(() => setEkleniyor(false), 250);
  };

  return (
    <main className="product-detail-page">
      <header className="product-detail-header">
        <Link to="/magaza" className="product-back-link">
          <ArrowLeft size={18} /> Mağazaya dön
        </Link>
        <Link
          to="/sepet"
          className="product-cart-link"
          aria-label={`Sepeti aç, ${toplamAdet} ürün`}
        >
          <ShoppingCart size={20} />
          {toplamAdet > 0 && <b>{toplamAdet}</b>}
        </Link>
      </header>

      <section className="product-hero" aria-labelledby="product-title">
        <div className="product-gallery">
          <div className="product-main-image">
            {gorselHatasi ? (
              <div className="product-image-fallback">{urun.ad}</div>
            ) : (
              <img src={gorsel} alt={`${urun.ad} kahvesi`} onError={() => setGorselHatasi(true)} />
            )}
          </div>
          {urun.gorseller.length > 1 && (
            <div className="product-thumbnails">
              {urun.gorseller.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  className={index === aktifGorsel ? "active" : ""}
                  onClick={() => {
                    setAktifGorsel(index);
                    setGorselHatasi(false);
                  }}
                  aria-label={`${index + 1}. ürün görseli`}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {(urun.rakim || urun.isleme || urun.kavrum) && (
          <section className="product-section product-technical-section">
            <span className="section-kicker">Ürünün teknik özellikleri</span>
            <div className="technical-grid">
              {[
                ["Köken", urun.koken],
                ["Bölge", urun.bolge],
                ["Rakım", urun.rakim],
                ["İşleme", urun.isleme],
                ["Kavrum", urun.kavrum],
              ]
                .filter(([, value]) => value)
                .map(([label, value], index) => (
                  <div className="technical-card" key={label}>
                    <small>{String(index + 1).padStart(2, "0")}</small>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
            </div>
          </section>
        )}

        <div className="product-summary">
          <span className={stokta ? "product-stock in-stock" : "product-stock out-stock"}>
            {stokta ? "Stokta" : "Stokta yok"}
          </span>
          <span className="product-origin">
            {urun.koken}
            {urun.bolge ? ` · ${urun.bolge}` : ""}
          </span>
          <h1 id="product-title">{urun.ad}</h1>
          <Rating urun={urun} />
          <div className="product-about">
            <h2>Ürün hakkında</h2>
            <p>{urun.aciklama || urun.kisaAciklama}</p>
          </div>

          <fieldset className="product-option-group">
            <legend>Gramaj</legend>
            <div className="product-options">
              {urun.varyantlar.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={varyant?.id === item.id ? "selected" : ""}
                  onClick={() => {
                    setVaryant(item);
                    setHata("");
                  }}
                  disabled={item.stok <= 0}
                >
                  {item.etiket}
                  <small>{fiyatBicimle(item.fiyat)}</small>
                  {varyant?.id === item.id && <Check size={15} />}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className={`product-option-group ${!varyant ? "is-disabled" : ""}`}>
            <legend>Öğütme seçeneği</legend>
            <div className="product-options">
              {urun.ogutmeSecenekleri.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={ogutme === item ? "selected" : ""}
                  disabled={!varyant}
                  onClick={() => {
                    setOgutme(item);
                    setHata("");
                  }}
                >
                  {item}
                  {ogutme === item && <Check size={15} />}
                </button>
              ))}
            </div>
            {!varyant ? (
              <p className="option-hint">Öğütme seçeneklerini görmek için önce gramaj seçin.</p>
            ) : (
              <p className="option-hint">
                Öğütme, demleme yönteminize göre siparişinize özel hazırlanır.
              </p>
            )}
          </fieldset>
          <div className="product-quantity-row">
            <span>Miktar</span>
            <div className="quantity-control">
              <button
                type="button"
                onClick={() => setAdet((v) => Math.max(1, v - 1))}
                aria-label="Miktarı azalt"
              >
                <Minus size={16} />
              </button>
              <strong>{adet}</strong>
              <button
                type="button"
                onClick={() => setAdet((v) => Math.min(99, v + 1))}
                aria-label="Miktarı artır"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          {hata && (
            <p className="product-inline-error" role="alert">
              {hata}
            </p>
          )}
          <button
            type="button"
            className="product-add-button"
            onClick={sepeteEkleTikla}
            disabled={!stokta || ekleniyor}
          >
            {ekleniyor ? (
              "Sepete ekleniyor..."
            ) : (
              <>
                <ShoppingBag size={18} /> Sepete ekle{" "}
                <span>{fiyatBicimle((varyant?.fiyat ?? enDusukFiyat(urun)) * adet)}</span>
              </>
            )}
          </button>
        </div>
      </section>

      {urun.tatProfili?.length ? (
        <section className="product-section tasting-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Aroma ve tadım notları</span>
              <h2>Fincanınızda hissedebileceğiniz doğal aromalar</h2>
            </div>
          </div>
          <div className="tasting-notes-grid">
            {urun.tatProfili.map((not) => {
              const note = not.toLocaleLowerCase("tr-TR");
              const Icon = note.includes("yasemin")
                ? Flower2
                : note.includes("limon")
                  ? Citrus
                  : note.includes("çay")
                    ? Leaf
                    : Sparkles;
              return (
                <span className="tasting-note-item" key={not}>
                  <span className="tasting-note-icon" aria-hidden="true">
                    <Icon size={17} strokeWidth={1.5} />
                  </span>
                  <span>{not}</span>
                </span>
              );
            })}
          </div>
        </section>
      ) : null}

      {benzerler.length > 0 && (
        <section className="product-section related-section">
          <div className="section-heading">
            <span className="section-kicker">Benzer ürünler</span>
            <Link to="/magaza">
              Tümünü gör <ChevronRight size={16} />
            </Link>
          </div>
          <div className="related-grid">
            {benzerler.map((item) => (
              <Link
                to="/urun/$slug"
                params={{ slug: item.slug }}
                className="related-card"
                key={item.id}
              >
                <div className="related-image">
                  {item.gorseller[0] ? (
                    <img src={item.gorseller[0]} alt={`${item.ad} kahvesi`} />
                  ) : (
                    <span>{item.ad}</span>
                  )}
                </div>
                <span>{item.koken}</span>
                <h3>{item.ad}</h3>
                <strong>{fiyatBicimle(enDusukFiyat(item))}</strong>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
