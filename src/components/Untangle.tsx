"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import type { Block } from "@/projects";
import { Reveal } from "./motion";

type Props = Pick<Extract<Block, { type: "untangle" }>, "groups" | "links" | "before" | "after">;

// A repeatable scatter, so the knot looks the same on every visit.
const rand = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Every rule a feature has to honour, first as a knot of connections and
 * then, as the page scrolls, pulled straight into the section of the UI that
 * owns it. On phones, or with reduced motion, it shows the sorted columns.
 */
export function Untangle({ groups, links, before, after }: Props) {
  const reduce = useReducedMotion();
  const outer = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const [p, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setP(Math.min(1, Math.max(0, (v - 0.12) / 0.6))));
  const t = reduce ? 1 : ease(p);

  // Where each chip sits in the knot and in its column, in percent of the stage.
  const chips = groups.flatMap((g, gi) =>
    g.items.map((label, ii) => {
      const k = gi * 10 + ii;
      const a = rand(k) * Math.PI * 2;
      const r = Math.sqrt(rand(k + 101));
      const from = { x: 50 + Math.cos(a) * r * 44, y: 52 + Math.sin(a) * r * 40 };
      const to = { x: ((gi + 0.5) / groups.length) * 100, y: 24 + ii * 14 };
      return { label, x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
    }),
  );
  const at = Object.fromEntries(chips.map((c) => [c.label, c]));
  const lineOpacity = Math.max(0, 1 - t * 1.6);

  const stage = (
    <div className="relative h-[min(60vh,32rem)] w-full">
      {groups.map((g, gi) => (
        <div
          key={g.name}
          aria-hidden
          className="absolute top-0 bottom-0 rounded-2xl border border-line bg-raised"
          style={{ left: `${(gi / groups.length) * 100 + 0.4}%`, width: `${100 / groups.length - 0.8}%`, opacity: t }}
        />
      ))}
      <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {links.map(([a, b], i) => {
          const s = at[a];
          const e = at[b];
          if (!s || !e) return null;
          const bend = (rand(i + 7) - 0.5) * 30 * (1 - t);
          const mx = (s.x + e.x) / 2 + bend;
          const my = (s.y + e.y) / 2 - bend;
          return (
            <path
              key={i}
              d={`M${s.x} ${s.y} Q${mx} ${my} ${e.x} ${e.y}`}
              fill="none"
              stroke="var(--accent)"
              strokeOpacity={lineOpacity * 0.7}
              strokeWidth={1.25}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
      {groups.map((g, gi) => (
        <p
          key={g.name}
          className="absolute top-[6%] -translate-x-1/2 text-center text-sm leading-tight font-semibold"
          style={{ left: `${((gi + 0.5) / groups.length) * 100}%`, opacity: t, width: `${100 / groups.length - 1}%` }}
        >
          {g.name}
        </p>
      ))}
      {chips.map((c) => (
        <span
          key={c.label}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-bg px-2.5 py-1 text-xs whitespace-nowrap shadow-sm"
          style={{ left: `${c.x}%`, top: `${c.y}%` }}
        >
          {c.label}
        </span>
      ))}
    </div>
  );

  return (
    <>
      <div ref={outer} className="relative hidden h-[220vh] md:block">
        <div className="sticky top-0 flex h-screen flex-col justify-center pt-16">
          <p className="mb-6 text-lg font-semibold">
            <span className={`transition-opacity duration-500 ${t < 0.5 ? "opacity-100" : "opacity-40"}`}>{before}</span>{" "}
            <span className={`transition-opacity duration-500 ${t >= 0.5 ? "text-accent-ink opacity-100" : "opacity-40"}`}>{after}</span>
          </p>
          {stage}
        </div>
      </div>
      <div className="mt-10 md:hidden">
        <p className="text-lg font-semibold">{after}</p>
        <ul className="mt-6 space-y-6">
          {groups.map((g) => (
            <Reveal key={g.name}>
              <li>
                <p className="text-sm font-semibold">{g.name}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <span key={it} className="rounded-full border border-line bg-raised px-2.5 py-1 text-xs">
                      {it}
                    </span>
                  ))}
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </>
  );
}
