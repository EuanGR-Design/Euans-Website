"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { eras, projects, type Era } from "@/projects";
import { ProjectCard } from "./ProjectCard";

const filters: { id: Era | "all"; label: string }[] = [
  { id: "all", label: "All" },
  ...eras.map((e) => ({ id: e.id, label: e.label })),
];

export function WorkGrid() {
  const router = useRouter();
  const params = useSearchParams();
  const current = (filters.find((f) => f.id === params.get("era"))?.id ?? "all") as Era | "all";
  const shown = eras.filter((e) => current === "all" || e.id === current);

  const pick = (id: Era | "all") =>
    router.replace(id === "all" ? "/work" : `/work?era=${id}`, { scroll: false });

  return (
    <>
      <div
        role="group"
        aria-label="Filter projects"
        className="mt-10 flex gap-2 overflow-x-auto pb-1"
      >
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={current === f.id}
            onClick={() => pick(f.id)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
              current === f.id
                ? "border-fg bg-fg text-bg"
                : "border-line text-muted hover:text-fg"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-14 space-y-20 md:space-y-28">
        {shown.map((era) => {
          const list = projects.filter((p) => p.era === era.id);
          return (
            <section key={era.id} aria-labelledby={`era-${era.id}`}>
              <div className="flex flex-col justify-between gap-2 border-b border-line pb-5 md:flex-row md:items-end">
                <div>
                  <h2 id={`era-${era.id}`} className="text-2xl font-semibold tracking-tight md:text-3xl">
                    {era.label}
                  </h2>
                  <p className="mt-1 text-sm text-muted">{era.blurb}</p>
                </div>
                <span className="font-mono text-sm text-muted">{era.when}</span>
              </div>
              <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((p) => (
                  <ProjectCard key={p.slug} p={p} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
