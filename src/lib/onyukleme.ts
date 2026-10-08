/**
 * Gerçek ön yükleme (boot) katmanı.
 * Hiçbir sahte zamanlayıcı yok: ilerleme yalnızca tamamlanan kaynak ağırlıklarından gelir.
 */

export const HERO_VIDEO_DESKTOP =
  "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/07/hero.mp4";
/** Mobil hero videosu ayrı verilene kadar aynı kaynak kullanılıyor. */
export const HERO_VIDEO_MOBILE =
  "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/07/hero.mp4";
export const HERO_IMAGE =
  "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/07/herpic.png";

export const BOOT_IMAGE_DESKTOP =
  "https://forcoffeetr.com/magaza/wp-content/uploads/2026/09/hero1-scaled.png";
export const BOOT_IMAGE_MOBILE =
  "https://forcoffeetr.com/magaza/wp-content/uploads/2026/09/mobhead.png";
export const BOOT_VIDEO_DESKTOP =
  "https://forcoffeetr.com/magaza/wp-content/uploads/2026/09/heroload.mp4";
/** Mobil loading animasyonu aynı hafif overlay videosunu kullanır. */
export const BOOT_VIDEO_MOBILE = BOOT_VIDEO_DESKTOP;

export function bootImageUrl(): string {
  if (typeof window === "undefined") return BOOT_IMAGE_DESKTOP;
  return window.matchMedia("(max-width: 767px)").matches ? BOOT_IMAGE_MOBILE : BOOT_IMAGE_DESKTOP;
}

/** Cihaza göre tek bir açılış videosu kaynağı; diğeri hiç indirilmez. */
export function bootVideoUrl(): string {
  if (typeof window === "undefined") return BOOT_VIDEO_DESKTOP;
  return window.matchMedia("(max-width: 767px)").matches ? BOOT_VIDEO_MOBILE : BOOT_VIDEO_DESKTOP;
}

export function heroVideoUrl(): string {
  if (typeof window === "undefined") return HERO_VIDEO_DESKTOP;
  return window.matchMedia("(max-width: 767px)").matches ? HERO_VIDEO_MOBILE : HERO_VIDEO_DESKTOP;
}

export type BootDurum = {
  ilerleme: number;
  asama: string;
  hazir: boolean;
  heroVideoHazir: boolean;
  heroGorselHazir: boolean;
  kritikHata: boolean;
};

/** Ön yüklenen video elementleri: GC edilmemeleri için modülde tutulur (buffer korunur). */
const videoDeposu = new Map<string, HTMLVideoElement>();
const gorselDeposu = new Map<string, HTMLImageElement>();

export function onYuklenmisVideo(src: string): HTMLVideoElement | undefined {
  return videoDeposu.get(src);
}

/**
 * Açılış videosu için TEK bir <video> elementi döndürür (modül seviyesinde tekil).
 * React yeniden mount olsa bile aynı element kullanılır; video ikinci kez başlamaz.
 */
export function bootVideoElementi(): HTMLVideoElement {
  const src = bootVideoUrl();
  const mevcut = videoDeposu.get(src);
  if (mevcut) return mevcut;
  const video = document.createElement("video");
  video.src = src;
  video.preload = "auto";
  video.muted = true;
  video.defaultMuted = true;
  video.loop = false;
  video.autoplay = false;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.className = "w-full h-full object-cover";
  videoDeposu.set(src, video);
  return video;
}

function zamanAsimi<T>(p: Promise<T>, ms: number): Promise<T | "timeout"> {
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve("timeout"), ms);
    p.then((v) => {
      clearTimeout(t);
      resolve(v);
    }).catch(() => {
      clearTimeout(t);
      resolve("timeout");
    });
  });
}

export function gorselYukle(src: string): Promise<void> {
  const mevcut = gorselDeposu.get(src);
  if (mevcut?.complete) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      gorselDeposu.set(src, img);
      if (typeof img.decode === "function") {
        img.decode().then(
          () => resolve(),
          () => resolve(),
        );
      } else resolve();
    };
    img.onerror = () => reject(new Error(`gorsel: ${src}`));
    img.src = src;
  });
}

/** Videoyu oynatılabilir hale gelene kadar (canplaythrough / yeterli buffer) yükler. */
export function videoYukle(src: string, muted = true): Promise<HTMLVideoElement> {
  const mevcut = videoDeposu.get(src);
  if (mevcut && mevcut.readyState >= 2) return Promise.resolve(mevcut);

  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = src;
    video.preload = "auto";
    video.muted = muted;
    video.playsInline = true;
    videoDeposu.set(src, video);

    const bitir = () => {
      temizle();
      resolve(video);
    };
    const hata = () => {
      temizle();
      reject(new Error(`video: ${src}`));
    };
    // readyState >= 2: metadata + ilk oynatılabilir kare hazır. Video arka planda
    // buffer'lamaya devam eder; 29 MB'lık dosyanın tamamı beklenmez.
    const ilerleme = () => {
      if (video.readyState >= 2) bitir();
    };
    function temizle() {
      video.removeEventListener("canplaythrough", bitir);
      video.removeEventListener("error", hata);
      video.removeEventListener("progress", ilerleme);
      video.removeEventListener("loadeddata", ilerleme);
    }
    video.addEventListener("canplaythrough", bitir);
    video.addEventListener("loadeddata", ilerleme);
    video.addEventListener("progress", ilerleme);
    video.addEventListener("error", hata);
    video.load();
  });
}

export function fontlariBekle(): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) return Promise.resolve();
  return (document as Document).fonts.ready.then(() => undefined);
}

type Gorev = { agirlik: number; asama: string; is: () => Promise<unknown>; kritik: boolean };

/**
 * Boot sürecini yürütür. Kritik kaynaklar için 15s, ikincil için 8s üst sınır vardır;
 * böylece bir kaynak yüklenemezse site sonsuza kadar loading ekranında kalmaz.
 */
export async function bootBaslat(guncelle: (d: Partial<BootDurum>) => void): Promise<void> {
  const heroVideo = heroVideoUrl();

  const gorevler: Gorev[] = [
    {
      agirlik: 8,
      asama: "Temel kaynaklar hazırlanıyor",
      kritik: true,
      is: () => fontlariBekle(),
    },
    {
      agirlik: 12,
      asama: "Görseller hazırlanıyor",
      kritik: true,
      is: () => gorselYukle(HERO_IMAGE).then(() => guncelle({ heroGorselHazir: true })),
    },
    {
      agirlik: 35,
      asama: "Videolar hazırlanıyor",
      kritik: true,
      is: () => videoYukle(heroVideo).then(() => guncelle({ heroVideoHazir: true })),
    },
  ];

  const toplam = gorevler.reduce((t, g) => t + g.agirlik, 0);
  let tamamlanan = 0;
  let kritikHata = false;

  await Promise.all(
    gorevler.map(async (g) => {
      guncelle({ asama: g.asama });
      const sonuc = await zamanAsimi(g.is(), g.kritik ? 15000 : 10000);
      if (sonuc === "timeout" && g.kritik) kritikHata = true;
      tamamlanan += g.agirlik;
      guncelle({ ilerleme: Math.round((tamamlanan / toplam) * 100) });
    }),
  );

  guncelle({ ilerleme: 100, asama: "Site hazır", kritikHata, hazir: true });
}
