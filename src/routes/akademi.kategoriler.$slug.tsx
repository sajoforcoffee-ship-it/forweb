import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Clock, Info, Layers } from "lucide-react";
import { kategoriBul, kategoriler, type Kategori } from "@/data/akademi";

export const Route = createFileRoute("/akademi/kategoriler/$slug")({
  loader: ({ params }) => {
    const kategori = kategoriBul(params.slug);
    if (!kategori) throw notFound();
    return { kategori };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Kategori bulunamadı — FOR COFFEE Akademi" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { kategori } = loaderData;
    const baslik = `${kategori.ad} — FOR COFFEE Dijital Kahve Akademisi`;
    return {
      meta: [
        { title: baslik },
        { name: "description", content: kategori.ozet },
        { property: "og:title", content: baslik },
        { property: "og:description", content: kategori.ozet },
      ],
    };
  },
  errorComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-6 text-center">
      <p className="text-muted-foreground">Bu içerik yüklenemedi. Lütfen tekrar deneyin.</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-3xl">Kategori bulunamadı</h1>
      <Link to="/akademi/kategoriler" className="text-sm text-gold">
        Tüm kategorilere dön
      </Link>
    </div>
  ),
  component: KategoriSayfasi,
});

function KategoriSayfasi() {
  const { kategori } = Route.useLoaderData() as { kategori: Kategori };
  const indeks = kategoriler.findIndex((k) => k.slug === kategori.slug);
  const onceki = kategoriler[indeks - 1];
  const sonraki = kategoriler[indeks + 1];

  return (
    <div className="min-h-screen">
      <section className="relative h-[70vh] min-h-[440px] overflow-hidden">
        <img
          src={kategori.gorsel}
          alt={`${kategori.ad} kapak görseli`}
          width={1024}
          height={768}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/65 to-black/30" />
        <div className="relative mx-auto flex h-full max-w-4xl flex-col justify-end px-6 pb-16">
          <Link
            to="/akademi/kategoriler"
            className="inline-flex w-fit items-center gap-2 text-xs tracking-[0.18em] text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3.5" /> KATEGORİLER
          </Link>
          <h1 className="mt-6 text-5xl leading-[1.05] text-white lg:text-6xl">{kategori.ad}</h1>
          <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-white/60">
            <span>{kategori.seviye}</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" /> {kategori.sure}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Layers className="size-3.5" /> {kategori.dersSayisi} ders
            </span>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 py-20 lg:py-28">
        <p className="text-xl leading-relaxed text-foreground/85">{kategori.giris}</p>
        <div className="mt-14 gold-rule" />

        <div className="mt-14 space-y-16">
          {kategori.bolumler.map((b) => (
            <section key={b.baslik}>
              <h2 className="text-3xl leading-tight">{b.baslik}</h2>

              {b.paragraflar?.map((p) => (
                <p key={p} className="mt-6 text-base leading-[1.85] text-muted-foreground">
                  {p}
                </p>
              ))}

              {b.maddeler && (
                <ul className="mt-8 space-y-4">
                  {b.maddeler.map((m) => (
                    <li key={m} className="flex gap-4 text-base leading-relaxed">
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold" />
                      <span className="text-muted-foreground">{m}</span>
                    </li>
                  ))}
                </ul>
              )}

              {b.not && (
                <div className="mt-8 flex gap-4 rounded-2xl border border-gold/30 bg-gold/5 p-6">
                  <Info className="mt-0.5 size-4 shrink-0 text-gold" />
                  <p className="text-sm leading-relaxed text-foreground/80">{b.not}</p>
                </div>
              )}
            </section>
          ))}
        </div>

        <div className="mt-24 grid gap-4 sm:grid-cols-2">
          {onceki && (
            <Link
              to="/akademi/kategoriler/$slug"
              params={{ slug: onceki.slug }}
              className="lift rounded-2xl p-6 surface"
            >
              <span className="eyebrow">Önceki</span>
              <span className="mt-3 flex items-center gap-2 text-lg">
                <ArrowLeft className="size-4 text-gold" /> {onceki.ad}
              </span>
            </Link>
          )}
          {sonraki && (
            <Link
              to="/akademi/kategoriler/$slug"
              params={{ slug: sonraki.slug }}
              className="lift rounded-2xl p-6 text-right surface sm:col-start-2"
            >
              <span className="eyebrow">Sonraki</span>
              <span className="mt-3 flex items-center justify-end gap-2 text-lg">
                {sonraki.ad} <ArrowRight className="size-4 text-gold" />
              </span>
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}
