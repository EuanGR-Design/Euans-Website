import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { cardInfo, eras, getProject, pageProjects, projectHref, projectImage, type Project } from "@/projects";
import { Blocks } from "@/components/Blocks";
import { ProjectLink } from "@/components/ProjectTransition";

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

  return (
    <article>
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
          <h1 className="mt-4 text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.98] font-semibold tracking-[-0.04em]">
            {p.title}
          </h1>
          {p.statement ? (
            <StoryHeader p={p} />
          ) : (
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
          )}
        </div>
        {hero?.src && (
          <div className="container-x mt-14 md:mt-20">
            {/* The title card shrinks into this when the project opens. */}
            <div
              data-hero={p.slug}
              className="relative overflow-hidden rounded-3xl bg-raised"
              style={{ aspectRatio: `${hero.w} / ${hero.h}` }}
            >
              <Image src={hero.src} alt={hero.alt} fill priority sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover object-top" />
            </div>
            {p.scrollCue && (
              <a
                href="#story"
                className="group mx-auto mt-10 flex w-fit flex-col items-center gap-3 text-muted transition-colors hover:text-fg md:mt-14"
              >
                <span className="text-lg md:text-xl">{p.scrollCue}</span>
                <span
                  aria-hidden
                  className="flex size-11 animate-bounce items-center justify-center rounded-full border border-line text-lg group-hover:border-fg/30 motion-reduce:animate-none"
                >
                  ↓
                </span>
              </a>
            )}
          </div>
        )}
      </header>

      <div id="story" className={`scroll-mt-16 ${p.scrollCue ? "mt-10 md:mt-14" : "mt-20 md:mt-28"}`}>
        <Blocks blocks={p.blocks} name={p.title} />
      </div>

      <nav aria-label="Next project" className="border-t border-line py-20 md:py-28">
        <div className="container-x">
          <p className="eyebrow">Next project</p>
          <ProjectLink card={cardInfo(next)} href={projectHref(next)} className="group mt-4 inline-block">
            <span className="text-[clamp(2rem,6vw,4.5rem)] leading-none font-semibold tracking-[-0.03em] transition-colors group-hover:text-accent-ink">
              {next.title} <span aria-hidden>→</span>
            </span>
            <span className="mt-3 block text-lg text-muted">{nextLine}</span>
          </ProjectLink>
        </div>
      </nav>
    </article>
  );
}

/**
 * The opening of a case study told as a story: the problem as one big
 * statement, my role, where the work sat, and what it achieved.
 */
function StoryHeader({ p }: { p: Project }) {
  return (
    <>
      <p className="mt-10 max-w-5xl text-[clamp(1.75rem,3.6vw,3.25rem)] leading-[1.08] font-semibold tracking-[-0.03em] text-balance md:mt-14">
        {p.statement}
      </p>
      {p.roleStatement && (
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-fg/75 md:text-xl">{p.roleStatement}</p>
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
