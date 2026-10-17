"use client";

import { useEffect, useState } from "react";

export const themes = [
  { id: "orange", label: "Orange", swatches: ["#ff5c34", "#d9cbb6", "#2a211c"] },
  { id: "tangerine", label: "Tangerine", swatches: ["#f28500", "#d7efff", "#351e28"] },
  { id: "cornflower", label: "Cornflower", swatches: ["#94b6ef", "#e6e279", "#924b12"] },
] as const;

type Theme = (typeof themes)[number]["id"];

/**
 * Runs before first paint (see layout.tsx) so the page never flashes the
 * wrong theme: a ?theme= link wins, then the visitor's last pick.
 */
export const themeScript = `(function(){try{var t=new URLSearchParams(location.search).get("theme")||localStorage.getItem("theme");if(${JSON.stringify(
  themes.map((t) => t.id),
)}.indexOf(t)>-1){document.documentElement.dataset.theme=t;localStorage.setItem("theme",t)}}catch(e){}})()`;

/** A small panel for trying the colour themes side by side. */
export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("orange");

  useEffect(() => {
    const t = document.documentElement.dataset.theme as Theme | undefined;
    if (t) setTheme(t);
  }, []);

  const pick = (t: Theme) => {
    setTheme(t);
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem("theme", t);
    } catch {}
  };

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className="fixed right-3 bottom-3 z-[90] flex items-center gap-1 rounded-full border border-line bg-raised/90 p-1 text-xs backdrop-blur-md md:right-4 md:bottom-4"
    >
      <span className="eyebrow hidden px-2 !text-[10px] sm:inline">Theme</span>
      {themes.map((t) => (
        <button
          key={t.id}
          type="button"
          aria-pressed={theme === t.id}
          onClick={() => pick(t.id)}
          className={`flex items-center gap-2 rounded-full px-2.5 py-1.5 transition-colors ${
            theme === t.id ? "bg-fg text-bg" : "text-muted hover:text-fg"
          }`}
        >
          <span aria-hidden className="flex -space-x-1">
            {t.swatches.map((c) => (
              <span key={c} className="size-3 rounded-full ring-1 ring-black/10" style={{ background: c }} />
            ))}
          </span>
          <span className="hidden sm:inline">{t.label}</span>
          <span className="sr-only sm:hidden">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
