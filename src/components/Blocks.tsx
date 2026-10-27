"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { sectionAnchor, type Block, type Deeper as DeeperData, type Img, type Notes as NotesData } from "@/projects";
import { Reveal } from "./motion";
import { BeforeAfter } from "./BeforeAfter";
import { Journey } from "./Journey";
import { Prototype } from "./Prototype";
import { Brand } from "./Brand";
import { IterationScrubber } from "./IterationScrubber";
import { Video } from "./Video";
import { Bento } from "./Bento";
import { FlowPan } from "./FlowPan";
import { BrowserFrame } from "./BrowserFrame";
import { BriefPreview } from "./Brief";
import { HeroPrototype } from "./HeroPrototype";
import { DecisionLoop } from "./DecisionLoop";
import { Voices } from "./Voices";
import { Testing } from "./Testing";
import { Deeper, useInPanel } from "./Deeper";
import { PersonaCards } from "./PersonaCards";
import { StoryMap } from "./StoryMap";
import { UserStories } from "./UserStories";
import { Priorities } from "./Priorities";
import { ObjectivesMatrix } from "./ObjectivesMatrix";
import { Themes } from "./Themes";
import { Shortlist } from "./Shortlist";
import { DoubleDiamond } from "./DoubleDiamond";
import { Icon, IconTile } from "./Icon";
import { ArrowDownIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";

/**
 * Renders blocks top to bottom. `name` is the project they belong to. On the
 * page itself, a block without its own id gets one from its eyebrow, so the
 * section nav can jump to it.
 */
export function Blocks({ blocks, name }: { blocks: Block[]; name: string }) {
  const hasPrototype = blocks.some((b) => b.type === "prototype");
  const inPanel = useInPanel();
  return (
    <>
      {blocks.map((b, i) => {
        const view = <BlockView b={b} name={name} hasPrototype={hasPrototype} />;
        const anchor = !inPanel && !("id" in b && b.id) ? sectionAnchor(b) : undefined;
        return anchor ? (
          <div key={i} id={anchor} className="scroll-mt-16">
            {view}
          </div>
        ) : (
          <Fragment key={i}>{view}</Fragment>
        );
      })}
    </>
  );
}

/** The Dig deeper button for a block that has more behind it. */
function More({ d, name }: { d?: DeeperData; name: string }) {
  if (!d) return null;
  return (
    <Reveal>
      <Deeper d={d}>
        <Blocks blocks={d.blocks} name={name} />
      </Deeper>
    </Reveal>
  );
}

/** A few short points with icons, under a section's main content. */
function Notes({ items }: { items?: NotesData }) {
  if (!items) return null;
  return (
    <ul className="mt-10 grid gap-6 sm:grid-cols-2">
      {items.map((n, i) => (
        <Reveal key={n.title} delay={0.06 * i}>
          <li className="flex gap-4">
            <IconTile name={n.icon} size="sm" />
            <div>
              <p className="font-semibold">{n.title}</p>
              <p className="mt-1 leading-relaxed text-muted">{n.body}</p>
            </div>
          </li>
        </Reveal>
      ))}
    </ul>
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
      // Items with a loop lead with it, as a card each.
      if (b.items.some((p) => p.loop))
        return (
          <Section>
            <Heading eyebrow={b.eyebrow} heading={b.heading} />
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {b.items.map((p, i) => {
                // A last card on its own takes the whole row, side by side.
                const last = i === b.items.length - 1;
                const wide = last && b.items.length % 2 === 1 && b.items.length % 3 === 1;
                return (
                  <Reveal key={p.title} delay={0.08 * (i % 3)} className={`h-full ${wide ? "sm:col-span-2 lg:col-span-3" : ""}`}>
                    <li className={`h-full overflow-hidden rounded-3xl border border-line bg-raised ${wide ? "sm:flex sm:items-center" : ""}`}>
                      <div className={`aspect-[4/3] overflow-hidden ${wide ? "sm:w-1/2 lg:w-1/3" : ""}`}>{p.loop && <DecisionLoop name={p.loop} className="rounded-none" />}</div>
                      <div className={`p-6 md:p-7 ${wide ? "sm:flex-1 lg:px-12" : ""}`}>
                        <h3 className={`font-semibold ${wide ? "text-xl lg:text-2xl" : "text-xl"}`}>{p.title}</h3>
                        <p className="mt-2 max-w-xl leading-relaxed text-muted">{p.body}</p>
                      </div>
                    </li>
                  </Reveal>
                );
              })}
            </ul>
            <More d={b.deeper} name={name} />
          </Section>
        );
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
                {p.icon ? (
                  <IconTile name={p.icon} size="sm" />
                ) : (
                  <span className="font-mono text-sm text-accent-ink">0{i + 1}</span>
                )}
                <h3 className="mt-6 text-xl font-semibold">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{p.body}</p>
              </Reveal>
            ))}
          </div>
          <More d={b.deeper} name={name} />
        </Section>
      );
    case "testing":
      return (
        <Section>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          {b.body && (
            <Reveal>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg/75">{b.body}</p>
            </Reveal>
          )}
          <Testing b={b} />
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
            <div className="overflow-hidden rounded-[1.75rem] md:rounded-panel border border-line bg-raised">
              <Video src={b.src} poster={b.poster} label={b.label} />
            </div>
          </Reveal>
          <More d={b.deeper} name={name} />
        </Section>
      );
    case "bento":
      return (
        // With no heading, the clips carry straight on from the hero card.
        <section id={b.id} className={`scroll-mt-16 ${b.heading ? "border-t border-line py-20 md:py-28" : "pb-20 md:pb-28"}`}>
          {b.heading && (
            <div className="container-x">
              <Heading eyebrow={b.eyebrow} heading={b.heading} />
              {b.body && (
                <Reveal>
                  <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg/75">{b.body}</p>
                </Reveal>
              )}
            </div>
          )}
          <div className={b.surface || b.lifted ? `container-x ${b.heading ? "mt-12" : ""}` : "mx-auto mt-12 max-w-[1440px] px-3 md:px-6"}>
            <Bento feature={b.feature} tiles={b.tiles} bare={b.bare} surface={b.surface} lifted={b.lifted} />
          </div>
          {b.principle && (
            <Reveal className="container-x mt-20 grid gap-8 md:mt-28 md:grid-cols-12 md:gap-12">
              <div className="md:col-span-5">
                {b.principle.eyebrow && <p className="eyebrow">{b.principle.eyebrow}</p>}
                <h2 className="mt-4 text-3xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
                  {b.principle.heading}
                </h2>
              </div>
              <div className="space-y-5 md:col-span-7 md:pt-9">
                {b.principle.body.map((para) => (
                  <p key={para} className="text-lg leading-relaxed text-fg/80">
                    {para}
                  </p>
                ))}
                {b.principle.quote && (
                  <figure className={`!mt-10 flex gap-5 ${b.principle.quote.logo ? "" : "border-l-2 border-accent pl-5"}`}>
                    {b.principle.quote.logo === "linear" && <LinearMark />}
                    <div>
                    <blockquote className="text-xl leading-snug font-semibold tracking-[-0.01em] md:text-2xl">
                      &ldquo;{b.principle.quote.text}&rdquo;
                    </blockquote>
                    <figcaption className="mt-3 text-sm text-muted">
                      <a href={b.principle.quote.url} target="_blank" rel="noreferrer" className="underline-offset-4 hover:text-fg hover:underline">
                        {b.principle.quote.by}
                      </a>
                    </figcaption>
                    </div>
                  </figure>
                )}
              </div>
            </Reveal>
          )}
          {b.cue && (
            <a
              href={b.cue.href}
              className="group mx-auto mt-12 flex w-fit flex-col items-center gap-3 text-muted transition-colors hover:text-fg md:mt-16"
            >
              <span className="text-lg md:text-xl">{b.cue.label}</span>
              <span
                aria-hidden
                className="flex size-11 items-center justify-center rounded-full border border-line transition-colors group-hover:border-fg/30"
              >
                <ArrowDownIcon className="size-5" />
              </span>
            </a>
          )}
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
    case "voices":
      return (
        <Section id={b.id}>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end md:gap-12">
            <Heading eyebrow={b.eyebrow} heading={b.heading} />
            {b.body && (
              <Reveal>
                <p className="max-w-md text-lg leading-relaxed text-fg/75">{b.body}</p>
              </Reveal>
            )}
          </div>
          <div className="mt-12">
            <Voices items={b.items} />
          </div>
          <More d={b.deeper} name={name} />
        </Section>
      );
    case "play":
      // The prototype in the hero's browser window, to try at the end.
      return (
        <Section id={b.id}>
          <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">{b.eyebrow}</p>
              <h2 className="mt-4 max-w-3xl text-3xl leading-tight font-semibold tracking-tight md:text-5xl">{b.heading}</h2>
            </div>
            {b.body && <p className="max-w-sm text-muted">{b.body}</p>}
          </Reveal>
          {b.image.src && (
            <Reveal className="mt-12">
              <div
                className="relative overflow-hidden rounded-[1.75rem] bg-raised md:rounded-panel"
                style={{ aspectRatio: `${b.image.w} / ${b.image.h}` }}
              >
                <Image src={b.image.src} alt={b.image.alt} fill sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover object-top" />
                <HeroPrototype play={b.play} image={b.image} title={name} />
              </div>
              {/* Too small to use on a phone, so it opens full screen there. */}
              <a
                href={b.play.url}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-fg pr-5 pl-4 font-medium text-bg md:hidden"
              >
                <Icon name="CursorArrowRays" className="size-5" />
                Open the prototype
                <ArrowTopRightOnSquareIcon aria-hidden className="size-4 opacity-60" />
              </a>
            </Reveal>
          )}
          <More d={b.deeper} name={name} />
        </Section>
      );
    case "todo":
      // A section still to be written, with what goes in it.
      return (
        <Section id={b.id}>
          <Reveal>
            <p className="eyebrow">{b.eyebrow}</p>
            <h2
              className={`mt-4 max-w-3xl text-3xl leading-tight font-semibold tracking-tight text-balance md:text-5xl ${
                b.heading ? "" : "text-muted italic"
              }`}
            >
              {b.heading ?? b.ask}
            </h2>
          </Reveal>
          <Reveal className="mt-10 flex flex-col gap-6 rounded-3xl border-2 border-dashed border-line p-7 md:mt-12 md:flex-row md:items-center md:justify-between md:gap-10 md:p-9">
            <div className="max-w-2xl">
              <p className="eyebrow">To add</p>
              <p className="mt-3 text-lg leading-relaxed text-fg/75">{b.hint}</p>
            </div>
            {b.example && (
              <Link
                href={b.example}
                className="inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-full border border-line px-5 font-medium transition-colors hover:border-fg/30 md:self-auto"
              >
                See it in Quick Send <span aria-hidden>→</span>
              </Link>
            )}
          </Reveal>
        </Section>
      );
    case "prototype":
      return (
        <Section id="prototype">
          <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">{b.eyebrow ?? "Interactive prototype"}</p>
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
    case "persona-cards":
    case "story-map":
    case "user-stories":
    case "priorities":
    case "objectives":
    case "themes":
    case "shortlist":
    case "double-diamond":
      return (
        <Section>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          {b.body && (
            <Reveal>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{b.body}</p>
            </Reveal>
          )}
          {b.type === "persona-cards" && <PersonaCards items={b.items} />}
          {b.type === "story-map" && <StoryMap maps={b.maps} />}
          {b.type === "user-stories" && <UserStories items={b.items} />}
          {b.type === "priorities" && <Priorities items={b.items} value={b.value} effort={b.effort} />}
          {b.type === "objectives" && <ObjectivesMatrix directions={b.directions} items={b.items} high={b.high} />}
          {b.type === "themes" && <Themes items={b.items} statuses={b.statuses} />}
          {b.type === "shortlist" && <Shortlist items={b.items} call={b.call} />}
          {b.type === "double-diamond" && <DoubleDiamond stages={b.stages} />}
          {b.type !== "double-diamond" && <More d={b.deeper} name={name} />}
        </Section>
      );
    case "personas":
      return (
        <Section>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          {b.body && (
            <Reveal>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{b.body}</p>
            </Reveal>
          )}
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
          <More d={b.deeper} name={name} />
        </Section>
      );
    case "journey-map":
      return (
        <Section>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          {b.body && (
            <Reveal>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{b.body}</p>
            </Reveal>
          )}
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
      // Without labels: the original two columns, found and so.
      if (!b.labels) {
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
                    <div className="rounded-3xl border border-line bg-fg/[0.04] p-6">
                      <span className="eyebrow not-italic">So the design had to</span>
                      <p className="mt-3 text-lg leading-snug">{it.so}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </Section>
        );
      }
      // With labels: one card per finding, read top to bottom, side by side.
      const labels = b.labels;
      return (
        <Section>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          <ol className={`mt-12 grid gap-4 sm:grid-cols-2 ${b.items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            {b.items.map((it, i) => {
              const parts = [it.found, it.so, it.then].slice(0, labels.length);
              const last = parts.length - 1;
              return (
                <Reveal key={i} delay={0.06 * i} className="h-full">
                  <li className={`flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-raised ${draftText(b.draft)}`}>
                    {parts.map((text, j) =>
                      j === last ? (
                        <div key={j} className="mt-auto bg-accent-soft p-6">
                          <span className="eyebrow not-italic">{labels[j]}</span>
                          <p className="mt-2 leading-snug font-medium">{text}</p>
                        </div>
                      ) : (
                        <div key={j} className={`p-6 ${j > 0 ? "border-t border-line" : ""}`}>
                          <span className="eyebrow not-italic">{labels[j]}</span>
                          {j === 0 && b.quotes ? (
                            <blockquote className="mt-3 text-xl leading-snug font-semibold tracking-[-0.01em]">
                              <span aria-hidden className="text-accent-ink">“</span>
                              {text}
                              <span aria-hidden className="text-accent-ink">”</span>
                            </blockquote>
                          ) : (
                            <p className={`mt-2 leading-snug ${j === 0 ? "text-lg font-semibold" : "text-fg/80"}`}>{text}</p>
                          )}
                        </div>
                      ),
                    )}
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </Section>
      );
    }
    case "callouts": {
      const withImages = b.items.some((it) => it.image?.src);
      const intro = (
        <>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          {b.body && (
            <Reveal>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg/75">{b.body}</p>
            </Reveal>
          )}
        </>
      );
      // Big statements, one per row, each with a line beside it.
      if (b.look === "statements") {
        return (
          <Section id={b.id}>
            {intro}
            <ul className="mt-12 border-b border-line md:mt-16">
              {b.items.map((it, i) => (
                <Reveal key={it.title} delay={0.05 * i}>
                  <li className="grid gap-2 border-t border-line py-6 md:grid-cols-12 md:items-baseline md:gap-10 md:py-8">
                    <h3 className="flex items-center gap-4 text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.02] font-bold tracking-[-0.035em] md:col-span-7 md:gap-6">
                      {it.icon && <IconTile name={it.icon} />}
                      {it.title}
                    </h3>
                    <p className="text-lg leading-relaxed text-fg/75 md:col-span-5">{it.body}</p>
                  </li>
                </Reveal>
              ))}
            </ul>
            <More d={b.deeper} name={name} />
          </Section>
        );
      }
      // Goals ticked off in one tinted panel.
      if (b.look === "goals") {
        return (
          <Section id={b.id}>
            {intro}
            <Reveal className="mt-12">
              <ul className="grid gap-x-8 gap-y-8 rounded-3xl bg-accent-soft p-7 sm:grid-cols-2 md:p-10 lg:grid-cols-4">
                {b.items.map((it) => (
                  <li key={it.title}>
                    <span
                      aria-hidden
                      className="flex size-9 items-center justify-center rounded-full bg-accent text-on-accent"
                    >
                      <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 8.5 6.5 12 13 4.5" />
                      </svg>
                    </span>
                    <h3 className="mt-5 text-xl leading-snug font-semibold">{it.title}</h3>
                    <p className="mt-2 leading-relaxed text-fg/75">{it.body}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
            <More d={b.deeper} name={name} />
          </Section>
        );
      }
      // What was wrong beside its fix, as a two-column table.
      if (b.look === "fixes") {
        return (
          <Section id={b.id}>
            {intro}
            <div className="mt-12 md:mt-16">
              <div aria-hidden className="hidden grid-cols-12 gap-10 pb-4 md:grid">
                <p className="eyebrow col-span-7">What was wrong</p>
                <p className="eyebrow col-span-5">The fix</p>
              </div>
              <ul className="border-b border-line">
                {b.items.map((it, i) => (
                  <Reveal key={it.title} delay={0.05 * i}>
                    <li className="grid gap-4 border-t border-line py-7 md:grid-cols-12 md:gap-10 md:py-9">
                      <div className="flex gap-5 md:col-span-7">
                        {it.icon && <IconTile name={it.icon} size="sm" />}
                        <div>
                          <h3 className="text-2xl leading-tight font-bold tracking-[-0.02em] text-balance md:text-3xl">{it.title}</h3>
                          <p className="mt-2 max-w-xl leading-relaxed text-fg/75">{it.body}</p>
                        </div>
                      </div>
                      {it.fix && (
                        <p className="flex items-start gap-3 md:col-span-5">
                          <Icon name="ArrowLongRight" className="mt-0.5 size-7 shrink-0 text-accent-ink" />
                          <span className="text-xl leading-snug font-semibold text-accent-ink md:text-2xl">
                            <span className="sr-only">The fix: </span>
                            {it.fix}
                          </span>
                        </p>
                      )}
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
            <More d={b.deeper} name={name} />
          </Section>
        );
      }
      // The heading held on the left while a plain list runs down the right.
      if (b.look === "split") {
        return (
          <Section id={b.id}>
            <div className="grid gap-10 md:grid-cols-12 md:gap-12">
              <div className="md:col-span-5">
                <div className="md:sticky md:top-28">{intro}</div>
              </div>
              <ul className="md:col-span-7">
                {b.items.map((it, i) => (
                  <Reveal key={it.title} delay={0.05 * i}>
                    <li className={`flex gap-5 py-6 md:py-7 ${i ? "border-t border-line" : "md:pt-0"}`}>
                      {it.icon && <IconTile name={it.icon} size="sm" />}
                      <div>
                        <h3 className="text-xl leading-snug font-semibold md:text-2xl">{it.title}</h3>
                        <p className="mt-2 text-lg leading-relaxed text-fg/75">{it.body}</p>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
            <More d={b.deeper} name={name} />
          </Section>
        );
      }
      // Words only: one row of short, bold cards that read at a glance.
      if (!withImages) {
        const cols = b.items.length === 4 ? "lg:grid-cols-4" : b.items.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2";
        return (
          <Section id={b.id}>
            {intro}
            <ol className={`mt-12 grid gap-4 sm:grid-cols-2 ${cols}`}>
              {b.items.map((it, i) => (
                <Reveal key={it.title} delay={0.06 * i} className="h-full">
                  <li className="flex h-full flex-col rounded-3xl border border-line bg-raised p-6 md:p-7">
                    <span className="font-mono text-sm text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-5 text-2xl leading-[1.05] font-bold tracking-[-0.03em] text-balance md:text-[1.75rem]">{it.title}</h3>
                    <p className="mt-3 leading-relaxed text-fg/75">{it.body}</p>
                    {it.fix && (
                      <p className="mt-auto pt-6">
                        <span className="block border-t border-line pt-4">
                          <span className="eyebrow block">The fix</span>
                          <span className="mt-1 block text-lg leading-snug font-semibold text-accent-ink">{it.fix}</span>
                        </span>
                      </p>
                    )}
                  </li>
                </Reveal>
              ))}
            </ol>
            <More d={b.deeper} name={name} />
          </Section>
        );
      }
      return (
        <Section id={b.id}>
          {intro}
          <ol className="mt-14 md:mt-20">
            {b.items.map((it, i) => {
              const words = (
                <>
                  <p className="text-lg leading-relaxed text-fg/75 md:text-xl">{it.body}</p>
                  {it.fix && (
                    <p className="mt-5">
                      <span className="eyebrow block">The fix</span>
                      <span className="mt-1 block text-lg font-semibold text-accent-ink">{it.fix}</span>
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
          <More d={b.deeper} name={name} />
        </Section>
      );
    }
    case "brief":
      // One line on the page, and the brief itself a click away.
      return (
        <Section id={b.id}>
          <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-6">
              <Heading eyebrow={b.eyebrow} heading={b.heading} />
              {b.body && (
                <Reveal>
                  <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg/75">{b.body}</p>
                </Reveal>
              )}
              <Notes items={b.notes} />
            </div>
            <Reveal className="md:col-span-6">
              <BriefPreview b={b} />
            </Reveal>
          </div>
          <More d={b.deeper} name={name} />
        </Section>
      );
    case "prototypes":
      return (
        <Section>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          {b.body && (
            <Reveal>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg/75">{b.body}</p>
            </Reveal>
          )}
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {b.items.map((it, i) => {
              const links = it.links.map((l, j) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium shadow-lg transition-transform hover:scale-[1.04] ${
                    j === 0 ? "bg-fg text-bg" : "bg-bg text-fg"
                  }`}
                >
                  {it.links.length > 1 ? l.label : "Open the prototype"}
                  <ArrowTopRightOnSquareIcon aria-hidden className="size-4" />
                </a>
              ));
              return (
                <Reveal key={it.version} delay={0.06 * i} className="h-full">
                  {/* The card lifts on hover and its buttons appear over the screen. Touch screens show them below. */}
                  <li className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-raised transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_28px_50px_-24px_rgba(20,20,60,0.4)] focus-within:-translate-y-1.5">
                    {it.image.src && (
                      <div className="relative aspect-[2000/1425] border-b border-line bg-bg">
                        <Image
                          src={it.image.src}
                          alt={it.image.alt}
                          fill
                          sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                          className="object-cover object-top"
                        />
                        <div className="absolute inset-0 hidden flex-col items-center justify-center gap-2 bg-bg/25 opacity-0 backdrop-blur-[1.5px] transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:hover)]:flex">
                          {links}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <span className="font-mono text-xs text-accent-ink">Version {it.version}</span>
                      <h3 className="mt-2 text-lg leading-snug font-semibold">{it.title}</h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{it.body}</p>
                      <div className="mt-auto flex flex-wrap gap-2 pt-5 [@media(hover:hover)]:hidden">{links}</div>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ol>
          {b.note && (
            <Reveal>
              <p className="mt-6 text-sm text-muted">{b.note}</p>
            </Reveal>
          )}
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
        <Section>
          <Heading eyebrow={b.eyebrow} heading={b.heading} />
          {b.body && (
            <Reveal>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg/75">{b.body}</p>
            </Reveal>
          )}
          {/* A grid of steps. An odd one out sits centred on its own row. */}
          <ol className="mt-12 grid gap-x-6 gap-y-12 md:mt-16 md:grid-cols-2 md:gap-y-16">
            {b.items.map((it, i) => (
              <li
                key={it.title}
                className={b.items.length % 2 && i === b.items.length - 1 ? "md:col-span-2 md:mx-auto md:w-[calc(50%-0.75rem)]" : ""}
              >
                <Reveal>
                  <BrowserFrame video={it.video} compact button={false} />
                </Reveal>
                <Reveal className="mt-5">
                  <h3 className="flex items-baseline gap-3 text-2xl font-bold tracking-[-0.02em] md:text-3xl">
                    <span className="font-mono text-sm font-normal tracking-normal text-accent-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {it.title}
                  </h3>
                  <p className="mt-2 max-w-md leading-relaxed text-muted">{it.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Section>
      );
    case "flow":
      return <FlowPan b={b} after={b.notes && <Notes items={b.notes} />} />;
    case "outcome": {
      // On a surface it's a card in the page, so it reads as part of the
      // story rather than the band that closes it.
      const card = !!b.surface;
      const ink = card ? "text-white" : "text-on-tertiary";
      const soft = card ? "text-white/70" : "text-on-tertiary/60";
      const body = card ? "text-white/85" : "text-on-tertiary/75";
      const rule = card ? "border-white/25" : "border-on-tertiary/20";
      const inner = (
        <>
          <Reveal>
            {b.eyebrow && <p className={`eyebrow ${card ? "!text-white/75" : "!text-on-tertiary/70"}`}>{b.eyebrow}</p>}
            <h2 className="mt-4 text-3xl leading-tight font-semibold tracking-tight md:text-5xl">{b.heading}</h2>
          </Reveal>
          {/* Side by side: an icon, the change in a few words, then the detail. */}
          <ol
            className={`mt-10 grid gap-x-10 gap-y-10 md:mt-14 ${
              b.items.length % 3 === 0 ? "md:grid-cols-3" : "md:grid-cols-2"
            }`}
          >
            {b.items.map((it, i) => (
              <Reveal key={it.title} delay={0.06 * (i % 3)}>
                <li className={`h-full border-t ${rule} pt-8`}>
                  {it.icon ? (
                    <span
                      className={`flex size-12 items-center justify-center rounded-2xl ${card ? "bg-white/15" : "bg-on-tertiary/10"}`}
                    >
                      <Icon name={it.icon} className="size-6" />
                    </span>
                  ) : (
                    <span className={`font-mono text-sm ${soft}`}>{String(i + 1).padStart(2, "0")}</span>
                  )}
                  {it.goal && <p className={`eyebrow mt-6 ${card ? "!text-white/70" : "!text-on-tertiary/60"}`}>{it.goal}</p>}
                  <p className={`${it.goal ? "mt-2" : "mt-6"} text-2xl leading-[1.2] font-semibold tracking-tight text-balance md:text-[1.75rem]`}>
                    {it.title}
                  </p>
                  <p className={`mt-4 text-lg leading-relaxed ${body}`}>{it.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          {b.stats && (
            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              {b.stats.map((st) => (
                <div key={st.label} className={`flex flex-col-reverse justify-end gap-3 rounded-3xl p-7 ${card ? "bg-white/10" : "bg-on-tertiary/[0.08]"}`}>
                  <dt className={body}>{st.label}</dt>
                  <dd className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-bold tracking-[-0.04em] tabular-nums">{st.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {b.todo && <p className={`mt-12 border-t ${rule} pt-6 ${soft} italic`}>{b.todo}</p>}
        </>
      );
      if (card) {
        return (
          <section className="border-t border-line py-20 md:py-28">
            <div className="container-x">
              <div className={`rounded-[1.75rem] px-6 py-12 sm:px-10 md:rounded-panel md:px-16 md:py-20 ${ink}`} style={{ background: b.surface }}>
                {inner}
              </div>
            </div>
          </section>
        );
      }
      return (
        <section className={`bg-tertiary py-24 md:py-36 ${ink}`}>
          <div className="container-x">{inner}</div>
        </section>
      );
    }
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
          {b.deeper && (
            <div className="container-x">
              <More d={b.deeper} name={name} />
            </div>
          )}
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
  const inPanel = useInPanel();
  return (
    <section
      id={id}
      className={`scroll-mt-16 border-t border-line ${inPanel ? "py-10 first:border-t-0 md:py-14" : "py-20 md:py-28"}`}
    >
      <div className="container-x">{children}</div>
    </section>
  );
}

function Heading({ eyebrow, heading }: { eyebrow?: string; heading: string }) {
  const inPanel = useInPanel();
  return (
    <Reveal>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={`mt-4 max-w-3xl leading-tight font-semibold tracking-tight ${inPanel ? "text-2xl md:text-4xl" : "text-3xl md:text-5xl"}`}>
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

/** Linear's mark, beside a quote from Linear. */
function LinearMark() {
  return (
    <span aria-hidden className="mt-1 flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#08090a] text-white shadow-md">
      <svg viewBox="0 0 100 100" className="size-5" fill="currentColor">
        <path d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857L39.3342 97.1782c.6889.6889.0915 1.8189-.857 1.5964C20.0515 94.4522 5.54779 79.9485 1.22541 61.5228ZM.00189135 46.8891c-.01764375.2833.08887215.5599.28957165.7606L52.3503 99.7085c.2007.2007.4773.3075.7606.2896 2.3692-.1476 4.6938-.46 6.9624-.9259.7645-.157 1.0301-1.0963.4782-1.6481L2.57595 39.4485c-.55186-.5519-1.49117-.2863-1.648174.4782-.465915 2.2686-.77832 4.5932-.92588465 6.9624ZM4.21093 29.7054c-.16649.3738-.08169.8106.20765 1.1l64.77602 64.776c.2894.2894.7262.3742 1.1.2077 1.7861-.7956 3.5171-1.6927 5.1855-2.684.5521-.328.6373-1.0867.1832-1.5407L8.43566 24.3367c-.45409-.4541-1.21271-.3689-1.54074.1832-.99132 1.6684-1.88843 3.3994-2.68399 5.1855ZM12.6587 18.074c-.3701-.3701-.393-.9637-.0443-1.3541C21.7795 6.45931 35.1114 0 49.9519 0 77.5927 0 100 22.4073 100 50.0481c0 14.8405-6.4593 28.1724-16.7199 37.3375-.3903.3487-.984.3258-1.3542-.0443L12.6587 18.074Z" />
      </svg>
    </span>
  );
}
