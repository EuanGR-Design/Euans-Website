import { ArrowRightIcon, ArrowUturnLeftIcon } from "@heroicons/react/20/solid";
import type { Block } from "@/projects";
import { Reveal } from "./motion";

type Map = Extract<Block, { type: "logic-map" }>;
type Matrix = Extract<Block, { type: "state-matrix" }>;

/**
 * A feature's architecture as levels you drill into, left to right, each
 * listing what lives there and what it opens. The ways back out sit
 * underneath, so the round trip reads as one picture.
 */
export function LogicMap({ modes, levels, out, note }: Pick<Map, "modes" | "levels" | "out" | "note">) {
  const cols = `repeat(${levels.length}, minmax(0, 1fr))`;
  return (
    <div className="mt-12">
      {modes && (
        <ul className="mb-4 grid gap-4 sm:grid-cols-2 lg:mb-6">
          {modes.map((m, i) => (
            <Reveal key={m.label} delay={0.06 * i} className="h-full">
              <li className="h-full rounded-3xl bg-fg p-6 text-bg">
                <p className="text-lg font-semibold">{m.label}</p>
                <p className="mt-1 leading-relaxed opacity-75">{m.body}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      )}
      <ol className="grid gap-4 lg:gap-10 lg:[grid-template-columns:var(--cols)]" style={{ "--cols": cols } as React.CSSProperties}>
        {levels.map((l, i) => (
          <Reveal key={l.name} delay={0.08 * i} className="relative h-full">
            <li className="flex h-full flex-col rounded-3xl border border-line bg-raised p-6">
              <span className="font-mono text-sm text-accent-ink">Level {i + 1}</span>
              <h3 className="mt-3 text-2xl leading-tight font-bold tracking-[-0.03em]">{l.name}</h3>
              <p className="mt-2 leading-relaxed text-muted">{l.note}</p>
              <ul className="mt-6 space-y-2">
                {l.items.map((it) => (
                  <li key={it.label} className="rounded-xl border border-line bg-bg px-4 py-3 text-sm">
                    <span className="font-semibold">{it.label}</span>
                    {it.opens && (
                      <span className="mt-0.5 flex items-center gap-1.5 text-muted">
                        <ArrowRightIcon className="size-3.5 shrink-0 text-accent-ink" aria-hidden />
                        {it.opens}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </li>
            {i < levels.length - 1 && (
              <span
                aria-hidden
                className="absolute top-1/2 -right-8 z-10 hidden size-6 -translate-y-1/2 items-center justify-center rounded-full bg-fg text-bg lg:flex"
              >
                <ArrowRightIcon className="size-4" />
              </span>
            )}
          </Reveal>
        ))}
      </ol>
      <Reveal>
        <div className="mt-4 rounded-3xl border border-dashed border-line p-6 lg:mt-6">
          <p className="eyebrow flex items-center gap-2">
            <ArrowUturnLeftIcon className="size-4 text-accent-ink" aria-hidden />
            Drilling back out
          </p>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {out.map((o) => (
              <li key={o.label}>
                <p className="font-semibold">{o.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{o.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      {note && <p className="mt-4 text-sm text-muted">{note}</p>}
    </div>
  );
}

const tones = {
  warn: "bg-[color-mix(in_srgb,#f5a524_14%,transparent)]",
  block: "bg-[color-mix(in_srgb,#e5484d_12%,transparent)]",
};
const dots = { warn: "bg-[#f5a524]", block: "bg-[#e5484d]" };

/**
 * Every part of a feature against every state it can be in. Reading across
 * a row shows one part's whole life; reading down a column shows everything
 * that can, say, stop a send. Dashes are states a part can't reach.
 */
export function StateMatrix({ columns, rows, note }: Pick<Matrix, "columns" | "rows" | "note">) {
  const cols = `minmax(9rem,0.8fr) repeat(${columns.length}, minmax(9rem,1fr))`;
  return (
    <Reveal>
      <div className="mt-12 overflow-x-auto rounded-3xl border border-line bg-raised" tabIndex={0}>
        <div role="table" aria-label="Parts of a send against their states" className="min-w-[56rem]">
          <div role="row" className="grid gap-3 border-b border-line px-6 py-4" style={{ gridTemplateColumns: cols }}>
            <span role="columnheader" className="eyebrow sticky left-0 z-10 -ml-6 bg-raised pl-6">
              Part of the send
            </span>
            {columns.map((c) => (
              <span role="columnheader" key={c.name} className="flex items-center gap-2 text-sm leading-tight font-semibold">
                {c.tone && <span className={`size-2 shrink-0 rounded-full ${dots[c.tone]}`} aria-hidden />}
                {c.name}
              </span>
            ))}
          </div>
          {rows.map((r) => (
            <div
              role="row"
              key={r.name}
              className="grid gap-3 border-b border-line px-6 text-sm last:border-b-0"
              style={{ gridTemplateColumns: cols }}
            >
              <span role="rowheader" className="sticky left-0 z-10 -ml-6 bg-raised py-3.5 pl-6 font-semibold">
                {r.name}
              </span>
              {r.cells.map((c, i) => {
                const tone = columns[i].tone;
                return (
                  <span
                    role="cell"
                    key={i}
                    className={`my-1.5 rounded-lg px-2.5 py-2 leading-snug ${c ? (tone ? tones[tone] : "") : "text-muted"}`}
                  >
                    {c ?? <span aria-label="Not applicable">–</span>}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {note && <p className="mt-4 text-sm text-muted">{note}</p>}
    </Reveal>
  );
}
