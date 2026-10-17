"use client";

import { useEffect, useRef, useState } from "react";
import { ListBulletIcon } from "@heroicons/react/20/solid";

type Link = { id: string; label: string };

/**
 * A jump-to menu pinned to the bottom-left corner of a case study. It shows
 * once the first section is on screen, names the section being read, and
 * opens a list of every section to jump to.
 */
export function SectionNav({ links }: { links: Link[] }) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const l of links) {
        const el = document.getElementById(l.id);
        if (el && el.getBoundingClientRect().top < line) current = l.id;
      }
      // Shown from the first section until the footer comes up, where the
      // dark pill would sit on the dark footer.
      const first = document.getElementById(links[0]?.id ?? "");
      const end = root.current?.closest("article")?.getBoundingClientRect().bottom ?? Infinity;
      setShown(!!first && first.getBoundingClientRect().top < window.innerHeight && end > window.innerHeight - 80);
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [links]);

  // Close on Escape or a click anywhere else.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  if (links.length < 3) return null;
  const current = links.find((l) => l.id === active);

  return (
    <nav
      ref={root}
      aria-label="Sections"
      className={`fixed bottom-3 left-3 z-[85] transition-[opacity,translate] duration-300 md:bottom-4 md:left-4 ${
        shown || open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-64 rounded-2xl border border-line bg-bg p-2 shadow-2xl">
          <p className="eyebrow px-3 pt-2 pb-2">Jump to</p>
          <ul>
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  aria-current={l.id === active ? "location" : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                    l.id === active ? "bg-fg/[0.06] font-medium text-fg" : "text-fg/70 hover:bg-fg/[0.04] hover:text-fg"
                  }`}
                >
                  <span aria-hidden className={`size-1.5 shrink-0 rounded-full ${l.id === active ? "bg-accent" : "bg-fg/20"}`} />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex max-w-[calc(100vw-1.5rem)] items-center gap-2 rounded-full bg-fg py-2.5 pr-4 pl-3.5 text-sm font-medium text-bg shadow-xl transition-transform hover:scale-[1.03]"
      >
        <ListBulletIcon aria-hidden className="size-5 shrink-0" />
        Jump to
        {current && <span className="truncate font-normal text-bg/60">{current.label}</span>}
      </button>
    </nav>
  );
}
