import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStage, stages } from "@/process";
import { getProject } from "@/projects";
import { Blocks } from "@/components/Blocks";
import { StagePager, StageStepper } from "@/components/Stages";

type Props = { params: Promise<{ stage: string }> };

export function generateStaticParams() {
  return stages.map((s) => ({ stage: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getStage((await params).stage);
  if (!s) return {};
  return { title: `${s.headline} — Euan Robertson`, description: s.approach };
}

export default async function StagePage({ params }: Props) {
  const s = getStage((await params).stage);
  if (!s) notFound();
  const p = getProject(s.project);
  if (!p) throw new Error(`Stage "${s.id}" points at "${s.project}", which has no project page.`);
  const n = stages.indexOf(s) + 1;

  return (
    <article>
      <header className="pt-32 md:pt-44">
        <div className="container-x">
          <Link
            href="/work/legalesign"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
          >
            <span aria-hidden>←</span> Console overview
          </Link>
          <div className="mt-8">
            <StageStepper current={s.id} />
          </div>

          {s.result && (
            <div className="mt-14">
              <p
                className={`text-[clamp(4rem,14vw,10rem)] leading-none font-semibold tracking-[-0.05em] tabular-nums ${
                  s.result.draft ? "text-muted" : "text-accent-ink"
                }`}
              >
                {s.result.value}
              </p>
              <p className={`mt-4 max-w-xl text-lg ${s.result.draft ? "text-muted italic" : "text-fg/80"}`}>
                {s.result.label}
              </p>
            </div>
          )}

          <p className="eyebrow mt-14">
            Stage {n} of {stages.length} · {s.label}
          </p>
          <h1 className="mt-4 text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.98] font-semibold tracking-[-0.04em]">
            {s.headline}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-fg/80 md:text-xl">{s.approach}</p>

          <dl className="mt-14 grid gap-6 border-t border-line pt-8 text-sm sm:grid-cols-2 md:grid-cols-12">
            <div className="md:col-span-3">
              <dt className="eyebrow">Project</dt>
              <dd className="mt-1">
                <Link href={`/work/${p.slug}`} className="underline underline-offset-4 hover:text-accent-ink">
                  {p.title}
                </Link>
              </dd>
            </div>
            <div className="sm:col-span-2 md:col-span-5">
              <dt className="eyebrow">The problem</dt>
              <dd className="mt-1 leading-relaxed">{s.problem}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="eyebrow">Role</dt>
              <dd className="mt-1">{p.role}</dd>
            </div>
            {p.year && (
              <div className="md:col-span-2">
                <dt className="eyebrow">When</dt>
                <dd className="mt-1">{p.year}</dd>
              </div>
            )}
          </dl>

          <p className="mt-10 max-w-2xl border-l-2 border-accent pl-4 leading-relaxed text-fg/80">{s.why}</p>
        </div>
      </header>

      <div className="mt-20 md:mt-28">
        <Blocks blocks={s.blocks} name={p.title} />
      </div>

      <section className="border-t border-line py-16 md:py-20">
        <div className="container-x">
          <Link
            href={`/work/${p.slug}`}
            className="group flex flex-col justify-between gap-6 rounded-3xl bg-accent p-8 text-on-accent md:flex-row md:items-center md:p-10"
          >
            <div>
              <p className="font-mono text-xs tracking-[0.14em] text-on-accent/70 uppercase">See the final outcome</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight md:text-4xl">What {p.title} became</p>
            </div>
            <span className="inline-flex items-center gap-2 self-start rounded-full bg-on-accent px-5 py-2.5 text-sm font-medium text-accent md:self-auto">
              View project <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </div>
      </section>

      <StagePager current={s.id} />
    </article>
  );
}
