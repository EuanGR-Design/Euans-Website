"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

type Link = { id: string; label: string };

/**
 * Every section of a case study, so readers can jump straight to what
 * interests them. On wide screens it's a plain list in the left margin, like
 * a table of contents, with an orange dot on the section being read; the
 * page's content moves over to make room (see `.has-toc` in globals.css).
 * On narrower screens it's a slim bar under the header that names the
 * current section and opens the list.
 */
export function SectionNav({ links }: { links: Link[] }) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const bar = useRef<HTMLDivElement>(null);

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
      // Hidden once the next project comes up, where the story has ended.
      const end = document.querySelector("article")?.querySelector('nav[aria-label="Next project"]');
      setShown(!end || end.getBoundingClientRect().top > window.innerHeight * 0.5);
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

  // The narrow-screen list closes on Escape or a tap anywhere else.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!bar.current?.contains(e.target as Node)) setOpen(false);
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

  const list = (compact: boolean) => (
    <ul className={compact ? "py-2" : "space-y-0.5"}>
      {links.map((l) => {
        const on = l.id === active;
        return (
          <li key={l.id}>
            <a
              href={`#${l.id}`}
              aria-current={on ? "location" : undefined}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2.5 transition-colors ${
                compact ? "px-5 py-2.5 text-[15px]" : "py-1 text-[13px] leading-snug"
              } ${on ? "font-medium text-fg" : "text-muted hover:text-fg"}`}
            >
              <span
                aria-hidden
                className={`size-1.5 shrink-0 rounded-full transition-colors ${on ? "bg-accent" : "bg-fg/15"}`}
              />
              {l.label}
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <nav
        aria-label="Sections"
        className={`fixed top-1/2 left-6 z-40 hidden w-44 -translate-y-1/2 transition-opacity duration-300 xl:block ${
          shown ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <p className="eyebrow mb-3">Jump to</p>
        {list(false)}
      </nav>

      {/* Narrower screens: a slim bar under the header once the story starts. */}
      <div
        ref={bar}
        className={`fixed inset-x-0 top-16 z-40 transition-[opacity,translate] duration-300 xl:hidden ${
          shown && (current || open) ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <nav aria-label="Sections on this page" className="border-b border-line bg-bg/90 backdrop-blur-xl">
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="container-x flex h-11 w-full items-center gap-2 text-left text-sm"
          >
            <span className="text-muted">Jump to</span>
            <span className="truncate font-medium">{current?.label}</span>
            <ChevronDownIcon aria-hidden className={`ml-auto size-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && <div className="max-h-[60vh] overflow-y-auto border-t border-line">{list(true)}</div>}
        </nav>
      </div>
    </>
  );
}
