import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { SepetKalemi } from "@/context/CartContext";
import { z } from "zod";

type CartSyncInput = {
  items: SepetKalemi[];
  subtotal: number;
};

function normalizeItems(items: SepetKalemi[]) {
  return items.slice(0, 50).map((item) => ({
    anahtar: String(item.anahtar).slice(0, 160),
    urunId: Number(item.urunId),
    slug: String(item.slug).slice(0, 180),
    ad: String(item.ad).slice(0, 180),
    varyantId: String(item.varyantId).slice(0, 80),
    varyantEtiket: String(item.varyantEtiket).slice(0, 120),
    ogutme: item.ogutme ? String(item.ogutme).slice(0, 80) : null,
    fiyat: Math.max(0, Number(item.fiyat) || 0),
    adet: Math.min(99, Math.max(1, Math.floor(Number(item.adet) || 1))),
  }));
}

export const abandonedCartSync = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: unknown) =>
      z
        .object({
          items: z.array(z.unknown()).max(50),
          subtotal: z.number().finite().nonnegative(),
        })
        .parse(input) as CartSyncInput,
  )
  .handler(async ({ data, context }) => {
    const items = normalizeItems(data.items);
    if (items.length === 0) return { ok: true, tracked: false };

    const subtotalCents = Math.round(
      items.reduce((sum, item) => sum + item.fiyat * item.adet, 0) * 100,
    );
    const tokenHash = `user:${context.userId}`;
    // The generated Supabase schema does not yet include this operational table.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = context.supabase as any;
    const { error } = await supabase.from("abandoned_carts").upsert(
      {
        user_id: context.userId,
        recovery_token_hash: tokenHash,
        items,
        subtotal_cents: subtotalCents,
        status: "active",
        last_activity_at: new Date().toISOString(),
        abandoned_at: null,
        recovered_at: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "recovery_token_hash" },
    );
    if (error) throw new Error("Sepet senkronizasyonu başarısız oldu.");
    return { ok: true, tracked: true };
  });

export const abandonedCartClose = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((status: "recovered" | "dismissed") => status)
  .handler(async ({ data: status, context }) => {
    // The generated Supabase schema does not yet include this operational table.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = context.supabase as any;
    const { error } = await supabase
      .from("abandoned_carts")
      .update({ status, recovered_at: status === "recovered" ? new Date().toISOString() : null })
      .eq("user_id", context.userId)
      .eq("status", "active");
    if (error) throw new Error("Sepet durumu güncellenemedi.");
    return { ok: true };
  });
