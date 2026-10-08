import { ArrowRight } from "lucide-react";

const CoffeeBlog = () => (
  <section className="section-luxury" style={{ backgroundColor: "var(--bg)" }}>
    <div className="container-luxury">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Text */}
        <div className="space-y-4">
          <span className="heading-eyebrow">Tadım Defteri</span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Çekirdekten Fincana
            <br />
            Gerçek Hikayeler
          </h2>
          <div
            className="h-px w-12"
            style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-dark))" }}
          />
          <p
            className="text-sm md:text-base leading-relaxed max-w-md"
            style={{ color: "var(--text-secondary)" }}
          >
            Kahve çekirdeklerinin kokusundan demleme tekniklerinize, aroma notalarından fincana
            ulaşan son durak kadar kahveye dair her şey burada.
          </p>
          <button className="btn-primary group">
            Kahve Danışma & Destek
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* Image */}
        <div className="relative">
          <div
            className="aspect-[4/3] overflow-hidden"
            style={{
              borderRadius: "32px",
              border: "1px solid var(--border)",
              boxShadow: "0 16px 48px var(--shadow-strong)",
            }}
          >
            <img
              src="https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/02/ChatGPT-Image-4-Sub-2026-10_04_45.png"
              alt="For Coffee Blog"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          {/* Floating quote */}
          <div
            className="absolute -bottom-8 -left-4 lg:-left-8 p-6 max-w-xs hidden md:block"
            style={{
              borderRadius: "24px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 30px var(--shadow)",
            }}
          >
            <p
              className="font-serif text-base italic leading-snug"
              style={{ color: "var(--text-primary)" }}
            >
              "Kahve bir içecek değil, bir yolculuktur."
            </p>
            <p
              className="text-xs uppercase tracking-widest mt-3 font-semibold"
              style={{ color: "var(--accent)" }}
            >
              For Coffee
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CoffeeBlog;
