/**
 * Logo sistemi — gerçek marka logosu yüklenene kadar premium tipografik
 * yer tutucu. Yükleme sonrası yalnızca bu bileşen güncellenir.
 * Önerilen ölçüler: masaüstü 160×32, mobil 120×24, favicon 64×64, PWA 512×512.
 */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3" aria-label="FOR COFFEE Dijital Kahve Akademisi">
      <span className="flex size-9 items-center justify-center rounded-full border border-gold/60 text-[13px] tracking-[0.08em] text-gold">
        FC
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-[13px] font-medium tracking-[0.28em] text-foreground">
            FOR COFFEE
          </span>
          <span className="block text-[9px] tracking-[0.24em] text-muted-foreground">
            DİJİTAL KAHVE AKADEMİSİ
          </span>
        </span>
      )}
    </span>
  );
}
