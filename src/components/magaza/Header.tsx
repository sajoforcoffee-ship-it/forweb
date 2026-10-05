import { useState, useEffect, useRef, useCallback } from "react";
import {
  Menu,
  X,
  ShoppingBag,
  User,
  Heart,
  Search,
  Sun,
  Moon,
  ChevronDown,
  ArrowRight,
  Package,
  MapPin,
  Settings,
  LogOut,
} from "lucide-react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";

const megaMenuData = [
  {
    title: "Tek Köken",
    desc: "Dünyanın seçkin çiftliklerinden özenle seçilmiş tek köken kahveler.",
    image: "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/02/guatemala-antigua.png",
    href: "https://www.forcoffeetr.com/magaza/kategori/single-origin/",
  },
  {
    title: "Espresso Harmanları",
    desc: "Yoğun gövde ve dengeli tat profiliyle espresso tutkunları için.",
    image: "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/02/espressoblend.png",
    href: "https://www.forcoffeetr.com/magaza/urun/special-espresso-blend/",
  },
  {
    title: "Filtre Kahveler",
    desc: "Meyvemsi aromaları ve temiz içimiyle filtre demlemeler için özel seçimler.",
    image: "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/02/costarica-terrazu.png",
    href: "https://www.forcoffeetr.com/magaza/kategori/filtre-kahveler/",
  },
  {
    title: "Kahve Akademisi",
    desc: "Kahve kavurma, espresso ve demleme tekniklerini profesyonelce öğrenin.",
    image:
      "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/02/ChatGPT-Image-4-Sub-2026-09_20_56.png",
    href: "/akademi",
  },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();
  const { toplamAdet, cekmeceAc, cekmeceKapat } = useCart();
  const { theme, toggleTheme } = useTheme();
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Sadece anasayfada hero üzerine şeffaf bindirme; diğer sayfalarda katı arka plan.
  const overlay = pathname === "/";
  const solid = scrolled || !overlay;

  useEffect(() => {
    let mounted = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const goToAccountRoute = (href: string) => {
    setAccountOpen(false);
    void navigate({ to: href as never });
  };

  // Transition easing for luxury feel
  const transition = "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)";

  // Scroll listener with threshold 20px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close panels on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setAccountOpen(false);
        cekmeceKapat();
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cekmeceKapat]);

  const handleMegaEnter = useCallback(() => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  }, []);

  const handleMegaLeave = useCallback(() => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 200);
  }, []);

  const navItems: Array<{ label: string; to?: string; mega?: boolean }> = [
    { label: "Anasayfa", to: "/" },
    { label: "Kahveler", mega: true },
    { label: "Mağaza", to: "/magaza" },
    { label: "Akademi", to: "/akademi" },
    { label: "Demleme", to: "/demleme" },
    { label: "İletişim", to: "/iletisim" },
  ];

  // Helper to determine text color for nav and icons based on scroll state
  const textColor = solid ? (theme === "dark" ? "#F5F2EB" : "#1A1A1A") : "#F5F2EB";
  const iconColor = textColor;
  const accentColor = "var(--accent)";

  return (
    <>
      <header
        className={`${overlay ? "fixed" : "sticky"} top-0 z-50 w-full`}
        style={{
          height: scrolled ? "72px" : "85px",
          backgroundColor: solid
            ? theme === "dark"
              ? "rgba(18,22,32,0.92)"
              : "rgba(255,255,255,0.92)"
            : "transparent",
          backdropFilter: solid ? "blur(24px)" : "none",
          borderBottom: solid
            ? `1px solid ${theme === "dark" ? "rgba(212,175,55,.15)" : "rgba(201,169,110,.20)"}`
            : "none",
          boxShadow: solid
            ? `0 12px 40px ${theme === "dark" ? "rgba(0,0,0,.28)" : "rgba(0,0,0,.08)"}`
            : "none",
          transition,
        }}
      >
        {/* Main bar */}
        <div className="container-luxury flex items-center justify-between h-full">
          {/* Left — logo + nav */}
          <div className="flex items-center gap-10">
            <Link
              to="/"
              className="flex-shrink-0 hover:opacity-80 transition-opacity duration-300"
              style={{ transition }}
            >
              <img
                src="/logo-forcoffee.png"
                alt="FOR COFFEE"
                style={{
                  height: scrolled ? "42px" : "50px",
                  transition,
                  filter: solid ? "drop-shadow(0 0 10px rgba(212,175,55,.18))" : "none",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </Link>
            <div className="hidden lg:flex items-center gap-10">
              {navItems.map((item) =>
                item.mega ? (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={handleMegaEnter}
                    onMouseLeave={handleMegaLeave}
                  >
                    <button
                      className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-300 group"
                      style={{ color: textColor }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = accentColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = textColor;
                      }}
                    >
                      {item.label}
                      <ChevronDown
                        size={11}
                        strokeWidth={2}
                        className={`transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    to={item.to ?? "/"}
                    className="relative text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-300 group"
                    style={{ color: textColor }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = accentColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = textColor;
                    }}
                  >
                    {item.label}
                    <span
                      className="absolute -bottom-1 left-1/2 w-0 h-px transition-all duration-300 group-hover:w-full"
                      style={{
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: accentColor,
                      }}
                    />
                  </Link>
                ),
              )}
            </div>
          </div>

          {/* Right — icons */}
          <div className="flex items-center gap-5">
            {/* Theme switch */}
            <button
              onClick={toggleTheme}
              className="relative w-9 h-9 flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{ color: iconColor }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = accentColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = iconColor;
              }}
            >
              <div
                className="transition-transform duration-500"
                style={{ transform: theme === "dark" ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                {theme === "dark" ? (
                  <Moon size={18} strokeWidth={1.5} />
                ) : (
                  <Sun size={18} strokeWidth={1.5} />
                )}
              </div>
            </button>

            {/* Search */}
            <button
              onClick={() => {
                setSearchOpen(true);
                setAccountOpen(false);
                cekmeceKapat();
              }}
              className="w-9 h-9 flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{ color: iconColor }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = accentColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = iconColor;
              }}
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            {/* Account */}
            <div className="relative hidden md:block">
              <button
                onClick={() => {
                  setAccountOpen(!accountOpen);
                  setSearchOpen(false);
                  cekmeceKapat();
                }}
                className="w-9 h-9 flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ color: iconColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = accentColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = iconColor;
                }}
              >
                <User size={18} strokeWidth={1.5} />
              </button>
              {accountOpen && (
                <div
                  className="absolute right-0 top-full mt-4 w-64 p-6 z-50"
                  style={{
                    borderRadius: "24px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    boxShadow: "0 24px 60px var(--shadow-strong)",
                    animation: "fadeInUp 0.3s ease-out forwards",
                  }}
                >
                  {authLoading ? (
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      Oturum kontrol ediliyor...
                    </p>
                  ) : user ? (
                    <>
                      <p
                        className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-1"
                        style={{ color: "var(--accent)" }}
                      >
                        Hoş Geldiniz
                      </p>
                      <p
                        className="font-serif text-lg mb-5"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {user.user_metadata?.["display_name"] || user.email || "FOR COFFEE üyesi"}
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-1"
                        style={{ color: "var(--accent)" }}
                      >
                        Hesabınız
                      </p>
                      <p
                        className="font-serif text-lg mb-5"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Giriş yapın
                      </p>
                    </>
                  )}
                  <div
                    className="h-px mb-4"
                    style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }}
                  />
                  <div className="space-y-1">
                    {user &&
                      [
                        { icon: Package, label: "Siparişlerim", href: "/hesabim/siparisler" },
                        { icon: Heart, label: "Favorilerim", href: "/hesabim/favoriler" },
                        { icon: MapPin, label: "Adreslerim", href: "/hesabim/adresler" },
                        { icon: Settings, label: "Hesap Ayarları", href: "/hesabim" },
                      ].map(({ icon: Icon, label, href }) => (
                        <a
                          key={label}
                          href={href}
                          onClick={(event) => {
                            event.preventDefault();
                            goToAccountRoute(href);
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200"
                          style={{ color: "var(--text-secondary)", borderRadius: "12px" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "var(--accent)";
                            e.currentTarget.style.backgroundColor = "rgba(201,169,110,0.06)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "var(--text-secondary)";
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          <Icon size={15} strokeWidth={1.5} />
                          {label}
                        </a>
                      ))}
                    <div className="h-px my-3" style={{ backgroundColor: "var(--border)" }} />
                    <a
                      href={user ? "/auth" : "/auth"}
                      onClick={(event) => {
                        event.preventDefault();
                        setAccountOpen(false);
                        if (user) void supabase.auth.signOut();
                        void navigate({ to: "/auth" });
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200"
                      style={{ color: "var(--text-secondary)", borderRadius: "12px" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#EF4444";
                        e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--text-secondary)";
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      {user ? (
                        <LogOut size={15} strokeWidth={1.5} />
                      ) : (
                        <User size={15} strokeWidth={1.5} />
                      )}
                      {user ? "Çıkış Yap" : "Giriş Yap"}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Favorites */}
            <a
              href="/hesabim/favoriler"
              aria-label="Favorilerim"
              onClick={(event) => {
                event.preventDefault();
                if (!user) return void navigate({ to: "/auth" });
                goToAccountRoute("/hesabim/favoriler");
              }}
              className="hidden md:flex w-9 h-9 items-center justify-center transition-all duration-300 hover:scale-110"
              style={{ color: iconColor }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = accentColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = iconColor;
              }}
            >
              <Heart size={18} strokeWidth={1.5} />
            </a>

            {/* Cart */}
            <button
              onClick={() => {
                cekmeceAc();
                setSearchOpen(false);
                setAccountOpen(false);
              }}
              aria-label="Sepeti aç"
              className="relative w-9 h-9 flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{ color: iconColor }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = accentColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = iconColor;
              }}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {toplamAdet > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  {toplamAdet}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden w-9 h-9 flex items-center justify-center"
              style={{ color: iconColor }}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <X size={22} strokeWidth={1.5} />
              ) : (
                <Menu size={22} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* Mega Menu Panel */}
        <div
          className={`absolute left-0 right-0 top-full transition-all duration-500 ${megaOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-4"}`}
          style={{ pointerEvents: megaOpen ? "auto" : "none" }}
          onMouseEnter={handleMegaEnter}
          onMouseLeave={handleMegaLeave}
        >
          <div className="container-luxury pb-8">
            <div
              className="p-8"
              style={{
                borderRadius: "32px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 24px 60px var(--shadow-strong)",
              }}
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {megaMenuData.map((cat) => (
                  <a
                    key={cat.title}
                    href={cat.href}
                    className="group block overflow-hidden transition-all duration-500"
                    style={{
                      borderRadius: "24px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--bg-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(201,169,110,0.35)";
                      e.currentTarget.style.boxShadow = "0 16px 48px var(--shadow-strong)";
                      e.currentTarget.style.transform = "translateY(-6px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "";
                    }}
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{ aspectRatio: "4/3", borderRadius: "24px 24px 0 0" }}
                    >
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
                        }}
                      />
                    </div>
                    <div className="p-5">
                      <h3
                        className="font-serif text-lg font-semibold mb-1.5"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {cat.title}
                      </h3>
                      <p
                        className="text-xs leading-relaxed mb-3"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {cat.desc}
                      </p>
                      <div
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest"
                        style={{ color: "var(--accent)" }}
                      >
                        İncele
                        <ArrowRight
                          size={12}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl mt-24 mx-4 p-8"
            style={{
              borderRadius: "32px",
              backgroundColor: "var(--surface)",
              boxShadow: "0 24px 60px var(--shadow-strong)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center gap-4 pb-4"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <Search size={20} style={{ color: "var(--accent)" }} strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Kahve ara..."
                autoFocus
                className="flex-1 bg-transparent outline-none text-lg font-light"
                style={{ color: "var(--text-primary)" }}
              />
              <button onClick={() => setSearchOpen(false)} style={{ color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>
            <div className="mt-6">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                Önerilen Kahveler
              </p>
              <div className="grid grid-cols-2 gap-3">
                {["Guatemala Antigua", "Kenya AA", "Costa Rica Tarrazu", "Peru Papagoya"].map(
                  (s) => (
                    <Link
                      key={s}
                      to="/magaza"
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-left transition-all duration-200"
                      style={{
                        borderRadius: "14px",
                        border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--accent)";
                        e.currentTarget.style.color = "var(--accent)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }}
                    >
                      <Search size={13} strokeWidth={1.5} />
                      {s}
                    </Link>
                  ),
                )}
              </div>
            </div>
            <div className="mt-6">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                Popüler Kategoriler
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Single Origin",
                  "Espresso Blend",
                  "Filtre Kahve",
                  "Türk Kahvesi",
                  "Ekipmanlar",
                ].map((c) => (
                  <Link
                    key={c}
                    to="/magaza"
                    onClick={() => setSearchOpen(false)}
                    className="px-4 py-2 text-xs font-medium transition-all duration-200"
                    style={{
                      borderRadius: "999px",
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.color = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }}
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sepet çekmecesi global olarak __root içinde render edilir. */}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] lg:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-full max-w-sm h-full overflow-y-auto p-8"
            style={{ backgroundColor: "var(--surface)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <img src="/logo-forcoffee.png" alt="FOR COFFEE" className="h-10 w-auto" />
              <button onClick={() => setMobileOpen(false)} style={{ color: "var(--text-primary)" }}>
                <X size={22} />
              </button>
            </div>
            <nav className="space-y-1">
              {[
                { label: "Anasayfa", to: "/" },
                { label: "Mağaza", to: "/magaza" },
                { label: "Akademi", to: "/akademi" },
                { label: "Demleme Rehberi", to: "/demleme" },
                { label: "Sosyal", to: "/sosyal" },
                { label: "İletişim", to: "/iletisim" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-left py-4 font-serif text-xl transition-colors duration-300"
                  style={{ color: "var(--text-primary)", borderBottom: "1px solid var(--border)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 space-y-3">
              <a
                href="/auth"
                onClick={(event) => {
                  event.preventDefault();
                  setMobileOpen(false);
                  if (user) goToAccountRoute("/hesabim");
                  else void navigate({ to: "/auth" });
                }}
                className="flex items-center gap-3 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                <User size={16} strokeWidth={1.5} /> Hesabım
              </a>
              <a
                href="/hesabim/favoriler"
                onClick={(event) => {
                  event.preventDefault();
                  setMobileOpen(false);
                  if (user) goToAccountRoute("/hesabim/favoriler");
                  else void navigate({ to: "/auth" });
                }}
                className="flex items-center gap-3 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                <Heart size={16} strokeWidth={1.5} /> Favoriler
              </a>
              <a
                href="https://www.forcoffeetr.com/magaza/sepet/"
                className="flex items-center gap-3 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                <ShoppingBag size={16} strokeWidth={1.5} /> Sepet
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
