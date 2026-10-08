import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface EquipmentProps {
  onNavigate?: (page: string) => void;
}

interface EquipmentItem {
  id: number;
  title: string;
  image: string;
  link: string;
  origin: string;
}

const items: EquipmentItem[] = [
  {
    id: 1,
    title: "STANLEY The AeroLight",
    image:
      "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/02/STANLEY-The-AeroLight-Termos.png",
    link: "https://www.forcoffeetr.com/magaza/urun/stanley-the-aerolight-termos/",
    origin: "Termos",
  },
  {
    id: 2,
    title: "Stanley Classic Trigger Action",
    image:
      "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/02/Stanley-Classic-Trigger-Action-Termos.png",
    link: "https://www.forcoffeetr.com/magaza/urun/stanley-classic-trigger-action-termos/",
    origin: "Termos",
  },
  {
    id: 3,
    title: "Chemex 400ml",
    image: "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/02/chemex-400ml.png",
    link: "https://www.forcoffeetr.com/magaza/urun/chemex-400-ml-cam-filtre-kahve-demligi/",
    origin: "Demleme",
  },
  {
    id: 4,
    title: "V-60 Demleme Seti",
    image: "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/02/v60-demele-set.png",
    link: "https://www.forcoffeetr.com/magaza/urun/v-60-demleme-seti/",
    origin: "Demleme",
  },
];

const AUTO_INTERVAL = 4500;
const EASE = [0.22, 1, 0.36, 1] as const;

type CardPosition = "center" | "left" | "right" | "far-left" | "far-right";

function EquipmentCard({
  item,
  isActive,
  isHovered,
  position,
  onActivate,
  isDark,
}: {
  item: EquipmentItem;
  isActive: boolean;
  isHovered: boolean;
  position: CardPosition;
  onActivate: () => void;
  isDark: boolean;
}) {
  const transforms: Record<CardPosition, string> = {
    center: "translateX(0) translateZ(0) rotateY(0deg) scale(1)",
    left: "translateX(-180px) translateZ(-120px) rotateY(18deg) scale(0.88)",
    right: "translateX(180px) translateZ(-120px) rotateY(-18deg) scale(0.88)",
    "far-left": "translateX(-320px) translateZ(-240px) rotateY(22deg) scale(0.78)",
    "far-right": "translateX(320px) translateZ(-240px) rotateY(-22deg) scale(0.78)",
  };

  const opacities: Record<CardPosition, number> = {
    center: 1,
    left: 0.7,
    right: 0.7,
    "far-left": 0.35,
    "far-right": 0.35,
  };

  const scale = isActive && isHovered ? 1.03 : 1;
  const translateY = isActive && isHovered ? -12 : 0;

  const cardBg = isDark
    ? "linear-gradient(145deg, #202020 0%, #111111 100%)"
    : "linear-gradient(145deg, #FFFFFF 0%, #F5F5F2 100%)";
  const cardBorder = isActive
    ? isDark
      ? "1px solid rgba(255,255,255,0.22)"
      : "1px solid rgba(201,169,110,0.40)"
    : isDark
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid rgba(0,0,0,0.06)";

  const shadowActive = isDark
    ? isHovered
      ? "0 40px 80px rgba(0,0,0,0.55), 0 0 30px rgba(255,255,255,0.06)"
      : "0 25px 60px rgba(0,0,0,0.45)"
    : isHovered
      ? "0 40px 80px rgba(0,0,0,0.12), 0 0 30px rgba(201,169,110,0.15)"
      : "0 25px 60px rgba(0,0,0,0.08)";
  const shadowInactive = isDark ? "0 8px 30px rgba(0,0,0,0.35)" : "0 8px 30px rgba(0,0,0,0.06)";

  const imageBg = isDark
    ? "radial-gradient(circle at center, #303030 0%, #151515 65%, #0D0D0D 100%)"
    : "radial-gradient(circle at center, #FFFFFF 0%, #F5F5F2 65%, #EAEAE6 100%)";

  const glowBg = isDark
    ? isActive
      ? "rgba(255,255,255,0.08)"
      : "rgba(255,255,255,0.03)"
    : isActive
      ? "rgba(201,169,110,0.12)"
      : "rgba(201,169,110,0.04)";

  const dropShadow = isDark
    ? isActive
      ? "drop-shadow(0 25px 25px rgba(0,0,0,0.65))"
      : "drop-shadow(0 15px 15px rgba(0,0,0,0.45))"
    : isActive
      ? "drop-shadow(0 25px 25px rgba(0,0,0,0.18))"
      : "drop-shadow(0 15px 15px rgba(0,0,0,0.10))";

  const infoBg = isDark ? "#151515" : "#FFFFFF";
  const titleColor = isDark ? "#FFFFFF" : "#1A1A1A";
  const linkColor = isDark ? "rgba(255,255,255,0.65)" : "#666666";
  const badgeBg = isDark ? "rgba(255,255,255,0.92)" : "rgba(201,169,110,0.12)";
  const badgeColor = isDark ? "#111111" : "#B8964E";

  return (
    <motion.div
      onClick={onActivate}
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
        zIndex: isActive ? 10 : 1,
      }}
      transition={{ duration: 1.2, ease: EASE }}
    >
      <div
        style={{
          overflow: "hidden",
          borderRadius: 28,
          background: cardBg,
          border: cardBorder,
          boxShadow: isActive ? shadowActive : shadowInactive,
          transition: "border-color 400ms ease, box-shadow 400ms ease",
        }}
      >
        {/* Product Image */}
        <div
          style={{
            position: "relative",
            height: 380,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            background: imageBg,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: glowBg,
              filter: "blur(45px)",
              transition: "all 500ms ease",
            }}
          />

          <img
            src={item.image}
            alt={item.title}
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "88%",
              maxHeight: "300px",
              objectFit: "contain",
              filter: dropShadow,
              transform: isActive && isHovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 500ms cubic-bezier(.22,.61,.36,1), filter 500ms ease",
            }}
          />

          {/* Category */}
          <div
            style={{
              position: "absolute",
              top: 18,
              left: 18,
              zIndex: 2,
              padding: "7px 12px",
              borderRadius: 999,
              background: badgeBg,
              color: badgeColor,
              fontSize: 9,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
            }}
          >
            {item.origin}
          </div>
        </div>

        {/* Product Information */}
        <div style={{ padding: "24px 28px 28px", background: infoBg }}>
          <h3
            style={{
              margin: "0 0 20px",
              color: titleColor,
              fontSize: 19,
              fontWeight: 400,
              lineHeight: 1.3,
              fontFamily: "serif",
            }}
          >
            {item.title}
          </h3>

          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              color: linkColor,
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              textDecoration: "none",
              transition: "color 300ms ease",
            }}
          >
            Ürünü İncele
            <ArrowRight size={14} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Equipment({ onNavigate }: EquipmentProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, AUTO_INTERVAL);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const handleActivate = useCallback(
    (index: number) => {
      setActiveIndex(index);
      resetTimer();
    },
    [resetTimer],
  );

  const getPosition = (index: number): CardPosition => {
    const difference = index - activeIndex;
    const length = items.length;
    let normalized = difference;
    if (normalized > length / 2) normalized -= length;
    if (normalized < -length / 2) normalized += length;
    if (normalized === 0) return "center";
    if (normalized === -1) return "left";
    if (normalized === 1) return "right";
    if (normalized === -2) return "far-left";
    if (normalized === 2) return "far-right";
    return normalized < 0 ? "far-left" : "far-right";
  };

  const sectionBg = isDark
    ? "linear-gradient(180deg, #0D0D0D 0%, #171717 100%)"
    : "linear-gradient(180deg, #F5F5F2 0%, #FAFAF8 100%)";
  const headingColor = isDark ? "#FFFFFF" : "var(--text-primary)";
  const eyebrowColor = isDark ? "#FFFFFF" : "var(--accent)";
  const eyebrowLine = isDark ? "#FFFFFF" : "var(--accent)";
  const linkColor = isDark ? "rgba(255,255,255,0.75)" : "var(--text-secondary)";
  const indicatorActive = isDark ? "#FFFFFF" : "var(--accent)";
  const indicatorInactive = isDark ? "rgba(255,255,255,0.25)" : "rgba(201,169,110,0.25)";

  return (
    <section
      style={{
        paddingTop: 16,
        paddingBottom: 24,
        background: sectionBg,
        color: isDark ? "#FFFFFF" : "var(--text-primary)",
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 1, background: eyebrowLine }} />
              <span
                style={{
                  color: eyebrowColor,
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.25em",
                }}
              >
                Profesyonel Ekipman
              </span>
            </div>

            <h2
              style={{
                margin: 0,
                color: headingColor,
                fontSize: "clamp(40px, 6vw, 72px)",
                fontWeight: 300,
                lineHeight: 1.05,
                fontFamily: "serif",
              }}
            >
              Kahvenizi
              <br />
              tamamlayan ekipmanlar
            </h2>
          </div>

          <button
            onClick={() => onNavigate?.("equipment")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              alignSelf: "flex-start",
              border: "none",
              background: "transparent",
              color: linkColor,
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
            }}
          >
            Tüm Ekipmanlar
            <ArrowRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Coverflow */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 420,
          overflow: "hidden",
          perspective: "1400px",
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
          {items.map((item, index) => (
            <EquipmentCard
              key={item.id}
              item={item}
              isActive={index === activeIndex}
              isHovered={hovered}
              position={getPosition(index)}
              onActivate={() => handleActivate(index)}
              isDark={isDark}
            />
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => handleActivate(index)}
            aria-label={`Ekipman ${index + 1}`}
            style={{
              width: index === activeIndex ? 28 : 8,
              height: 8,
              padding: 0,
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              background: index === activeIndex ? indicatorActive : indicatorInactive,
              transition: "all 400ms cubic-bezier(.22,.61,.36,1)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
