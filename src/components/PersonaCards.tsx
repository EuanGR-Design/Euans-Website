"use client";

import { useState } from "react";
import type { PersonaCard } from "@/projects";

const LEVELS = ["Low", "Medium", "High"] as const;

/**
 * Persona cards in the usual format: who they are on a coloured panel, then
 * what they want, what gets in their way and how they like to get help. One
 * card shows at a time, picked from a row of everyone, so a long list of
 * personas reads as a set rather than a wall.
 */
export function PersonaCards({ items }: { items: PersonaCard[] }) {
  const [active, setActive] = useState(0);
  const p = items[active];
  const initials = p.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <div className="mt-12">
      <div role="tablist" aria-label="Personas" className="flex flex-wrap gap-2">
        {items.map((it, i) => (
          <button
            key={it.name}
            type="button"
            role="tab"
            id={`persona-tab-${i}`}
            aria-selected={i === active}
            aria-controls="persona-card"
            onClick={() => setActive(i)}
            className={`inline-flex items-center gap-2 rounded-full border py-1.5 pr-4 pl-1.5 text-sm transition-colors ${
              i === active ? "border-accent bg-accent-soft" : "border-line hover:border-fg/30"
            }`}
          >
            <span
              aria-hidden
              className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                i === active ? "bg-accent text-on-accent" : "bg-raised"
              }`}
            >
              {it.name[0]}
            </span>
            <span className="font-medium">{it.name}</span>
            <span className="text-muted">{it.label}</span>
            {it.mvp && <span className="rounded-full bg-fg px-2 py-0.5 text-[11px] font-medium text-bg">MVP</span>}
          </button>
        ))}
      </div>

      <article
        id="persona-card"
        role="tabpanel"
        aria-labelledby={`persona-tab-${active}`}
        className="mt-6 grid overflow-hidden rounded-3xl border border-line bg-raised md:grid-cols-[minmax(0,5fr)_minmax(0,9fr)]"
      >
        <div className="flex flex-col gap-5 bg-accent p-7 text-on-accent md:p-9">
          <div className="flex items-center gap-4">
            <span aria-hidden className="flex size-16 items-center justify-center rounded-full bg-on-accent/10 text-2xl font-bold">
              {initials}
            </span>
            <div>
              <p className="text-sm font-medium opacity-80">{p.label}</p>
              <h3 className="text-4xl font-bold tracking-[-0.03em]">{p.name}</h3>
            </div>
          </div>
          <p className="text-lg font-semibold">
            {p.age}, {p.role}
          </p>
          <p className="leading-relaxed opacity-90">{p.bio}</p>
          <blockquote className="mt-auto border-t border-on-accent/20 pt-5 text-xl leading-snug font-semibold">
            “{p.quote}”
          </blockquote>
        </div>

        <div className="grid gap-8 p-7 md:p-9">
          <div className="grid gap-8 sm:grid-cols-2">
            <List title="Goals" items={p.goals} />
            <List title="Frustrations" items={p.frustrations} />
          </div>
          <div className="grid gap-8 border-t border-line pt-7 sm:grid-cols-2">
            <div>
              <p className="eyebrow">Confidence with tech</p>
              <div className="mt-3 inline-flex overflow-hidden rounded-full border border-line text-sm">
                {LEVELS.map((l) => (
                  <span
                    key={l}
                    className={`px-4 py-1.5 ${l === p.tech ? "bg-accent font-medium text-on-accent" : "text-muted"}`}
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow">How they like to get help</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {p.help.map((h) => (
                  <li key={h} className="rounded-full border border-line px-3 py-1 text-sm">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-3 space-y-3 leading-relaxed text-fg/80">
        {items.map((t) => (
          <li key={t} className="flex gap-3">
            <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
