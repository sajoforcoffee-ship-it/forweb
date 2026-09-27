/**
 * FOR COFFEE — merkezî ürün URL sistemi.
 *
 * Projedeki TÜM ürün bağlantıları bu dosyadan üretilir.
 * Başka hiçbir yerde elle ürün URL'si yazılmaz.
 *
 *   urunYolu(urun)        -> "/urun/espresso-african-gold"
 *   urunLinkProps(urun)   -> <Link {...urunLinkProps(u)} /> için { to, params }
 *   slugOlustur(ad)       -> Türkçe karakterleri çözen SEO dostu slug
 *   benzersizSlug(ad, [])-> çakışma varsa "-2", "-3" ekler
 *   yeniSlugBul(eski)     -> eski (WooCommerce) slug/ID'yi yeni slug'a çevirir
 */

import { URUNLER, type Urun } from "@/data/urunler";

/* ------------------------------- Slugify -------------------------------- */

const TR_HARITA: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  İ: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
  â: "a",
  Â: "a",
  î: "i",
  Î: "i",
  û: "u",
  Û: "u",
};

/** Türkçe karakterleri düzgün çözen, SEO dostu slug üretir. */
export function slugOlustur(metin: string): string {
  return metin
    .trim()
    .replace(/[çÇğĞıİöÖşŞüÜâÂîÎûÛ]/g, (h) => TR_HARITA[h] ?? h)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " ve ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/**
 * Var olan slug'larla çakışmayan benzersiz bir slug üretir.
 * Aynı isimli ikinci ürün "…-2", üçüncüsü "…-3" olur.
 */
export function benzersizSlug(ad: string, mevcutSluglar: Iterable<string>): string {
  const kume = new Set(mevcutSluglar);
  const taban = slugOlustur(ad) || "urun";
  if (!kume.has(taban)) return taban;
  let i = 2;
  while (kume.has(`${taban}-${i}`)) i += 1;
  return `${taban}-${i}`;
}

/* ------------------------------ URL üretimi ----------------------------- */

/** Tek standart ürün URL'si. Uygulamanın tamamı bunu kullanır. */
export function urunYolu(urun: Pick<Urun, "slug">): string {
  return `/urun/${urun.slug}`;
}

/** TanStack Router <Link> için tipli props. */
export function urunLinkProps(urun: Pick<Urun, "slug">) {
  return { to: "/urun/$slug" as const, params: { slug: urun.slug } };
}

/** Kanonik mutlak URL (SEO / paylaşım için). */
export function urunKanonik(urun: Pick<Urun, "slug">, kokenUrl = ""): string {
  return `${kokenUrl}${urunYolu(urun)}`;
}

/* ------------------------- Geriye dönük uyumluluk ----------------------- */

/**
 * Eski WooCommerce ürün slug'ları → yeni yerel slug.
 * Yalnızca yönlendirme (redirect) için kullanılır; aktif linklerde kullanılmaz.
 */
export const ESKI_SLUG_HARITASI: Record<string, string> = {
  "hot-chocolate": "sicak-cikolata",
  "orijinal-matcha-japon-yesil-cay-tozu-saf-matcha": "orijinal-matcha",
  "winterfell-ozel-bitki-cayi-karisimi": "winterfell-bitki-cayi",
  "blue-butterfly-tea": "mavi-kelebek-cayi",
  "stanley-classic-trigger-action-termos": "stanley-classic-trigger",
  "stanley-the-aerolight-termos": "stanley-aerolight",
  "v-60-demleme-seti": "v60-demleme-seti",
  "chemex-400-ml-cam-filtre-kahve-demligi": "chemex-400-ml",
  "turkish-coffee": "turk-kahvesi",
  "ethiopian-sidamo-grade": "ethiopia-sidamo",
  "ethiopian-sidamoo": "ethiopia-sidamo",
  "ethiopian-sidamo": "ethiopia-sidamo",
  "peru-papagoya-grade": "peru-papagoya",
  "guatemala-grade-1": "guatemala-antigua",
  "colombia-superemo1": "kolombiya-supremo",
  "colombia-supremo": "kolombiya-supremo",
  africablend: "africa-sunrise-blend",
  "signature-blend": "signature-filter-blend",
  "blue-mountain": "jamaica-blue-mountain",
  "blue-mountain-jamaika": "jamaica-blue-mountain",
};

/** Eski mağaza ürün ID'leri → yeni slug (ör. /product?id=14). */
export const ESKI_ID_HARITASI: Record<number, string> = {
  1: "sicak-cikolata",
  2: "orijinal-matcha",
  3: "winterfell-bitki-cayi",
  4: "mavi-kelebek-cayi",
  5: "stanley-classic-trigger",
  6: "stanley-aerolight",
  7: "v60-demleme-seti",
  8: "chemex-400-ml",
  9: "costa-rica-tarrazu",
  10: "el-salvador",
  11: "turk-kahvesi",
  12: "ethiopia-sidamo",
  13: "peru-papagoya",
  14: "guatemala-antigua",
  15: "kenya-aa",
  16: "sumatra-blu-batak",
  17: "uganda-bigusi",
  18: "peru-ecoforest",
  19: "ethiopia-sidamo",
  20: "kolombiya-supremo",
  22: "jamaica-blue-mountain",
  23: "nikaragua-gold",
  24: "honduras",
  25: "el-salvador",
  26: "africa-sunrise-blend",
  27: "special-espresso-blend",
  28: "signature-filter-blend",
};

const GECERLI_SLUGLAR = new Set(URUNLER.map((u) => u.slug));

/**
 * Eski bir slug ya da ID verildiğinde geçerli yeni slug'ı döndürür.
 * Eşleşme yoksa undefined döner (404 gösterilir).
 */
export function yeniSlugBul(eski: string | number | undefined): string | undefined {
  if (eski === undefined || eski === null || eski === "") return undefined;

  if (typeof eski === "number" || /^\d+$/.test(String(eski))) {
    const id = Number(eski);
    const idIle = URUNLER.find((u) => u.id === id)?.slug ?? ESKI_ID_HARITASI[id];
    return idIle && GECERLI_SLUGLAR.has(idIle) ? idIle : undefined;
  }

  const ham =
    String(eski)
      .replace(/^\/+|\/+$/g, "")
      .split("/")
      .pop() ?? "";
  if (GECERLI_SLUGLAR.has(ham)) return ham;

  const esleme = ESKI_SLUG_HARITASI[ham];
  if (esleme && GECERLI_SLUGLAR.has(esleme)) return esleme;

  const normal = slugOlustur(ham);
  if (GECERLI_SLUGLAR.has(normal)) return normal;
  const normalEsleme = ESKI_SLUG_HARITASI[normal];
  return normalEsleme && GECERLI_SLUGLAR.has(normalEsleme) ? normalEsleme : undefined;
}

/* --------------------------- Bütünlük kontrolü -------------------------- */

// Geliştirme sırasında slug çakışması / boş slug'ı erkenden yakala.
if (import.meta.env.DEV) {
  const gorulen = new Set<string>();
  for (const u of URUNLER) {
    if (!u.slug) console.error(`[urun-url] Slug boş: ${u.ad}`);
    if (gorulen.has(u.slug)) console.error(`[urun-url] Slug çakışması: ${u.slug}`);
    if (u.slug !== slugOlustur(u.slug)) {
      console.warn(`[urun-url] Slug SEO formatında değil: ${u.slug}`);
    }
    gorulen.add(u.slug);
  }
}
