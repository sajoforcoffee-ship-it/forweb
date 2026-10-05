import { useEffect, useMemo, useState } from "react";
import { Lightbulb } from "lucide-react";

const statuses = [
  "Kahve verileri analiz ediliyor...",
  "Kahve profili hazırlanıyor...",
  "En uygun öğütüm bilgisi hesaplanıyor...",
  "Aroma özellikleri analiz ediliyor...",
  "Size özel kahve deneyimi hazırlanıyor...",
];

const facts = [
  "Taze öğütülmüş kahve, aromasını daha iyi korur.",
  "Espresso için öğütüm inceliği, kahvenin akış süresini doğrudan etkiler.",
  "Kahve çekirdeğinin menşei, aroma karakterini önemli ölçüde belirler.",
  "Doğru öğütüm, daha dengeli ve yoğun bir espresso deneyimi sağlar.",
  "Kavrulma tarihine yakın tüketilen kahve daha canlı aroma sunabilir.",
];

export default function AICoffeeIntelligence() {
  const [statusIndex, setStatusIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const statusTimer = window.setInterval(() => {
      setStatusIndex((current) => (current + 1) % statuses.length);
    }, 2800);
    const factTimer = window.setInterval(() => {
      setFactIndex((current) => (current + 1) % facts.length);
    }, 4200);

    return () => {
      window.clearInterval(statusTimer);
      window.clearInterval(factTimer);
    };
  }, []);

  const status = useMemo(() => statuses[statusIndex]!, [statusIndex]);
  const fact = useMemo(() => facts[factIndex]!, [factIndex]);

  return (
    <section className="ai-coffee-intelligence" aria-labelledby="ai-coffee-title">
      <div className="ai-coffee-orbit" aria-hidden="true">
        <div className="ai-coffee-orbit-ring ai-coffee-orbit-ring-one" />
        <div className="ai-coffee-orbit-ring ai-coffee-orbit-ring-two" />
        <div className="ai-coffee-signal ai-coffee-signal-one" />
        <div className="ai-coffee-signal ai-coffee-signal-two" />
        <div className="ai-coffee-particle ai-coffee-particle-one" />
        <div className="ai-coffee-particle ai-coffee-particle-two" />
        <div className="ai-coffee-particle ai-coffee-particle-three" />
      </div>

      <div className="ai-coffee-copy">
        <span className="ai-coffee-kicker">FOR COFFEE AI · Kahve Bilgisi</span>
        <h2 id="ai-coffee-title" key={status} className="ai-coffee-status">
          {status}
        </h2>
        <div className="ai-coffee-dots" aria-hidden="true">
          {statuses.map((_, index) => (
            <span key={index} className={index === statusIndex ? "is-active" : ""} />
          ))}
        </div>
      </div>

      <div className="ai-coffee-fact" key={fact}>
        <div className="ai-coffee-fact-icon" aria-hidden="true">
          <Lightbulb size={20} strokeWidth={1.5} />
        </div>
        <div>
          <span>Kahve bilgisi</span>
          <p>{fact}</p>
        </div>
      </div>
    </section>
  );
}
