import type { Block } from "@/projects";
import { Status } from "./Status";

type B = Extract<Block, { type: "priorities" }>;
type Item = B["items"][number];
type Scale = B["value"];

/**
 * A ranked list of opportunities, each with its value and effort as bars, so
 * quick wins (long value, short effort) stand out without reading the
 * numbers. Each bar is drawn against its own scale.
 */
export function Priorities({ items, value, effort }: { items: Item[]; value: Scale; effort: Scale }) {
  return (
    <div className="mt-12 overflow-hidden rounded-3xl border border-line bg-raised">
      <div className="hidden grid-cols-[2.5rem_minmax(0,1fr)_10rem_10rem_6rem] gap-4 border-b border-line px-6 py-3 md:grid">
        <span className="eyebrow">#</span>
        <span className="eyebrow">Direction</span>
        <span className="eyebrow">{value.label}</span>
        <span className="eyebrow">{effort.label}</span>
        <span />
      </div>
      <ol>
        {items.map((it, i) => (
          <li
            key={it.title}
            className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 border-b border-line px-5 py-4 last:border-b-0 md:grid-cols-[2.5rem_minmax(0,1fr)_10rem_10rem_6rem] md:px-6"
          >
            <span className="text-sm text-muted tabular-nums">{i + 1}</span>
            <span>
              <span className="font-medium">{it.title}</span>
              {it.note && <span className="block text-xs text-muted">{it.note}</span>}
            </span>
            <span className="justify-self-end md:order-last">
              <Status status={it.status} />
            </span>
            <Bar label={value.label} n={it.value} max={value.max} strong />
            <Bar label={effort.label} n={it.effort} max={effort.max} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function Bar({ label, n, max, strong }: { label: string; n?: number; max: number; strong?: boolean }) {
  if (n === undefined)
    return (
      <span className="col-span-3 col-start-2 flex items-center gap-3 text-xs text-muted md:col-span-1 md:col-start-auto">
        <span className="w-28 shrink-0 md:sr-only">{label}</span>
        Not scored
      </span>
    );
  return (
    <span className="col-span-3 col-start-2 flex items-center gap-3 text-xs md:col-span-1 md:col-start-auto">
      <span className="w-28 shrink-0 text-muted md:sr-only">{label}</span>
      <span className="h-2 flex-1 overflow-hidden rounded-full bg-line" aria-hidden>
        <span className={`block h-full rounded-full ${strong ? "bg-accent" : "bg-fg/40"}`} style={{ width: `${(n / max) * 100}%` }} />
      </span>
      <span className="w-5 text-right tabular-nums">{n}</span>
    </span>
  );
}
