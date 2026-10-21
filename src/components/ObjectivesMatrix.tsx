import type { Block } from "@/projects";

type Props = Omit<Extract<Block, { type: "objectives" }>, "type" | "eyebrow" | "heading" | "body" | "deeper">;

/**
 * Shortlisted directions weighed against the product's objectives. Each
 * objective carries a weight out of 10; a dot means the direction meets it.
 * The totals underneath are what decided the order.
 */
export function ObjectivesMatrix({ directions, items, high = 8 }: Props) {
  const rows = [...items].sort((a, b) => b.weight - a.weight);
  const totals = directions.map((_, d) => {
    const met = items.filter((it) => it.meets.includes(d));
    return {
      count: met.length,
      weighted: met.reduce((n, it) => n + it.weight, 0),
      high: met.filter((it) => it.weight >= high).length,
    };
  });
  const best = Math.max(...totals.map((t) => t.weighted));
  const cols = `minmax(9rem,1fr) 3.5rem repeat(${directions.length}, minmax(5.5rem, 7rem))`;

  return (
    <div className="mt-12 overflow-x-auto rounded-3xl border border-line bg-raised" tabIndex={0}>
      <div role="table" aria-label="Directions against objectives" className="min-w-[36rem]">
        <div role="row" className="grid items-end gap-3 border-b border-line px-6 py-4" style={{ gridTemplateColumns: cols }}>
          <span role="columnheader" className="eyebrow sticky left-0 z-10 -ml-6 bg-raised pl-6">
            Objective
          </span>
          <span role="columnheader" className="eyebrow text-center">
            Weight
          </span>
          {directions.map((d, i) => (
            <span
              role="columnheader"
              key={d}
              className={`text-center text-sm leading-tight font-semibold ${totals[i].weighted === best ? "text-accent" : ""}`}
            >
              {d}
            </span>
          ))}
        </div>
        {rows.map((it) => (
          <div
            role="row"
            key={it.objective}
            className={`grid items-center gap-3 border-b border-line px-6 py-2.5 text-sm ${it.meets.length ? "" : "text-muted"}`}
            style={{ gridTemplateColumns: cols }}
          >
            <span role="cell" className="sticky left-0 z-10 -ml-6 bg-raised pl-6">
              {it.objective}
            </span>
            <span role="cell" className={`text-center tabular-nums ${it.weight >= high ? "font-semibold" : "text-muted"}`}>
              {it.weight}
            </span>
            {directions.map((d, i) => (
              <span role="cell" key={d} className="flex justify-center">
                {it.meets.includes(i) ? (
                  <span className="size-3 rounded-full bg-accent" aria-label="Meets" />
                ) : (
                  <span className="size-3 rounded-full border border-line" aria-label="Doesn't meet" />
                )}
              </span>
            ))}
          </div>
        ))}
        {(
          [
            ["Objectives met", (t) => t.count],
            [`High-value met (${high}+)`, (t) => t.high],
            ["Weighted score", (t) => t.weighted],
          ] as [string, (t: (typeof totals)[number]) => number][]
        ).map(([label, f], r) => (
          <div
            role="row"
            key={label}
            className={`grid items-center gap-3 px-6 py-3 text-sm ${r === 2 ? "bg-accent-soft font-semibold" : "border-b border-line"}`}
            style={{ gridTemplateColumns: cols }}
          >
            <span role="rowheader" className={`sticky left-0 z-10 -ml-6 pl-6 ${r === 2 ? "bg-accent-soft" : "bg-raised"}`}>
              {label}
            </span>
            <span />
            {totals.map((t, i) => (
              <span role="cell" key={directions[i]} className="text-center tabular-nums">
                {f(t)}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
