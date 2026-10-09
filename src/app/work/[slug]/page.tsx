import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eras, getProject, liveProjects } from "@/projects";
import { Blocks } from "@/components/Blocks";
import { Cover } from "@/components/ProjectCard";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return liveProjects.map((p) => ({ slug: p.slug }));
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
  const i = liveProjects.indexOf(p);
  const next = liveProjects[(i + 1) % liveProjects.length];

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
                    <span key={t} className="rounded-full bg-accent-soft px-3 py-1 text-xs text-fg/85">
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        {p.cover && (
          <div className="container-x mt-14 md:mt-20">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-raised md:rounded-3xl">
              <Cover p={p} priority />
            </div>
          </div>
        )}
      </header>

      <div className="mt-20 md:mt-28">
        <Blocks project={p} />
      </div>

      <nav aria-label="Next project" className="border-t border-line py-20 md:py-28">
        <div className="container-x">
          <p className="eyebrow">Next project</p>
          <Link href={`/work/${next.slug}`} className="group mt-4 inline-block">
            <span className="text-[clamp(2rem,6vw,4.5rem)] leading-none font-semibold tracking-[-0.03em] transition-colors group-hover:text-accent">
              {next.title} <span aria-hidden>→</span>
            </span>
            <span className="mt-3 block text-muted">{next.summary}</span>
          </Link>
        </div>
      </nav>
    </article>
  );
}
