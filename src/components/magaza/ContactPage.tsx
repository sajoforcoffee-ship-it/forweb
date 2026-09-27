import { useState } from "react";
import {
  Phone,
  Mail,
  Send,
  Instagram,
  Facebook,
  Clock,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

const ContactPage = () => {
  const [formStatus, setFormStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("success");
    setTimeout(() => setFormStatus("idle"), 4000);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}
    >
      {/* Hero */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=2070"
            alt="İletişim"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.70) 0%, rgba(201,169,110,0.30) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <span
            className="text-xs font-semibold uppercase tracking-[0.25em] block mb-4"
            style={{ color: "#C9A96E" }}
          >
            Bize Ulaşın
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-semibold text-white mb-6 leading-tight">
            Kahve Hakkında
            <br />
            Konuşalım
          </h1>
          <div
            className="h-px w-12 mx-auto"
            style={{ background: "linear-gradient(90deg, transparent, #C9A96E, transparent)" }}
          />
        </div>
      </section>

      <main className="flex-grow container-luxury py-16 md:py-20 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Info panel */}
          <div className="lg:col-span-4">
            <div className="card-glass p-8">
              <h3
                className="text-lg font-serif font-semibold mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                İletişim Kanalları
              </h3>
              <div className="space-y-6">
                {[
                  {
                    icon: Phone,
                    label: "Telefon",
                    value: "+90 (544) 918 61 72",
                    href: "tel:+905449186172",
                  },
                  {
                    icon: Mail,
                    label: "E-Posta",
                    value: "info@forcoffeetr.com",
                    href: "mailto:info@forcoffeetr.com",
                  },
                  { icon: Clock, label: "Çalışma Saatleri", value: "Hafta İçi 09:00 – 18:00" },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div
                      className="p-3"
                      style={{
                        borderRadius: "14px",
                        backgroundColor: "rgba(201,169,110,0.10)",
                        color: "var(--accent)",
                      }}
                    >
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p
                        className="text-[10px] uppercase tracking-widest font-semibold"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="font-medium transition-colors"
                          style={{ color: "var(--text-primary)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "var(--text-primary)")
                          }
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                          {value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  {
                    icon: Instagram,
                    href: "https://instagram.com/forcoffeetrr",
                    label: "Instagram",
                  },
                  {
                    icon: Facebook,
                    href: "https://www.facebook.com/share/185LhQcMCh/",
                    label: "Facebook",
                  },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-4 transition-all duration-300"
                    style={{
                      borderRadius: "14px",
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.color = "var(--accent)";
                      e.currentTarget.style.backgroundColor = "rgba(201,169,110,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <Icon size={22} strokeWidth={1.5} />
                    <span className="text-[10px] font-semibold mt-2 uppercase tracking-widest">
                      {label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-8">
            <div className="card-luxury p-8 md:p-12">
              {formStatus === "success" ? (
                <div className="flex flex-col items-center justify-center text-center py-16">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                    style={{ backgroundColor: "rgba(201,169,110,0.12)", color: "var(--accent)" }}
                  >
                    <Send size={32} strokeWidth={1.5} />
                  </div>
                  <h3
                    className="text-3xl font-serif font-semibold mb-4"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Mesajınız Alındı!
                  </h3>
                  <p style={{ color: "var(--text-secondary)" }}>En kısa sürede size döneceğiz.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <span className="heading-eyebrow">İletişim Formu</span>
                    <h2
                      className="text-2xl font-serif font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Bize Yazın
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="label-luxury">Ad Soyad *</label>
                      <input
                        type="text"
                        required
                        placeholder="Adınız Soyadınız"
                        className="input-luxury"
                      />
                    </div>
                    <div>
                      <label className="label-luxury">E-Posta *</label>
                      <input
                        type="email"
                        required
                        placeholder="ornek@mail.com"
                        className="input-luxury"
                      />
                    </div>
                    <div>
                      <label className="label-luxury">Telefon</label>
                      <input type="tel" placeholder="05XX XXX XX XX" className="input-luxury" />
                    </div>
                    <div>
                      <label className="label-luxury">Konu *</label>
                      <div className="relative">
                        <select required className="select-luxury">
                          <option value="">Konu seçiniz</option>
                          {[
                            "Eğitim & Atölye",
                            "Toptan Satış / B2B",
                            "Danışmanlık",
                            "Sipariş Desteği",
                            "Öneri & İş Birliği",
                            "Diğer",
                          ].map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                        <ChevronDown
                          size={15}
                          className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ color: "var(--text-muted)" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="label-luxury">Mesajınız *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Mesajınızı yazın..."
                      className="input-luxury resize-none"
                    />
                  </div>
                  <button type="submit" className="btn-primary group">
                    Gönder{" "}
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Banner */}
        <div
          className="mt-16 h-[300px] overflow-hidden relative group"
          style={{
            borderRadius: "32px",
            border: "1px solid var(--border)",
            boxShadow: "0 16px 48px var(--shadow)",
          }}
        >
          <img
            src="https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/02/Ana-Sayfa-Akademi-Blog-Iletisim-3.png"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            alt="For Coffee"
          />
          <div
            className="absolute inset-0 flex items-end p-10"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)" }}
          >
            <p className="text-white text-2xl md:text-3xl font-serif italic">
              "En iyi kahve, tutkuyla paylaşılandır."
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
