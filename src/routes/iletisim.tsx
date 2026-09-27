import { createFileRoute } from "@tanstack/react-router";
import ContactPage from "@/components/magaza/ContactPage";

export const Route = createFileRoute("/iletisim")({
  head: () => ({
    meta: [
      { title: "İletişim — FOR COFFEE" },
      {
        name: "description",
        content:
          "Sorularınız, toptan talepleriniz ve eğitim başvurularınız için FOR COFFEE ekibine ulaşın.",
      },
      { property: "og:title", content: "İletişim | FOR COFFEE" },
      {
        property: "og:description",
        content: "Kahve, toptan satış ve eğitim konularında bize yazın.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/iletisim" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/iletisim" }],
  }),
  component: ContactPage,
});
