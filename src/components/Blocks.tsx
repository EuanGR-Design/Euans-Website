"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import type { Block, Img } from "@/projects";
import { Reveal } from "./motion";
import { BeforeAfter } from "./BeforeAfter";
import { Journey } from "./Journey";
import { Prototype } from "./Prototype";
import { Brand } from "./Brand";
import { IterationScrubber } from "./IterationScrubber";
import { Video } from "./Video";

/** Renders blocks top to bottom. `name` is the project they belong to. */
export function Blocks({ blocks, name }: { blocks: Block[]; name: string }) {
  const hasPrototype = blocks.some((b) => b.type === "prototype");
  return (
    <>
      {blocks.map((b, i) => (
        <BlockView key={i} b={b} name={name} hasPrototype={hasPrototype} />
      ))}
    </>
  );
}

// Copy that is still a prompt for the real words.
const draftText = (draft?: boolean) => (draft ? "text-muted italic" : "");

function BlockView({
  b,
  name,
  hasPrototype,
}: {
  b: Block;
  name: string;
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
            <div className={`space-y-5 text-lg leading-relaxed text-fg/75 lg:col-span-7 ${draftText(b.draft)}`}>
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
    case "video":
      return (
        <Section>
          <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
              <h2 className="mt-4 max-w-3xl text-3xl leading-tight font-semibold tracking-tight md:text-5xl">
                {b.heading}
              </h2>
            </div>
            {b.body && <p className="max-w-sm text-muted">{b.body}</p>}
          </Reveal>
          <Reveal className="mt-12">
            <div className="overflow-hidden rounded-2xl border border-line bg-raised shadow-2xl shadow-accent/10 md:rounded-3xl">
              <Video src={b.src} poster={b.poster} label={b.label} />
            </div>
          </Reveal>
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
            <Journey j={{ ...b, name, hasPrototype }} />
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
    case "quotes":
      return (
        <Section>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {b.items.map((q, i) => (
              <Reveal key={i} delay={0.08 * (i % 3)}>
                <figure className="flex h-full flex-col justify-between gap-8 rounded-3xl border border-line bg-raised p-7">
                  <blockquote className={`text-xl leading-snug font-medium ${draftText(b.draft)}`}>
                    “{q.quote}”
                  </blockquote>
                  <figcaption className="font-mono text-xs tracking-[0.14em] text-muted uppercase">{q.who}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Section>
      );
    case "personas":
      return (
        <Section>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {b.items.map((p, i) => (
              <Reveal key={p.name} delay={0.08 * (i % 3)} className="rounded-3xl border border-line bg-raised p-7">
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted">{p.role}</p>
                <dl className={`mt-6 space-y-4 text-sm leading-relaxed ${draftText(b.draft)}`}>
                  <div>
                    <dt className="eyebrow not-italic">Goals</dt>
                    <dd className="mt-1">{p.goals}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow not-italic">Frustrations</dt>
                    <dd className="mt-1">{p.frustrations}</dd>
                  </div>
                </dl>
              </Reveal>
            ))}
          </div>
        </Section>
      );
    case "journey-map":
      return (
        <Section>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          <Reveal className="mt-12 -mx-5 overflow-x-auto px-5 md:-mx-10 md:px-10">
            <table className="w-full min-w-[720px] border-separate border-spacing-2 text-left text-sm">
              <thead>
                <tr>
                  <td />
                  {b.stages.map((st) => (
                    <th key={st} scope="col" className="rounded-2xl bg-accent-soft p-4 font-semibold">
                      {st}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.lanes.map((lane) => (
                  <tr key={lane.label}>
                    <th scope="row" className="eyebrow w-28 pr-2 align-top font-normal">
                      {lane.label}
                    </th>
                    {lane.cells.map((c, i) => (
                      <td
                        key={i}
                        className={`rounded-2xl border border-line bg-raised p-4 align-top leading-relaxed ${draftText(b.draft)}`}
                      >
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </Section>
      );
    case "insights":
      return (
        <Section>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          <ol className="mt-12 space-y-4">
            {b.items.map((it, i) => (
              <Reveal key={i} delay={0.06 * i}>
                <li className={`grid gap-4 md:grid-cols-2 ${draftText(b.draft)}`}>
                  <div className="rounded-3xl border border-line bg-raised p-6">
                    <span className="eyebrow not-italic">We found</span>
                    <p className="mt-3 text-lg leading-snug">{it.found}</p>
                  </div>
                  <div className="rounded-3xl border border-accent/40 bg-accent-soft p-6">
                    <span className="eyebrow not-italic">So the design had to</span>
                    <p className="mt-3 text-lg leading-snug">{it.so}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </Section>
      );
    case "options":
      return (
        <Section>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {b.items.map((o, i) => (
              <Reveal
                key={o.title}
                delay={0.08 * (i % 3)}
                className={`overflow-hidden rounded-3xl border ${o.chosen ? "border-accent" : "border-line"} bg-raised`}
              >
                <Shot img={o.image} label={o.title} />
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold">{o.title}</h3>
                    {o.chosen && (
                      <span className="rounded-full bg-accent px-3 py-1 text-xs text-white">Chosen</span>
                    )}
                  </div>
                  <p className={`mt-3 text-sm leading-relaxed text-fg/75 ${draftText(b.draft)}`}>{o.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      );
    case "rounds":
      return (
        <Section>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          <ol className="mt-12 space-y-6">
            {b.items.map((r, i) => (
              <Reveal key={i} delay={0.06 * i}>
                <li className="grid gap-6 rounded-3xl border border-line bg-raised p-6 md:grid-cols-12 md:p-8">
                  <span className="font-mono text-sm text-accent md:col-span-2">Round {i + 1}</span>
                  <div className={`space-y-5 md:col-span-4 ${draftText(b.draft)}`}>
                    <div>
                      <p className="eyebrow not-italic">Testers struggled with</p>
                      <p className="mt-2 leading-relaxed">{r.heard}</p>
                    </div>
                    <div>
                      <p className="eyebrow not-italic">So I changed</p>
                      <p className="mt-2 leading-relaxed">{r.changed}</p>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-line md:col-span-6">
                    <Shot img={r.image} label={`Round ${i + 1}, before and after`} />
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </Section>
      );
    case "iterations":
      return (
        <Section>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          {b.body && (
            <Reveal>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg/75">{b.body}</p>
            </Reveal>
          )}
          <div className="mt-12">
            <IterationScrubber items={b.items} prototypeUrl={b.prototypeUrl} />
          </div>
        </Section>
      );
    case "stats":
      return (
        <Section>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          <dl className="mt-12 grid gap-4 sm:grid-cols-3">
            {b.items.map((st, i) => (
              <Reveal key={st.label} delay={0.08 * i} className="rounded-3xl border border-line bg-raised p-7">
                <dt className="text-sm text-muted">{st.label}</dt>
                <dd
                  className={`mt-4 text-5xl font-semibold tracking-tight tabular-nums ${b.draft ? "text-muted" : "text-accent"}`}
                >
                  {st.value}
                </dd>
              </Reveal>
            ))}
          </dl>
        </Section>
      );
  }
}

/** A screenshot in a card, or a labelled slot until it exists. */
function Shot({ img, label }: { img: Img | null; label: string }) {
  if (img?.src) {
    return (
      <Image
        src={img.src}
        alt={img.alt}
        width={img.w}
        height={img.h}
        sizes="(min-width: 768px) 600px, 100vw"
        className="h-auto w-full"
      />
    );
  }
  return (
    <div className="flex aspect-[16/10] items-center justify-center bg-[radial-gradient(var(--line)_1px,transparent_1px)] p-6 text-center [background-size:16px_16px]">
      <span className="eyebrow rounded-full border border-line bg-bg px-3 py-1.5">{label}</span>
    </div>
  );
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
