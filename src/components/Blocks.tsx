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
import { Bento } from "./Bento";
import { FlowPan } from "./FlowPan";

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
                <span className="font-mono text-sm text-accent-ink">0{i + 1}</span>
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
        <Section id={b.id}>
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
            <div className="overflow-hidden rounded-2xl border border-line bg-raised md:rounded-3xl">
              <Video src={b.src} poster={b.poster} label={b.label} />
            </div>
          </Reveal>
        </Section>
      );
    case "bento":
      return (
        <section id={b.id} className="scroll-mt-16 border-t border-line py-20 md:py-28">
          <div className="container-x">
            <Heading eyebrow={b.eyebrow} heading={b.heading} />
            {b.body && (
              <Reveal>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg/75">{b.body}</p>
              </Reveal>
            )}
          </div>
          <div className="mx-auto mt-12 max-w-[1440px] px-3 md:px-6">
            <Bento feature={b.feature} tiles={b.tiles} />
          </div>
        </section>
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
    case "insights": {
      const labels = b.labels ?? ["We found", "So the design had to"];
      const cols = labels.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2";
      const cell = (label: string, text: string, i: number) => (
        <div
          key={label}
          className={`rounded-3xl p-6 ${
            i === labels.length - 1 ? "bg-accent-soft" : i === 0 ? "border border-line bg-raised" : "border border-line"
          }`}
        >
          <span className="eyebrow not-italic md:hidden">{label}</span>
          <p className={`mt-3 leading-snug md:mt-0 ${i === 0 ? "text-xl font-semibold tracking-[-0.01em]" : "text-lg"}`}>
            {text}
          </p>
        </div>
      );
      return (
        <Section>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          {/* On wider screens the labels head their columns once. */}
          <div aria-hidden className={`mt-12 hidden gap-4 px-6 md:grid ${cols}`}>
            {labels.map((l) => (
              <span key={l} className="eyebrow">
                {l}
              </span>
            ))}
          </div>
          <ol className="mt-4 space-y-4 md:mt-4">
            {b.items.map((it, i) => (
              <Reveal key={i} delay={0.06 * i}>
                <li className={`grid gap-3 md:gap-4 ${cols} ${draftText(b.draft)}`}>
                  {[it.found, it.so, it.then].slice(0, labels.length).map((text, j) => cell(labels[j], text ?? "", j))}
                </li>
              </Reveal>
            ))}
          </ol>
        </Section>
      );
    }
    case "callouts":
      return (
        <Section>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          {b.body && (
            <Reveal>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg/75">{b.body}</p>
            </Reveal>
          )}
          <ol className="mt-14 md:mt-20">
            {b.items.map((it, i) => {
              const words = (
                <>
                  <p className="text-lg leading-relaxed text-fg/75 md:text-xl">{it.body}</p>
                  {it.fix && (
                    <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-on-accent">
                      <span aria-hidden>→</span> {it.fix}
                    </p>
                  )}
                </>
              );
              return (
                <Reveal key={it.title}>
                  <li className="grid gap-6 border-t border-line py-10 md:grid-cols-12 md:gap-10 md:py-14">
                    <div className="md:col-span-6">
                      <span className="font-mono text-sm text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="mt-4 text-[clamp(2rem,4.4vw,3.75rem)] leading-[1] font-bold tracking-[-0.035em] text-balance">
                        {it.title}
                      </h3>
                      {it.image && <div className="mt-6 max-w-md">{words}</div>}
                    </div>
                    <div className={`md:col-span-6 ${it.image ? "" : "self-end md:pb-1"}`}>
                      {it.image?.src ? (
                        <div className="overflow-hidden rounded-2xl border border-line bg-raised">
                          <Image
                            src={it.image.src}
                            alt={it.image.alt}
                            width={it.image.w}
                            height={it.image.h}
                            sizes="(min-width: 768px) 640px, 100vw"
                            className="h-auto w-full"
                          />
                        </div>
                      ) : (
                        words
                      )}
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </Section>
      );
    case "overview":
      return (
        <Section>
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
              <h2 className="mt-4 text-3xl leading-tight font-semibold tracking-tight md:text-5xl">{b.heading}</h2>
              <p className="mt-6 text-lg leading-relaxed text-fg/75">{b.body}</p>
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-4 lg:col-start-9">
              <p className="eyebrow">What I did</p>
              <ol className="mt-4 border-t border-line">
                {b.did.map((d, i) => (
                  <li key={d} className="flex gap-4 border-b border-line py-4 text-lg leading-snug font-medium">
                    <span className="font-mono text-sm leading-7 text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                    {d}
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </Section>
      );
    case "screens":
      return (
        <section className="border-t border-line py-20 md:py-28">
          <div className="container-x">
            <Heading eyebrow={b.eyebrow} heading={b.heading} />
            {b.body && (
              <Reveal>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg/75">{b.body}</p>
              </Reveal>
            )}
          </div>
          <ol className="mt-14 space-y-16 md:mt-20 md:space-y-28">
            {b.items.map((it, i) => (
              <li key={it.title}>
                <Reveal className="container-x flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-10">
                  <h3 className="flex items-baseline gap-4 text-3xl font-bold tracking-[-0.03em] md:text-5xl">
                    <span className="font-mono text-sm font-normal tracking-normal text-accent-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {it.title}
                  </h3>
                  <p className="max-w-md text-lg leading-snug text-muted md:text-right">{it.body}</p>
                </Reveal>
                <Reveal className="mx-auto mt-6 max-w-[1720px] px-3 md:mt-8 md:px-6">
                  <div className="overflow-hidden rounded-2xl border border-line bg-raised md:rounded-3xl">
                    {it.image.src && (
                      <Image
                        src={it.image.src}
                        alt={it.image.alt}
                        width={it.image.w}
                        height={it.image.h}
                        sizes="(min-width: 1720px) 1680px, 100vw"
                        className="h-auto w-full"
                      />
                    )}
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>
      );
    case "flow":
      return <FlowPan b={b} />;
    case "outcome":
      return (
        <section className="bg-tertiary py-24 text-on-tertiary md:py-36">
          <div className="container-x">
            <Reveal>
              {b.eyebrow && <p className="eyebrow !text-on-tertiary/70">{b.eyebrow}</p>}
              <h2 className="mt-4 text-3xl leading-tight font-semibold tracking-tight md:text-5xl">{b.heading}</h2>
            </Reveal>
            <ol className="mt-14 md:mt-20">
              {b.items.map((it, i) => (
                <Reveal key={it.title}>
                  <li className="grid gap-4 border-t border-on-tertiary/20 py-10 md:grid-cols-12 md:gap-10 md:py-14">
                    <span className="font-mono text-sm text-on-tertiary/60 md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-[clamp(2.25rem,5.6vw,5rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance md:col-span-7">
                      {it.title}
                    </p>
                    <p className="self-end text-lg leading-relaxed text-on-tertiary/75 md:col-span-4">{it.body}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
            {b.stats && (
              <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                {b.stats.map((st) => (
                  <div key={st.label} className="flex flex-col-reverse justify-end gap-3 rounded-3xl bg-on-tertiary/[0.08] p-7">
                    <dt className="text-on-tertiary/75">{st.label}</dt>
                    <dd className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-bold tracking-[-0.04em] tabular-nums">{st.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {b.todo && <p className="mt-6 border-t border-on-tertiary/20 pt-6 text-on-tertiary/60 italic">{b.todo}</p>}
          </div>
        </section>
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
                      <span className="rounded-full bg-accent px-3 py-1 text-xs text-on-accent">Chosen</span>
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
                  <div className="md:col-span-2">
                    <span className="font-mono text-sm text-accent-ink">Round {i + 1}</span>
                    {r.title && <p className="mt-2 text-sm leading-snug text-muted">{r.title}</p>}
                  </div>
                  <div className={`space-y-5 md:col-span-5 ${draftText(b.draft)}`}>
                    <div>
                      <p className="eyebrow not-italic">Testers struggled with</p>
                      <p className="mt-2 leading-relaxed">{r.heard}</p>
                    </div>
                    <div>
                      <p className="eyebrow not-italic">So I changed</p>
                      <p className="mt-2 leading-relaxed">{r.changed}</p>
                    </div>
                  </div>
                  <div className="self-start overflow-hidden rounded-2xl border border-line md:col-span-5">
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
        <section className="border-t border-line py-20 md:py-28">
          <div className="container-x">
            <Heading eyebrow={b.eyebrow} heading={b.heading} />
            {b.body && (
              <Reveal>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg/75">{b.body}</p>
              </Reveal>
            )}
          </div>
          {/* Wider than the page column, so the screens get all the room they can. */}
          <div className="mx-auto mt-12 max-w-[1720px] px-3 md:px-6">
            <IterationScrubber items={b.items} />
          </div>
        </section>
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
                  className={`mt-4 text-5xl font-semibold tracking-tight tabular-nums ${b.draft ? "text-muted" : "text-accent-ink"}`}
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
        <div className="overflow-hidden rounded-2xl border border-line bg-raised md:rounded-3xl">
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
                <span className="font-mono text-sm text-accent-ink">{t.when}</span>
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
