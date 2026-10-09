"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { caseStudy } from "@/content";
import { Reveal, WordReveal } from "./motion";
import { BeforeAfter } from "./BeforeAfter";
import { Prototype } from "./Prototype";
import { Journeys } from "./Journeys";

export function CaseStudy() {
  return (
    <section id="work" className="relative border-t border-line">
      <Intro />
      <Problem />
      <Comparison />
      <Timeline />
      <Process />
      <Journeys />
      <Prototype />
      <Epics />
    </section>
  );
}

function Intro() {
  return (
    <div className="relative overflow-hidden bg-[#2240a8] py-24 text-white md:py-40">
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-[#2240a8] via-[#3a8ee6] to-[#4af2d6]"
      />
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow !text-white/70">
              Case study · {caseStudy.client} · {caseStudy.years}
            </p>
          </Reveal>
          <h2 className="mt-6 text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] font-semibold tracking-[-0.04em]">
            <WordReveal text={caseStudy.title} />
          </h2>
          <Reveal delay={0.3}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/80">
              {caseStudy.summary}
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.2} className="lg:col-span-5 lg:self-end">
          <div className="overflow-hidden rounded-3xl border border-white/15 shadow-2xl">
            <Image
              src="/work/drafts-v2-cover.png"
              alt="Drafts V2 Figma working file cover in the Legalesign brand"
              width={800}
              height={566}
              className="h-auto w-full"
            />
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function Problem() {
  return (
    <div className="container-x py-24 md:py-32">
      <Reveal>
        <p className="eyebrow">The problem</p>
      </Reveal>
      <Reveal>
        <h3 className="mt-4 max-w-3xl text-3xl leading-tight font-semibold tracking-tight md:text-5xl">
          Customers wanted to roll it out wider, but their people couldn&apos;t
          use it.
        </h3>
      </Reveal>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {caseStudy.problem.map((p, i) => (
          <Reveal
            key={p.title}
            delay={0.1 * i}
            className="group rounded-3xl border border-line bg-raised p-7 transition-colors hover:border-accent/60"
          >
            <span className="font-mono text-sm text-accent">0{i + 1}</span>
            <h4 className="mt-6 text-xl font-semibold">{p.title}</h4>
            <p className="mt-3 leading-relaxed text-muted">{p.body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function Comparison() {
  return (
    <div className="container-x pb-24 md:pb-32">
      <Reveal className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Before → after</p>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
            Same product. Unrecognisable experience.
          </h3>
        </div>
        <p className="max-w-sm text-muted">
          The legacy app is still live. Console replaced it one-to-one in
          features, then went much further.
        </p>
      </Reveal>
      <Reveal>
        <BeforeAfter />
      </Reveal>
    </div>
  );
}

function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 60%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div className="border-t border-line py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">Five years, five chapters</p>
          <h3 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
            How the product evolved.
          </h3>
        </Reveal>

        <div ref={ref} className="relative mt-16 md:mt-24">
          <div
            aria-hidden
            className="absolute top-0 bottom-0 left-[15px] w-px bg-line md:left-1/2"
          />
          <motion.div
            aria-hidden
            style={{ scaleY }}
            className="absolute top-0 bottom-0 left-[15px] w-px origin-top bg-accent md:left-1/2"
          />

          <ol className="space-y-16 md:space-y-28">
            {caseStudy.timeline.map((t) => (
              <li
                key={t.phase}
                className="relative grid gap-4 pl-12 md:grid-cols-2 md:gap-16 md:pl-0"
              >
                <span
                  aria-hidden
                  className="absolute top-1 left-[9px] h-3.5 w-3.5 rounded-full border-2 border-accent bg-bg md:left-1/2 md:-translate-x-1/2"
                />
                <Reveal className="md:text-right">
                  <span className="font-mono text-sm text-accent">
                    {t.phase} — {t.when}
                  </span>
                  <p className="mt-3 font-serif text-5xl italic text-fg/20 md:text-7xl">
                    {t.title.split(":")[0]}
                  </p>
                </Reveal>
                <Reveal delay={0.1}>
                  <h4 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    {t.title}
                  </h4>
                  <p className="mt-4 leading-relaxed text-fg/75">{t.body}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {t.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full bg-accent-soft px-3 py-1 text-xs text-fg/85"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function Epics() {
  return (
    <div className="border-t border-line py-24 md:py-32">
      <div className="container-x">
        <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Products & projects</p>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              100+ features. A few of the big ones.
            </h3>
          </div>
          <p className="max-w-sm text-muted">
            Alongside the core product, I designed a run of separate products
            and workflows, each taken from research through to release.
          </p>
        </Reveal>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {caseStudy.epics.map((e, i) => (
            <motion.li
              key={e.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative bg-bg p-6 transition-colors hover:bg-raised sm:last:col-span-2 lg:last:col-span-1"
            >
              <span className="font-mono text-xs text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-8 text-lg font-semibold">{e.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{e.note}</p>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100"
              />
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Process() {
  const { process } = caseStudy;
  let n = 0;

  return (
    <div className="border-t border-line py-24 md:py-32">
      <div className="container-x">
        <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">How I work</p>
            <h3 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
              {process.heading}
            </h3>
          </div>
          <p className="max-w-sm text-muted">{process.intro}</p>
        </Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          {process.diamonds.map((d, i) => (
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
            {process.pipeline}
          </p>
        </Reveal>
      </div>
    </div>
  );
}

function DiamondIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" className="text-accent">
      <path d="M8 1 15 8 8 15 1 8Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
