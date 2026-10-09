"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { comparisons } from "@/content";

/**
 * Tabs across the top pick a screen; drag (or use arrow keys) underneath to
 * compare the legacy product with Console.
 */
export function BeforeAfter() {
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

      <div
        role="tabpanel"
        id={`cmp-panel-${c.id}`}
        aria-labelledby={`cmp-tab-${c.id}`}
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

function Slider({ c }: { c: (typeof comparisons)[number] }) {
  const [pos, setPos] = useState(50);

  if (!c.before && !c.after) {
    return (
      <figure>
        <div className="relative aspect-[1440/900] overflow-hidden rounded-3xl border border-line">
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
      <div className="relative aspect-[1440/900] overflow-hidden rounded-3xl border border-line bg-raised">
        <Side src={c.after} alt={`${c.label} in Console`} label="Console" />
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          {c.before ? (
            <Side src={c.before} alt={`${c.label} in the legacy app`} label="Before" />
          ) : c.id === "dashboard" ? (
            <Before />
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

        <span className="eyebrow absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1 text-white/80 backdrop-blur">
          Before
        </span>
        <span className="eyebrow absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1 text-white/80 backdrop-blur">
          Console
        </span>

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Compare the legacy ${c.label.toLowerCase()} with Console`}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-4 text-sm text-muted">
        <span className="text-fg">{c.label}.</span> {c.caption}
        {c.id === "dashboard" && !c.before && (
          <> The legacy side is an illustrative reconstruction.</>
        )}
      </figcaption>
    </figure>
  );
}

function Side({ src, alt, label }: { src: string | null; alt: string; label: string }) {
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

function Before() {
  return (
    <div className="absolute inset-0 bg-[#e9e6dc] p-3 font-[Arial,sans-serif] text-[#333] md:p-5">
      <div className="mb-2 flex items-center gap-2 bg-[#5a6b7a] px-2 py-1.5 text-[10px] text-white md:text-xs">
        <b>LEGALESIGN</b>
        <span className="opacity-70">Home | Documents | Templates | Groups | Account | Help</span>
      </div>
      <div className="grid h-[calc(100%-2.5rem)] grid-cols-[30%_1fr] gap-2">
        <div className="space-y-1 border border-[#bbb] bg-white p-2 text-[9px] md:text-[11px]">
          {["Send a document", "Bulk send", "Templates", "Drafts", "Signed", "Rejected", "Trash", "Reports", "Settings"].map(
            (l) => (
              <div key={l} className="text-[#1a4fa0] underline">
                {l}
              </div>
            ),
          )}
        </div>
        <div className="overflow-hidden border border-[#bbb] bg-white text-[9px] md:text-[11px]">
          <div className="grid grid-cols-4 bg-[#d5d5d5] px-1 py-1 font-bold">
            <span>Title</span>
            <span>Recipient</span>
            <span>Status</span>
            <span>Sent</span>
          </div>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`grid grid-cols-4 px-1 py-0.5 ${i % 2 ? "bg-[#f3f3f3]" : ""}`}
            >
              <span>Contract_{1040 + i}.pdf</span>
              <span>user{i}@org.gov</span>
              <span className="text-[#a33]">{i % 3 ? "Pending" : "Signed"}</span>
              <span>0{(i % 9) + 1}/03/2021</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
