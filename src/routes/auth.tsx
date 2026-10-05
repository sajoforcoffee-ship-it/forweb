import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Yönetim Girişi — FOR COFFEE Akademi" },
      {
        name: "description",
        content:
          "FOR COFFEE Dijital Kahve Akademisi yönetim paneline e-posta veya Google hesabınızla giriş yapın.",
      },
      { property: "og:title", content: "Yönetim Girişi — FOR COFFEE Akademi" },
      { property: "og:description", content: "Akademi yönetim paneline güvenli giriş." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthSayfasi,
});

function AuthSayfasi() {
  const navigate = useNavigate();
  const [mod, setMod] = useState<"giris" | "kayit">("giris");
  const [eposta, setEposta] = useState("");
  const [sifre, setSifre] = useState("");
  const [ad, setAd] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [mesaj, setMesaj] = useState<string | null>(null);
  const [hata, setHata] = useState<string | null>(null);

  async function gonder(e: React.FormEvent) {
    e.preventDefault();
    setHata(null);
    setMesaj(null);
    setYukleniyor(true);
    try {
      if (mod === "giris") {
        const { error } = await supabase.auth.signInWithPassword({
          email: eposta,
          password: sifre,
        });
        if (error)
          throw new Error(
            error.message.includes("Email not confirmed")
              ? "E-posta adresinizi doğrulayın."
              : "E-posta veya şifre geçersiz.",
          );
        navigate({ to: "/yonetim" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: eposta,
          password: sifre,
          options: {
            emailRedirectTo:
              import.meta.env["VITE_SUPABASE_REDIRECT_URL"] ??
              `${window.location.origin}/auth/callback`,
            data: { display_name: ad || eposta.split("@")[0] || "Kullanıcı" },
          },
        });
        if (error) throw new Error(error.message);
        if (data.session) navigate({ to: "/yonetim" });
        else setMesaj("Hesabınızı doğrulamak için e-postanıza gönderilen bağlantıya tıklayın.");
      }
    } catch (err) {
      setHata(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setYukleniyor(false);
    }
  }

  function googleIleGir() {
    setHata(
      "Google ile giriş yakında etkinleştirilecek. Şimdilik e-posta ve şifre ile devam edin.",
    );
  }

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex max-w-md flex-col px-6 py-24 lg:py-32">
        <span className="eyebrow">FOR COFFEE</span>
        <h1 className="mt-4 text-4xl leading-tight">Yönetim girişi</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          İçerik, kategori ve QR analitiklerini yönetmek için giriş yapın.
        </p>

        <button
          type="button"
          onClick={googleIleGir}
          className="lift mt-10 flex items-center justify-center gap-3 rounded-full border border-border px-6 py-3.5 text-sm surface"
        >
          <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9Z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z"
            />
            <path
              fill="#FBBC05"
              d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0A12 12 0 0 0 1.4 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8Z"
            />
          </svg>
          Google ile devam et
        </button>

        <div className="my-8 flex items-center gap-4 text-[10px] tracking-[0.2em] text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> VEYA <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={gonder} className="space-y-4">
          {mod === "kayit" && (
            <label className="flex flex-col gap-2 text-sm">
              Ad Soyad
              <input
                id="ad-soyad"
                value={ad}
                onChange={(e) => setAd(e.target.value)}
                placeholder="Ad Soyad"
                className="w-full rounded-xl border border-border bg-transparent px-4 py-3 text-sm outline-hidden focus:border-gold"
              />
            </label>
          )}
          <input
            type="email"
            required
            value={eposta}
            onChange={(e) => setEposta(e.target.value)}
            placeholder="E-posta"
            className="w-full rounded-xl border border-border bg-transparent px-4 py-3 text-sm outline-hidden focus:border-gold"
          />
          <input
            type="password"
            required
            minLength={6}
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
            placeholder="Şifre"
            className="w-full rounded-xl border border-border bg-transparent px-4 py-3 text-sm outline-hidden focus:border-gold"
          />
          {hata && <p className="text-sm text-destructive">{hata}</p>}
          {mesaj && <p className="text-sm text-gold">{mesaj}</p>}
          <button
            type="submit"
            disabled={yukleniyor}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm text-background disabled:opacity-60"
          >
            {yukleniyor && <Loader2 className="size-4 animate-spin" />}
            {mod === "giris" ? "Giriş yap" : "Hesap oluştur"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMod(mod === "giris" ? "kayit" : "giris")}
          className="mt-6 text-xs text-muted-foreground transition-colors hover:text-gold"
        >
          {mod === "giris" ? "Hesabınız yok mu? Kayıt olun" : "Zaten hesabınız var mı? Giriş yapın"}
        </button>
      </main>
    </div>
  );
}
