import { ArrowRight, Timer, Gauge, Flame } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { DEMLEME_YONTEMLERI, demlemeUrl } from "@/data/demleme";

export default function BrewingPage() {
  return (
    <main className="brewing-guide">
      <section className="brewing-hero brewing-index-hero">
        <div className="brewing-hero-media" />
        <div className="brewing-hero-content">
          <span className="brewing-eyebrow">
            <span /> Demleme Yöntemleri
          </span>
          <h1>
            Mükemmel kahveyi <em>kendi yönteminle</em> demle.
          </h1>
          <p>
            Her yöntem farklı aromalar, gövde ve tat deneyimleri sunar. Sana en uygun yöntemi
            keşfet.
          </p>
        </div>
      </section>
      <section className="brewing-section">
        <div className="brewing-section-heading">
          <span className="brewing-eyebrow">Yöntemleri keşfet</span>
          <h2>Fincan karakterini sen seç.</h2>
        </div>
        <div className="method-index-grid">
          {DEMLEME_YONTEMLERI.map((method) => (
            <Link
              className="method-index-card"
              to={demlemeUrl(method.slug)}
              key={method.slug}
              style={{ "--method-accent": method.color } as React.CSSProperties}
            >
              <div className="method-card-art" />
              <div className="method-card-copy">
                <span className="brewing-eyebrow">{method.name}</span>
                <h3>{method.short}</h3>
                <div className="method-card-meta">
                  <span>
                    <Timer size={14} /> {method.duration}
                  </span>
                  <span>
                    <Gauge size={14} /> {method.grind}
                  </span>
                  <span>
                    <Flame size={14} /> {method.difficulty}
                  </span>
                </div>
                <span className="method-card-link">
                  Rehberi keşfet <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
