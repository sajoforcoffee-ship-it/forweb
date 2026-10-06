import { useMemo, useState } from "react";

type SliderRow = {
  id: string;
  eyebrow: string;
  title: string;
  image_url: string;
  mobile_image_url: string | null;
  link_url: string;
  sort_order: number;
  is_active: boolean;
};
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Plus, Trash2, Upload } from "lucide-react";
import {
  kategoriKaydet,
  kategoriSil,
  makaleKaydet,
  makaleSil,
  qrKaydet,
  qrSil,
  sliderKaydet,
  sliderSil,
  yonetimVerisi,
} from "@/lib/yonetim.functions";
import { SEVIYELER } from "@/lib/icerik-tipleri";
import { gorselAnahtarlari } from "@/data/gorseller";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/yonetim/icerik")({
  component: IcerikYonetimi,
});

const alan =
  "w-full rounded-xl border border-border bg-transparent px-4 py-2.5 text-sm outline-hidden focus:border-gold";

function IcerikYonetimi() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["yonetim-verisi"], queryFn: () => yonetimVerisi() });
  const [sekme, setSekme] = useState<"kategoriler" | "makaleler" | "qr" | "slider">("kategoriler");
  const [secili, setSecili] = useState<string | null>(null);

  const yenile = () => queryClient.invalidateQueries({ queryKey: ["yonetim-verisi"] });
  const kaydetMut = useMutation({ mutationFn: kategoriKaydet, onSuccess: yenile });
  const silMut = useMutation({ mutationFn: kategoriSil, onSuccess: yenile });
  const makaleMut = useMutation({ mutationFn: makaleKaydet, onSuccess: yenile });
  const makaleSilMut = useMutation({ mutationFn: makaleSil, onSuccess: yenile });
  const qrMut = useMutation({ mutationFn: qrKaydet, onSuccess: yenile });
  const qrSilMut = useMutation({ mutationFn: qrSil, onSuccess: yenile });
  const sliderKaydetMut = useMutation({ mutationFn: sliderKaydet, onSuccess: yenile });
  const sliderSilMut = useMutation({ mutationFn: sliderSil, onSuccess: yenile });

  const kategoriler = useMemo(() => data?.kategoriler ?? [], [data?.kategoriler]);
  const makaleler = useMemo(() => data?.makaleler ?? [], [data?.makaleler]);
  const qrKodlari = useMemo(() => data?.qrKodlari ?? [], [data?.qrKodlari]);
  const sliders = useMemo(() => (data?.sliders ?? []) as SliderRow[], [data?.sliders]);

  const seciliKategori = useMemo(
    () => kategoriler.find((k) => k.id === secili),
    [kategoriler, secili],
  );
  const seciliMakale = useMemo(() => makaleler.find((m) => m.id === secili), [makaleler, secili]);
  const seciliQr = useMemo(() => qrKodlari.find((q) => q.id === secili), [qrKodlari, secili]);
  const seciliSlider = useMemo(() => sliders.find((s) => s.id === secili), [sliders, secili]);

  return (
    <main className="admin-page mx-auto max-w-7xl px-6 py-14">
      <span className="eyebrow">İçerik çalışma alanı</span>
      <h1 className="mt-3 text-4xl leading-tight">Kategori, makale ve QR yönetimi</h1>

      <div className="mt-8 flex w-fit flex-wrap gap-1 rounded-2xl border border-border bg-card p-1 text-xs">
        {(["kategoriler", "makaleler", "qr", "slider"] as const).map((s) => (
          <button
            key={s}
            onClick={() => {
              setSekme(s);
              setSecili(null);
            }}
            className={`rounded-full px-5 py-2 capitalize transition-colors ${sekme === s ? "bg-gold/15 text-gold" : "text-muted-foreground"}`}
          >
            {s === "qr" ? "QR kodları" : s}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <section className="admin-list-panel rounded-2xl p-6 surface">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Liste</span>
            <button
              onClick={() => setSecili("yeni")}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs"
            >
              <Plus className="size-3.5" /> Yeni
            </button>
          </div>
          <ul className="mt-5 space-y-1.5">
            {sekme === "kategoriler" &&
              kategoriler.map((k) => (
                <li key={k.id}>
                  <button
                    onClick={() => setSecili(k.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm ${secili === k.id ? "bg-gold/10" : "hover:bg-muted/50"}`}
                  >
                    <span>{k.ad}</span>
                    <span className="text-xs text-muted-foreground">{k.dersSayisi} ders</span>
                  </button>
                </li>
              ))}
            {sekme === "makaleler" &&
              makaleler.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => setSecili(m.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm ${secili === m.id ? "bg-gold/10" : "hover:bg-muted/50"}`}
                  >
                    <span className="truncate">{m.baslik}</span>
                    <span className="text-xs text-muted-foreground">
                      {m.yayinda ? "Yayında" : "Taslak"}
                    </span>
                  </button>
                </li>
              ))}
            {sekme === "qr" &&
              qrKodlari.map((q) => (
                <li key={q.id}>
                  <button
                    onClick={() => setSecili(q.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm ${secili === q.id ? "bg-gold/10" : "hover:bg-muted/50"}`}
                  >
                    <span className="truncate">{q.kod}</span>
                    <span className="text-xs text-muted-foreground">{q.hedefSlug ?? "—"}</span>
                  </button>
                </li>
              ))}
            {sekme === "slider" &&
              sliders.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => setSecili(s.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm ${secili === s.id ? "bg-gold/10" : "hover:bg-muted/50"}`}
                  >
                    <span className="truncate">{s.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {s.is_active ? "Aktif" : "Pasif"}
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        </section>

        <section className="admin-editor-panel rounded-2xl p-6 surface">
          {!secili && (
            <p className="text-sm text-muted-foreground">Düzenlemek için soldan bir kayıt seçin.</p>
          )}

          {secili && sekme === "slider" && (
            <form
              key={secili}
              onSubmit={async (e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                const file = f.get("imageFile");
                let imageUrl = String(f.get("imageUrl") || "");
                if (file instanceof File && file.size > 0) {
                  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
                  const path = `${crypto.randomUUID()}-${safeName}`;
                  const upload = await supabase.storage
                    .from("hero-slides")
                    .upload(path, file, { contentType: file.type, upsert: false });
                  if (upload.error) throw new Error(upload.error.message);
                  imageUrl = supabase.storage.from("hero-slides").getPublicUrl(path).data.publicUrl;
                }
                sliderKaydetMut.mutate({
                  data: {
                    ...(seciliSlider ? { id: seciliSlider.id } : {}),
                    eyebrow: String(f.get("eyebrow")),
                    title: String(f.get("title")),
                    imageUrl,
                    mobileImageUrl: String(f.get("mobileImageUrl") || ""),
                    linkUrl: String(f.get("linkUrl") || ""),
                    sortOrder: Number(f.get("sortOrder")),
                    isActive: f.get("isActive") === "on",
                  },
                });
              }}
              className="space-y-4"
            >
              <div>
                <span className="eyebrow">Hero slider</span>
                <h2 className="mt-2 text-2xl">{seciliSlider ? "Slider düzenle" : "Yeni slider"}</h2>
              </div>
              <input
                name="eyebrow"
                defaultValue={seciliSlider?.eyebrow}
                placeholder="Üst başlık"
                className={alan}
              />
              <input
                name="title"
                defaultValue={seciliSlider?.title}
                placeholder="Başlık"
                required
                className={alan}
              />
              <input
                name="imageUrl"
                defaultValue={seciliSlider?.image_url}
                placeholder="Desktop görsel URL'si veya dosya seçin"
                className={alan}
              />
              <label className="flex items-center gap-2 rounded-xl border border-dashed border-border p-4 text-sm">
                <Upload className="size-4 text-gold" /> Desktop dosyası{" "}
                <input name="imageFile" type="file" accept="image/jpeg,image/png,image/webp" />
              </label>
              <input
                name="mobileImageUrl"
                defaultValue={seciliSlider?.mobile_image_url ?? ""}
                placeholder="Mobil görsel URL'si (opsiyonel)"
                className={alan}
              />
              <input
                name="linkUrl"
                defaultValue={seciliSlider?.link_url}
                placeholder="Bağlantı URL'si (sonra ekleyebilirsiniz)"
                className={alan}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="sortOrder"
                  type="number"
                  min="0"
                  defaultValue={seciliSlider?.sort_order ?? sliders.length}
                  placeholder="Sıra"
                  className={alan}
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    name="isActive"
                    type="checkbox"
                    defaultChecked={seciliSlider?.is_active ?? true}
                  />{" "}
                  Aktif
                </label>
              </div>
              <p className="rounded-xl border border-border p-3 text-xs leading-5 text-muted-foreground">
                Önerilen ölçüler: Desktop 1920 × 840 px, mobil 900 × 1200 px. JPG, PNG veya WebP;
                dosya limiti 8 MB.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-full bg-foreground px-6 py-2.5 text-sm text-background">
                  Kaydet
                </button>
                {seciliSlider?.link_url && (
                  <a
                    href={seciliSlider.link_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm"
                  >
                    Önizle <ExternalLink className="size-3.5" />
                  </a>
                )}
                {seciliSlider && (
                  <button
                    type="button"
                    onClick={() => {
                      sliderSilMut.mutate({ data: seciliSlider.id });
                      setSecili(null);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-destructive"
                  >
                    <Trash2 className="size-3.5" /> Sil
                  </button>
                )}
              </div>
            </form>
          )}

          {secili && sekme === "kategoriler" && (
            <form
              key={secili}
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                kaydetMut.mutate({
                  data: {
                    ...(seciliKategori ? { id: seciliKategori.id } : {}),
                    slug: String(f.get("slug")),
                    ad: String(f.get("ad")),
                    ozet: String(f.get("ozet")),
                    giris: String(f.get("giris")),
                    seviye: String(f.get("seviye")),
                    sure: String(f.get("sure")),
                    gorselAnahtar: String(f.get("gorselAnahtar")),
                    sira: Number(f.get("sira")),
                    yayinda: f.get("yayinda") === "on",
                  },
                });
              }}
              className="space-y-4"
            >
              <input
                name="ad"
                defaultValue={seciliKategori?.ad}
                placeholder="Ad"
                required
                className={alan}
              />
              <input
                name="slug"
                defaultValue={seciliKategori?.slug}
                placeholder="slug"
                required
                className={alan}
              />
              <textarea
                name="ozet"
                defaultValue={seciliKategori?.ozet}
                placeholder="Özet"
                rows={2}
                className={alan}
              />
              <textarea
                name="giris"
                defaultValue={seciliKategori?.giris}
                placeholder="Giriş"
                rows={4}
                className={alan}
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="seviye"
                  defaultValue={seciliKategori?.seviye ?? SEVIYELER[0]}
                  className={alan}
                >
                  {SEVIYELER.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <input
                  name="sure"
                  defaultValue={seciliKategori?.sure ?? "10 dk"}
                  placeholder="Süre"
                  className={alan}
                />
                <select
                  name="gorselAnahtar"
                  defaultValue={seciliKategori?.gorselAnahtar ?? gorselAnahtarlari[0]}
                  className={alan}
                >
                  {gorselAnahtarlari.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <input
                  name="sira"
                  type="number"
                  defaultValue={seciliKategori?.sira ?? kategoriler.length}
                  className={alan}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="yayinda"
                  defaultChecked={seciliKategori?.yayinda ?? true}
                />{" "}
                Yayında
              </label>
              <div className="flex gap-3">
                <button className="rounded-full bg-foreground px-6 py-2.5 text-sm text-background">
                  Kaydet
                </button>
                {seciliKategori && (
                  <button
                    type="button"
                    onClick={() => {
                      silMut.mutate({ data: seciliKategori.id });
                      setSecili(null);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-destructive"
                  >
                    <Trash2 className="size-3.5" /> Sil
                  </button>
                )}
              </div>
            </form>
          )}

          {secili && sekme === "makaleler" && (
            <form
              key={secili}
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                makaleMut.mutate({
                  data: {
                    ...(seciliMakale ? { id: seciliMakale.id } : {}),
                    categoryId: String(f.get("categoryId")),
                    slug: String(f.get("slug")),
                    baslik: String(f.get("baslik")),
                    ozet: String(f.get("ozet")),
                    icerik: String(f.get("icerik")),
                    sira: Number(f.get("sira")),
                    yayinda: f.get("yayinda") === "on",
                  },
                });
              }}
              className="space-y-4"
            >
              <select
                name="categoryId"
                defaultValue={seciliMakale?.categoryId ?? kategoriler[0]?.id}
                className={alan}
              >
                {kategoriler.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.ad}
                  </option>
                ))}
              </select>
              <input
                name="baslik"
                defaultValue={seciliMakale?.baslik}
                placeholder="Başlık"
                required
                className={alan}
              />
              <input
                name="slug"
                defaultValue={seciliMakale?.slug}
                placeholder="slug"
                required
                className={alan}
              />
              <textarea
                name="ozet"
                defaultValue={seciliMakale?.ozet}
                placeholder="Özet"
                rows={2}
                className={alan}
              />
              <textarea
                name="icerik"
                defaultValue={seciliMakale?.icerik}
                placeholder="İçerik"
                rows={12}
                className={alan}
              />
              <div className="grid grid-cols-2 items-center gap-4">
                <input
                  name="sira"
                  type="number"
                  defaultValue={seciliMakale?.sira ?? 0}
                  className={alan}
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="yayinda"
                    defaultChecked={seciliMakale?.yayinda ?? true}
                  />{" "}
                  Yayında
                </label>
              </div>
              <div className="flex gap-3">
                <button className="rounded-full bg-foreground px-6 py-2.5 text-sm text-background">
                  Kaydet
                </button>
                {seciliMakale && (
                  <button
                    type="button"
                    onClick={() => {
                      makaleSilMut.mutate({ data: seciliMakale.id });
                      setSecili(null);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-destructive"
                  >
                    <Trash2 className="size-3.5" /> Sil
                  </button>
                )}
              </div>
            </form>
          )}

          {secili && sekme === "qr" && (
            <form
              key={secili}
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                qrMut.mutate({
                  data: {
                    ...(seciliQr ? { id: seciliQr.id } : {}),
                    kod: String(f.get("kod")),
                    etiket: String(f.get("etiket")),
                    hedefSlug: String(f.get("hedefSlug")),
                    aktif: f.get("aktif") === "on",
                  },
                });
              }}
              className="space-y-4"
            >
              <input
                name="kod"
                defaultValue={seciliQr?.kod}
                placeholder="FC007"
                required
                className={alan}
              />
              <input
                name="etiket"
                defaultValue={seciliQr?.etiket}
                placeholder="Etiket"
                className={alan}
              />
              <select name="hedefSlug" defaultValue={seciliQr?.hedefSlug ?? ""} className={alan}>
                <option value="">Hedef yok</option>
                {kategoriler.map((k) => (
                  <option key={k.id} value={k.slug}>
                    {k.ad}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="aktif" defaultChecked={seciliQr?.aktif ?? true} />{" "}
                Aktif
              </label>
              {seciliQr && (
                <p className="text-xs text-muted-foreground">
                  Tarama bağlantısı: <code>/qr/{seciliQr.kod}</code>
                </p>
              )}
              <div className="flex gap-3">
                <button className="rounded-full bg-foreground px-6 py-2.5 text-sm text-background">
                  Kaydet
                </button>
                {seciliQr && (
                  <button
                    type="button"
                    onClick={() => {
                      qrSilMut.mutate({ data: seciliQr.id });
                      setSecili(null);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-destructive"
                  >
                    <Trash2 className="size-3.5" /> Sil
                  </button>
                )}
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
