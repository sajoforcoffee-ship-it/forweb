import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Globe, QrCode, Search, Smartphone } from "lucide-react";
import { analitikGetir, terkEdilmisSepetleriGetir } from "@/lib/yonetim.functions";

export const Route = createFileRoute("/_authenticated/yonetim/")({
  component: AnalitikSayfasi,
});

const araliklar = [
  { gun: 7, ad: "7 gün" },
  { gun: 30, ad: "30 gün" },
  { gun: 90, ad: "90 gün" },
];

function Panel({
  baslik,
  ikon,
  satirlar,
}: {
  baslik: string;
  ikon: React.ReactNode;
  satirlar: { ad: string; adet: number }[];
}) {
  const enYuksek = Math.max(1, ...satirlar.map((s) => s.adet));
  return (
    <section className="rounded-2xl p-7 surface">
      <div className="flex items-center gap-2.5 text-sm">
        <span className="text-gold">{ikon}</span>
        {baslik}
      </div>
      <div className="mt-6 space-y-3.5">
        {satirlar.length === 0 && <p className="text-xs text-muted-foreground">Henüz veri yok.</p>}
        {satirlar.map((s) => (
          <div key={s.ad}>
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-foreground/85">{s.ad}</span>
              <span className="text-muted-foreground">{s.adet}</span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-gold"
                style={{ width: `${(s.adet / enYuksek) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AnalitikSayfasi() {
  const [gun, setGun] = useState(30);
  const { data, isLoading } = useQuery({
    queryKey: ["analitik", gun],
    queryFn: () => analitikGetir({ data: gun }),
  });

  const zirve = Math.max(1, ...(data?.gunlukSeri ?? []).map((g) => g.adet));
  const { data: terkSepetler = [] } = useQuery({
    queryKey: ["terk-edilmis-sepetler"],
    queryFn: () => terkEdilmisSepetleriGetir(),
  });
  const aktifSepetler = terkSepetler.filter(
    (sepet: { status: string }) => sepet.status === "active",
  );
  const kurtarilabilirDeger = aktifSepetler.reduce(
    (sum: number, sepet: { subtotal_cents: number }) => sum + sepet.subtotal_cents,
    0,
  );

  return (
    <main className="admin-page mx-auto max-w-7xl px-6 py-14">
      <div className="admin-page-header flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="eyebrow">Analitik</span>
          <h1 className="mt-3 text-4xl leading-tight">QR ve arama istatistikleri</h1>
        </div>
        <div className="flex gap-1 rounded-full border border-border p-1 text-xs">
          {araliklar.map((a) => (
            <button
              key={a.gun}
              onClick={() => setGun(a.gun)}
              className={`rounded-full px-4 py-2 transition-colors ${gun === a.gun ? "bg-gold/15 text-gold" : "text-muted-foreground"}`}
            >
              {a.ad}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <p className="mt-12 text-sm text-muted-foreground">Yükleniyor…</p>}

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl p-6 surface">
          <span className="eyebrow">Aktif terk sepeti</span>
          <p className="mt-3 text-3xl font-medium">{aktifSepetler.length}</p>
        </div>
        <div className="rounded-2xl p-6 surface">
          <span className="eyebrow">Kurtarılabilir değer</span>
          <p className="mt-3 text-3xl font-medium">
            {(kurtarilabilirDeger / 100).toLocaleString("tr-TR", {
              style: "currency",
              currency: "TRY",
            })}
          </p>
        </div>
        <div className="rounded-2xl p-6 surface">
          <span className="eyebrow">Takip durumu</span>
          <p className="mt-3 text-sm text-muted-foreground">
            Bildirim sağlayıcısı yapılandırılmadı
          </p>
        </div>
      </section>

      {aktifSepetler.length > 0 && (
        <section className="mt-4 rounded-2xl p-7 surface">
          <span className="eyebrow">Son terk edilen sepetler</span>
          <div className="mt-5 space-y-3">
            {aktifSepetler
              .slice(0, 8)
              .map(
                (sepet: {
                  id: string;
                  subtotal_cents: number;
                  last_activity_at: string;
                  items: unknown[];
                }) => (
                  <div
                    key={sepet.id}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 text-sm"
                  >
                    <span className="text-muted-foreground">
                      {new Date(sepet.last_activity_at).toLocaleString("tr-TR")}
                    </span>
                    <span>{Array.isArray(sepet.items) ? sepet.items.length : 0} kalem</span>
                    <span className="text-gold">
                      {(sepet.subtotal_cents / 100).toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })}
                    </span>
                  </div>
                ),
              )}
          </div>
        </section>
      )}

      {data && (
        <>
          <div className="admin-kpi-grid mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl p-7 surface">
              <span className="eyebrow">Toplam tarama</span>
              <p className="mt-3 text-4xl font-medium tracking-tight">{data.toplamTarama}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                Seçili dönem içindeki toplam QR etkileşimi
              </p>
            </div>
            <div className="rounded-2xl p-7 surface">
              <span className="eyebrow">Arama sayısı</span>
              <p className="mt-3 text-4xl font-medium tracking-tight">{data.toplamArama}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                Kullanıcıların içerik arama talepleri
              </p>
            </div>
            <div className="rounded-2xl p-7 surface">
              <span className="eyebrow">Ülke çeşitliliği</span>
              <p className="mt-3 text-4xl font-medium tracking-tight">{data.ulkeler.length}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                QR trafiğinin ulaştığı benzersiz ülke
              </p>
            </div>
          </div>

          <section className="admin-chart mt-4 rounded-2xl p-7 surface">
            <span className="eyebrow">Günlük tarama</span>
            <div className="mt-6 flex h-40 items-end gap-[3px]">
              {data.gunlukSeri.every((g) => g.adet === 0) ? (
                <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
                  Seçili dönemde henüz tarama verisi yok.
                </div>
              ) : (
                data.gunlukSeri.map((g) => (
                  <div
                    key={g.tarih}
                    title={`${g.tarih}: ${g.adet}`}
                    className="flex-1 rounded-t bg-gold/70"
                    style={{ height: `${Math.max(2, (g.adet / zirve) * 100)}%` }}
                  />
                ))
              )}
            </div>
          </section>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Panel baslik="Ülkeler" ikon={<Globe className="size-4" />} satirlar={data.ulkeler} />
            <Panel
              baslik="Cihazlar"
              ikon={<Smartphone className="size-4" />}
              satirlar={data.cihazlar}
            />
            <Panel
              baslik="En çok taranan kodlar"
              ikon={<QrCode className="size-4" />}
              satirlar={data.kodlar}
            />
            <Panel
              baslik="En çok arananlar"
              ikon={<Search className="size-4" />}
              satirlar={data.aramalar}
            />
            <Panel
              baslik="Tarayıcılar"
              ikon={<Globe className="size-4" />}
              satirlar={data.tarayicilar}
            />
            <Panel
              baslik="İşletim sistemleri"
              ikon={<Smartphone className="size-4" />}
              satirlar={data.isletimSistemleri}
            />
          </div>
        </>
      )}
    </main>
  );
}
