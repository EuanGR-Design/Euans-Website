import Link from "next/link";
import { milestones } from "@/content";
import { liveProjects } from "@/projects";
import { Reveal } from "./motion";
import { ProjectCard } from "./ProjectCard";

export function Milestones() {
  return (
    <section id="journey" className="border-t border-line py-24 md:py-32">
      <div className="container-x">
        <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Milestones</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              How I got here.
            </h2>
          </div>
          <p className="max-w-sm text-muted">
            From studying product design to leading design and product, each
            step added something to how I work.
          </p>
        </Reveal>

        <ol className="mt-14 border-t border-line">
          {milestones.map((m, i) => (
            <li key={m.title} className="border-b border-line">
              <Reveal
                delay={0.04 * i}
                className="grid gap-2 py-7 md:grid-cols-12 md:gap-8 md:py-9"
              >
                <span className="font-mono text-sm text-accent md:col-span-2">
                  {m.when}
                </span>
                <div className="md:col-span-7">
                  <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
                    {m.title}
                  </h3>
                  <p className="text-sm text-muted">{m.org}</p>
                  <p className="mt-3 max-w-xl leading-relaxed text-fg/75">
                    {m.body}
                  </p>
                </div>
                <div className="md:col-span-3 md:text-right">
                  {m.link && (
                    <Link
                      href={m.link.href}
                      className="mt-2 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm transition-colors hover:bg-fg hover:text-bg"
                    >
                      {m.link.label} <span aria-hidden>→</span>
                    </Link>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function FeaturedWork() {
  const featured = liveProjects.filter((p) => p.featured);
  return (
    <section className="border-t border-line py-24 md:py-32">
      <div className="container-x">
        <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              A few highlights.
            </h2>
          </div>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 self-start rounded-full border border-line px-5 py-2.5 text-sm transition-colors hover:bg-fg hover:text-bg md:self-auto"
          >
            All projects <span aria-hidden>→</span>
          </Link>
        </Reveal>
        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={0.06 * (i % 2)}>
              <ProjectCard p={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
