"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cardInfo, eras, projectHref, projectImage, type Project } from "@/projects";
import { ProjectLink } from "./ProjectTransition";

/**
 * Projects as large slides in a row that bleeds off both edges. Scroll,
 * swipe, drag with the mouse, or use the arrows; the slide nearest the
 * middle is the current one and the others recede.
 */
export function ProjectCarousel({ list }: { list: Project[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ x: 0, left: 0, moved: false, id: -1 });

  const slides = () => Array.from(track.current?.querySelectorAll<HTMLElement>("[data-slide]") ?? []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      slides().forEach((s, i) => {
        const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid);
        const bd = Math.abs(slides()[best].offsetLeft + slides()[best].offsetWidth / 2 - mid);
        if (d < bd) best = i;
      });
      setActive(best);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [list]);

  const go = (i: number) => {
    const el = track.current;
    const s = slides()[Math.max(0, Math.min(list.length - 1, i))];
    if (!el || !s) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: s.offsetLeft + s.offsetWidth / 2 - el.clientWidth / 2, behavior: reduce ? "auto" : "smooth" });
  };

  // Mouse dragging; touch and trackpads scroll natively.
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !track.current) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false, id: e.pointerId };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = track.current;
    if (d.id !== e.pointerId || !el) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      setDragging(true);
      el.setPointerCapture(e.pointerId);
    }
    if (d.moved) el.scrollLeft = d.left - dx;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    d.id = -1;
    if (d.moved) {
      setDragging(false);
      go(active);
    }
  };

  return (
    <div className="relative left-1/2 mt-14 w-screen -translate-x-1/2">
      <div
        ref={track}
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            go(active + 1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(active - 1);
          }
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        // A drag shouldn't also open the slide it ended on.
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
        className={`flex gap-4 overflow-x-auto px-[11vw] pb-4 [scrollbar-width:none] md:gap-8 md:px-[22vw] lg:px-[27vw] [&::-webkit-scrollbar]:hidden ${
          dragging ? "select-none" : "snap-x snap-mandatory"
        }`}
      >
        {list.map((p, i) => {
          const img = projectImage(p);
          const era = eras.find((e) => e.id === p.era);
          const on = i === active;
          const body = (
            <>
              <div
                data-cover
                className="relative aspect-[16/11] overflow-hidden rounded-3xl bg-raised"
              >
                {img?.src ? (
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    draggable={false}
                    sizes="(min-width: 1024px) 46vw, (min-width: 768px) 56vw, 78vw"
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-end bg-gradient-to-br from-accent/45 via-raised to-raised p-6 md:p-10">
                    <span className="text-4xl leading-none font-bold tracking-[-0.04em] text-fg/80 md:text-7xl">{p.title}</span>
                  </div>
                )}
              </div>
              <div className="mt-5 flex items-start justify-between gap-6">
                <div>
                  <p className="eyebrow !text-[11px]">
                    {String(i + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")} ·{" "}
                    {[era?.label, p.year].filter(Boolean).join(" · ")}
                  </p>
                  <h3 className="mt-1.5 text-2xl font-bold tracking-[-0.03em] md:text-4xl">{p.title}</h3>
                  <p className="mt-1 max-w-xl text-sm text-muted md:text-base">{p.summary}</p>
                </div>
                <span className="mt-6 hidden shrink-0 rounded-full border border-line px-4 py-2 text-sm font-semibold md:inline-flex">
                  {p.comingSoon ? "Coming soon" : "View project →"}
                </span>
              </div>
            </>
          );
          return (
            <div
              key={p.slug}
              data-slide
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${list.length}: ${p.title}`}
              className={`w-[78vw] shrink-0 snap-center transition-[opacity,transform] duration-500 md:w-[56vw] lg:w-[46vw] ${
                on ? "opacity-100" : "scale-[0.94] opacity-45"
              }`}
            >
              {p.comingSoon ? (
                body
              ) : (
                <ProjectLink
                  card={cardInfo(p)}
                  href={projectHref(p)}
                  draggable={false}
                  className="block"
                  // A slide off to the side comes to the middle first.
                  onClick={(e) => {
                    if (!on) {
                      e.preventDefault();
                      go(i);
                    }
                  }}
                >
                  {body}
                </ProjectLink>
              )}
            </div>
          );
        })}
      </div>

      <div className="container-x mt-8 flex items-center gap-6">
        <span className="font-mono text-sm tabular-nums">
          {String(active + 1).padStart(2, "0")}
          <span className="text-muted"> / {String(list.length).padStart(2, "0")}</span>
        </span>
        <div aria-hidden className="h-px flex-1 bg-line">
          <div className="h-px bg-fg transition-[width] duration-200" style={{ width: `${Math.max(progress, 0.02) * 100}%` }} />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(active - 1)}
            disabled={active === 0}
            aria-label="Previous project"
            className="flex size-11 items-center justify-center rounded-full border border-line transition-colors hover:bg-fg hover:text-bg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-fg"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            disabled={active === list.length - 1}
            aria-label="Next project"
            className="flex size-11 items-center justify-center rounded-full border border-line transition-colors hover:bg-fg hover:text-bg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-fg"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
