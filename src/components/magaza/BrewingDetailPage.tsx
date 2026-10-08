import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  Droplets,
  Gauge,
  Scale,
  Timer,
  Thermometer,
} from "lucide-react";
import type { BrewingMethod } from "@/data/demleme";
import { DEMLEME_YONTEMLERI, demlemeUrl } from "@/data/demleme";

export default function BrewingDetailPage({ method }: { method: BrewingMethod }) {
  const related = DEMLEME_YONTEMLERI.filter((item) => item.slug !== method.slug);
  return (
    <main
      className="method-detail"
      style={{ "--method-accent": method.color } as React.CSSProperties}
    >
      <section className="method-detail-hero">
        <div className="method-hero-overlay" />
        <div className="method-detail-content">
          <Link className="method-back" to="/demleme">
            <ArrowLeft size={16} /> Tüm yöntemler
          </Link>
          <span className="brewing-eyebrow">
            <span /> Demleme Rehberi · {method.name}
          </span>
          <h1>{method.title}</h1>
          <p>{method.description}</p>
          <a className="brewing-primary-button" href="#recipe">
            Reçeteyi keşfet <ArrowDown size={16} />
          </a>
        </div>
        <div className="method-quick-grid">
          {[
            { Icon: Timer, value: method.duration, label: "Süre" },
            { Icon: Gauge, value: method.grind, label: "Öğütme" },
            { Icon: Scale, value: method.ratio, label: "Oran" },
            { Icon: Thermometer, value: method.temperature, label: "Su" },
          ].map(({ Icon, value, label }) => (
            <div key={label}>
              <Icon size={17} />
              <strong>{value}</strong>
              <small>{label}</small>
            </div>
          ))}
        </div>
      </section>
      <section className="brewing-section method-intro">
        <div className="brewing-section-heading">
          <span className="brewing-eyebrow">01 · Temeller</span>
          <h2>{method.name} nedir?</h2>
        </div>
        <p>
          {method.description} Bu yöntemde doğru öğütüm, su ve zaman dengesi fincan karakterini
          belirler. Kendi damak zevkinize göre küçük değişikliklerle tarifi
          kişiselleştirebilirsiniz.
        </p>
      </section>
      <section className="brewing-section brewing-dark-section">
        <div className="brewing-section-heading">
          <span className="brewing-eyebrow">02 · Hazırlık</span>
          <h2>İhtiyacınız olanlar</h2>
        </div>
        <div className="equipment-grid">
          {method.equipment.map((item, index) => (
            <article className="equipment-card" key={item}>
              <span className="equipment-number">0{index + 1}</span>
              <Droplets size={24} />
              <h3>{item}</h3>
              <p>
                Doğru ekipman, yöntemin karakterini fincana taşıyan kontrollü bir başlangıç sağlar.
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="brewing-section">
        <div className="brewing-section-heading">
          <span className="brewing-eyebrow">03 · Reçete</span>
          <h2>Her seferinde tekrarlanabilir bir fincan</h2>
        </div>
        <div id="recipe" className="method-recipe">
          <div>
            <span>Kahve</span>
            <strong>{method.coffee}</strong>
          </div>
          <div>
            <span>Su</span>
            <strong>{method.water}</strong>
          </div>
          <div>
            <span>Sıcaklık</span>
            <strong>{method.temperature}</strong>
          </div>
          <div>
            <span>Öğütme</span>
            <strong>{method.grind}</strong>
          </div>
          <div>
            <span>Süre</span>
            <strong>{method.duration}</strong>
          </div>
          <div>
            <span>Karakter</span>
            <strong>{method.character}</strong>
          </div>
        </div>
        <div className="grind-scale">
          {["Çok ince", "İnce", "Orta ince", "Orta", "Orta kalın", "Kalın"].map((label) => (
            <div
              className={label.toLowerCase() === method.grind.toLowerCase() ? "active" : ""}
              key={label}
            >
              <span />
              {label}
            </div>
          ))}
        </div>
      </section>
      <section className="brewing-section steps-section">
        <div className="brewing-section-heading">
          <span className="brewing-eyebrow">04 · Uygulama</span>
          <h2>Adım adım demleme</h2>
        </div>
        <div className="steps-list">
          {method.steps.map((step, index) => (
            <article className="brew-step" key={step}>
              <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
              <p>{step}</p>
              <Check size={17} />
            </article>
          ))}
        </div>
      </section>
      <section className="brewing-section brewing-dark-section">
        <div className="brewing-section-heading">
          <span className="brewing-eyebrow">05 · Fincan</span>
          <h2>Tat profili</h2>
        </div>
        <div className="notes-pills">
          {method.notes.map((note) => (
            <span key={note}>{note}</span>
          ))}
        </div>
        <div className="brewing-tip">
          <div>
            <span className="brewing-eyebrow">Barista ipucu</span>
            <h2>Suyu ve zamanı sabit tutun.</h2>
            <p>
              Aynı kahveyi farklı günlerde karşılaştırırken önce reçeteyi değiştirmeyin; tek
              değişkeni kontrollü biçimde ayarlayın.
            </p>
          </div>
        </div>
      </section>
      <section className="brewing-section">
        <div className="brewing-section-heading">
          <span className="brewing-eyebrow">06 · Sorun çözme</span>
          <h2>Sık yapılan hatalar</h2>
        </div>
        <div className="mistakes-grid">
          {method.errors.map(([problem, reason, solution]) => (
            <details key={problem}>
              <summary>
                {problem}
                <ArrowDown size={16} />
              </summary>
              <p>
                <b>Neden:</b> {reason}
              </p>
              <p>
                <b>Çözüm:</b> {solution}
              </p>
            </details>
          ))}
        </div>
      </section>
      <section className="brewing-section other-methods">
        <div className="brewing-section-heading">
          <span className="brewing-eyebrow">07 · Keşfet</span>
          <h2>Diğer yöntemler</h2>
        </div>
        <div className="other-methods-grid">
          {related.map((item) => (
            <Link className="other-method-card" to={demlemeUrl(item.slug)} key={item.slug}>
              <span>{item.name}</span>
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
