import girisImg from "@/assets/cat-giris.jpg";
import cekirdekImg from "@/assets/cat-cekirdek.jpg";
import kokenImg from "@/assets/cat-koken.jpg";
import harmanImg from "@/assets/cat-harman.jpg";
import ogutmeImg from "@/assets/cat-ogutme.jpg";
import demlemeImg from "@/assets/cat-demleme.jpg";

const gorseller: Record<string, string> = {
  "kahveye-giris": girisImg,
  "cekirdek-kalitesi": cekirdekImg,
  "tek-koken": kokenImg,
  harman: harmanImg,
  "ogutme-rehberi": ogutmeImg,
  "demleme-teknikleri": demlemeImg,
  giris: girisImg,
  cekirdek: cekirdekImg,
  koken: kokenImg,
  ogutme: ogutmeImg,
  demleme: demlemeImg,
};

export const gorselAnahtarlari = Object.keys(gorseller);

export function gorselGetir(anahtar: string | null | undefined): string {
  return (anahtar && gorseller[anahtar]) || girisImg;
}
