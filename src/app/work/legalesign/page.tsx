import type { Metadata } from "next";
import Link from "next/link";
import { legalesign, stages } from "@/process";
import { getProject } from "@/projects";
import { Blocks } from "@/components/Blocks";
import { Reveal } from "@/components/motion";
import { StagePath } from "@/components/Stages";

export const metadata: Metadata = {
  title: "Console — Euan Robertson",
  description: "Five years rebuilding Legalesign's e-signature product, told through how I work at each stage.",
};

export default function LegalesignPage() {
  const stageFor = (slug?: string) => stages.find((s) => s.project === slug);

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
          <p className="eyebrow mt-10">{legalesign.eyebrow}</p>
          <h1 className="mt-4 text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.98] font-semibold tracking-[-0.04em]">
            {legalesign.title}
          </h1>
          <div className="mt-8 grid gap-10 md:grid-cols-12">
            <p className="text-lg leading-relaxed text-fg/80 md:col-span-7 md:text-xl">{legalesign.intro}</p>
            <dl className="grid grid-cols-2 gap-6 text-sm md:col-span-4 md:col-start-9 md:grid-cols-1">
              {legalesign.facts.map((f) => (
                <div key={f.label}>
                  <dt className="eyebrow">{f.label}</dt>
                  <dd className="mt-1">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      <div className="mt-20 md:mt-28">
        <Blocks blocks={[legalesign.problem, legalesign.comparison]} name={legalesign.title} />
      </div>

      <section id="how-i-work" className="border-t border-line py-20 md:py-28">
        <div className="container-x">
          <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">How I work</p>
              <h2 className="mt-4 max-w-3xl text-3xl leading-tight font-semibold tracking-tight md:text-5xl">
                One stage at a time, through the project that shows it best.
              </h2>
            </div>
            <p className="max-w-sm text-muted">
              Read them in order as one journey, or jump to the stage you care about.
            </p>
          </Reveal>
          <Reveal className="mt-12">
            <StagePath />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Everything I shipped</p>
            <h2 className="mt-4 max-w-3xl text-3xl leading-tight font-semibold tracking-tight md:text-5xl">
              The features I designed in Console.
            </h2>
          </Reveal>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {legalesign.shipped.map((f, i) => {
              const stage = stageFor(f.project);
              const page = f.project ? getProject(f.project) : undefined;
              const inner = (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold">{f.title}</h3>
                    {page && (
                      <span aria-hidden className="text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-fg">
                        →
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
                  {stage && (
                    <p className="mt-4 font-mono text-[11px] tracking-[0.12em] text-accent uppercase">
                      Shows {stage.label.toLowerCase()}
                    </p>
                  )}
                </>
              );
              return (
                <li key={f.title}>
                  <Reveal delay={0.04 * (i % 4)} className="h-full">
                    {page ? (
                      <Link
                        href={`/work/${page.slug}`}
                        className="group block h-full rounded-3xl border border-line bg-raised p-6 transition-colors hover:border-fg/30"
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div className="h-full rounded-3xl border border-line p-6">{inner}</div>
                    )}
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <Blocks blocks={[legalesign.remit]} name={legalesign.title} />

      <nav aria-label="Start" className="border-t border-line py-20 md:py-28">
        <div className="container-x">
          <p className="eyebrow">Start with</p>
          <Link href={`/work/legalesign/${stages[0].id}`} className="group mt-4 inline-block">
            <span className="text-[clamp(2rem,6vw,4.5rem)] leading-none font-semibold tracking-[-0.03em] transition-colors group-hover:text-accent">
              {stages[0].headline} <span aria-hidden>→</span>
            </span>
          </Link>
        </div>
      </nav>
    </article>
  );
}
