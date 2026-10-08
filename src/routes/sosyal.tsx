import { createFileRoute } from "@tanstack/react-router";
import SocialFeedPage from "@/components/magaza/SocialFeedPage";

export const Route = createFileRoute("/sosyal")({
  head: () => ({
    meta: [
      { title: "Sosyal — FOR COFFEE Topluluğu" },
      {
        name: "description",
        content:
          "Instagram ve topluluk paylaşımlarımız: kahve anları, tarifler ve kavurma günlükleri tek akışta.",
      },
      { property: "og:title", content: "FOR COFFEE Sosyal Akış" },
      {
        property: "og:description",
        content: "Kahve anları, tarifler ve kavurma günlükleri.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/sosyal" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/sosyal" }],
  }),
  component: SocialFeedPage,
});
