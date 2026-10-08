import { useTheme } from "@/context/ThemeContext";

/**
 * Akademi bileşenlerinin kullandığı Türkçe API.
 * Mağaza bileşenleriyle AYNI tema durumunu paylaşır.
 */
export function useTema() {
  const { theme, setTheme, toggleTheme } = useTheme();
  return { tema: theme, degistir: toggleTheme, ayarla: setTheme };
}
