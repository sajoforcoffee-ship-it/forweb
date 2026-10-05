import { createFileRoute } from "@tanstack/react-router";
import { qrTaramasiKaydet } from "@/lib/icerik.functions";

export const Route = createFileRoute("/qr/$kod")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const sonuc = await qrTaramasiKaydet({ data: params.kod });
        const hedef = sonuc.hedefSlug
          ? `/kategoriler/${sonuc.hedefSlug}?kaynak=qr&kod=${encodeURIComponent(params.kod)}`
          : `/kategoriler?kaynak=qr`;
        return new Response(null, {
          status: 302,
          headers: {
            location: new URL(hedef, request.url).toString(),
            "cache-control": "no-store",
          },
        });
      },
    },
  },
});
