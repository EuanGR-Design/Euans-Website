"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  PauseIcon,
  PlayIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import type { Img } from "@/projects";

// A comment pin on the screen, at x and y percent of the frame.
export type Pin = { x: number; y: number; note: string };
// Clickable prototypes of a version, offered in a card while it's showing.
// A link starting with # scrolls to that part of the page instead.
export type Prototype = { title?: string; body: string; links: { label: string; url: string }[] };
export type Iteration = {
  image: Img;
  stage?: string;
  change?: string;
  feedback?: string;
  pins?: Pin[];
  prototype?: Prototype;
};

// Shown in place of details that haven't been written yet.
const prompts = {
  stage: "Add the stage",
  change: "What changed in this version.",
  feedback: "The feedback that led to it.",
};

/**
 * Screens stacked in one frame, with a scrubber that steps through them.
 *
 * On wide screens it's a split: the screen takes the right of the page and
 * stays put while you read, and everything that's words (the version, what
 * changed, the feedback and the numbered notes for the pins) sits on the
 * left. Nothing opens over the screen. Below that it stacks: the screen,
 * the scrubber, then the words.
 *
 * It moves with the arrows, the arrow keys, the scrubber bar, or a sideways
 * swipe (a trackpad's sideways scroll, or a finger on a phone). Ordinary
 * up-and-down scrolling always just scrolls the page.
 */
const SCRUBBER_ID = "iterations";
// Autoplay: time on each version, and the pause after someone takes over.
const STEP = 3500;
const IDLE = 10000;
const SHOW_EVENT = "iterations:show";
// Half the scrubber handle's width: the bar's ends sit this far in.
const THUMB = 12;

/** Scrolls to the iterations scrubber and shows `version`, counted from 1. */
export function showIteration(version: number) {
  window.dispatchEvent(new CustomEvent(SHOW_EVENT, { detail: version - 1 }));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(SCRUBBER_ID)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
}

export function IterationScrubber({ items }: { items: Iteration[] }) {
  const last = items.length - 1;
  const [index, setIndex] = useState(0);
  // The screen being left stays fully visible underneath while the next one
  // fades in over it, so the change never dips to the dark background.
  const [prev, setPrev] = useState(0);
  // Only load screens that have been shown, plus their neighbours.
  const [seen, setSeen] = useState(() => new Set([0, 1]));
  // The version under the pointer on the bar, named beside it.
  const [hoverAt, setHoverAt] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [focused, setFocused] = useState(false);
  // Whether a mouse is over any part of the scrubber, which holds autoplay.
  const [over, setOver] = useState(false);
  // The pin and its note that are lit up together, if any.
  const [activePin, setActivePin] = useState<number | null>(null);
  // A pin that's been tapped or clicked. Below the split its note shows just
  // under the screen, since the list of notes is further down the page.
  const [pickedPin, setPickedPin] = useState<number | null>(null);
  // Full-screen view, shown as a modal over a faded page.
  const [full, setFull] = useState(false);
  const [inlineHeight, setInlineHeight] = useState<number>();
  const rootRef = useRef<HTMLDivElement>(null);
  const inlineRef = useRef<HTMLDivElement>(null);
  const openButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  // Versions whose "Try the prototype" card has been dismissed.
  const [closedPrompts, setClosedPrompts] = useState<Set<number>>(() => new Set());

  // Autoplay: steps through the versions on its own while the scrubber is in
  // view. It holds while the mouse is over it, a note is lit or the bar is in
  // use, goes quiet for IDLE after any click, key press or swipe, then
  // carries on. The play button turns it off for good, and reduced motion
  // leaves it off to begin with.
  const [auto, setAuto] = useState(false);
  const [inView, setInView] = useState(false);
  const quietUntil = useRef(0);
  // Bumped to restart the autoplay timer.
  const [tick, setTick] = useState(0);
  const [counting, setCounting] = useState(false);
  const hush = (ms: number) => {
    const until = Date.now() + ms;
    if (until - quietUntil.current < 1000) return;
    quietUntil.current = until;
    setTick((n) => n + 1);
  };

  useEffect(() => {
    setAuto(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = inlineRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const stop = () => setDragging(false);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, [dragging]);

  // Escape closes full screen.
  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeFull();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (!full) return;
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = "hidden";
    closeButton.current?.focus();
    return () => {
      root.style.overflow = before;
    };
  }, [full]);

  // Other parts of the page can ask for a version, through showIteration.
  useEffect(() => {
    const onShow = (e: Event) => go((e as CustomEvent<number>).detail);
    window.addEventListener(SHOW_EVENT, onShow);
    return () => window.removeEventListener(SHOW_EVENT, onShow);
  });

  const openFull = () => {
    // Hold the page's place so nothing jumps while the scrubber is in the modal.
    setInlineHeight(inlineRef.current?.offsetHeight);
    setFull(true);
  };
  const closeFull = () => {
    setFull(false);
    setInlineHeight(undefined);
    requestAnimationFrame(() => openButton.current?.focus());
  };

  const go = (i: number) => {
    const next = Math.max(0, Math.min(last, i));
    if (next === index) return;
    setPrev(index);
    setIndex(next);
    setActivePin(null);
    setPickedPin(null);
    setSeen((s) => (s.has(next - 1) && s.has(next) && s.has(next + 1) ? s : new Set([...s, next - 1, next, next + 1])));
  };
  // For the wheel listener, which is added once and outlives renders.
  const stepRef = useRef((by: number) => go(index + by));
  stepRef.current = (by: number) => {
    hush(IDLE);
    go(index + by);
  };

  // A sideways swipe on a trackpad moves one version per swipe. Only scrolls
  // that are mostly sideways count, so the page always scrolls up and down.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let sum = 0;
    let lockedAt = 0;
    let lastAt = 0;
    let lastSize = 0;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || e.ctrlKey) return;
      // Keeps the browser from treating it as back or forward.
      e.preventDefault();
      const now = performance.now();
      const size = Math.abs(e.deltaX);
      // A swipe's momentum keeps sending smaller and smaller scrolls. A pause,
      // or a scroll that suddenly grows, is a new swipe.
      const fresh = now - lastAt > 180 || (now - lockedAt > 150 && size > lastSize * 1.6 + 4);
      lastAt = now;
      lastSize = size;
      if (lockedAt && !fresh) return;
      lockedAt = 0;
      sum += e.deltaX;
      if (Math.abs(sum) < 40) return;
      stepRef.current(sum > 0 ? 1 : -1);
      sum = 0;
      lockedAt = now;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [full]);

  // A finger swipe across the screen, on phones and tablets. The screen only
  // lets the browser pan up and down, so sideways moves come here.
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const swipeHandlers = {
    onPointerDown: (e: React.PointerEvent) => {
      swipe.current = e.pointerType === "mouse" ? null : { x: e.clientX, y: e.clientY };
    },
    onPointerUp: (e: React.PointerEvent) => {
      const s = swipe.current;
      swipe.current = null;
      if (!s) return;
      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) stepRef.current(dx < 0 ? 1 : -1);
    },
    onPointerCancel: () => {
      swipe.current = null;
    },
  };

  const running = auto && (inView || full) && !(over || dragging || focused || activePin !== null);
  // The final design stays up a little longer before it starts over.
  const step = index === last ? STEP * 2 : STEP;
  useEffect(() => {
    if (!running) {
      setCounting(false);
      return;
    }
    const rest = quietUntil.current - Date.now();
    if (rest > 0) {
      setCounting(false);
      const t = setTimeout(() => setTick((n) => n + 1), rest);
      return () => clearTimeout(t);
    }
    setCounting(true);
    const t = setTimeout(() => {
      if (index === last) {
        setPrev(index);
        setIndex(0);
        setActivePin(null);
        setPickedPin(null);
      } else go(index + 1);
    }, step);
    return () => clearTimeout(t);
    // `go` is rebuilt every render; the timer only restarts when these change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, index, tick]);

  const item = items[index];
  // Stage names that would run into each other on a short bar are hidden,
  // keeping the one for the version showing.
  const stageRow = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const row = stageRow.current;
    if (!row) return;
    const fit = () => {
      const labels = Array.from(row.children) as HTMLElement[];
      labels.forEach((l) => (l.style.visibility = ""));
      let prev: HTMLElement | null = null;
      for (const l of labels) {
        if (prev && l.getBoundingClientRect().left < prev.getBoundingClientRect().right + 8) {
          const drop: HTMLElement = prev.dataset.on ? l : prev;
          drop.style.visibility = "hidden";
          if (drop === l) continue;
        }
        prev = l;
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(row);
    return () => ro.disconnect();
  });

  const p = last > 0 ? index / last : 0;
  const version = `Version ${index + 1} of ${items.length}`;
  const label = index === last ? `${version} · Final design` : version;
  const ratio = items[0].image.w / items[0].image.h;
  const prototype = item.prototype && !closedPrompts.has(index) ? item.prototype : null;
  const pins = item.pins ?? [];
  // Where each stage starts, marked on the bar.
  const stageStarts = items.flatMap((it, i) => (i > 0 && it.stage && it.stage !== items[i - 1].stage ? [i] : []));
  // Each stage's run of versions, named under the bar so the marks explain themselves.
  const stages = [0, ...stageStarts].flatMap((start, n, all) => {
    const end = (all[n + 1] ?? items.length) - 1;
    const name = items[start].stage;
    return name ? [{ name, start, end }] : [];
  });


  const roundButton =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-bg transition-colors hover:border-accent disabled:opacity-30 disabled:hover:border-line";

  const arrow = (by: -1 | 1) => (
    <button
      type="button"
      onClick={() => go(index + by)}
      disabled={by < 0 ? index === 0 : index === last}
      aria-label={by < 0 ? "Earlier version" : "Later version"}
      title={by < 0 ? "Earlier version" : "Later version"}
      className={roundButton}
    >
      {by < 0 ? <ArrowLeftIcon aria-hidden className="size-4" /> : <ArrowRightIcon aria-hidden className="size-4" />}
    </button>
  );

  const playButton = (
    <button
      type="button"
      onClick={() => {
        setAuto(!auto);
        quietUntil.current = 0;
        setTick((n) => n + 1);
      }}
      aria-pressed={auto}
      aria-label={auto ? "Stop playing through versions" : "Play through versions"}
      title={auto ? "Stop autoplay" : "Autoplay"}
      className={`${roundButton} relative`}
    >
      {auto ? <PauseIcon aria-hidden className="size-4" /> : <PlayIcon aria-hidden className="ml-0.5 size-4" />}
      {/* A ring that fills while it waits to move on. */}
      {counting && (
        <svg key={`${index}-${tick}`} viewBox="0 0 40 40" className="absolute -inset-px -rotate-90" aria-hidden>
          <circle
            cx="20"
            cy="20"
            r="19"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            pathLength={1}
            strokeDasharray="1"
            className="autoplay-ring"
            style={{ animationDuration: `${step}ms` }}
          />
        </svg>
      )}
    </button>
  );

  const fullButton = full ? (
    <button
      ref={closeButton}
      type="button"
      onClick={closeFull}
      aria-label="Close full screen"
      title="Close full screen"
      className={roundButton}
    >
      <ArrowsPointingInIcon aria-hidden className="size-4" />
    </button>
  ) : (
    <button ref={openButton} type="button" onClick={openFull} aria-label="Full screen" title="Full screen" className={roundButton}>
      <ArrowsPointingOutIcon aria-hidden className="size-4" />
    </button>
  );

  // The version a point on the bar stands for.
  const versionAt = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const f = (e.clientX - r.left - THUMB) / (r.width - THUMB * 2);
    return Math.max(0, Math.min(last, Math.round(f * last)));
  };
  // Named under the bar: the version being dragged to or pointed at, or the
  // one showing while the bar has keyboard focus.
  const named = dragging ? index : (hoverAt ?? (focused ? index : null));

  const bar = (
    <div className="relative min-w-0 flex-1">
      <input
        type="range"
        min={0}
        max={last}
        step={1}
        value={index}
        onChange={(e) => go(Number(e.target.value))}
        onPointerDown={() => setDragging(true)}
        onPointerMove={(e) => e.pointerType === "mouse" && setHoverAt(versionAt(e))}
        onPointerLeave={() => setHoverAt(null)}
        onFocus={(e) => setFocused(e.currentTarget.matches(":focus-visible"))}
        onBlur={() => setFocused(false)}
        aria-label="Quick Send iterations"
        aria-valuetext={label}
        className="scrubber block w-full"
        style={{ "--p": `${p * 100}%` } as React.CSSProperties}
      />
      {/* One dot per version, and a taller mark where each stage begins, named below. */}
      <div className="pointer-events-none absolute top-1/2" style={{ left: THUMB, right: THUMB }} aria-hidden>
        {items.map((_, i) => {
          if (i === index) return null;
          const starts = stageStarts.includes(i);
          return (
            <span
              key={i}
              className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                starts ? "h-3 w-0.5" : "hidden h-1 w-1 sm:block"
              } ${i < index ? "bg-white/80" : starts ? "bg-fg/35" : "bg-fg/25"}`}
              style={{ left: `${(i / last) * 100}%` }}
            />
          );
        })}
      </div>
      {/* The stages, or the version under the pointer, named below the bar so nothing covers the screen. */}
      <div ref={stageRow} className="pointer-events-none absolute inset-x-0 top-full hidden h-5 md:block" aria-hidden>
        {named === null &&
          stages.map((st, n) => {
            const at = (st.start + st.end) / 2 / Math.max(1, last);
            // The first and last names sit inside the bar's ends.
            const shift = n === 0 ? 0 : n === stages.length - 1 ? 100 : 50;
            const on = index >= st.start && index <= st.end;
            return (
              <p
                key={st.name}
                data-on={on || undefined}
                className={`absolute top-0.5 text-xs whitespace-nowrap transition-colors ${on ? "font-medium text-fg" : "text-muted"}`}
                style={{
                  left: n === 0 ? THUMB : n === stages.length - 1 ? `calc(100% - ${THUMB}px)` : `calc(${THUMB}px + ${at} * (100% - ${THUMB * 2}px))`,
                  transform: `translateX(-${shift}%)`,
                }}
              >
                {st.start === last ? "Final" : st.name}
              </p>
            );
          })}
        {named !== null && (
          <p
            className="absolute top-0.5 text-xs whitespace-nowrap"
            style={{
              left: `calc(${THUMB}px + ${named / Math.max(1, last)} * (100% - ${THUMB * 2}px))`,
              transform: `translateX(-${(named / Math.max(1, last)) * 100}%)`,
            }}
          >
            <span className="font-medium tabular-nums">{named === last ? "Final" : `v${named + 1}`}</span>
            {items[named].stage && named !== last && <span className="text-muted"> · {items[named].stage}</span>}
          </p>
        )}
      </div>
    </div>
  );

  const prototypeCard = prototype && (
    <div key={index} className="prompt-in rounded-2xl border border-line bg-raised p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="eyebrow">{index === last ? "The final design" : `Version ${index + 1}`}</p>
        <button
          type="button"
          onClick={() => setClosedPrompts((s) => new Set([...s, index]))}
          aria-label="Dismiss"
          className="-mt-1 -mr-1 rounded-full p-1 text-muted hover:text-fg"
        >
          <XMarkIcon aria-hidden className="size-4" />
        </button>
      </div>
      <p className="mt-2 text-lg font-semibold">{prototype.title ?? "Try the prototype"}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{prototype.body}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {prototype.links.map((link, i) => (
          <a
            key={link.url}
            href={link.url}
            {...(link.url.startsWith("#")
              ? {
                  onClick: (e: React.MouseEvent) => {
                    e.preventDefault();
                    if (full) closeFull();
                    requestAnimationFrame(() => document.querySelector(link.url)?.scrollIntoView({ behavior: "smooth" }));
                  },
                }
              : { target: "_blank", rel: "noreferrer" })}
            className={`inline-flex rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              i === 0 ? "bg-accent text-on-accent hover:opacity-90" : "border border-line hover:border-accent"
            }`}
          >
            {link.label} {link.url.startsWith("#") ? "↓" : "↗"}
          </a>
        ))}
      </div>
    </div>
  );

  // Everything that's words: the version, what changed, the feedback, and a
  // note for each pin, numbered to match.
  const words = (
    <motion.div
      key={index}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div>
        <p className="flex items-baseline gap-2 tabular-nums">
          <span className="text-4xl font-bold tracking-tight lg:text-5xl">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-muted">/ {items.length}</span>
        </p>
        <p className={`mt-1.5 text-sm font-medium ${item.stage ? "text-accent-ink" : "text-muted italic"}`}>
          {index === last ? "The final design" : (item.stage ?? prompts.stage)}
        </p>
      </div>

      <dl className="space-y-4 leading-relaxed">
        <div>
          <dt className="eyebrow">What changed</dt>
          <dd className={`mt-1.5 ${item.change ? "" : "text-muted italic"}`}>{item.change ?? prompts.change}</dd>
        </div>
        <div>
          <dt className="eyebrow">The feedback</dt>
          <dd className={`mt-1.5 text-fg/80 ${item.feedback ? "" : "text-muted italic"}`}>{item.feedback ?? prompts.feedback}</dd>
        </div>
      </dl>

      {pins.length > 0 && (
        <div>
          <p className="eyebrow">On the screen</p>
          <ol className="mt-2 -mx-2.5 space-y-0.5">
            {pins.map((pin, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setActivePin(activePin === i ? null : i)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActivePin(i)}
                  onPointerLeave={(e) => e.pointerType === "mouse" && setActivePin(null)}
                  aria-pressed={activePin === i}
                  className={`flex w-full gap-3 rounded-2xl px-2.5 py-2 text-left text-sm leading-relaxed transition-colors ${
                    activePin === i ? "bg-accent-soft" : ""
                  }`}
                >
                  <span
                    aria-hidden
                    className={`mt-px flex size-6 shrink-0 items-center justify-center rounded-full rounded-bl-none bg-accent text-xs font-semibold text-on-accent transition-shadow ${
                      activePin === i ? "ring-4 ring-accent/30" : ""
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span>{pin.note}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </motion.div>
  );

  // The screen, with its numbered pins.
  const screen = (
    <div
      className="relative isolate touch-pan-y overflow-hidden rounded-2xl border border-line bg-raised select-none md:rounded-3xl"
      style={{ aspectRatio: `${ratio}` }}
      {...swipeHandlers}
    >
      {items.map((it, i) =>
        seen.has(i) && it.image.src ? (
          <Image
            key={i}
            src={it.image.src}
            alt={i === index ? it.image.alt : ""}
            aria-hidden={i !== index}
            fill
            draggable={false}
            sizes={full ? "(min-width: 1024px) 80vw, 100vw" : "(min-width: 1024px) 65vw, 100vw"}
            priority={i === 0}
            className={`object-cover object-top ${
              i === index ? "z-10 opacity-100 transition-opacity duration-300" : i === prev ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : null,
      )}

      {/* A version whose screen hasn't been added yet. */}
      {!item.image.src && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-raised bg-[radial-gradient(var(--line)_1px,transparent_1px)] [background-size:16px_16px]">
          <span className="eyebrow rounded-full border border-line bg-bg px-3 py-1.5">Screen coming soon</span>
        </div>
      )}

      {/* Numbered pins, like Figma's comments, marking where this version changed. Their notes are beside the screen. */}
      <div key={index} className="pin-layer absolute inset-0 z-20">
        {pins.map((pin, i) => {
          const lit = activePin === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                setActivePin(i);
                setPickedPin(i);
              }}
              onPointerEnter={(e) => e.pointerType === "mouse" && setActivePin(i)}
              onPointerLeave={(e) => e.pointerType === "mouse" && setActivePin(null)}
              onFocus={() => setActivePin(i)}
              onBlur={() => {
                setActivePin(null);
                setPickedPin(null);
              }}
              aria-label={`Change ${i + 1}: ${pin.note}`}
              className={`pin-bubble absolute flex h-7 w-7 -translate-y-full items-center justify-center rounded-full rounded-bl-none border-2 border-white text-xs font-semibold text-on-accent shadow-lg transition-[transform,opacity,box-shadow] md:h-8 md:w-8 md:text-sm bg-accent ${
                lit ? "z-10 scale-115 ring-4 ring-accent/40" : activePin !== null ? "opacity-50" : ""
              }`}
              // Kept far enough in that a pin by the edge isn't cut off.
              style={{ left: `min(${pin.x}%, 100% - 2.5rem)`, top: `max(${pin.y}%, 2.5rem)`, transformOrigin: "bottom left" }}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );

  const controls = (
    <div className="flex items-center gap-2 sm:gap-3">
      {playButton}
      {arrow(-1)}
      {bar}
      {arrow(1)}
      {fullButton}
    </div>
  );

  const scrubber = (
    <div
      ref={rootRef}
      className={`overscroll-x-contain lg:grid lg:items-start ${
        full
          ? "lg:grid-cols-[minmax(16rem,1fr)_auto] lg:gap-10"
          : // On the left, the words line up with the rest of the page, clear of the section list in the margin.
            "lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:pl-4 xl:gap-14 xl:pl-[calc((100%-1280px)/2+40px)] xl:[.has-toc_&]:pl-[max(200px,calc((100%-1280px)/2+40px))]"
      }`}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOver(true)}
      onPointerLeave={() => setOver(false)}
      onPointerDownCapture={() => hush(IDLE)}
      onKeyDownCapture={() => hush(IDLE)}
      onKeyDown={(e) => {
        // The arrow keys step through versions from any button here too; the bar handles its own.
        if ((e.key !== "ArrowLeft" && e.key !== "ArrowRight") || (e.target as HTMLElement).tagName !== "BUTTON") return;
        e.preventDefault();
        go(index + (e.key === "ArrowLeft" ? -1 : 1));
      }}
    >
      {/* The screen and the scrubber. On wide screens they hold still while you read beside them. */}
      <div
        className={`lg:col-start-2 lg:row-start-1 ${full ? "" : "lg:sticky lg:top-[124px] xl:top-[88px]"}`}
      >
        <div
          className="mx-auto max-w-full lg:mx-0"
          // Full screen, it's as tall as fits with the controls under it, leaving the rest of the width to the words.
          style={{ width: full ? `min(calc((100dvh - 10.5rem) * ${ratio}), calc(100vw - 24rem))` : `calc((100dvh - 12rem) * ${ratio})` }}
        >
          {screen}
          {pickedPin !== null && pins[pickedPin] && (
            <p role="note" className="mt-3 flex gap-3 rounded-2xl bg-accent-soft px-3 py-2.5 text-sm leading-relaxed lg:hidden">
              <span
                aria-hidden
                className="mt-px flex size-6 shrink-0 items-center justify-center rounded-full rounded-bl-none bg-accent text-xs font-semibold text-on-accent"
              >
                {pickedPin + 1}
              </span>
              <span>{pins[pickedPin].note}</span>
            </p>
          )}
          <div className="mt-4 md:mb-5">{controls}</div>
        </div>
      </div>

      {/* Full screen, the words scroll on their own if they're long, under the prototype card held at the bottom,
          with room either side for the step notes' highlight. */}
      <div className={`mt-6 lg:col-start-1 lg:row-start-1 lg:mt-0 ${full ? "lg:flex lg:max-h-[calc(100dvh-5rem-2px)] lg:flex-col" : ""}`}>
        <div
          className={`rounded-3xl border border-line bg-raised p-5 sm:p-6 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:pt-1 ${
            full ? "lg:-mx-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:px-3 lg:pb-6" : ""
          }`}
        >
          {words}
        </div>
        {prototypeCard && (
          // On the page it sticks to the bottom of the screen, so the words scroll up under it.
          <div
            className={`mt-4 ${
              full
                ? "relative lg:mt-0 lg:shrink-0 lg:shadow-[0_-18px_24px_-12px_var(--bg)]"
                : "lg:sticky lg:bottom-4 lg:z-10 lg:mt-8 lg:rounded-2xl lg:shadow-[0_-16px_28px_-10px_var(--bg),0_18px_40px_-20px_rgba(20,20,60,0.35)]"
            }`}
          >
            {prototypeCard}
          </div>
        )}
      </div>

      <p className="sr-only" aria-live={auto ? "off" : "polite"}>
        {label}
      </p>
    </div>
  );

  if (!full)
    return (
      <div ref={inlineRef} id={SCRUBBER_ID} className="scroll-mt-24">
        {scrubber}
      </div>
    );

  return (
    <div id={SCRUBBER_ID} style={{ height: inlineHeight }}>
      {createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Quick Send iterations, full screen"
          className="modal-in fixed inset-0 z-[100] flex bg-black/60 p-2 backdrop-blur-sm md:p-4"
          onClick={closeFull}
        >
          <div
            className="flex flex-1 flex-col overflow-y-auto rounded-3xl border border-line bg-bg p-4 shadow-2xl md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Centred with auto margins, so a tall scrubber on a phone still scrolls from its top. */}
            <div className="my-auto">{scrubber}</div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
