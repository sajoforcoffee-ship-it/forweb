import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Tema = "light" | "dark";

type TemaDegeri = {
  theme: Tema;
  setTheme: (t: Tema) => void;
  toggleTheme: () => void;
};

const TemaContext = createContext<TemaDegeri>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

export const useTheme = () => useContext(TemaContext);

const ANAHTAR = "forcoffee-tema";

function uygula(t: Tema) {
  const kok = document.documentElement;
  kok.classList.toggle("dark", t === "dark");
  kok.setAttribute("data-theme", t);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // SSR ile aynı ilk çıktı: her zaman "light" başlar, tercih hydration sonrası uygulanır.
  const [theme, setTemaState] = useState<Tema>("light");

  useEffect(() => {
    const kayitli = localStorage.getItem(ANAHTAR) as Tema | null;
    const sistem = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const secim = kayitli === "light" || kayitli === "dark" ? kayitli : sistem;
    setTemaState(secim);
    uygula(secim);
  }, []);

  const setTheme = useCallback((t: Tema) => {
    setTemaState(t);
    localStorage.setItem(ANAHTAR, t);
    uygula(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setTemaState((onceki) => {
      const yeni: Tema = onceki === "dark" ? "light" : "dark";
      localStorage.setItem(ANAHTAR, yeni);
      uygula(yeni);
      return yeni;
    });
  }, []);

  return (
    <TemaContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</TemaContext.Provider>
  );
}
