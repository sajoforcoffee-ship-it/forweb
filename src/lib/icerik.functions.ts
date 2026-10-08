import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { KategoriDTO, MakaleDTO } from "@/lib/icerik-tipleri";

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

type KategoriSatiri = Database["public"]["Tables"]["categories"]["Row"];
type MakaleSatiri = Database["public"]["Tables"]["articles"]["Row"];

function kategoriDTO(row: KategoriSatiri, dersSayisi: number): KategoriDTO {
  return {
    id: row.id,
    slug: row.slug,
    ad: row.ad,
    ozet: row.ozet,
    giris: row.giris,
    seviye: row.seviye,
    sure: row.sure,
    gorselAnahtar: row.gorsel_anahtar,
    sira: row.sira,
    yayinda: row.yayinda,
    dersSayisi,
  };
}

function makaleDTO(row: MakaleSatiri): MakaleDTO {
  return {
    id: row.id,
    categoryId: row.category_id,
    slug: row.slug,
    baslik: row.baslik,
    ozet: row.ozet,
    icerik: row.icerik,
    sira: row.sira,
    yayinda: row.yayinda,
  };
}

export const kategorileriGetir = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const [{ data: kats, error }, { data: makaleler }] = await Promise.all([
    supabase.from("categories").select("*").eq("yayinda", true).order("sira"),
    supabase.from("articles").select("category_id").eq("yayinda", true),
  ]);
  if (error) throw new Error(error.message);
  const sayac = new Map<string, number>();
  for (const m of makaleler ?? []) sayac.set(m.category_id, (sayac.get(m.category_id) ?? 0) + 1);
  return (kats ?? []).map((k) => kategoriDTO(k, sayac.get(k.id) ?? 0));
});

export const kategoriGetir = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const supabase = publicClient();
    const { data: kat } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .eq("yayinda", true)
      .maybeSingle();
    if (!kat) return null;
    const { data: makaleler } = await supabase
      .from("articles")
      .select("*")
      .eq("category_id", kat.id)
      .eq("yayinda", true)
      .order("sira");
    const liste = (makaleler ?? []).map(makaleDTO);
    return { kategori: kategoriDTO(kat, liste.length), makaleler: liste };
  });

export const araVeKaydet = createServerFn({ method: "POST" })
  .validator((sorgu: string) => sorgu.trim().slice(0, 120))
  .handler(async ({ data: sorgu }) => {
    if (!sorgu) return { sorgu, kategoriler: [], makaleler: [] };
    const supabase = publicClient();
    const desen = `%${sorgu}%`;

    const [{ data: kats }, { data: makaleler }] = await Promise.all([
      supabase
        .from("categories")
        .select("*")
        .eq("yayinda", true)
        .or(`ad.ilike.${desen},ozet.ilike.${desen},giris.ilike.${desen}`)
        .limit(6),
      supabase
        .from("articles")
        .select("*")
        .eq("yayinda", true)
        .or(`baslik.ilike.${desen},icerik.ilike.${desen}`)
        .limit(12),
    ]);

    const katListe = (kats ?? []).map((k) => kategoriDTO(k, 0));
    const makaleListe = (makaleler ?? []).map(makaleDTO);

    const slugMap = new Map<string, string>();
    if (makaleListe.length) {
      const { data: tumKats } = await supabase.from("categories").select("id, slug");
      for (const k of tumKats ?? []) slugMap.set(k.id, k.slug);
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("search_queries")
      .insert({ sorgu, sonuc_sayisi: katListe.length + makaleListe.length });

    return {
      sorgu,
      kategoriler: katListe,
      makaleler: makaleListe.map((m) => ({ ...m, kategoriSlug: slugMap.get(m.categoryId) ?? "" })),
    };
  });

function cihazBilgisi(ua: string) {
  const mobil = /Mobile|Android|iPhone|iPod/i.test(ua);
  const tablet = /iPad|Tablet/i.test(ua);
  const cihaz = tablet ? "Tablet" : mobil ? "Mobil" : "Masaüstü";
  const tarayici = /Edg\//i.test(ua)
    ? "Edge"
    : /OPR\//i.test(ua)
      ? "Opera"
      : /Chrome\//i.test(ua)
        ? "Chrome"
        : /Safari\//i.test(ua)
          ? "Safari"
          : /Firefox\//i.test(ua)
            ? "Firefox"
            : "Diğer";
  const isletim = /Android/i.test(ua)
    ? "Android"
    : /iPhone|iPad|iPod/i.test(ua)
      ? "iOS"
      : /Mac OS X/i.test(ua)
        ? "macOS"
        : /Windows/i.test(ua)
          ? "Windows"
          : /Linux/i.test(ua)
            ? "Linux"
            : "Diğer";
  return { cihaz, tarayici, isletim };
}

export const qrTaramasiKaydet = createServerFn({ method: "GET" })
  .validator((kod: string) => kod.trim().slice(0, 64))
  .handler(async ({ data: kod }) => {
    const supabase = publicClient();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: qr } = await supabaseAdmin
      .from("qr_codes")
      .select("kod, hedef_slug, aktif")
      .eq("kod", kod)
      .maybeSingle();

    const hedef = qr?.aktif ? (qr.hedef_slug ?? null) : null;

    const request = getRequest();
    const ua = request?.headers.get("user-agent") ?? "";
    const { cihaz, tarayici, isletim } = cihazBilgisi(ua);

    await supabaseAdmin.from("qr_scans").insert({
      kod,
      hedef_slug: hedef,
      ulke: request?.headers.get("cf-ipcountry") ?? null,
      sehir: request?.headers.get("cf-ipcity") ?? null,
      cihaz,
      tarayici,
      isletim_sistemi: isletim,
      referrer: request?.headers.get("referer") ?? null,
    });

    if (!hedef) return { hedefSlug: null as string | null, bulundu: Boolean(qr) };

    const { data: kat } = await supabase
      .from("categories")
      .select("slug")
      .eq("slug", hedef)
      .eq("yayinda", true)
      .maybeSingle();

    return { hedefSlug: kat?.slug ?? null, bulundu: Boolean(qr) };
  });
