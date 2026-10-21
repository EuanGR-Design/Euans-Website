"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { person } from "@/content";
import { cardInfo, eras, projectHref, projectImage, type Project } from "@/projects";
import { ProjectLink } from "./ProjectTransition";
import { HeroLoop } from "./HeroLoop";

// How long each project holds the stage before the next clicks into place.
const HOLD = 5000;
// A quick spring that settles with a little give, rather than a slow glide.
const SNAP = { type: "spring", stiffness: 260, damping: 30, mass: 0.9 } as const;

/**
 * The home page opens on the work: one project at a time, full screen and
 * lifted towards you, with the ones either side waiting smaller and faded.
 * It steps on by itself, each project clicking into place, until you take
 * over by swiping, dragging, scrolling sideways, the arrows or the keys.
 */
export function HomeCarousel({ list }: { list: Project[] }) {
  const n = list.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [width, setWidth] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef({ x: 0, id: -1, moved: false });
  const wheel = useRef({ sum: 0, at: 0 });

  const go = useCallback((i: number) => setIndex(((i % n) + n) % n), [n]);

  useEffect(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  // Each slide's width follows the stage, so a whole slide fits its height.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const measure = () => {
      const { width: w, height: h } = el.getBoundingClientRect();
      const wide = w >= 768;
      // Room for the words above and below the picture.
      const byHeight = Math.max(0, h - (wide ? 190 : 210)) * 1.6;
      setWidth(Math.min(w * (wide ? 0.6 : 0.84), byHeight));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // On to the next one, unless someone's looking closely or has taken over.
  useEffect(() => {
    if (paused || reduced) return;
    const t = window.setTimeout(() => go(index + 1), HOLD);
    return () => window.clearTimeout(t);
  }, [index, paused, reduced, go]);

  const gap = width * 0.08;
  // Where each slide sits: -1 to the left, 0 in front, 1 to the right.
  const offsetOf = (i: number) => {
    let d = i - index;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, id: e.pointerId, moved: false };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    d.id = -1;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 50) {
      d.moved = true;
      go(index + (dx < 0 ? 1 : -1));
    }
  };
  // A sideways trackpad swipe moves one project per gesture.
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    const w = wheel.current;
    const now = performance.now();
    if (now - w.at < 450) return;
    w.sum += e.deltaX;
    if (Math.abs(w.sum) > 40) {
      go(index + (w.sum > 0 ? 1 : -1));
      w.sum = 0;
      w.at = now;
    }
  };

  const current = list[index];

  return (
    <section
      id="top"
      aria-roledescription="carousel"
      aria-label="Selected projects"
      className="relative flex h-[100svh] min-h-[38rem] flex-col pt-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setPaused(false)}
    >
      <div className="container-x flex flex-col gap-2 pt-6 md:flex-row md:items-end md:justify-between md:gap-10 md:pt-8">
        <h1 className="max-w-3xl text-xl leading-snug font-semibold tracking-[-0.02em] text-balance md:text-2xl">
          <span className="text-muted">{person.name}. </span>
          {person.statement}
        </h1>
        <p className="shrink-0 text-sm text-muted tabular-nums" aria-live="polite">
          <span className="font-medium text-fg">{String(index + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")}
          <span className="sr-only">: {current.title}</span>
        </p>
      </div>

      <div
        ref={stage}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(index + 1);
          if (e.key === "ArrowLeft") go(index - 1);
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (drag.current.id = -1)}
        onWheel={onWheel}
        // A swipe shouldn't also open the project it ends on.
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
        className="relative min-h-0 flex-1 touch-pan-y overflow-hidden select-none focus-visible:outline-none"
      >
        {width > 0 &&
          list.map((p, i) => {
            const off = offsetOf(i);
            const on = off === 0;
            const far = Math.abs(off) > 1;
            const img = projectImage(p);
            const era = eras.find((e) => e.id === p.era);
            const media = (
              <div
                data-cover
                className={`relative aspect-[16/10] overflow-hidden rounded-[1.75rem] bg-raised transition-shadow duration-500 ${
                  on ? "shadow-[0_40px_80px_-30px_rgba(42,33,28,0.55)]" : "shadow-none"
                }`}
              >
                {on && p.heroLoop ? (
                  <HeroLoop loop={p.heroLoop} width="w-[82%]" />
                ) : img?.src ? (
                  <Image src={img.src} alt="" fill draggable={false} sizes="60vw" priority={i === 0} className="object-cover object-top" />
                ) : (
                  <div className="absolute inset-0 flex items-end bg-gradient-to-br from-accent/45 via-raised to-raised p-8">
                    <span className="text-5xl font-bold tracking-[-0.04em] text-fg/80">{p.title}</span>
                  </div>
                )}
              </div>
            );
            return (
              <motion.div
                key={p.slug}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${n}: ${p.title}`}
                aria-hidden={!on}
                inert={!on}
                className="absolute top-1/2 left-1/2"
                style={{ width, marginLeft: -width / 2 }}
                initial={false}
                animate={{
                  x: off * (width + gap) * (on ? 1 : 0.92),
                  y: "-50%",
                  scale: on ? 1 : 0.8,
                  opacity: on ? 1 : far ? 0 : 0.4,
                }}
                // Slides wrapping round from one end to the other jump there unseen.
                transition={far ? { duration: 0 } : reduced ? { duration: 0.2 } : SNAP}
                onClick={() => !on && go(i)}
              >
                <div className={`mb-4 flex items-baseline justify-between gap-4 transition-opacity duration-300 ${on ? "opacity-100" : "opacity-0"}`}>
                  <h2 className="text-3xl font-bold tracking-[-0.035em] md:text-5xl">{p.title}</h2>
                  <p className="eyebrow shrink-0">{[era?.label, p.year].filter(Boolean).join(" · ")}</p>
                </div>
                {on && !p.comingSoon ? (
                  <ProjectLink card={cardInfo(p)} href={projectHref(p)} draggable={false} className="block" aria-label={`View ${p.title}`}>
                    {media}
                  </ProjectLink>
                ) : (
                  <div className={on ? "" : "cursor-pointer"}>{media}</div>
                )}
                <div className={`mt-5 flex items-start justify-between gap-6 transition-opacity duration-300 ${on ? "opacity-100" : "opacity-0"}`}>
                  <p className="max-w-xl text-base text-fg/75 md:text-lg">{p.summary}</p>
                  {!p.comingSoon && (
                    <ProjectLink
                      card={cardInfo(p)}
                      href={projectHref(p)}
                      tabIndex={on ? undefined : -1}
                      className="hidden h-11 shrink-0 items-center gap-2 rounded-full bg-fg px-5 text-sm font-medium text-bg transition-colors hover:bg-fg/85 md:inline-flex"
                    >
                      View project <ArrowRightIcon aria-hidden className="size-4" />
                    </ProjectLink>
                  )}
                </div>
              </motion.div>
            );
          })}
      </div>

      {/* Which project is up, filling while it holds the stage. */}
      <div className="container-x flex items-center gap-4 pt-2 pb-6 md:pb-8">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous project"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line transition-colors hover:border-fg/30"
        >
          <ArrowLeftIcon aria-hidden className="size-4" />
        </button>
        <ol className="flex flex-1 gap-1.5">
          {list.map((p, i) => (
            <li key={p.slug} className="flex-1">
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={p.title}
                aria-current={i === index || undefined}
                className="group block w-full py-2"
              >
                <span className="block h-1 overflow-hidden rounded-full bg-fg/10 transition-colors group-hover:bg-fg/20">
                  <span
                    key={i === index ? `${index}-${paused}` : undefined}
                    className={`block h-full rounded-full bg-accent ${i < index ? "w-full" : i === index ? "" : "w-0"}`}
                    style={
                      i === index
                        ? paused || reduced
                          ? { width: "100%" }
                          : { width: 0, animation: `carousel-fill ${HOLD}ms linear forwards` }
                        : undefined
                    }
                  />
                </span>
              </button>
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next project"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line transition-colors hover:border-fg/30"
        >
          <ArrowRightIcon aria-hidden className="size-4" />
        </button>
      </div>
    </section>
  );
}
