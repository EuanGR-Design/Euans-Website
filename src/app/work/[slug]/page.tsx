import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { cardInfo, eras, getProject, pageProjects, projectHref, projectImage, sectionLinks, type Project } from "@/projects";
import { Blocks } from "@/components/Blocks";
import { ProjectLink } from "@/components/ProjectTransition";
import { SectionNav } from "@/components/SectionNav";
import { Icon } from "@/components/Icon";
import { HeroPrototype, PlayLink } from "@/components/HeroPrototype";
import { LoopVideo } from "@/components/LoopVideo";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import { basePath } from "@/lib/basePath";

const titleClass = "mt-4 text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.98] font-semibold tracking-[-0.04em]";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return pageProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return { title: `${p.title} — Euan Robertson`, description: p.summary };
}

export default async function ProjectPage({ params }: Props) {
  const p = getProject((await params).slug);
  if (!p) notFound();

  const era = eras.find((e) => e.id === p.era);
  const i = pageProjects.indexOf(p);
  const next = (p.next && getProject(p.next.slug)) || pageProjects[(i + 1) % pageProjects.length];
  const nextLine = p.next && next.slug === p.next.slug ? p.next.label : next.summary;
  const hero = projectImage(p);
  const nextImage = projectImage(next);
  const nextTitle = "mt-4 text-[clamp(2rem,6vw,4.5rem)] leading-none font-semibold tracking-[-0.03em]";
  // A headless grid of clips sits tight under the hero, as one run of images.
  const first = p.blocks[0];
  const leadsWithClips = first?.type === "bento" && !first.heading;
  const sections = sectionLinks(p);

  return (
    <article className={sections.length >= 3 ? "has-toc" : undefined}>
      <header className="pt-32 md:pt-44">
        <div className="container-x">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
          >
            <span aria-hidden>←</span> All projects
          </Link>
          <p className="eyebrow mt-10">
            {era?.label}
            {p.year && ` · ${p.year}`}
          </p>
          {p.statement ? (
            <StoryHeader p={p} />
          ) : (
          <>
          <h1 className={titleClass}>{p.title}</h1>
          <div className="mt-8 grid gap-10 md:grid-cols-12">
            <p className="text-lg leading-relaxed text-fg/80 md:col-span-7 md:text-xl">{p.intro}</p>
            <dl className="grid grid-cols-2 gap-6 text-sm md:col-span-4 md:col-start-9 md:grid-cols-1">
              <div>
                <dt className="eyebrow">Role</dt>
                <dd className="mt-1">{p.role}</dd>
              </div>
              {p.year && (
                <div>
                  <dt className="eyebrow">When</dt>
                  <dd className="mt-1">{p.year}</dd>
                </div>
              )}
              <div className="col-span-2 md:col-span-1">
                <dt className="eyebrow">Focus</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full bg-fg/[0.06] px-3 py-1 text-xs font-medium text-fg/80">
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
          </>
          )}
        </div>
        {hero?.src && (
          <div className="container-x mt-14 md:mt-20">
            {/* The title card shrinks into this when the project opens. */}
            <div
              data-hero={p.slug}
              className="relative overflow-hidden rounded-[1.75rem] md:rounded-panel bg-raised"
              style={{ aspectRatio: `${hero.w} / ${hero.h}` }}
            >
              <Image src={hero.src} alt={hero.alt} fill priority sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover object-top" />
              {p.heroLoop && <HeroLoop loop={p.heroLoop} />}
              {p.play && <HeroPrototype play={p.play} image={hero} title={p.title} />}
            </div>
            {p.scrollCue && (
              <a
                href="#story"
                className="group mx-auto mt-10 flex w-fit flex-col items-center gap-3 text-muted transition-colors hover:text-fg md:mt-14"
              >
                <span className="text-lg md:text-xl">{p.scrollCue}</span>
                <span
                  aria-hidden
                  className="flex size-11 items-center justify-center rounded-full border border-line text-lg transition-colors group-hover:border-fg/30"
                >
                  ↓
                </span>
              </a>
            )}
          </div>
        )}
      </header>

      <div
        id="story"
        className={`scroll-mt-16 ${leadsWithClips ? "mt-5 md:mt-6" : p.scrollCue ? "mt-10 md:mt-14" : "mt-20 md:mt-28"}`}
      >
        <Blocks blocks={p.blocks} name={p.title} />
      </div>

      <nav aria-label="Next project" className="border-t border-line py-20 md:py-28">
        <div className="container-x grid items-center gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7">
            <p className="eyebrow">Next project</p>
            {nextImage?.src ? (
              <p className={nextTitle}>
                {next.title} <span aria-hidden>→</span>
              </p>
            ) : (
              <ProjectLink card={cardInfo(next)} href={projectHref(next)} className={`block ${nextTitle} transition-colors hover:text-accent-ink`}>
                {next.title} <span aria-hidden>→</span>
              </ProjectLink>
            )}
            <p className="mt-3 text-lg text-muted">{nextLine}</p>
          </div>
          {/* Only the image is the link. It lifts on hover, and the card
              grows from it when clicked. */}
          {nextImage?.src && (
            <ProjectLink
              card={cardInfo(next)}
              href={projectHref(next)}
              aria-label={`Next project: ${next.title}`}
              data-cover
              className="relative block max-w-sm overflow-hidden rounded-3xl bg-raised transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_28px_50px_-24px_rgba(20,20,60,0.45)] md:col-span-5 md:max-w-none"
              style={{ aspectRatio: `${nextImage.w} / ${nextImage.h}` }}
            >
              <Image src={nextImage.src} alt="" fill sizes="(min-width: 768px) 480px, 384px" className="object-cover object-top" />
            </ProjectLink>
          )}
        </div>
      </nav>
      <SectionNav links={sections} />
    </article>
  );
}

/**
 * The finished product playing in a browser window on the hero's blue panel,
 * laid out like Euan's video template. The window is sized to the recording,
 * so it fills the window with no gap, and takes most of the panel's width.
 */
function HeroLoop({ loop }: { loop: NonNullable<Project["heroLoop"]> }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #5185ff, #4456f6)" }}>
      <div className="w-[90%] overflow-hidden rounded-[clamp(8px,1.6vw,20px)] bg-[#f4f5f8] shadow-[0_18px_40px_-10px_rgba(0,0,0,0.3)] ring-2 ring-[#79adfc]">
        {/* The browser's tab and address bars, from the template. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${basePath}/work/quick-send/browser-bar.svg`} alt="" width={1440} height={79} className="block h-auto w-full" />
        <div className="aspect-[1280/714]">
          <LoopVideo src={loop.src} poster={loop.poster} label={loop.label} className="block h-full w-full object-cover" wrapperClassName="h-full w-full" button={false} />
        </div>
      </div>
    </div>
  );
}

/**
 * The prototype as a picture of the hero beside the title, set at a playful
 * tilt that straightens on hover, with its label on the card, so the thing
 * to click looks like the thing you'll get.
 */
function PrototypeCard({ action, image }: { action: NonNullable<Project["actions"]>[number]; image: { src: string; w: number; h: number } }) {
  return (
    <PlayLink
      href={action.href}
      className="group relative block w-72 shrink-0 rotate-3 overflow-hidden rounded-3xl bg-raised shadow-[0_24px_50px_-20px_rgba(20,20,60,0.5)] transition-[rotate,translate,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_32px_60px_-22px_rgba(20,20,60,0.55)] max-md:ml-2 md:mb-2 lg:w-[22rem]"
    >
      <span className="block" style={{ aspectRatio: `${image.w} / ${image.h}` }}>
        <Image src={image.src} alt="" fill sizes="352px" className="object-cover object-top" />
      </span>
      <span className="absolute inset-x-3 bottom-3 flex h-11 items-center gap-2 rounded-full bg-white/95 px-4 font-medium text-[#2b3bd6] shadow-lg backdrop-blur transition-colors group-hover:bg-white">
        <Icon name={action.icon} className="size-5" />
        {action.label}
        <span aria-hidden className="ml-auto transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </PlayLink>
  );
}

/**
 * The opening of a case study told as a story: the problem as one big
 * statement, my role, where the work sat, and what it achieved.
 */
function StoryHeader({ p }: { p: Project }) {
  const role = p.roleStatement ?? p.intro;
  const hero = projectImage(p);
  const card = hero?.src ? p.actions?.find((a) => a.card) : undefined;
  const actions = p.actions?.filter((a) => a !== card);
  return (
    <>
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-12">
        <div className="min-w-0">
          <h1 className={titleClass}>{p.title}</h1>
          <p className="mt-10 max-w-[16em] text-[clamp(1.75rem,3.6vw,3.25rem)] leading-[1.08] font-semibold tracking-[-0.03em] text-balance md:mt-14">
            {p.statement}
          </p>
        </div>
        {card && hero?.src && <PrototypeCard action={card} image={{ ...hero, src: hero.src }} />}
      </div>
      {(role || !!actions?.length) && (
        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
          {role && <p className="max-w-3xl text-lg leading-relaxed text-fg/75 md:text-xl">{role}</p>}
          {!!actions?.length && (
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
              {actions.map((a, i) => {
                const external = !a.href.startsWith("#");
                const className = `group inline-flex h-12 items-center gap-2.5 rounded-full pr-5 pl-4 font-medium transition-colors ${
                  i === 0 ? "bg-fg text-bg hover:bg-fg/85" : "border border-line hover:border-fg/30"
                }`;
                const label = (
                  <>
                    <Icon name={a.icon} className="size-5" />
                    {a.label}
                  </>
                );
                if (a.play)
                  return (
                    <PlayLink key={a.href} href={a.href} className={className}>
                      {label}
                    </PlayLink>
                  );
                return (
                  <a
                    key={a.href}
                    href={a.href}
                    {...(external && { target: "_blank", rel: "noreferrer" })}
                    className={className}
                  >
                    {label}
                    {external && <ArrowUpRightIcon aria-hidden className="ml-auto size-4 opacity-60" />}
                    {external && <span className="sr-only">(opens in a new tab)</span>}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      )}
      {p.context && (
        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-6 md:grid-cols-4">
          {p.context.map((c) => (
            <div key={c.label}>
              <dt className="eyebrow">{c.label}</dt>
              <dd className="mt-2 text-lg leading-snug font-semibold tracking-[-0.01em] md:text-xl">{c.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {p.impact && (
        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          {p.impact.map((s) => (
            // The number reads first, but the label comes first in the markup.
            <div key={s.label} className="flex flex-col-reverse justify-end gap-3 rounded-3xl bg-accent-soft p-6 md:p-7">
              <dt className="text-sm leading-snug text-fg/75 md:text-base">{s.label}</dt>
              <dd className="text-[clamp(2.5rem,5vw,4rem)] leading-none font-bold tracking-[-0.04em] text-accent-ink tabular-nums">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </>
  );
}
