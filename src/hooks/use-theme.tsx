import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const KEY = "dinepro-theme";

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(KEY) as Theme | null;
    const next: Theme = stored === "dark" ? "dark" : "light";
    setTheme(next);
    apply(next);
  }, []);

  const set = useCallback((next: Theme) => {
    setTheme(next);
    apply(next);
    window.localStorage.setItem(KEY, next);
  }, []);

  const toggle = useCallback(() => set(theme === "dark" ? "light" : "dark"), [theme, set]);

  return { theme, setTheme: set, toggle };
}
