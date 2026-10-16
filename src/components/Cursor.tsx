"use client";

import { useEffect, useRef } from "react";

/** Anything you can click or interact with. */
const INTERACTIVE = [
  "a[href]",
  "button:not(:disabled)",
  "[role=button]",
  "[role=tab]",
  "input:not([type=hidden]):not(:disabled)",
  "select",
  "textarea",
  "summary",
  "label[for]",
].join(",");

const SIZE = 12; // the resting circle's diameter
const GAP = 10; // space between a hovered element and its outline

type Box = { x: number; y: number; w: number; h: number; r: number };

/**
 * A thin circle in the theme's primary colour that replaces the pointer.
 * Over anything interactive it grows into an outline around that element,
 * GAP pixels clear of its edges and following its corner radius, with a
 * small dot left to mark the pointer. Mouse and trackpad only; touch
 * screens keep their usual behaviour.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    root.classList.add("has-cursor");

    let mx = -100;
    let my = -100;
    let shown = false;
    let down = false;
    let target: Element | null = null;
    const cur: Box = { x: mx, y: my, w: SIZE, h: SIZE, r: SIZE / 2 };

    const find = (el: Element | null) => {
      if (!el || el.tagName === "IFRAME") return null;
      return el.closest(INTERACTIVE);
    };

    const goal = (): Box => {
      if (target?.isConnected) {
        const b = target.getBoundingClientRect();
        if (b.width && b.height) {
          const gap = down ? GAP - 4 : GAP;
          const raw = getComputedStyle(target).borderTopLeftRadius;
          const radius = raw.endsWith("%") ? (parseFloat(raw) / 100) * b.width : parseFloat(raw) || 0;
          return {
            x: b.left - gap,
            y: b.top - gap,
            w: b.width + gap * 2,
            h: b.height + gap * 2,
            r: Math.min(radius, b.width / 2, b.height / 2) + gap,
          };
        }
      }
      const s = down ? SIZE * 0.7 : SIZE;
      return { x: mx - s / 2, y: my - s / 2, w: s, h: s, r: s / 2 };
    };

    let raf = 0;
    const tick = () => {
      const g = goal();
      const k = reduce.matches ? 1 : target ? 0.2 : 0.45;
      (Object.keys(cur) as (keyof Box)[]).forEach((key) => {
        cur[key] += (g[key] - cur[key]) * k;
      });
      const r = ring.current;
      const d = dot.current;
      if (r && d) {
        r.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
        r.style.width = `${cur.w}px`;
        r.style.height = `${cur.h}px`;
        r.style.borderRadius = `${cur.r}px`;
        r.style.opacity = shown ? "1" : "0";
        d.style.transform = `translate3d(${mx - 2}px, ${my - 2}px, 0)`;
        d.style.opacity = shown && target ? "1" : "0";
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX;
      my = e.clientY;
      if (!shown) {
        // Arrive in place rather than sliding in from the last exit point.
        Object.assign(cur, goal());
        shown = true;
      }
    };
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = e.target as Element;
      shown = el.tagName !== "IFRAME";
      target = find(el);
    };
    // Scrolling moves the page under a still pointer.
    const onScroll = () => {
      if (shown) target = find(document.elementFromPoint(mx, my));
    };
    const onLeave = () => {
      shown = false;
      target = null;
    };
    const onDown = () => (down = true);
    const onUp = () => (down = false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("blur", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("scroll", onScroll);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[2147483000] border-[1.5px] border-accent opacity-0 transition-opacity duration-200 [will-change:transform,width,height]"
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[2147483000] size-1 rounded-full bg-accent opacity-0 transition-opacity duration-200"
      />
    </>
  );
}
