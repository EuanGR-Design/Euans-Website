"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { cardInfo, eras, projectHref, projectImage, type Project } from "@/projects";
import { ProjectLink } from "./ProjectTransition";
import { HeroLoop } from "./HeroLoop";
import { Reveal } from "./motion";

/**
 * The work in order, newest first, along a line down the middle of the
 * page that fills as you scroll. Each place I worked gets a date on the
 * line; each project sets what it is and what I did on one side and shows
 * itself on the other. On phones the line runs down the left edge.
 */
export function WorkTimeline({ list }: { list: Project[] }) {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start 60%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  // Grouped by where the work happened, newest first.
  const groups = eras
    .map((era) => ({ era, items: list.filter((p) => p.era === era.id) }))
    .filter((g) => g.items.length);

  return (
    <section id="work" ref={section} className="relative py-24 md:py-36">
      <div className="container-x">
        <Reveal className="max-w-2xl md:mx-auto md:text-center">
          <p className="eyebrow">The work</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">Newest first.</h2>
          <p className="mt-4 text-lg text-muted">What each project was, what I did on it, and where it went.</p>
        </Reveal>

        <div className="relative mt-16 md:mt-24">
          {/* The line, and how far down it you've read. */}
          <div aria-hidden className="absolute top-0 bottom-0 left-[7px] w-0.5 bg-line md:left-1/2 md:-ml-px">
            <motion.div className="h-full w-full origin-top bg-accent" style={{ scaleY: fill }} />
          </div>

          {groups.map(({ era, items }) => (
            <div key={era.id} className="relative">
              <Reveal className="relative z-10 flex pb-14 pl-8 md:justify-center md:pl-0">
                <p className="inline-flex flex-col rounded-2xl border border-line bg-bg px-5 py-3 md:items-center md:text-center">
                  <span className="font-mono text-sm text-accent-ink">{era.when}</span>
                  <span className="text-lg font-semibold">{era.label}</span>
                </p>
              </Reveal>

              <ol className="space-y-20 pb-24 md:space-y-32 md:pb-32">
                {items.map((p) => (
                  <li key={p.slug} className="relative grid gap-6 pl-8 md:grid-cols-2 md:gap-24 md:pl-0">
                    {/* Where this project sits on the line. */}
                    <span
                      aria-hidden
                      className="absolute top-2 left-0 size-4 rounded-full border-[3px] border-bg bg-accent ring-1 ring-accent/40 md:left-1/2 md:-ml-2"
                    />
                    <Reveal className="md:text-right">
                      <Overview p={p} />
                    </Reveal>
                    <Reveal delay={0.1}>
                      <Media p={p} />
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Overview({ p }: { p: Project }) {
  const did = p.contribution ?? p.tags;
  return (
    <div className="md:ml-auto md:max-w-md">
      {p.year && <p className="font-mono text-sm text-accent-ink">{p.year}</p>}
      <h3 className="mt-1 text-3xl font-bold tracking-[-0.03em] md:text-4xl">{p.title}</h3>
      <p className="mt-3 text-lg leading-relaxed text-fg/75">{p.statement ?? p.summary}</p>
      <ul aria-label="What I did" className="mt-5 flex flex-wrap gap-2 md:justify-end">
        {did.map((t) => (
          <li key={t} className="rounded-full border border-line bg-raised px-3 py-1 text-sm">
            {t}
          </li>
        ))}
      </ul>
      {!p.comingSoon && (
        <ProjectLink
          card={cardInfo(p)}
          href={projectHref(p)}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-fg px-5 text-sm font-medium text-bg transition-colors hover:bg-fg/85"
        >
          View project <ArrowRightIcon aria-hidden className="size-4" />
        </ProjectLink>
      )}
    </div>
  );
}

/** The project's short reel if it has one, otherwise its hero picture. */
function Media({ p }: { p: Project }) {
  const img = projectImage(p);
  const inner = p.heroLoop ? (
    <HeroLoop loop={p.heroLoop} width="w-[82%]" />
  ) : img?.src ? (
    <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover object-top" />
  ) : (
    <div className="absolute inset-0 flex items-end bg-gradient-to-br from-accent/45 via-raised to-raised p-6">
      <span className="text-3xl font-bold tracking-[-0.04em] text-fg/80">{p.title}</span>
    </div>
  );
  const box = (
    <div data-cover className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-raised shadow-[0_24px_50px_-28px_rgba(42,33,28,0.45)]">
      {inner}
    </div>
  );
  if (p.comingSoon) return box;
  return (
    <ProjectLink card={cardInfo(p)} href={projectHref(p)} tabIndex={-1} aria-hidden className="block transition-transform duration-500 hover:-translate-y-1">
      {box}
    </ProjectLink>
  );
}
