"use client";

import { useState } from "react";
import type { StoryMap as StoryMapData } from "@/projects";

/**
 * A user story map: what each persona sets out to do across the top, the
 * steps under each task, and every story below. The line through the stories
 * is the MVP cut, so what shipped first sits above it. The map scrolls
 * sideways because the real ones are wide; "MVP only" hides everything below
 * the line to show how much was cut.
 */
export function StoryMap({ maps }: { maps: StoryMapData[] }) {
  const [active, setActive] = useState(0);
  const [mvpOnly, setMvpOnly] = useState(false);
  const m = maps[active];
  const steps = m.tasks.flatMap((t) => t.steps);
  const stories = steps.reduce((n, s) => n + s.stories.length, 0);
  const inMvp = steps.reduce((n, s) => n + s.stories.filter((x) => x.mvp).length, 0);

  return (
    <div className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label="Story maps" className="flex flex-wrap gap-2">
          {maps.map((it, i) => (
            <button
              key={it.persona}
              type="button"
              role="tab"
              id={`story-tab-${i}`}
              aria-selected={i === active}
              aria-controls="story-map"
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
        {m.tasks.length} tasks, {steps.length} steps, {stories} stories. <span className="font-medium text-fg">{inMvp} made the MVP.</span>{" "}
        <span className="md:hidden">Scroll sideways to see the whole map.</span>
      </p>

      <div
        id="story-map"
        role="tabpanel"
        aria-labelledby={`story-tab-${active}`}
        tabIndex={0}
        className="mt-4 overflow-x-auto rounded-3xl border border-line bg-raised p-4 md:p-6"
      >
        <div className="flex w-max gap-3">
          {m.tasks.map((t) => (
            <div key={t.title} className="flex flex-col gap-3">
              <div className="rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-on-accent">{t.title}</div>
              <div className="flex gap-3">
                {t.steps.map((s) => {
                  const above = s.stories.filter((x) => x.mvp);
                  const below = s.stories.filter((x) => !x.mvp);
                  return (
                    <div key={s.title} className="flex w-44 flex-col gap-2">
                      <div className="min-h-14 rounded-xl border border-accent/40 bg-accent-soft px-3 py-2 text-sm font-medium">
                        {s.title}
                      </div>
                      {above.map((x) => (
                        <Story key={x.text} text={x.text} mvp />
                      ))}
                      <div aria-hidden className="my-1 border-t-2 border-dashed border-accent" />
                      {!mvpOnly && below.map((x) => <Story key={x.text} text={x.text} />)}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 flex items-center gap-2 text-xs text-muted">
        <span aria-hidden className="inline-block w-6 border-t-2 border-dashed border-accent" />
        The MVP line. Stories above it shipped first.
      </p>
    </div>
  );
}

function Story({ text, mvp }: { text: string; mvp?: boolean }) {
  return (
    <div
      className={`rounded-lg border px-3 py-2 text-xs leading-snug ${
        mvp ? "border-line bg-bg" : "border-dashed border-line text-muted"
      }`}
    >
      {mvp && <span className="sr-only">MVP: </span>}
      {text}
    </div>
  );
}
