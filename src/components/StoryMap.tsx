"use client";

import { useState } from "react";
import type { StoryMap as StoryMapData, StoryPriority, StoryTasks } from "@/projects";

// MoSCoW, as on the scoped maps. Must have is the MVP that shipped; should and
// could have were scoped for later versions. The theme is one orange, so the
// bands differ by fill and border rather than shade: tinted, outlined, dashed,
// then plain text. The key uses the same card styles as the map.
const BANDS: { key: StoryPriority; label: string; when: string; card: string }[] = [
  { key: "must", label: "Must have", when: "the MVP", card: "border border-accent/60 bg-accent-soft" },
  { key: "should", label: "Should have", when: "a next version", card: "border border-accent/60 bg-raised" },
  { key: "could", label: "Could have", when: "a later version", card: "border border-dashed border-accent/60 bg-raised" },
  { key: "wont", label: "Won't have", when: "not planned", card: "border border-line text-muted" },
];
const order = (p?: StoryPriority) => BANDS.findIndex((b) => b.key === p);

const count = (tasks: StoryTasks) => {
  const steps = tasks.flatMap((t) => t.steps);
  return {
    tasks: tasks.length,
    steps: steps.length,
    stories: steps.reduce((n, s) => n + s.stories.length, 0),
    mvp: steps.reduce((n, s) => n + s.stories.filter((x) => x.mvp).length, 0),
    // Only the scoped maps sort stories past must have.
    scoped: steps.some((s) => s.stories.some((x) => x.priority && x.priority !== "must")),
    band: (k: StoryPriority) => steps.reduce((n, s) => n + s.stories.filter((x) => x.priority === k).length, 0),
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
  // A band picked in the key; every other band fades so it stands out.
  const [focus, setFocus] = useState<StoryPriority | null>(null);
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
        {n.scoped ? (
          <>
            <span className="font-medium text-fg">{n.band("must")} must have</span>, {n.band("should")} should have, {n.band("could")} could
            have and {n.band("wont")} won&apos;t have.{" "}
          </>
        ) : (
          <>
            <span className="font-medium text-fg">{n.mvp} made the MVP.</span>{" "}
          </>
        )}
        <span className="md:hidden">Scroll sideways to see the whole map.</span>
      </p>

      <div
        id="story-map"
        role="tabpanel"
        aria-labelledby={`story-tab-${active}`}
        tabIndex={0}
        className={`relative mt-4 overflow-x-auto rounded-3xl border border-line p-4 md:p-6 ${n.scoped ? "bg-bg" : "bg-raised"}`}
      >
        <div className="flex w-max gap-3">
          {tasks.map((t) => (
            <div key={t.title} className="flex flex-col gap-3">
              <TaskTitle title={t.title} priority={n.scoped ? t.priority : undefined} focus={focus} />
              <div className="flex gap-3">
                {t.steps.map((s) => {
                  const above = s.stories.filter((x) => x.mvp);
                  const below = s.stories.filter((x) => !x.mvp).sort((a, b) => order(a.priority) - order(b.priority));
                  return (
                    <div key={s.title} className="flex w-44 flex-col gap-2">
                      <div
                        className={`min-h-14 px-3 py-2 text-sm font-medium ${
                          n.scoped ? "border-b-2 border-fg/15" : "rounded-xl border border-accent/40 bg-accent-soft"
                        }`}
                      >
                        {s.title}
                      </div>
                      {above.map((x) => (
                        <Story key={x.text} text={x.text} mvp priority={n.scoped ? x.priority : undefined} focus={focus} />
                      ))}
                      {/* On a scoped map must have is the MVP, so its tint marks the cut and a gap is enough. */}
                      <div aria-hidden className={n.scoped ? "h-2" : "my-1 border-t-2 border-dashed border-accent"} />
                      {!mvpOnly &&
                        below.map((x) => (
                          <Story key={x.text} text={x.text} priority={n.scoped ? x.priority : undefined} focus={focus} />
                        ))}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted">
        {!n.scoped && (
          <span className="flex items-center gap-2">
            <span aria-hidden className="inline-block w-6 border-t-2 border-dashed border-accent" />
            The MVP line. Stories above it shipped first.
          </span>
        )}
        {n.scoped && (
          <div role="group" aria-label="Highlight a band" className="flex basis-full flex-wrap items-center gap-2">
            {BANDS.map((b) => (
              <button
                key={b.key}
                type="button"
                aria-pressed={focus === b.key}
                onClick={() => setFocus((f) => (f === b.key ? null : b.key))}
                className={`rounded-lg px-3 py-1.5 text-left text-xs transition-opacity ${b.card} ${
                  focus && focus !== b.key ? "opacity-40" : ""
                } ${focus === b.key ? "ring-1 ring-fg/40 ring-offset-2 ring-offset-bg" : ""}`}
              >
                <span className="font-medium text-fg">{b.label}</span> <span className="text-muted">{b.when}</span>
              </button>
            ))}
            <span className="ml-1">Tasks use the same key. Select one to highlight it.</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Story({
  text,
  mvp,
  priority,
  focus,
}: {
  text: string;
  mvp?: boolean;
  priority?: StoryPriority;
  focus?: StoryPriority | null;
}) {
  const band = BANDS.find((b) => b.key === priority);
  if (band)
    return (
      <div
        className={`rounded-lg px-3 py-2 text-xs leading-snug transition-opacity ${band.card} ${
          focus && focus !== band.key ? "opacity-20" : ""
        }`}
      >
        <span className="sr-only">{band.label}: </span>
        {text}
      </div>
    );
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

// On a scoped map the task's own band says whether the task as a whole can be
// done. A won't have task can still hold must have stories: those actions are
// in the MVP, the task they'd add up to isn't.
function TaskTitle({ title, priority, focus }: { title: string; priority?: StoryPriority; focus?: StoryPriority | null }) {
  const band = BANDS.find((b) => b.key === priority);
  return (
    <div
      className={`rounded-xl px-3 py-2 text-sm font-semibold transition-opacity ${
        band?.card ?? "bg-accent text-on-accent"
      } ${band && focus && focus !== band.key ? "opacity-20" : ""}`}
    >
      {band && <span className="sr-only">{band.label}: </span>}
      {title}
    </div>
  );
}
