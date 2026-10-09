"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type P = { url: string; width: number; height: number };

export function Prototype({ p }: { p: P }) {
  return (
    <>
      <BrowserFrame p={p} />
      <p className="mt-4 text-sm text-muted">
        Best on a laptop or desktop. It&apos;s a working prototype, so not every
        path is wired up.
      </p>
    </>
  );
}

function BrowserFrame({ p }: { p: P }) {
  const [launched, setLaunched] = useState(false);
  const host = new URL(p.url).host;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-raised shadow-2xl shadow-accent/10 md:rounded-3xl">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <div aria-hidden className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-fg/15" />
          <span className="h-3 w-3 rounded-full bg-fg/15" />
          <span className="h-3 w-3 rounded-full bg-fg/15" />
        </div>
        <span className="min-w-0 flex-1 truncate rounded-full bg-bg px-3 py-1 text-center font-mono text-xs text-muted">
          {host}
        </span>
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs text-muted transition-colors hover:text-fg"
        >
          Open in new tab ↗
        </a>
      </div>

      <div
        className="relative w-full"
        style={{ aspectRatio: `${p.width} / ${p.height}` }}
      >
        <AnimatePresence initial={false}>
          {launched ? (
            <motion.div
              key="frame"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0"
            >
              <ScaledFrame p={p} />
            </motion.div>
          ) : (
            <motion.div key="poster" exit={{ opacity: 0 }} className="absolute inset-0">
              <Poster p={p} onLaunch={() => setLaunched(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Renders the prototype at the size it was designed for, then scales it down
 * to fit, so the layout matches what was designed instead of reflowing.
 */
function ScaledFrame({ p }: { p: P }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / p.width),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, [p.width]);

  return (
    <div ref={ref} className="h-full w-full overflow-hidden bg-white">
      <iframe
        src={p.url}
        title="Interactive prototype"
        width={p.width}
        height={p.height}
        allow="fullscreen; clipboard-write"
        style={{ transform: `scale(${scale})`, transformOrigin: "0 0" }}
        className="border-0"
      />
    </div>
  );
}

function Poster({ p, onLaunch }: { p: P; onLaunch: () => void }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#0c1457]">
      {/* A sketch of the editor: toolbar, page and field sidebar. */}
      <div aria-hidden className="absolute inset-0 opacity-40">
        <div className="absolute inset-x-0 top-0 h-[9%] border-b border-white/10 bg-white/5" />
        <div className="absolute top-[9%] bottom-0 left-0 w-[18%] border-r border-white/10 bg-white/5" />
        <div className="absolute top-[9%] right-0 bottom-0 w-[22%] border-l border-white/10 bg-white/5" />
        <div className="absolute top-[15%] bottom-[-10%] left-[30%] w-[36%] rounded-md bg-white/90">
          <div className="m-[8%] space-y-3">
            {[90, 75, 85, 60, 80, 70].map((w, i) => (
              <div key={i} className="h-2 rounded bg-[#0c1457]/15" style={{ width: `${w}%` }} />
            ))}
            <div className="!mt-8 h-8 w-1/2 rounded border-2 border-dashed border-[#5185ff] bg-[#eff4ff]" />
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[#0c1457] via-[#0c1457]/60 to-transparent"
      />

      <div className="relative px-6 text-center">
        {/* Desktop: load it inline. */}
        <button
          type="button"
          onClick={onLaunch}
          className="hidden items-center gap-3 rounded-full bg-white px-6 py-3.5 font-medium text-[#0c1457] shadow-xl transition-transform hover:scale-[1.04] md:inline-flex"
        >
          <PlayIcon />
          Launch prototype
        </button>
        {/* Phone: too small to use inline, so open it full screen. */}
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#0c1457] shadow-xl md:hidden"
        >
          <PlayIcon />
          Open prototype
        </a>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <path d="M3 1.5v11a.5.5 0 0 0 .76.43l9-5.5a.5.5 0 0 0 0-.86l-9-5.5A.5.5 0 0 0 3 1.5Z" />
    </svg>
  );
}
