"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import type { Block } from "@/projects";

type Props = Pick<Extract<Block, { type: "handoff" }>, "steps">;

// Keeps a pin on the screen when the part it marks sits at the very edge.
const clamp = (v: number) => Math.min(97, Math.max(3, v * 100));

/**
 * The handoff file a screen at a time, the way the developers read it: the
 * screen with a numbered pin on each annotated part, and the notes beside
 * it. Pointing at a note outlines its part of the screen, and the other way
 * round.
 */
export function Handoff({ steps }: Props) {
  const [step, setStep] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const s = steps[step];
  const go = (i: number) => {
    setStep(i);
    setActive(null);
  };

  return (
    <div className="mt-12">
      <div role="tablist" aria-label="Screens" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:px-0">
        {steps.map((t, i) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            aria-selected={i === step}
            onClick={() => go(i)}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              i === step ? "border-accent bg-accent-soft font-medium text-accent-ink" : "border-line text-muted hover:text-fg"
            }`}
          >
            <span className="text-xs tabular-nums opacity-70">{i + 1}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="relative overflow-hidden rounded-2xl border border-line bg-raised shadow-sm">
          <Image
            key={s.image.src}
            src={s.image.src ?? ""}
            alt={s.image.alt}
            width={s.image.w}
            height={s.image.h}
            sizes="(min-width: 1024px) 800px, 100vw"
            className="h-auto w-full"
          />
          {s.notes.map((n, i) => (
            <span
              key={i}
              aria-hidden
              className={`pointer-events-none absolute rounded-md border-2 border-accent bg-accent/10 transition-opacity duration-200 ${
                active === i ? "opacity-100" : "opacity-0"
              }`}
              style={{ left: `${n.x * 100}%`, top: `${n.y * 100}%`, width: `${n.w * 100}%`, height: `${n.h * 100}%` }}
            />
          ))}
          {s.notes.map((n, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Note ${i + 1}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className={`absolute flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[10px] font-bold text-white shadow ring-2 ring-white transition-transform md:size-6 md:text-xs ${
                active === i ? "scale-125 bg-accent-ink" : "bg-accent"
              }`}
              style={{ left: `${clamp(n.x)}%`, top: `${clamp(n.y)}%` }}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div>
          <p className="text-lg font-semibold">{s.label}</p>
          {s.intro && <p className="mt-2 text-sm leading-relaxed text-muted">{s.intro}</p>}
          <ol className="mt-4 space-y-1">
            {s.notes.map((n, i) => (
              <li key={i}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`flex w-full gap-3 rounded-xl p-2.5 text-left text-sm leading-relaxed transition-colors ${
                    active === i ? "bg-accent-soft" : "hover:bg-fg/5"
                  }`}
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span>{n.text}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex items-center justify-between gap-3 text-sm">
            <button
              type="button"
              onClick={() => go(step - 1)}
              disabled={step === 0}
              className="flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-muted transition-colors hover:text-fg disabled:opacity-40"
            >
              <ArrowLeftIcon aria-hidden className="size-4" />
              Back
            </button>
            <span className="text-muted tabular-nums">
              {step + 1} of {steps.length}
            </span>
            <button
              type="button"
              onClick={() => go(step + 1)}
              disabled={step === steps.length - 1}
              className="flex items-center gap-1.5 rounded-full bg-fg px-3.5 py-1.5 font-medium text-bg transition-opacity disabled:opacity-40"
            >
              Next
              <ArrowRightIcon aria-hidden className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
