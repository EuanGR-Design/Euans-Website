"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { basePath } from "@/lib/basePath";
import type { Block } from "@/projects";
import { LoopVideo } from "./LoopVideo";

type Item = Extract<Block, { type: "comparison" }>["items"][number];

const ORANGE = "#ff6a2b";


/**
 * A before and after across the full width of the page: the screen sits in a
 * browser window on a blue band, and an orange line runs the band's whole
 * height. Drag the line, or tap anywhere on the band, to wipe between the two.
 * It can go right off either edge of the window, to show one side whole. The
 * first time it comes into view it sweeps once each way, to show it moves.
 */
export function CompareBand({ c, hint }: { c: Item; hint?: string }) {
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
    <div
      ref={band}
      className="relative cursor-ew-resize touch-pan-y overflow-hidden py-10 select-none md:py-16"
      style={{ background: "linear-gradient(135deg, #5185ff, #4456f6)" }}
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
        className="relative mx-auto w-[84%] max-w-[1100px] overflow-hidden rounded-[clamp(8px,1.4vw,18px)] bg-[#f4f5f8] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.35)] ring-2 ring-[#79adfc]"
      >
        {/* The browser's tab and address bars, from the template. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${basePath}/work/quick-send/browser-bar.svg`} alt="" width={1440} height={79} className="pointer-events-none block h-auto w-full" draggable={false} />
        <div className="pointer-events-none relative" style={{ aspectRatio: `${w} / ${h}` }}>
          <Side still={c.after} alt={`${c.label}: ${afterName}`} video={c.videos?.after} />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${(1 - shown) * 100}% 0 0)` }}>
            <Side still={c.before} alt={`${c.label}: ${beforeName}`} video={c.videos?.before} />
          </div>
          <span className="eyebrow absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 !text-[10px] !text-white/90 backdrop-blur md:top-4 md:left-4 md:px-3 md:py-1 md:!text-xs">
            {beforeName}
          </span>
          <span className="eyebrow absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 !text-[10px] !text-white/90 backdrop-blur md:top-4 md:right-4 md:px-3 md:py-1 md:!text-xs">
            {afterName}
          </span>
        </div>
      </div>

      {/* The line, the band's full height, with its handle level with the screen's middle. */}
      <div className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2" style={{ left: `${pos * 100}%`, background: ORANGE, boxShadow: "0 0 0 1px rgba(255,255,255,0.35), 0 0 18px rgba(255,106,43,0.6)" }}>
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
          className="pointer-events-auto absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full text-white shadow-[0_8px_24px_rgba(0,0,0,0.3)] ring-4 ring-white/80 focus-visible:ring-white md:size-14"
          style={{ background: ORANGE }}
        >
          <svg viewBox="0 0 24 24" className="size-5 md:size-6" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 6 3 12l6 6M15 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      {hint && (
        <p className="pointer-events-none relative mx-auto mt-6 flex w-[84%] max-w-[1100px] items-center justify-center gap-3 text-center text-sm font-medium text-white/90 md:mt-8 md:text-base">
          <span aria-hidden>←</span>
          {hint}
          <span aria-hidden>→</span>
        </p>
      )}
    </div>
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
