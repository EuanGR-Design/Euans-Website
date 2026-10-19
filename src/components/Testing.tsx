"use client";

import Image from "next/image";
import { ArrowRightIcon, PlayIcon } from "@heroicons/react/20/solid";
import type { Block } from "@/projects";
import { Reveal } from "./motion";
import { IconTile } from "./Icon";

type TestingData = Extract<Block, { type: "testing" }>;

/**
 * How a design was tested, told visually: one round as a loop of steps,
 * then every version as a small screen, grouped by how people saw it.
 */
export function Testing({ b }: { b: TestingData }) {
  return (
    <>
      {/* One round of testing. On wide screens the last step loops back to the first. */}
      <div className="mt-10">
        <ol className="grid gap-3 md:grid-cols-4 md:gap-4">
          {b.cycle.map((c, i) => (
            <Reveal key={c.title} delay={0.06 * i} className="relative h-full">
              <li className="h-full rounded-3xl border border-line bg-raised p-6">
                <div className="flex items-center justify-between">
                  <IconTile name={c.icon} size="sm" />
                  <span className="font-mono text-sm text-accent-ink">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.body}</p>
              </li>
              {i < b.cycle.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-1/2 -right-3.5 z-10 hidden size-7 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg text-accent-ink md:flex"
                >
                  <ArrowRightIcon className="size-4" />
                </span>
              )}
            </Reveal>
          ))}
        </ol>
        <Reveal>
          <div className="relative mx-[12.5%] hidden h-10 rounded-b-3xl border-x-2 border-b-2 border-dashed border-accent/45 md:block">
            {/* The arrowhead, pointing back up into the first step. */}
            <svg aria-hidden viewBox="0 0 12 8" className="absolute -top-px -left-[7px] w-3 text-accent/70" fill="currentColor">
              <path d="M6 0 12 8H0Z" />
            </svg>
            <p className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg px-3 text-sm font-medium whitespace-nowrap text-accent-ink">
              {b.repeat}
            </p>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm font-medium text-accent-ink md:hidden">{b.repeat}</p>
        </Reveal>
      </div>

      {/* Every version, grouped by how it was tested. */}
      <div className="mt-14 space-y-4 md:mt-20">
        {b.bands.map((band) => (
          <Reveal key={band.label}>
            <section className="grid gap-5 rounded-3xl border border-line bg-raised p-5 md:grid-cols-[14rem_1fr] md:gap-8 md:p-6">
              <div>
                <p className="eyebrow">{band.label}</p>
                <h3 className="mt-2 text-lg leading-snug font-semibold">{band.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{band.body}</p>
              </div>
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(4.75rem,1fr))] content-start gap-2.5 md:grid-cols-[repeat(auto-fill,minmax(6rem,1fr))]">
                {band.screens.map((s) => (
                  <li key={s.version}>
                    <div
                      className={`relative overflow-hidden rounded-lg border bg-bg ${s.marked ? "border-accent ring-2 ring-accent/25" : "border-line"}`}
                      style={{ aspectRatio: `${s.image.w} / ${s.image.h}` }}
                    >
                      {s.image.src && <Image src={s.image.src} alt="" fill sizes="120px" className="object-cover object-top" />}
                      {s.marked && (
                        <span className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-accent text-on-accent shadow">
                          <PlayIcon aria-hidden className="ml-px size-3" />
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-center text-xs text-muted tabular-nums">
                      v{s.version}
                      {s.marked && b.mark && <span className="sr-only">, {b.mark.toLowerCase()}</span>}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        ))}
        {b.mark && (
          <p className="flex items-center gap-2 text-sm text-muted">
            <span aria-hidden className="flex size-5 items-center justify-center rounded-full bg-accent text-on-accent">
              <PlayIcon className="ml-px size-3" />
            </span>
            {b.mark}
          </p>
        )}
      </div>
    </>
  );
}
