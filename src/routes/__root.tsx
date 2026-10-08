import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/magaza/Header";
import LoadingScreen from "@/components/magaza/LoadingScreen";
import { BOOT_SESSION_KEY, BootProvider } from "@/context/BootContext";
import { BOOT_IMAGE_DESKTOP, BOOT_VIDEO_DESKTOP, HERO_IMAGE } from "@/lib/onyukleme";
import Footer from "@/components/magaza/Footer";
import { CartProvider } from "@/context/CartContext";
import SepetCekmecesi from "@/components/magaza/SepetCekmecesi";
import { Toaster } from "@/components/ui/sonner";

const KahveAsistani = lazy(() =>
  import("@/components/site/KahveAsistani").then(({ KahveAsistani: Component }) => ({
    default: Component,
  })),
);
const AramaPaleti = lazy(() =>
  import("@/components/site/AramaPaleti").then(({ AramaPaleti: Component }) => ({
    default: Component,
  })),
);

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Bu sayfa yüklenmedi
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Bir hata oluştu. Sayfayı yenileyebilir veya ana sayfaya dönebilirsiniz.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tekrar dene
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Ana sayfaya dön
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FOR COFFEE — Özel Kahve ve Kahve Akademisi" },
      {
        name: "description",
        content: "Uzman kahve bilgisini herkes için erişilebilir hale getiriyoruz.",
      },
      { name: "author", content: "FOR COFFEE" },
      { property: "og:site_name", content: "FOR COFFEE" },
      {
        property: "og:description",
        content: "Çekirdekten fincana: premium kahve eğitimi, tamamen Türkçe.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter+Tight:wght@300;400;500;600&display=swap",
      },
      { rel: "preload", as: "image", href: HERO_IMAGE, fetchPriority: "high" },
      { rel: "preload", as: "image", href: BOOT_IMAGE_DESKTOP, fetchPriority: "high" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BootProvider>
          <CartProvider>
            <SiteChrome />
          </CartProvider>
        </BootProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

/** Tek marka kimliği: tüm sayfalar aynı header/footer ve tema altında. */
function SiteChrome() {
  const [aramaAcik, setAramaAcik] = useState(false);
  // Keep the first render identical on server and client. Browser storage is
  // read after hydration so it cannot change the SSR markup.
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [bootBitti, setBootBitti] = useState(() => pathname !== "/");

  useEffect(() => {
    // The cinematic boot is a homepage introduction, not a route guard. A
    // direct deep link must render immediately and survive browser refresh.
    if (pathname !== "/" || window.sessionStorage.getItem(BOOT_SESSION_KEY) === "1") {
      setBootBitti(true);
    }
  }, [pathname]);

  useEffect(() => {
    const tus = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setAramaAcik((a) => !a);
      }
    };
    window.addEventListener("keydown", tus);
    return () => window.removeEventListener("keydown", tus);
  }, []);

  return (
    <>
      {!bootBitti && <LoadingScreen onComplete={() => setBootBitti(true)} />}
      <div
        className={`flex min-h-screen flex-col bg-background text-foreground transition-[opacity,transform] duration-700 ease-out ${bootBitti ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-1"}`}
        aria-hidden={!bootBitti}
        inert={!bootBitti}
      >
        <Header />
        <main className="flex-1">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <Footer />
        <Suspense fallback={null}>
          <AramaPaleti acik={aramaAcik} kapat={() => setAramaAcik(false)} />
          <KahveAsistani />
        </Suspense>
        <SepetCekmecesi />
        <Toaster />
      </div>
    </>
  );
}
