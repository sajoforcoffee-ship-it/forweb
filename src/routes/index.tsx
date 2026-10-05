import { Suspense, lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import HeroSection from "@/components/magaza/HeroSection";

const BestSellers = lazy(() => import("@/components/magaza/BestSellers"));
const BrewingMethods = lazy(() => import("@/components/magaza/BrewingMethods"));
const CoffeeAcademy = lazy(() => import("@/components/magaza/CoffeeAcademy"));
const Equipment = lazy(() => import("@/components/magaza/Equipment"));
const FeaturedProduct = lazy(() => import("@/components/magaza/FeaturedProduct"));
const AICoffeeIntelligence = lazy(() => import("@/components/magaza/AICoffeeIntelligence"));

function SectionFallback() {
  return <div className="h-64 w-full animate-pulse rounded-2xl bg-white/5" aria-hidden="true" />;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FOR COFFEE — Özel Kahve Koleksiyonu ve Kahve Akademisi" },
      {
        name: "description",
        content:
          "Tek köken çekirdekler, özel harmanlar ve ekipmanlar. Dijital Kahve Akademisi ile demleme, kavurma ve espresso bilgisi tek çatı altında.",
      },
      { property: "og:title", content: "FOR COFFEE — Özel Kahve Koleksiyonu ve Akademi" },
      {
        property: "og:description",
        content: "Çekirdekten fincana: premium kahve, ekipman ve Türkçe kahve eğitimi.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: AnaSayfa,
});

function AnaSayfa() {
  const navigate = useNavigate();
  const magazayaGit = () => navigate({ to: "/magaza" });
  const yonlendir = (sayfa: string) =>
    sayfa === "brewing" ? navigate({ to: "/demleme" }) : navigate({ to: "/magaza" });

  return (
    <>
      <HeroSection />
      <Suspense fallback={<SectionFallback />}>
        <BestSellers onShopClick={magazayaGit} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <FeaturedProduct />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <AICoffeeIntelligence />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <BrewingMethods onNavigate={yonlendir} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Equipment onNavigate={yonlendir} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <CoffeeAcademy />
      </Suspense>
    </>
  );
}
