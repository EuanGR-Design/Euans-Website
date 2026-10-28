import { Fragment } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import type { Block } from "@/projects";
import { Reveal } from "./motion";

type Props = Pick<Extract<Block, { type: "skeleton" }>, "screens" | "notes">;
type Screen = Props["screens"][number];
type Mark = keyof NonNullable<Screen["marks"]>;

/** A numbered pin that ties a part of a screen to a note below. */
function Pin({ n }: { n?: number }) {
  if (!n) return null;
  return (
    <span className="absolute -top-2 -right-2 z-10 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow">
      {n}
    </span>
  );
}

const bar = "h-1.5 rounded-full bg-fg/15";

/** One grey-box screen: breadcrumbs and the to-do list above, rows in the middle, actions below. */
function Frame({ s }: { s: Screen }) {
  const m = (k: Mark) => s.marks?.[k];
  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-raised p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-line pb-2">
        <div className="relative flex min-w-0 flex-wrap items-center gap-1 text-[10px] text-muted">
          {s.crumbs.map((c, i) => (
            <Fragment key={c}>
              {i > 0 && <span aria-hidden>/</span>}
              <span className={i === s.crumbs.length - 1 ? "font-semibold text-fg" : ""}>{c}</span>
            </Fragment>
          ))}
          <Pin n={m("crumbs")} />
        </div>
        <span className="relative flex h-5 w-8 shrink-0 items-center justify-center rounded-md border border-dashed border-fg/30 text-[9px] text-muted">
          To do
          <Pin n={m("todo")} />
        </span>
      </div>
      <p className="mt-3 text-sm font-semibold">{s.name}</p>
      <div className="mt-2 flex flex-1 gap-2">
        <ul className="relative flex flex-1 flex-col gap-1.5">
          {s.rows.map((r) => (
            <li key={r.label} className="flex items-center gap-2 rounded-lg border border-line bg-bg px-2 py-1.5">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[10px] font-medium">{r.label}</span>
                {r.status ? (
                  <span
                    className={`mt-0.5 inline-block rounded-full px-1.5 text-[8px] font-medium ${
                      r.status === "ready" ? "bg-fg/10 text-muted" : "bg-accent-soft text-accent-ink"
                    }`}
                  >
                    {r.status === "ready" ? "Ready" : "Preparation required"}
                  </span>
                ) : (
                  <span className={`mt-1 block w-2/3 ${bar}`} />
                )}
              </span>
              {r.status === "prepare" && <span className="h-3.5 w-9 shrink-0 rounded bg-fg/70" aria-hidden />}
            </li>
          ))}
          <Pin n={m("rows")} />
        </ul>
        {s.panel && (
          <div className="relative w-2/5 shrink-0 rounded-lg border border-dashed border-fg/30 p-2">
            <p className="text-[9px] font-semibold text-muted">Details</p>
            <span className={`mt-2 block w-full ${bar}`} />
            <span className={`mt-1.5 block w-4/5 ${bar}`} />
            <span className="mt-2 block h-8 rounded bg-fg/10" />
            <span className={`mt-2 block w-full ${bar}`} />
            <span className={`mt-1.5 block w-3/5 ${bar}`} />
            <Pin n={m("panel")} />
          </div>
        )}
      </div>
      <div className="relative mt-3 flex items-center justify-between gap-2 border-t border-line pt-2 text-[9px]">
        <span className="flex gap-1">
          {s.secondary.map((a) => (
            <span key={a} className="rounded-md border border-line px-1.5 py-0.5 text-muted">
              {a}
            </span>
          ))}
        </span>
        <span className="rounded-md bg-fg px-2 py-0.5 font-semibold text-bg">{s.primary}</span>
        <Pin n={m("actions")} />
      </div>
    </div>
  );
}

/**
 * A low-fidelity pass at a flow: grey-box screens side by side, joined by
 * the moves between them, with numbered pins on the parts that every screen
 * shares and a note for each pin underneath.
 */
export function Skeleton({ screens, notes }: Props) {
  return (
    <div className="mt-12">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
        {screens.map((s, i) => (
          <Fragment key={s.name}>
            <Reveal delay={0.1 * i} className="h-full">
              <Frame s={s} />
            </Reveal>
            {i < screens.length - 1 && (
              <div className="flex items-center justify-center gap-4 py-1 text-[11px] text-muted lg:flex-col lg:gap-2 lg:py-0">
                <span className="flex items-center gap-1">
                  {s.next ?? "Open"}
                  <ArrowRightIcon className="size-3.5 rotate-90 text-accent-ink lg:rotate-0" aria-hidden />
                </span>
                <span className="flex items-center gap-1">
                  <ArrowLeftIcon className="size-3.5 rotate-90 lg:rotate-0" aria-hidden />
                  {s.back ?? "Back"}
                </span>
              </div>
            )}
          </Fragment>
        ))}
      </div>
      <ol className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((n, i) => (
          <Reveal key={n.title} delay={0.04 * i}>
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">{i + 1}</span>
              <div>
                <p className="font-semibold">{n.title}</p>
                <p className="mt-1 leading-relaxed text-muted">{n.body}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
