"use client";

import { useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { Reveal } from "./motion";

type Voice = { quote: string; need: string };

// A slight, fixed tilt per card, so the grid reads as a loose pile of notes.
const tilts = [-1.5, 1, -0.5, 1.5, 0.75, -1.25, 1.25, -0.75];

/**
 * What users said, each on a card that turns over to show what they needed.
 * Both sides stay in the page for screen readers; the turn is only visual.
 */
export function Voices({ items }: { items: Voice[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((v, i) => (
        <Reveal key={v.quote} delay={0.05 * (i % 4)}>
          <li className="h-full">
            <VoiceCard v={v} tilt={tilts[i % tilts.length]} />
          </li>
        </Reveal>
      ))}
    </ul>
  );
}

function VoiceCard({ v, tilt }: { v: Voice; tilt: number }) {
  const [turned, setTurned] = useState(false);
  const face = "col-start-1 row-start-1 flex flex-col justify-between rounded-3xl p-6 [backface-visibility:hidden] md:p-7";
  return (
    <button
      type="button"
      aria-pressed={turned}
      onClick={() => setTurned((t) => !t)}
      className="group block h-full w-full rounded-3xl text-left [perspective:1200px]"
      style={{ transform: `rotate(${turned ? 0 : tilt}deg)`, transition: "transform 400ms ease" }}
    >
      <span
        className="grid h-full min-h-56 transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:-translate-y-1"
        style={{ transform: turned ? "rotateY(180deg)" : undefined }}
      >
        <span className={`${face} border border-line bg-raised shadow-[0_18px_40px_-28px_rgba(20,20,60,0.45)]`}>
          <span>
            <span aria-hidden className="block font-serif text-5xl leading-none text-accent">“</span>
            <span className="mt-1 block text-xl leading-snug font-semibold tracking-tight text-balance">{v.quote}</span>
          </span>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors group-hover:text-fg">
            <ArrowPathIcon aria-hidden className="size-4" />
            What they needed
          </span>
        </span>
        <span className={`${face} bg-accent-soft [transform:rotateY(180deg)]`}>
          <span>
            <span className="eyebrow block">They needed</span>
            <span className="mt-3 block text-lg leading-snug font-medium text-balance">{v.need}</span>
          </span>
          <span aria-hidden className="mt-6 text-sm text-muted">“{v.quote}”</span>
        </span>
      </span>
    </button>
  );
}
