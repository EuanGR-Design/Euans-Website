"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { cardInfo, eras, projectHref, projectImage, projects, type Era, type Project } from "@/projects";
import { ProjectCard } from "./ProjectCard";
import { ProjectCarousel } from "./ProjectCarousel";
import { ProjectLink } from "./ProjectTransition";

const filters: { id: Era | "all"; label: string }[] = [
  { id: "all", label: "All" },
  ...eras.map((e) => ({ id: e.id, label: e.label })),
];

const views = ["list", "grid", "carousel"] as const;
type View = (typeof views)[number];

export function WorkGrid() {
  const router = useRouter();
  const params = useSearchParams();
  const current = (filters.find((f) => f.id === params.get("era"))?.id ?? "all") as Era | "all";
  const view = (views.find((v) => v === params.get("view")) ?? "grid") as View;
  const shown = eras.filter((e) => current === "all" || e.id === current);
  const flat = shown.flatMap((e) => projects.filter((p) => p.era === e.id));

  // Both choices live in the URL, so a link opens the same view.
  const set = (key: "era" | "view", value: string, fallback: string) => {
    const next = new URLSearchParams(params.toString());
    if (value === fallback) next.delete(key);
    else next.set(key, value);
    const q = next.toString();
    router.replace(q ? `/work?${q}` : "/work", { scroll: false });
  };

  return (
    <>
      <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter projects" className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={current === f.id}
              onClick={() => set("era", f.id, "all")}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                current === f.id ? "border-fg bg-fg text-bg" : "border-line text-muted hover:text-fg"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div role="group" aria-label="View projects as" className="flex items-center gap-1 self-start rounded-full border border-line p-1">
          <span className="eyebrow hidden px-2 sm:inline">View</span>
          {views.map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => set("view", v, "grid")}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                view === v ? "bg-fg text-bg" : "text-muted hover:text-fg"
              }`}
            >
              <ViewIcon view={v} />
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "grid" && (
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
      )}

      {view === "list" && <ProjectList list={flat} />}
      {view === "carousel" && <ProjectCarousel key={current} list={flat} />}
    </>
  );
}

/** One row per project, like a directory: number, image, name, era and tags. */
function ProjectList({ list }: { list: Project[] }) {
  return (
    <ol className="mt-14 border-t border-line">
      {list.map((p, i) => {
        const img = projectImage(p);
        const era = eras.find((e) => e.id === p.era);
        const row = (
          <>
            <span className="font-mono text-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
            <div data-cover className="relative aspect-[4/3] w-20 overflow-hidden rounded-lg bg-gradient-to-br from-accent/45 to-raised md:w-28">
              {img?.src && (
                <Image
                  src={img.src}
                  alt=""
                  fill
                  sizes="112px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold tracking-[-0.02em] md:text-2xl">{p.title}</h3>
              <p className="mt-0.5 truncate text-sm text-muted">{p.summary}</p>
            </div>
            <ul className="hidden flex-wrap justify-end gap-1.5 lg:flex">
              {p.tags.slice(0, 3).map((t) => (
                <li key={t} className="rounded-full bg-fg/[0.06] px-2.5 py-1 text-xs font-medium text-fg/80">
                  {t}
                </li>
              ))}
            </ul>
            <span className="hidden text-right text-sm text-muted sm:block">
              {p.comingSoon ? "Coming soon" : [era?.label, p.year].filter(Boolean).join(" · ")}
            </span>
          </>
        );
        const cls =
          "group grid grid-cols-[2rem_auto_1fr] items-center gap-4 border-b border-line py-4 sm:grid-cols-[2rem_auto_1fr_10rem] md:gap-6 md:py-5 lg:grid-cols-[2rem_auto_1fr_auto_10rem]";
        return (
          <li key={p.slug}>
            {p.comingSoon ? (
              <div className={`${cls} opacity-60`}>{row}</div>
            ) : (
              <ProjectLink card={cardInfo(p)} href={projectHref(p)} className={cls}>
                {row}
              </ProjectLink>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function ViewIcon({ view }: { view: View }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
      {view === "list" && <path d="M2 4h12M2 8h12M2 12h12" />}
      {view === "grid" && (
        <>
          <rect x="2" y="2" width="5" height="5" rx="1" />
          <rect x="9" y="2" width="5" height="5" rx="1" />
          <rect x="2" y="9" width="5" height="5" rx="1" />
          <rect x="9" y="9" width="5" height="5" rx="1" />
        </>
      )}
      {view === "carousel" && (
        <>
          <rect x="4" y="3" width="8" height="10" rx="1" />
          <path d="M1.5 5v6M14.5 5v6" />
        </>
      )}
    </svg>
  );
}
