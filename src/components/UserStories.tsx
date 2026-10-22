"use client";

import { useState } from "react";
import type { UserStories as UserStoriesData } from "@/projects";

/**
 * The user stories for each persona, grouped by feature. Stories kept for the
 * MVP read at full strength; the rest are muted and marked "Later", or hidden
 * with "MVP only".
 */
export function UserStories({ items }: { items: UserStoriesData[] }) {
  const [active, setActive] = useState(0);
  const [mvpOnly, setMvpOnly] = useState(false);
  const p = items[active];
  const all = p.groups.flatMap((g) => g.stories);
  const inMvp = all.filter((s) => s.mvp).length;
  const groups = p.groups
    .map((g) => ({ ...g, stories: mvpOnly ? g.stories.filter((s) => s.mvp) : g.stories }))
    .filter((g) => g.stories.length);

  return (
    <div className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label="User stories" className="flex flex-wrap gap-2">
          {items.map((it, i) => (
            <button
              key={it.persona}
              type="button"
              role="tab"
              id={`stories-tab-${i}`}
              aria-selected={i === active}
              aria-controls="user-stories"
              onClick={() => setActive(i)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                i === active ? "border-accent bg-accent-soft font-medium" : "border-line hover:border-fg/30"
              }`}
            >
              {it.persona} <span className="text-muted">{it.label}</span>
            </button>
          ))}
        </div>
        <label className="inline-flex cursor-pointer items-center gap-3 text-sm">
          <span>MVP only</span>
          <button
            type="button"
            role="switch"
            aria-checked={mvpOnly}
            onClick={() => setMvpOnly((v) => !v)}
            className={`relative h-6 w-11 rounded-full transition-colors ${mvpOnly ? "bg-accent" : "bg-line"}`}
          >
            <span
              aria-hidden
              className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-bg shadow transition-transform ${mvpOnly ? "translate-x-5" : ""}`}
            />
          </button>
        </label>
      </div>

      <p className="mt-5 text-sm text-muted">
        {all.length} stories across {p.groups.length} features. <span className="font-medium text-fg">{inMvp} made the MVP.</span>
      </p>

      <div
        id="user-stories"
        role="tabpanel"
        aria-labelledby={`stories-tab-${active}`}
        className="mt-4 columns-1 gap-4 md:columns-2 lg:columns-3"
      >
        {groups.map((g) => {
          const kept = g.stories.some((s) => s.mvp);
          return (
            <section key={g.title} className="mb-4 break-inside-avoid rounded-2xl border border-line bg-raised p-5">
              <h3 className={`text-sm font-semibold ${kept ? "" : "text-muted"}`}>{g.title}</h3>
              <ul className="mt-3 space-y-3">
                {g.stories.map((s) => (
                  <li key={s.text} className={`text-sm leading-snug ${s.mvp ? "" : "text-muted"}`}>
                    {s.text}
                    {!s.mvp && (
                      <span className="ml-2 inline-block rounded-full border border-dashed border-line px-2 py-0.5 align-middle text-[10px] whitespace-nowrap">
                        Later
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
