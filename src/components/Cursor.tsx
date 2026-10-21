"use client";

import { useEffect } from "react";

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

const SIZE = 20; // the resting circle's diameter
const GAP = 6; // space between a hovered element and its outline
const THUMB = 12; // half a slider handle's width (see .scrubber in globals.css)

type Box = { x: number; y: number; w: number; h: number; r: number; a: number };

/**
 * How far an element is turned, in degrees, from its own rotate and
 * transform and those of the few elements around it, so the outline can
 * turn with a card set at an angle.
 */
function angleOf(el: Element) {
  let deg = 0;
  let node: Element | null = el;
  for (let i = 0; node && i < 4; i++, node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.rotate && style.rotate !== "none") deg += parseFloat(style.rotate.split(" ").pop()!) || 0;
    const m = style.transform.match(/^matrix(?:3d)?\(([^)]+)\)/);
    if (m) {
      const [a, b] = m[1].split(",").map(Number);
      deg += (Math.atan2(b, a) * 180) / Math.PI;
    }
  }
  return Math.abs(deg) < 0.1 ? 0 : deg;
}

const radiusOf = (el: Element, width: number) => {
  const raw = getComputedStyle(el).borderTopLeftRadius;
  return raw.endsWith("%") ? (parseFloat(raw) / 100) * width : parseFloat(raw) || 0;
};

/**
 * The corner radius an element looks like it has. A link with no radius of
 * its own takes it from what fills it (a card's image) or from the rounded
 * box it fills (a slider laid over an image), and a thin slider track is
 * treated as a pill.
 */
function cornerOf(el: Element, b: DOMRect) {
  const own = radiusOf(el, b.width);
  if (own) return own;
  if (el instanceof HTMLInputElement && el.type === "range" && b.height <= 48) return b.height / 2;
  for (const child of Array.from(el.querySelectorAll("[data-cover], img, video, div")).slice(0, 12)) {
    const c = child.getBoundingClientRect();
    const r = radiusOf(child, c.width);
    if (r && c.width >= b.width * 0.8) return r;
  }
  let parent = el.parentElement;
  for (let i = 0; parent && i < 3; i++, parent = parent.parentElement) {
    const p = parent.getBoundingClientRect();
    if (Math.abs(p.width - b.width) > 2 || Math.abs(p.height - b.height) > 2) break;
    const r = radiusOf(parent, p.width);
    if (r) return r;
  }
  return 0;
}

/**
 * A thin circle in the theme's primary colour that replaces the pointer.
 * Over anything interactive it grows into an outline around that element,
 * GAP pixels clear of its edges and following its corner radius, with a
 * small dot left to mark the pointer. Mouse and trackpad only; touch
 * screens keep their usual behaviour.
 */
export function Cursor() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    // Made here rather than rendered, so they can move into an open modal
    // dialog: a dialog sits in the top layer, above anything outside it.
    const make = (className: string) => {
      const el = document.createElement("div");
      el.setAttribute("aria-hidden", "true");
      el.className = className;
      document.body.append(el);
      return el;
    };
    const r = make(
      "pointer-events-none fixed top-0 left-0 z-[2147483000] border-[1.5px] border-accent opacity-0 transition-opacity duration-200 [will-change:transform,width,height]",
    );
    const d = make("pointer-events-none fixed top-0 left-0 z-[2147483000] size-1 rounded-full bg-accent opacity-0 transition-opacity duration-200");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    root.classList.add("has-cursor");

    let mx = -100;
    let my = -100;
    let shown = false;
    let down = false;
    let target: Element | null = null;
    const cur: Box = { x: mx, y: my, w: SIZE, h: SIZE, r: SIZE / 2, a: 0 };

    const find = (el: Element | null) => {
      if (!el || el.tagName === "IFRAME") return null;
      return el.closest(INTERACTIVE);
    };

    // Looked up once per hovered element rather than every frame.
    const corners = new WeakMap<Element, number>();
    const corner = (el: Element, b: DOMRect) => {
      if (!corners.has(el)) corners.set(el, cornerOf(el, b));
      return corners.get(el)!;
    };

    const goal = (): Box => {
      if (target?.isConnected) {
        const b = target.getBoundingClientRect();
        // A slider is outlined in parts: its handle when the pointer is on
        // it, otherwise the step under the pointer.
        if (target instanceof HTMLInputElement && target.type === "range" && b.width) {
          const min = Number(target.min) || 0;
          const max = Number(target.max) || 100;
          const span = Math.max(1, max - min);
          const track = b.width - THUMB * 2;
          const at = (v: number) => b.left + THUMB + ((v - min) / span) * track;
          const cy = b.top + b.height / 2;
          const handle = at(Number(target.value));
          const onHandle = Math.abs(mx - handle) <= THUMB + 2;
          const step = Math.round(((mx - b.left - THUMB) / track) * span) + min;
          const cx = onHandle ? handle : at(Math.max(min, Math.min(max, step)));
          const size = (onHandle ? THUMB * 2 : 6) + (down ? GAP - 3 : GAP) * 2;
          return { x: cx - size / 2, y: cy - size / 2, w: size, h: size, r: size / 2, a: 0 };
        }
        if (b.width && b.height) {
          const gap = down ? GAP - 3 : GAP;
          // A turned element is outlined at its own size, turned to match,
          // around the middle of the box it covers.
          const a = target instanceof HTMLElement ? angleOf(target) : 0;
          const w = a && target instanceof HTMLElement ? target.offsetWidth : b.width;
          const h = a && target instanceof HTMLElement ? target.offsetHeight : b.height;
          // Concentric with the element's corners: its radius plus the gap.
          return {
            x: b.left + b.width / 2 - w / 2 - gap,
            y: b.top + b.height / 2 - h / 2 - gap,
            w: w + gap * 2,
            h: h + gap * 2,
            r: Math.min(corner(target, b), w / 2, h / 2) + gap,
            a,
          };
        }
      }
      const s = down ? SIZE * 0.7 : SIZE;
      return { x: mx - s / 2, y: my - s / 2, w: s, h: s, r: s / 2, a: 0 };
    };

    let raf = 0;
    const tick = () => {
      const g = goal();
      const k = reduce.matches ? 1 : target ? 0.2 : 0.45;
      (Object.keys(cur) as (keyof Box)[]).forEach((key) => {
        cur[key] += (g[key] - cur[key]) * k;
      });
      // Follow the newest open modal into the top layer, and back out.
      const dialogs = document.querySelectorAll("dialog[open]");
      const host = dialogs.length ? dialogs[dialogs.length - 1] : document.body;
      if (r.parentElement !== host) host.append(r, d);
      {
        r.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0) rotate(${cur.a}deg)`;
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
      r.remove();
      d.remove();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("scroll", onScroll);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return null;
}
