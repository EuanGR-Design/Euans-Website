import Link from "next/link";
import { stages, type Stage } from "@/process";
import { getProject } from "@/projects";

const stageHref = (s: Stage) => `/work/legalesign/${s.id}`;

/** The four stages as cards, each leading to its page. */
export function StagePath() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stages.map((s, i) => (
        <li key={s.id}>
          <Link
            href={stageHref(s)}
            className="group flex h-full flex-col justify-between gap-10 rounded-3xl border border-accent/40 bg-accent-soft p-6 transition-colors hover:border-accent"
          >
            <div>
              <span className="font-mono text-xs text-accent">
                0{i + 1} · {s.label}
              </span>
              <p className="mt-5 text-xl leading-snug font-semibold">{s.question}</p>
            </div>
            <span className="flex items-center justify-between text-sm text-muted">
              {getProject(s.project)?.title}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1 group-hover:text-fg">
                →
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

/** Where this page sits among the four stages. */
export function StageStepper({ current }: { current: Stage["id"] }) {
  return (
    <nav aria-label="Stages">
      <ol className="flex flex-wrap gap-2">
        {stages.map((s, i) => {
          const on = s.id === current;
          return (
            <li key={s.id}>
              <Link
                href={stageHref(s)}
                aria-current={on ? "page" : undefined}
                className={`inline-flex rounded-full border px-4 py-2 font-mono text-xs transition-colors ${
                  on ? "border-accent bg-accent text-white" : "border-line text-muted hover:text-fg"
                }`}
              >
                0{i + 1} {s.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Previous and next stage, so the pages read as one journey. */
export function StagePager({ current }: { current: Stage["id"] }) {
  const i = stages.findIndex((s) => s.id === current);
  const prev = stages[i - 1];
  const next = stages[i + 1];
  return (
    <nav aria-label="Previous and next stage" className="border-t border-line py-16 md:py-24">
      <div className="container-x grid gap-10 md:grid-cols-2">
        <div>
          <p className="eyebrow">{prev ? "Previous stage" : "Back to"}</p>
          <Link
            href={prev ? stageHref(prev) : "/work/legalesign"}
            className="mt-3 inline-block text-2xl font-semibold tracking-tight transition-colors hover:text-accent md:text-4xl"
          >
            <span aria-hidden>←</span> {prev ? prev.headline : "Console overview"}
          </Link>
        </div>
        <div className="md:text-right">
          <p className="eyebrow">{next ? "Next stage" : "Back to"}</p>
          <Link
            href={next ? stageHref(next) : "/work/legalesign"}
            className="mt-3 inline-block text-2xl font-semibold tracking-tight transition-colors hover:text-accent md:text-4xl"
          >
            {next ? next.headline : "Console overview"} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
