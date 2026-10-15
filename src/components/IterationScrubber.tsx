"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Img } from "@/projects";

// A comment pin on the screen, at x and y percent of the frame.
export type Pin = { x: number; y: number; note: string };
// A clickable prototype of a version, offered in a card while it's showing.
export type Prototype = { url: string; body: string };
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
 * Screens stacked in one frame, with a blue scrubber that steps through them.
 * The screen takes all the room it can: the arrows sit either side of it, and
 * only one row (the version, the bar and the full-screen button) sits below.
 */
export function IterationScrubber({ items }: { items: Iteration[] }) {
  const last = items.length - 1;
  const [index, setIndex] = useState(0);
  // The screen being left stays fully visible underneath while the next one
  // fades in over it, so the change never dips to the dark background.
  const [prev, setPrev] = useState(0);
  // Only load screens that have been shown, plus their neighbours.
  const [seen, setSeen] = useState(() => new Set([0, 1]));
  // The pop-up only shows while the bar is hovered, dragged or keyboard-focused.
  const [hover, setHover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [focused, setFocused] = useState(false);
  const showPopup = hover || dragging || focused;
  // Which comment pin is open on the current screen, if any.
  const [openPin, setOpenPin] = useState<number | null>(null);
  // Full-screen view, shown as a modal over a faded page.
  const [full, setFull] = useState(false);
  const [inlineHeight, setInlineHeight] = useState<number>();
  const inlineRef = useRef<HTMLDivElement>(null);
  const openButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  // Versions whose "Try the prototype" card has been dismissed.
  const [closedPrompts, setClosedPrompts] = useState<Set<number>>(() => new Set());

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

  // Escape closes an open pin first, then full screen.
  useEffect(() => {
    if (openPin === null && !full) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (openPin !== null) setOpenPin(null);
      else closeFull();
    };
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
    setOpenPin(null);
    setSeen((s) => (s.has(next - 1) && s.has(next) && s.has(next + 1) ? s : new Set([...s, next - 1, next, next + 1])));
  };

  const item = items[index];
  const p = last > 0 ? index / last : 0;
  const version = `Version ${index + 1} of ${items.length}`;
  const label = index === last ? `${version} · Final design` : version;
  const ratio = items[0].image.w / items[0].image.h;
  const prototype = item.prototype && !closedPrompts.has(index) ? item.prototype : null;

  const details = (
    <dl className="space-y-3 text-sm leading-relaxed">
      <div>
        <dt className="eyebrow">What changed</dt>
        <dd className={`mt-1 ${item.change ? "" : "text-muted italic"}`}>{item.change ?? prompts.change}</dd>
      </div>
      <div>
        <dt className="eyebrow">The feedback</dt>
        <dd className={`mt-1 ${item.feedback ? "" : "text-muted italic"}`}>{item.feedback ?? prompts.feedback}</dd>
      </div>
    </dl>
  );

  const roundButton =
    "h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-bg text-lg transition-colors hover:border-accent disabled:opacity-30";

  const arrow = (step: -1 | 1, className: string) => (
    <button
      type="button"
      onClick={() => go(index + step)}
      disabled={step < 0 ? index === 0 : index === last}
      aria-label={step < 0 ? "Earlier version" : "Later version"}
      className={`${roundButton} ${className}`}
    >
      {step < 0 ? "←" : "→"}
    </button>
  );

  const prototypeCard = (className: string) =>
    prototype && (
      <div
        key={index}
        className={`prompt-in rounded-2xl border border-line bg-bg p-5 shadow-2xl ${className}`}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="eyebrow">{index === last ? "The final design" : `Version ${index + 1}`}</p>
          <button
            type="button"
            onClick={() => setClosedPrompts((s) => new Set([...s, index]))}
            aria-label="Dismiss"
            className="-mt-1 -mr-1 rounded-full px-2 text-muted hover:text-fg"
          >
            ×
          </button>
        </div>
        <p className="mt-2 text-lg font-semibold">Try the prototype</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{prototype.body}</p>
        <a
          href={prototype.url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Open the prototype ↗
        </a>
      </div>
    );

  // Room left for everything that isn't the screen: the bar below it, plus the
  // nav bar inline or the modal's padding in full screen.
  const reserved = full ? "7rem" : "10rem";

  const scrubber = (
    <div className="flex items-center justify-center gap-3 lg:gap-5">
      {arrow(-1, "hidden md:flex")}

      <div className="min-w-0 shrink" style={{ width: `calc((100dvh - ${reserved}) * ${ratio})` }}>
        <div className="relative">
          <div
            className="relative isolate overflow-hidden rounded-2xl border border-line bg-raised shadow-2xl shadow-accent/10 md:rounded-3xl"
            style={{ aspectRatio: `${ratio}` }}
            onClick={() => setOpenPin(null)}
          >
            {items.map((it, i) =>
              seen.has(i) && it.image.src ? (
                <Image
                  key={i}
                  src={it.image.src}
                  alt={i === index ? it.image.alt : ""}
                  aria-hidden={i !== index}
                  fill
                  sizes="(min-width: 1280px) 1600px, 100vw"
                  priority={i === 0}
                  className={`object-cover object-top ${
                    i === index ? "z-10 opacity-100 transition-opacity duration-300" : i === prev ? "opacity-100" : "opacity-0"
                  }`}
                />
              ) : null,
            )}

            {/* Comment pins, like Figma's, marking where this version changed. */}
            <div key={index} className="pin-layer absolute inset-0 z-20">
              {item.pins?.map((pin, i) => {
                const open = openPin === i;
                return (
                  <div
                    key={i}
                    className={`absolute ${open ? "z-10" : ""}`}
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenPin(open ? null : i);
                      }}
                      aria-expanded={open}
                      aria-label={`Change ${i + 1}: ${pin.note}`}
                      className={`pin-bubble absolute bottom-0 left-0 flex h-7 w-7 items-center justify-center rounded-full rounded-bl-none border-2 border-white text-xs font-semibold text-white shadow-lg transition-transform hover:scale-110 md:h-8 md:w-8 md:text-sm ${
                        open ? "bg-accent ring-4 ring-accent/40" : "bg-accent"
                      }`}
                    >
                      {i + 1}
                    </button>
                    {open && (
                      <p
                        role="note"
                        onClick={(e) => e.stopPropagation()}
                        className={`absolute w-56 rounded-xl border border-line bg-bg p-3 text-xs leading-relaxed shadow-xl md:w-64 md:text-sm ${
                          pin.x > 55 ? "right-0" : "left-0"
                        } ${pin.y > 55 ? "bottom-9 md:bottom-10" : "top-2"}`}
                      >
                        {pin.note}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Versions with a prototype invite people to click through them. */}
          {prototypeCard("hidden md:absolute md:right-4 md:bottom-4 md:z-30 md:block md:w-72")}
        </div>

        <div className="mt-4 flex items-center gap-3">
          {arrow(-1, "flex md:hidden")}
          <p className="hidden shrink-0 text-sm text-muted tabular-nums md:block" aria-live="polite">
            <span className="sr-only">{label}</span>
            <span aria-hidden>
              <span className="text-fg">{index + 1}</span> / {items.length}
            </span>
          </p>
          <div className="relative flex-1" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
            {/* The pop-up above the handle. It slides from hanging right to hanging left so it never leaves the bar. */}
            <div
              className={`pointer-events-none absolute bottom-full z-40 mb-4 hidden w-96 transition-opacity duration-150 md:block ${
                showPopup ? "opacity-100" : "opacity-0"
              }`}
              style={{ left: `calc(${p} * (100% - 24px) + 12px)`, transform: `translateX(-${p * 100}%)` }}
              aria-hidden
            >
              <div className="rounded-2xl border border-line bg-bg p-5 shadow-xl">
                <p className={`text-xs ${item.stage ? "text-accent" : "text-muted italic"}`}>{item.stage ?? prompts.stage}</p>
                <p className="mt-1 font-semibold">{label}</p>
                <div className="mt-4">{details}</div>
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={last}
              step={1}
              value={index}
              onChange={(e) => go(Number(e.target.value))}
              onPointerDown={() => setDragging(true)}
              onFocus={(e) => setFocused(e.currentTarget.matches(":focus-visible"))}
              onBlur={() => setFocused(false)}
              aria-label="Quick Send iterations"
              aria-valuetext={label}
              className="scrubber block w-full"
              style={{ "--p": `${p * 100}%` } as React.CSSProperties}
            />
            {/* One dot per version, on the track itself so it costs no height. */}
            <div className="pointer-events-none absolute inset-x-[12px] top-1/2 hidden -translate-y-1/2 md:block" aria-hidden>
              {items.map((_, i) =>
                i === index ? null : (
                  <span
                    key={i}
                    className={`absolute top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                      i < index ? "bg-white/70" : "bg-fg/30"
                    }`}
                    style={{ left: `${(i / last) * 100}%` }}
                  />
                ),
              )}
            </div>
          </div>
          {arrow(1, "flex md:hidden")}
          {full ? (
            <button
              ref={closeButton}
              type="button"
              onClick={closeFull}
              aria-label="Close full screen"
              title="Close full screen"
              className={`${roundButton} flex`}
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M2 6h4V2M14 6h-4V2M2 10h4v4M14 10h-4v4" />
              </svg>
            </button>
          ) : (
            <button ref={openButton} type="button" onClick={openFull} aria-label="Full screen" title="Full screen" className={`${roundButton} flex`}>
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M6 2H2v4M10 2h4v4M6 14H2v-4M10 14h4v-4" />
              </svg>
            </button>
          )}
        </div>

        {prototypeCard("mt-4 md:hidden")}

        {/* On small screens, which can't hover, the details sit below the bar. */}
        <div className="mt-4 rounded-2xl border border-line bg-raised p-5 md:hidden">
          <p className="text-xs">
            <span className="text-muted tabular-nums">{version}</span>
            <span className={item.stage ? "text-accent" : "text-muted italic"}> · {item.stage ?? prompts.stage}</span>
          </p>
          <div className="mt-4">{details}</div>
        </div>
      </div>

      {arrow(1, "hidden md:flex")}
    </div>
  );

  if (!full) return <div ref={inlineRef}>{scrubber}</div>;

  return (
    <div style={{ height: inlineHeight }}>
      {createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Quick Send iterations, full screen"
          className="modal-in fixed inset-0 z-[100] flex bg-black/60 p-2 backdrop-blur-sm md:p-4"
          onClick={closeFull}
        >
          <div
            className="flex flex-1 flex-col justify-center overflow-y-auto rounded-3xl border border-line bg-bg p-3 shadow-2xl md:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {scrubber}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
