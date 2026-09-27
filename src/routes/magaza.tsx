import { createFileRoute } from "@tanstack/react-router";
import Shop from "@/components/magaza/Shop";

export const Route = createFileRoute("/magaza")({
  head: () => ({
    meta: [
      { title: "Mağaza — Tek Köken Kahveler ve Harmanlar | FOR COFFEE" },
      {
        name: "description",
        content:
          "Guatemala, Kenya, Kolombiya ve özel harmanlar. Taze kavrulmuş çekirdekleri keşfedin ve sipariş verin.",
      },
      { property: "og:title", content: "FOR COFFEE Mağaza" },
      {
        property: "og:description",
        content: "Taze kavrulmuş tek köken kahveler, harmanlar ve ekipmanlar.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/magaza" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/magaza" }],
  }),
  component: Shop,
});
