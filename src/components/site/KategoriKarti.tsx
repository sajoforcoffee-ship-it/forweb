import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock, Layers } from "lucide-react";
import type { Kategori } from "@/data/akademi";

export function KategoriKarti({
  kategori,
  oncelikli,
}: {
  kategori: Kategori;
  oncelikli?: boolean;
}) {
  return (
    <Link
      to="/akademi/kategoriler/$slug"
      params={{ slug: kategori.slug }}
      className="lift group relative block overflow-hidden rounded-2xl surface"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={kategori.gorsel}
          alt={`${kategori.ad} kategorisi görseli`}
          width={1024}
          height={768}
          loading={oncelikli ? "eager" : "lazy"}
          className="size-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute left-5 top-5 rounded-full bg-black/45 px-3 py-1 text-[10px] tracking-[0.2em] text-white backdrop-blur-md">
          {kategori.seviye.toUpperCase()}
        </span>
      </div>

      <div className="p-7">
        <h3 className="text-2xl">{kategori.ad}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{kategori.ozet}</p>

        <div className="mt-7 flex items-center justify-between">
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" /> {kategori.sure}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Layers className="size-3.5" /> {kategori.dersSayisi} ders
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs tracking-wide text-foreground transition-colors group-hover:text-gold">
            Başla <ArrowUpRight className="size-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
