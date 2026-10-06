import { useMemo, useState, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  ShoppingCart,
  Menu,
  ShieldCheck,
  MessageSquare,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import ProductCard from "./ProductCard";
import {
  URUNLER,
  KATEGORILER,
  fiyatBicimle,
  enDusukFiyat,
  type KategoriSlug,
  type Urun,
} from "@/data/urunler";
import { useCart } from "@/context/CartContext";
import { useDebounce } from "@/hooks/use-debounce";

type SortOption = "varsayilan" | "fiyat-artan" | "fiyat-azalan" | "yeni" | "cok-satan";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "varsayilan", label: "Varsayılan" },
  { value: "fiyat-artan", label: "Fiyat: Artan" },
  { value: "fiyat-azalan", label: "Fiyat: Azalan" },
  { value: "yeni", label: "En Yeni" },
  { value: "cok-satan", label: "Çok Satan" },
];

const Shop = () => {
  const { toplamAdet, cekmeceAc } = useCart();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<KategoriSlug | "tümü">("tümü");
  const [sort, setSort] = useState<SortOption>("varsayilan");

  const debouncedSearch = useDebounce(search, 250);

  const handleCategoryChange = useCallback((slug: KategoriSlug | "tümü") => {
    setCategory(slug);
  }, []);

  const filtered = useMemo(() => {
    const query = debouncedSearch.trim().toLocaleLowerCase("tr-TR");
    const result = URUNLER.filter((product) => {
      const haystack = [
        product.ad,
        product.kisaAciklama,
        product.koken,
        product.bolge,
        ...product.etiketler,
        ...(product.demlemeOnerileri ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("tr-TR");
      return (
        (category === "tümü" || product.kategori === category) &&
        (!query || haystack.includes(query))
      );
    });

    const sorted = [...result];
    switch (sort) {
      case "fiyat-artan":
        sorted.sort((a, b) => enDusukFiyat(a) - enDusukFiyat(b));
        break;
      case "fiyat-azalan":
        sorted.sort((a, b) => enDusukFiyat(b) - enDusukFiyat(a));
        break;
      case "yeni":
        sorted.sort((a, b) => (b.yeni ? 1 : 0) - (a.yeni ? 1 : 0));
        break;
      case "cok-satan":
        sorted.sort((a, b) => (b.cokSatan ? 1 : 0) - (a.cokSatan ? 1 : 0));
        break;
    }
    return sorted;
  }, [debouncedSearch, category, sort]);

  const mobilKategoriler = KATEGORILER;
  const mobilUrunler = filtered.slice(0, 4);

  const activeCategoryName =
    category === "tümü"
      ? "Tüm ürünler"
      : (KATEGORILER.find((item) => item.slug === category)?.ad ?? "Tüm ürünler");

  return (
    <main
      className="desktop-storefront min-h-screen shop-page"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <section className="mobile-shop-top">
        <button type="button" aria-label="Menüyü aç" className="mobile-shop-icon">
          <Menu size={25} />
        </button>
        <span className="mobile-shop-brand">
          FOR COFFEE <small>ROASTERS</small>
        </span>
        <button
          type="button"
          aria-label="Sepeti aç"
          className="mobile-shop-icon"
          onClick={cekmeceAc}
        >
          <ShoppingCart size={24} />
          {toplamAdet > 0 && <b>{toplamAdet}</b>}
        </button>
      </section>
      <div className="mobile-shop-search">
        <Search size={20} />
        <input
          aria-label="Ürün ara"
          placeholder="Ürün ara..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <section className="mobile-shop-hero">
        <div>
          <span>Sınırlı Koleksiyon</span>
          <h1>
            Seyahat
            <br />
            Demlemeleri
          </h1>
          <button
            type="button"
            onClick={() =>
              document.getElementById("mobile-products")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Hemen İncele <ChevronRight size={16} />
          </button>
        </div>
      </section>
      <div className="mobile-shop-dots">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <section className="mobile-shop-categories" aria-label="Mağaza kategorileri">
        {mobilKategoriler.map((item) => (
          <button key={item.slug} type="button" onClick={() => handleCategoryChange(item.slug)}>
            <span className="mobile-shop-category-name">{item.ad.split(" ")[0]}</span>
            <strong>{item.ad}</strong>
          </button>
        ))}
      </section>
      <section id="mobile-products" className="mobile-shop-products">
        <div className="mobile-shop-section-title">
          <h2>Öne Çıkanlar</h2>
          <button type="button" onClick={() => handleCategoryChange("tümü")}>
            Tümünü Gör <ChevronRight size={16} />
          </button>
        </div>
        <div className="mobile-shop-grid">
          {mobilUrunler.map((product) => (
            <ProductCard
              key={product.id}
              title={product.ad}
              image={product.gorseller[0]}
              href={`/urun/${product.slug}`}
              price={fiyatBicimle(product.varyantlar[0]?.fiyat ?? 0)}
              origin={product.koken}
              badge={product.yeni ? "Yeni" : undefined}
            />
          ))}
        </div>
      </section>
      <div className="mobile-shop-filterbar">
        <button type="button">
          <SlidersHorizontal size={17} /> Fiyat Aralığı
        </button>
        <span />
        <button type="button">
          Marka <ChevronRight size={17} />
        </button>
      </div>
      <section className="mobile-shop-trust">
        <div>
          <ShieldCheck size={22} />
          <span>Güvenli Ödeme</span>
        </div>
        <div>
          <MessageSquare size={22} />
          <span>Müşteri Yorumları</span>
        </div>
      </section>
      <section className="container-luxury py-20 md:py-28 text-center desktop-shop-content">
        <span className="heading-eyebrow">FOR COFFEE Koleksiyonu</span>
        <h1
          className="text-4xl md:text-6xl font-serif font-semibold mt-3"
          style={{ color: "var(--text-primary)" }}
        >
          Mağaza
        </h1>
        <p
          className="max-w-xl mx-auto mt-5 text-sm md:text-base leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Taze kavrulmuş tek köken kahveler, dengeli harmanlar ve günlük ritüelinize eşlik edecek
          ekipmanlar.
        </p>
        <div className="desktop-shop-hero">
          <div className="desktop-shop-hero-copy">
            <span className="heading-eyebrow">Seyahat demlemeleri</span>
            <h2>
              Ritüelinizi
              <br />
              yanınıza alın.
            </h2>
            <p>Termoslar, öğütücüler ve demleme ekipmanlarıyla kahve anınızı her yerde koruyun.</p>
            <button type="button" onClick={() => handleCategoryChange("ekipman")}>
              Koleksiyonu keşfet <ChevronRight size={17} />
            </button>
          </div>
          <div className="desktop-shop-hero-orbit" aria-hidden="true">
            <span>
              FOR
              <br />
              COFFEE
            </span>
          </div>
        </div>
        <div className="desktop-shop-category-strip" aria-label="Kategoriler">
          {KATEGORILER.map((item) => (
            <button key={item.slug} type="button" onClick={() => handleCategoryChange(item.slug)}>
              {item.ad}
              <ChevronRight size={15} />
            </button>
          ))}
        </div>
      </section>
      <section className="container-luxury pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0">
            <div className="card-luxury p-5 lg:sticky lg:top-28">
              <div className="flex items-center gap-2 mb-5">
                <SlidersHorizontal size={16} style={{ color: "var(--accent)" }} />
                <span className="label-luxury">Filtrele</span>
              </div>
              <div className="relative mb-6">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  aria-label="Ürün ara"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Kahve, köken, tat..."
                  className="input-luxury pl-10"
                />
              </div>
              <div className="flex flex-col gap-1">
                <button
                  className="text-left px-3 py-2.5 rounded-lg text-sm"
                  style={{
                    backgroundColor: category === "tümü" ? "var(--accent)" : "transparent",
                    color:
                      category === "tümü" ? "var(--accent-foreground)" : "var(--text-secondary)",
                  }}
                  onClick={() => handleCategoryChange("tümü")}
                >
                  Tüm Ürünler
                </button>
                {KATEGORILER.map((item) => (
                  <button
                    key={item.slug}
                    className="text-left px-3 py-2.5 rounded-lg text-sm"
                    style={{
                      backgroundColor: category === item.slug ? "var(--accent)" : "transparent",
                      color:
                        category === item.slug
                          ? "var(--accent-foreground)"
                          : "var(--text-secondary)",
                    }}
                    onClick={() => handleCategoryChange(item.slug)}
                  >
                    {item.ad}
                  </button>
                ))}
              </div>
            </div>
          </aside>
          <div className="flex-1">
            <div className="flex items-end justify-between gap-4 mb-7">
              <div>
                <p className="text-xs uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                  {filtered.length} ürün
                </p>
                <h2 className="text-2xl font-serif mt-1" style={{ color: "var(--text-primary)" }}>
                  {activeCategoryName}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown size={15} style={{ color: "var(--text-muted)" }} />
                <select
                  aria-label="Sıralama"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="text-sm px-3 py-2 rounded-lg outline-none cursor-pointer"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {filtered.length ? (
              <div className="desktop-product-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((product: Urun) => (
                  <ProductCard
                    key={product.id}
                    title={product.ad}
                    image={product.gorseller[0]}
                    href={`/urun/${product.slug}`}
                    price={fiyatBicimle(product.varyantlar[0]?.fiyat ?? 0)}
                    origin={product.koken}
                    flavorNotes={product.tatProfili?.slice(0, 3).join(" · ")}
                    roastLevel={product.kavrum}
                    badge={product.yeni ? "Yeni" : product.cokSatan ? "Çok Satan" : undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="card-luxury p-12 text-center">
                <h2 className="font-serif text-xl" style={{ color: "var(--text-primary)" }}>
                  Ürün bulunamadı
                </h2>
                <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                  Aramanızı veya kategori seçiminizi değiştirin.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    handleCategoryChange("tümü");
                  }}
                  className="mt-4 px-5 py-2.5 text-sm font-medium rounded-lg"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "#fff",
                  }}
                >
                  Filtreleri temizle
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};
export default Shop;
