import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Coffee, Cog, Flame, MessageCircleQuestion, Send, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

const POPUP_DELAY = 1400;
const FOLLOW_DELAY = 5200;
const SPONTANEOUS_MESSAGES = [
  {
    title: "Hoş geldin, kahve kaşifi.",
    body: "Ben FOR COFFEE’nin kahve meraklısı tarafıyım. Ne aradığını birlikte bulalım mı?",
  },
  {
    title: "Ekranda geziniyorsun, fark ettim.",
    body: "Ben de sana eşlik ediyorum. İstersen damak tadına göre bir kahve seçelim.",
  },
  {
    title: "Bu kadar güzel kahvelerin arasında kaybolmak normal.",
    body: "Bir ipucu ver: yoğun mu, yumuşak mı, meyvemsi mi? Gerisini ben hallederim.",
  },
];

const MASKOT_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ads%C4%B1z%20tasar%C4%B1m%20%285%29-BofwA9CnL9WXHT38edstGIJnh6vyhS.png";

const MODEL_SECENEKLERI = [
  { deger: "gemini", ad: "Gemini Flash" },
  { deger: "gemini-pro", ad: "Gemini Pro" },
  { deger: "openai", ad: "OpenAI GPT-5.4" },
  { deger: "byok-pro", ad: "Gemini 2.5 Pro (kendi anahtarım)" },
  { deger: "byok-flash", ad: "Gemini 2.0 Flash (kendi anahtarım)" },
] as const;

const ONERILEN_SORULAR = [
  { metin: "Bana kahve öner", ikon: Coffee },
  { metin: "Öğütme ayarını öğren", ikon: Cog },
  { metin: "Espresso için çekirdek seç", ikon: Flame },
  { metin: "Hangi demleme yöntemi bana uygun?", ikon: MessageCircleQuestion },
  { metin: "Kahve nasıl saklanmalı?", ikon: Sparkles },
];

export function KahveAsistani() {
  const [acik, setAcik] = useState(false);
  const [balonGorunur, setBalonGorunur] = useState(false);
  const [balonMesaji, setBalonMesaji] = useState(SPONTANEOUS_MESSAGES[0]!);
  const [hosgeldinGorunur, setHosgeldinGorunur] = useState(false);
  const [asistanTakipte, setAsistanTakipte] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [takipDonduruldu, setTakipDonduruldu] = useState(false);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const [girdi, setGirdi] = useState("");
  const [model, setModel] = useState<string>("gemini");
  const kaydirRef = useRef<HTMLDivElement>(null);
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat", body: () => ({ model }) }),
    [model],
  );
  const { messages, sendMessage, regenerate, stop, clearError, status, error } = useChat({
    transport,
  });
  const sonKullaniciMesaji = [...messages].reverse().find((m) => m.role === "user");
  const sonKullaniciMetni = sonKullaniciMesaji?.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("")
    .trim();
  const yukleniyor = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (window.location.pathname !== "/") return;

    const timer = window.setTimeout(() => setHosgeldinGorunur(true), POPUP_DELAY);
    const followTimer = window.setTimeout(() => setAsistanTakipte(true), FOLLOW_DELAY);
    const onPointerMove = (event: PointerEvent) => {
      const bounds = welcomeRef.current?.getBoundingClientRect();
      const cursorInsideAssistant = bounds
        ? event.clientX >= bounds.left &&
          event.clientX <= bounds.right &&
          event.clientY >= bounds.top &&
          event.clientY <= bounds.bottom
        : false;

      setTakipDonduruldu(cursorInsideAssistant);
      if (!cursorInsideAssistant) {
        setMousePosition({ x: event.clientX, y: event.clientY });
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(followTimer);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  useEffect(() => {
    if (!hosgeldinGorunur) return;
    setBalonGorunur(false);
  }, [hosgeldinGorunur]);

  useEffect(() => {
    if (window.location.pathname !== "/") return;
    const firstMessage = window.setTimeout(() => {
      if (!acik && !hosgeldinGorunur) {
        setBalonMesaji(SPONTANEOUS_MESSAGES[1]!);
        setBalonGorunur(true);
      }
    }, 18_000);
    const secondMessage = window.setTimeout(() => {
      if (!acik && !hosgeldinGorunur) {
        setBalonMesaji(SPONTANEOUS_MESSAGES[2]!);
        setBalonGorunur(true);
      }
    }, 42_000);
    return () => {
      window.clearTimeout(firstMessage);
      window.clearTimeout(secondMessage);
    };
  }, [acik, hosgeldinGorunur]);

  useEffect(() => {
    kaydirRef.current?.scrollTo({ top: kaydirRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, yukleniyor]);

  useEffect(() => {
    stop();
    clearError();
  }, [model, stop, clearError]);

  const gonder = (metin: string) => {
    const t = metin.trim();
    if (!t || yukleniyor) return;
    void sendMessage({ text: t });
    setGirdi("");
  };

  return (
    <>
      {hosgeldinGorunur && !acik && (
        <div
          ref={welcomeRef}
          className={`assistant-welcome-stage${asistanTakipte ? " is-following" : ""}${takipDonduruldu ? " is-pointer-over" : ""}`}
          style={
            asistanTakipte
              ? ({
                  "--assistant-x": `${Math.min(Math.max(mousePosition.x + 28, 12), window.innerWidth - 320)}px`,
                  "--assistant-y": `${Math.min(Math.max(mousePosition.y - 86, 12), window.innerHeight - 220)}px`,
                } as CSSProperties)
              : undefined
          }
          role="presentation"
        >
          <div
            className="assistant-welcome-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="assistant-welcome-title"
            onClick={(event) => {
              event.stopPropagation();
              setHosgeldinGorunur(false);
              setAcik(true);
            }}
          >
            <button
              type="button"
              className="assistant-welcome-close"
              aria-label="Karşılama mesajını kapat"
              onClick={() => setHosgeldinGorunur(false)}
            >
              <X size={17} />
            </button>
            <img src={MASKOT_URL} alt="Kahve Asistanı" className="assistant-welcome-mascot" />
            <span className="assistant-welcome-label">Kahve Asistanı</span>
            <h2 id="assistant-welcome-title">Psst! 👀 Kahve bakmaya gelmişsin gibi duruyor.</h2>
            <p>İyi haber: Ben bu konuda biraz fazla heyecanlıyım. Sana yardımcı olayım mı?</p>
            <button
              type="button"
              className="assistant-welcome-action"
              onClick={() => {
                setHosgeldinGorunur(false);
                setAcik(true);
              }}
            >
              Kahve Asistanı&apos;na sor
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
      {balonGorunur && !hosgeldinGorunur && (
        <div
          aria-hidden="true"
          className="assistant-spontaneous-bubble fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4 z-[9998] w-[min(250px,calc(100vw-5rem))] origin-bottom-right animate-[assistant-in_600ms_ease-out] sm:bottom-24 sm:right-24 sm:w-64"
        >
          <div className="relative rounded-[1.25rem] border border-gold/35 bg-background/95 px-4 py-3 shadow-xl shadow-black/30 backdrop-blur-md">
            <span className="absolute -bottom-2 right-7 size-4 rotate-45 border-b border-r border-gold/35 bg-background/95 sm:-right-3 sm:bottom-6 sm:border-b-0 sm:border-l sm:border-r" />
            <p className="relative text-sm font-semibold leading-snug text-foreground">
              {balonMesaji.title}
            </p>
            <p className="relative mt-1 text-xs leading-relaxed text-gold">{balonMesaji.body}</p>
          </div>
        </div>
      )}
      <button
        aria-label="Kahve Asistanı'nı aç"
        className={`assistant-fab fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-[9999] inline-flex size-16 items-center justify-center transition-transform duration-300 hover:scale-105 ${hosgeldinGorunur ? "pointer-events-none opacity-0" : ""}`}
        onClick={() => setAcik((v) => !v)}
        aria-expanded={acik}
      >
        {acik ? (
          <X className="size-5 rounded-full bg-gold p-1 text-black" />
        ) : (
          <img
            src={MASKOT_URL}
            alt="Kahve Asistanı"
            className="size-16 object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]"
          />
        )}
      </button>

      {acik && (
        <section
          aria-label="Kahve Asistanı sohbeti"
          className="glass fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-[9999] flex h-[min(680px,78vh)] w-[min(430px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[2rem] border border-gold/25 shadow-2xl shadow-black/40"
        >
          <header className="relative flex items-center justify-between gap-3 border-b border-gold/15 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <img
                src={MASKOT_URL}
                alt=""
                aria-hidden="true"
                className="size-12 object-contain animate-[assistant-breathe_5s_ease-in-out_infinite]"
              />
              <div>
                <p className="text-sm font-semibold tracking-wide text-foreground">
                  Kahve Asistanı
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-gold">
                  <span className="size-1.5 rounded-full bg-gold" /> FOR COFFEE
                </p>
              </div>
            </div>
            <select
              aria-label="Model seç"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="max-w-[130px] rounded-full border border-border bg-transparent px-2.5 py-1.5 text-[10px] text-muted-foreground outline-none"
            >
              {MODEL_SECENEKLERI.map((m) => (
                <option key={m.deger} value={m.deger}>
                  {m.ad}
                </option>
              ))}
            </select>
          </header>

          <div ref={kaydirRef} className="flex-1 overflow-y-auto px-5 py-5">
            {messages.length === 0 && (
              <div className="flex flex-col items-center text-center">
                <img
                  src={MASKOT_URL}
                  alt="Kahve Asistanı maskotu"
                  className="mb-2 size-32 object-contain animate-[assistant-in_700ms_ease-out,assistant-breathe_5s_ease-in-out_800ms_infinite]"
                />
                <p className="text-xl font-semibold tracking-tight text-foreground">
                  Kahve mi lazım, fikir mi?
                </p>
                <p className="mt-1 text-sm text-gold">İkisini de hallederiz.</p>
                <p className="mt-3 max-w-[290px] text-xs leading-relaxed text-muted-foreground">
                  Demleme, öğütüm, çekirdek seçimi veya saklama hakkında aklına takılanı sor.
                </p>
                <div className="mt-6 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                  {ONERILEN_SORULAR.map(({ metin, ikon: Icon }) => (
                    <button
                      key={metin}
                      type="button"
                      onClick={() => gonder(metin)}
                      className="group flex items-center gap-2.5 rounded-2xl border border-border/80 bg-background/20 px-3.5 py-3 text-left text-xs leading-relaxed text-foreground transition-all hover:-translate-y-0.5 hover:border-gold/60 hover:bg-gold/5 hover:text-gold"
                    >
                      <Icon className="size-4 shrink-0 text-gold transition-transform group-hover:scale-110" />
                      {metin}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => {
              const metin = m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("")
                .trim();
              if (!metin) return null;
              return (
                <div
                  key={m.id}
                  className={`mb-4 flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role !== "user" && (
                    <img
                      src={MASKOT_URL}
                      alt=""
                      aria-hidden="true"
                      className="size-7 shrink-0 object-contain animate-[assistant-bounce_450ms_ease-out]"
                    />
                  )}
                  <div
                    className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${m.role === "user" ? "rounded-br-md bg-gold text-black" : "rounded-bl-md border border-border bg-secondary/50 text-foreground"}`}
                  >
                    {metin}
                  </div>
                </div>
              );
            })}
            {yukleniyor && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <img
                  src={MASKOT_URL}
                  alt=""
                  aria-hidden="true"
                  className="size-7 object-contain animate-pulse"
                />{" "}
                Asistan yazıyor…
              </div>
            )}
            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="mt-3 flex flex-col items-start gap-2 text-xs text-destructive"
              >
                <p>{error.message || "Asistan şu anda yanıt veremiyor."}</p>
                {sonKullaniciMetni && (
                  <button
                    type="button"
                    onClick={() => {
                      clearError();
                      void regenerate();
                    }}
                    className="rounded-full border border-destructive/40 px-3 py-1.5 text-foreground transition-colors hover:border-gold hover:text-gold"
                  >
                    Tekrar dene
                  </button>
                )}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              gonder(girdi);
            }}
            className="flex items-center gap-2 border-t border-gold/15 px-4 py-3.5"
          >
            <input
              value={girdi}
              onChange={(e) => setGirdi(e.target.value)}
              placeholder="Kahve hakkında bir şey sorun…"
              aria-label="Kahve sorusu"
              className="flex-1 bg-transparent px-2 py-2 text-xs text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              aria-label="Gönder"
              disabled={yukleniyor || !girdi.trim()}
              className="inline-flex size-9 items-center justify-center rounded-full bg-gold text-black transition-transform hover:scale-105 disabled:opacity-40"
            >
              <Send className="size-4" />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
