"use client";

import Image from "next/image";
import Link from "next/link";
import { person, showreel } from "@/content";
import { Reveal, WordReveal } from "./motion";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-12 md:pt-44 md:pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/25 blur-[140px]"
      />

      <div className="container-x relative">
        <Reveal>
          <p className="eyebrow mb-6 flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {person.name} · {person.role}
          </p>
        </Reveal>
        <h1 className="max-w-5xl text-[clamp(2.5rem,7.5vw,6.5rem)] leading-[0.98] font-semibold tracking-[-0.04em]">
          <WordReveal text={person.statement} />
        </h1>
        <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-end">
          <Reveal delay={0.35} className="md:col-span-7">
            <p className="max-w-xl text-base leading-relaxed text-fg/80 md:text-lg">
              {person.intro}
            </p>
          </Reveal>
          <Reveal delay={0.45} className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
            <Link
              href="/work"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
            >
              See my work
            </Link>
            <a
              href={person.cv}
              download
              className="rounded-full border border-line px-6 py-3 text-sm font-medium transition-colors hover:bg-fg hover:text-bg"
            >
              Download CV
            </a>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.5} className="relative mt-16 md:mt-20">
        <Showreel />
      </Reveal>
    </section>
  );
}

/** Work sliding past. Pauses on hover; stays still for reduced motion. */
function Showreel() {
  // Rendered twice so the loop is seamless; the copy is hidden from
  // assistive tech and keyboard focus.
  const tiles = [...showreel, ...showreel];
  return (
    <div className="group overflow-hidden motion-reduce:overflow-x-auto">
      <ul className="flex w-max animate-[marquee_70s_linear_infinite] gap-4 px-2 group-hover:[animation-play-state:paused] motion-reduce:animate-none md:gap-6">
        {tiles.map((t, i) => {
          const copy = i >= showreel.length;
          return (
            <li key={i} aria-hidden={copy || undefined}>
              <Link
                href={t.href}
                tabIndex={copy ? -1 : undefined}
                className="block h-44 overflow-hidden rounded-2xl border border-line bg-raised md:h-72"
                style={{ aspectRatio: `${t.w} / ${t.h}` }}
              >
                <Image
                  src={t.src}
                  alt={t.alt}
                  width={t.w}
                  height={t.h}
                  sizes="(min-width: 768px) 400px, 240px"
                  className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-[1.04]"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
