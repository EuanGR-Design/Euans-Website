"use client";

import Image from "next/image";
import { useState } from "react";
import type { Img } from "@/projects";

export type Iteration = { image: Img; stage?: string; change?: string; feedback?: string };

// Shown in place of details that haven't been written yet.
const prompts = {
  stage: "Add the stage",
  change: "What changed in this version.",
  feedback: "The feedback that led to it.",
};

/** Screens stacked in one frame, with a blue scrubber that steps through them. */
export function IterationScrubber({ items }: { items: Iteration[] }) {
  const last = items.length - 1;
  const [index, setIndex] = useState(0);
  // The screen being left stays fully visible underneath while the next one
  // fades in over it, so the change never dips to the dark background.
  const [prev, setPrev] = useState(0);
  // Only load screens that have been shown, plus their neighbours.
  const [seen, setSeen] = useState(() => new Set([0, 1]));

  const go = (i: number) => {
    const next = Math.max(0, Math.min(last, i));
    if (next === index) return;
    setPrev(index);
    setIndex(next);
    setSeen((s) => (s.has(next - 1) && s.has(next) && s.has(next + 1) ? s : new Set([...s, next - 1, next, next + 1])));
  };

  const item = items[index];
  const p = last > 0 ? index / last : 0;
  const version = `Version ${index + 1} of ${items.length}`;
  const label = index === last ? `${version} · Final design` : version;

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

  const ratio = items[0].image.w / items[0].image.h;

  return (
    // Sized so the screen and the bar fit on screen together.
    <div className="mx-auto" style={{ maxWidth: `calc(68vh * ${ratio})` }}>
      <div
        className="relative overflow-hidden rounded-2xl border border-line bg-raised shadow-2xl shadow-accent/10 md:rounded-3xl"
        style={{ aspectRatio: `${ratio}` }}
      >
        {items.map((it, i) =>
          seen.has(i) && it.image.src ? (
            <Image
              key={i}
              src={it.image.src}
              alt={i === index ? it.image.alt : ""}
              aria-hidden={i !== index}
              fill
              sizes="(min-width: 1280px) 1200px, 100vw"
              priority={i === 0}
              className={`object-cover object-top ${
                i === index ? "z-10 opacity-100 transition-opacity duration-300" : i === prev ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : null,
        )}
      </div>

      <div className="relative mt-6">
        {/* The pop-up above the handle. It slides from hanging right to hanging left so it never leaves the bar. */}
        <div
          className="pointer-events-none absolute bottom-full mb-4 hidden w-80 md:block"
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
          aria-label="Quick Send iterations"
          aria-valuetext={label}
          className="scrubber w-full"
          style={{ "--p": `${p * 100}%` } as React.CSSProperties}
        />
        <div className="mt-2 flex justify-between px-[11px]" aria-hidden>
          {items.map((_, i) => (
            <span key={i} className={`h-2 w-0.5 rounded-full ${i <= index ? "bg-accent" : "bg-line"}`} />
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          className="rounded-full border border-line px-4 py-2 text-sm transition-colors hover:border-accent disabled:opacity-40"
        >
          ← Earlier
        </button>
        <p className="text-sm text-muted tabular-nums" aria-live="polite">
          {label}
        </p>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === last}
          className="rounded-full border border-line px-4 py-2 text-sm transition-colors hover:border-accent disabled:opacity-40"
        >
          Later →
        </button>
      </div>

      {/* On small screens the details sit below the bar instead. */}
      <div className="mt-6 rounded-2xl border border-line bg-raised p-5 md:hidden">
        <p className={`mb-4 text-xs ${item.stage ? "text-accent" : "text-muted italic"}`}>{item.stage ?? prompts.stage}</p>
        {details}
      </div>
    </div>
  );
}
