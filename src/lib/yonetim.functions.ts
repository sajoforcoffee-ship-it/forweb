import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { KategoriDTO, MakaleDTO, QrKodDTO } from "@/lib/icerik-tipleri";
import { z } from "zod";

const idSchema = z.string().uuid();
const kategoriSchema = z.object({
  id: idSchema.optional(),
  slug: z.string().trim().min(1).max(120),
  ad: z.string().trim().min(1).max(160),
  ozet: z.string().max(5000),
  giris: z.string().max(5000),
  seviye: z.string().max(80),
  sure: z.string().max(80),
  gorselAnahtar: z.string().max(240),
  sira: z.number().int().min(0).max(10000),
  yayinda: z.boolean(),
});
const makaleSchema = z.object({
  id: idSchema.optional(),
  categoryId: idSchema,
  slug: z.string().trim().min(1).max(120),
  baslik: z.string().trim().min(1).max(240),
  ozet: z.string().max(5000),
  icerik: z.string().max(200000),
  sira: z.number().int().min(0).max(10000),
  yayinda: z.boolean(),
});
const qrSchema = z.object({
  id: idSchema,
  kod: z.string().trim().min(1).max(120),
  etiket: z.string().trim().min(1).max(160),
  hedefSlug: z.string().max(160),
  aktif: z.boolean(),
});
const sliderSchema = z.object({
  id: idSchema.optional(),
  eyebrow: z.string().max(120),
  title: z.string().trim().min(1).max(240),
  imageUrl: z.string().url().or(z.string().startsWith("/")),
  mobileImageUrl: z.string().url().or(z.string().startsWith("/")).or(z.literal("")),
  linkUrl: z.string().max(500),
  sortOrder: z.number().int().min(0).max(10000),
  isActive: z.boolean(),
});

export const oturumBilgisi = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: profil }, { data: roller }] = await Promise.all([
      context.supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", context.userId)
        .maybeSingle(),
      context.supabase.from("user_roles").select("role").eq("user_id", context.userId),
    ]);
    const rolListesi = (roller ?? []).map((r) => r.role as string);
    return {
      userId: context.userId,
      ad: profil?.display_name ?? "",
      avatar: profil?.avatar_url ?? "",
      roller: rolListesi,
      yetkili: rolListesi.includes("admin") || rolListesi.includes("editor"),
    };
  });

export const yonetimVerisi = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: kats }, { data: makaleler }, { data: qrler }, { data: sliders }] =
      await Promise.all([
        context.supabase.from("categories").select("*").order("sira"),
        context.supabase.from("articles").select("*").order("sira"),
        context.supabase.from("qr_codes").select("*").order("kod"),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (context.supabase as any).from("hero_slides").select("*").order("sort_order"),
      ]);

    const kategoriler: KategoriDTO[] = (kats ?? []).map((k) => ({
      id: k.id,
      slug: k.slug,
      ad: k.ad,
      ozet: k.ozet,
      giris: k.giris,
      seviye: k.seviye,
      sure: k.sure,
      gorselAnahtar: k.gorsel_anahtar,
      sira: k.sira,
      yayinda: k.yayinda,
      dersSayisi: (makaleler ?? []).filter((m) => m.category_id === k.id).length,
    }));

    const makaleListe: MakaleDTO[] = (makaleler ?? []).map((m) => ({
      id: m.id,
      categoryId: m.category_id,
      slug: m.slug,
      baslik: m.baslik,
      ozet: m.ozet,
      icerik: m.icerik,
      sira: m.sira,
      yayinda: m.yayinda,
    }));

    const qrListe: QrKodDTO[] = (qrler ?? []).map((q) => ({
      id: q.id,
      kod: q.kod,
      etiket: q.etiket,
      hedefSlug: q.hedef_slug,
      aktif: q.aktif,
    }));

    return { kategoriler, makaleler: makaleListe, qrKodlari: qrListe, sliders: sliders ?? [] };
  });

type KategoriGirdi = {
  id?: string;
  slug: string;
  ad: string;
  ozet: string;
  giris: string;
  seviye: string;
  sure: string;
  gorselAnahtar: string;
  sira: number;
  yayinda: boolean;
};

export const kategoriKaydet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => kategoriSchema.parse(input))
  .handler(async ({ data, context }) => {
    const satir = {
      slug: data.slug.trim(),
      ad: data.ad.trim(),
      ozet: data.ozet,
      giris: data.giris,
      seviye: data.seviye,
      sure: data.sure,
      gorsel_anahtar: data.gorselAnahtar,
      sira: data.sira,
      yayinda: data.yayinda,
    };
    const { error } = data.id
      ? await context.supabase.from("categories").update(satir).eq("id", data.id)
      : await context.supabase.from("categories").insert(satir);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const kategoriSil = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((id: unknown) => idSchema.parse(id))
  .handler(async ({ data: id, context }) => {
    const { error } = await context.supabase.from("categories").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

type MakaleGirdi = {
  id?: string;
  categoryId: string;
  slug: string;
  baslik: string;
  ozet: string;
  icerik: string;
  sira: number;
  yayinda: boolean;
};

export const makaleKaydet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => makaleSchema.parse(input))
  .handler(async ({ data, context }) => {
    const satir = {
      category_id: data.categoryId,
      slug: data.slug.trim(),
      baslik: data.baslik.trim(),
      ozet: data.ozet,
      icerik: data.icerik,
      sira: data.sira,
      yayinda: data.yayinda,
    };
    const { error } = data.id
      ? await context.supabase.from("articles").update(satir).eq("id", data.id)
      : await context.supabase.from("articles").insert(satir);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const makaleSil = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((id: unknown) => idSchema.parse(id))
  .handler(async ({ data: id, context }) => {
    const { error } = await context.supabase.from("articles").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

type QrGirdi = { id?: string; kod: string; etiket: string; hedefSlug: string; aktif: boolean };

export const qrKaydet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => qrSchema.parse(input))
  .handler(async ({ data, context }) => {
    const satir = {
      kod: data.kod.trim().toUpperCase(),
      etiket: data.etiket,
      hedef_slug: data.hedefSlug || null,
      aktif: data.aktif,
    };
    const { error } = data.id
      ? await context.supabase.from("qr_codes").update(satir).eq("id", data.id)
      : await context.supabase.from("qr_codes").insert(satir);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const qrSil = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((id: unknown) => idSchema.parse(id))
  .handler(async ({ data: id, context }) => {
    const { error } = await context.supabase.from("qr_codes").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

function say(liste: (string | null)[], bilinmeyen = "Bilinmiyor") {
  const harita = new Map<string, number>();
  for (const d of liste) {
    const anahtar = d?.trim() || bilinmeyen;
    harita.set(anahtar, (harita.get(anahtar) ?? 0) + 1);
  }
  return [...harita.entries()].map(([ad, adet]) => ({ ad, adet })).sort((a, b) => b.adet - a.adet);
}

export const sliderKaydet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => sliderSchema.parse(input))
  .handler(async ({ data, context }) => {
    const row = {
      eyebrow: data.eyebrow.trim(),
      title: data.title.trim(),
      image_url: data.imageUrl,
      mobile_image_url: data.mobileImageUrl || null,
      link_url: data.linkUrl.trim(),
      sort_order: data.sortOrder,
      is_active: data.isActive,
      updated_at: new Date().toISOString(),
    };
    const result = data.id
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (context.supabase as any).from("hero_slides").update(row).eq("id", data.id)
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (context.supabase as any).from("hero_slides").insert(row);
    if (result.error) throw new Error(result.error.message);
    return { ok: true };
  });

export const sliderSil = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((id: unknown) => idSchema.parse(id))
  .handler(async ({ data: id, context }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (context.supabase as any).from("hero_slides").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const sliderGorseliYukle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { path, contentType, bytes } = data as unknown as {
      path: string;
      contentType: string;
      bytes: number[];
    };
    if (!path.startsWith("hero-slides/") || bytes.length > 8_000_000)
      throw new Error("Geçersiz görsel yüklemesi.");
    const { error } = await context.supabase.storage
      .from("hero-slides")
      .upload(path.replace(/^hero-slides\//, ""), new Uint8Array(bytes), {
        contentType,
        upsert: true,
      });
    if (error) throw new Error(error.message);
    const { data: url } = context.supabase.storage
      .from("hero-slides")
      .getPublicUrl(path.replace(/^hero-slides\//, ""));
    return { url: url.publicUrl };
  });

export const sliderListesi = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await (
    await import("@/integrations/supabase/client")
  ).supabase
    .from("hero_slides" as never)
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) return [];
  return data ?? [];
});

export const analitikGetir = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((gun: number) => (Number.isFinite(gun) ? Math.min(Math.max(gun, 1), 365) : 30))
  .handler(async ({ data: gun, context }) => {
    const baslangic = new Date(Date.now() - gun * 86_400_000).toISOString();

    const [{ data: taramalar, error }, { data: aramalar }] = await Promise.all([
      context.supabase
        .from("qr_scans")
        .select("kod, ulke, cihaz, tarayici, isletim_sistemi, created_at")
        .gte("created_at", baslangic)
        .order("created_at", { ascending: false })
        .limit(5000),
      context.supabase
        .from("search_queries")
        .select("sorgu, created_at")
        .gte("created_at", baslangic)
        .limit(5000),
    ]);
    if (error) throw new Error(error.message);

    const satirlar = taramalar ?? [];
    const gunluk = new Map<string, number>();
    for (let i = gun - 1; i >= 0; i--) {
      const g = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
      gunluk.set(g, 0);
    }
    for (const s of satirlar) {
      const g = s.created_at.slice(0, 10);
      if (gunluk.has(g)) gunluk.set(g, (gunluk.get(g) ?? 0) + 1);
    }

    return {
      gun,
      toplamTarama: satirlar.length,
      toplamArama: (aramalar ?? []).length,
      gunlukSeri: [...gunluk.entries()].map(([tarih, adet]) => ({ tarih, adet })),
      ulkeler: say(satirlar.map((s) => s.ulke)).slice(0, 10),
      cihazlar: say(satirlar.map((s) => s.cihaz)),
      tarayicilar: say(satirlar.map((s) => s.tarayici)).slice(0, 6),
      isletimSistemleri: say(satirlar.map((s) => s.isletim_sistemi)).slice(0, 6),
      kodlar: say(satirlar.map((s) => s.kod)).slice(0, 10),
      aramalar: say((aramalar ?? []).map((a) => a.sorgu.toLocaleLowerCase("tr"))).slice(0, 12),
    };
  });

export const terkEdilmisSepetleriGetir = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (!(roles ?? []).some((role) => role.role === "admin" || role.role === "editor"))
      throw new Error("Unauthorized");
    // The generated Supabase schema does not yet include this operational table.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (context.supabase as any)
      .from("abandoned_carts")
      .select(
        "id, user_id, items, subtotal_cents, status, last_activity_at, abandoned_at, expires_at, created_at",
      )
      .order("last_activity_at", { ascending: false })
      .limit(100);
    if (error) throw new Error("Terk edilmiş sepetler yüklenemedi.");
    return data ?? [];
  });
