"use client";

import { useState } from "react";
import type { StoryMap as StoryMapData, StoryTasks } from "@/projects";

const count = (tasks: StoryTasks) => {
  const steps = tasks.flatMap((t) => t.steps);
  return {
    tasks: tasks.length,
    steps: steps.length,
    stories: steps.reduce((n, s) => n + s.stories.length, 0),
    mvp: steps.reduce((n, s) => n + s.stories.filter((x) => x.mvp).length, 0),
  };
};

/**
 * A user story map: what each persona sets out to do across the top, the
 * steps under each task, and every story below. The line through the stories
 * is the MVP cut, so what shipped first sits above it. Each persona has the
 * full map and the cut-down one, with the tasks a first release didn't need
 * taken out. The map scrolls sideways because the real ones are wide; "MVP
 * only" hides everything below the line.
 */
export function StoryMap({ maps }: { maps: StoryMapData[] }) {
  const [active, setActive] = useState(0);
  const [view, setView] = useState<"full" | "cut">("full");
  const [mvpOnly, setMvpOnly] = useState(false);
  const m = maps[active];
  const tasks = m[view];
  const n = count(tasks);
  const full = count(m.full);

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
        <div className="flex flex-wrap items-center gap-4">
        <div role="radiogroup" aria-label="Which map" className="inline-flex rounded-full border border-line p-1 text-sm">
          {(
            [
              ["full", "Full map"],
              ["cut", "Cut down"],
            ] as const
          ).map(([v, label]) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={view === v}
              onClick={() => setView(v)}
              className={`rounded-full px-3 py-1 transition-colors ${view === v ? "bg-fg text-bg" : "text-muted hover:text-fg"}`}
            >
              {label}
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
      </div>

      <p className="mt-5 text-sm text-muted">
        {n.tasks} tasks, {n.steps} steps, {n.stories} stories.{" "}
        {view === "cut" && <>Cut down from {full.tasks} tasks and {full.stories} stories. </>}
        <span className="font-medium text-fg">{n.mvp} made the MVP.</span>{" "}
        <span className="md:hidden">Scroll sideways to see the whole map.</span>
      </p>

      <div
        id="story-map"
        role="tabpanel"
        aria-labelledby={`story-tab-${active}`}
        tabIndex={0}
        className="relative mt-4 overflow-x-auto rounded-3xl border border-line bg-raised p-4 md:p-6"
      >
        <div className="flex w-max gap-3">
          {tasks.map((t) => (
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
