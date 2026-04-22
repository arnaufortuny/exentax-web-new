import { useEffect, type ReactNode } from "react";

const STORAGE_KEY = "exentax-theme";

/**
 * ThemeProvider — safety net para garantizar tema claro/crema siempre.
 *
 * El proyecto tiene un único tema (fondo crema `--bg-0 = #F8F7F4`).
 * No hay toggle light/dark ni soporte para `prefers-color-scheme: dark`.
 * Este componente elimina la clase `dark` del <html> al mount por si
 * alguna extensión del navegador, un script legacy de tercero o una
 * política CSP-permissive la inyectan. Cost: 1 `classList.remove` por
 * mount, imperceptible.
 *
 * Si en el futuro se introduce dark mode real, habilitar
 * `darkMode: 'class'` en `tailwind.config.ts` y remover este override.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      const root = document.documentElement;
      root.classList.remove("dark");
      localStorage.setItem(STORAGE_KEY, "light");
    } catch {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  return <>{children}</>;
}
