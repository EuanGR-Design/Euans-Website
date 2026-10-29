"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Block } from "@/projects";
import { LoopVideo } from "./LoopVideo";

type Item = Extract<Block, { type: "comparison" }>["items"][number];

/**
 * Tabs across the top pick a screen; drag (or use arrow keys) underneath to
 * compare the legacy product with Console.
 */
export function BeforeAfter({ items: comparisons }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const c = comparisons[active];

  const select = (i: number) => {
    const next = (i + comparisons.length) % comparisons.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div>
      {comparisons.length > 1 && (
        <div
          role="tablist"
          aria-label="Screens to compare"
          className="mb-4 flex gap-1 overflow-x-auto rounded-full border border-line bg-raised p-1 md:inline-flex"
        >
          {comparisons.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`cmp-tab-${t.id}`}
              aria-selected={i === active}
              aria-controls={`cmp-panel-${t.id}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") select(i + 1);
                if (e.key === "ArrowLeft") select(i - 1);
              }}
              className={`relative shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
                i === active ? "text-bg" : "text-muted hover:text-fg"
              }`}
            >
              {i === active && (
                <motion.span
                  layoutId="cmp-tab-pill"
                  className="absolute inset-0 rounded-full bg-fg"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
      )}

      <div
        role={comparisons.length > 1 ? "tabpanel" : undefined}
        id={`cmp-panel-${c.id}`}
        aria-labelledby={comparisons.length > 1 ? `cmp-tab-${c.id}` : undefined}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <Slider c={c} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Slider({ c }: { c: Item }) {
  const [pos, setPos] = useState(50);
  const [beforeName, afterName] = c.names ?? ["Before", "Console"];
  const [w, h] = c.ratio ?? [2400, 1337];

  if (!c.before && !c.after) {
    return (
      <figure>
        <div className="relative overflow-hidden rounded-3xl border border-line" style={{ aspectRatio: `${w} / ${h}` }}>
          <Pending label="Before & after" />
        </div>
        <figcaption className="mt-4 text-sm text-muted">
          <span className="text-fg">{c.label}.</span> {c.caption}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="select-none">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-raised" style={{ aspectRatio: `${w} / ${h}` }}>
        <Side src={c.after} alt={`${c.label}: ${afterName}`} label={afterName} video={c.videos?.after} />
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          {c.before ? (
            <Side
              src={c.before}
              alt={`${c.label}: ${beforeName}`}
              label={beforeName}
              video={c.videos?.before}
            />
          ) : c.missing ? (
            <Missing {...c.missing} />
          ) : (
            <Pending label="Before" />
          )}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-px bg-white"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-xl">
            ⇆
          </div>
        </div>

        <span className="eyebrow absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 !text-[10px] !text-white/90 backdrop-blur md:top-4 md:left-4 md:px-3 md:py-1 md:!text-xs">
          {beforeName}
        </span>
        <span className="eyebrow absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 !text-[10px] !text-white/90 backdrop-blur md:top-4 md:right-4 md:px-3 md:py-1 md:!text-xs">
          {afterName}
        </span>

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Compare ${beforeName.toLowerCase()} with ${afterName}: ${c.label.toLowerCase()}`}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-4 text-sm text-muted">
        <span className="text-fg">{c.label}.</span> {c.caption}
      </figcaption>
    </figure>
  );
}

function Side({
  src,
  alt,
  label,
  video,
}: {
  src: string | null;
  alt: string;
  label: string;
  video?: { src: string; poster: string; label: string };
}) {
  if (video)
    return (
      <LoopVideo
        src={video.src}
        poster={video.poster}
        label={video.label}
        button={false}
        wrapperClassName="absolute inset-0"
        className="h-full w-full object-cover object-top"
      />
    );
  if (!src) return <Pending label={label} />;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 1280px) 1200px, 100vw"
      className="object-cover object-top"
    />
  );
}

/** Stands in for a screenshot that hasn't been added yet. */
function Pending({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-raised bg-[radial-gradient(var(--line)_1px,transparent_1px)] [background-size:16px_16px]">
      <span className="eyebrow rounded-full border border-line bg-bg px-4 py-2">
        {label}: coming soon
      </span>
    </div>
  );
}

/** The before side of a screen the legacy app never had. */
function Missing({ title, body }: { title: string; body: string }) {
  return (
    <div className="absolute inset-0 bg-raised bg-[radial-gradient(var(--line)_1px,transparent_1px)] [background-size:16px_16px]">
      {/* Centred in the left half, so the slider's starting position shows all of it. */}
      <div className="absolute inset-y-0 left-0 flex w-1/2 flex-col items-center justify-center py-4 pr-8 pl-4 text-center">
        <div className="mx-auto hidden size-16 items-center justify-center rounded-2xl border border-dashed border-muted/50 text-muted sm:flex">
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <rect x="3" y="3" width="7" height="9" rx="1.5" />
            <rect x="14" y="3" width="7" height="5" rx="1.5" />
            <rect x="14" y="12" width="7" height="9" rx="1.5" />
            <rect x="3" y="16" width="7" height="5" rx="1.5" />
            <path d="M2 22 22 2" />
          </svg>
        </div>
        <p className="text-lg font-semibold tracking-tight sm:mt-4 md:text-2xl">{title}</p>
        <p className="mt-1 text-xs text-muted md:text-sm">{body}</p>
      </div>
    </div>
  );
}
