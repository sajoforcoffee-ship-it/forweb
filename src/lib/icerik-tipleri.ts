export type KategoriDTO = {
  id: string;
  slug: string;
  ad: string;
  ozet: string;
  giris: string;
  seviye: string;
  sure: string;
  gorselAnahtar: string;
  sira: number;
  yayinda: boolean;
  dersSayisi: number;
};

export type MakaleDTO = {
  id: string;
  categoryId: string;
  slug: string;
  baslik: string;
  ozet: string;
  icerik: string;
  sira: number;
  yayinda: boolean;
};

export type QrKodDTO = {
  id: string;
  kod: string;
  etiket: string;
  hedefSlug: string | null;
  aktif: boolean;
};

export const SEVIYELER = ["Başlangıç", "Orta", "İleri"] as const;
