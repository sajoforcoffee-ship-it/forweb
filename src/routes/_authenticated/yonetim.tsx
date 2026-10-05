import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BarChart3, BookOpenText, LogOut, Menu, PanelLeft, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { oturumBilgisi } from "@/lib/yonetim.functions";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/_authenticated/yonetim")({
  head: () => ({
    meta: [
      { title: "Yönetim Paneli — FOR COFFEE Akademi" },
      { name: "description", content: "İçerik, kategori ve QR analitiği yönetimi." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: YonetimDuzeni,
});

function YonetimDuzeni() {
  const navigate = useNavigate();
  const [mobilMenu, setMobilMenu] = useState(false);
  const queryClient = useQueryClient();
  const { data: oturum, isLoading } = useQuery({
    queryKey: ["oturum"],
    queryFn: () => oturumBilgisi(),
  });

  async function cikis() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Yükleniyor…
      </div>
    );
  }

  if (!oturum?.yetkili) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="text-3xl">Yetkiniz yok</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Bu panele yalnızca yönetici ve editör rolüne sahip hesaplar erişebilir.
        </p>
        <button onClick={cikis} className="rounded-full border border-border px-6 py-3 text-sm">
          Çıkış yap
        </button>
      </div>
    );
  }

  const menuItems = [
    { to: "/yonetim" as const, label: "Analitik", icon: BarChart3 },
    { to: "/yonetim/icerik" as const, label: "İçerik yönetimi", icon: BookOpenText },
  ];

  return (
    <div className="admin-shell min-h-screen bg-background">
      <aside className="admin-sidebar hidden border-r border-border bg-sidebar lg:flex lg:flex-col">
        <div className="flex h-20 items-center border-b border-border px-7">
          <Link to="/" className="shrink-0">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 flex-col px-4 py-7">
          <p className="admin-kicker px-3">Workspace</p>
          <nav className="mt-4 space-y-1.5" aria-label="Yönetim navigasyonu">
            {menuItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/yonetim" }}
                activeProps={{ className: "admin-nav-item admin-nav-active" }}
                className="admin-nav-item"
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl border border-border bg-card p-4">
            <p className="admin-kicker">FOR COFFEE</p>
            <p className="mt-2 text-sm font-medium">İçerik çalışma alanı</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Akademi deneyimini buradan yönetin.
            </p>
          </div>
        </div>
      </aside>
      <div className="admin-main min-w-0">
        <header className="admin-topbar sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
          <div className="flex h-20 items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
            <button
              type="button"
              onClick={() => setMobilMenu(true)}
              className="rounded-xl border border-border p-2.5 lg:hidden"
              aria-label="Menüyü aç"
            >
              <Menu className="size-4" />
            </button>
            <div className="hidden items-center gap-3 lg:flex">
              <PanelLeft className="size-4 text-gold" />
              <span className="text-sm text-muted-foreground">Yönetim merkezi</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Siteyi görüntüle
              </Link>
              <button
                onClick={cikis}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="size-3.5" /> Çıkış
              </button>
            </div>
          </div>
        </header>
        {mobilMenu && (
          <div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setMobilMenu(false)}
          >
            <aside
              className="h-full w-[min(84vw,320px)] border-r border-border bg-sidebar p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button onClick={() => setMobilMenu(false)} aria-label="Menüyü kapat">
                  <X className="size-5" />
                </button>
              </div>
              <nav className="mt-10 space-y-2" aria-label="Mobil yönetim navigasyonu">
                {menuItems.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobilMenu(false)}
                    className="admin-nav-item"
                  >
                    <Icon className="size-4" />
                    {label}
                  </Link>
                ))}
              </nav>
            </aside>
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
}
