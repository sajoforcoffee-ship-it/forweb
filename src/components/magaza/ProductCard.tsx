import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface ProductCardProps {
  image?: string | undefined;
  video?: string | undefined;
  title: string;
  buttonText?: string | undefined;
  href?: string | undefined;
  price?: string | undefined;
  badge?: string | undefined;
  badgeColor?: "green" | "red" | "gold" | "emerald" | undefined;
  onButtonClick?: (() => void) | undefined;
  origin?: string | undefined;
  flavorNotes?: string | undefined;
  roastLevel?: string | undefined;
}

const ProductCard = ({
  image,
  video,
  title,
  buttonText = "İncele",
  href,
  price,
  badge,
  badgeColor = "emerald",
  onButtonClick,
  origin,
  flavorNotes,
  roastLevel,
}: ProductCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imgError, setImgError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const badgeStyles: Record<string, React.CSSProperties> = {
    green: {
      backgroundColor: "rgba(34,197,94,0.10)",
      color: "#22C55E",
      border: "1px solid rgba(34,197,94,0.20)",
    },
    red: {
      backgroundColor: "rgba(239,68,68,0.10)",
      color: "#EF4444",
      border: "1px solid rgba(239,68,68,0.20)",
    },
    gold: {
      backgroundColor: "rgba(201,169,110,0.12)",
      color: "var(--accent)",
      border: "1px solid rgba(201,169,110,0.25)",
    },
    emerald: {
      backgroundColor: "rgba(201,169,110,0.12)",
      color: "var(--accent)",
      border: "1px solid rgba(201,169,110,0.25)",
    },
  };

  const handleMouseEnter = () => {
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  const content = (
    <div
      className="desktop-product-card card-luxury group h-full flex flex-col overflow-hidden cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image / Video */}
      <div
        className="relative overflow-hidden rounded-card mb-5"
        style={{ aspectRatio: "2 / 3", backgroundColor: "var(--bg-secondary)" }}
      >
        {video && !videoError ? (
          <video
            ref={videoRef}
            src={video}
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : image && !imgError ? (
          <img
            src={image}
            alt={`${title} kahvesi`}
            width={640}
            height={960}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ color: "var(--text-muted)" }}
          >
            <span className="text-sm text-center px-4">{title}</span>
          </div>
        )}
        {badge && (
          <span
            className="absolute top-4 left-4 text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-pill"
            style={badgeStyles[badgeColor]}
          >
            {badge}
          </span>
        )}
      </div>
      {/* Content */}
      <div className="flex flex-col flex-1">
        {origin && (
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-1.5"
            style={{ color: "var(--accent)" }}
          >
            {origin}
          </span>
        )}
        <h3
          className="font-serif font-semibold leading-snug mb-2 text-lg"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>
        {flavorNotes && (
          <p
            className="text-xs leading-relaxed mb-2 line-clamp-2"
            style={{ color: "var(--text-muted)" }}
          >
            {flavorNotes}
          </p>
        )}
        {roastLevel && (
          <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
            <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>
              Kavrum:
            </span>{" "}
            {roastLevel}
          </p>
        )}
        {price && (
          <p className="font-serif font-semibold mb-4 text-xl" style={{ color: "var(--accent)" }}>
            {price}
          </p>
        )}
        <div className="mt-auto pt-2">
          {(onButtonClick || href) && (
            <button
              onClick={onButtonClick}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-300 group/btn"
              style={{
                borderRadius: "14px",
                backgroundColor: "var(--accent)",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(201,169,110,0.20)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent-hover)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent)";
                e.currentTarget.style.transform = "";
              }}
            >
              {buttonText}
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover/btn:translate-x-1"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
  if (href?.startsWith("/"))
    return (
      <Link to={href} className="block h-full">
        {content}
      </Link>
    );
  if (href)
    return (
      <a href={href} className="block h-full">
        {content}
      </a>
    );
  return content;
};

export default ProductCard;
