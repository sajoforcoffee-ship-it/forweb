import { useNavigate } from "@tanstack/react-router";
import { CornerDownLeft, FileText, Layers, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { araSitede, normalize, type AramaSonucu } from "@/lib/arama";

function Vurgu({ metin, sorgu }: { metin: string; sorgu: string }) {
  const kelimeler = normalize(sorgu)
    .split(" ")
    .filter((k) => k.length >= 2);
  if (kelimeler.length === 0) return <>{metin}</>;
  const nm = normalize(metin);
  const isaret = new Array(metin.length).fill(false);
  for (const k of kelimeler) {
    let from = nm.indexOf(k);
    while (from !== -1) {
      for (let i = from; i < from + k.length; i++) isaret[i] = true;
      from = nm.indexOf(k, from + k.length);
    }
  }
  const parcalar: { t: string; v: boolean }[] = [];
  for (let i = 0; i < metin.length; i++) {
    const v = isaret[i] as boolean;
    const son = parcalar[parcalar.length - 1];
    if (son && son.v === v) son.t += metin[i];
    else parcalar.push({ t: metin[i] ?? "", v });
  }
  return (
    <>
      {parcalar.map((p, i) =>
        p.v ? (
          <mark key={i} className="rounded bg-gold/25 px-0.5 text-inherit">
            {p.t}
          </mark>
        ) : (
          <span key={i}>{p.t}</span>
        ),
      )}
    </>
  );
}

export function AramaPaleti({ acik, kapat }: { acik: boolean; kapat: () => void }) {
  const [sorgu, setSorgu] = useState("");
  const [aktif, setAktif] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const sonuclar = useMemo<AramaSonucu[]>(() => araSitede(sorgu), [sorgu]);

  useEffect(() => {
    if (acik) {
      setSorgu("");
      setAktif(0);
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
    return;
  }, [acik]);

  useEffect(() => setAktif(0), [sorgu]);

  useEffect(() => {
    if (!acik) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") kapat();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setAktif((v) => Math.min(v + 1, Math.max(sonuclar.length - 1, 0)));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setAktif((v) => Math.max(v - 1, 0));
      }
      if (e.key === "Enter") {
        const s = sonuclar[aktif];
        if (s) {
          e.preventDefault();
          kapat();
          void navigate({ to: s.to, ...(s.hash ? { hash: s.hash } : {}) });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [acik, aktif, sonuclar, kapat, navigate]);

  if (!acik) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-24 sm:pt-32">
      <button
        aria-label="Aramayı kapat"
        onClick={kapat}
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
      />
      <div className="glass relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <Search className="size-[18px] shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={sorgu}
            onChange={(e) => setSorgu(e.target.value)}
            placeholder="Akademide ara: V60, öğütüm, saklama…"
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            aria-label="Kapat"
            onClick={kapat}
            className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-[min(60vh,480px)] overflow-y-auto p-2">
          {sorgu.trim() === "" && (
            <p className="px-4 py-6 text-xs leading-relaxed text-muted-foreground">
              Kategori ve ders içeriklerinde arama yapın. ↑ ↓ ile gezinin, Enter ile açın.
            </p>
          )}

          {sorgu.trim() !== "" && sonuclar.length === 0 && (
            <p className="px-4 py-6 text-xs text-muted-foreground">
              “{sorgu}” için sonuç bulunamadı. Kahve Asistanı’na sormayı deneyin.
            </p>
          )}

          {sonuclar.map((s, i) => (
            <button
              key={s.id}
              onMouseEnter={() => setAktif(i)}
              onClick={() => {
                kapat();
                void navigate({ to: s.to, ...(s.hash ? { hash: s.hash } : {}) });
              }}
              className={`flex w-full items-start gap-3 rounded-2xl px-4 py-3 text-left transition-colors ${
                i === aktif ? "bg-secondary" : "hover:bg-secondary/60"
              }`}
            >
              {s.tur === "kategori" ? (
                <Layers className="mt-0.5 size-4 shrink-0 text-gold" />
              ) : (
                <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-foreground">
                  <Vurgu metin={s.baslik} sorgu={sorgu} />
                </span>
                <span className="mt-0.5 block text-[11px] uppercase tracking-wide text-muted-foreground">
                  {s.altBaslik}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                  <Vurgu metin={s.ozet} sorgu={sorgu} />
                </span>
              </span>
              {i === aktif && (
                <CornerDownLeft className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
