"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowsPointingOutIcon, XMarkIcon } from "@heroicons/react/20/solid";
import type { Block } from "@/projects";
import { IconTile } from "./Icon";

type BriefData = Extract<Block, { type: "brief" }>;

// The width the brief is laid out at in its preview, before it's scaled down.
const PAPER_W = 880;

/** The brief, written out on a sheet of paper. */
function Paper({ b }: { b: BriefData }) {
  return (
    <article className="relative rounded-md bg-white px-6 py-8 text-fg shadow-[0_1px_2px_rgba(0,0,0,0.06),0_30px_60px_-30px_rgba(0,0,0,0.35)] ring-1 ring-black/5 sm:px-10 md:px-14 md:py-14">
      <header className="border-b-2 border-fg pb-6">
        <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">Product brief</p>
        <h3 className="mt-3 text-3xl font-bold tracking-[-0.03em] md:text-5xl">{b.title}</h3>
        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          {b.meta.map((m) => (
            <div key={m.label}>
              <dt className="font-mono text-[0.7rem] tracking-[0.16em] text-muted uppercase">{m.label}</dt>
              <dd className="mt-1 text-sm leading-snug font-medium">{m.value}</dd>
            </div>
          ))}
        </dl>
      </header>
      {b.sections.map((sec) => (
        <div key={sec.label} className="grid gap-3 border-b border-line py-6 last:border-b-0 last:pb-0 md:grid-cols-[10rem_1fr] md:gap-8 md:py-8">
          <h4 className="font-mono text-xs leading-6 tracking-[0.16em] text-accent-ink uppercase md:leading-7">{sec.label}</h4>
          <div>
            {sec.body && <p className="text-lg leading-relaxed text-fg/85">{sec.body}</p>}
            {sec.items && (
              <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {sec.items.map((it) => (
                  <li key={it.title} className="flex gap-4">
                    {it.icon && <IconTile name={it.icon} size="sm" />}
                    <div>
                      <p className="text-lg leading-snug font-semibold">{it.title}</p>
                      <p className="mt-1 leading-relaxed text-fg/70">{it.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </article>
  );
}

/**
 * The brief as a small sheet on a panel, showing its top. Clicking it opens
 * the whole brief full size, over the page.
 */
export function BriefPreview({ b }: { b: BriefData }) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(0.5);
  const box = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  // Scale the sheet to the panel, the way a prototype is scaled to its frame.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale((e.contentRect.width * 0.8) / PAPER_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    // Keep the page behind still while the brief scrolls.
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const sheet = (rotate = 0) => ({
    width: PAPER_W,
    transform: `translateX(-50%) scale(${scale}) rotate(${rotate}deg)`,
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group relative block w-full overflow-hidden rounded-[1.75rem] text-left md:rounded-panel ${b.surface ? "" : "bg-accent-soft"}`}
        style={b.surface ? { background: b.surface } : undefined}
      >
        <div ref={box} aria-hidden className="relative aspect-[4/3]">
          <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:-translate-y-2">
            <div className="absolute top-[11%] left-1/2 origin-top" style={sheet(2.5)}>
              <div className="h-[1400px] rounded-md bg-white/55" />
            </div>
            <div inert className="absolute top-[9%] left-1/2 origin-top" style={sheet()}>
              <Paper b={b} />
            </div>
          </div>
        </div>
        <span className="absolute bottom-5 left-1/2 inline-flex h-12 -translate-x-1/2 items-center gap-2.5 rounded-full bg-fg pr-5 pl-4 font-medium whitespace-nowrap text-bg shadow-xl transition-transform group-hover:scale-[1.03] md:bottom-7">
          <ArrowsPointingOutIcon aria-hidden className="size-5" />
          See the full brief
        </span>
      </button>

      <dialog
        ref={dialog}
        aria-label={`${b.title}: product brief`}
        onClose={() => setOpen(false)}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-black/55 backdrop:backdrop-blur-sm"
      >
        {open && (
          <div
            className="h-full overflow-y-auto overscroll-contain px-3 py-16 sm:px-6 md:py-20"
            onClick={(e) => {
              // A click beside the sheet closes it.
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <button
              type="button"
              autoFocus
              onClick={() => setOpen(false)}
              aria-label="Close the brief"
              className="fixed top-4 right-4 z-10 flex size-11 items-center justify-center rounded-full bg-bg text-fg shadow-lg transition-colors hover:bg-raised"
            >
              <XMarkIcon aria-hidden className="size-5" />
            </button>
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-4xl"
            >
              <Paper b={b} />
            </motion.div>
          </div>
        )}
      </dialog>
    </>
  );
}
