import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

import { bootBaslat, type BootDurum } from "@/lib/onyukleme";

const baslangic: BootDurum = {
  ilerleme: 0,
  asama: "Temel kaynaklar hazırlanıyor",
  hazir: false,
  heroVideoHazir: false,
  heroGorselHazir: false,
  kritikHata: false,
};

export const BOOT_SESSION_KEY = "forcoffee:initial-boot-complete";

const BootContext = createContext<BootDurum>(baslangic);

export function useBoot() {
  return useContext(BootContext);
}

export function BootProvider({ children }: { children: ReactNode }) {
  // Keep server and first client render identical. Session storage is only
  // consulted after hydration to avoid rendering a different tree in the browser.
  const [durum, setDurum] = useState<BootDurum>(baslangic);
  const basladiRef = useRef(false);

  useEffect(() => {
    if (basladiRef.current || durum.hazir) return;
    basladiRef.current = true;

    if (window.sessionStorage.getItem(BOOT_SESSION_KEY) === "1") {
      setDurum({ ...baslangic, ilerleme: 100, hazir: true });
      return;
    }

    void bootBaslat((parca) => {
      setDurum((onceki) => {
        const sonraki = {
          ...onceki,
          ...parca,
          ilerleme: Math.max(onceki.ilerleme, parca.ilerleme ?? 0),
        };
        if (sonraki.hazir) window.sessionStorage.setItem(BOOT_SESSION_KEY, "1");
        return sonraki;
      });
    });
  }, [durum.hazir]);

  return <BootContext.Provider value={durum}>{children}</BootContext.Provider>;
}
