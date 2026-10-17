"use client";

import { useEffect, useRef, useState } from "react";

type Link = { id: string; label: string };

// "The problem" reads as "Problem", to keep the row short.
const short = (label: string) => {
  const s = label.replace(/^the /i, "");
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * A row of every section, pinned to the bottom-left corner of a case study
 * from the moment it opens, so readers can jump straight to what interests
 * them. The section being read is filled in. A row, not a list, so it covers
 * a strip of the page rather than a corner of the text; on narrow screens it
 * scrolls sideways and keeps the current section in view.
 */
export function SectionNav({ links }: { links: Link[] }) {
  const [shown, setShown] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  // Which ends of the row have more sections scrolled out of view.
  const [more, setMore] = useState({ left: false, right: false });
  const root = useRef<HTMLElement>(null);
  const list = useRef<HTMLUListElement>(null);

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

  useEffect(() => {
    const ul = list.current;
    if (!ul) return;
    const measure = () =>
      setMore({ left: ul.scrollLeft > 2, right: ul.scrollLeft + ul.clientWidth < ul.scrollWidth - 2 });
    measure();
    ul.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      ul.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Keep the current section in view when the row scrolls.
  useEffect(() => {
    const ul = list.current;
    const a = ul?.querySelector<HTMLElement>("[aria-current]");
    if (!ul || !a || ul.scrollWidth <= ul.clientWidth) return;
    ul.scrollTo({ left: a.offsetLeft - (ul.clientWidth - a.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  if (links.length < 3) return null;

  return (
    <nav
      ref={root}
      aria-label="Sections"
      className={`fixed bottom-3 left-3 z-[85] max-w-[calc(100vw-1.5rem)] transition-[opacity,translate] duration-300 md:bottom-4 md:left-4 md:max-w-[calc(100vw-2rem)] ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <div className="flex items-center rounded-full border border-line bg-bg/85 p-1 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <span className="eyebrow hidden shrink-0 pr-2 pl-3 md:inline">Jump to</span>
        <ul
          ref={list}
          className="relative flex min-w-0 gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          // Fade whichever end has more to scroll to.
          style={{
            maskImage: `linear-gradient(to right, ${more.left ? "transparent" : "black"}, black 2rem, black calc(100% - 2rem), ${more.right ? "transparent" : "black"})`,
          }}
        >
          {links.map((l) => (
            <li key={l.id} className="shrink-0">
              <a
                href={`#${l.id}`}
                aria-current={l.id === active ? "location" : undefined}
                className={`block rounded-full px-3 py-1.5 text-[0.8125rem] whitespace-nowrap transition-colors ${
                  l.id === active ? "bg-fg font-medium text-bg" : "text-fg/70 hover:bg-fg/[0.06] hover:text-fg"
                }`}
              >
                {short(l.label)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
