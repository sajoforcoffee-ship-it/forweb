import { createFileRoute } from "@tanstack/react-router";
import BrewingPage from "@/components/magaza/BrewingPage";

export const Route = createFileRoute("/demleme")({
  head: () => ({
    meta: [
      { title: "Demleme Rehberi — Yöntem, Oran ve Süreler | FOR COFFEE" },
      {
        name: "description",
        content:
          "V60, French Press, Chemex, Moka ve espresso için adım adım demleme rehberleri, oranlar ve öğütüm önerileri.",
      },
      { property: "og:title", content: "Demleme Rehberi | FOR COFFEE" },
      {
        property: "og:description",
        content: "Her yöntem için doğru oran, öğütüm ve süre: pratik demleme rehberleri.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/demleme" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/demleme" }],
  }),
  component: BrewingPage,
});
