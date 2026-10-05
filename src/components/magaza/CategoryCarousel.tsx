import { Coffee, Leaf, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { KATEGORILER, URUNLER } from "@/data/urunler";

const icons = { "tek-koken": Coffee, harman: Coffee, cay: Leaf, ekipman: Zap } as const;

const CategoryCarousel = () => (
  <section className="container-luxury py-10">
    <div className="flex items-end justify-between mb-5">
      <div>
        <span className="heading-eyebrow">Koleksiyonu keşfet</span>
        <h2 className="text-2xl font-serif mt-2" style={{ color: "var(--text-primary)" }}>
          Kategoriler
        </h2>
      </div>
      <Link to="/magaza" className="text-sm" style={{ color: "var(--accent)" }}>
        Tümünü gör
      </Link>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {KATEGORILER.map((category) => {
        const Icon = icons[category.slug];
        const count = URUNLER.filter((product) => product.kategori === category.slug).length;
        return (
          <Link
            key={category.slug}
            to="/magaza"
            className="card-luxury p-5 flex items-center gap-3 hover:-translate-y-1 transition-transform"
          >
            <Icon size={22} style={{ color: "var(--accent)" }} />
            <span>
              <strong className="block text-sm" style={{ color: "var(--text-primary)" }}>
                {category.ad}
              </strong>
              <small style={{ color: "var(--text-muted)" }}>{count} ürün</small>
            </span>
          </Link>
        );
      })}
    </div>
  </section>
);
export default CategoryCarousel;
