"use client";

import { designProcess } from "@/content";
import { Reveal } from "./motion";

export function Process() {
  let n = 0;

  return (
    <section id="approach" className="border-t border-line py-24 md:py-32">
      <div className="container-x">
        <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">How I work</p>
            <h3 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
              {designProcess.heading}
            </h3>
          </div>
          <p className="max-w-sm text-muted">{designProcess.intro}</p>
        </Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          {designProcess.diamonds.map((d, i) => (
            <Reveal
              key={d.label}
              delay={0.1 * i}
              className="rounded-3xl border border-accent/40 bg-accent-soft p-5 md:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="flex items-center gap-3 text-sm font-medium">
                  <DiamondIcon />
                  {d.label}
                </p>
                <span className="font-mono text-xs text-muted">{d.note}</span>
              </div>
              <ol className="mt-5 grid gap-3 sm:grid-cols-2">
                {d.steps.map((p) => {
                  n += 1;
                  return (
                    <li key={p.step} className="rounded-2xl border border-line bg-bg p-5">
                      <span className="font-mono text-xs text-accent">0{n}</span>
                      <p className="mt-5 text-xl font-semibold">{p.step}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
                    </li>
                  );
                })}
              </ol>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-6 flex items-center gap-3 text-sm text-muted">
            <span aria-hidden className="text-accent">↻</span>
            {designProcess.pipeline}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function DiamondIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" className="text-accent">
      <path d="M8 1 15 8 8 15 1 8Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
