"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { basePath } from "@/lib/basePath";
import type { Block } from "@/projects";
import { LoopVideo } from "./LoopVideo";

type Item = Extract<Block, { type: "comparison" }>["items"][number];

// A deep blue from the band, for the line and its handle.
const NAVY = "#1b2478";


/**
 * A before and after across the full width of the page: the section's words
 * and a browser window sit on a blue band, and a slim line runs down through
 * the window. Drag the line, or tap beside it, to wipe between the two.
 * It can go right off either edge of the window, to show one side whole. The
 * first time it comes into view it sweeps once each way, to show it moves.
 */
export function CompareBand({
  c,
  hint,
  eyebrow,
  heading,
  body,
  caption,
}: {
  c: Item;
  hint?: string;
  eyebrow?: string;
  heading?: string;
  body?: string;
  caption?: string;
}) {
  const band = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  // Where the line is, as a share of the band's width.
  const [pos, setPos] = useState(0.5);
  // The window's left edge and width, as shares of the band's width.
  const [geo, setGeo] = useState({ left: 0.08, width: 0.84 });
  // The line goes past the window's edges, to halfway across the band's
  // margin, so its handle stays in reach and clear of the page's side nav.
  const geoRef = useRef(geo);
  geoRef.current = geo;
  const clamp = useCallback((p: number) => {
    const g = geoRef.current;
    return Math.min(1 - (1 - g.left - g.width) / 2, Math.max(g.left / 2, p));
  }, []);
  const touched = useRef(false);
  const dragging = useRef(false);
  const [beforeName, afterName] = c.names ?? ["Before", "After"];
  const [w, h] = c.ratio ?? [2400, 1337];

  useLayoutEffect(() => {
    const measure = () => {
      const b = band.current?.getBoundingClientRect();
      const f = frame.current?.getBoundingClientRect();
      if (!b || !f || !b.width) return;
      setGeo({ left: (f.left - b.left) / b.width, width: f.width / b.width });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (band.current) ro.observe(band.current);
    return () => ro.disconnect();
  }, []);

  // One sweep each way the first time it's on screen, unless the viewer
  // got there first or prefers less motion.
  useEffect(() => {
    const el = band.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const keys = [0.5, 0.8, 0.2, 0.5];
        const leg = 1100;
        const start = performance.now() + 600;
        const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
        const tick = (now: number) => {
          if (touched.current) return;
          const t = Math.max(0, now - start) / leg;
          const i = Math.min(Math.floor(t), keys.length - 2);
          const k = Math.min(t - i, 1);
          setPos(keys[i] + (keys[i + 1] - keys[i]) * ease(k));
          if (t < keys.length - 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const moveTo = useCallback((clientX: number) => {
    const b = band.current?.getBoundingClientRect();
    if (!b) return;
    setPos(clamp((clientX - b.left) / b.width));
  }, [clamp]);

  // How much of the window shows the before side, from its left edge.
  const shown = Math.min(1, Math.max(0, (pos - geo.left) / geo.width));

  return (
    <div className="relative overflow-hidden py-16 text-white md:py-20" style={{ background: "linear-gradient(135deg, #5185ff, #4456f6)" }}>
      {(heading || body) && (
        <div className="mx-auto w-[84%] max-w-[1100px]">
          {eyebrow && <p className="eyebrow !text-white/70">{eyebrow}</p>}
          {heading && <h2 className="mt-4 max-w-3xl text-3xl leading-tight font-semibold tracking-tight md:text-5xl">{heading}</h2>}
          {body && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{body}</p>}
        </div>
      )}

      {/* The part you drag on: the window, with room either side for the line to go past its edges. */}
      <div
        ref={band}
        className="relative mt-8 cursor-ew-resize touch-pan-y py-6 select-none md:mt-12 md:py-8"
        onPointerDown={(e) => {
          touched.current = true;
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          moveTo(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <div
          ref={frame}
          className="relative mx-auto w-[84%] max-w-[1100px] overflow-hidden rounded-[clamp(8px,1.4vw,18px)] bg-[#f4f5f8] shadow-[0_30px_60px_-20px_rgba(10,20,90,0.45)] ring-1 ring-white/40"
        >
          {/* The browser's tab and address bars, from the template. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${basePath}/work/quick-send/browser-bar.svg`} alt="" width={1440} height={79} className="pointer-events-none block h-auto w-full" draggable={false} />
          <div className="pointer-events-none relative" style={{ aspectRatio: `${w} / ${h}` }}>
            <Side still={c.after} alt={`${c.label}: ${afterName}`} video={c.videos?.after} />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${(1 - shown) * 100}% 0 0)` }}>
              <Side still={c.before} alt={`${c.label}: ${beforeName}`} video={c.videos?.before} />
            </div>
            <Tag className="left-2 md:left-4" visible={shown > 0.04}>
              {beforeName}
            </Tag>
            <Tag className="right-2 md:right-4" visible={shown < 0.96}>
              {afterName}
            </Tag>
          </div>
        </div>

        {/* A slim line through the window and a little past it, with a small handle level with the screen's middle. */}
        <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 rounded-full" style={{ left: `${pos * 100}%`, background: NAVY }}>
          <button
            type="button"
            role="slider"
            aria-label={`Compare ${beforeName.toLowerCase()} and ${afterName.toLowerCase()}: ${c.label.toLowerCase()}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(shown * 100)}
            aria-valuetext={`${Math.round(shown * 100)}% ${beforeName.toLowerCase()}`}
            onKeyDown={(e) => {
              const step = e.shiftKey ? 0.1 : 0.04;
              if (e.key === "ArrowLeft") setPos((p) => clamp(p - step));
              else if (e.key === "ArrowRight") setPos((p) => clamp(p + step));
              else if (e.key === "Home") setPos(clamp(0));
              else if (e.key === "End") setPos(clamp(1));
              else return;
              e.preventDefault();
              touched.current = true;
            }}
            className="pointer-events-auto absolute top-1/2 left-1/2 flex h-10 w-7 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center gap-[3px] rounded-full text-white shadow-[0_6px_18px_rgba(10,20,90,0.35)] transition-transform outline-none hover:scale-105 focus-visible:ring-2 focus-visible:ring-white md:h-12 md:w-8"
            style={{ background: NAVY }}
          >
            <span className="h-4 w-px rounded-full bg-white/80 md:h-5" />
            <span className="h-4 w-px rounded-full bg-white/80 md:h-5" />
          </button>
        </div>
      </div>

      <div className="mx-auto mt-2 flex w-[84%] max-w-[1100px] flex-col gap-3 text-sm md:mt-4 md:flex-row md:items-start md:justify-between md:gap-10">
        {caption && <p className="max-w-2xl leading-relaxed text-white/75">{caption}</p>}
        {hint && <p className="shrink-0 font-medium text-white/90">{hint}</p>}
      </div>
    </div>
  );
}

/** Which side is which, in a corner of the screen, gone once that side is out of view. */
function Tag({ children, className, visible }: { children: React.ReactNode; className: string; visible: boolean }) {
  return (
    <span
      className={`absolute top-2 rounded-full px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur transition-opacity md:top-4 md:px-3 md:text-xs ${className} ${visible ? "opacity-100" : "opacity-0"}`}
      style={{ background: "rgba(27, 36, 120, 0.78)" }}
    >
      {children}
    </span>
  );
}

function Side({ still, alt, video }: { still: string | null; alt: string; video?: { src: string; poster: string; label: string } }) {
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
  if (!still) return null;
  return <Image src={still} alt={alt} fill sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover object-top" draggable={false} />;
}
