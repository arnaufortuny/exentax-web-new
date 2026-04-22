import { useEffect, type ReactNode } from "react";

const STORAGE_KEY = "exentax-theme";

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
