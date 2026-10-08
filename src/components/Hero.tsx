"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { person, stats } from "@/content";
import { Reveal, WordReveal } from "./motion";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative overflow-hidden pt-32 pb-16 md:pt-44 md:pb-24"
    >
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/25 blur-[140px]"
      />

      <div className="container-x relative grid items-end gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Reveal>
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Open to new roles
            </p>
          </Reveal>
          <h1 className="text-[clamp(3rem,11vw,9.5rem)] leading-[0.92] font-semibold tracking-[-0.045em]">
            <WordReveal text="Euan" />
            <br />
            <WordReveal text="Robertson" delay={0.08} />
          </h1>
          <Reveal delay={0.35}>
            <p className="mt-6 font-serif text-2xl text-muted italic md:text-4xl">
              {person.role}
            </p>
          </Reveal>
          <Reveal delay={0.45}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-fg/80 md:text-lg">
              {person.intro}
            </p>
          </Reveal>
          <Reveal delay={0.55} className="mt-8 flex flex-wrap gap-3">
            <a
              href="#work"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
            >
              See the case study
            </a>
            <a
              href={person.cv}
              download
              className="rounded-full border border-line px-6 py-3 text-sm font-medium transition-colors hover:bg-fg hover:text-bg"
            >
              Download CV
            </a>
          </Reveal>
        </div>

        <motion.div
          style={{ y, scale }}
          className="relative mx-auto w-full max-w-sm lg:col-span-4"
        >
          <Reveal delay={0.2}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-raised">
              {person.photo ? (
                <Image
                  src={person.photo}
                  alt="Portrait of Euan Robertson"
                  fill
                  priority
                  sizes="(min-width: 1024px) 380px, 90vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-accent/40 via-raised to-raised">
                  <span className="font-serif text-8xl italic">ER</span>
                  <span className="eyebrow">Photo coming soon</span>
                </div>
              )}
            </div>
          </Reveal>
        </motion.div>
      </div>

      <div className="container-x relative mt-16 md:mt-24">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={0.1 * i} className="bg-bg p-5 md:p-8">
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-4xl font-semibold tracking-tight md:text-5xl">
                {s.value}
              </dd>
              <dd className="mt-2 text-sm text-muted">{s.label}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
