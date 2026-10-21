import type { Block } from "@/projects";
import { Status } from "./Status";

type Item = Extract<Block, { type: "themes" }>["items"][number];

/** Directions sorted into themes, one card each, with where each one ended up. */
export function Themes({ items }: { items: Item[] }) {
  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2">
      {items.map((t) => (
        <div key={t.title} className="rounded-3xl border border-line bg-raised p-6 md:p-7">
          <h3 className="text-xl font-semibold">{t.title}</h3>
          <p className="mt-1 text-sm text-muted">{t.body}</p>
          <ul className="mt-5 divide-y divide-line">
            {t.directions.map((d) => (
              <li key={d.title} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                <span>{d.title}</span>
                <Status status={d.status} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
