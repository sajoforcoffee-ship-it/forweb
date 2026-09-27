import { createFileRoute, notFound } from "@tanstack/react-router";
import BrewingDetailPage from "@/components/magaza/BrewingDetailPage";
import { demlemeGetir } from "@/data/demleme";

export const Route = createFileRoute("/demleme-yontemleri/$slug")({
  loader: ({ params }) => {
    const method = demlemeGetir(params.slug);
    if (!method) throw notFound();
    return method;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Demleme"} Rehberi | FOR COFFEE` },
      { name: "description", content: loaderData?.description ?? "FOR COFFEE demleme rehberi." },
    ],
  }),
  component: BrewingDetailRoute,
});

function BrewingDetailRoute() {
  return <BrewingDetailPage method={Route.useLoaderData()} />;
}
