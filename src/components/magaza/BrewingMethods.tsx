import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface BrewingMethodsProps {
  onNavigate: (page: string) => void;
}

interface Method {
  video: string;
  duration: string;
  desc: string;
}

const methods: Method[] = [
  {
    video: "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/08/v60000.mp4",
    duration: "",
    desc: "Tek damla pour-over",
  },
  {
    video: "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/08/chemexxx.mp4",
    duration: "",
    desc: "Filtreli, temiz fincan",
  },
  {
    video: "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/08/espressssoooo.mp4",
    duration: "",
    desc: "Yüksek basınç, yoğun",
  },
  {
    video: "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/08/french.mp4",
    duration: "",
    desc: "Tam gövde, daldırma",
  },
  {
    video: "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/08/mokaaaa.mp4",
    duration: "",
    desc: "Setüstü espresso",
  },
  {
    video: "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/08/turkkkk.mp4",
    duration: "",
    desc: "Geleneksel cezve demleme",
  },
];

const AUTO_INTERVAL = 4500;

const EASE = [0.22, 1, 0.36, 1] as const;

function MethodCard({
  method,
  isActive,
  isHovered,
  position,
  onActivate,
  onNavigate,
}: {
  method: Method;
  isActive: boolean;
  isHovered: boolean;
  position: "center" | "left" | "right" | "far-left" | "far-right";
  onActivate: () => void;
  onNavigate: (page: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (isActive) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isActive]);

  const transforms = {
    center: "translateX(0) translateZ(0) rotateY(0deg) scale(1)",
    left: "translateX(-180px) translateZ(-120px) rotateY(18deg) scale(0.88)",
    right: "translateX(180px) translateZ(-120px) rotateY(-18deg) scale(0.88)",
    "far-left": "translateX(-320px) translateZ(-240px) rotateY(22deg) scale(0.78)",
    "far-right": "translateX(320px) translateZ(-240px) rotateY(-22deg) scale(0.78)",
  };

  const opacities = {
    center: 1,
    left: 0.75,
    right: 0.75,
    "far-left": 0.4,
    "far-right": 0.4,
  };

  const shadow =
    isHovered && isActive
      ? "0 40px 80px rgba(0,0,0,0.15), 0 0 30px rgba(201,169,110,0.18)"
      : isActive
        ? "0 25px 60px rgba(0,0,0,0.12), 0 0 30px rgba(201,169,110,0.18)"
        : "0 2px 12px rgba(0,0,0,0.08)";

  const scale = isActive && isHovered ? 1.03 : 1;
  const translateY = isActive && isHovered ? -12 : 0;

  return (
    <motion.div
      onClick={() => (isActive ? onNavigate("brewing") : onActivate())}
      style={{
        width: 360,
        position: "absolute",
        top: 0,
        left: "50%",
        marginLeft: -180,
        transformStyle: "preserve-3d",
        cursor: "pointer",
      }}
      animate={{
        transform: `${transforms[position]} translateY(${translateY}px) scale(${scale})`,
        opacity: opacities[position],
        boxShadow: shadow,
        zIndex: isActive ? 10 : 1,
      }}
      transition={{
        duration: 1.2,
        ease: EASE,
      }}
    >
      <div
        style={{
          borderRadius: 28,
          background: "var(--surface)",
          border: isActive ? "1.5px solid rgba(200,169,107,0.35)" : "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            position: "relative",
          }}
        >
          <video
            ref={videoRef}
            src={method.video}
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />

          <div
            className="absolute top-4 right-4 px-3 py-1.5 rounded-lux backdrop-blur-md"
            style={{
              background: "color-mix(in oklab, var(--surface) 88%, transparent)",
              color: "var(--text)",
            }}
          >
            <span className="lbl-xs">{method.duration}</span>
          </div>
        </div>

        <div
          className="flex items-center justify-between gap-4 px-6"
          style={{
            minHeight: 84,
            background: "var(--surface)",
          }}
        >
          <p
            className="text-sm font-light"
            style={{
              color: isActive ? "var(--text)" : "var(--text-sec)",
              transition: "color 400ms ease",
            }}
          >
            {method.desc}
          </p>
          <span className="method-card-arrow" aria-hidden="true">
            <ArrowRight size={15} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function BrewingMethods({ onNavigate }: BrewingMethodsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setActiveIndex((previous) => {
        return (previous + 1) % methods.length;
      });
    }, AUTO_INTERVAL);
  }, []);

  useEffect(() => {
    resetTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [resetTimer]);

  const handleActivate = useCallback(
    (index: number) => {
      setActiveIndex(index);
      resetTimer();
    },
    [resetTimer],
  );

  const getPosition = (index: number): "center" | "left" | "right" | "far-left" | "far-right" => {
    const difference = index - activeIndex;
    const total = methods.length;

    let normalized = difference;

    if (normalized > total / 2) {
      normalized -= total;
    }

    if (normalized < -total / 2) {
      normalized += total;
    }

    if (normalized === 0) return "center";
    if (normalized === -1) return "left";
    if (normalized === 1) return "right";
    if (normalized === -2) return "far-left";
    if (normalized === 2) return "far-right";

    return normalized < 0 ? "far-left" : "far-right";
  };

  return (
    <section
      className="py-4 md:py-8"
      style={{
        background: "var(--bg-sec)",
      }}
    >
      <div className="cx">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-10 h-px"
                style={{
                  background: "var(--gold)",
                }}
              />

              <span
                className="lbl"
                style={{
                  color: "var(--gold)",
                }}
              >
                Demleme Yöntemleri
              </span>
            </div>

            <h2
              className="serif-light text-4xl lg:text-6xl text-balance leading-[1.05]"
              style={{
                color: "var(--text)",
              }}
            >
              Mükemmel demleme
              <br />
              sanatı
            </h2>
          </div>

          <button
            onClick={() => onNavigate("brewing")}
            className="group flex items-center gap-3 lbl"
            style={{
              color: "var(--text)",
              transition: "color 350ms ease",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.color = "var(--gold)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.color = "var(--text)";
            }}
          >
            Tüm Rehber
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="group-hover:translate-x-1.5 transition-transform duration-500 ease-lux"
            />
          </button>
        </div>
      </div>

      <div
        className="relative w-full"
        style={{
          perspective: "1400px",
          height: 420,
          overflow: "hidden",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          style={{
            position: "relative",
            width: 360,
            height: "100%",
            margin: "0 auto",
            transformStyle: "preserve-3d",
          }}
        >
          {methods.map((method, index) => (
            <MethodCard
              key={index}
              method={method}
              isActive={index === activeIndex}
              isHovered={hovered}
              position={getPosition(index)}
              onActivate={() => handleActivate(index)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {methods.map((_, index) => (
          <button
            key={index}
            onClick={() => handleActivate(index)}
            aria-label={`Yöntem ${index + 1}`}
            style={{
              width: index === activeIndex ? 28 : 8,
              height: 8,
              borderRadius: 4,
              background: index === activeIndex ? "var(--gold)" : "rgba(0,0,0,0.15)",
              transition: "all 400ms cubic-bezier(.22,.61,.36,1)",
              cursor: "pointer",
              border: "none",
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
}
