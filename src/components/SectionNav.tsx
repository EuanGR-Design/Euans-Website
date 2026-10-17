"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, ListBulletIcon } from "@heroicons/react/20/solid";

type Link = { id: string; label: string };

/**
 * Every section of a case study, listed in the bottom-left corner from the
 * moment it opens, so readers can jump straight to what interests them. The
 * section being read gets an orange dot. On wide screens the list stays
 * open until the reader folds it away; on narrower ones, where it would sit
 * over the text, it's a button that names the current section.
 */
export function SectionNav({ links }: { links: Link[] }) {
  const [open, setOpen] = useState(false);
  // On wide screens the list starts open; readers can fold it away.
  const [folded, setFolded] = useState(false);
  const [shown, setShown] = useState(true);
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
      // Hidden once the footer comes up, where it would sit on the dark footer.
      const end = root.current?.closest("article")?.getBoundingClientRect().bottom ?? Infinity;
      setShown(end > window.innerHeight - 80);
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

  // The folded list closes on Escape or a click anywhere else.
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
      <div
        className={`mb-2 w-56 rounded-2xl border border-line bg-bg/90 p-2 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.3)] backdrop-blur-xl ${
          open ? "block" : "hidden"
        } ${folded ? "" : "xl:mb-0 xl:block"}`}
      >
        <div className="flex items-center justify-between pr-1">
          <p className="eyebrow px-3 pt-2 pb-2">Jump to</p>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setFolded(true);
            }}
            aria-label="Hide the sections"
            className="flex size-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-fg/[0.06] hover:text-fg"
          >
            <ChevronDownIcon aria-hidden className="size-4" />
          </button>
        </div>
        <ul>
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                aria-current={l.id === active ? "location" : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-1.5 text-sm transition-colors ${
                  l.id === active ? "bg-fg/[0.06] font-medium text-fg" : "text-fg/70 hover:bg-fg/[0.04] hover:text-fg"
                }`}
              >
                <span
                  aria-hidden
                  className={`size-1.5 shrink-0 rounded-full transition-colors ${l.id === active ? "bg-accent" : "bg-fg/20"}`}
                />
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          // Back open as a list on wide screens; a pop-up list on narrow ones.
          if (folded && window.matchMedia("(min-width: 1280px)").matches) setFolded(false);
          else setOpen((o) => !o);
        }}
        className={`flex max-w-[calc(100vw-1.5rem)] items-center gap-2 rounded-full bg-fg py-2.5 pr-4 pl-3.5 text-sm font-medium text-bg shadow-xl transition-transform hover:scale-[1.03] ${
          folded ? "" : "xl:hidden"
        }`}
      >
        <ListBulletIcon aria-hidden className="size-5 shrink-0" />
        Jump to
        {current && <span className="truncate font-normal text-bg/60">{current.label}</span>}
      </button>
    </nav>
  );
}
