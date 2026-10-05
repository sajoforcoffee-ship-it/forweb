import { kategoriler } from "@/data/akademi";

export type AramaSonucu = {
  id: string;
  tur: "kategori" | "bolum";
  baslik: string;
  altBaslik: string;
  ozet: string;
  to: string;
  hash?: string;
  puan: number;
};

const HARF: Record<string, string> = {
  ı: "i",
  İ: "i",
  I: "i",
  ş: "s",
  Ş: "s",
  ğ: "g",
  Ğ: "g",
  ü: "u",
  Ü: "u",
  ö: "o",
  Ö: "o",
  ç: "c",
  Ç: "c",
};

export function normalize(metin: string) {
  return metin
    .split("")
    .map((c) => HARF[c] ?? c)
    .join("")
    .toLocaleLowerCase("en")
    .replace(/\s+/g, " ")
    .trim();
}

/** Basit bulanık eşleşme: harfler sırayla geçiyor mu? */
function bulanik(hedef: string, sorgu: string) {
  let i = 0;
  for (const c of hedef) {
    if (c === sorgu[i]) i++;
    if (i === sorgu.length) return true;
  }
  return false;
}

function skor(alanlar: { metin: string; agirlik: number }[], kelimeler: string[]) {
  let toplam = 0;
  for (const kelime of kelimeler) {
    let enIyi = 0;
    for (const { metin, agirlik } of alanlar) {
      const idx = metin.indexOf(kelime);
      if (idx === 0) enIyi = Math.max(enIyi, agirlik * 3);
      else if (idx > 0) enIyi = Math.max(enIyi, agirlik * 2);
      else if (kelime.length >= 3 && bulanik(metin, kelime)) enIyi = Math.max(enIyi, agirlik);
    }
    if (enIyi === 0) return 0; // her kelime eşleşmeli
    toplam += enIyi;
  }
  return toplam;
}

function kisalt(metin: string, uzunluk = 140) {
  const t = metin.replace(/\s+/g, " ").trim();
  return t.length > uzunluk ? `${t.slice(0, uzunluk).trimEnd()}…` : t;
}

export function bolumSlug(baslik: string) {
  return normalize(baslik)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function araSitede(sorgu: string, limit = 12): AramaSonucu[] {
  const kelimeler = normalize(sorgu).split(" ").filter(Boolean);
  if (kelimeler.length === 0) return [];

  const sonuclar: AramaSonucu[] = [];

  for (const k of kategoriler) {
    const kPuan = skor(
      [
        { metin: normalize(k.ad), agirlik: 10 },
        { metin: normalize(k.ozet), agirlik: 5 },
        { metin: normalize(k.giris), agirlik: 3 },
      ],
      kelimeler,
    );
    if (kPuan > 0) {
      sonuclar.push({
        id: `k-${k.slug}`,
        tur: "kategori",
        baslik: k.ad,
        altBaslik: `${k.seviye} · ${k.sure}`,
        ozet: kisalt(k.ozet),
        to: `/kategoriler/${k.slug}`,
        puan: kPuan + 4,
      });
    }

    for (const b of k.bolumler) {
      const govde = [...(b.paragraflar ?? []), ...(b.maddeler ?? []), b.not ?? ""]
        .filter(Boolean)
        .join(" ");
      const bPuan = skor(
        [
          { metin: normalize(b.baslik), agirlik: 8 },
          { metin: normalize(govde), agirlik: 4 },
        ],
        kelimeler,
      );
      if (bPuan > 0) {
        sonuclar.push({
          id: `b-${k.slug}-${bolumSlug(b.baslik)}`,
          tur: "bolum",
          baslik: b.baslik,
          altBaslik: k.ad,
          ozet: kisalt(govde),
          to: `/kategoriler/${k.slug}`,
          hash: bolumSlug(b.baslik),
          puan: bPuan,
        });
      }
    }
  }

  return sonuclar.sort((a, b) => b.puan - a.puan).slice(0, limit);
}
