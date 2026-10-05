import { useState, useRef, useEffect, useCallback, type PointerEvent } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: number;
  title: string;
  video: string;
  url: string;
  origin: string;
  flavorNotes: string;
  roastLevel: string;
  accent: string;
}

const products: Product[] = [
  {
    id: 1,
    title: "Guatemala Antigua",
    video: "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/07/guatemalaa.mp4",
    url: "https://www.forcoffeetr.com/magaza/urunler/kahvelerimiz/single-origin/guatemala-antigua/",
    origin: "Guatemala",
    flavorNotes: "Kakao, baharat, tam gövde",
    roastLevel: "Orta",
    accent: "#4A7FB5",
  },
  {
    id: 2,
    title: "Geleneksel Türk Kahvesi",
    video: "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/07/turkk.mp4",
    url: "https://www.forcoffeetr.com/magaza/urunler/kahvelerimiz/single-origin/turkish-coffee/",
    origin: "Türkiye",
    flavorNotes: "Geleneksel, yoğun, kadifemsi",
    roastLevel: "Koyu",
    accent: "#E86A5C",
  },
  {
    id: 3,
    title: "Kenya A.A.",
    video: "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/07/kenyaa.mp4",
    url: "https://www.forcoffeetr.com/magaza/urunler/kahvelerimiz/single-origin/kenya-aa/",
    origin: "Kenya",
    flavorNotes: "Siyah üzüm, bergamot, parlak asidite",
    roastLevel: "Orta-Açık",
    accent: "#F4B860",
  },
  {
    id: 4,
    title: "Colombia Supremo",
    video: "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/07/colombiaa.mp4",
    url: "https://www.forcoffeetr.com/magaza/urunler/kahvelerimiz/single-origin/colombia-supremo/",
    origin: "Kolombiya",
    flavorNotes: "Karamel, fındık, dengeli asidite",
    roastLevel: "Orta",
    accent: "#5BBF8A",
  },
  {
    id: 5,
    title: "Uganda Bigusi",
    video: "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/07/ugandaa.mp4",
    url: "https://www.forcoffeetr.com/magaza/urunler/kahvelerimiz/single-origin/uganda-bigusi/",
    origin: "Uganda",
    flavorNotes: "Koyu meyve, toprak notaları, tam gövde",
    roastLevel: "Orta-Koyu",
    accent: "#B48CFF",
  },
];

const AUTO_ADVANCE_MS = 6000;

export default function App({ onShopClick }: { onShopClick?: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const dragState = useRef<{ startX: number; active: boolean; moved: boolean }>({
    startX: 0,
    active: false,
    moved: false,
  });

  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const trackRef = useRef<HTMLDivElement | null>(null);

  const goTo = useCallback(
    (idx: number) => setCurrentIndex(((idx % products.length) + products.length) % products.length),
    [],
  );

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => setCurrentIndex((i) => (i + 1) % products.length), AUTO_ADVANCE_MS);
    return () => clearInterval(t);
  }, [isPaused, currentIndex]);

  // Sadece ortadaki aktif videoyu oynat, diğerlerini durdur ve ilk kareye sar
  useEffect(() => {
    const activeId = products[currentIndex]!.id;

    Object.entries(videoRefs.current).forEach(([id, el]) => {
      if (!el) return;

      try {
        if (Number(id) === activeId) {
          // Ortaya gelen aktif video: baştan başlat ve oynat
          el.currentTime = 0;
          const playPromise = el.play();

          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              // Otomatik oynatma engellemelerini sessizce yakala
              console.log("Video otomatik başlatılamadı:", error);
            });
          }
        } else {
          // Kenardaki pasif videolar: durdur ve ilk kareye dön (sabit resim efekti)
          el.pause();
          el.currentTime = 0;
        }
      } catch (err) {
        console.error("Video kontrol hatası:", err);
      }
    });
  }, [currentIndex]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragState.current = { startX: e.clientX, active: true, moved: false };
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    setIsPaused(true);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 4) dragState.current.moved = true;
    setDragOffset(dx);
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    const dx = e.clientX - dragState.current.startX;
    dragState.current.active = false;
    setDragOffset(0);
    if (dx < -60) next();
    else if (dx > 60) prev();
    setTimeout(() => setIsPaused(false), 300);
  };

  const active = products[currentIndex]!;

  return (
    <section
      className="relative overflow-hidden py-10 md:py-14"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      {/* Soft accent glow follows active card */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(60% 55% at 70% 40%, ${active.accent}33 0%, transparent 65%)`,
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-6 md:px-10">
        {/* Heading */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr] md:items-end md:gap-16">
          <div className="flex items-center gap-2 md:pb-2">
            <span
              className="inline-block h-px w-8"
              style={{ backgroundColor: "color-mix(in srgb, var(--text) 35%, transparent)" }}
            />
            <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[color:color-mix(in_srgb,var(--text)_70%,transparent)]">
              Çok Satanlar
            </span>
          </div>
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            <span style={{ color: products[0]!.accent }}>Guatemala</span>
            <span style={{ color: "var(--text)" }}>, </span>
            <span style={{ color: products[1]!.accent }}>Türk kahvesi</span>
            <span style={{ color: "var(--text)" }}>, </span>
            <span style={{ color: products[2]!.accent }}>Kenya</span>
            <span style={{ color: "var(--text)" }}> ve </span>
            <span style={{ color: products[3]!.accent }}>Kolombiya</span>
            <span style={{ color: "var(--text)" }}> yolculuğunda en özel çekirdekleri keşfet.</span>
          </h2>
        </div>

        {/* Carousel track */}
        <div
          className="relative mt-6 md:mt-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={trackRef}
            className="relative h-[520px] cursor-grab select-none touch-pan-y active:cursor-grabbing md:h-[640px]"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            {products.map((p, index) => {
              // Signed distance so cards fan out both sides of the active one
              let diff = index - currentIndex;
              const half = products.length / 2;
              if (diff > half) diff -= products.length;
              if (diff < -half) diff += products.length;

              const isActive = diff === 0;
              const absDiff = Math.abs(diff);
              const visible = absDiff <= 2;

              // Layout: fan of tilted cards, active centered, siblings to sides
              const translateX = diff * 260 + dragOffset * 0.6;
              const translateY = absDiff * 24;
              const rotate = diff * -6;
              const scale = isActive ? 1 : 1 - absDiff * 0.08;

              return (
                <a
                  key={p.id}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!isActive || dragState.current.moved) e.preventDefault();
                    if (!isActive && !dragState.current.moved) goTo(index);
                  }}
                  className="absolute left-1/2 top-1/2 aspect-[2/3] w-[280px] overflow-hidden rounded-[28px] md:w-[360px]"
                  style={{
                    marginLeft: "-140px",
                    marginTop: "-210px",
                    transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotate}deg) scale(${scale})`,
                    opacity: visible ? (isActive ? 1 : 0.7 - absDiff * 0.15) : 0,
                    zIndex: 30 - absDiff,
                    pointerEvents: isActive ? "auto" : visible ? "auto" : "none", // Allow clicking on side cards to go to them
                    backgroundColor: "var(--surface)",
                    boxShadow: isActive
                      ? `0 40px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), 0 0 60px -20px ${p.accent}55`
                      : "0 20px 50px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
                    transition:
                      "transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease, box-shadow 0.5s ease",
                  }}
                >
                  {/* Accent wash background so entire video is visible without cropping */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(160deg, ${p.accent}30 0%, color-mix(in oklab, var(--bg) 92%, transparent) 70%)`,
                    }}
                  />
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current[p.id] = el;
                    }}
                    src={p.video}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ opacity: 0.95 }}
                  />

                  {/* Bottom gradient + text */}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 0%, rgba(11,10,8,0.85) 60%, rgba(11,10,8,0.98) 100%)",
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                    <span
                      className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.3em]"
                      style={{ color: p.accent }}
                    >
                      {p.origin} · {p.roastLevel}
                    </span>
                    <h3 className="mb-2 text-xl font-semibold leading-tight text-white md:text-2xl">
                      {p.title}
                    </h3>
                    <p className="mb-4 text-xs leading-relaxed text-white/70 md:text-sm">
                      {p.flavorNotes}
                    </p>
                    <span
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
                      style={{
                        backgroundColor: "var(--accent)",
                        color: "var(--accent-foreground)",
                      }}
                    >
                      İncele <ArrowRight size={12} />
                    </span>
                  </div>
                </a>
              );
            })}

            <button
              onClick={(e) => {
                e.preventDefault();
                prev();
              }}
              aria-label="Önceki"
              className="absolute left-2 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition-colors md:left-6 hover:bg-white/20"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                next();
              }}
              aria-label="Sonraki"
              className="absolute right-2 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition-colors md:right-6 hover:bg-white/20"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Progress bars */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {products.map((p, index) => (
              <button
                key={p.id}
                onClick={() => goTo(index)}
                aria-label={p.title}
                className="relative h-1 overflow-hidden rounded-full transition-all duration-500"
                style={{
                  width: index === currentIndex ? "44px" : "8px",
                  backgroundColor: "color-mix(in srgb, var(--text) 15%, transparent)",
                }}
              >
                {index === currentIndex && (
                  <span
                    key={`${currentIndex}-${isPaused}`}
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      backgroundColor: p.accent,
                      width: isPaused ? "100%" : undefined,
                      animation: isPaused
                        ? "none"
                        : `bestsellers-fill ${AUTO_ADVANCE_MS}ms linear forwards`,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
          <style>{`@keyframes bestsellers-fill { from { width: 0%; } to { width: 100%; } }`}</style>
        </div>

        {/* CTA */}
        <div className="mt-6 flex justify-center md:mt-8">
          <button
            onClick={onShopClick}
            className="group inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-medium transition-colors"
            style={{
              border: `1px solid ${active.accent}`,
              color: "var(--text)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${active.accent}22`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Tüm koleksiyonu keşfet
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
