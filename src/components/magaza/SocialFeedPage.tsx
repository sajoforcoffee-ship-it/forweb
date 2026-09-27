import { useEffect } from "react";

const SocialFeedPage = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.curator.io/published/1e7402ac-6879-4971-8143-3bd0c3093dcc.js";
    script.async = true;
    script.charset = "UTF-8";
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg)" }}>
      {/* Hero */}
      <section
        className="py-20 md:py-28 text-center px-4"
        style={{
          background: "linear-gradient(135deg, var(--bg) 0%, var(--bg-secondary) 100%)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container-luxury">
          <span className="heading-eyebrow">Topluluk</span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold italic mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Sosyal Medyada For Coffee
          </h1>
          <div className="divider-accent my-4" />
          <p
            className="max-w-2xl mx-auto text-sm md:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            Instagram ve Facebook paylaşımlarımız anlık olarak burada.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            {["#FORCOFFEE", "#KAHVEYEBAĞLAN"].map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold tracking-widest uppercase px-5 py-2.5 rounded-pill transition-all duration-300"
                style={{
                  border: "1px solid rgba(201,169,110,0.30)",
                  color: "var(--accent)",
                  backgroundColor: "rgba(201,169,110,0.06)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <main className="flex-grow container-luxury py-12 md:py-16">
        <div
          className="p-4 md:p-8 min-h-[600px]"
          style={{
            borderRadius: "24px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "0 8px 30px var(--shadow)",
          }}
        >
          <div id="curator-feed-default-feed-layout">
            <a
              href="https://curator.io"
              target="_blank"
              rel="noreferrer"
              className="crt-logo crt-tag"
              style={{ color: "var(--text-muted)" }}
            >
              Powered by Curator.io
            </a>
          </div>
        </div>
      </main>

      <div className="container-luxury mb-16">
        <div
          className="relative h-[280px] overflow-hidden group"
          style={{
            borderRadius: "32px",
            border: "1px solid var(--border)",
            boxShadow: "0 16px 48px var(--shadow)",
          }}
        >
          <img
            src="https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/02/Ana-Sayfa-Akademi-Blog-Iletisim-3.png"
            alt="For Coffee"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0 flex items-center justify-center p-8"
            style={{ background: "rgba(0,0,0,0.55)" }}
          >
            <p className="text-white text-2xl md:text-3xl font-serif italic text-center">
              "En iyi kahve, tutkuyla paylaşılandır."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialFeedPage;
