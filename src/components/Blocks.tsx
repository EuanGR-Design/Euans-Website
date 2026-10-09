"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import type { Block, Img, Project } from "@/projects";
import { Reveal } from "./motion";
import { BeforeAfter } from "./BeforeAfter";
import { Journey } from "./Journey";
import { Prototype } from "./Prototype";
import { Brand } from "./Brand";

/** Renders a project's blocks, top to bottom. */
export function Blocks({ project }: { project: Project }) {
  const hasPrototype = project.blocks.some((b) => b.type === "prototype");
  return (
    <>
      {project.blocks.map((b, i) => (
        <BlockView key={i} b={b} project={project} hasPrototype={hasPrototype} />
      ))}
    </>
  );
}

function BlockView({
  b,
  project,
  hasPrototype,
}: {
  b: Block;
  project: Project;
  hasPrototype: boolean;
}) {
  switch (b.type) {
    case "brand":
      return <Brand />;
    case "text":
      return (
        <Section>
          <div className="grid gap-8 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              {b.eyebrow && <p className="eyebrow mb-4">{b.eyebrow}</p>}
              <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">{b.heading}</h2>
            </Reveal>
            <div className="space-y-5 text-lg leading-relaxed text-fg/75 lg:col-span-7">
              {b.body.map((p, i) => (
                <Reveal key={i} delay={0.08 * i}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>
      );
    case "points":
      return (
        <Section>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          <div
            className={`mt-12 grid gap-4 ${
              b.items.length % 3 === 0 ? "md:grid-cols-3" : "md:grid-cols-2"
            }`}
          >
            {b.items.map((p, i) => (
              <Reveal
                key={p.title}
                delay={0.08 * (i % 3)}
                className="rounded-3xl border border-line bg-raised p-7"
              >
                <span className="font-mono text-sm text-accent">0{i + 1}</span>
                <h3 className="mt-6 text-xl font-semibold">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </Section>
      );
    case "image":
      return (
        <Section>
          <Figure img={b.image} />
        </Section>
      );
    case "gallery":
      return (
        <Section>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          <div
            className={
              b.images.length > 2
                ? "mt-12 grid gap-x-6 gap-y-10 md:grid-cols-2"
                : "mt-12 space-y-16 md:space-y-24"
            }
          >
            {b.images.map((img, i) => (
              <Figure
                key={img.ref ?? img.src ?? i}
                img={img}
                sizes={b.images.length > 2 ? "(min-width: 768px) 600px, 100vw" : undefined}
              />
            ))}
          </div>
        </Section>
      );
    case "comparison":
      return (
        <Section>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          <Reveal className="mt-10">
            <BeforeAfter items={b.items} />
          </Reveal>
        </Section>
      );
    case "journey":
      return (
        <Section>
          <Heading eyebrow="Inside the work" heading="From first sketch to shipped." />
          <div className="mt-10">
            <Journey j={{ ...b, name: project.title, hasPrototype }} />
          </div>
        </Section>
      );
    case "prototype":
      return (
        <Section id="prototype">
          <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Interactive prototype</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">{b.heading}</h2>
            </div>
            <p className="max-w-sm text-muted">{b.body}</p>
          </Reveal>
          <Reveal className="mt-12">
            <Prototype p={b} />
          </Reveal>
        </Section>
      );
    case "timeline":
      return <Timeline b={b} />;
    case "embed":
      return (
        <Section>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          {b.body && (
            <Reveal>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg/75">{b.body}</p>
            </Reveal>
          )}
          <div className="mt-12 space-y-12">
            {b.items.map((e) => (
              <Reveal key={e.url}>
                <figure>
                  <div className="aspect-video overflow-hidden rounded-2xl border border-line bg-black md:rounded-3xl">
                    <iframe
                      src={e.url}
                      title={e.title}
                      loading="lazy"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full border-0"
                    />
                  </div>
                  {e.caption && (
                    <figcaption className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
                      {e.caption}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </div>
        </Section>
      );
  }
}

function Section({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="border-t border-line py-20 md:py-28">
      <div className="container-x">{children}</div>
    </section>
  );
}

function Heading({ eyebrow, heading }: { eyebrow?: string; heading: string }) {
  return (
    <Reveal>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-4 max-w-3xl text-3xl leading-tight font-semibold tracking-tight md:text-5xl">
        {heading}
      </h2>
    </Reveal>
  );
}

function Figure({ img, sizes = "(min-width: 1280px) 1200px, 100vw" }: { img: Img; sizes?: string }) {
  return (
    <Reveal>
      <figure>
        <div className="overflow-hidden rounded-2xl border border-line bg-raised shadow-2xl shadow-accent/10 md:rounded-3xl">
          {img.src ? (
            <Image
              src={img.src}
              alt={img.alt}
              width={img.w}
              height={img.h}
              sizes={sizes}
              className="h-auto w-full"
            />
          ) : (
            <div
              className="flex items-center justify-center bg-[radial-gradient(var(--line)_1px,transparent_1px)] p-6 text-center [background-size:16px_16px]"
              style={{ aspectRatio: `${img.w} / ${img.h}` }}
            >
              <span className="eyebrow rounded-full border border-line bg-bg px-3 py-1.5">
                Image coming soon
              </span>
            </div>
          )}
        </div>
        {img.caption && (
          <figcaption className="mt-4 max-w-2xl text-sm text-muted">{img.caption}</figcaption>
        )}
      </figure>
    </Reveal>
  );
}

function Timeline({ b }: { b: Extract<Block, { type: "timeline" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 60%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <Section>
      <Heading eyebrow={b.eyebrow} heading={b.heading} />
      <div ref={ref} className="relative mt-16 md:mt-20">
        <div aria-hidden className="absolute top-0 bottom-0 left-[15px] w-px bg-line" />
        <motion.div
          aria-hidden
          style={{ scaleY }}
          className="absolute top-0 bottom-0 left-[15px] w-px origin-top bg-accent"
        />
        <ol className="space-y-14 md:space-y-20">
          {b.items.map((t) => (
            <li key={t.title} className="relative grid gap-3 pl-12 md:grid-cols-12 md:gap-10">
              <span
                aria-hidden
                className="absolute top-1 left-[9px] h-3.5 w-3.5 rounded-full border-2 border-accent bg-bg"
              />
              <Reveal className="md:col-span-3">
                <span className="font-mono text-sm text-accent">{t.when}</span>
              </Reveal>
              <Reveal delay={0.08} className="md:col-span-9">
                <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{t.title}</h3>
                <p className="mt-4 max-w-2xl leading-relaxed text-fg/75">{t.body}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {t.tags.map((tag) => (
                    <li key={tag} className="rounded-full bg-accent-soft px-3 py-1 text-xs text-fg/85">
                      {tag}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
