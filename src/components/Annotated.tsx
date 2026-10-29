"use client";

import Image from "next/image";
import { useState } from "react";
import type { Block } from "@/projects";
import { Reveal } from "./motion";

type Frame = Extract<Block, { type: "annotated" }>["frames"][number];

/**
 * A real screen with numbered pins on its problems, and the problems listed
 * underneath, each with what fixed it. Pointing at a pin or a problem lights
 * up its partner.
 */
export function Annotated({ frames }: { frames: Frame[] }) {
  return (
    <div className="mt-12 grid gap-16 md:mt-14 md:gap-20">
      {frames.map((f) => (
        <AnnotatedFrame key={f.image.src ?? f.image.alt} f={f} />
      ))}
    </div>
  );
}

function AnnotatedFrame({ f }: { f: Frame }) {
  const [on, setOn] = useState<number | null>(null);
  return (
    <figure>
      {f.title && (
        <Reveal>
          <figcaption className="mb-5 text-xl font-semibold md:text-2xl">{f.title}</figcaption>
        </Reveal>
      )}
      <Reveal>
        <div
          className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35)]"
          style={{ aspectRatio: `${f.image.w} / ${f.image.h}` }}
        >
          {f.image.src && <Image src={f.image.src} alt={f.image.alt} fill sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />}
          {f.pins.map((p, i) => (
            <span
              key={p.title}
              aria-hidden
              onMouseEnter={() => setOn(i)}
              onMouseLeave={() => setOn(null)}
              className={`absolute flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-xs font-bold text-white shadow-lg ring-4 transition md:size-8 md:text-sm ${
                on === i ? "scale-125 ring-accent/40" : "ring-white/70"
              }`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              {i + 1}
            </span>
          ))}
        </div>
      </Reveal>
      <ol className={`mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 ${f.pins.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        {f.pins.map((p, i) => (
          <Reveal key={p.title} delay={0.05 * i}>
            <li
              onMouseEnter={() => setOn(i)}
              onMouseLeave={() => setOn(null)}
              className={`flex h-full gap-3 rounded-2xl p-3 transition-colors ${on === i ? "bg-accent-soft" : ""}`}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{p.title}</p>
                <p className="mt-1 leading-relaxed text-fg/75">{p.body}</p>
                {p.fix && (
                  <p className="mt-2 text-sm leading-relaxed">
                    <span className="font-semibold text-accent-ink">Now: </span>
                    {p.fix}
                  </p>
                )}
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </figure>
  );
}
