import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { OgutmeSecenegi, Urun, Varyant } from "@/data/urunler";
import { abandonedCartSync } from "@/lib/abandoned-cart.functions";

/**
 * FOR COFFEE yerel sepet sistemi.
 * WooCommerce bağımlılığı yoktur; sepet localStorage'da saklanır ve
 * sekme yenilense bile korunur.
 */

export interface SepetKalemi {
  /** urunId-varyantId-ogutme birleşimi; aynı kombinasyon tek satırda toplanır. */
  anahtar: string;
  urunId: number;
  slug: string;
  ad: string;
  gorsel?: string | undefined;
  varyantId: string;
  varyantEtiket: string;
  ogutme?: OgutmeSecenegi | undefined;
  fiyat: number;
  adet: number;
}

interface SepetContextDegeri {
  kalemler: SepetKalemi[];
  sepeteEkle: (
    urun: Urun,
    varyant: Varyant,
    ogutme: OgutmeSecenegi | undefined,
    adet: number,
  ) => void;
  kaldir: (anahtar: string) => void;
  adetAyarla: (anahtar: string, adet: number) => void;
  temizle: () => void;
  toplamAdet: number;
  araToplam: number;
  cekmeceAcik: boolean;
  cekmeceAc: () => void;
  cekmeceKapat: () => void;
}

const SepetContext = createContext<SepetContextDegeri | null>(null);

const DEPOLAMA_ANAHTARI = "for-coffee-sepet";

export function CartProvider({ children }: { children: ReactNode }) {
  const [kalemler, setKalemler] = useState<SepetKalemi[]>([]);
  const [cekmeceAcik, setCekmeceAcik] = useState(false);
  const [yuklendi, setYuklendi] = useState(false);

  // SSR güvenliği: localStorage'a yalnızca istemcide, mount sonrası eriş.
  useEffect(() => {
    try {
      const kayit = window.localStorage.getItem(DEPOLAMA_ANAHTARI);
      if (kayit) {
        const parsed = JSON.parse(kayit);
        if (Array.isArray(parsed)) setKalemler(parsed);
      }
    } catch {
      // Bozuk kayıt varsa sessizce sıfırdan başla.
    }
    setYuklendi(true);
  }, []);

  useEffect(() => {
    if (!yuklendi) return;
    try {
      window.localStorage.setItem(DEPOLAMA_ANAHTARI, JSON.stringify(kalemler));
    } catch {
      // Depolama doluysa sepet yalnızca bellekte kalır.
    }

    if (kalemler.length === 0) return;
    const timeout = window.setTimeout(() => {
      void abandonedCartSync({ data: { items: kalemler, subtotal: 0 } }).catch(() => {
        // Guest users and offline sessions are intentionally not tracked server-side.
      });
    }, 1200);
    return () => window.clearTimeout(timeout);
  }, [kalemler, yuklendi]);

  const sepeteEkle = useCallback(
    (urun: Urun, varyant: Varyant, ogutme: OgutmeSecenegi | undefined, adet: number) => {
      const anahtar = `${urun.id}-${varyant.id}-${ogutme ?? "standart"}`;
      setKalemler((onceki) => {
        const mevcut = onceki.find((k) => k.anahtar === anahtar);
        if (mevcut) {
          return onceki.map((k) => (k.anahtar === anahtar ? { ...k, adet: k.adet + adet } : k));
        }
        const yeni: SepetKalemi = {
          anahtar,
          urunId: urun.id,
          slug: urun.slug,
          ad: urun.ad,
          gorsel: urun.gorseller[0],
          varyantId: varyant.id,
          varyantEtiket: varyant.etiket,
          ogutme,
          fiyat: varyant.fiyat,
          adet,
        };
        return [...onceki, yeni];
      });
    },
    [],
  );

  const kaldir = useCallback((anahtar: string) => {
    setKalemler((onceki) => onceki.filter((k) => k.anahtar !== anahtar));
  }, []);

  const adetAyarla = useCallback((anahtar: string, adet: number) => {
    setKalemler((onceki) =>
      adet <= 0
        ? onceki.filter((k) => k.anahtar !== anahtar)
        : onceki.map((k) => (k.anahtar === anahtar ? { ...k, adet } : k)),
    );
  }, []);

  const temizle = useCallback(() => setKalemler([]), []);
  const cekmeceAc = useCallback(() => setCekmeceAcik(true), []);
  const cekmeceKapat = useCallback(() => setCekmeceAcik(false), []);

  const deger = useMemo<SepetContextDegeri>(() => {
    const toplamAdet = kalemler.reduce((t, k) => t + k.adet, 0);
    const araToplam = kalemler.reduce((t, k) => t + k.adet * k.fiyat, 0);
    return {
      kalemler,
      sepeteEkle,
      kaldir,
      adetAyarla,
      temizle,
      toplamAdet,
      araToplam,
      cekmeceAcik,
      cekmeceAc,
      cekmeceKapat,
    };
  }, [kalemler, sepeteEkle, kaldir, adetAyarla, temizle, cekmeceAcik, cekmeceAc, cekmeceKapat]);

  return <SepetContext.Provider value={deger}>{children}</SepetContext.Provider>;
}

export function useCart(): SepetContextDegeri {
  const ctx = useContext(SepetContext);
  if (!ctx) throw new Error("useCart, CartProvider içinde kullanılmalıdır.");
  return ctx;
}
