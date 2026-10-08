import { useEffect, useState } from "react";

import { useBoot } from "@/context/BootContext";
import { BOOT_IMAGE_DESKTOP, bootImageUrl } from "@/lib/onyukleme";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const { hazir } = useBoot();
  const [fadingOut, setFadingOut] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(BOOT_IMAGE_DESKTOP);

  useEffect(() => {
    setBackgroundImage(bootImageUrl());
  }, []);

  useEffect(() => {
    if (!hazir) return;
    const fadeTimer = setTimeout(() => setFadingOut(true), 150);
    const completeTimer = setTimeout(onComplete, 850);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [hazir, onComplete]);

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden bg-black"
      style={{
        opacity: fadingOut ? 0 : 1,
        transform: fadingOut ? "scale(1.03)" : "scale(1)",
        transition: "opacity 160ms ease-out",
        pointerEvents: fadingOut ? "none" : "auto",
      }}
    >
      <picture className="loading-background" aria-hidden="true">
        <source
          media="(max-width: 767px)"
          srcSet="https://forcoffeetr.com/magaza/wp-content/uploads/2026/09/mobhead.png"
        />
        <img src={backgroundImage} alt="" fetchPriority="high" decoding="async" />
      </picture>
      <div className="loading-copy" aria-hidden="true">
        <p className="loading-copy-brand">FOR COFFEE THE ART OF COFFEE</p>
        <p className="loading-copy-message">Kahve deneyiminiz hazırlanıyor…</p>
        <p className="loading-copy-status">
          Yükleniyor<span className="loading-copy-cursor">|</span>
        </p>
      </div>
    </div>
  );
}
