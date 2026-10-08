import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type HeroSlide = {
  image: string;
  mobileImage: string;
  eyebrow: string;
  title: string;
  href: string;
};

type HeroSlideRow = {
  image_url: string;
  mobile_image_url: string | null;
  eyebrow: string;
  title: string;
  link_url: string;
};

const slides: HeroSlide[] = [
  {
    image: "/images/slider-coffee-1.png",
    mobileImage: "/images/slider-coffee-1.png",
    eyebrow: "FOR COFFEE DİJİTAL KAHVE AKADEMİSİ",
    title: "Her fincan, daha bilinçli bir kahve deneyimi.",
    href: "/akademi",
  },
  {
    image: "/images/slider-coffee-2.png",
    mobileImage: "/images/slider-coffee-2.png",
    eyebrow: "TEK KÖKEN • KAVRUM • DEMLEME",
    title: "Kahvenin hikâyesini, lezzetini ve tekniğini öğrenin.",
    href: "/magaza",
  },
  {
    image: "/images/slider-coffee-3.png",
    mobileImage: "/images/slider-coffee-3.png",
    eyebrow: "USTALIK VE RİTÜEL",
    title: "Ritüelinize eşlik eden daha iyi bir kahve için adım atın.",
    href: "/demleme",
  },
] as const;

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const { data: remoteSlides } = useQuery({
    queryKey: ["hero-slides-public"],
    queryFn: async () => {
      const { data, error } = await (
        supabase as unknown as {
          from: (table: string) => {
            select: (columns: string) => {
              eq: (
                column: string,
                value: boolean,
              ) => {
                order: (
                  column: string,
                  options: { ascending: boolean },
                ) => Promise<{ data: HeroSlideRow[] | null; error: Error | null }>;
              };
            };
          };
        }
      )
        .from("hero_slides")
        .select("id, eyebrow, title, image_url, mobile_image_url, link_url")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((item) => ({
        image: item.image_url,
        mobileImage: item.mobile_image_url || item.image_url,
        eyebrow: item.eyebrow,
        title: item.title,
        href: item.link_url || "#",
      }));
    },
    staleTime: 60_000,
  });
  const activeSlides: HeroSlide[] = remoteSlides?.length ? remoteSlides : slides;

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % activeSlides.length),
      8000,
    );
    return () => window.clearInterval(timer);
  }, [paused, activeSlides.length]);

  useEffect(() => {
    setActive((current) => Math.min(current, activeSlides.length - 1));
  }, [activeSlides.length]);

  const move = (direction: 1 | -1) =>
    setActive((current) => (current + direction + activeSlides.length) % activeSlides.length);
  const slide = activeSlides[active] ?? activeSlides[0] ?? slides[0]!;

  return (
    <section
      className="hero-slider"
      aria-label="FOR COFFEE öne çıkanlar"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {activeSlides.map((item, index) => (
        <div
          key={item.image}
          className={`hero-slide ${index === active ? "is-active" : ""}`}
          aria-hidden={index !== active}
        >
          <picture>
            <source media="(max-width: 767px)" srcSet={item.mobileImage} />
            <img src={item.image} alt={item.title} width={1920} height={840} />
          </picture>
        </div>
      ))}
      <div className="hero-slider-shade" />
      <div className="hero-slider-content">
        <span>{slide.eyebrow}</span>
        <h1>{slide.title}</h1>
        <p className="hero-slider-subtitle">
          Uzman kahve bilgisi, premium içerik ve pratik demleme rehberleri tek çatı altında.
        </p>
        <a href={slide.href}>
          Keşfet <ExternalLink size={15} aria-hidden="true" />
        </a>
      </div>
      <button
        className="hero-slider-arrow hero-slider-prev"
        type="button"
        aria-label="Önceki slayt"
        onClick={() => move(-1)}
      >
        <ChevronLeft size={24} />
      </button>
      <button
        className="hero-slider-arrow hero-slider-next"
        type="button"
        aria-label="Sonraki slayt"
        onClick={() => move(1)}
      >
        <ChevronRight size={24} />
      </button>
      <div className="hero-slider-dots" role="tablist" aria-label="Slayt seçimi">
        {activeSlides.map((item, index) => (
          <button
            key={item.image}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={`${index + 1}. slayt`}
            className={index === active ? "is-active" : ""}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </section>
  );
}

export { slides as defaultHeroSlides };
