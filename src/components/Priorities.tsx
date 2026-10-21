import type { Block } from "@/projects";

type Item = Extract<Block, { type: "priorities" }>["items"][number];

/**
 * A ranked list of opportunities, each with its value and effort as bars on
 * the same scale, so quick wins (long value, short effort) stand out without
 * reading the numbers.
 */
export function Priorities({ items }: { items: Item[] }) {
  const max = Math.max(...items.flatMap((i) => [i.value, i.effort]));
  return (
    <div className="mt-12 overflow-hidden rounded-3xl border border-line bg-raised">
      <div className="hidden grid-cols-[2.5rem_minmax(0,1fr)_9rem_9rem_5.5rem] gap-4 border-b border-line px-6 py-3 md:grid">
        <span className="eyebrow">#</span>
        <span className="eyebrow">Direction</span>
        <span className="eyebrow">Value</span>
        <span className="eyebrow">Effort</span>
        <span />
      </div>
      <ol>
        {items.map((it, i) => (
          <li
            key={it.title}
            className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 border-b border-line px-5 py-4 last:border-b-0 md:grid-cols-[2.5rem_minmax(0,1fr)_9rem_9rem_5.5rem] md:px-6"
          >
            <span className="text-sm text-muted tabular-nums">{i + 1}</span>
            <span className="font-medium">{it.title}</span>
            <span className="justify-self-end md:order-last">
              {it.shipped && (
                <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-on-accent">Shipped</span>
              )}
            </span>
            <Bar label="Value" n={it.value} max={max} strong />
            <Bar label="Effort" n={it.effort} max={max} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function Bar({ label, n, max, strong }: { label: string; n: number; max: number; strong?: boolean }) {
  return (
    <span className="col-span-3 col-start-2 flex items-center gap-3 text-xs md:col-span-1 md:col-start-auto">
      <span className="w-10 text-muted md:sr-only">{label}</span>
      <span className="h-2 flex-1 overflow-hidden rounded-full bg-line" aria-hidden>
        <span className={`block h-full rounded-full ${strong ? "bg-accent" : "bg-fg/40"}`} style={{ width: `${(n / max) * 100}%` }} />
      </span>
      <span className="w-5 text-right tabular-nums">{n}</span>
    </span>
  );
}
