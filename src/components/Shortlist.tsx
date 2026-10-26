import type { Block } from "@/projects";

type B = Extract<Block, { type: "shortlist" }>;

/**
 * The shortlisted directions side by side, each with its scores, and the
 * one that was picked set apart, so the decision reads at a glance.
 * The call itself sits underneath.
 */
export function Shortlist({ items, call }: Pick<B, "items" | "call">) {
  return (
    <div className="mt-12">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <li
            key={it.title}
            className={`flex flex-col rounded-3xl border p-6 ${it.chosen ? "border-accent bg-accent text-on-accent" : "border-line bg-raised"}`}
          >
            <p className={`text-xs font-semibold tracking-wide uppercase ${it.chosen ? "" : "text-muted"}`}>{it.tag}</p>
            <h3 className="mt-2 text-xl leading-tight font-semibold">{it.title}</h3>
            <dl className="mt-6 grid gap-3 text-sm">
              {it.stats.map((s) => (
                <div key={s.label} className="flex items-baseline justify-between gap-3">
                  <dt className={it.chosen ? "opacity-80" : "text-muted"}>{s.label}</dt>
                  <dd className="text-lg font-semibold tabular-nums">{s.value}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
      <div className="mt-6 rounded-3xl border border-line p-6 md:p-8">
        <p className="eyebrow">The call</p>
        <p className="mt-2 max-w-3xl text-xl leading-snug font-semibold text-balance md:text-2xl">{call}</p>
      </div>
    </div>
  );
}
